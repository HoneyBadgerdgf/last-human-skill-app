"use client";

import { Suspense, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Copy, Check, BookmarkPlus } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

// Stubbed breakdown function - will call Hugh API in production
async function generateBreakdown(content: string): Promise<{
  contentType: string;
  macroAnalysis: string;
  microAnalysis: string;
  psychologicalTactics: string;
  replicationGuide: string;
  tacticsUsed: string[];
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Stubbed response - in production, this would call the Hugh API
  return {
    contentType:
      '"Process Reveal" — A behind-the-scenes walkthrough showing a desirable outcome and the path to achieve it. Effective because it combines aspiration with actionable steps.',
    macroAnalysis: `**Structure:** Hook → Problem → Process → Payoff

• **Opening Hook:** Leads with a compelling result that creates immediate interest
• **Problem Setup:** Establishes the common struggle most people face
• **Process Reveal:** Step-by-step breakdown of the actual method
• **Payoff:** Clear takeaway and invitation to go deeper

This structure works because it validates the reader's struggle while offering a concrete path forward. The "reveal" element creates the feeling of getting insider access.`,
    microAnalysis: `**Key Moments:**

1. **Title Construction:** Creates curiosity gap by contrasting time inputs (1 week vs 2 hours)
2. **Credibility Establishment:** Opens with results, not promises
3. **Pattern Interrupt:** "Most people do X, I do Y" positions against conventional wisdom
4. **Transition Phrases:** Uses "Here's the thing..." and "But here's what they miss..." to create micro-hooks within sections
5. **Specificity:** Numbers and exact steps add credibility ("Step 3 of 5")`,
    psychologicalTactics: `**Frameworks Used:**

🏷 **Curiosity Gap** — Title promises a counterintuitive outcome
🏷 **Social Proof** — Leading with results establishes authority
🏷 **Pattern Interrupt** — Challenges conventional approach
🏷 **Loss Aversion** — Implies readers are wasting time with old methods
🏷 **Progressive Disclosure** — Each step builds on the previous

**Emotional Triggers:**
• Desire for efficiency and leverage
• Fear of wasting time on ineffective methods
• Aspiration to replicate success
• Relief at finding a simpler path`,
    replicationGuide: `**Principles to Apply:**

1. **Lead with the outcome, not the method.** People care about results first, process second.

2. **Name and contrast the common approach.** Position your method against what "everyone else" does.

3. **Reveal your process in concrete steps.** Specificity builds credibility. Don't be vague.

4. **Use numbers to create curiosity gaps.** "3 steps" or "in 2 hours" creates concrete expectations.

5. **End with one clear next action.** Don't give 5 CTAs. Give one.

**Example Applications:**
• "How I write a newsletter in 45 minutes (not 4 hours)"
• "The 3-step content system I use every week"
• "Why I stopped [common approach] and what I do instead"`,
    tacticsUsed: [
      "curiosity gap",
      "social proof",
      "pattern interrupt",
      "loss aversion",
      "progressive disclosure",
      "specificity",
    ],
  };
}

