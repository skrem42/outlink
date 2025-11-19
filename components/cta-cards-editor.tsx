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
import { ColorGradientPicker } from "./color-gradient-picker";
import { ImageUploader } from "./image-uploader";
import type { CTACard, CTACardStyle } from "@/types/database";

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
                      onChange={(e) => updateEditingCard({ url: e.target.value })}
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
                            : key as "solid" | "gradient" | "image";
                          updateEditingCardStyle({ type });
                        }}
                        fullWidth
                      >
                        <Tab key="none" title="None" />
                        <Tab key="solid" title="Solid Color" />
                        <Tab key="gradient" title="Gradient" />
                        <Tab key="image" title="Image" />
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
                    </div>

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
                                    filter: editingCard.style.type === "image"
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
                                      textShadow: editingCard.style.type === "image"
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
                                editingCard.style.type === "solid"
                                  ? "text-white"
                                  : "text-foreground"
                              }`}
                              style={{
                                textShadow: editingCard.style.type === "image"
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
                                  editingCard.style.type === "solid"
                                    ? "text-white/90"
                                    : "text-default-500"
                                }`}
                                style={{
                                  textShadow: editingCard.style.type === "image"
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
                      
                      {editingCard.style.type === "image" && (
                        <p className="text-xs text-default-500 mt-2 text-center">
                          Dark gradient overlay applied for text readability
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

