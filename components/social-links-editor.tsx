"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import type { SocialLink } from "@/types/database";

interface SocialLinksEditorProps {
  value: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

const socialPlatforms = [
  { value: "tiktok", label: "TikTok", icon: "ic:baseline-tiktok" },
  { value: "instagram", label: "Instagram", icon: "mdi:instagram" },
  { value: "twitter", label: "Twitter/X", icon: "mdi:twitter" },
  { value: "youtube", label: "YouTube", icon: "mdi:youtube" },
  { value: "twitch", label: "Twitch", icon: "mdi:twitch" },
  { value: "facebook", label: "Facebook", icon: "mdi:facebook" },
  { value: "snapchat", label: "Snapchat", icon: "mdi:snapchat" },
  { value: "onlyfans", label: "OnlyFans", icon: "simple-icons:onlyfans" },
  { value: "fansly", label: "Fansly", icon: "simple-icons:fansly" },
  { value: "patreon", label: "Patreon", icon: "mdi:patreon" },
  { value: "discord", label: "Discord", icon: "mdi:discord" },
  { value: "telegram", label: "Telegram", icon: "mdi:telegram" },
  { value: "linkedin", label: "LinkedIn", icon: "mdi:linkedin" },
  { value: "github", label: "GitHub", icon: "mdi:github" },
  { value: "website", label: "Website", icon: "mdi:web" },
];

export function SocialLinksEditor({ value, onChange }: SocialLinksEditorProps) {
  const addLink = () => {
    onChange([
      ...value,
      { platform: "instagram", url: "", icon: "mdi:instagram" },
    ]);
  };

  const removeLink = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, updates: Partial<SocialLink>) => {
    const newLinks = [...value];
    newLinks[index] = { ...newLinks[index], ...updates };
    onChange(newLinks);
  };

  const updatePlatform = (index: number, platform: string) => {
    const platformData = socialPlatforms.find((p) => p.value === platform);
    if (platformData) {
      updateLink(index, {
        platform: platformData.value,
        icon: platformData.icon,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Social Links</label>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-linear" width={18} />}
          onPress={addLink}
        >
          Add Link
        </Button>
      </div>

      {value.length === 0 ? (
        <Card>
          <CardBody className="p-8 text-center">
            <Icon
              icon="solar:link-circle-line-duotone"
              width={48}
              className="mx-auto text-default-300 mb-3"
            />
            <p className="text-default-500 text-sm">
              No social links added yet
            </p>
            <p className="text-default-400 text-xs mt-1">
              Click "Add Link" to get started
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {value.map((link, index) => (
            <Card key={index}>
              <CardBody className="p-4">
                <div className="flex gap-3">
                  {/* Platform Icon Preview */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-default-100">
                    <Icon icon={link.icon} width={24} className="text-default-600" />
                  </div>

                  {/* Platform Selector and URL Input */}
                  <div className="flex-1 space-y-2">
                    <Select
                      size="sm"
                      label="Platform"
                      selectedKeys={[link.platform]}
                      onChange={(e) => updatePlatform(index, e.target.value)}
                    >
                      {socialPlatforms.map((platform) => (
                        <SelectItem
                          key={platform.value}
                          value={platform.value}
                          startContent={
                            <Icon icon={platform.icon} width={18} />
                          }
                        >
                          {platform.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      size="sm"
                      label="URL"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) =>
                        updateLink(index, { url: e.target.value })
                      }
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="flex items-center">
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => removeLink(index)}
                    >
                      <Icon icon="solar:trash-bin-trash-linear" width={18} />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <p className="text-xs text-default-500 text-center">
          {value.length} social link{value.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
}


