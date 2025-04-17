export const buildTreeStructure = (paths: string[]) => {
    const tree: Record<string, any> = {};
  
    for (const path of paths) {
      const parts = path.split("/");
      let current = tree;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? path : {};
        }
        current = current[part];
      }
    }
  
    return tree;
  };
  
  export const extractJsonFromResponse = (text: string) => {
    try {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        return JSON.parse(match[1]);
      }
      return JSON.parse(text);
    } catch (err) {
      console.error("❌ Failed to extract valid JSON:", err);
      throw new Error("AI returned invalid or malformed JSON.");
    }
  };
  export const detectLanguage = (filename: string) => {
    if (filename.endsWith(".js") || filename.endsWith(".js")) return "javascript";
    if (filename.endsWith(".ts") || filename.endsWith(".tsx")) return "typescript";
    if (filename.endsWith(".json")) return "json";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".md")) return "markdown";
    if (filename.endsWith(".html")) return "html";
    return "javascript"; // Default
  }