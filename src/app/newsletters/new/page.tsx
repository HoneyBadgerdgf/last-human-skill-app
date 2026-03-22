"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function NewNewsletterPage() {
  const router = useRouter();
  const createNewsletter = useMutation(api.newsletters.create);

  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const id = await createNewsletter({
        title: title.trim(),
        status: "idea",
      });
      router.push(`/newsletters/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href="/newsletters"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Newsletters
      </Link>

      <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--accent)]/10">
              <FileText className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <CardTitle className="text-xl text-[var(--text-primary)]">
              New Newsletter
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[var(--text-secondary)]">
                Newsletter Title *
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your big idea?"
                className="bg-[var(--bg-primary)] border-[var(--border)] text-lg"
                autoFocus
                required
              />
              <p className="text-sm text-[var(--text-tertiary)]">
                Don&apos;t worry, you can change this later. Start with a
                working title.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!title.trim() || isSubmitting}
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
              >
                {isSubmitting ? "Creating..." : "Start Writing"}
              </Button>
              <Link href="/newsletters">
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

      {/* Framework Preview */}
      <Card className="mt-6 bg-[var(--bg-secondary)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            Dan Koe Framework
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            You&apos;ll build your newsletter using this proven structure:
          </p>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xs text-[var(--text-secondary)] shrink-0">
                1
              </span>
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  Audience
                </p>
                <p className="text-[var(--text-tertiary)]">
                  Who are you writing to?
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xs text-[var(--text-secondary)] shrink-0">
                2
              </span>
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  Hyperbolic Truth
                </p>
                <p className="text-[var(--text-tertiary)]">The hook that grabs attention</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xs text-[var(--text-secondary)] shrink-0">
                3
              </span>
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  Pain Point
                </p>
                <p className="text-[var(--text-tertiary)]">
                  The struggle that resonates (400-800 words)
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xs text-[var(--text-secondary)] shrink-0">
                4
              </span>
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  Novel Perspective
                </p>
                <p className="text-[var(--text-tertiary)]">
                  Your unique insight (400-800 words)
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xs text-[var(--text-secondary)] shrink-0">
                5
              </span>
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  Unique Mechanism
                </p>
                <p className="text-[var(--text-tertiary)]">
                  Actionable steps (400-800 words)
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xs text-[var(--text-secondary)] shrink-0">
                6
              </span>
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  Core Takeaway
                </p>
                <p className="text-[var(--text-tertiary)]">
                  One thing to remember + CTA
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
