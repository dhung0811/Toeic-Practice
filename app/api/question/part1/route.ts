import { NextResponse } from "next/server";
import { getRandomPhoto } from "@/lib/unsplash";
import { getModel } from "@/lib/gemini";

export async function GET() {
  try {
    const photo = await getRandomPhoto();

    const imageRes = await fetch(photo.analysisUrl);
    const imageBuffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");

    const model = getModel();
    const result = await model.generateContent([
      { inlineData: { data: base64, mimeType: "image/jpeg" } },
      `You are a TOEIC Writing test designer. Look at this image and choose exactly 2 words that:
1. Are clearly visible or directly related to what's happening in the image
2. Are concrete nouns or action verbs (not adjectives, prepositions, or articles)
3. Together make it possible to write a meaningful sentence about the scene

Return ONLY valid JSON with no other text: {"words": ["word1", "word2"]}`,
    ]);

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
