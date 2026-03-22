"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  FileText,
  Bookmark,
  Lightbulb,
  Home,
  Plus,
  Search,
  Sparkles,
  PenLine,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[560px] max-w-[90vw] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-50"
    >
      <div className="flex items-center border-b border-[var(--border)] px-4">
        <Search className="w-4 h-4 text-[var(--text-secondary)] mr-2" />
        <Command.Input
          placeholder="Type a command or search..."
          className="flex-1 py-4 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
        />
      </div>

      <Command.List className="max-h-[300px] overflow-y-auto p-2">
        <Command.Empty className="py-6 text-center text-[var(--text-secondary)]">
          No results found.
        </Command.Empty>

        <Command.Group
          heading="Navigation"
          className="px-2 py-1.5 text-xs text-[var(--text-tertiary)] font-medium"
        >
          <Command.Item
            onSelect={() => runCommand(() => router.push("/"))}
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] data-[selected=true]:bg-[var(--bg-tertiary)]"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => router.push("/swipe-file"))}
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] data-[selected=true]:bg-[var(--bg-tertiary)]"
          >
            <Bookmark className="w-4 h-4" />
            Swipe File
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => router.push("/newsletters"))}
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] data-[selected=true]:bg-[var(--bg-tertiary)]"
          >
            <FileText className="w-4 h-4" />
            Newsletters
          </Command.Item>
        </Command.Group>

        <Command.Group
          heading="Actions"
          className="px-2 py-1.5 text-xs text-[var(--text-tertiary)] font-medium mt-2"
        >
          <Command.Item
            onSelect={() => runCommand(() => router.push("/newsletters/new"))}
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] data-[selected=true]:bg-[var(--bg-tertiary)]"
          >
            <Plus className="w-4 h-4" />
            New Newsletter
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => router.push("/swipe-file/new"))}
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] data-[selected=true]:bg-[var(--bg-tertiary)]"
          >
            <Bookmark className="w-4 h-4" />
            Add to Swipe File
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => router.push("/ideas/new"))}
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] data-[selected=true]:bg-[var(--bg-tertiary)]"
          >
            <Lightbulb className="w-4 h-4" />
            Quick Capture Idea
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => router.push("/breakdown"))}
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] data-[selected=true]:bg-[var(--bg-tertiary)]"
          >
            <Sparkles className="w-4 h-4" />
            Content Breakdown
          </Command.Item>
        </Command.Group>
      </Command.List>

      <div className="border-t border-[var(--border)] px-4 py-2 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <span>
          <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[10px]">
            ↵
          </kbd>{" "}
          to select
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[10px]">
            esc
          </kbd>{" "}
          to close
        </span>
      </div>
    </Command.Dialog>
  );
}

// Backdrop overlay
export function CommandPaletteBackdrop() {
  return null; // The dialog handles its own backdrop
}
