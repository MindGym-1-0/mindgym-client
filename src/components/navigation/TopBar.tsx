"use client";

import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserName } from "@/hooks/useUserName";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const name = useUserName();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      await getSupabaseBrowserClient().auth.signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">

      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg border border-gray-200 p-2 md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <p className="hidden md:block text-sm text-gray-400">
          Overview &gt; Daily Dashboard
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Notification */}
        <button className="rounded-full border border-gray-200 p-2 hover:bg-gray-50 transition-colors">
          🔔
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-2 md:px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DDF4EE] text-sm font-semibold text-[#0C6B58]">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {name}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Log out"
          aria-label="Log out"
          className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}