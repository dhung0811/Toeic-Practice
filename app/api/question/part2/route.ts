import { NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";

export async function GET() {
  try {
    const model = getModel();
    const result = await model.generateContent(
      `Generate a TOEIC Part 2 Writing question — a realistic email or written request that a test-taker must respond to.

Requirements:
- Realistic business or everyday scenario (coworker, customer, manager, service provider)
- The email/request is 3–5 sentences long
- Include 2–3 specific points the responder must address
- Professional but approachable tone

Return ONLY valid JSON:
{
  "scenario": "One sentence describing the situation (e.g. 'A colleague emails you about...')",
  "emailText": "The full email or written request text",
  "instructions": "Write a reply to this email. In your reply, answer the questions and make ONE request.",
  "points": ["Point 1 the student must address", "Point 2", "Point 3"]
}`
    );

    const parsed = JSON.parse(result.response.text());
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[part2]", err);
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}
