import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;

// Lazy GenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      name: "Ali Calendar API",
      time: new Date().toISOString(),
    });
  });

  // AI Calendar Assistant Chat Endpoint
  app.post("/api/gemini/chat", async (req: Request, res: Response): Promise<void> => {
    try {
      const { message, context } = req.body;
      if (!message || typeof message !== "string") {
        res.status(400).json({ error: "Message string is required" });
        return;
      }

      const ai = getAIClient();
      if (!ai) {
        // Graceful fallback response when API key is not configured
        res.json({
          reply: `I received your calendar query: "${message}". Note: To enable live Gemini AI intelligence, please connect your GEMINI_API_KEY in Settings > Secrets. In the meantime, Ali Calendar's built-in offline calculators, date explorer, and smart planner remain fully functional!`,
          parsedAction: null,
        });
        return;
      }

      const systemPrompt = `You are "Ali Calendar AI Assistant", an expert calendar engineer, date scientist, historian, and personal scheduling assistant.
Your tagline is: "Plan your days. Discover every date."

Current local reference date: ${new Date().toISOString().split("T")[0]}.
User Calendar context: ${JSON.stringify(context || {})}

Your capabilities:
1. Parse scheduling requests (e.g., "Add my math exam on 20 September at 10 AM", "Remind me 1 day before").
2. Answer historical questions about any date (e.g. "What happened on 15 August 1947?").
3. Calculate date differences, countdowns, and business days.
4. Explain religious dates (Islamic Hijri, Hindu Panchang, Christian, Sikh, Jain, Buddhist) with verified factual care.
5. Create structured study schedules or habit routines for a given number of days.
6. If the user's scheduling request is missing key info (like exact date, title, or time), kindly ask for clarification.

Respond in a warm, concise, well-formatted Markdown response with clear bullet points and emojis where appropriate.
If the query clearly asks to create an event, also provide a JSON block enclosed in \`\`\`json_event ... \`\`\` with fields:
{
  "title": string,
  "date": "YYYY-MM-DD",
  "startTime": "HH:mm" (optional),
  "endTime": "HH:mm" (optional),
  "category": "personal" | "work" | "meeting" | "study" | "health" | "holiday",
  "priority": "low" | "medium" | "high" | "urgent",
  "reminderMinutes": number,
  "description": string
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
          },
        ],
      });

      const responseText = response.text || "I was unable to process that request.";

      // Check if event JSON was output
      let parsedEvent = null;
      const jsonMatch = responseText.match(/```json_event\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedEvent = JSON.parse(jsonMatch[1]);
        } catch {
          // Ignore parse errors
        }
      }

      // Clean up the text response for clean UI display
      const cleanReply = responseText.replace(/```json_event[\s\S]*?```/g, "").trim();

      res.json({
        reply: cleanReply,
        parsedEvent,
      });
    } catch (err: any) {
      console.error("Gemini Chat Error:", err);
      res.status(500).json({
        error: "Failed to generate AI response",
        details: err?.message || String(err),
      });
    }
  });

  // Natural Language Event Parser
  app.post("/api/gemini/parse-event", async (req: Request, res: Response): Promise<void> => {
    try {
      const { text } = req.body;
      if (!text) {
        res.status(400).json({ error: "Text is required" });
        return;
      }

      const ai = getAIClient();
      if (!ai) {
        res.status(503).json({ error: "Gemini API key is not configured" });
        return;
      }

      const todayStr = new Date().toISOString().split("T")[0];
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Today is ${todayStr}. Parse the following user text into a calendar event JSON: "${text}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              date: { type: Type.STRING, description: "YYYY-MM-DD" },
              startTime: { type: Type.STRING, description: "HH:mm in 24h format" },
              endTime: { type: Type.STRING, description: "HH:mm in 24h format" },
              allDay: { type: Type.BOOLEAN },
              category: {
                type: Type.STRING,
                description: "personal, work, meeting, reminder, birthday, holiday, study, health, travel",
              },
              priority: { type: Type.STRING, description: "low, medium, high, urgent" },
              reminderMinutes: { type: Type.INTEGER },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["title", "date"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Parse Event Error:", err);
      res.status(500).json({ error: "Failed to parse event", details: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ali Calendar Server running on http://localhost:${PORT}`);
  });
}

startServer();
