"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Youtube,
  MessageSquare,
  FileText,
  Quote,
  Image as ImageIcon,
  Lightbulb,
  X,
  Plus,
} from "lucide-react";
import Link from "next/link";

type SwipeType = "youtube" | "post" | "article" | "quote" | "image" | "idea";

const typeOptions = [
  { value: "youtube", label: "YouTube Video", icon: Youtube },
  { value: "post", label: "Social Post", icon: MessageSquare },
  { value: "article", label: "Article", icon: FileText },
  { value: "quote", label: "Quote", icon: Quote },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "idea", label: "Idea", icon: Lightbulb },
];

export default function NewSwipeItemPage() {
  const router = useRouter();
  const createItem = useMutation(api.swipeItems.create);

  const [type, setType] = useState<SwipeType>("article");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");
  const [whatToEmulate, setWhatToEmulate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createItem({
        type,
        title: title.trim(),
        url: url.trim() || undefined,
        content: content.trim() || undefined,
        notes: notes.trim() || undefined,
        whatToEmulate: whatToEmulate.trim() || undefined,
        tags,
      });
      router.push("/swipe-file");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href="/swipe-file"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Swipe File
      </Link>

      <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-xl text-[var(--text-primary)]">
            Add to Swipe File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type */}
            <div className="space-y-2">
              <Label className="text-[var(--text-secondary)]">Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as SwipeType)}
              >
                <SelectTrigger className="bg-[var(--bg-primary)] border-[var(--border)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--bg-secondary)] border-[var(--border)]">
                  {typeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-[var(--text-secondary)]">Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is this piece of content?"
                className="bg-[var(--bg-primary)] border-[var(--border)]"
                required
              />
            </div>

            {/* URL */}
            {type !== "idea" && type !== "quote" && (
              <div className="space-y-2">
                <Label className="text-[var(--text-secondary)]">URL</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  type="url"
                  className="bg-[var(--bg-primary)] border-[var(--border)]"
                />
              </div>
            )}

            {/* Content (for quotes/ideas) */}
            {(type === "quote" || type === "idea") && (
              <div className="space-y-2">
                <Label className="text-[var(--text-secondary)]">Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    type === "quote" ? "The quote text..." : "Your idea..."
                  }
                  className="bg-[var(--bg-primary)] border-[var(--border)] min-h-[100px]"
                />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-[var(--text-secondary)]">
                Why is it good?
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What caught your attention about this content?"
                className="bg-[var(--bg-primary)] border-[var(--border)] min-h-[80px]"
              />
            </div>

            {/* What to emulate */}
            <div className="space-y-2">
              <Label className="text-[var(--text-secondary)]">
                What to emulate
              </Label>
              <Textarea
                value={whatToEmulate}
                onChange={(e) => setWhatToEmulate(e.target.value)}
                placeholder="What specific techniques or elements could you use?"
                className="bg-[var(--bg-primary)] border-[var(--border)] min-h-[80px]"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-[var(--text-secondary)]">Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag..."
                  className="bg-[var(--bg-primary)] border-[var(--border)]"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="secondary"
                  className="bg-[var(--bg-tertiary)] border-[var(--border)]"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!title.trim() || isSubmitting}
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
              >
                {isSubmitting ? "Saving..." : "Save to Swipe File"}
              </Button>
              <Link href="/swipe-file">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-[var(--text-secondary)]"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
