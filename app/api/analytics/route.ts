import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsData, ApiResponse } from "@/types/database";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

// GET /api/analytics - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    
    const link_id = searchParams.get("link_id");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const event_type = searchParams.get("event_type");

    // Build query for analytics events
    let eventsQuery = supabase
      .from("analytics_events")
      .select(`
        *,
        link:links!inner(user_id)
      `)
      .eq("link.user_id", MOCK_USER_ID);

    if (link_id) {
      eventsQuery = eventsQuery.eq("link_id", link_id);
    }

    if (start_date) {
      eventsQuery = eventsQuery.gte("timestamp", start_date);
    }

    if (end_date) {
      eventsQuery = eventsQuery.lte("timestamp", end_date);
    }

    if (event_type) {
      eventsQuery = eventsQuery.eq("event_type", event_type);
    }

    const { data: events, error: eventsError } = await eventsQuery.order("timestamp", { ascending: false });

    if (eventsError) {
      return NextResponse.json<ApiResponse<null>>(
        { error: eventsError.message },
        { status: 500 }
      );
    }

    // Calculate aggregate statistics
    const clicks = events?.filter((e) => e.event_type === "click").length || 0;
    const views = events?.filter((e) => e.event_type === "view").length || 0;
    const conversions = events?.filter((e) => e.event_type === "conversion").length || 0;

    // Calculate unique visitors (by IP address)
    const uniqueIps = new Set(events?.map((e) => e.ip_address).filter(Boolean));
    const unique_visitors = uniqueIps.size;

    // Calculate conversion rate
    const conversion_rate = clicks > 0 ? (conversions / clicks) * 100 : 0;

    // Group events by date for chart data
    const chartDataMap: Record<string, { clicks: number; views: number; conversions: number }> = {};
    
    events?.forEach((event) => {
      const date = new Date(event.timestamp).toISOString().split("T")[0];
      if (!chartDataMap[date]) {
        chartDataMap[date] = { clicks: 0, views: 0, conversions: 0 };
      }
      if (event.event_type === "click") chartDataMap[date].clicks++;
      if (event.event_type === "view") chartDataMap[date].views++;
      if (event.event_type === "conversion") chartDataMap[date].conversions++;
    });

    const chart_data = Object.entries(chartDataMap)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Mock some additional metrics for now
    const analyticsData: AnalyticsData = {
      total_clicks: clicks,
      total_views: views,
      total_conversions: conversions,
      unique_visitors,
      bounce_rate: 42.3, // Mock
      avg_session_duration: 272, // Mock (in seconds)
      conversion_rate,
      pages_per_session: 4.2, // Mock
      events: events || [],
      chart_data,
    };

    return NextResponse.json<ApiResponse<AnalyticsData>>({ data: analyticsData });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


