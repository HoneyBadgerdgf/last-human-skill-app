"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";

const statusColors = {
  idea: "bg-gray-500/10 text-gray-500",
  outlining: "bg-yellow-500/10 text-yellow-500",
  drafting: "bg-blue-500/10 text-blue-500",
  editing: "bg-purple-500/10 text-purple-500",
  scheduled: "bg-orange-500/10 text-orange-500",
  published: "bg-[var(--accent)]/10 text-[var(--accent)]",
};

export default function NewslettersPage() {
  const newsletters = useQuery(api.newsletters.list, {});
  const deleteNewsletter = useMutation(api.newsletters.remove);

  const handleDelete = async (id: Id<"newsletters">) => {
    if (confirm("Are you sure you want to delete this newsletter?")) {
      await deleteNewsletter({ id });
    }
  };

  const getProgress = (newsletter: NonNullable<typeof newsletters>[number]) => {
    const sections = [
      newsletter.audience,
      newsletter.hyperbolicTruth,
      newsletter.painPoint,
      newsletter.novelPerspective,
      newsletter.uniqueMechanism,
      newsletter.coreTakeaway,
    ];
    const completed = sections.filter(Boolean).length;
    return Math.round((completed / 6) * 100);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Newsletters
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Your weekly content using the Dan Koe framework
          </p>
        </div>
        <Link href="/newsletters/new">
          <Button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Newsletter
          </Button>
        </Link>
      </div>

      {/* List */}
      {newsletters && newsletters.length > 0 ? (
        <div className="space-y-4">
          {newsletters.map((newsletter) => (
            <Card
              key={newsletter._id}
              className="bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--border-focus)] transition-colors group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-[var(--bg-tertiary)]">
                      <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[var(--text-primary)]">
                        {newsletter.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className={statusColors[newsletter.status]}>
                          {newsletter.status.charAt(0).toUpperCase() +
                            newsletter.status.slice(1)}
                        </Badge>
                        {newsletter.weekOf && (
                          <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Week of {newsletter.weekOf}
                          </span>
                        )}
                        <span className="text-sm text-[var(--text-secondary)]">
                          {getProgress(newsletter)}% complete
                        </span>
                      </div>
                      {newsletter.subjectLine && (
                        <p className="text-sm text-[var(--text-secondary)] mt-2">
                          Subject: {newsletter.subjectLine}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/newsletters/${newsletter._id}`}>
                      <Button
                        variant="ghost"
                        className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
                      >
                        {newsletter.status === "published" ? "View" : "Edit"}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleDelete(newsletter._id)}
                      className="p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="p-4 rounded-full bg-[var(--bg-secondary)] w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
            No newsletters yet
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Start your first newsletter using the Dan Koe framework.
          </p>
          <Link href="/newsletters/new">
            <Button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Newsletter
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
