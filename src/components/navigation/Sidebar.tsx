// src/components/navigation/Sidebar.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";

const navItems = [
  {
    section: "PREPARE",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Coach & Interviews",
        href: "/coach",
        icon: Calendar,
        notification: true,
      },
      {
        label: "Sessions",
        href: "/sessions",
        icon: BookOpen,
      },
      {
        label: "Insight & Progress",
        href: "/progress",
        icon: BarChart3,
      },
    ],
  },
  {
    section: "LEARN",
    items: [
      {
        label: "Resources",
        href: "/resources",
        icon: BookOpen,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] border-r border-gray-200 bg-[#F8F8F6] px-5 py-6 flex flex-col">
      
      {/* Logo */}
      <div className="mb-10 flex items-center">
        <Image
          src="/logo.png"
          alt="MindGym Logo"
          width={150}
          height={40}
          priority
        />
      </div>

      {/* Navigation */}
      <div className="flex-1">
        {navItems.map((section) => (
          <div key={section.section} className="mb-8">
            <p className="mb-3 text-xs font-semibold tracking-widest text-gray-400">
              {section.section}
            </p>

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                      isActive
                        ? "bg-[#DDF4EE] text-[#0C6B58]"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />

                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                    </div>

                    {item.notification && !isActive && (
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Links */}
      <div className="border-t border-gray-200 pt-6 space-y-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-500 hover:bg-gray-100"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </Link>

        <Link
          href="/help"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-500 hover:bg-gray-100"
        >
          <HelpCircle size={18} />
          <span className="text-sm font-medium">Help</span>
        </Link>
      </div>
    </aside>
  );
}