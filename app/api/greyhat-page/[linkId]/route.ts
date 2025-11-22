import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  GreyhatPageSettings,
  UpdateGreyhatPageSettingsRequest,
  ApiResponse,
} from "@/types/database";

// GET /api/greyhat-page/[linkId] - Fetch greyhat page settings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const supabase = await createClient();
    const { linkId } = await params;

    const { data, error } = await supabase
      .from("greyhat_page_settings")
      .select("*")
      .eq("link_id", linkId)
      .single();

    if (error) {
      // If no settings found, return null (not an error)
      if (error.code === "PGRST116") {
        return NextResponse.json<ApiResponse<null>>({ data: null });
      }
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<GreyhatPageSettings>>({ data });
  } catch (error) {
    console.error("Error fetching greyhat page settings:", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/greyhat-page/[linkId] - Update or create greyhat page settings
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const supabase = await createClient();
    const { linkId } = await params;
    const body: UpdateGreyhatPageSettingsRequest = await request.json();

    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from("greyhat_page_settings")
      .select("id")
      .eq("link_id", linkId)
      .single();

    let data;
    let error;

    if (existingSettings) {
      // Update existing settings
      const result = await supabase
        .from("greyhat_page_settings")
        .update(body)
        .eq("link_id", linkId)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Create new settings
      const result = await supabase
        .from("greyhat_page_settings")
        .insert({
          link_id: linkId,
          ...body,
        })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<GreyhatPageSettings>>({ data });
  } catch (error) {
    console.error("Error updating greyhat page settings:", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

