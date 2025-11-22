import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { TrackEventRequest, ApiResponse } from "@/types/database";

// POST /api/analytics/track - Track analytics event (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: TrackEventRequest = await request.json();

    // Validate required fields
    if (!body.link_id || !body.event_type) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "link_id and event_type are required" },
        { status: 400 }
      );
    }

    // Verify link exists
    const { data: link } = await supabase
      .from("links")
      .select("id")
      .eq("id", body.link_id)
      .single();

    if (!link) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Get client info from request if not provided
    const ip_address = body.ip_address || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const user_agent = body.user_agent || request.headers.get("user-agent") || "unknown";
    const referrer = body.referrer || request.headers.get("referer") || null;

    // Detect device type from user agent
    let device_type = body.device_type;
    if (!device_type && user_agent) {
      if (/mobile/i.test(user_agent)) {
        device_type = "mobile";
      } else if (/tablet/i.test(user_agent)) {
        device_type = "tablet";
      } else {
        device_type = "desktop";
      }
    }

    const eventData = {
      link_id: body.link_id,
      event_type: body.event_type,
      ip_address,
      user_agent,
      referrer,
      country: body.country || null,
      city: body.city || null,
      device_type,
      browser: body.browser || null,
      os: body.os || null,
      screen_resolution: body.screen_resolution || null,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      session_id: body.session_id || null,
      is_bot: body.is_bot || false,
      page_load_time: body.page_load_time || null,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
    };

    const { data, error } = await supabase
      .from("analytics_events")
      .insert(eventData)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { data: { id: data.id }, message: "Event tracked successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



