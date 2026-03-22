"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Save,
  CheckCircle,
  Circle,
  Clock,
  Play,
  Square,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

const statusOptions = [
  { value: "idea", label: "Idea" },
  { value: "outlining", label: "Outlining" },
  { value: "drafting", label: "Drafting" },
  { value: "editing", label: "Editing" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
];

type Status = "idea" | "outlining" | "drafting" | "editing" | "scheduled" | "published";

const sections = [
  {
    key: "audience",
    title: "Audience",
    placeholder: "Who am I writing to? What's their situation?",
    wordTarget: null,
  },
  {
    key: "hyperbolicTruth",
    title: "Hyperbolic Truth",
    placeholder:
      "What extreme-but-true statement can I make? This is the hook.",
    wordTarget: null,
  },
  {
    key: "painPoint",
    title: "Pain Point (Section 1)",
    placeholder:
      "Personal experience or observed struggle. The intro that hooks. (400-800 words)",
    wordTarget: { min: 400, max: 800 },
  },
  {
    key: "novelPerspective",
    title: "Novel Perspective (Section 2)",
    placeholder:
      "The unique frame or insight. What most people miss. (400-800 words)",
    wordTarget: { min: 400, max: 800 },
  },
  {
    key: "uniqueMechanism",
    title: "Unique Mechanism (Section 3)",
    placeholder: "Actionable steps. What should they DO? (400-800 words)",
    wordTarget: { min: 400, max: 800 },
  },
  {
    key: "coreTakeaway",
    title: "Core Takeaway",
    placeholder: "One thing to remember. The CTA.",
    wordTarget: null,
  },
];

export default function NewsletterEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<"newsletters">;

  const newsletter = useQuery(api.newsletters.get, { id });
  const updateNewsletter = useMutation(api.newsletters.update);
  const recordSession = useMutation(api.stats.recordSession);

  const [formData, setFormData] = useState({
    title: "",
    status: "idea" as Status,
    subjectLine: "",
    audience: "",
    hyperbolicTruth: "",
    painPoint: "",
    novelPerspective: "",
    uniqueMechanism: "",
    coreTakeaway: "",
  });

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [sessionStartWordCount, setSessionStartWordCount] = useState(0);

  // Load newsletter data
  useEffect(() => {
    if (newsletter) {
      setFormData({
        title: newsletter.title || "",
        status: newsletter.status || "idea",
        subjectLine: newsletter.subjectLine || "",
        audience: newsletter.audience || "",
        hyperbolicTruth: newsletter.hyperbolicTruth || "",
        painPoint: newsletter.painPoint || "",
        novelPerspective: newsletter.novelPerspective || "",
        uniqueMechanism: newsletter.uniqueMechanism || "",
        coreTakeaway: newsletter.coreTakeaway || "",
      });
    }
  }, [newsletter]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const getTotalWordCount = useCallback(() => {
    const text = [
      formData.audience,
      formData.hyperbolicTruth,
      formData.painPoint,
      formData.novelPerspective,
      formData.uniqueMechanism,
      formData.coreTakeaway,
    ].join(" ");
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [formData]);

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateNewsletter({
        id,
        ...formData,
      });
      setHasChanges(false);
      toast.success("Newsletter saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    setSessionStartWordCount(getTotalWordCount());
    setTimerSeconds(0);
  };

  const handleStopTimer = async () => {
    setIsTimerRunning(false);
    const endWordCount = getTotalWordCount();
    const durationMinutes = Math.round(timerSeconds / 60);

    if (durationMinutes >= 1) {
      await recordSession({
        newsletterId: id,
        durationMinutes,
        wordCountStart: sessionStartWordCount,
        wordCountEnd: endWordCount,
      });
      toast.success(
        `Session recorded: ${durationMinutes} min, ${endWordCount - sessionStartWordCount} words written`
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    const completed = sections.filter(
      (s) => formData[s.key as keyof typeof formData]
    ).length;
    return Math.round((completed / sections.length) * 100);
  };

  if (!newsletter) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-[var(--bg-secondary)] border-r border-[var(--border)] p-4 flex flex-col">
        <Link
          href="/newsletters"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Title */}
        <Input
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="bg-[var(--bg-primary)] border-[var(--border)] text-lg font-semibold mb-4"
        />

        {/* Status */}
        <div className="mb-6">
          <label className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(v) => v && handleChange("status", v)}
          >
            <SelectTrigger className="bg-[var(--bg-primary)] border-[var(--border)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[var(--bg-secondary)] border-[var(--border)]">
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Outline Checklist */}
        <div className="mb-6">
          <label className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
            Outline
          </label>
          <div className="space-y-1">
            {sections.map((section) => {
              const hasContent = Boolean(
                formData[section.key as keyof typeof formData]
              );
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors ${
                    activeSection === section.key
                      ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  {hasContent ? (
                    <CheckCircle className="w-4 h-4 text-[var(--accent)]" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  <span className="truncate">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Word Count */}
        <div className="mb-6">
          <label className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
            Progress
          </label>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Word count</span>
              <span className="text-[var(--text-primary)]">
                {getTotalWordCount()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Completion</span>
              <span className="text-[var(--text-primary)]">{getProgress()}%</span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <label className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
            Writing Session
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-primary)] rounded-md flex-1">
              <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="text-lg font-mono text-[var(--text-primary)]">
                {formatTime(timerSeconds)}
              </span>
            </div>
            {isTimerRunning ? (
              <Button
                onClick={handleStopTimer}
                size="icon"
                variant="ghost"
                className="text-red-500 hover:bg-red-500/10"
              >
                <Square className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleStartTimer}
                size="icon"
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)]"
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto space-y-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-[var(--border)] text-[var(--text-secondary)]"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Subject Line */}
          <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Subject Line
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.subjectLine}
                onChange={(e) => handleChange("subjectLine", e.target.value)}
                placeholder="Your compelling subject line..."
                className="bg-[var(--bg-primary)] border-[var(--border)]"
              />
            </CardContent>
          </Card>

          {/* Sections */}
          {sections.map((section) => {
            const value = formData[section.key as keyof typeof formData] as string;
            const wordCount = getWordCount(value);
            const isActive = activeSection === section.key;

            return (
              <Card
                key={section.key}
                id={section.key}
                className={`bg-[var(--bg-secondary)] border-[var(--border)] transition-colors ${
                  isActive ? "border-[var(--accent)]" : ""
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                    {section.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {section.wordTarget && (
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          wordCount >= section.wordTarget.min &&
                          wordCount <= section.wordTarget.max
                            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                            : wordCount > section.wordTarget.max
                              ? "bg-orange-500/10 text-orange-500"
                              : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                        }`}
                      >
                        {wordCount} / {section.wordTarget.min}-
                        {section.wordTarget.max}
                      </Badge>
                    )}
                    {!section.wordTarget && wordCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                      >
                        {wordCount} words
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={value}
                    onChange={(e) => handleChange(section.key, e.target.value)}
                    onFocus={() => setActiveSection(section.key)}
                    placeholder={section.placeholder}
                    className="bg-[var(--bg-primary)] border-[var(--border)] min-h-[200px] resize-y"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
