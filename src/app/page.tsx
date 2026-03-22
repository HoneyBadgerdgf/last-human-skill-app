"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  BookmarkPlus,
  FileText,
  ArrowRight,
  Plus,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const stats = useQuery(api.stats.getDashboardStats);
  const recentIdeas = useQuery(api.ideas.recent, { limit: 3 });
  const createIdea = useMutation(api.ideas.create);
  const [quickIdea, setQuickIdea] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  const handleQuickCapture = async () => {
    if (!quickIdea.trim()) return;
    setIsCapturing(true);
    try {
      await createIdea({ content: quickIdea });
      setQuickIdea("");
    } finally {
      setIsCapturing(false);
    }
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Calculate newsletter progress
  const getNewsletterProgress = () => {
    if (!stats?.currentNewsletter) return 0;
    const sections = [
      stats.currentNewsletter.audience,
      stats.currentNewsletter.hyperbolicTruth,
      stats.currentNewsletter.painPoint,
      stats.currentNewsletter.novelPerspective,
      stats.currentNewsletter.uniqueMechanism,
      stats.currentNewsletter.coreTakeaway,
    ];
    const completed = sections.filter(Boolean).length;
    return Math.round((completed / 6) * 100);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
          {getGreeting()}, David.
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Let&apos;s create something meaningful today.
        </p>
      </div>

      {/* Current Newsletter */}
      <Card className="mb-8 bg-[var(--bg-secondary)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            Current Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.currentNewsletter ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {stats.currentNewsletter.title}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">
                    Progress
                  </span>
                  <span className="text-[var(--text-primary)]">
                    {getNewsletterProgress()}%
                  </span>
                </div>
                <Progress value={getNewsletterProgress()} className="h-2" />
              </div>
              <Link href={`/newsletters/${stats.currentNewsletter._id}`}>
                <Button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
                  Continue Writing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-[var(--text-secondary)] mb-4">
                No newsletter in progress
              </p>
              <Link href="/newsletters/new">
                <Button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Newsletter
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {stats?.writingStreak || 0}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  day streak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <BookmarkPlus className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {stats?.swipeItemCount || 0}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  swipe items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--accent)]/10">
                <FileText className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {stats?.newsletterCount || 0}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  newsletters
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Capture + Recent Ideas */}
      <div className="grid grid-cols-2 gap-8">
        {/* Quick Capture */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
              Quick Capture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Capture a fleeting idea..."
                value={quickIdea}
                onChange={(e) => setQuickIdea(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQuickCapture()}
                className="bg-[var(--bg-primary)] border-[var(--border)]"
              />
              <Button
                onClick={handleQuickCapture}
                disabled={!quickIdea.trim() || isCapturing}
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Ideas */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
              Recent Ideas
            </CardTitle>
            <Link
              href="/ideas"
              className="text-xs text-[var(--accent)] hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentIdeas && recentIdeas.length > 0 ? (
              <ul className="space-y-2">
                {recentIdeas.map((idea) => (
                  <li
                    key={idea._id}
                    className="flex items-start gap-2 text-sm text-[var(--text-primary)]"
                  >
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{idea.content}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">
                No ideas captured yet. Start writing!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
