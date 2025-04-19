"use client";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  FileText, Code, Eye, MessageSquare, Loader2, Download, 
  Terminal, Search, ChevronRight, Settings, 
  Zap, ArrowRight, Check, Github, Sparkles,
  Folder, Edit, Save, Play, Command, Plus,
  Copy, Star, BookOpen, PanelLeft, PanelRight,
  RefreshCw, Phone, Layout, CodeIcon, Maximize2, Minimize2,
  User
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import SnackPreview from "@/components/SnackPreview";
import axios from "axios";
import { buildTreeStructure, detectLanguage, extractJsonFromResponse } from "@/lib/fileUtils";
import { FileTree } from "@/components/FileTree";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CodeEditor } from "@/components/CodeEditor";

export default function Home() {
  // State declarations
  const [prompt, setPrompt] = useState("create basic react native app");
  const [files, setFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isCodeRequest, setIsCodeRequest] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [editorContent, setEditorContent] = useState("");
  const [parseError, setParseError] = useState("");
  const [snackData, setSnackData] = useState({});
  const [aiOutput, setAiOutput] = useState("");
  const [dependencies, setDependencies] = useState<Record<string, string>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [promptTemplate, setPromptTemplate] = useState("");
  const [recentProjects, setRecentProjects] = useState([
    { name: "Fitness Tracker", date: "2 days ago" },
    { name: "E-commerce App", date: "1 week ago" },
    { name: "Photo Gallery", date: "3 weeks ago" }
  ]);
  const promptInputRef = useRef(null);

  const templates = [
    { name: "Todo App", prompt: "Create a todo list app with React Native that allows adding, completing, and deleting tasks. Include categories and dark/light mode." },
    { name: "Social Feed", prompt: "Design a social media feed app with posts, likes, comments, and a profile page. Use modern UI components and smooth animations." },
    { name: "E-commerce", prompt: "Build an e-commerce mobile app with product listings, search, cart functionality, and checkout process. Include bottom tab navigation." }
  ];

  const features = [
    { name: "Code Generation", description: "Generate complete React Native projects from text descriptions" },
    { name: "Live Preview", description: "See your app in action with instant web-based previews" },
    { name: "Project Export", description: "Download complete project files ready for deployment" },
    { name: "Component Library", description: "Access to pre-built UI components optimized for mobile" }
  ];
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

 

  useEffect(() => {
    if (selectedFile && files[selectedFile]) {
      setEditorContent(files[selectedFile]);
    }
  }, [selectedFile, files]);

  const handleDownloadZip = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const zip = new JSZip();
      Object.entries(files).forEach(([path, content]) => {
        zip.file(path, content);
      });
  
      zip.generateAsync({ type: "blob" }).then(blob => {
        saveAs(blob, "ReactNativeApp.zip");
        setIsLoading(false);
        setShowCompletionAnimation(true);
        setTimeout(() => setShowCompletionAnimation(false), 3000);
      });
    }, 800);
  };

// In your main component, keep all the original state and file handling logic
// Only modify the chat-related parts as shown below:

// 1. State declarations - keep all your existing state, just add:
const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);

// 2. Modify handleSubmit to maintain both file generation AND chat history:
const handleSubmit = async () => {
  if (!prompt) return;
  setIsLoading(true);
  setActiveTab("editor");
  
  // Add user message to chat
  const userMessage = { role: "user" as const, content: prompt };
  setMessages(prev => [...prev, userMessage]);

  try {
    const request = await axios.post("/api/generateCode", { 
      prompt,
      incomingMessages: messages.filter(m => m.role === "user")
    });

    if (request.status !== 200) {
      throw new Error("Error generating code");
    }

    setParseError("");
    const response = request.data.response;
    const text = request.data.text;

    // Add AI response to chat
    setMessages(prev => [...prev, { role: "assistant", content: text }]);

    try {
      var dependencies = {};
      const parsed = extractJsonFromResponse(text);
      setAiOutput(parsed);
      
      if (parsed && parsed.files) {
        // Keep all your existing file handling logic...
        // This part should remain exactly as you had it originally
        if (parsed.files["package.json"]) {
          const pkg = JSON.parse(parsed.files["package.json"]);
          setDependencies(pkg.dependencies || {});
          dependencies = pkg.dependencies || {};
        }
        
        const decodedFiles: Record<string, string> = {};
        for (const [file, content] of Object.entries(parsed.files)) {
          if (typeof content === "string") {
            decodedFiles[file] = content;
          }
        }

        const snackFiles: Record<string, { type: "CODE" | "ASSET"; contents: string }> = {};
        for (const [filePath, content] of Object.entries(decodedFiles)) {
          const isAsset = filePath.startsWith("assets/") || filePath.match(/\.(png|jpg|jpeg|gif|svg)$/);
          snackFiles[filePath] = {
            type: isAsset ? "ASSET" : "CODE",
            contents: content,
          };
        }
        setPrompt("")
        setSnackData(snackFiles);
        setFiles(decodedFiles);
        const firstFile = Object.keys(decodedFiles)[0];
        setSelectedFile(firstFile);
        setChatResponse("");
        setIsCodeRequest(true);
        setActiveTab("editor");
        setShowEditor(true);
        setShowCompletionAnimation(true);
        setTimeout(() => setShowCompletionAnimation(false), 3000);
      } else {
        throw new Error("Not a file-based response");
      }
    } catch (error) {
      console.error("JSON parsing error:", error);
      const errorMsg = `Failed to parse AI response: ${error instanceof Error ? error.message : "Unknown error"}`;
      setParseError(errorMsg);
      setIsCodeRequest(false);
      setActiveTab("chat");
      setShowEditor(true);
    }
  } catch (error) {
    console.error("Error generating project:", error);
    const errorMsg = `Error communicating with AI: ${error instanceof Error ? error.message : "Unknown error"}`;
    setChatResponse(errorMsg);
    setIsCodeRequest(false);
    setActiveTab("chat");
    setShowEditor(true);
  } finally {
    setIsLoading(false);
  }
};

