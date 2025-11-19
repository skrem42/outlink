import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  LandingPageSettings,
  UpdateLandingPageSettingsRequest,
} from "@/types/database";

// GET /api/landing-page/[linkId] - Get landing page settings for a link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const supabase = await createClient();
    const { linkId } = await params;

    // Fetch landing page settings
    const { data, error } = await supabase
      .from("landing_page_settings")
      .select("*")
      .eq("link_id", linkId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No settings found, return null
        return NextResponse.json({ data: null });
      }
      console.error("Error fetching landing page settings:", error);
      return NextResponse.json(
        { error: "Failed to fetch landing page settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in GET /api/landing-page/[linkId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/landing-page/[linkId] - Update landing page settings
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const supabase = await createClient();
    const { linkId } = await params;
    const body: UpdateLandingPageSettingsRequest = await request.json();

    // Check if settings exist
    const { data: existing } = await supabase
      .from("landing_page_settings")
      .select("id")
      .eq("link_id", linkId)
      .single();

    let result;

    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from("landing_page_settings")
        .update(body)
        .eq("link_id", linkId)
        .select()
        .single();

      if (error) {
        console.error("Error updating landing page settings:", error);
        return NextResponse.json(
          { error: "Failed to update landing page settings" },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from("landing_page_settings")
        .insert({ link_id: linkId, ...body })
        .select()
        .single();

      if (error) {
        console.error("Error creating landing page settings:", error);
        return NextResponse.json(
          { error: "Failed to create landing page settings" },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error in PATCH /api/landing-page/[linkId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/landing-page/[linkId] - Delete landing page settings
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const supabase = await createClient();
    const { linkId } = await params;

    const { error } = await supabase
      .from("landing_page_settings")
      .delete()
      .eq("link_id", linkId);

    if (error) {
      console.error("Error deleting landing page settings:", error);
      return NextResponse.json(
        { error: "Failed to delete landing page settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Landing page settings deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/landing-page/[linkId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

