import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Link, UpdateLinkRequest, ApiResponse } from "@/types/database";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

// GET /api/links/[id] - Fetch single link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from("links")
      .select(`
        *,
        creator:creators(*),
        domain_data:domains(*)
      `)
      .eq("id", id)
      .eq("user_id", MOCK_USER_ID)
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Link>>({ data: data as Link });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/links/[id] - Update link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body: UpdateLinkRequest = await request.json();

    // Check if link exists and belongs to user
    const { data: existingLink } = await supabase
      .from("links")
      .select("id")
      .eq("id", id)
      .eq("user_id", MOCK_USER_ID)
      .single();

    if (!existingLink) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // If path or domain is being updated, check for conflicts
    if (body.path || body.domain) {
      const { data: conflictingLink } = await supabase
        .from("links")
        .select("id")
        .eq("domain", body.domain || existingLink.domain)
        .eq("path", body.path || existingLink.path)
        .neq("id", id)
        .single();

      if (conflictingLink) {
        return NextResponse.json<ApiResponse<null>>(
          { error: "A link with this domain and path already exists" },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from("links")
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

    return NextResponse.json<ApiResponse<Link>>({
      data: data as Link,
      message: "Link updated successfully",
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/links/[id] - Delete link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { error } = await supabase
      .from("links")
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
      message: "Link deleted successfully",
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


