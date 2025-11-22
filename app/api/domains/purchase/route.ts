import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { namecheapClient } from "@/lib/namecheap/client";
import type { ApiResponse, Domain } from "@/types/database";
import type { PurchaseContactInfo } from "@/lib/namecheap/client";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

interface DomainPurchaseRequest {
  domain: string;
  years?: number;
  contactInfo?: PurchaseContactInfo;
}

// POST /api/domains/purchase - Purchase a domain via Namecheap
export async function POST(request: NextRequest) {
  try {
    const body: DomainPurchaseRequest = await request.json();

    // Validate required fields
    if (!body.domain) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(body.domain)) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Invalid domain format" },
        { status: 400 }
      );
    }

    // Check if Namecheap is configured
    if (!namecheapClient.isConfigured()) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Namecheap API is not configured. Please set up environment variables." },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // Check if domain already exists in our database
    const { data: existingDomain } = await supabase
      .from("domains")
      .select("id")
      .eq("domain", body.domain)
      .single();

    if (existingDomain) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "This domain is already in your account" },
        { status: 409 }
      );
    }

    // First, check if domain is available
    const availability = await namecheapClient.checkDomainAvailability([body.domain]);
    
    if (!availability[0] || !availability[0].available) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "This domain is not available for purchase" },
        { status: 400 }
      );
    }

    // Purchase the domain through Namecheap
    const purchaseResult = await namecheapClient.purchaseDomain(
      body.domain,
      body.years || 1,
      body.contactInfo
    );

    if (!purchaseResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        { error: purchaseResult.error || "Failed to purchase domain" },
        { status: 500 }
      );
    }

    // Calculate expiry date (1 year from now by default)
    const years = body.years || 1;
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + years);

    // Store the domain in our database
    const domainData = {
      user_id: MOCK_USER_ID,
      domain: body.domain,
      status: "active" as const,
      verified: true,
      ssl_enabled: false,
      registered_date: new Date().toISOString(),
      expiry_date: expiryDate.toISOString(),
      registrar: "Namecheap",
      purchase_source: "namecheap",
      namecheap_order_id: purchaseResult.orderId || null,
      auto_renew: false,
    };

    const { data, error } = await supabase
      .from("domains")
      .insert(domainData)
      .select()
      .single();

    if (error) {
      console.error('Database error after purchase:', error);
      return NextResponse.json<ApiResponse<null>>(
        { 
          error: "Domain purchased but failed to save to database. Please contact support.",
          message: `Order ID: ${purchaseResult.orderId}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Domain & { purchaseDetails: typeof purchaseResult }>>(
      { 
        data: {
          ...(data as Domain),
          purchaseDetails: purchaseResult,
        },
        message: `Domain ${body.domain} purchased successfully!`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Domain purchase error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { 
        error: error instanceof Error 
          ? error.message 
          : "Failed to purchase domain. Please try again." 
      },
      { status: 500 }
    );
  }
}


