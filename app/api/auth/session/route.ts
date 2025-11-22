import { NextResponse } from "next/server";
import type { User, ApiResponse } from "@/types/database";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

// GET /api/auth/session - Get mock user session
export async function GET() {
  try {
    // Return mock user session
    // In production, this would verify actual authentication and return real user data
    const mockUser: User = {
      id: MOCK_USER_ID,
      email: "demo@outlink.bio",
      name: "Demo User",
      avatar_url: "https://i.pravatar.cc/150?u=demo@outlink.bio",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<User>>({
      data: mockUser,
      message: "Mock session retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



