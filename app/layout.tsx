import type { Metadata } from "next";
import React from "react";
import "@/globals.css";

export const metadata: Metadata = {
  title: "MindGym",
  description: "Your interview preparation companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Add suppressHydrationWarning to the body tag */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}