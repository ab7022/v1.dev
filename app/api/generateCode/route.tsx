import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    // Validate request
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();

    if (!body?.prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Configure safety settings
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    // Get the generative model
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.0-flash" },
       
    );

    // Construct the prompt
    const prompt = `You are a world-class React Native engineer, expert in Expo SDK 52.0.0, and a premium UI/UX product designer. You help developers generate complete, modular, production-quality React Native apps instantly.

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
- Code should be clean, modern, minimal, and functional

User prompt: ${body.prompt}`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response if it's JSON
    try {
      const jsonResponse = JSON.parse(text);
      return NextResponse.json(jsonResponse);
    } catch (e) {
      // If not JSON, return as text
      return NextResponse.json({ text });
    }

  } catch (error) {
    console.error("Error in generating content:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}