import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { RealtimeData, ApiResponse } from "@/types/database";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

// GET /api/analytics/realtime - Fetch real-time analytics data
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const link_id = searchParams.get("link_id");

    // Get events from last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    // Build query for recent events
    let recentEventsQuery = supabase
      .from("analytics_events")
      .select(`
        *,
        link:links!inner(user_id, domain, path)
      `)
      .eq("link.user_id", MOCK_USER_ID)
      .gte("timestamp", oneHourAgo)
      .order("timestamp", { ascending: false })
      .limit(50);

    if (link_id) {
      recentEventsQuery = recentEventsQuery.eq("link_id", link_id);
    }

    const { data: recentEvents, error: recentError } = await recentEventsQuery;

    if (recentError) {
      return NextResponse.json<ApiResponse<null>>(
        { error: recentError.message },
        { status: 500 }
      );
    }

    // Count active visitors (unique IPs in last 5 minutes)
    const activeVisitorIps = new Set(
      recentEvents
        ?.filter(e => new Date(e.timestamp) >= new Date(fiveMinutesAgo))
        .map(e => e.ip_address)
        .filter(Boolean)
    );

    // Count clicks and conversions in last hour
    const clicksLastHour = recentEvents?.filter(e => e.event_type === "click").length || 0;
    const conversionsLastHour = recentEvents?.filter(e => e.event_type === "conversion").length || 0;

    const realtimeData: RealtimeData = {
      active_visitors: activeVisitorIps.size,
      recent_events: recentEvents || [],
      clicks_last_hour: clicksLastHour,
      conversions_last_hour: conversionsLastHour,
    };

    return NextResponse.json<ApiResponse<RealtimeData>>({ data: realtimeData });
  } catch (error) {
    console.error("Realtime analytics API error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

