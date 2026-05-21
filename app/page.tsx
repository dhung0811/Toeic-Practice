import Link from "next/link";

const parts = [
  {
    num: "1",
    title: "Write a Sentence",
    desc: "Look at a photo and write one sentence using two given words. Focus on grammar and relevance.",
    href: "/part1",
    accent: "blue",
    tag: "1 sentence",
  },
  {
    num: "2",
    title: "Respond to a Request",
    desc: "Read an email or message and write an appropriate reply addressing all the required points.",
    href: "/part2",
    accent: "indigo",
    tag: "~75–100 words",
  },
  {
    num: "3",
    title: "Write an Essay",
    desc: "Read an opinion prompt and write a structured essay with a clear position, reasons, and examples.",
    href: "/part3",
    accent: "emerald",
    tag: "~150–300 words",
  },
];

const accentMap: Record<string, { num: string; link: string; badge: string; border: string }> = {
  blue: {
    num: "text-blue-600 bg-blue-100",
    link: "text-blue-600",
    badge: "text-blue-600 bg-blue-50 border-blue-100",
    border: "hover:border-blue-300",
  },
  indigo: {
    num: "text-indigo-600 bg-indigo-100",
    link: "text-indigo-600",
    badge: "text-indigo-600 bg-indigo-50 border-indigo-100",
    border: "hover:border-indigo-300",
  },
  emerald: {
    num: "text-emerald-600 bg-emerald-100",
    link: "text-emerald-600",
    badge: "text-emerald-600 bg-emerald-50 border-emerald-100",
    border: "hover:border-emerald-300",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">TOEIC Writing Practice</h1>
          <p className="text-slate-500 text-lg">
            Practice all three writing tasks with instant AI feedback powered by Gemini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {parts.map((part) => {
            const a = accentMap[part.accent];
            return (
              <Link key={part.num} href={part.href} className="group block">
                <div
                  className={`bg-white rounded-2xl p-6 border border-slate-200 ${a.border} hover:shadow-md transition-all h-full flex flex-col`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${a.num}`}>
                      {part.num}
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${a.badge}`}>
                      {part.tag}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">{part.title}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{part.desc}</p>
                  <span className={`mt-5 text-sm font-medium ${a.link} group-hover:underline`}>
                    Start Practice →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
