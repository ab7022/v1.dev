"use client";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Code,
  Eye,
  MessageSquare,
  Loader2,
  Download,
  Command,
  Search,
  ChevronRight,
  Settings,
  MoreVertical,
  Zap,
  ArrowRight,
  Check,
  Share2,
  Save,
  Package,
  PlayCircle,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  CloudLightning,
  Smartphone,
  Github
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import SnackPreview from "@/components/SnackPreview";
import axios from "axios";
import { buildTreeStructure, detectLanguage, extractJsonFromResponse } from "@/lib/fileUtils";
import { FileTree } from "@/components/FileTree";
import { CodeEditor } from "@/components/CodeEditor";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState("");
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const promptInputRef = useRef(null);
  
  const tips = [
    "Try describing a complete app functionality in your prompt",
    "Specify UI components and design preferences",
    "Include platform-specific features if needed",
    "Mention state management approaches",
    "Request specific navigation patterns"
  ];

  useEffect(() => {
    if (selectedFile && files[selectedFile]) {
      setEditorContent(files[selectedFile]);
    }
  }, [selectedFile, files]);

  useEffect(() => {
    // Auto-rotate tips every 5 seconds
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
        
        // Show completion animation
        setShowCompletionAnimation(true);
        setTimeout(() => setShowCompletionAnimation(false), 3000);
      });
    }, 800); // Slight delay for animation effect
  };

  const handleSubmit = async () => {
    if (!prompt) return;
    setIsLoading(true);
    
    // Animation states
    setActiveTab("editor");
    
    const request = await axios.post("/api/generateCode", { prompt });
    if (request.status !== 200) {
      setIsLoading(false);
      setChatResponse("Error generating code. Please try again.");
      return;
    }

    setParseError("");
    const response = request.data.response;
    const text = request.data.text;

    try {
      var dependencies = {};

      try {
        const parsed = extractJsonFromResponse(text);
        setAiOutput(parsed);
        console.log("Parsed AI Output:", parsed);
        const pkg = JSON.parse(parsed.files["package.json"]);
        setDependencies(pkg.dependencies || {});
        dependencies = pkg.dependencies || {};
        console.log("Dependencies:", dependencies);
        if (parsed && parsed.files) {
          const decodedFiles: Record<string, string> = {};
          for (const [file, content] of Object.entries(parsed.files)) {
            if (typeof content === "string") {
              decodedFiles[file] = content;
            }
          }

          const snackFiles: Record<
            string,
            { type: "CODE" | "ASSET"; contents: string }
          > = {};
          for (const [filePath, content] of Object.entries(decodedFiles)) {
            const isAsset =
              filePath.startsWith("assets/") ||
              filePath.match(/\.(png|jpg|jpeg|gif|svg)$/);
            snackFiles[filePath] = {
              type: isAsset ? "ASSET" : "CODE",
              contents: content,
            };
          }

          setSnackData(snackFiles);
          setFiles(decodedFiles);
          const firstFile = Object.keys(decodedFiles)[0];
          setSelectedFile(firstFile);
          setChatResponse("");
          setIsCodeRequest(true);
          setActiveTab("editor");
          
          // Show completion animation
          setShowCompletionAnimation(true);
          setTimeout(() => setShowCompletionAnimation(false), 3000);
        } else {
          throw new Error("Not a file-based response");
        }
      } catch (error) {
        console.error("JSON parsing error:", error);
        setParseError(
          `Failed to parse AI response: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setIsCodeRequest(false);
        setChatResponse(text);
        setActiveTab("chat");
      }
    } catch (error) {
      console.error("Error generating project:", error);
      setChatResponse(
        `Error communicating with AI: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setIsCodeRequest(false);
      setActiveTab("chat");
    } finally {
      setIsLoading(false);
    }
  };

  const fileTree = buildTreeStructure(Object.keys(files));

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const focusPromptInput = () => {
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-950 to-indigo-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-indigo-900/60 bg-gradient-to-r from-gray-900 to-indigo-900/10 p-3 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg"
          >
            <Code size={20} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">ReactNative Forge</h1>
            <p className="text-xs text-indigo-300 -mt-1">Build. Preview. Ship.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 bg-indigo-800/30 px-3 py-1.5 rounded-full border border-indigo-700/50 text-xs"
          >
            <Command size={14} className="text-indigo-400" />
            <span className="text-indigo-200">Press</span>
            <kbd className="bg-indigo-900/70 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-700">⌘ K</kbd>
          </motion.div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex gap-1.5 items-center"
                >
                  <Badge
                    variant="outline"
                    className="bg-indigo-900/40 text-indigo-200 border-indigo-700/50 py-1.5"
                  >
                    <CloudLightning size={14} className="mr-1 text-indigo-400" />
                    Powered by Gemini
                  </Badge>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-indigo-900 border-indigo-700">
                <p>Using Gemini 2.0 Flash API</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-indigo-800/30 transition-colors"
          >
            <Github size={18} className="text-indigo-300" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-indigo-800/30 transition-colors"
          >
            <Settings size={18} className="text-indigo-300" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <AnimatePresence initial={false}>
          <motion.div 
            initial={{ width: "320px" }}
            animate={{ 
              width: sidebarCollapsed ? "64px" : "320px",
              opacity: sidebarCollapsed ? 0.7 : 1
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-r border-indigo-900/60 bg-gradient-to-b from-gray-900 to-indigo-950/70 flex flex-col overflow-hidden"
          >
            <div className="flex items-center p-3 border-b border-indigo-900/30">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSidebar}
                className="p-1.5 rounded-md hover:bg-indigo-800/30 transition-colors mr-2"
              >
                {sidebarCollapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
              </motion.button>
              
              {!sidebarCollapsed && (
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-md font-medium text-indigo-200"
                >
                  Project Workspace
                </motion.h2>
              )}
            </div>
            
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 flex flex-col gap-3"
              >
                <div className="relative">
                  <div 
                    className="absolute top-3 right-3 text-xs text-indigo-400 flex items-center cursor-pointer hover:text-indigo-300"
                    onClick={() => setShowTips(!showTips)}
                  >
                    <Zap size={14} className="mr-1" />
                    Tips
                    <ChevronDown size={14} className="ml-1" />
                  </div>
                  
                  <h2 className="text-sm font-medium mb-2 text-indigo-300">AI Prompt</h2>
                  
                  <AnimatePresence>
                    {showTips && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mb-2 bg-indigo-900/30 border border-indigo-800/60 rounded-lg p-2 text-xs text-indigo-300"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Prompt Tips</span>
                          <span className="text-indigo-400">{currentTip + 1}/{tips.length}</span>
                        </div>
                        <p>{tips[currentTip]}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="bg-indigo-950/50 rounded-lg border border-indigo-900/60 p-0.5 transition-all focus-within:ring-1 focus-within:ring-indigo-600">
                    <Textarea
                      placeholder="Describe a React Native app or component..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-32 resize-none text-indigo-100 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-indigo-500"
                      ref={promptInputRef}
                    />
                    
                    <div className="flex items-center justify-between p-2 border-t border-indigo-900/30">
                      <div className="text-xs text-indigo-500">
                        <PlusCircle size={14} className="inline mr-1" />
                        Describe your app
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={isLoading || !prompt}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all
                          ${isLoading || !prompt 
                            ? 'bg-indigo-800/30 text-indigo-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-500 hover:to-indigo-500'
                          }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> 
                            <span>Generating</span>
                          </>
                        ) : (
                          <>
                            <Zap size={16} /> 
                            <span>Generate</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadZip}
                    disabled={Object.keys(files).length === 0 || isLoading}
                    className={`flex-1 py-2 rounded-md flex items-center justify-center gap-1.5 text-sm transition-all
                      ${Object.keys(files).length === 0 || isLoading
                        ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                        : 'bg-indigo-800/40 text-indigo-200 border border-indigo-700/50 hover:bg-indigo-800/60'
                      }`}
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={Object.keys(files).length === 0}
                    className={`flex-1 py-2 rounded-md flex items-center justify-center gap-1.5 text-sm transition-all
                      ${Object.keys(files).length === 0 
                        ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                        : 'bg-emerald-900/30 text-emerald-200 border border-emerald-800/40 hover:bg-emerald-900/50'
                      }`}
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </motion.button>
                </div>

                {isCodeRequest && Object.keys(files).length > 0 && (
                  <div className="flex-1 overflow-hidden flex flex-col mt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-indigo-300">
                        Files
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-900/40 text-indigo-300 border-indigo-800/50 text-xs">
                          {Object.keys(files).length} files
                        </Badge>
                        <Search size={14} className="text-indigo-400" />
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto mt-2 border border-indigo-900/50 rounded-lg py-1 px-0.5 bg-indigo-950/30">
                      <FileTree
                        tree={fileTree}
                        onSelect={setSelectedFile}
                        selected={selectedFile}
                      />
                    </div>
                    
                    {dependencies && Object.keys(dependencies).length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-medium text-indigo-400">
                            <Package size={12} className="inline mr-1" />
                            Dependencies
                          </h3>
                          <Badge className="bg-indigo-900/40 text-indigo-300 border-indigo-800/50 text-xs">
                            {Object.keys(dependencies).length}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-indigo-300/70 max-h-32 overflow-y-auto">
                          {Object.entries(dependencies).map(([name, version]) => (
                            <div key={name} className="flex items-center justify-between py-1 border-b border-indigo-900/30">
                              <span>{name}</span>
                              <span className="text-indigo-400">{version}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950/30">
          <AnimatePresence>
            {parseError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-900/20 border border-red-700/50 text-red-300 p-3 m-3 rounded-md text-sm"
              >
                <div className="flex items-center gap-2">
                  <X size={18} className="text-red-400" />
                  <span>Error Parsing Response</span>
                </div>
                <p className="mt-1 text-red-300/80">{parseError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="bg-gradient-to-r from-gray-900 to-indigo-950/70 border-b border-indigo-900/60 px-4 py-1 flex items-center justify-between">
              <TabsList className="bg-indigo-950/30 border border-indigo-900/50 p-0.5 rounded-md">
                <TabsTrigger
                  value="editor"
                  className="rounded px-3 py-1.5 text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-indigo-300 data-[state=inactive]:hover:bg-indigo-900/50"
                  disabled={!isCodeRequest || !selectedFile}
                >
                  <FileText size={16} className="mr-2" /> Editor
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="rounded px-3 py-1.5 text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-indigo-300 data-[state=inactive]:hover:bg-indigo-900/50"
                >
                  <PlayCircle size={16} className="mr-2" /> Preview
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="rounded px-3 py-1.5 text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-indigo-300 data-[state=inactive]:hover:bg-indigo-900/50"
                  disabled={isCodeRequest}
                >
                  <MessageSquare size={16} className="mr-2" /> AI Response
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-3">
                {selectedFile && (
                  <div className="text-xs text-indigo-300 bg-indigo-900/30 px-2 py-1 rounded-md border border-indigo-800/50">
                    {selectedFile}
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-md hover:bg-indigo-800/30 text-indigo-300 transition-colors"
                >
                  <Smartphone size={16} />
                </motion.button>
              </div>
            </div>

            <TabsContent
              value="editor"
              className="flex-1 p-0 flex flex-col overflow-hidden relative"
            >
              {selectedFile ? (
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
              ) : (
                <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-4 p-4 rounded-full bg-indigo-900/30 border border-indigo-800/50"
                  >
                    <Code size={32} className="text-indigo-400" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-indigo-200 mb-2">Ready to Build</h3>
                  <p className="text-indigo-300 max-w-md mb-6">
                    Enter a detailed prompt to generate your React Native app. Be specific about UI components, navigation, and functionality.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={focusPromptInput}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-md text-white flex items-center gap-2 shadow-lg"
                  >
                    <ArrowRight size={18} />
                    Get Started
                  </motion.button>
                </div>
              )}
              
              <AnimatePresence>
                {showCompletionAnimation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-900/80 backdrop-blur-md border border-indigo-700 rounded-xl p-4 shadow-xl flex items-center gap-3"
                  >
                    <div className="bg-green-500 p-2 rounded-full">
                      <Check size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Success!</h3>
                      <p className="text-indigo-200 text-sm">Your code has been generated.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent
              value="preview"
              className="flex-1 p-4 overflow-auto"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-md font-semibold text-indigo-200 flex items-center gap-2">
                    <Eye size={18} className="text-indigo-400" />
                    Live Preview
                  </h2>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-900/20 text-blue-300 border-blue-800/40">
                      Web Preview
                    </Badge>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 rounded-md bg-indigo-900/30 text-indigo-300 border border-indigo-800/40 hover:bg-indigo-800/40"
                    >
                      <MoreVertical size={16} />
                    </motion.button>
                  </div>
                </div>
                
                <div className="flex-1 rounded-xl overflow-hidden border border-indigo-900/60 shadow-xl bg-gray-950">
                  <div className="bg-gradient-to-r from-gray-800 to-indigo-900/50 border-b border-indigo-900/60 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-xs text-indigo-300">React Native Web Preview</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 rounded-md hover:bg-indigo-900/40 text-indigo-400"
                      >
                        <ArrowRight size={14} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <SnackPreview
                    aiOutput={snackData}
                    dependencies={dependencies}
                  />
                </div>
                
                <div className="mt-3 text-xs text-indigo-400/70 flex items-center gap-1.5">
                  <Smartphone size={14} className="text-indigo-400" />
                  <span>Note: This is a web-based preview. Some React Native features may not render correctly.</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="chat"
              className="flex-1 p-4 overflow-auto"
            >
              {chatResponse && (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-md font-semibold text-indigo-200 flex items-center gap-2">
                      <MessageSquare size={18} className="text-indigo-400" />
                      AI Response
                    </h2>
                    
                    <div className="flex items-center gap-2">
                      <Badge className="bg-indigo-900/30 text-indigo-300 border-indigo-800/40">
                        <CloudLightning size={14} className="mr-1" />
                        Gemini
                      </Badge>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 rounded-md bg-indigo-900/30 text-indigo-300 border border-indigo-800/40 hover:bg-indigo-800/40"
                      >
                        <Save size={16} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex-1 border border-indigo-900/60 rounded-xl overflow-hidden shadow-lg">
                    <Editor
                      height="100%"
                      language="markdown"
                      value={chatResponse}
                      theme="vs-dark"
                      options={{
                        fontSize: 14,
                        readOnly: true,
                        minimap: { enabled: true },
                        wordWrap: "on",
                        padding: { top: 16, bottom: 16 },
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-indigo-900/70 border-t border-indigo-900/60 p-2 px-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-indigo-400">ReactNative Forge</span>
          <span className="text-indigo-600">•</span>
          <span className="text-indigo-400/70">v1.0.0</span>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoading && (
            <div className="flex items-center gap-2 text-indigo-300">
              <Loader2 size={14} className="animate-spin" />
              <span>Processing...</span>
            </div>
          )}
          
          {Object.keys(files).length > 0 && !isLoading && (
            <div className="text-indigo-400/70 flex items-center gap-2">
              <FileText size={14} className="text-indigo-400" />
              <span>{Object.keys(files).length} files generated</span>
            </div>
          )}
        </div>
      </footer>
      
      {/* Command Palette */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={toggleFullscreen}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 border border-indigo-900/60 rounded-xl shadow-2xl w-full max-w-2xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <Search size={20} className="text-indigo-400" />
              <input
                type="text"
                placeholder="Search commands, files, or ask for help..."
                className="bg-transparent border-none outline-none text-white flex-1"
                autoFocus
              />
              <kbd className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs">ESC</kbd>
            </div>
            
            <div className="border-t border-indigo-900/40 pt-3">
              <div className="text-xs text-indigo-500 mb-2">Quick Actions</div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between p-2 rounded hover:bg-indigo-900/40 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Zap size={16} className="text-indigo-400" />
                    <span className="text-indigo-200">Generate New Project</span>
                  </div>
                  <kbd className="bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-xs">G</kbd>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded hover:bg-indigo-900/40 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Eye size={16} className="text-indigo-400" />
                    <span className="text-indigo-200">Toggle Preview</span>
                  </div>
                  <kbd className="bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-xs">P</kbd>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded hover:bg-indigo-900/40 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Download size={16} className="text-indigo-400" />
                    <span className="text-indigo-200">Download Project</span>
                  </div>
                  <kbd className="bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-xs">D</kbd>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded hover:bg-indigo-900/40 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Settings size={16} className="text-indigo-400" />
                    <span className="text-indigo-200">Open Settings</span>
                  </div>
                  <kbd className="bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-xs">S</kbd>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}