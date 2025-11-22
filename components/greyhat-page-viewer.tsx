"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import type { Link, GreyhatPageSettings } from "@/types/database";

interface GreyhatPageViewerProps {
  link: Link;
  settings: GreyhatPageSettings;
  onConfirm?: () => void;
  isPreview?: boolean;
}

export function GreyhatPageViewer({
  link,
  settings,
  onConfirm,
  isPreview = false,
}: GreyhatPageViewerProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }

    // Skip analytics and navigation in preview mode
    if (isPreview) {
      return;
    }

    // Track analytics
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        link_id: link.id,
        event_type: "click",
      }),
    }).catch(console.error);

    // Redirect to destination
    window.location.href = link.destination_url;
  };

  const handleGoBack = () => {
    if (isPreview) {
      return;
    }
    window.history.back();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: settings.background_color }}
    >
      <div className="max-w-md w-full">
        {/* Icon with Glow Effect */}
        <div className="flex justify-center mb-8">
          <div
            className="relative w-24 h-24 flex items-center justify-center rounded-3xl"
            style={{
              backgroundColor: settings.card_background_color,
              boxShadow: `0 0 60px ${settings.icon_color}40, 0 0 100px ${settings.icon_color}20`,
            }}
          >
            <Icon
              icon="solar:shield-warning-bold"
              width={48}
              style={{ color: settings.icon_color }}
            />
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-3xl font-bold text-center mb-8"
          style={{ color: settings.text_color }}
        >
          {settings.warning_title}
        </h1>

        {/* Warning Message Card */}
        <div
          className="rounded-2xl p-6 mb-8 border"
          style={{
            backgroundColor: settings.card_background_color,
            borderColor: `${settings.text_color}15`,
          }}
        >
          <div className="flex gap-3">
            <Icon
              icon="solar:danger-circle-bold"
              width={24}
              style={{ color: settings.icon_color, flexShrink: 0 }}
            />
            <p
              className="text-lg leading-relaxed"
              style={{ color: settings.text_color }}
            >
              {settings.warning_message}
            </p>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          size="lg"
          className="w-full font-semibold text-lg h-14 rounded-2xl mb-4"
          style={{
            backgroundColor: settings.button_color,
            color: "#ffffff",
          }}
          onPress={handleConfirm}
        >
          {settings.confirm_button_text}
        </Button>

        {/* Go Back Link */}
        <div className="text-center">
          <button
            onClick={handleGoBack}
            className="text-lg underline hover:no-underline transition-all"
            style={{ color: `${settings.text_color}80` }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

