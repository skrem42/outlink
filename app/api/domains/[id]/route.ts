import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Domain, UpdateDomainRequest, ApiResponse } from "@/types/database";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

// GET /api/domains/[id] - Fetch single domain
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from("domains")
      .select("*")
      .eq("id", id)
      .eq("user_id", MOCK_USER_ID)
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Domain>>({ data: data as Domain });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/domains/[id] - Update domain
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body: UpdateDomainRequest = await request.json();

    // Check if domain exists and belongs to user
    const { data: existingDomain } = await supabase
      .from("domains")
      .select("id")
      .eq("id", id)
      .eq("user_id", MOCK_USER_ID)
      .single();

    if (!existingDomain) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("domains")
      .update(body)
      .eq("id", id)
      .eq("user_id", MOCK_USER_ID)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Domain>>({
      data: data as Domain,
      message: "Domain updated successfully",
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/domains/[id] - Delete domain
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check if domain has any connected links
    const { count } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("domain_id", id);

    if (count && count > 0) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Cannot delete domain with active links" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("domains")
      .delete()
      .eq("id", id)
      .eq("user_id", MOCK_USER_ID);

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<null>>({
      message: "Domain deleted successfully",
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



