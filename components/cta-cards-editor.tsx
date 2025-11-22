"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { Icon } from "@iconify/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { ColorGradientPicker } from "./color-gradient-picker";
import { ImageUploader } from "./image-uploader";
import { VideoUploader } from "./video-uploader";
import { getCVRIncrease } from "@/lib/utils";
import type { CTACard, CTACardStyle, CTRMechanisms } from "@/types/database";

interface CTACardsEditorProps {
  value: CTACard[];
  onChange: (cards: CTACard[]) => void;
}

const brandLogos = [
  { value: "onlyfans", label: "OnlyFans", icon: "simple-icons:onlyfans", color: "#00AFF0" },
  { value: "fansly", label: "Fansly", icon: "simple-icons:fansly", color: "#0088CC" },
  { value: "patreon", label: "Patreon", icon: "mdi:patreon", color: "#FF424D" },
  { value: "instagram", label: "Instagram", icon: "mdi:instagram", color: "#E4405F" },
  { value: "tiktok", label: "TikTok", icon: "ic:baseline-tiktok", color: "#000000" },
  { value: "youtube", label: "YouTube", icon: "mdi:youtube", color: "#FF0000" },
  { value: "twitch", label: "Twitch", icon: "mdi:twitch", color: "#9146FF" },
  { value: "twitter", label: "Twitter/X", icon: "mdi:twitter", color: "#1DA1F2" },
  { value: "snapchat", label: "Snapchat", icon: "mdi:snapchat", color: "#FFFC00" },
  { value: "discord", label: "Discord", icon: "mdi:discord", color: "#5865F2" },
];

