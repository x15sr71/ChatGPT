"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Palette,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";

interface UserDropdownProps {
  onOpenSettings: () => void;
}

export function UserDropdown({ onOpenSettings }: UserDropdownProps) {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user.firstName?.[0] ?? "U"}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-[#2a2a2a] border-white/10 text-white min-w-[240px] mr-4"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuItem className="hover:bg-white/10 cursor-default px-3 py-2">
          <div className="flex items-center gap-3 w-full">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="User Avatar"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {user.firstName?.[0] ?? "U"}
              </div>
            )}
            <span className="text-sm truncate">{user.emailAddresses[0]?.emailAddress}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer px-3 py-2">
          <div className="flex items-center gap-3 w-full">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">Upgrade plan</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer px-3 py-2">
          <div className="flex items-center gap-3 w-full">
            <Palette className="h-4 w-4" />
            <span className="text-sm">Customize ChatGPT</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="hover:bg-white/10 cursor-pointer px-3 py-2"
          onClick={onOpenSettings}
        >
          <div className="flex items-center gap-3 w-full">
            <Settings className="h-4 w-4" />
            <span className="text-sm">Settings</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer px-3 py-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Help</span>
            </div>
            <div className="text-white/50">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="hover:bg-white/10 cursor-pointer px-3 py-2"
          onClick={() => signOut()}
        >
          <div className="flex items-center gap-3 w-full">
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Log out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
