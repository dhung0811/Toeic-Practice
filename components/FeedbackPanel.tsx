interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  modelAnswer: string;
  explanation: string;
  usedBothWords?: boolean;
  wordCount?: number;
}

const scoreLabel: Record<number, string> = {
  5: "Excellent",
  4: "Good",
  3: "Fair",
  2: "Needs Work",
  1: "Poor",
};

export default function FeedbackPanel({
  feedback,
  maxScore = 5,
}: {
  feedback: Feedback;
  maxScore?: number;
}) {
  const scoreColor =
    feedback.score >= 4
      ? "text-green-700 bg-green-50 border-green-200"
      : feedback.score === 3
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-red-700 bg-red-50 border-red-200";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Score bar */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-xl font-bold px-3 py-1 rounded-xl border ${scoreColor}`}>
            {feedback.score}/{maxScore}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {scoreLabel[feedback.score] ?? "Scored"}
            </p>
            <p className="text-xs text-slate-500">{feedback.explanation}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {feedback.usedBothWords !== undefined && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                feedback.usedBothWords
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {feedback.usedBothWords ? "✓ Both words used" : "✗ Missing required word"}
            </span>
          )}
          {feedback.wordCount !== undefined && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {feedback.wordCount} words
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Strengths */}
        {feedback.strengths.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Strengths
            </h3>
            <ul className="space-y-1.5">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {feedback.weaknesses.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Areas to Improve
            </h3>
            <ul className="space-y-1.5">
              {feedback.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Model Answer */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Model Answer
          </h3>
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {feedback.modelAnswer}
          </div>
        </div>
      </div>
    </div>
  );
}