export function CTACardsEditor({ value, onChange }: CTACardsEditorProps) {
  const [editingCard, setEditingCard] = useState<CTACard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addCard = () => {
    const newCard: CTACard = {
      id: Date.now().toString(),
      title: "New Button",
      description: "",
      url: "",
      order: value.length,
      style: {
        type: "text",
      },
    };
    setEditingCard(newCard);
    setIsModalOpen(true);
  };

  const editCard = (card: CTACard) => {
    setEditingCard({ ...card });
    setIsModalOpen(true);
  };

  const saveCard = () => {
    if (!editingCard) return;

    const existingIndex = value.findIndex((c) => c.id === editingCard.id);
    if (existingIndex >= 0) {
      const updated = [...value];
      updated[existingIndex] = editingCard;
      onChange(updated);
    } else {
      onChange([...value, editingCard]);
    }
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const deleteCard = (id: string) => {
    onChange(value.filter((c) => c.id !== id));
  };

  const moveCard = (index: number, direction: "up" | "down") => {
    const newCards = [...value];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCards.length) return;

    [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];
    newCards.forEach((card, i) => (card.order = i));
    onChange(newCards);
  };

  const updateEditingCard = (updates: Partial<CTACard>) => {
    if (!editingCard) return;
    setEditingCard({ ...editingCard, ...updates });
  };

  const updateEditingCardStyle = (updates: Partial<CTACardStyle>) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      style: { ...editingCard.style, ...updates },
    });
  };

  const updateEditingCardCTRMechanisms = (updates: Partial<CTRMechanisms>) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      ctr_mechanisms: { ...editingCard.ctr_mechanisms, ...updates },
    });
  };

  // Handle mutual exclusivity for blocking mechanisms
  const enableBlockingMechanism = (mechanismName: 'click_to_reveal' | 'countdown_timer' | 'blur_preview' | 'progress_bar', defaultConfig: any) => {
    if (!editingCard) return;
    
    // Disable all other blocking mechanisms
    const newMechanisms: Partial<CTRMechanisms> = {
      ...editingCard.ctr_mechanisms,
      click_to_reveal: mechanismName === 'click_to_reveal' ? { enabled: true, ...defaultConfig } : { ...editingCard.ctr_mechanisms?.click_to_reveal, enabled: false },
      countdown_timer: mechanismName === 'countdown_timer' ? { enabled: true, ...defaultConfig } : { ...editingCard.ctr_mechanisms?.countdown_timer, enabled: false },
      blur_preview: mechanismName === 'blur_preview' ? { enabled: true, ...defaultConfig } : { ...editingCard.ctr_mechanisms?.blur_preview, enabled: false },
      progress_bar: mechanismName === 'progress_bar' ? { enabled: true, ...defaultConfig } : { ...editingCard.ctr_mechanisms?.progress_bar, enabled: false },
    };
    
    setEditingCard({
      ...editingCard,
      ctr_mechanisms: newMechanisms,
    });
  };

  const disableBlockingMechanism = (mechanismName: 'click_to_reveal' | 'countdown_timer' | 'blur_preview' | 'progress_bar') => {
    if (!editingCard) return;
    updateEditingCardCTRMechanisms({
      [mechanismName]: { ...editingCard.ctr_mechanisms?.[mechanismName], enabled: false },
    });
  };

  const getCardPreviewStyle = (card: CTACard) => {
    const { style } = card;
    switch (style.type) {
      case "solid":
        return { background: style.background_color || "#666" };
      case "gradient":
        return {
          background: style.background_gradient
            ? `linear-gradient(135deg, ${style.background_gradient.start}, ${style.background_gradient.end})`
            : "linear-gradient(135deg, #667eea, #764ba2)",
        };
      case "image":
        return {
          backgroundImage: style.background_image
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${style.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      case "video":
        return { background: "#000" };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">CTA Buttons</label>
          <p className="text-xs text-default-500">
            Customize your call-to-action buttons
          </p>
        </div>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-linear" width={18} />}
          onPress={addCard}
        >
          Add Button
        </Button>
      </div>

      {value.length === 0 ? (
        <Card>
          <CardBody className="p-8 text-center">
            <Icon
              icon="solar:widget-5-line-duotone"
              width={48}
              className="mx-auto text-default-300 mb-3"
            />
            <p className="text-default-500 text-sm">No CTA buttons yet</p>
            <p className="text-default-400 text-xs mt-1">
              Add your first call-to-action button
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {value
            .sort((a, b) => a.order - b.order)
            .map((card, index) => (
              <Card key={card.id} className="hover:border-primary/50 transition-colors">
                <CardBody className="p-4">
                  <div className="flex gap-3">
                    {/* Preview */}
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center border-2 border-default-200"
                      style={getCardPreviewStyle(card)}
                    >
                      {card.style.type === "logo" && card.style.logo_icon && (
                        <Icon
                          icon={card.style.logo_icon}
                          width={32}
                          style={{ color: card.style.logo_color || "#666" }}
                        />
                      )}
                      {card.style.type === "text" && (
                        <Icon
                          icon="solar:text-bold-duotone"
                          width={32}
                          className="text-default-400"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        {card.style.prefix_text && (
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{
                              color: card.style.logo_color || "#666",
                              backgroundColor: `${card.style.logo_color || "#666"}20`,
                            }}
                          >
                            {card.style.prefix_text}
                          </span>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold truncate">{card.title}</p>
                          {card.description && (
                            <p className="text-xs text-default-500 truncate">
                              {card.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-default-400 mt-1 truncate">
                        {card.url || "No URL"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => moveCard(index, "up")}
                          isDisabled={index === 0}
                        >
                          <Icon icon="solar:arrow-up-linear" width={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => moveCard(index, "down")}
                          isDisabled={index === value.length - 1}
                        >
                          <Icon icon="solar:arrow-down-linear" width={16} />
                        </Button>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                          onPress={() => editCard(card)}
                        >
                          <Icon icon="solar:pen-linear" width={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => deleteCard(card.id)}
                        >
                          <Icon icon="solar:trash-bin-trash-linear" width={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
        }}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingCard?.id && value.find((c) => c.id === editingCard.id)
                  ? "Edit CTA Button"
                  : "Add CTA Button"}
              </ModalHeader>
              <ModalBody>
                {editingCard && (
                  <div className="space-y-4">
                    {/* Basic Info */}
                    <Input
                      label="Button Title"
                      placeholder="e.g., Follow me on Instagram"
                      value={editingCard.title}
                      onChange={(e) =>
                        updateEditingCard({ title: e.target.value })
                      }
                    />
                    <Textarea
                      label="Description (Optional)"
                      placeholder="Add a description..."
                      value={editingCard.description || ""}
                      onChange={(e) =>
                        updateEditingCard({ description: e.target.value })
                      }
                      minRows={2}
                    />
                    <Input
                      label="Destination URL"
                      placeholder="https://..."
                      value={editingCard.url}
                      onChange={(e) => {
                        const url = e.target.value;
                        updateEditingCard({ url });
                        // Auto-enable 18+ for adult platform URLs
                        if (url.toLowerCase().includes("onlyfans.com") || url.toLowerCase().includes("fansly.com")) {
                          updateEditingCard({ require_18plus: true, url });
                        }
                      }}
                    />

                    {/* Logo Options */}
                    <Card>
                      <CardBody className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Show Brand Logo
                          </label>
                          <input
                            type="checkbox"
                            checked={!!editingCard.style.logo_name}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Set default brand when enabling
                                const defaultBrand = brandLogos[0];
                                updateEditingCardStyle({
                                  logo_name: defaultBrand.label,
                                  logo_icon: defaultBrand.icon,
                                  logo_color: defaultBrand.color,
                                });
                              } else {
                                // Clear logo data when disabling
                                updateEditingCardStyle({
                                  logo_name: undefined,
                                  logo_icon: undefined,
                                  logo_color: undefined,
                                  prefix_text: undefined,
                                });
                              }
                            }}
                            className="w-5 h-5 cursor-pointer accent-primary"
                          />
                        </div>

                        {editingCard.style.logo_name && (
                          <>
                            <Select
                              label="Select Brand"
                              selectedKeys={
                                editingCard.style.logo_name
                                  ? [editingCard.style.logo_name]
                                  : []
                              }
                              onChange={(e) => {
                                const brand = brandLogos.find(
                                  (b) => b.value === e.target.value
                                );
                                if (brand) {
                                  updateEditingCardStyle({
                                    logo_name: brand.label,
                                    logo_icon: brand.icon,
                                    logo_color: brand.color,
                                  });
                                  // Auto-enable 18+ for adult platforms
                                  if (brand.label === "OnlyFans" || brand.label === "Fansly") {
                                    updateEditingCard({ require_18plus: true });
                                  }
                                }
                              }}
                            >
                              {brandLogos.map((brand) => (
                                <SelectItem
                                  key={brand.value}
                                  value={brand.value}
                                  startContent={<Icon icon={brand.icon} width={20} />}
                                >
                                  {brand.label}
                                </SelectItem>
                              ))}
                            </Select>
                            <Input
                              label="Prefix Text (Optional)"
                              placeholder="e.g., Free, Paid, Premium"
                              value={editingCard.style.prefix_text || ""}
                              onChange={(e) =>
                                updateEditingCardStyle({
                                  prefix_text: e.target.value,
                                })
                              }
                            />
                          </>
                        )}
                      </CardBody>
                    </Card>

                    {/* Background Options */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Background Style</label>
                      <Tabs
                        selectedKey={
                          editingCard.style.type === "text" || editingCard.style.type === "logo"
                            ? "none"
                            : editingCard.style.type
                        }
                        onSelectionChange={(key) => {
                          const type = key === "none" 
                            ? (editingCard.style.logo_name ? "logo" : "text")
                            : key as "solid" | "gradient" | "image" | "video";
                          updateEditingCardStyle({ type });
                        }}
                        fullWidth
                      >
                        <Tab key="none" title="None" />
                        <Tab key="solid" title="Solid Color" />
                        <Tab key="gradient" title="Gradient" />
                        <Tab key="image" title="Image" />
                        <Tab key="video" title="Video" />
                      </Tabs>

                      {/* Solid Color */}
                      {editingCard.style.type === "solid" && (
                        <div>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={editingCard.style.background_color || "#666666"}
                              onChange={(e) =>
                                updateEditingCardStyle({
                                  background_color: e.target.value,
                                })
                              }
                              className="w-16 h-10 rounded cursor-pointer border-2 border-default-200"
                            />
                            <Input
                              value={editingCard.style.background_color || "#666666"}
                              onChange={(e) =>
                                updateEditingCardStyle({
                                  background_color: e.target.value,
                                })
                              }
                              placeholder="#666666"
                            />
                          </div>
                        </div>
                      )}

                      {/* Gradient */}
                      {editingCard.style.type === "gradient" && (
                        <ColorGradientPicker
                          label=""
                          value={
                            editingCard.style.background_gradient || {
                              start: "#667eea",
                              end: "#764ba2",
                            }
                          }
                          onChange={(gradient) =>
                            updateEditingCardStyle({
                              background_gradient: gradient,
                            })
                          }
                        />
                      )}

                      {/* Image Background */}
                      {editingCard.style.type === "image" && (
                        <ImageUploader
                          label="Background Image"
                          value={editingCard.style.background_image}
                          onChange={(url) =>
                            updateEditingCardStyle({
                              background_image: url,
                            })
                          }
                          aspectRatio="wide"
                        />
                      )}

                      {/* Video Background */}
                      {editingCard.style.type === "video" && (
                        <VideoUploader
                          label="Background Video"
                          value={editingCard.style.background_video}
                          onChange={(url) =>
                            updateEditingCardStyle({
                              background_video: url,
                            })
                          }
                        />
                      )}
                    </div>

                    {/* CTR Boost Settings */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:chart-2-bold-duotone" width={20} />
                          <span className="font-semibold">CTR Boost Settings</span>
                          <Chip size="sm" color="success" variant="flat">
                            Increase Conversions
                          </Chip>
                        </div>
                      </CardHeader>
                      <CardBody className="space-y-2">
                        <p className="text-sm text-default-500 mb-3">
                          Add psychological triggers to increase click-through rates
                        </p>
                        
                        {/* Section: Blocking Mechanisms */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Chip 
                              size="sm" 
                              color="warning" 
                              variant="flat"
                              startContent={<Icon icon="solar:shield-bold" width={12} />}
                            >
                              Blocking Mechanisms
                            </Chip>
                            <p className="text-xs text-default-500">Only one can be active at a time</p>
                          </div>
                        </div>
                        
                        <Accordion variant="splitted">
                          {/* Click to Reveal */}
                          <AccordionItem
                            key="click-reveal"
                            title={
                              <div className="flex items-center gap-2">
                                <span>Click to Reveal</span>
                                <Tooltip content="Users must click multiple times to unlock the link. Increases engagement.">
                                  <Chip size="sm" color="success" variant="flat">
                                    {getCVRIncrease('click_to_reveal')}
                                  </Chip>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="space-y-3 pt-2">
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.click_to_reveal?.enabled || false}
                                onValueChange={(checked) => {
                                  if (checked) {
                                    enableBlockingMechanism('click_to_reveal', {
                                      clicks_required: editingCard.ctr_mechanisms?.click_to_reveal?.clicks_required || 5,
                                      button_text: editingCard.ctr_mechanisms?.click_to_reveal?.button_text || "Tap to reveal link",
                                    });
                                  } else {
                                    disableBlockingMechanism('click_to_reveal');
                                  }
                                }}
                              >
                                Enable Click to Reveal
                              </Switch>
                              {editingCard.ctr_mechanisms?.click_to_reveal?.enabled && (
                                <>
                                  <Input
                                    type="number"
                                    label="Clicks Required"
                                    value={String(editingCard.ctr_mechanisms.click_to_reveal.clicks_required)}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        click_to_reveal: {
                                          ...editingCard.ctr_mechanisms!.click_to_reveal!,
                                          clicks_required: parseInt(e.target.value) || 5,
                                        },
                                      })
                                    }
                                    min={1}
                                    max={10}
                                  />
                                  <Input
                                    label="Button Text"
                                    value={editingCard.ctr_mechanisms.click_to_reveal.button_text}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        click_to_reveal: {
                                          ...editingCard.ctr_mechanisms!.click_to_reveal!,
                                          button_text: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </>
                              )}
                            </div>
                          </AccordionItem>

                          {/* Countdown Timer */}
                          <AccordionItem
                            key="countdown"
                            title={
                              <div className="flex items-center gap-2">
                                <span>Countdown Before Reveal</span>
                                <Tooltip content="Adds anticipation with a countdown timer before revealing the link.">
                                  <Chip size="sm" color="success" variant="flat">
                                    {getCVRIncrease('countdown_timer')}
                                  </Chip>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="space-y-3 pt-2">
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.countdown_timer?.enabled || false}
                                onValueChange={(checked) => {
                                  if (checked) {
                                    enableBlockingMechanism('countdown_timer', {
                                      duration_seconds: editingCard.ctr_mechanisms?.countdown_timer?.duration_seconds || 5,
                                      message: editingCard.ctr_mechanisms?.countdown_timer?.message || "Link unlocking in...",
                                    });
                                  } else {
                                    disableBlockingMechanism('countdown_timer');
                                  }
                                }}
                              >
                                Enable Countdown Timer
                              </Switch>
                              {editingCard.ctr_mechanisms?.countdown_timer?.enabled && (
                                <>
                                  <Input
                                    type="number"
                                    label="Duration (seconds)"
                                    value={String(editingCard.ctr_mechanisms.countdown_timer.duration_seconds)}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        countdown_timer: {
                                          ...editingCard.ctr_mechanisms!.countdown_timer!,
                                          duration_seconds: parseInt(e.target.value) || 5,
                                        },
                                      })
                                    }
                                    min={1}
                                    max={30}
                                  />
                                  <Input
                                    label="Message"
                                    value={editingCard.ctr_mechanisms.countdown_timer.message}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        countdown_timer: {
                                          ...editingCard.ctr_mechanisms!.countdown_timer!,
                                          message: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </>
                              )}
                            </div>
                          </AccordionItem>

                        </Accordion>

                        {/* Section: Non-Blocking Enhancements */}
                        <div className="my-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Chip 
                              size="sm" 
                              color="primary" 
                              variant="flat"
                              startContent={<Icon icon="solar:star-bold" width={12} />}
                            >
                              Scarcity & Social Proof
                            </Chip>
                            <p className="text-xs text-default-500">Can be combined with any mechanism</p>
                          </div>
                        </div>

                        <Accordion variant="splitted">
                          {/* Limited Slots */}
                          <AccordionItem
                            key="limited-slots"
                            title={
                              <div className="flex items-center gap-2">
                                <span>Limited Slots</span>
                                <Tooltip content="Display 'Only X spots left!' to create scarcity.">
                                  <Chip size="sm" color="success" variant="flat">
                                    {getCVRIncrease('limited_slots')}
                                  </Chip>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="space-y-3 pt-2">
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.limited_slots?.enabled || false}
                                onValueChange={(checked) =>
                                  updateEditingCardCTRMechanisms({
                                    limited_slots: {
                                      enabled: checked,
                                      current: editingCard.ctr_mechanisms?.limited_slots?.current || 3,
                                      total: editingCard.ctr_mechanisms?.limited_slots?.total || 10,
                                      message: editingCard.ctr_mechanisms?.limited_slots?.message || "Only {current} spots left!",
                                    },
                                  })
                                }
                              >
                                Enable Limited Slots
                              </Switch>
                              {editingCard.ctr_mechanisms?.limited_slots?.enabled && (
                                <>
                                  <Input
                                    type="number"
                                    label="Spots Remaining"
                                    value={String(editingCard.ctr_mechanisms.limited_slots.current)}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        limited_slots: {
                                          ...editingCard.ctr_mechanisms!.limited_slots!,
                                          current: parseInt(e.target.value) || 3,
                                        },
                                      })
                                    }
                                    min={1}
                                  />
                                  <Input
                                    type="number"
                                    label="Total Spots"
                                    value={String(editingCard.ctr_mechanisms.limited_slots.total)}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        limited_slots: {
                                          ...editingCard.ctr_mechanisms!.limited_slots!,
                                          total: parseInt(e.target.value) || 10,
                                        },
                                      })
                                    }
                                    min={1}
                                  />
                                  <Input
                                    label="Custom Message"
                                    value={editingCard.ctr_mechanisms.limited_slots.message}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        limited_slots: {
                                          ...editingCard.ctr_mechanisms!.limited_slots!,
                                          message: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Use {current} and {total} for dynamic values"
                                    description="Example: Only {current}/{total} spots left!"
                                  />
                                </>
                              )}
                            </div>
                          </AccordionItem>

                          {/* Live Viewers */}
                          <AccordionItem
                            key="live-viewers"
                            title={
                              <div className="flex items-center gap-2">
                                <span>Live Viewers Count</span>
                                <Tooltip content="Show how many people are viewing now to create social proof.">
                                  <Chip size="sm" color="success" variant="flat">
                                    {getCVRIncrease('live_viewers')}
                                  </Chip>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="space-y-3 pt-2">
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.live_viewers?.enabled || false}
                                onValueChange={(checked) =>
                                  updateEditingCardCTRMechanisms({
                                    live_viewers: {
                                      enabled: checked,
                                      count: editingCard.ctr_mechanisms?.live_viewers?.count || 127,
                                    },
                                  })
                                }
                              >
                                Enable Live Viewers
                              </Switch>
                              {editingCard.ctr_mechanisms?.live_viewers?.enabled && (
                                <Input
                                  type="number"
                                  label="Viewer Count"
                                  value={String(editingCard.ctr_mechanisms.live_viewers.count)}
                                  onChange={(e) =>
                                    updateEditingCardCTRMechanisms({
                                      live_viewers: {
                                        ...editingCard.ctr_mechanisms!.live_viewers!,
                                        count: parseInt(e.target.value) || 127,
                                      },
                                    })
                                  }
                                  min={1}
                                />
                              )}
                            </div>
                          </AccordionItem>

                          {/* Exclusive Badge */}
                          <AccordionItem
                            key="exclusive"
                            title={
                              <div className="flex items-center gap-2">
                                <span>Exclusive Access Badge</span>
                                <Tooltip content="Add VIP/exclusive badge to increase perceived value.">
                                  <Chip size="sm" color="success" variant="flat">
                                    {getCVRIncrease('exclusive_badge')}
                                  </Chip>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="space-y-3 pt-2">
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.exclusive_badge?.enabled || false}
                                onValueChange={(checked) =>
                                  updateEditingCardCTRMechanisms({
                                    exclusive_badge: {
                                      enabled: checked,
                                      text: editingCard.ctr_mechanisms?.exclusive_badge?.text || "VIP Access",
                                    },
                                  })
                                }
                              >
                                Enable Exclusive Badge
                              </Switch>
                              {editingCard.ctr_mechanisms?.exclusive_badge?.enabled && (
                                <Input
                                  label="Badge Text"
                                  value={editingCard.ctr_mechanisms.exclusive_badge.text}
                                  onChange={(e) =>
                                    updateEditingCardCTRMechanisms({
                                      exclusive_badge: {
                                        ...editingCard.ctr_mechanisms!.exclusive_badge!,
                                        text: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="VIP Access, Members Only, etc."
                                />
                              )}
                            </div>
                          </AccordionItem>

                          {/* Access Code */}
                          <AccordionItem
                            key="access-code"
                            title={
                              <div className="flex items-center gap-2">
                                <span>Access Code Protection</span>
                                <Tooltip content="Require a password/code to unlock the link.">
                                  <Chip size="sm" color="success" variant="flat">
                                    {getCVRIncrease('access_code')}
                                  </Chip>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="space-y-3 pt-2">
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.access_code?.enabled || false}
                                onValueChange={(checked) =>
                                  updateEditingCardCTRMechanisms({
                                    access_code: {
                                      enabled: checked,
                                      code: editingCard.ctr_mechanisms?.access_code?.code || "",
                                      hint: editingCard.ctr_mechanisms?.access_code?.hint || "",
                                    },
                                  })
                                }
                              >
                                Enable Access Code
                              </Switch>
                              {editingCard.ctr_mechanisms?.access_code?.enabled && (
                                <>
                                  <Input
                                    label="Access Code"
                                    value={editingCard.ctr_mechanisms.access_code.code}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        access_code: {
                                          ...editingCard.ctr_mechanisms!.access_code!,
                                          code: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="secret123"
                                  />
                                  <Input
                                    label="Hint (Optional)"
                                    value={editingCard.ctr_mechanisms.access_code.hint || ""}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        access_code: {
                                          ...editingCard.ctr_mechanisms!.access_code!,
                                          hint: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Check your email"
                                  />
                                </>
                              )}
                            </div>
                          </AccordionItem>

                          {/* Blur Preview */}
                          <AccordionItem
                            key="blur-preview"
                            title={
                              <div className="flex items-center gap-2">
                                <span>Blur Preview</span>
                                <Tooltip content="Show blurred content with teaser text to create curiosity.">
                                  <Chip size="sm" color="success" variant="flat">
                                    {getCVRIncrease('blur_preview')}
                                  </Chip>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="space-y-3 pt-2">
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.blur_preview?.enabled || false}
                                onValueChange={(checked) => {
                                  if (checked) {
                                    enableBlockingMechanism('blur_preview', {
                                      blur_amount: editingCard.ctr_mechanisms?.blur_preview?.blur_amount || 5,
                                      teaser_text: editingCard.ctr_mechanisms?.blur_preview?.teaser_text || "Click to see exclusive content",
                                    });
                                  } else {
                                    disableBlockingMechanism('blur_preview');
                                  }
                                }}
                              >
                                Enable Blur Preview
                              </Switch>
                              {editingCard.ctr_mechanisms?.blur_preview?.enabled && (
                                <>
                                  <Input
                                    type="number"
                                    label="Blur Amount (1-10)"
                                    value={String(editingCard.ctr_mechanisms.blur_preview.blur_amount)}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        blur_preview: {
                                          ...editingCard.ctr_mechanisms!.blur_preview!,
                                          blur_amount: parseInt(e.target.value) || 5,
                                        },
                                      })
                                    }
                                    min={1}
                                    max={10}
                                  />
                                  <Input
                                    label="Teaser Text"
                                    value={editingCard.ctr_mechanisms.blur_preview.teaser_text}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        blur_preview: {
                                          ...editingCard.ctr_mechanisms!.blur_preview!,
                                          teaser_text: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </>
                              )}
                            </div>
                          </AccordionItem>

                          {/* Progress Bar */}
                          <AccordionItem
                            key="progress-bar"
                            title={
                              <div className="flex items-center gap-2">
                                <span>Progress Bar Reveal</span>
                                <Tooltip content="Show loading bar that reveals link after completion.">
                                  <Chip size="sm" color="success" variant="flat">
                                    {getCVRIncrease('progress_bar')}
                                  </Chip>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="space-y-3 pt-2">
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.progress_bar?.enabled || false}
                                onValueChange={(checked) => {
                                  if (checked) {
                                    enableBlockingMechanism('progress_bar', {
                                      duration_seconds: editingCard.ctr_mechanisms?.progress_bar?.duration_seconds || 3,
                                      message: editingCard.ctr_mechanisms?.progress_bar?.message || "Loading your exclusive content...",
                                    });
                                  } else {
                                    disableBlockingMechanism('progress_bar');
                                  }
                                }}
                              >
                                Enable Progress Bar
                              </Switch>
                              {editingCard.ctr_mechanisms?.progress_bar?.enabled && (
                                <>
                                  <Input
                                    type="number"
                                    label="Duration (seconds)"
                                    value={String(editingCard.ctr_mechanisms.progress_bar.duration_seconds)}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        progress_bar: {
                                          ...editingCard.ctr_mechanisms!.progress_bar!,
                                          duration_seconds: parseInt(e.target.value) || 3,
                                        },
                                      })
                                    }
                                    min={1}
                                    max={30}
                                  />
                                  <Input
                                    label="Message"
                                    value={editingCard.ctr_mechanisms.progress_bar.message}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        progress_bar: {
                                          ...editingCard.ctr_mechanisms!.progress_bar!,
                                          message: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </>
                              )}
                            </div>
                          </AccordionItem>

                        </Accordion>

                        {/* Section: Advanced Options */}
                        <div className="my-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Chip 
                              size="sm" 
                              color="secondary" 
                              variant="flat"
                              startContent={<Icon icon="solar:settings-bold" width={12} />}
                            >
                              Advanced Options
                            </Chip>
                          </div>
                        </div>

                        <Accordion variant="splitted">
                          {/* Access Code */}
                          <AccordionItem
                            key="access-code"
                            title={
                              <div className="flex items-center gap-2">
                                <span>Access Code Protection</span>
                                <Tooltip content="Require a password/code to unlock the link.">
                                  <Chip size="sm" color="success" variant="flat">
                                    {getCVRIncrease('access_code')}
                                  </Chip>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="space-y-3 pt-2">
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.access_code?.enabled || false}
                                onValueChange={(checked) =>
                                  updateEditingCardCTRMechanisms({
                                    access_code: {
                                      enabled: checked,
                                      code: editingCard.ctr_mechanisms?.access_code?.code || "",
                                      hint: editingCard.ctr_mechanisms?.access_code?.hint || "",
                                    },
                                  })
                                }
                              >
                                Enable Access Code
                              </Switch>
                              {editingCard.ctr_mechanisms?.access_code?.enabled && (
                                <>
                                  <Input
                                    label="Access Code"
                                    value={editingCard.ctr_mechanisms.access_code.code}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        access_code: {
                                          ...editingCard.ctr_mechanisms!.access_code!,
                                          code: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="secret123"
                                  />
                                  <Input
                                    label="Hint (Optional)"
                                    value={editingCard.ctr_mechanisms.access_code.hint || ""}
                                    onChange={(e) =>
                                      updateEditingCardCTRMechanisms({
                                        access_code: {
                                          ...editingCard.ctr_mechanisms!.access_code!,
                                          hint: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Check your email"
                                  />
                                </>
                              )}
                            </div>
                          </AccordionItem>

                          {/* Visual Effects */}
                          <AccordionItem
                            key="visual-effects"
                            title={
                              <div className="flex items-center gap-2">
                                <span>Visual Effects</span>
                                <Tooltip content="Add animations and effects to attract attention.">
                                  <Chip size="sm" color="success" variant="flat">
                                    {getCVRIncrease('confetti')}
                                  </Chip>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className="space-y-3 pt-2">
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.visual_effects?.pulse_animation || false}
                                onValueChange={(checked) =>
                                  updateEditingCardCTRMechanisms({
                                    visual_effects: {
                                      ...editingCard.ctr_mechanisms?.visual_effects,
                                      pulse_animation: checked,
                                      glow_effect: editingCard.ctr_mechanisms?.visual_effects?.glow_effect || false,
                                      confetti_on_reveal: editingCard.ctr_mechanisms?.visual_effects?.confetti_on_reveal || false,
                                    },
                                  })
                                }
                              >
                                Pulse Animation
                              </Switch>
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.visual_effects?.glow_effect || false}
                                onValueChange={(checked) =>
                                  updateEditingCardCTRMechanisms({
                                    visual_effects: {
                                      ...editingCard.ctr_mechanisms?.visual_effects,
                                      pulse_animation: editingCard.ctr_mechanisms?.visual_effects?.pulse_animation || false,
                                      glow_effect: checked,
                                      confetti_on_reveal: editingCard.ctr_mechanisms?.visual_effects?.confetti_on_reveal || false,
                                    },
                                  })
                                }
                              >
                                Glow Effect
                              </Switch>
                              <Switch
                                isSelected={editingCard.ctr_mechanisms?.visual_effects?.confetti_on_reveal || false}
                                onValueChange={(checked) =>
                                  updateEditingCardCTRMechanisms({
                                    visual_effects: {
                                      ...editingCard.ctr_mechanisms?.visual_effects,
                                      pulse_animation: editingCard.ctr_mechanisms?.visual_effects?.pulse_animation || false,
                                      glow_effect: editingCard.ctr_mechanisms?.visual_effects?.glow_effect || false,
                                      confetti_on_reveal: checked,
                                    },
                                  })
                                }
                              >
                                Confetti on Reveal
                              </Switch>
                            </div>
                          </AccordionItem>
                        </Accordion>

                        {/* 18+ Requirement */}
                        <div className="pt-4 border-t border-default-200">
                          <Switch
                            isSelected={editingCard.require_18plus || false}
                            isDisabled={
                              editingCard.style.logo_name === "OnlyFans" ||
                              editingCard.style.logo_name === "Fansly" ||
                              editingCard.url.toLowerCase().includes("onlyfans.com") ||
                              editingCard.url.toLowerCase().includes("fansly.com")
                            }
                            onValueChange={(checked) =>
                              updateEditingCard({ require_18plus: checked })
                            }
                          >
                            <div className="flex items-center gap-2">
                              <span>Require 18+ Confirmation</span>
                              <Chip size="sm" color="warning" variant="flat">
                                Adult Content
                              </Chip>
                            </div>
                          </Switch>
                          <p className="text-xs text-default-500 mt-1 ml-10">
                            {(editingCard.style.logo_name === "OnlyFans" ||
                              editingCard.style.logo_name === "Fansly" ||
                              editingCard.url.toLowerCase().includes("onlyfans.com") ||
                              editingCard.url.toLowerCase().includes("fansly.com"))
                              ? "Age confirmation is required for adult platforms (automatically enabled)"
                              : "Shows age confirmation for adult platforms (OnlyFans, Fansly, etc.)"}
                          </p>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Preview */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Preview
                      </label>
                      <Card
                        className="w-full overflow-hidden"
                        style={getCardPreviewStyle(editingCard)}
                      >
                        <CardBody className="p-6 min-h-[140px] flex flex-col justify-center relative">
                          {/* Video Background */}
                          {editingCard.style.type === "video" && editingCard.style.background_video && (
                            <video
                              src={editingCard.style.background_video}
                              autoPlay
                              loop
                              muted
                              className="absolute inset-0 w-full h-full object-cover opacity-60"
                            />
                          )}
                          <div className="text-center relative z-10">
                            {/* Logo - works with all backgrounds now */}
                            {editingCard.style.logo_icon && (
                              <div className="mb-3">
                                <Icon
                                  icon={editingCard.style.logo_icon}
                                  width={40}
                                  style={{
                                    color:
                                      editingCard.style.logo_color || "#fff",
                                    filter: editingCard.style.type === "image" || editingCard.style.type === "video"
                                      ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                                      : "none",
                                  }}
                                />
                                {editingCard.style.logo_name && (
                                  <p
                                    className="font-bold text-lg mt-1"
                                    style={{
                                      color:
                                        editingCard.style.logo_color || "#fff",
                                      textShadow: editingCard.style.type === "image" || editingCard.style.type === "video"
                                        ? "0 2px 4px rgba(0,0,0,0.3)"
                                        : "none",
                                    }}
                                  >
                                    {editingCard.style.prefix_text && (
                                      <span className="mr-1">
                                        {editingCard.style.prefix_text}
                                      </span>
                                    )}
                                    {editingCard.style.logo_name}
                                  </p>
                                )}
                              </div>
                            )}
                            
                            {/* Text content */}
                            <h3
                              className={`text-lg font-semibold ${
                                editingCard.style.type === "image" ||
                                editingCard.style.type === "gradient" ||
                                editingCard.style.type === "solid" ||
                                editingCard.style.type === "video"
                                  ? "text-white"
                                  : "text-foreground"
                              }`}
                              style={{
                                textShadow: editingCard.style.type === "image" || editingCard.style.type === "video"
                                  ? "0 2px 8px rgba(0,0,0,0.5)"
                                  : "none",
                              }}
                            >
                              {editingCard.title}
                            </h3>
                            {editingCard.description && (
                              <p
                                className={`text-sm mt-1 ${
                                  editingCard.style.type === "image" ||
                                  editingCard.style.type === "gradient" ||
                                  editingCard.style.type === "solid" ||
                                  editingCard.style.type === "video"
                                    ? "text-white/90"
                                    : "text-default-500"
                                }`}
                                style={{
                                  textShadow: editingCard.style.type === "image" || editingCard.style.type === "video"
                                    ? "0 1px 4px rgba(0,0,0,0.5)"
                                    : "none",
                                }}
                              >
                                {editingCard.description}
                              </p>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                      
                      {(editingCard.style.type === "image" || editingCard.style.type === "video") && (
                        <p className="text-xs text-default-500 mt-2 text-center">
                          {editingCard.style.type === "image" 
                            ? "Dark gradient overlay applied for text readability"
                            : "Video plays automatically with reduced opacity"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={saveCard}>
                  Save Button
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