// 3. Update the chat tab rendering while keeping all other tabs the same:


  const fileTree = buildTreeStructure(Object.keys(files));

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const toggleRightPanel = () => {
    setRightPanelCollapsed(!rightPanelCollapsed);
  };
  
  const focusPromptInput = () => {
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  };

  const useTemplate = (template) => {
    setPrompt(template);
    focusPromptInput();
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-lg">
                <Phone size={18} className="text-white" />
              </div>
              <span className="font-semibold text-lg text-white">
                ReactNative Builder
              </span>
            </Link>
            
            <span className="hidden md:flex h-6 w-px bg-slate-700 mx-1"></span>
            
            <div className="hidden md:flex items-center gap-4">
              <Link href="#features" className="text-sm text-slate-400 hover:text-white">Features</Link>
              <Link href="#docs" className="text-sm text-slate-400 hover:text-white">Docs</Link>
              <Link href="#examples" className="text-sm text-slate-400 hover:text-white">Examples</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hidden sm:flex items-center bg-slate-800 rounded-md px-2 py-1 text-xs text-slate-300 border border-slate-700">
                    <Command size={12} className="mr-1" />
                    <span>K</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Command menu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="sm" className="hidden sm:flex bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
              <Github className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {!showEditor ? (
          /* Initial Page */
          <div className="flex-1 flex flex-col">
            {/* Hero */}
            <section className="relative py-12 md:py-20 border-b border-slate-800 bg-slate-900">
              <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col items-center text-center mb-12">
                  <Badge className="mb-4 bg-blue-900/30 text-blue-400 hover:bg-blue-900/30 border-blue-800">
                    AI-Powered Development
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                    Build React Native Apps <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      With Natural Language
                    </span>
                  </h1>
                  
                  <p className="text-lg text-slate-400 max-w-2xl mb-8">
                    Describe your mobile app idea in plain English and our AI will generate
                    production-ready React Native code in seconds.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button 
                      size="lg" 
                      onClick={focusPromptInput}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Building
                    </Button>
                    
                    <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Demo
                    </Button>
                  </div>
                </div>

                {/* Prompt Input Area */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b border-slate-800 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Edit className="h-4 w-4 text-slate-400" />
                        <h3 className="font-medium text-white">App Description</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                          <Terminal size={12} className="mr-1" />
                          AI Powered
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <Textarea
                      placeholder="Describe your app in detail (e.g., 'Create a fitness tracking app with workout routines, progress tracking, and user profiles...')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-32 focus-visible:ring-blue-500 text-slate-200 bg-slate-900 resize-none border-slate-700"
                      ref={promptInputRef}
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mt-4">
                      <div className="text-xs text-slate-400 flex items-center">
                        <Zap size={12} className="mr-1" />
                        Be specific about UI, navigation, and functionality
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-sm border-slate-700 text-slate-200 hover:bg-slate-800"
                          onClick={() => setPrompt("")}
                          disabled={!prompt}
                        >
                          Clear
                        </Button>
                        
                        <Button
                          onClick={handleSubmit}
                          disabled={isLoading || !prompt}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all relative"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={16} className="mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Code size={16} className="mr-2" />
                              Generate App
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Template Suggestions */}
                  <div className="bg-slate-900/50 border-t border-slate-800 px-4 py-3">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-white">Templates</h4>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-400 hover:text-blue-300">
                        View All
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {templates.map((template, index) => (
                        <div 
                          key={index}
                          onClick={() => useTemplate(template.prompt)}
                          className="bg-slate-800 rounded-md border border-slate-700 p-3 cursor-pointer hover:border-blue-500 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm text-white">{template.name}</span>
                            <Plus size={14} className="text-slate-400" />
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {template.prompt}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-start p-4 rounded-lg border border-slate-800 bg-slate-900"
                    >
                      <div className="bg-blue-900/30 p-2 rounded-md mr-4">
                        {index === 0 && <Code size={20} className="text-blue-400" />}
                        {index === 1 && <Eye size={20} className="text-blue-400" />}
                        {index === 2 && <Download size={20} className="text-blue-400" />}
                        {index === 3 && <Layout size={20} className="text-blue-400" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">{feature.name}</h3>
                        <p className="text-sm text-slate-400">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
  
            {/* Recent Projects */}
            <section className="py-12 bg-slate-900/50 border-b border-slate-800">
              <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                    View All Projects
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentProjects.map((project, index) => (
                    <div 
                      key={index}
                      className="border border-slate-800 rounded-lg bg-slate-800 overflow-hidden group hover:shadow-md transition-shadow"
                    >
                      <div className="bg-gradient-to-r from-slate-700 to-slate-600 h-32 relative">
                        <Phone size={24} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-white">{project.name}</h3>
                          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">{project.date}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1 text-xs text-slate-400">
                            <FileText size={12} />
                            <span>12 files</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 p-0 px-2 text-blue-400 hover:text-blue-300 group-hover:opacity-100 opacity-0 transition-opacity">
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border border-dashed border-slate-700 rounded-lg bg-slate-800/50 h-full flex flex-col items-center justify-center p-6 hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="bg-blue-900/30 p-3 rounded-full mb-3">
                      <Plus size={24} className="text-blue-400" />
                    </div>
                    <span className="text-white font-medium">Create New Project</span>
                    <p className="text-xs text-slate-400 text-center mt-1">
                      Start with a template or blank project
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Editor Interface */
          <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
            {/* Left Sidebar */}
            <AnimatePresence initial={false}>
              <motion.div 
                initial={{ width: "280px" }}
                animate={{ width: sidebarCollapsed ? "48px" : "280px" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="border-r border-slate-800 bg-slate-900 flex flex-col relative"
              >
                <div className="flex items-center p-3 h-12 border-b border-slate-800">
                  {!sidebarCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex items-center"
                    >
                      <span className="font-medium text-sm text-white">Project Files</span>
                    </motion.div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={toggleSidebar}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                  >
                    {sidebarCollapsed ? <PanelRight size={18} /> : <PanelLeft size={18} />}
                  </Button>
                </div>
                
                {!sidebarCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 overflow-hidden flex flex-col"
                  >
                    <div className="p-3 border-b border-slate-800">
                      <div className="bg-slate-800 rounded-md flex items-center px-2">
                        <Search size={14} className="text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search files..." 
                          className="bg-transparent border-0 w-full p-2 text-sm focus:outline-none focus:ring-0 text-slate-200 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2">
                      {isCodeRequest && Object.keys(files).length > 0 ? (
                        <div className="space-y-1">
                          <FileTree
                            tree={fileTree}
                            onSelect={setSelectedFile}
                            selected={selectedFile}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                          <FileText size={24} className="text-slate-600 mb-2" />
                          <p className="text-sm text-slate-400">
                            No files generated yet
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-slate-800 p-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-medium text-white">Dependencies</h3>
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                          {Object.keys(dependencies).length}
                        </Badge>
                      </div>
                      
                      {Object.keys(dependencies).length > 0 ? (
                        <div className="max-h-40 overflow-y-auto">
                          {Object.entries(dependencies).map(([name, version]) => (
                            <div 
                              key={name}
                              className="flex items-center justify-between py-1 text-xs border-b border-slate-800"
                            >
                              <span className="text-slate-300">{name}</span>
                              <span className="text-slate-400">{version}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No dependencies found</p>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full bg-blue-500 border-slate-700 text-slate-200 hover:bg-slate-800"
                          onClick={handleDownloadZip}
                          disabled={Object.keys(files).length === 0}
                        >
                          <Download size={14} className="mr-2" />
                          Export Project
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
              {/* Error Banner */}
              <AnimatePresence>
                {parseError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-900/20 border-b border-red-800/30 text-red-300 p-3 text-sm flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 bg-red-800/30 p-1 rounded-full">
                      <Code size={14} className="text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium">Error Parsing Code</div>
                      <p className="mt-1 text-red-300/80 text-xs">{parseError}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto p-1 h-6 w-6 text-red-300"
                      onClick={() => setParseError("")}
                    >
                      <Code size={12} />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Editor Header */}
              <div className="bg-slate-900 border-b border-slate-800 h-12 flex items-center px-3 justify-between">
                <div className="flex items-center gap-2">
                  {selectedFile ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-slate-800 text-xs px-2 py-0 h-6 border-slate-700 text-slate-300">
                        {selectedFile}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">
                      No file selected
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                    onClick={handleDownloadZip}
                    disabled={Object.keys(files).length === 0}
                  >
                    <Download size={14} className="mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              {/* Editor Content */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="flex-1 flex flex-col h-full"
                >
                  <TabsList className="w-full rounded-none border-b border-slate-800 bg-slate-900">
                    <TabsTrigger value="editor" className="flex items-center gap-2 text-slate-300 hover:text-white data-[state=active]:text-gray-500">
                      <Code size={14} />
                      <span>Editor</span>
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2 text-slate-300 hover:text-white data-[state=active]:text-gray-500">
                      <Eye size={14} />
                      <span>Preview</span>
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="flex items-center gap-2 text-slate-300 hover:text-white data-[state=active]:text-gray-500">
                      <MessageSquare size={14} />
                      <span>Chat</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex-1 relative z-50">
                    <TabsContent value="editor" className="h-full m-0 h-screen">
                      {selectedFile ? (
                        <div className="h-full">
                        <CodeEditor
                        language={detectLanguage(selectedFile)}
                        value={files[selectedFile]}
                        onChange={(value) => {
                          if (value !== undefined) {
                            setFiles((prev) => ({
                              ...prev,
                              [selectedFile]: value,
                            }));
                          }
                        }}
                        fileName={selectedFile}
                      />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                          <Code size={24} className="text-slate-600 mb-2" />
                          <p className="text-sm text-slate-400">
                            Select a file to edit
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    <div className="flex-1 relative z-50">

                    <TabsContent value="preview" className="h-full m-0 bg-slate-900">
                      {Object.keys(snackData).length > 0 ? (
                        <SnackPreview aiOutput={snackData} dependencies={dependencies} />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                          <Eye size={24} className="text-slate-600 mb-2" />
                          <p className="text-sm text-slate-400">
                            Generate a project to see the preview
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    </div>
                    <div className="flex-1 relative z-50">

                    <TabsContent value="chat" className="h-full m-0">
  <div className="h-full flex flex-col bg-slate-900">
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
  {messages.length > 0 ? (
    <>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "assistant" && (
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Code className="h-4 w-4 text-white" />
            </div>
          )}
          <div
            className={`max-w-xl rounded-lg p-3 text-sm ${
              msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            {msg.content}
          </div>
          {msg.role === "user" && (
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-600 flex items-center justifychat his-center">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start gap-3">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Code className="h-4 w-4 text-white" />
          </div>
          <div className="bg-slate-800 text-slate-200 rounded-lg p-3 max-w-xl text-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <MessageSquare size={24} className="text-slate-600 mb-2" />
      <p className="text-sm text-slate-400">
        {isCodeRequest 
          ? "The AI response contains generated code files" 
          : "Ask the AI to generate a project to see the response here"}
      </p>
    </div>
  )}
</div>
    
    <div className="border-t border-slate-800 p-4">
      <div className="relative">
        <Textarea
          placeholder="Ask the AI about the project..."
          className="pr-12 resize-none bg-slate-800 border-slate-700 text-slate-200"
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
        />
        <Button
          size="sm"
          className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
        >
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  </div>
</TabsContent>
                    </div>
                  </div>
                </Tabs>
              </div>
            </div>

            {/* Right Sidebar */}
            <AnimatePresence initial={false}>
              {!rightPanelCollapsed && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "300px" }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border-l border-slate-800 bg-slate-900 flex flex-col"
                >
                  <div className="flex items-center p-3 h-12 border-b border-slate-800">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex items-center"
                    >
                      <span className="font-medium text-sm text-white">AI Output</span>
                    </motion.div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={toggleRightPanel}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                    >
                      <PanelLeft size={18} />
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
                    {aiOutput ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-xs text-slate-300">{JSON.stringify(aiOutput, null, 2)}</pre>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <Code size={24} className="text-slate-600 mb-2" />
                        <p className="text-sm text-slate-400">
                          Generate a project to see the AI output
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Right Panel Toggle */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleRightPanel}
                className="h-10 w-6 p-0 rounded-l-none border border-l-0 border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                {rightPanelCollapsed ? <PanelLeft size={16} /> : <PanelRight size={16} />}
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1 rounded-md">
                <Phone size={16} className="text-white" />
              </div>
              <span className="font-medium text-white">ReactNative Builder</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-slate-400 hover:text-white">Docs</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-white">API</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-white">GitHub</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-white">Twitter</Link>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
            <p>© {new Date().getFullYear()} ReactNative Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Completion Animation */}
      <AnimatePresence>
        {showCompletionAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50"
          >
            <Check size={18} />
            <span>Project exported successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}