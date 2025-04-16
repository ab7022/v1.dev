// lib/generateProject.ts
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

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

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }, safetySettings);

export async function generateProjectFromPrompt(prompt: string): Promise<{
  files?: Record<string, string>;
  file_tree?: string[];
  chatResponse?: string;
}> {
  const result = await model.generateContent(
    `You are a world-class React Native engineer and product designer helping users build mobile apps instantly.

Your job is to generate entire React Native project structures — including folders, files, and well-written code — based on user prompts.

🔧 OUTPUT FORMAT:
Always return a valid JSON object like this:

{
  "files": {
    "package.json": "code here",
    "App.js": "code here",
    "components/Button.js": "code here",
    "screens/HomeScreen.js": "code here",
    "utils/api.js": "code here"
  },
  "file_tree": [
    "package.json",
    "App.js",
    "components/Button.js",
    "screens/HomeScreen.js",
    "utils/api.js"
  ]
}

STRUCTURE REQUIREMENTS:
- Use industry best practices (modular files, atomic components, clean naming).
- Include package.json, App.js, a components/ folder, and screens/ folder.
- Add comments in code when helpful.
- Generate real code — not placeholder or pseudocode.

🖌️ DESIGN & UI:
- Use modern libraries like react-native-paper, tailwindcss-react-native, or nativewind if relevant.
- Include basic styling or layout where appropriate.
- Avoid inline styles — use StyleSheet or utility classes.

💡 BEHAVIOR:
- If the user prompt is a **general question** (not code generation), return plain text.
- If the user prompt is about generating a UI screen, component, or full app — generate the full file structure as described above.
- Keep code **minimal yet functional** — assume this is a real project.
- If unsure about details, make smart, developer-friendly assumptions.

✅ EXAMPLES:
User: "Create a login screen with email and password input"
AI: Returns a JSON object with:
- screens/LoginScreen.js
- components/InputField.js
- package.json
- App.js

User: "What's the best way to manage state in React Native?"
AI: Responds in plain text with a helpful explanation.

User prompt: ${prompt}`
  );

  const response = await result.response;
  const text = await response.text();

  try {
    const parsed = JSON.parse(text);
    if (parsed && parsed.files) {
      const decodedFiles: Record<string, string> = {};
      for (const [file, content] of Object.entries(parsed.files)) {
        decodedFiles[file] = content.replace(/\\n/g, '\n');
      }
      return { files: decodedFiles, file_tree: parsed.file_tree };
    } else {
      throw new Error("Not a file-based response");
    }
  } catch {
    return { chatResponse: text };
  }
}
