"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Spacer } from "@heroui/spacer";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export const Sidebar = ({ isMobileMenuOpen = false, onMobileMenuClose }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    {
      key: "links",
      title: "My Links",
      icon: "solar:link-circle-bold-duotone",
      href: "/dashboard/links",
    },
    {
      key: "analytics",
      title: "Analytics",
      icon: "solar:chart-bold-duotone",
      href: "/dashboard/analytics",
    },
    {
      key: "creators",
      title: "My Creators",
      icon: "solar:users-group-rounded-bold-duotone",
      href: "/dashboard/creators",
    },
    {
      key: "domains",
      title: "Domains",
      icon: "solar:global-bold-duotone",
      href: "/dashboard/domains",
    },
  ];

  const handleLinkClick = () => {
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={onMobileMenuClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={clsx(
          "fixed md:static inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-divider bg-content1 p-6 transition-transform duration-300 md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button for mobile */}
        <button
          onClick={onMobileMenuClose}
          className="absolute right-4 top-4 md:hidden rounded-lg p-2 hover:bg-default-100 transition-colors"
        >
          <Icon icon="solar:close-circle-bold" width={24} className="text-default-600" />
        </button>

        {/* Logo/Brand */}
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Icon icon="solar:link-circle-bold" className="text-white" width={20} />
          </div>
          <span className="text-xl font-bold">outlink</span>
        </div>

        <Spacer y={8} />

        {/* Navigation */}
        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.key} href={item.href} onClick={handleLinkClick}>
                  <div
                    className={clsx(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-default-600 hover:bg-default-100"
                    )}
                  >
                    <Icon icon={item.icon} width={24} />
                    <span className="text-small font-medium">{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>

        <Spacer y={4} />

        <div className="px-3">
          <div className="h-px bg-divider" />
        </div>

        <Spacer y={4} />

        {/* Settings Section */}
        <div className="flex flex-col gap-2">
          <Link href="/dashboard/settings" onClick={handleLinkClick}>
            <div
              className={clsx(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                pathname === "/dashboard/settings"
                  ? "bg-primary text-primary-foreground"
                  : "text-default-600 hover:bg-default-100"
              )}
            >
              <Icon icon="solar:settings-bold-duotone" width={24} />
              <span className="text-small font-medium">Settings</span>
            </div>
          </Link>
        </div>
      </ScrollShadow>

      <Spacer y={4} />

        {/* Pro Card */}
        <div className="mt-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary p-4">
            <div className="relative z-10">
              <Chip
                size="sm"
                variant="flat"
                className="bg-white/20 text-white backdrop-blur-md"
              >
                Free Plan
              </Chip>
              <Spacer y={2} />
              <p className="text-small font-semibold text-white">
                Upgrade to Pro
              </p>
              <Spacer y={1} />
              <p className="text-tiny text-white/80">
                Unlock unlimited links, custom domains, and advanced analytics
              </p>
              <Spacer y={3} />
              <Button
                size="sm"
                className="bg-white text-primary font-semibold"
                fullWidth
                endContent={<Icon icon="solar:arrow-right-linear" width={16} />}
              >
                Upgrade Now
              </Button>
            </div>
            {/* Decorative gradient orbs */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
          </div>
        </div>
      </div>
    </>
  );
};



