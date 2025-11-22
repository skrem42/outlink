import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  Link,
  CreateLinkRequest,
  ApiResponse,
} from "@/types/database";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

// GET /api/links - Fetch all links for user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    
    const creator_id = searchParams.get("creator_id");
    const domain = searchParams.get("domain");
    const status = searchParams.get("status");

    let query = supabase
      .from("links")
      .select(`
        *,
        creator:creators(*),
        domain_data:domains(*)
      `)
      .eq("user_id", MOCK_USER_ID)
      .order("created_at", { ascending: false });

    if (creator_id) {
      query = query.eq("creator_id", creator_id);
    }

    if (domain) {
      query = query.eq("domain", domain);
    }

    if (status !== null) {
      query = query.eq("status", status === "true");
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Link[]>>({ data: data as Link[] });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/links - Create new link
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: CreateLinkRequest = await request.json();

    // Validate required fields
    if (!body.link_type || !body.domain || !body.path || !body.destination_url) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if path already exists for this domain
    const { data: existingLink } = await supabase
      .from("links")
      .select("id")
      .eq("domain", body.domain)
      .eq("path", body.path)
      .single();

    if (existingLink) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "A link with this domain and path already exists" },
        { status: 409 }
      );
    }

    // Get or create domain_id if domain is provided
    let domain_id = body.domain_id;
    if (!domain_id) {
      const { data: domainData } = await supabase
        .from("domains")
        .select("id")
        .eq("domain", body.domain)
        .eq("user_id", MOCK_USER_ID)
        .single();

      domain_id = domainData?.id || null;
    }

    const linkData = {
      user_id: MOCK_USER_ID,
      link_type: body.link_type,
      platform: body.platform || null,
      creator_id: body.creator_id || null,
      domain_id: domain_id,
      domain: body.domain,
      path: body.path,
      destination_url: body.destination_url,
      title: body.title || null,
      description: body.description || null,
      status: body.status !== undefined ? body.status : true,
    };

    const { data, error } = await supabase
      .from("links")
      .insert(linkData)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Link>>(
      { data: data as Link, message: "Link created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



