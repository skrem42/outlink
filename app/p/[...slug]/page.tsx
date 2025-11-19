import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LandingPageViewer } from "@/components/landing-page-viewer";
import type { Link, LandingPageSettings } from "@/types/database";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function PublicLandingPage({ params }: PageProps) {
  const supabase = await createClient();
  const { slug } = await params;

  // Parse slug - should be [domain, ...pathSegments]
  if (!slug || slug.length === 0) {
    notFound();
  }

  const domain = slug[0];
  const path = slug.slice(1).join("/") || "";

  // Fetch link by domain and path
  const { data: link, error: linkError } = await supabase
    .from("links")
    .select("*")
    .eq("domain", domain)
    .eq("path", path)
    .eq("status", true)
    .single();

  if (linkError || !link) {
    notFound();
  }

  // Handle link types
  if (link.link_type === "blackhat") {
    // Direct redirect for blackhat links
    redirect(link.destination_url);
  }

  if (link.link_type === "greyhat") {
    // TODO: Implement age-gated landing page
    // For now, redirect
    redirect(link.destination_url);
  }

  // Fetch landing page settings for whitehat links
  const { data: settings } = await supabase
    .from("landing_page_settings")
    .select("*")
    .eq("link_id", link.id)
    .single();

  // If no settings found, create default settings
  if (!settings) {
    const defaultSettings: Partial<LandingPageSettings> = {
      link_id: link.id,
      display_name: link.title || "Profile",
      bio: link.description || null,
      background_gradient: { start: "#8B5CF6", end: "#EC4899" },
      button_style: "gradient",
      button_color: "primary",
      social_links: [],
      cta_cards: [],
      verified_badge: false,
      verified_badge_style: "chip",
      show_follower_count: false,
      follower_count: 0,
      show_domain_handle: false,
      profile_display_mode: "full",
    };

    const { data: newSettings } = await supabase
      .from("landing_page_settings")
      .insert(defaultSettings)
      .select()
      .single();

    if (!newSettings) {
      // If we can't create settings, show basic redirect
      redirect(link.destination_url);
    }

    // Track view event
    await supabase.from("analytics_events").insert({
      link_id: link.id,
      event_type: "view",
    });

    return <LandingPageViewer link={link} settings={newSettings} />;
  }

  // Track view event
  await supabase.from("analytics_events").insert({
    link_id: link.id,
    event_type: "view",
  });

  return <LandingPageViewer link={link} settings={settings} />;
}

