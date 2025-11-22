"use client";

import { Sidebar } from "@/components/sidebar";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        onMobileMenuClose={() => setIsMobileMenuOpen(false)} 
      />
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Mobile menu button */}
        <div className="sticky top-0 z-30 flex items-center gap-4 bg-background/80 backdrop-blur-md border-b border-divider p-4 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center justify-center rounded-lg p-2 hover:bg-default-100 transition-colors"
          >
            <Icon icon="solar:hamburger-menu-bold" width={24} className="text-default-600" />
          </button>
          <span className="text-lg font-semibold">outlink</span>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}



