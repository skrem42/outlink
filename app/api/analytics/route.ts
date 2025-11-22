import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsData, ApiResponse, GeographicData, DeviceBreakdown, BrowserBreakdown, OSBreakdown, ScreenResolutionData, UTMData, ReferrerData, HourlyPattern, FunnelStage, TrafficQuality, LinkPerformance } from "@/types/database";

const MOCK_USER_ID = process.env.MOCK_USER_ID || "00000000-0000-0000-0000-000000000000";

// GET /api/analytics - Fetch comprehensive analytics data
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
        link:links!inner(user_id, domain, path)
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

    // Calculate basic aggregate statistics
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

    // Calculate geographic data
    const geographicMap: Record<string, { clicks: number; conversions: number; cities: Record<string, { clicks: number; conversions: number }> }> = {};
    
    events?.forEach((event) => {
      if (event.country) {
        if (!geographicMap[event.country]) {
          geographicMap[event.country] = { clicks: 0, conversions: 0, cities: {} };
        }
        if (event.event_type === "click") geographicMap[event.country].clicks++;
        if (event.event_type === "conversion") geographicMap[event.country].conversions++;
        
        if (event.city) {
          if (!geographicMap[event.country].cities[event.city]) {
            geographicMap[event.country].cities[event.city] = { clicks: 0, conversions: 0 };
          }
          if (event.event_type === "click") geographicMap[event.country].cities[event.city].clicks++;
          if (event.event_type === "conversion") geographicMap[event.country].cities[event.city].conversions++;
        }
      }
    });

    const geographic_data: GeographicData[] = Object.entries(geographicMap).map(([country, data]) => ({
      country,
      country_code: country.substring(0, 2).toUpperCase(), // Simple approximation
      clicks: data.clicks,
      conversions: data.conversions,
      conversion_rate: data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0,
      cities: Object.entries(data.cities).map(([city, cityData]) => ({
        city,
        clicks: cityData.clicks,
        conversions: cityData.conversions,
      })).sort((a, b) => b.clicks - a.clicks),
    })).sort((a, b) => b.clicks - a.clicks);

    // Calculate device breakdown
    const deviceMap: Record<string, number> = {};
    const totalDeviceEvents = events?.length || 1;
    
    events?.forEach((event) => {
      const device = event.device_type || "unknown";
      deviceMap[device] = (deviceMap[device] || 0) + 1;
    });

    const device_breakdown: DeviceBreakdown[] = Object.entries(deviceMap).map(([device_type, count]) => ({
      device_type,
      count,
      percentage: (count / totalDeviceEvents) * 100,
    })).sort((a, b) => b.count - a.count);

    // Calculate browser breakdown
    const browserMap: Record<string, number> = {};
    
    events?.forEach((event) => {
      if (event.browser) {
        browserMap[event.browser] = (browserMap[event.browser] || 0) + 1;
      }
    });

    const browser_breakdown: BrowserBreakdown[] = Object.entries(browserMap).map(([browser, count]) => ({
      browser,
      version: null, // Can be extracted from user agent if needed
      count,
      percentage: (count / totalDeviceEvents) * 100,
    })).sort((a, b) => b.count - a.count);

    // Calculate OS breakdown
    const osMap: Record<string, number> = {};
    
    events?.forEach((event) => {
      if (event.os) {
        osMap[event.os] = (osMap[event.os] || 0) + 1;
      }
    });

    const os_breakdown: OSBreakdown[] = Object.entries(osMap).map(([os, count]) => ({
      os,
      count,
      percentage: (count / totalDeviceEvents) * 100,
    })).sort((a, b) => b.count - a.count);

    // Calculate screen resolution data
    const resolutionMap: Record<string, number> = {};
    
    events?.forEach((event) => {
      if (event.screen_resolution) {
        resolutionMap[event.screen_resolution] = (resolutionMap[event.screen_resolution] || 0) + 1;
      }
    });

    const screen_resolutions: ScreenResolutionData[] = Object.entries(resolutionMap).map(([resolution, count]) => ({
      resolution,
      count,
      percentage: (count / totalDeviceEvents) * 100,
    })).sort((a, b) => b.count - a.count);

    // Calculate UTM data
    const utmMap: Record<string, { clicks: number; conversions: number }> = {};
    
    events?.forEach((event) => {
      if (event.utm_source || event.utm_medium || event.utm_campaign) {
        const key = `${event.utm_source || 'none'}|${event.utm_medium || 'none'}|${event.utm_campaign || 'none'}`;
        if (!utmMap[key]) {
          utmMap[key] = { clicks: 0, conversions: 0 };
        }
        if (event.event_type === "click") utmMap[key].clicks++;
        if (event.event_type === "conversion") utmMap[key].conversions++;
      }
    });

    const utm_data: UTMData[] = Object.entries(utmMap).map(([key, data]) => {
      const [source, medium, campaign] = key.split('|');
      return {
        source,
        medium,
        campaign,
        clicks: data.clicks,
        conversions: data.conversions,
        conversion_rate: data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0,
      };
    }).sort((a, b) => b.clicks - a.clicks);

    // Calculate referrer data
    const referrerMap: Record<string, { clicks: number; conversions: number }> = {};
    
    events?.forEach((event) => {
      const ref = event.referrer || "direct";
      if (!referrerMap[ref]) {
        referrerMap[ref] = { clicks: 0, conversions: 0 };
      }
      if (event.event_type === "click") referrerMap[ref].clicks++;
      if (event.event_type === "conversion") referrerMap[ref].conversions++;
    });

    const referrer_data: ReferrerData[] = Object.entries(referrerMap).map(([referrer, data]) => ({
      referrer,
      clicks: data.clicks,
      conversions: data.conversions,
      is_direct: referrer === "direct",
    })).sort((a, b) => b.clicks - a.clicks);

    // Calculate hourly patterns
    const hourlyMap: Record<string, { clicks: number; conversions: number }> = {};
    
    events?.forEach((event) => {
      const date = new Date(event.timestamp);
      const hour = date.getUTCHours();
      const dayOfWeek = date.getUTCDay();
      const key = `${dayOfWeek}-${hour}`;
      
      if (!hourlyMap[key]) {
        hourlyMap[key] = { clicks: 0, conversions: 0 };
      }
      if (event.event_type === "click") hourlyMap[key].clicks++;
      if (event.event_type === "conversion") hourlyMap[key].conversions++;
    });

    const hourly_patterns: HourlyPattern[] = Object.entries(hourlyMap).map(([key, data]) => {
      const [day, hour] = key.split('-').map(Number);
      return {
        hour,
        day_of_week: day,
        clicks: data.clicks,
        conversions: data.conversions,
      };
    }).sort((a, b) => {
      if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week;
      return a.hour - b.hour;
    });

    // Calculate funnel stages
    const funnel_stages: FunnelStage[] = [
      {
        stage: 'view',
        count: views,
        dropoff_rate: views > 0 ? ((views - clicks) / views) * 100 : 0,
      },
      {
        stage: 'click',
        count: clicks,
        dropoff_rate: clicks > 0 ? ((clicks - conversions) / clicks) * 100 : 0,
      },
      {
        stage: 'conversion',
        count: conversions,
        dropoff_rate: 0,
      },
    ];

    // Calculate traffic quality
    const botEvents = events?.filter(e => e.is_bot).length || 0;
    const humanEvents = (events?.length || 0) - botEvents;
    const suspiciousIps = Array.from(uniqueIps).filter(ip => {
      const ipEvents = events?.filter(e => e.ip_address === ip).length || 0;
      return ipEvents > 50; // Simple heuristic
    });

    const traffic_quality: TrafficQuality = {
      total_traffic: events?.length || 0,
      bot_traffic: botEvents,
      human_traffic: humanEvents,
      bot_percentage: (events?.length || 0) > 0 ? (botEvents / (events?.length || 1)) * 100 : 0,
      suspicious_ips: suspiciousIps as string[],
      quality_score: (events?.length || 0) > 0 ? (humanEvents / (events?.length || 1)) * 100 : 100,
    };

    // Calculate link performance (if viewing all links)
    let link_performance: LinkPerformance[] = [];
    if (!link_id) {
      const { data: links, error: linksError } = await supabase
        .from("links")
        .select("id, domain, path, clicks")
        .eq("user_id", MOCK_USER_ID);

      if (links && !linksError) {
        link_performance = links.map((link, index) => {
          const linkEvents = events?.filter(e => e.link_id === link.id) || [];
          const linkClicks = linkEvents.filter(e => e.event_type === "click").length;
          const linkConversions = linkEvents.filter(e => e.event_type === "conversion").length;
          
          return {
            link_id: link.id,
            domain: link.domain,
            path: link.path,
            clicks: linkClicks,
            conversions: linkConversions,
            conversion_rate: linkClicks > 0 ? (linkConversions / linkClicks) * 100 : 0,
            ctr: 100, // Would need views data
            health_score: linkClicks > 0 ? Math.min(100, (linkConversions / linkClicks) * 100 * 10) : 50,
            rank: index + 1,
          };
        }).sort((a, b) => b.clicks - a.clicks).map((item, index) => ({ ...item, rank: index + 1 }));
      }
    }

    // Mock some additional metrics for now
    const analyticsData: AnalyticsData = {
      total_clicks: clicks,
      total_views: views,
      total_conversions: conversions,
      unique_visitors,
      bounce_rate: 42.3, // Mock - would need session tracking
      avg_session_duration: 272, // Mock (in seconds)
      conversion_rate,
      pages_per_session: 4.2, // Mock - would need session tracking
      events: events || [],
      chart_data,
      geographic_data,
      device_breakdown,
      browser_breakdown,
      os_breakdown,
      screen_resolutions,
      utm_data,
      referrer_data,
      hourly_patterns,
      funnel_stages,
      traffic_quality,
      link_performance,
    };

    return NextResponse.json<ApiResponse<AnalyticsData>>({ data: analyticsData });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
