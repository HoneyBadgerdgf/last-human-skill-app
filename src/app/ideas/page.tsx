"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Lightbulb,
  BookmarkPlus,
  FileText,
  Trash2,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

export default function IdeasPage() {
  const ideas = useQuery(api.ideas.list, { processed: false });
  const processedIdeas = useQuery(api.ideas.list, { processed: true });
  const createIdea = useMutation(api.ideas.create);
  const promoteIdea = useMutation(api.ideas.promote);
  const deleteIdea = useMutation(api.ideas.remove);

  const [newIdea, setNewIdea] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showProcessed, setShowProcessed] = useState(false);

  const handleAddIdea = async () => {
    if (!newIdea.trim()) return;
    setIsAdding(true);
    try {
      await createIdea({ content: newIdea.trim() });
      setNewIdea("");
      toast.success("Idea captured!");
    } finally {
      setIsAdding(false);
    }
  };

  const handlePromote = async (
    id: Id<"ideas">,
    to: "swipe" | "newsletter" | "discarded"
  ) => {
    await promoteIdea({ id, promotedTo: to });
    toast.success(
      to === "discarded"
        ? "Idea discarded"
        : `Promoted to ${to === "swipe" ? "swipe file" : "newsletter"}`
    );
  };

  const handleDelete = async (id: Id<"ideas">) => {
    await deleteIdea({ id });
    toast.success("Idea deleted");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Idea Inbox
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Capture fleeting ideas. Process them weekly.
        </p>
      </div>

      {/* Quick Capture */}
      <Card className="bg-[var(--bg-secondary)] border-[var(--border)] mb-8">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            Quick Capture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddIdea()}
              placeholder="What's on your mind?"
              className="bg-[var(--bg-primary)] border-[var(--border)]"
            />
            <Button
              onClick={handleAddIdea}
              disabled={!newIdea.trim() || isAdding}
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Capture
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inbox */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-[var(--text-primary)] mb-4">
          Inbox ({ideas?.length || 0})
        </h2>
        {ideas && ideas.length > 0 ? (
          <div className="space-y-3">
            {ideas.map((idea) => (
              <Card
                key={idea._id}
                className="bg-[var(--bg-secondary)] border-[var(--border)] group"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                      <p className="text-[var(--text-primary)]">{idea.content}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePromote(idea._id, "swipe")}
                        className="text-blue-500 hover:bg-blue-500/10"
                        title="Add to Swipe File"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePromote(idea._id, "newsletter")}
                        className="text-[var(--accent)] hover:bg-[var(--accent)]/10"
                        title="Use for Newsletter"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePromote(idea._id, "discarded")}
                        className="text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                        title="Discard"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(idea._id)}
                        className="text-red-500 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
            <Lightbulb className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">
              Your inbox is empty. Capture your first idea!
            </p>
          </div>
        )}
      </div>

      {/* Processed Ideas Toggle */}
      <Button
        variant="ghost"
        onClick={() => setShowProcessed(!showProcessed)}
        className="text-[var(--text-secondary)] mb-4"
      >
        {showProcessed ? "Hide" : "Show"} processed ideas (
        {processedIdeas?.length || 0})
      </Button>

      {/* Processed Ideas */}
      {showProcessed && processedIdeas && processedIdeas.length > 0 && (
        <div className="space-y-3 opacity-60">
          {processedIdeas.map((idea) => (
            <Card
              key={idea._id}
              className="bg-[var(--bg-secondary)] border-[var(--border)]"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Lightbulb className="w-5 h-5 text-[var(--text-tertiary)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[var(--text-secondary)] line-through">
                        {idea.content}
                      </p>
                      <Badge
                        variant="secondary"
                        className="mt-2 text-xs bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                      >
                        {idea.promotedTo === "swipe"
                          ? "Added to Swipe File"
                          : idea.promotedTo === "newsletter"
                            ? "Used for Newsletter"
                            : "Discarded"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
