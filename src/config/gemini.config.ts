
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in environment variables");
}

export const geminiAI = new GoogleGenAI({
    apiKey: apiKey,
});
