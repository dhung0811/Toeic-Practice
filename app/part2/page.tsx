"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import FeedbackPanel from "@/components/FeedbackPanel";

interface Question {
  scenario: string;
  emailText: string;
  instructions: string;
  points: string[];
}

interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  modelAnswer: string;
  explanation: string;
}

export default function Part2Page() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setAnswer("");
    setError(null);
    try {
      const res = await fetch("/api/question/part2");
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
          part: "2",
          answer,
          context: {
            emailText: question.emailText,
            instructions: question.instructions,
            points: question.points,
          },
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
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              Part 2
            </span>
            <h1 className="text-xl font-bold text-slate-800 mt-0.5">Respond to a Request</h1>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Read the email or written request below. Write a{" "}
          <strong>clear, polite, and complete reply</strong> that addresses all the required points.
        </p>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 h-48 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Generating question…</p>
          </div>
        ) : error && !question ? (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-center">
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button onClick={fetchQuestion} className="text-red-600 underline text-sm">Try again</button>
          </div>
        ) : question ? (
          <div className="space-y-4">
            {/* Email / request */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Incoming Message
                </p>
                <p className="text-sm text-slate-600 mt-0.5 italic">{question.scenario}</p>
              </div>
              <div className="px-5 py-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {question.emailText}
              </div>
            </div>

            {/* Points to address */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3.5">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">
                Points to address
              </p>
              <ul className="space-y-1">
                {question.points.map((point, i) => (
                  <li key={i} className="text-sm text-indigo-800 flex items-start gap-2">
                    <span className="font-bold shrink-0">{i + 1}.</span>
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-indigo-500 mt-2.5 pt-2.5 border-t border-indigo-100">
                {question.instructions}
              </p>
            </div>

            {/* Answer */}
            {!feedback && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Your reply</label>
                  <span className="text-xs text-slate-400">{wordCount} words</span>
                </div>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write your reply here…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-300"
                  rows={8}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || submitting}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                  <span className="font-semibold text-slate-700 block mb-1">Your reply:</span>
                  {answer}
                </div>
                <FeedbackPanel feedback={feedback} />
                <button
                  onClick={fetchQuestion}
                  className="w-full border border-indigo-200 text-indigo-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors"
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
