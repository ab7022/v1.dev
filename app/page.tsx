// File: pages/index.tsx (Enhanced Frontend UI for React Native AI generator + Chat)
"use client";
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Folder, Code, Eye, MessageSquare, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const Preview = dynamic(() => import('@/components/Preview'), { ssr: false });

// Utility to display folder-like structure
function buildTreeStructure(paths: string[]) {
  const tree: Record<string, any> = {};

  for (const path of paths) {
    const parts = path.split('/');
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
}

// Improved FileTree component with collapsible folders
function FileTree({ tree, onSelect, selected }: any) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  // Initialize all folders as expanded
  useEffect(() => {
    const folders: Record<string, boolean> = {};
    const findFolders = (obj: Record<string, any>, path = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value !== 'string') {
          const folderPath = path ? `${path}/${key}` : key;
          folders[folderPath] = true;
          findFolders(value, folderPath);
        }
      });
    };
    
    findFolders(tree);
    setExpandedFolders(folders);
  }, [tree]);

  const renderTree = (obj: Record<string, any>, path = '') => {
    return (
      <ul className="space-y-1">
        {Object.entries(obj).map(([key, value]) => {
          const currentPath = path ? `${path}/${key}` : key;
          if (typeof value === 'string') {
            return (
              <li
                key={value}
                onClick={() => onSelect(value)}
                className={`cursor-pointer pl-3 py-1 rounded-md flex items-center gap-2 hover:bg-gray-700 transition-colors ${selected === value ? 'bg-gray-700 text-blue-300' : 'bg-transparent'}`}
              >
                <FileText size={14} className="flex-shrink-0" /> 
                <span className="truncate text-sm">{key}</span>
              </li>
            );
          } else {
            const isExpanded = expandedFolders[currentPath];
            return (
              <li key={currentPath} className="mb-1">
                <div 
                  onClick={() => toggleFolder(currentPath)}
                  className="flex items-center gap-1 py-1 pl-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Folder size={14} className="text-blue-400" /> 
                  <span className="text-sm font-medium">{key}</span>
                </div>
                {isExpanded && (
                  <div className="ml-4 border-l border-gray-700 pl-1">
                    {renderTree(value, currentPath)}
                  </div>
                )}
              </li>
            );
          }
        })}
      </ul>
    );
  };

  return renderTree(tree);
}

