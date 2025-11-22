"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";
import { GreyhatPageViewer } from "./greyhat-page-viewer";
import type {
  Link,
  GreyhatPageSettings,
  UpdateGreyhatPageSettingsRequest,
} from "@/types/database";

interface GreyhatPageBuilderProps {
  link: Link;
  initialSettings?: GreyhatPageSettings | null;
}

export function GreyhatPageBuilder({
  link,
  initialSettings,
}: GreyhatPageBuilderProps) {
  const [settings, setSettings] = useState({
    warning_title: initialSettings?.warning_title || "18+ Content Warning",
    warning_message:
      initialSettings?.warning_message ||
      "You must be at least 18 years old to access this content. Please confirm your age to continue.",
    confirm_button_text:
      initialSettings?.confirm_button_text || "I'm 18 or Older",
    background_color: initialSettings?.background_color || "#18181b",
    card_background_color:
      initialSettings?.card_background_color || "#27272a",
    button_color: initialSettings?.button_color || "#EC4899",
    text_color: initialSettings?.text_color || "#ffffff",
    icon_color: initialSettings?.icon_color || "#EC4899",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [settings]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus("idle");

      const response = await fetch(`/api/greyhat-page/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Preview settings matching the GreyhatPageSettings type
  const previewSettings: GreyhatPageSettings = {
    id: initialSettings?.id || "preview",
    link_id: link.id,
    warning_title: settings.warning_title,
    warning_message: settings.warning_message,
    confirm_button_text: settings.confirm_button_text,
    background_color: settings.background_color,
    card_background_color: settings.card_background_color,
    button_color: settings.button_color,
    text_color: settings.text_color,
    icon_color: settings.icon_color,
    created_at: initialSettings?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Side - Customization Form */}
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Customize Age Gate</h3>
              <p className="text-sm text-default-500">
                Make changes to see them live
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isSaving && <Spinner size="sm" />}
              {saveStatus === "success" && (
                <Icon
                  icon="solar:check-circle-bold"
                  width={20}
                  className="text-success"
                />
              )}
              {saveStatus === "error" && (
                <Icon
                  icon="solar:close-circle-bold"
                  width={20}
                  className="text-danger"
                />
              )}
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Text Content Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-default-700">
                Content
              </h4>

              <Input
                label="Warning Title"
                placeholder="18+ Content Warning"
                value={settings.warning_title}
                onChange={(e) =>
                  setSettings({ ...settings, warning_title: e.target.value })
                }
              />

              <Textarea
                label="Warning Message"
                placeholder="You must be at least 18 years old..."
                value={settings.warning_message}
                onChange={(e) =>
                  setSettings({ ...settings, warning_message: e.target.value })
                }
                minRows={3}
              />

              <Input
                label="Confirm Button Text"
                placeholder="I'm 18 or Older"
                value={settings.confirm_button_text}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    confirm_button_text: e.target.value,
                  })
                }
              />
            </div>

            {/* Colors Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-default-700">
                Colors
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-default-600 mb-2 block">
                    Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.background_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          background_color: e.target.value,
                        })
                      }
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-default-200"
                    />
                    <Input
                      size="sm"
                      value={settings.background_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          background_color: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-default-600 mb-2 block">
                    Card Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.card_background_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          card_background_color: e.target.value,
                        })
                      }
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-default-200"
                    />
                    <Input
                      size="sm"
                      value={settings.card_background_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          card_background_color: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-default-600 mb-2 block">
                    Button Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.button_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          button_color: e.target.value,
                        })
                      }
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-default-200"
                    />
                    <Input
                      size="sm"
                      value={settings.button_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          button_color: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-default-600 mb-2 block">
                    Text Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.text_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          text_color: e.target.value,
                        })
                      }
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-default-200"
                    />
                    <Input
                      size="sm"
                      value={settings.text_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          text_color: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-default-600 mb-2 block">
                    Icon Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.icon_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          icon_color: e.target.value,
                        })
                      }
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-default-200"
                    />
                    <Input
                      size="sm"
                      value={settings.icon_color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          icon_color: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Link Preview Card */}
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <Icon
                icon="solar:link-linear"
                width={18}
                className="text-default-500"
              />
              <span className="text-default-500">Link:</span>
              <code className="flex-1 bg-default-100 px-2 py-1 rounded text-xs">
                {link.domain}/{link.path}
              </code>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                as="a"
                href={`/p/${link.domain}/${link.path}`}
                target="_blank"
              >
                View Live
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Right Side - Live Preview */}
      <div className="relative">
        <div className="sticky top-4">
          <Card className="overflow-hidden">
            <CardHeader className="bg-default-100 border-b border-default-200">
              <div className="flex items-center gap-2">
                <Icon
                  icon="solar:monitor-smartphone-bold-duotone"
                  width={20}
                  className="text-default-600"
                />
                <span className="font-semibold">Live Preview</span>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="aspect-[9/16] max-h-[calc(100vh-250px)] overflow-y-auto border-4 border-default-200 rounded-lg bg-background">
                <GreyhatPageViewer
                  link={link}
                  settings={previewSettings}
                  isPreview={true}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

