import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LandingPageBuilder } from "@/components/landing-page-builder";
import type { Link, LandingPageSettings } from "@/types/database";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomizeLandingPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  // Fetch the link
  const { data: link, error: linkError } = await supabase
    .from("links")
    .select("*")
    .eq("id", id)
    .single();

  if (linkError || !link) {
    notFound();
  }

  // Only whitehat links should have customizable landing pages
  if (link.link_type !== "whitehat") {
    notFound();
  }

  // Fetch landing page settings
  const { data: settings } = await supabase
    .from("landing_page_settings")
    .select("*")
    .eq("link_id", id)
    .single();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customize Landing Page</h1>
        <p className="text-default-500 mt-1">
          Personalize your landing page for {link.domain}/{link.path}
        </p>
      </div>

      <LandingPageBuilder link={link} initialSettings={settings} />
    </div>
  );
}

