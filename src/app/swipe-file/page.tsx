"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Youtube,
  MessageSquare,
  FileText,
  Quote,
  Image as ImageIcon,
  Lightbulb,
  Sparkles,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "../../../convex/_generated/dataModel";

const typeIcons = {
  youtube: Youtube,
  post: MessageSquare,
  article: FileText,
  quote: Quote,
  image: ImageIcon,
  idea: Lightbulb,
};

const typeColors = {
  youtube: "text-red-500 bg-red-500/10",
  post: "text-blue-500 bg-blue-500/10",
  article: "text-purple-500 bg-purple-500/10",
  quote: "text-yellow-500 bg-yellow-500/10",
  image: "text-pink-500 bg-pink-500/10",
  idea: "text-[var(--accent)] bg-[var(--accent)]/10",
};

type SwipeType = "youtube" | "post" | "article" | "quote" | "image" | "idea";

export default function SwipeFilePage() {
  const [filterType, setFilterType] = useState<SwipeType | "all">("all");
  const swipeItems = useQuery(
    api.swipeItems.list,
    filterType === "all" ? {} : { type: filterType }
  );
  const deleteItem = useMutation(api.swipeItems.remove);

  const handleDelete = async (id: Id<"swipeItems">) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem({ id });
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Swipe File
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Capture and organize inspiration from anywhere
          </p>
        </div>
        <Link href="/swipe-file/new">
          <Button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Select
          value={filterType}
          onValueChange={(v) => setFilterType(v as SwipeType | "all")}
        >
          <SelectTrigger className="w-48 bg-[var(--bg-secondary)] border-[var(--border)]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--bg-secondary)] border-[var(--border)]">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="post">Posts</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
            <SelectItem value="quote">Quotes</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="idea">Ideas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {swipeItems && swipeItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {swipeItems.map((item) => {
            const Icon = typeIcons[item.type];
            const colorClass = typeColors[item.type];

            return (
              <Card
                key={item._id}
                className="bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--border-focus)] transition-colors group"
              >
                <CardContent className="p-4">
                  {/* Type Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-lg ${colorClass.split(" ")[1]}`}
                    >
                      <Icon className={`w-4 h-4 ${colorClass.split(" ")[0]}`} />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-[var(--bg-tertiary)]"
                        >
                          <ExternalLink className="w-4 h-4 text-[var(--text-secondary)]" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 rounded hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-medium text-[var(--text-primary)] line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  {/* Notes */}
                  {item.notes && (
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                      {item.notes}
                    </p>
                  )}

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                        >
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Breakdown indicator */}
                  {item.breakdown ? (
                    <Link href={`/swipe-file/${item._id}/breakdown`}>
                      <Badge className="bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Breakdown ready
                      </Badge>
                    </Link>
                  ) : (
                    <Link href={`/breakdown?id=${item._id}`}>
                      <Badge
                        variant="outline"
                        className="border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Run breakdown
                      </Badge>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="p-4 rounded-full bg-[var(--bg-secondary)] w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Plus className="w-8 h-8 text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
            No inspiration yet
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Start building your swipe file by adding content that inspires you.
          </p>
          <Link href="/swipe-file/new">
            <Button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Item
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