function BreakdownContent() {
  const searchParams = useSearchParams();
  const swipeItemId = searchParams.get("id") as Id<"swipeItems"> | null;

  const swipeItem = useQuery(
    api.swipeItems.get,
    swipeItemId ? { id: swipeItemId } : "skip"
  );
  const addBreakdown = useMutation(api.swipeItems.addBreakdown);

  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [breakdown, setBreakdown] = useState<{
    contentType: string;
    macroAnalysis: string;
    microAnalysis: string;
    psychologicalTactics: string;
    replicationGuide: string;
    tacticsUsed: string[];
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // If we have a swipe item with an existing breakdown, show it
  const existingBreakdown = swipeItem?.breakdown;

  const handleAnalyze = async () => {
    const textToAnalyze =
      content.trim() || swipeItem?.content || swipeItem?.title;
    if (!textToAnalyze) return;

    setIsAnalyzing(true);
    try {
      const result = await generateBreakdown(textToAnalyze);
      setBreakdown(result);

      // If we're analyzing a swipe item, save the breakdown
      if (swipeItemId) {
        await addBreakdown({
          id: swipeItemId,
          breakdown: result,
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(section);
    setTimeout(() => setCopied(null), 2000);
  };

  const displayBreakdown = breakdown || existingBreakdown;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Content Breakdown
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Reverse-engineer what makes great content work
        </p>
      </div>

      {/* Input Section */}
      {!displayBreakdown && (
        <Card className="bg-[var(--bg-secondary)] border-[var(--border)] mb-8">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
              {swipeItem ? `Analyzing: ${swipeItem.title}` : "Paste Content"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {swipeItem ? (
              <div className="space-y-4">
                <p className="text-[var(--text-primary)]">
                  {swipeItem.content || swipeItem.notes || swipeItem.title}
                </p>
                {swipeItem.url && (
                  <a
                    href={swipeItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    View original →
                  </a>
                )}
              </div>
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the content you want to analyze (article text, social post, video transcript, etc.)"
                className="bg-[var(--bg-primary)] border-[var(--border)] min-h-[200px]"
              />
            )}

            <Button
              onClick={handleAnalyze}
              disabled={
                isAnalyzing ||
                (!content.trim() && !swipeItem?.content && !swipeItem?.title)
              }
              className="mt-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Hugh is analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run Breakdown
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {displayBreakdown && (
        <div className="space-y-6">
          {/* Swipe Item Reference */}
          {swipeItem && (
            <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
              <CardContent className="p-4 flex items-center gap-3">
                <BookmarkPlus className="w-5 h-5 text-[var(--accent)]" />
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    {swipeItem.title}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    From your swipe file
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Type */}
          <BreakdownSection
            title="Content Type"
            content={displayBreakdown.contentType}
            onCopy={() =>
              handleCopy(displayBreakdown.contentType, "contentType")
            }
            copied={copied === "contentType"}
          />

          {/* Macro Analysis */}
          <BreakdownSection
            title="Macro Analysis"
            content={displayBreakdown.macroAnalysis}
            onCopy={() =>
              handleCopy(displayBreakdown.macroAnalysis, "macroAnalysis")
            }
            copied={copied === "macroAnalysis"}
          />

          {/* Micro Analysis */}
          <BreakdownSection
            title="Micro Moments"
            content={displayBreakdown.microAnalysis}
            onCopy={() =>
              handleCopy(displayBreakdown.microAnalysis, "microAnalysis")
            }
            copied={copied === "microAnalysis"}
          />

          {/* Psychological Tactics */}
          <BreakdownSection
            title="Psychological Tactics"
            content={displayBreakdown.psychologicalTactics}
            onCopy={() =>
              handleCopy(
                displayBreakdown.psychologicalTactics,
                "psychologicalTactics"
              )
            }
            copied={copied === "psychologicalTactics"}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {displayBreakdown.tacticsUsed.map((tactic) => (
                <Badge
                  key={tactic}
                  className="bg-[var(--accent)]/10 text-[var(--accent)]"
                >
                  {tactic}
                </Badge>
              ))}
            </div>
          </BreakdownSection>

          {/* Replication Guide */}
          <BreakdownSection
            title="Replication Guide"
            content={displayBreakdown.replicationGuide}
            onCopy={() =>
              handleCopy(displayBreakdown.replicationGuide, "replicationGuide")
            }
            copied={copied === "replicationGuide"}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setBreakdown(null);
                setContent("");
              }}
              variant="outline"
              className="border-[var(--border)] text-[var(--text-secondary)]"
            >
              Analyze Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function BreakdownSection({
  title,
  content,
  onCopy,
  copied,
  children,
}: {
  title: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          {title}
        </CardTitle>
        <button
          onClick={onCopy}
          className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[var(--accent)]" />
          ) : (
            <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
          )}
        </button>
      </CardHeader>
      <CardContent>
        {children}
        <div className="prose prose-invert prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-[var(--text-primary)] bg-transparent p-0">
            {content}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BreakdownPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Content Breakdown
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">Loading...</p>
          </div>
        </div>
      }
    >
      <BreakdownContent />
    </Suspense>
  );
}
