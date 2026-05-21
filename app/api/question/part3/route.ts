import { NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";

const TOPICS = [
  "remote work and productivity",
  "environmental sustainability in the workplace",
  "technology and daily life",
  "work-life balance",
  "online shopping vs in-store shopping",
  "the role of social media in business",
  "public transportation vs private cars",
  "online learning vs traditional classroom learning",
];

export async function GET() {
  try {
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const model = getModel();
    const result = await model.generateContent(
      `Generate a TOEIC Part 3 Writing opinion essay prompt on the topic: "${topic}".

Requirements:
- Clear agree/disagree or preference-based question
- Relevant to professional or everyday life
- Suitable for intermediate-advanced English learners
- Students should be able to write ~150–300 words in response

Return ONLY valid JSON:
{
  "topic": "${topic}",
  "prompt": "The full essay question (2–3 sentences)",
  "tips": ["Tip 1 to help structure the essay", "Tip 2", "Tip 3"]
}`
    );

    const parsed = JSON.parse(result.response.text());
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[part3]", err);
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}
