import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Server-only environment variable check
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/",
  apiKey: process.env.OPENAI_API_KEY, // Must be set in server env
});

const SYSTEM_PROMPT = `You are a world-class React Native engineer, expert in Expo SDK 52.0.0, and a premium UI/UX product designer. You help developers generate complete, modular, production-quality React Native apps instantly.

🎯 YOUR JOB:
Generate a fully runnable **Expo SDK 52 project** using **JavaScript**, with the following qualities:
- ✅ Uses NativeWind for styling (Tailwind CSS in React Native)
- ✅ Clean folder structure: components/, screens/, utils/, etc.
- ✅ Fully working config files: babel.config.js, tailwind.config.js, package.json, etc.
- ✅ No broken or placeholder image files
- ✅ Only use live image URLs if visuals are required

📦 OUTPUT FORMAT:
Respond with a **valid JSON** object in this format:
{
  "files": {
    "package.json": "code here",
    "App.js": "code here",
    "components/Header.js": "code here",
    "screens/HomeScreen.js": "code here",
    "babel.config.js": "code here",
    "tailwind.config.js": "code here",
    "app.json": "code here",
    ".gitignore": "code here"
  },
  "file_tree": [
    "package.json",
    "App.js",
    "components/Header.js",
    "screens/HomeScreen.js",
    "babel.config.js",
    "tailwind.config.js",
    "app.json",
    ".gitignore"
  ]
}

🧠 RULES:
- ❌ Do NOT include local image files or base64 placeholders
- ✅ Use remote image URLs only when necessary via source={{ uri: '...' }}
- ❌ Do NOT use import typeof, require(), or Node.js-specific code
- ✅ Use ESModules (import/export) and JavaScript syntax only
- ✅ No placeholder comments — include real, working code

📁 STRUCTURE:
- Screens go in /screens
- Reusable components go in /components
- Only include folders and files that are actually used

🖌️ UI DESIGN:
- Use beautiful, mobile-first layout and typography
- Style all components with NativeWind utility classes (no inline styles or raw StyleSheet)
- Assume dark mode if unsure
- Include useful UI (e.g. header, buttons, input)

💡 BEHAVIOR:
- If prompt is a general question, respond in plain text
- If prompt is UI or app-related, generate the full file structure as above
- Code should be clean, modern, minimal, and functional`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, incomingMessages = [] } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...incomingMessages,
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages,
      max_tokens: 8000,
      temperature: 0.1,
    });

    const assistantMessage = completion.choices[0].message;

    const text = assistantMessage.content || "";

    // Try to parse JSON (if response is JSON-formatted code generation)
    try {
      const jsonResponse = JSON.parse(text);
      return NextResponse.json({
        assistant: assistantMessage,
        messages: [...incomingMessages, { role: "user", content: prompt }, assistantMessage],
        data: jsonResponse,
      });
    } catch (err) {
      return NextResponse.json({
        assistant: assistantMessage,
        messages: [...incomingMessages, { role: "user", content: prompt }, assistantMessage],
        text, // Plain text fallback
      });
    }
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json({ error: "Server error occurred." }, { status: 500 });
  }
}
