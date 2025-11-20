"use client";

import React from "react";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface ScarcityBadgeProps {
  type: "slots" | "viewers";
  count: number;
  total?: number;
  message?: string;
}

export function ScarcityBadge({
  type,
  count,
  total,
  message,
}: ScarcityBadgeProps) {
  const isSlots = type === "slots";
  
  // Replace template variables in custom message
  const getDisplayMessage = () => {
    if (message) {
      return message
        .replace('{current}', String(count))
        .replace('{total}', String(total || 0));
    }
    return isSlots ? `Only ${count}/${total} left!` : `${count} watching now`;
  };
  
  return (
    <>
      {isSlots ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 left-2 z-[10]"
        >
          <Chip
            color="danger"
            variant="solid"
            size="sm"
            className="font-semibold"
            startContent={<Icon icon="solar:fire-bold" width={14} />}
          >
            {getDisplayMessage()}
          </Chip>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 z-[10]"
        >
          <Chip
            color="success"
            variant="solid"
            size="sm"
            className="font-semibold"
            startContent={
              <span className="flex items-center">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block w-2 h-2 rounded-full bg-white mr-1"
                />
              </span>
            }
          >
            {getDisplayMessage()}
          </Chip>
        </motion.div>
      )}
    </>
  );
}

