"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";
import { SocialLinksEditor } from "./social-links-editor";
import { CTACardsEditor } from "./cta-cards-editor";
import { ImageUploader } from "./image-uploader";
import { AudioUploader } from "./audio-uploader";
import { LandingPageViewer } from "./landing-page-viewer";
import { Select, SelectItem } from "@heroui/select";
import type {
  Link,
  LandingPageSettings,
  UpdateLandingPageSettingsRequest,
} from "@/types/database";

interface LandingPageBuilderProps {
  link: Link;
  initialSettings?: LandingPageSettings | null;
}

export function LandingPageBuilder({
  link,
  initialSettings,
}: LandingPageBuilderProps) {
  const [settings, setSettings] = useState<Partial<LandingPageSettings>>({
    avatar_url: initialSettings?.avatar_url || null,
    display_name: initialSettings?.display_name || link.title || "Profile",
    bio: initialSettings?.bio || link.description || null,
    background_color: initialSettings?.background_color || "#18181b",
    background_gradient: initialSettings?.background_gradient || {
      start: "#8B5CF6",
      end: "#EC4899",
    },
    theme_mode: initialSettings?.theme_mode || "dark",
    button_style: initialSettings?.button_style || "gradient",
    button_color: initialSettings?.button_color || "primary",
    social_links: initialSettings?.social_links || [],
    cta_cards: initialSettings?.cta_cards || [],
    verified_badge: initialSettings?.verified_badge || false,
    verified_badge_style: initialSettings?.verified_badge_style || "chip",
    show_follower_count: initialSettings?.show_follower_count || false,
    follower_count: initialSettings?.follower_count || 0,
    show_domain_handle: initialSettings?.show_domain_handle || false,
    profile_display_mode: initialSettings?.profile_display_mode || "full",
    voice_note_url: initialSettings?.voice_note_url || null,
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
      const response = await fetch(`/api/landing-page/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save");

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const previewSettings: LandingPageSettings = {
    id: initialSettings?.id || "",
    link_id: link.id,
    avatar_url: settings.avatar_url || null,
    display_name: settings.display_name || null,
    bio: settings.bio || null,
    background_color: settings.background_color || "#18181b",
    background_gradient: settings.background_gradient || {
      start: "#8B5CF6",
      end: "#EC4899",
    },
    theme_mode: settings.theme_mode || "dark",
    button_style: settings.button_style || "gradient",
    button_color: settings.button_color || "primary",
    social_links: settings.social_links || [],
    cta_cards: settings.cta_cards || [],
    verified_badge: settings.verified_badge || false,
    verified_badge_style: settings.verified_badge_style || "chip",
    show_follower_count: settings.show_follower_count || false,
    follower_count: settings.follower_count || 0,
    show_domain_handle: settings.show_domain_handle || false,
    profile_display_mode: settings.profile_display_mode || "full",
    voice_note_url: settings.voice_note_url || null,
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
              <h3 className="text-lg font-semibold">Customize Landing Page</h3>
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
          <CardBody>
            <Tabs aria-label="Customization options" fullWidth>
              {/* Profile Tab */}
              <Tab
                key="profile"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:user-bold-duotone" width={18} />
                    <span>Profile</span>
                  </div>
                }
              >
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Profile Display Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <Card
                        isPressable
                        onPress={() =>
                          setSettings({ ...settings, profile_display_mode: "full" })
                        }
                        className={`${
                          settings.profile_display_mode === "full"
                            ? "ring-2 ring-primary"
                            : "hover:border-default-400"
                        }`}
                      >
                        <CardBody className="p-4 text-center">
                          <Icon
                            icon="solar:gallery-bold-duotone"
                            width={32}
                            className="mx-auto mb-2 text-primary"
                          />
                          <p className="text-sm font-semibold">Full Display</p>
                          <p className="text-xs text-default-500 mt-1">
                            Large header image
                          </p>
                        </CardBody>
                      </Card>
                      <Card
                        isPressable
                        onPress={() =>
                          setSettings({ ...settings, profile_display_mode: "avatar" })
                        }
                        className={`${
                          settings.profile_display_mode === "avatar"
                            ? "ring-2 ring-primary"
                            : "hover:border-default-400"
                        }`}
                      >
                        <CardBody className="p-4 text-center">
                          <Icon
                            icon="solar:user-circle-bold-duotone"
                            width={32}
                            className="mx-auto mb-2 text-secondary"
                          />
                          <p className="text-sm font-semibold">Avatar</p>
                          <p className="text-xs text-default-500 mt-1">
                            Circular profile pic
                          </p>
                        </CardBody>
                      </Card>
                    </div>
                  </div>

                  <ImageUploader
                    label={settings.profile_display_mode === "full" ? "Header Image" : "Avatar"}
                    value={settings.avatar_url}
                    onChange={(url) =>
                      setSettings({ ...settings, avatar_url: url })
                    }
                    aspectRatio={settings.profile_display_mode === "full" ? "wide" : "square"}
                  />

                  <Input
                    label="Display Name"
                    placeholder="Your Name"
                    value={settings.display_name || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, display_name: e.target.value })
                    }
                    startContent={<Icon icon="solar:user-linear" width={18} />}
                  />

                  <Textarea
                    label="Bio"
                    placeholder="Tell visitors about yourself..."
                    value={settings.bio || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, bio: e.target.value })
                    }
                    minRows={3}
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Verified Badge</p>
                      <p className="text-xs text-default-500">
                        Show verification badge next to name
                      </p>
                    </div>
                    <Switch
                      isSelected={settings.verified_badge}
                      onValueChange={(checked) =>
                        setSettings({ ...settings, verified_badge: checked })
                      }
                    />
                  </div>

                  {settings.verified_badge && (
                    <div className="flex items-center justify-between ml-4">
                      <div>
                        <p className="text-sm font-medium">Badge Style</p>
                        <p className="text-xs text-default-500">
                          Solid icon or chip with text
                        </p>
                      </div>
                      <Select
                        size="sm"
                        selectedKeys={[settings.verified_badge_style || "chip"]}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            verified_badge_style: e.target.value as "chip" | "solid",
                          })
                        }
                        className="w-32"
                      >
                        <SelectItem key="solid" value="solid">
                          Solid Icon
                        </SelectItem>
                        <SelectItem key="chip" value="chip">
                          Chip
                        </SelectItem>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Show Domain Handle</p>
                      <p className="text-xs text-default-500">
                        Display @domain/path below name
                      </p>
                    </div>
                    <Switch
                      isSelected={settings.show_domain_handle}
                      onValueChange={(checked) =>
                        setSettings({ ...settings, show_domain_handle: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Show Follower Count
                      </p>
                      <p className="text-xs text-default-500">
                        Display total followers badge
                      </p>
                    </div>
                    <Switch
                      isSelected={settings.show_follower_count}
                      onValueChange={(checked) =>
                        setSettings({
                          ...settings,
                          show_follower_count: checked,
                        })
                      }
                    />
                  </div>

                  {settings.show_follower_count && (
                    <Input
                      type="number"
                      label="Follower Count"
                      placeholder="0"
                      value={settings.follower_count?.toString() || "0"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          follower_count: parseInt(e.target.value) || 0,
                        })
                      }
                      startContent={
                        <Icon icon="solar:users-group-rounded-linear" width={18} />
                      }
                    />
                  )}

                  {/* Voice Note Upload */}
                  <AudioUploader
                    label="Voice Note"
                    value={settings.voice_note_url}
                    onChange={(url) =>
                      setSettings({ ...settings, voice_note_url: url || null })
                    }
                  />
                </div>
              </Tab>

              {/* Theme Tab */}
              <Tab
                key="theme"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:palette-bold-duotone" width={18} />
                    <span>Theme</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Page Theme
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Light Mode */}
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, theme_mode: "light" })}
                        className={`relative rounded-xl border-2 transition-all overflow-hidden ${
                          settings.theme_mode === "light"
                            ? "border-primary shadow-lg scale-105"
                            : "border-default-200 hover:border-default-400"
                        }`}
                      >
                        <div className="p-4 bg-white">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                              <Icon icon="solar:sun-bold" width={20} className="text-yellow-500" />
                              <span className="text-sm font-semibold text-gray-900">Light Mode</span>
                            </div>
                            <div className="h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-blue-500" />
                            </div>
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-200 rounded w-3/4" />
                              <div className="h-2 bg-gray-200 rounded w-1/2" />
                            </div>
                          </div>
                        </div>
                        {settings.theme_mode === "light" && (
                          <div className="absolute top-2 right-2">
                            <Icon
                              icon="solar:check-circle-bold"
                              className="text-primary"
                              width={20}
                            />
                          </div>
                        )}
                      </button>

                      {/* Dark Mode */}
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, theme_mode: "dark" })}
                        className={`relative rounded-xl border-2 transition-all overflow-hidden ${
                          settings.theme_mode === "dark"
                            ? "border-primary shadow-lg scale-105"
                            : "border-default-200 hover:border-default-400"
                        }`}
                      >
                        <div className="p-4 bg-[#18181b]">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                              <Icon icon="solar:moon-bold" width={20} className="text-blue-400" />
                              <span className="text-sm font-semibold text-white">Dark Mode</span>
                            </div>
                            <div className="h-12 rounded-lg bg-[#27272a] flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-blue-500" />
                            </div>
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-700 rounded w-3/4" />
                              <div className="h-2 bg-gray-700 rounded w-1/2" />
                            </div>
                          </div>
                        </div>
                        {settings.theme_mode === "dark" && (
                          <div className="absolute top-2 right-2">
                            <Icon
                              icon="solar:check-circle-bold"
                              className="text-primary"
                              width={20}
                            />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Tab>

              {/* Social Links Tab */}
              <Tab
                key="social"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:link-circle-bold-duotone" width={18} />
                    <span>Social</span>
                  </div>
                }
              >
                <div className="pt-4">
                  <SocialLinksEditor
                    value={settings.social_links || []}
                    onChange={(links) =>
                      setSettings({ ...settings, social_links: links })
                    }
                  />
                </div>
              </Tab>

              {/* CTA Buttons Tab */}
              <Tab
                key="cta"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:widget-5-bold-duotone" width={18} />
                    <span>CTA Buttons</span>
                  </div>
                }
              >
                <div className="pt-4">
                  <CTACardsEditor
                    value={settings.cta_cards || []}
                    onChange={(cards) =>
                      setSettings({ ...settings, cta_cards: cards })
                    }
                  />
                </div>
              </Tab>
            </Tabs>
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
                <LandingPageViewer link={link} settings={previewSettings} isPreview={true} />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

