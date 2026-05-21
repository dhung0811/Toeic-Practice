import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export function getModel(jsonMode = true) {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: jsonMode ? { responseMimeType: "application/json" } : undefined,
  });
}
