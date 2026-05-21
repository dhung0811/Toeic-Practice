import { NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { part, answer, context } = await req.json();

    let prompt = "";

    if (part === "1") {
      const { words } = context as { words: string[] };
      prompt = `You are a TOEIC Writing examiner grading a Part 1 sentence.

Required words: "${words[0]}" and "${words[1]}"
Student's sentence: "${answer}"

Evaluate strictly on:
- usedBothWords: did the student use both required words (case-insensitive)?
- Grammar correctness
- Whether the sentence is complete and meaningful
- Natural vocabulary usage

Score 1–5:
5 = grammatically perfect, uses both words naturally
4 = minor error but both words used correctly
3 = both words used but noticeable grammar issues
2 = one word missing or major grammar problems
1 = largely incorrect or incomprehensible

Return ONLY valid JSON:
{
  "score": <1-5>,
  "usedBothWords": <true|false>,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1"] or [],
  "modelAnswer": "A well-written example sentence using both '${words[0]}' and '${words[1]}'",
  "explanation": "One sentence of overall feedback"
}`;
    } else if (part === "2") {
      const { emailText, instructions, points } = context as {
        emailText: string;
        instructions: string;
        points: string[];
      };
      prompt = `You are a TOEIC Writing examiner grading a Part 2 email response.

Original request:
${emailText}

Instructions: ${instructions}
Points to address: ${points.join(" | ")}

Student's response:
"${answer}"

Evaluate on (score 1–5):
5 = all points addressed, fluent, appropriate register, includes a request
4 = most points addressed, minor language errors
3 = some points addressed, clear communication issues
2 = few points addressed or very poor language
1 = off-topic or incomprehensible

Return ONLY valid JSON:
{
  "score": <1-5>,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1"] or [],
  "modelAnswer": "A well-written example response that addresses all points",
  "explanation": "One sentence of overall feedback"
}`;
    } else {
      const { essayPrompt } = context as { essayPrompt: string };
      const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
      prompt = `You are a TOEIC Writing examiner grading a Part 3 opinion essay.

Prompt: ${essayPrompt}
Word count: ${wordCount}

Student's essay:
"${answer}"

Evaluate on (score 1–5):
5 = clear opinion, well-developed reasons/examples, good organization, varied language
4 = clear opinion, adequate development, minor errors
3 = opinion stated but underdeveloped, some errors
2 = unclear opinion, poor organization, many errors
1 = off-topic or incomprehensible

Return ONLY valid JSON:
{
  "score": <1-5>,
  "wordCount": ${wordCount},
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1"] or [],
  "modelAnswer": "A concise well-organized example essay (150–200 words)",
  "explanation": "One sentence of overall feedback"
}`;
    }

    const model = getModel();
    const result = await model.generateContent(prompt);
    const feedback = JSON.parse(result.response.text());

    return NextResponse.json(feedback);
  } catch (err) {
    console.error("[grade]", err);
    return NextResponse.json({ error: "Failed to grade answer" }, { status: 500 });
  }
}
