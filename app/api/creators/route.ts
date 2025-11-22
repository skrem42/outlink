import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  Creator,
  CreateCreatorRequest,
  ApiResponse,
} from "@/types/database";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

// GET /api/creators - Fetch all creators for user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("creators")
      .select("*")
      .eq("user_id", MOCK_USER_ID)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Creator[]>>({ data: data as Creator[] });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/creators - Create new creator
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: CreateCreatorRequest = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const creatorData = {
      user_id: MOCK_USER_ID,
      name: body.name,
      email: body.email || null,
      avatar_url: body.avatar_url || null,
      tier: body.tier || "free",
      status: body.status || "active",
    };

    const { data, error } = await supabase
      .from("creators")
      .insert(creatorData)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Creator>>(
      { data: data as Creator, message: "Creator created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



