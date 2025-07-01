"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, HelpCircle, Menu } from "lucide-react";
import { UserDropdown } from "./user-dropdown";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

interface EnhancedHeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  isMobile?: boolean;
  sidebarOpen?: boolean;
}

export function EnhancedHeader({
  onToggleSidebar,
  onOpenSettings,
  isMobile = false,
  sidebarOpen = false,
}: EnhancedHeaderProps) {
  const handleMenuClick = () => {
    onToggleSidebar();
  };

  return (
    <header className="flex items-center justify-between px-4 h-16 bg-[#212121]">
      {/* Left: Logo or menu */}
      <div className="flex items-center gap-2">
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 h-10 w-10 touch-target"
            onClick={handleMenuClick}
            aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={sidebarOpen}
            aria-controls="mobile-sidebar"
            aria-haspopup="true"
          >
            <Menu className="h-5 w-5" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-white font-medium text-base">ChatGPT</h1>
            <ChevronDown className="h-4 w-4 text-white/70" />
          </div>
        )}
      </div>

      {/* Right: Auth */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton>
            <button className="bg-white text-black rounded-full font-medium text-sm px-4 py-1.5 hover:bg-white/90 transition h-9">
              Log in
            </button>
          </SignInButton>

          <SignUpButton>
            <button className="border border-white/10 text-white rounded-full font-medium text-sm px-4 py-1.5 hover:bg-white/10 transition h-9">
              Sign up for free
            </button>
          </SignUpButton>

          <button
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </SignedOut>

        <SignedIn>
          <UserDropdown onOpenSettings={onOpenSettings} />
        </SignedIn>
      </div>
    </header>
  );
}
