"use client";

import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

export default function TranscriptsPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<{
    videoId: string;
    title: string;
    channelName?: string;
    transcript: string;
  } | null>(null);

  const transcripts = useQuery(api.transcripts.list);
  const fetchTranscript = useAction(api.transcripts.fetchTranscript);
  const saveTranscript = useMutation(api.transcripts.saveTranscript);
  const saveToSwipeFile = useMutation(api.transcripts.saveToSwipeFile);
  const removeTranscript = useMutation(api.transcripts.remove);

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [selectedTranscriptId, setSelectedTranscriptId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [whatToEmulate, setWhatToEmulate] = useState("");
  const [tags, setTags] = useState("");

  const handleFetch = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    setCurrentTranscript(null);

    try {
      const result = await fetchTranscript({ url: url.trim() });
      
      if (!result.success) {
        setError(result.error || "Failed to fetch transcript");
        return;
      }

      setCurrentTranscript({
        videoId: result.videoId!,
        title: result.title!,
        channelName: result.channelName,
        transcript: result.transcript!,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transcript");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentTranscript) return;

    try {
      await saveTranscript({
        videoId: currentTranscript.videoId,
        videoUrl: url,
        title: currentTranscript.title,
        channelName: currentTranscript.channelName,
        transcript: currentTranscript.transcript,
        thumbnail: `https://img.youtube.com/vi/${currentTranscript.videoId}/maxresdefault.jpg`,
      });
      
      setUrl("");
      setCurrentTranscript(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save transcript");
    }
  };

  const handleSaveToSwipeFile = async () => {
    if (!selectedTranscriptId) return;

    try {
      await saveToSwipeFile({
        transcriptId: selectedTranscriptId as any,
        notes: notes || undefined,
        whatToEmulate: whatToEmulate || undefined,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      });
      
      setSaveModalOpen(false);
      setSelectedTranscriptId(null);
      setNotes("");
      setWhatToEmulate("");
      setTags("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save to swipe file");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-[#0a0a0b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
              ← Back
            </Link>
            <h1 className="text-xl font-semibold">YouTube Transcripts</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Fetch Section */}
        <div className="bg-[#141416] border border-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Extract Transcript</h2>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL..."
              className="flex-1 bg-[#0a0a0b] border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            />
            <button
              onClick={handleFetch}
              disabled={loading || !url.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Fetching..." : "Get Transcript"}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-red-400 text-sm">{error}</p>
          )}

          {/* Preview */}
          {currentTranscript && (
            <div className="mt-6 border-t border-zinc-800 pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">{currentTranscript.title}</h3>
                  {currentTranscript.channelName && (
                    <p className="text-zinc-400 text-sm">{currentTranscript.channelName}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(currentTranscript.transcript)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors"
                  >
                    Save Transcript
                  </button>
                </div>
              </div>
              
              <div className="bg-[#0a0a0b] border border-zinc-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono">
                  {currentTranscript.transcript}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Saved Transcripts */}
        <div>
          <h2 className="text-lg font-medium mb-4">Saved Transcripts</h2>
          
          {!transcripts ? (
            <p className="text-zinc-500">Loading...</p>
          ) : transcripts.length === 0 ? (
            <div className="bg-[#141416] border border-zinc-800 rounded-lg p-8 text-center">
              <p className="text-zinc-500">No transcripts saved yet.</p>
              <p className="text-zinc-600 text-sm mt-1">Paste a YouTube URL above to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {transcripts.map((transcript) => (
                <div
                  key={transcript._id}
                  className="bg-[#141416] border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-40 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                      {transcript.thumbnail && (
                        <img 
                          src={transcript.thumbnail} 
                          alt={transcript.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{transcript.title}</h3>
                      {transcript.channelName && (
                        <p className="text-zinc-400 text-sm">{transcript.channelName}</p>
                      )}
                      <p className="text-zinc-500 text-xs mt-1">
                        {transcript.transcript.length.toLocaleString()} characters
                      </p>
                      
                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => copyToClipboard(transcript.transcript)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs rounded-md transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTranscriptId(transcript._id);
                            setSaveModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-xs rounded-md transition-colors"
                        >
                          Save to Swipe File
                        </button>
                        <Link
                          href={`/breakdown?content=${encodeURIComponent(transcript.transcript.slice(0, 5000))}`}
                          className="px-3 py-1.5 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 text-xs rounded-md transition-colors"
                        >
                          Run Breakdown
                        </Link>
                        <button
                          onClick={() => removeTranscript({ id: transcript._id })}
                          className="px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Save to Swipe File Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#141416] border border-zinc-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Save to Swipe File</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Notes (why it's good)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none resize-none"
                  rows={3}
                  placeholder="What makes this content great..."
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-1">What to Emulate</label>
                <textarea
                  value={whatToEmulate}
                  onChange={(e) => setWhatToEmulate(e.target.value)}
                  className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none resize-none"
                  rows={2}
                  placeholder="Specific techniques to borrow..."
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                  placeholder="storytelling, hook, structure"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToSwipeFile}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
