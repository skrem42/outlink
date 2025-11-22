import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  Domain,
  CreateDomainRequest,
  ApiResponse,
} from "@/types/database";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

// GET /api/domains - Fetch all domains for user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("domains")
      .select("*")
      .eq("user_id", MOCK_USER_ID)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Domain[]>>({ data: data as Domain[] });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/domains - Create/register new domain
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: CreateDomainRequest = await request.json();

    // Validate required fields
    if (!body.domain) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Check if domain already exists
    const { data: existingDomain } = await supabase
      .from("domains")
      .select("id")
      .eq("domain", body.domain)
      .single();

    if (existingDomain) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "This domain is already registered" },
        { status: 409 }
      );
    }

    const domainData = {
      user_id: MOCK_USER_ID,
      domain: body.domain,
      status: body.status || "pending",
      verified: body.verified || false,
      ssl_enabled: body.ssl_enabled || false,
      registered_date: body.registered_date || new Date().toISOString(),
      expiry_date: body.expiry_date || null,
      registrar: body.registrar || null,
    };

    const { data, error } = await supabase
      .from("domains")
      .insert(domainData)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Domain>>(
      { data: data as Domain, message: "Domain created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



