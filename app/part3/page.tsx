"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import FeedbackPanel from "@/components/FeedbackPanel";

interface Question {
  topic: string;
  prompt: string;
  tips: string[];
}

interface Feedback {
  score: number;
  wordCount: number;
  strengths: string[];
  weaknesses: string[];
  modelAnswer: string;
  explanation: string;
}

export default function Part3Page() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setAnswer("");
    setError(null);
    setShowTips(false);
    try {
      const res = await fetch("/api/question/part3");
      if (!res.ok) throw new Error("Failed");
      setQuestion(await res.json());
    } catch {
      setError("Could not load question. Please check your API keys and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQuestion(); }, [fetchQuestion]);

  const handleSubmit = async () => {
    if (!answer.trim() || !question) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          part: "3",
          answer,
          context: { essayPrompt: question.prompt },
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setFeedback(await res.json());
    } catch {
      setError("Grading failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const wordCountColor =
    wordCount >= 150 ? "text-emerald-600" : wordCount >= 80 ? "text-amber-500" : "text-slate-400";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
            ← Back
          </Link>
          <span className="h-4 w-px bg-slate-200" />
          <div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              Part 3
            </span>
            <h1 className="text-xl font-bold text-slate-800 mt-0.5">Write an Essay</h1>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Read the prompt below and write a <strong>well-organized opinion essay</strong> (150–300 words).
          State your position clearly, support it with reasons and examples, and write a conclusion.
        </p>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 h-48 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Generating prompt…</p>
          </div>
        ) : error && !question ? (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-center">
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button onClick={fetchQuestion} className="text-red-600 underline text-sm">Try again</button>
          </div>
        ) : question ? (
          <div className="space-y-4">
            {/* Prompt */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Essay Prompt</p>
                  <p className="text-xs text-slate-400 mt-0.5">Topic: {question.topic}</p>
                </div>
                <button
                  onClick={() => setShowTips((v) => !v)}
                  className="text-xs text-emerald-600 hover:underline font-medium"
                >
                  {showTips ? "Hide tips" : "Show tips"}
                </button>
              </div>
              <div className="px-5 py-5 text-slate-800 text-sm leading-relaxed">
                {question.prompt}
              </div>
              {showTips && (
                <div className="px-5 py-4 bg-emerald-50 border-t border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">
                    Writing Tips
                  </p>
                  <ul className="space-y-1">
                    {question.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-emerald-800 flex items-start gap-1.5">
                        <span className="shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Answer */}
            {!feedback && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Your essay</label>
                  <span className={`text-xs font-semibold ${wordCountColor}`}>
                    {wordCount} / 150–300 words
                  </span>
                </div>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write your essay here. Start with a clear introduction stating your opinion…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-300"
                  rows={12}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || submitting}
                    className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? "Grading…" : "Submit"}
                  </button>
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <>
                <div className="bg-slate-100 rounded-xl px-4 py-3 text-sm text-slate-600 whitespace-pre-wrap">
                  <span className="font-semibold text-slate-700 block mb-1">Your essay:</span>
                  {answer}
                </div>
                <FeedbackPanel feedback={feedback} />
                <button
                  onClick={fetchQuestion}
                  className="w-full border border-emerald-200 text-emerald-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition-colors"
                >
                  Try Another Question
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
