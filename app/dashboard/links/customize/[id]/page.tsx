import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LandingPageBuilder } from "@/components/landing-page-builder";
import { GreyhatPageBuilder } from "@/components/greyhat-page-builder";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import type { Link, LandingPageSettings, GreyhatPageSettings } from "@/types/database";

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

  // Blackhat links can't be customized
  if (link.link_type === "blackhat") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Customize Landing Page</h1>
          <p className="text-default-500 mt-1">
            Link: {link.domain}/{link.path}
          </p>
        </div>

        <Card>
          <CardBody className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center">
              <Icon
                icon="solar:link-bold-duotone"
                width={32}
                className="text-default-500"
              />
            </div>
            <div className="text-center max-w-md">
              <h3 className="text-lg font-semibold mb-2">
                Blackhat Link - Direct Redirect
              </h3>
              <p className="text-default-500">
                This link type redirects directly to your destination URL without
                showing a landing page. No customization is needed.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Fetch appropriate settings based on link type
  if (link.link_type === "whitehat") {
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

  if (link.link_type === "greyhat") {
    const { data: settings } = await supabase
      .from("greyhat_page_settings")
      .select("*")
      .eq("link_id", id)
      .single();

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Customize Age Gate</h1>
          <p className="text-default-500 mt-1">
            Customize the age verification page for {link.domain}/{link.path}
          </p>
        </div>

        <GreyhatPageBuilder link={link} initialSettings={settings} />
      </div>
    );
  }

  notFound();
}

