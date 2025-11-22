"use client";

import React from "react";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/theme";

interface LinkTypeSwitcherProps {
  value: "whitehat" | "greyhat" | "blackhat";
  onChange: (value: "whitehat" | "greyhat" | "blackhat") => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const linkTypes = [
  {
    value: "whitehat" as const,
    label: "Whitehat",
    icon: "solar:document-text-bold-duotone",
    color: "text-primary",
  },
  {
    value: "greyhat" as const,
    label: "Greyhat",
    icon: "solar:shield-warning-bold-duotone",
    color: "text-warning",
  },
  {
    value: "blackhat" as const,
    label: "Blackhat",
    icon: "solar:link-bold-duotone",
    color: "text-default-500",
  },
];

export function LinkTypeSwitcher({
  value,
  onChange,
  size = "sm",
  className,
}: LinkTypeSwitcherProps) {
  const currentType = linkTypes.find((type) => type.value === value);

  return (
    <Select
      size={size}
      selectedKeys={[value]}
      onChange={(e) =>
        onChange(e.target.value as "whitehat" | "greyhat" | "blackhat")
      }
      className={cn("min-w-[140px]", className)}
      aria-label="Link type"
      renderValue={() => (
        <div className="flex items-center gap-2">
          <Icon
            icon={currentType?.icon || ""}
            width={16}
            className={currentType?.color}
          />
          <span>{currentType?.label}</span>
        </div>
      )}
    >
      {linkTypes.map((type) => (
        <SelectItem
          key={type.value}
          value={type.value}
          startContent={
            <Icon icon={type.icon} width={18} className={type.color} />
          }
        >
          {type.label}
        </SelectItem>
      ))}
    </Select>
  );
}

