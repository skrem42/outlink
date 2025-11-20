import { NextRequest, NextResponse } from "next/server";
import { namecheapClient } from "@/lib/namecheap/client";
import type { ApiResponse } from "@/types/database";
import type { DomainAvailability } from "@/lib/namecheap/client";

interface DomainSearchRequest {
  domains: string[];
}

// POST /api/domains/search - Search for domain availability
export async function POST(request: NextRequest) {
  try {
    const body: DomainSearchRequest = await request.json();

    // Validate request
    if (!body.domains || !Array.isArray(body.domains) || body.domains.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Domain list is required" },
        { status: 400 }
      );
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    const invalidDomains = body.domains.filter(d => !domainRegex.test(d));
    
    if (invalidDomains.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        { error: `Invalid domain format: ${invalidDomains.join(', ')}` },
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

    // Check domain availability
    const results = await namecheapClient.checkDomainAvailability(body.domains);

    // Get pricing for available domains
    const resultsWithPricing = await Promise.all(
      results.map(async (result) => {
        if (result.available) {
          try {
            const pricing = await namecheapClient.getDomainPricing(result.domain);
            return {
              ...result,
              price: pricing.register,
              renewPrice: pricing.renew,
            };
          } catch (error) {
            // If pricing fails, use the estimated price
            return result;
          }
        }
        return result;
      })
    );

    return NextResponse.json<ApiResponse<DomainAvailability[]>>({
      data: resultsWithPricing,
      message: `Checked ${body.domains.length} domain(s)`,
    });
  } catch (error) {
    console.error('Domain search error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { 
        error: error instanceof Error 
          ? error.message 
          : "Failed to search domains. Please try again." 
      },
      { status: 500 }
    );
  }
}

