// components/CodeEditor.tsx
"use client";

import Editor from "@monaco-editor/react";
import { detectLanguage } from "@/lib/fileUtils";

interface CodeEditorProps {
  language?: string;
  value: string;
  onChange: (value: string | undefined) => void;
  fileName: string;
}

export function CodeEditor({ language, value, onChange, fileName }: CodeEditorProps) {
  const editorLanguage = language || detectLanguage(fileName);

  return (
    <div className="h-full w-full overflow-x-scroll">
      <Editor
        height="100%"
        language={editorLanguage}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: "selection",
          padding: { top: 16 },
          lineNumbersMinChars: 3,
          folding: true,
          lineDecorationsWidth: 10,
          contextmenu: false,
          fontFamily: "Fira Code, Menlo, Monaco, Consolas, monospace",
        }}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme("custom-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
              "editor.background": "#0f172a", // slate-900
              "editor.lineHighlightBackground": "#1e293b", // slate-800
              "editorLineNumber.foreground": "#64748b", // slate-500
            },
          });
        }}
        onMount={(editor) => {
          editor.updateOptions({ theme: "custom-dark" });
        }}
      />
    </div>
  );
}