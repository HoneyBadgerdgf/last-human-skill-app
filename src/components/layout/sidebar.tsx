"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bookmark,
  FileText,
  Sparkles,
  Lightbulb,
  Command,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Swipe File", href: "/swipe-file", icon: Bookmark },
  { name: "Transcripts", href: "/transcripts", icon: Youtube },
  { name: "Breakdown", href: "/breakdown", icon: Sparkles },
  { name: "Newsletters", href: "/newsletters", icon: FileText },
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">
          Last Human Skill
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Content Workflow
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Command Palette Hint */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm">
          <Command className="w-4 h-4" />
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 bg-[var(--bg-primary)] rounded text-xs">
            ⌘K
          </kbd>
        </div>
      </div>
    </aside>
  );
}
