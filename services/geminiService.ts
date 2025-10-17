import { GoogleGenAI, Chat } from "@google/genai";

// This check is for build-time safety, assuming process.env is populated correctly at runtime.
if (!process.env.API_KEY) {
  // In a real app, you might provide a fallback or a more user-friendly error.
  // For this environment, we assume the key is always present.
  console.warn("API_KEY environment variable not set at build time. It must be available at runtime.");
}

const ai = new GoogleGenAI({ apiKey: "AIzaSyDClw59hXZc510GQcC0XjNzs90Tb5rPsaM "});

export function createChatSession(): Chat {
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful and friendly assistant. Your responses should be informative, well-structured, and concise.',
    },
  });
  return chat;
}