// Language detection for syntax highlighting
function detectLanguage(filename: string): string {
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
  if (filename.endsWith('.json')) return 'json';
  if (filename.endsWith('.css')) return 'css';
  if (filename.endsWith('.md')) return 'markdown';
  if (filename.endsWith('.html')) return 'html';
  return 'javascript'; // Default
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isCodeRequest, setIsCodeRequest] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [editorContent, setEditorContent] = useState('');
  const [parseError, setParseError] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey || '');

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

  useEffect(() => {
    if (selectedFile && files[selectedFile]) {
      setEditorContent(files[selectedFile]);
    }
  }, [selectedFile, files]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && selectedFile) {
      setEditorContent(value);
      setFiles(prev => ({
        ...prev,
        [selectedFile]: value
      }));
    }
  };

  // Helper to extract JSON from AI response which might include markdown or other text
  const extractJsonFromResponse = (text: string) => {
    try {
      // Look for JSON object in the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonText = jsonMatch[0];
        return JSON.parse(jsonText);
      }
      
      // If no match with braces, try to parse the entire text
      return JSON.parse(text);
    } catch (error) {
      console.error("Failed to extract JSON:", error);
      throw new Error("Failed to parse AI response as JSON");
    }
  };

  const handleSubmit = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setParseError('');

    try {
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
        // Extract JSON from the response
        const parsed = extractJsonFromResponse(text);
        
        if (parsed && parsed.files) {
          const decodedFiles: Record<string, string> = {};
          for (const [file, content] of Object.entries(parsed.files)) {
            if (typeof content === 'string') {
              decodedFiles[file] = content;
            } else {
              console.warn(`Skipping file ${file} due to invalid content type.`);
            }
          }
          setFiles(decodedFiles);
          const firstFile = Object.keys(decodedFiles)[0];
          setSelectedFile(firstFile);
          setChatResponse('');
          setIsCodeRequest(true);
          setActiveTab('editor');
        } else {
          throw new Error('Not a file-based response');
        }
      } catch (error) {
        console.error("JSON parsing error:", error);
        setParseError(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsCodeRequest(false);
        setChatResponse(text);
        setActiveTab('chat');
      }
    } catch (error) {
      console.error("Error generating project:", error);
      setChatResponse(`Error communicating with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsCodeRequest(false);
      setActiveTab('chat');
    } finally {
      setIsLoading(false);
    }
  };

  const fileTree = buildTreeStructure(Object.keys(files));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-850 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code size={20} className="text-blue-400" />
          <h1 className="text-xl font-bold">React Native Builder</h1>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-600">
                  Powered by Gemini
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Using Gemini 2.0 Flash API</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-gray-700 bg-gray-850 p-4 flex flex-col">
          <h2 className="text-md font-medium mb-3 text-gray-300">AI Prompt</h2>
          <Textarea
            placeholder="Describe a React Native app or component..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="mb-3 text-white bg-gray-800 border-gray-700 resize-none h-32"
          />
          <Button 
            onClick={handleSubmit} 
            className="mb-4 bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center"
            disabled={isLoading || !prompt}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" /> Generating
              </>
            ) : 'Generate Code'}
          </Button>

          {isCodeRequest && Object.keys(files).length > 0 && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <h3 className="text-sm font-medium mb-2 text-gray-300">File Explorer</h3>
              <div className="flex-1 overflow-y-auto border border-gray-700 rounded-lg p-1 bg-gray-800/50">
                <FileTree tree={fileTree} onSelect={setSelectedFile} selected={selectedFile} />
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {parseError && (
            <div className="bg-red-900/20 border border-red-700 text-red-300 p-3 m-3 rounded-md text-sm">
              {parseError}
            </div>
          )}
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="flex-1 flex flex-col"
          >
            <TabsList className="bg-gray-800 border-b border-gray-700 p-1 px-4">
              <TabsTrigger 
                value="editor" 
                className="data-[state=active]:bg-gray-700"
                disabled={!isCodeRequest || !selectedFile}
              >
                <FileText size={16} className="mr-2" /> Editor
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-gray-700"
                disabled={!isCodeRequest || !files['App.js']}
              >
                <Eye size={16} className="mr-2" /> Preview
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:bg-gray-700"
                disabled={isCodeRequest}
              >
                <MessageSquare size={16} className="mr-2" /> Chat Response
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 p-0 flex flex-col overflow-hidden">
              {selectedFile && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <span className="text-sm font-medium">{selectedFile}</span>
                    <Badge variant="outline" className="ml-2 bg-gray-700 text-xs">
                      {detectLanguage(selectedFile)}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      language={detectLanguage(selectedFile)}
                      value={editorContent}
                      theme="vs-dark"
                      onChange={handleEditorChange}
                      options={{ 
                        fontSize: 14, 
                        minimap: { enabled: true },
                        readOnly: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        wordWrap: 'on'
                      }}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="flex-1 p-4 bg-gray-850 overflow-auto">
              {files['App.js'] && (
                <div className="h-full flex flex-col">
                  <h2 className="text-md font-semibold mb-3">Live Preview</h2>
                  <div className="flex-1 border border-gray-700 rounded-xl overflow-hidden bg-gray-800">
                    <Preview code={files['App.js']} />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Note: This is a web-based preview. Some React Native features may not render correctly.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chat" className="flex-1 p-4 bg-gray-850 overflow-auto">
              {chatResponse && (
                <div className="h-full flex flex-col">
                  <h2 className="text-md font-semibold mb-3">AI Response</h2>
                  <div className="flex-1 border border-gray-700 rounded-xl overflow-hidden">
                    <Editor
                      height="100%"
                      language="markdown"
                      value={chatResponse}
                      theme="vs-dark"
                      options={{ 
                        fontSize: 14, 
                        readOnly: true, 
                        minimap: { enabled: false },
                        wordWrap: 'on'
                      }}
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}