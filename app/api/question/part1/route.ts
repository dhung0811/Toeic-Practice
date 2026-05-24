import { NextResponse } from "next/server";
import { getRandomPhoto } from "@/lib/unsplash";
import { getModel } from "@/lib/gemini";

export async function GET() {
  try {
    const photo = await getRandomPhoto();

    const model = getModel();
    const result = await model.generateContent(
      `You are a TOEIC Writing test designer. Based on the following image description, choose exactly 2 words that:
1. Are clearly visible or directly related to what's happening in the scene
2. Are concrete nouns or action verbs (not adjectives, prepositions, or articles)
3. Together make it possible to write a meaningful sentence about the scene

Image description: ${photo.description}

Return ONLY valid JSON with no other text: {"words": ["word1", "word2"]}`
    );

    const parsed = JSON.parse(result.response.text());

    return NextResponse.json({
      imageUrl: photo.displayUrl,
      words: parsed.words as string[],
    });
  } catch (err) {
    console.error("[part1]", err);
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}
