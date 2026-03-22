import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/command-palette";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Last Human Skill",
  description: "Content workflow for the Last Human Skill newsletter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ConvexClientProvider>
          <div className="flex h-screen bg-[var(--bg-primary)]">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
          <CommandPalette />
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
