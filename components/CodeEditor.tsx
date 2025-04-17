import Editor from "@monaco-editor/react";
import { Badge } from "@/components/ui/badge";
import { FileCode, Copy, Download, Expand } from "lucide-react";
import { useState } from "react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  fileName?: string;
}

export const CodeEditor = ({
  language,
  value,
  onChange,
  readOnly = false,
  fileName,
}: CodeEditorProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div 
      className="flex-1 flex flex-col overflow-hidden rounded-lg border border-gray-800 bg-gray-900/90 shadow-xl backdrop-blur-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {fileName && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/70 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <FileCode size={16} className="text-indigo-400" />
            <span className="text-sm font-medium text-gray-200">{fileName}</span>
            <Badge variant="outline" className="bg-gray-700/60 text-xs text-cyan-300 border-cyan-800/40 backdrop-blur-sm">
              {language}
            </Badge>
          </div>
          
          <div className={`flex space-x-2 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              className="p-1 rounded hover:bg-gray-700/60 text-gray-400 hover:text-cyan-300 transition-colors"
              onClick={copyToClipboard}
              title="Copy code"
            >
              <Copy size={14} />
            </button>
            <button 
              className="p-1 rounded hover:bg-gray-700/60 text-gray-400 hover:text-cyan-300 transition-colors"
              title="Expand editor"
            >
              <Expand size={14} />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-gray-900/10 pointer-events-none" />
        <Editor
          height="100%"
          language={language}
          value={value}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            readOnly,
            wordWrap: readOnly ? "on" : "off",
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "phase",
            cursorSmoothCaretAnimation: "on",
            fontLigatures: true,
          }}
          onChange={onChange}
          className="editor-container"
        />
      </div>
    </div>
  );
};
