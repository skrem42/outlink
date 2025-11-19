"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import type { BackgroundGradient } from "@/types/database";

interface ColorGradientPickerProps {
  value: BackgroundGradient;
  onChange: (gradient: BackgroundGradient) => void;
  label?: string;
}

const presetGradients: BackgroundGradient[] = [
  { start: "#8B5CF6", end: "#EC4899" }, // Purple to Pink
  { start: "#3B82F6", end: "#8B5CF6" }, // Blue to Purple
  { start: "#10B981", end: "#3B82F6" }, // Green to Blue
  { start: "#F59E0B", end: "#EF4444" }, // Orange to Red
  { start: "#EC4899", end: "#F97316" }, // Pink to Orange
  { start: "#6366F1", end: "#10B981" }, // Indigo to Green
  { start: "#8B5CF6", end: "#06B6D4" }, // Purple to Cyan
  { start: "#EF4444", end: "#8B5CF6" }, // Red to Purple
];

export function ColorGradientPicker({
  value,
  onChange,
  label = "Background Gradient",
}: ColorGradientPickerProps) {
  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium">{label}</label>}

      {/* Preset Gradients */}
      <div className="grid grid-cols-4 gap-2">
        {presetGradients.map((gradient, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onChange(gradient)}
            className={`h-12 rounded-lg transition-transform hover:scale-105 ${
              value.start === gradient.start && value.end === gradient.end
                ? "ring-2 ring-primary ring-offset-2"
                : ""
            }`}
            style={{
              background: `linear-gradient(135deg, ${gradient.start}, ${gradient.end})`,
            }}
          />
        ))}
      </div>

      {/* Custom Color Pickers */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-default-500 mb-1 block">
            Start Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={value.start}
              onChange={(e) => onChange({ ...value, start: e.target.value })}
              className="w-12 h-10 rounded cursor-pointer border-2 border-default-200"
            />
            <Input
              size="sm"
              value={value.start}
              onChange={(e) => onChange({ ...value, start: e.target.value })}
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-default-500 mb-1 block">
            End Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={value.end}
              onChange={(e) => onChange({ ...value, end: e.target.value })}
              className="w-12 h-10 rounded cursor-pointer border-2 border-default-200"
            />
            <Input
              size="sm"
              value={value.end}
              onChange={(e) => onChange({ ...value, end: e.target.value })}
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <Card>
        <CardBody className="p-6">
          <div
            className="h-24 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${value.start}, ${value.end})`,
            }}
          />
          <p className="text-xs text-center text-default-500 mt-2">Preview</p>
        </CardBody>
      </Card>
    </div>
  );
}


