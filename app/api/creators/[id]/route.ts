import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Creator, UpdateCreatorRequest, ApiResponse } from "@/types/database";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

// GET /api/creators/[id] - Fetch single creator
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from("creators")
      .select("*")
      .eq("id", id)
      .eq("user_id", MOCK_USER_ID)
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Creator>>({ data: data as Creator });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/creators/[id] - Update creator
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body: UpdateCreatorRequest = await request.json();

    // Check if creator exists and belongs to user
    const { data: existingCreator } = await supabase
      .from("creators")
      .select("id")
      .eq("id", id)
      .eq("user_id", MOCK_USER_ID)
      .single();

    if (!existingCreator) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("creators")
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

    return NextResponse.json<ApiResponse<Creator>>({
      data: data as Creator,
      message: "Creator updated successfully",
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/creators/[id] - Delete creator
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { error } = await supabase
      .from("creators")
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
      message: "Creator deleted successfully",
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


