"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  notification?: boolean;
  children?: NavChild[];
};

interface SidebarProps {
  onClose?: () => void;
}

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
        children: [
          { label: "Coach", href: "/coach" },
          { label: "My Interviews", href: "/coach/interviews" },
        ],
      },
      {
        label: "Sessions",
        href: "/sessions/history",
        icon: BookOpen,
        children: [
          {
            label: "Start meditation session",
            href: "/sessions/setup/emotions",
          },
          {
            label: "Session History",
            href: "/sessions/history",
          },
        ],
      },
      {
        label: "Insight & Progress",
        href: "/progress",
        icon: BarChart3,
        children: [
          {
            label: "Progress",
            href: "/progress",
          },
          {
            label: "Insights",
            href: "/progress/insights",
          },
        ],
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

export default function Sidebar({
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const [openDropdown, setOpenDropdown] =
    useState<string | null>("Coach & Interviews");

  return (
    <aside className="w-[260px] shrink-0 border-r border-gray-200 bg-[#F8F8F6] px-5 py-6 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="mb-10 flex items-center">
        <Image
          src="/logo.png"
          alt="MindGym Logo"
          width={150}
          height={40}
          priority
          className="h-auto max-w-full"
        />
      </div>

      {/* Navigation */}
      <div className="flex-1">
        {navItems.map((section) => (
          <div
            key={section.section}
            className="mb-8"
          >
            <p className="mb-3 text-xs font-semibold tracking-widest text-gray-400">
              {section.section}
            </p>

            <div className="space-y-2">
              {section.items.map((item: NavItem) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href ||
                  item.children?.some(
                    (child) =>
                      pathname === child.href
                  );

                const isOpen =
                  openDropdown === item.label;

                return (
                  <div key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdown(
                              isOpen
                                ? null
                                : item.label
                            )
                          }
                          className={`w-full min-h-[48px] flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
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

                          <div className="flex items-center gap-2">
                            {item.notification &&
                              !isActive && (
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                              )}

                            {isOpen ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="ml-8 mt-2 flex flex-col gap-1 border-l border-gray-200 pl-4">
                            {item.children.map(
                              (child) => {
                                const childActive =
                                  pathname ===
                                  child.href;

                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() =>
                                      onClose?.()
                                    }
                                    className={`min-h-[44px] rounded-lg px-3 py-2 text-sm transition-all ${
                                      childActive
                                        ? "bg-[#DDF4EE] text-[#0C6B58] font-medium"
                                        : "text-gray-500 hover:bg-gray-100"
                                    }`}
                                  >
                                    {child.label}
                                  </Link>
                                );
                              }
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => onClose?.()}
                        className={`min-h-[48px] flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
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

                        {item.notification &&
                          !isActive && (
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                          )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 pt-6 space-y-2">
        <Link
          href="/settings"
          onClick={() => onClose?.()}
          className="min-h-[48px] flex items-center gap-3 rounded-xl px-4 py-3 text-gray-500 hover:bg-gray-100"
        >
          <Settings size={18} />

          <span className="text-sm font-medium">
            Settings
          </span>
        </Link>

        <Link
          href="/help"
          onClick={() => onClose?.()}
          className="min-h-[48px] flex items-center gap-3 rounded-xl px-4 py-3 text-gray-500 hover:bg-gray-100"
        >
          <HelpCircle size={18} />

          <span className="text-sm font-medium">
            Help
          </span>
        </Link>
      </div>
    </aside>
  );
}
