"use client";

import { useState } from "react";
import Sidebar from "../../components/navigation/Sidebar";
import TopBar from "../../components/navigation/TopBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  return (
    <div className="flex h-screen bg-[#F6F6F4] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          />

          {/* Sidebar Drawer */}
          <div className="fixed left-0 top-0 z-50 h-screen md:hidden">
            <Sidebar
              onClose={() =>
                setMobileSidebarOpen(false)
              }
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}