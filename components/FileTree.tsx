"use client";
import { FileText, Folder, ChevronRight, ChevronDown, FileCode, Copy, Expand } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface FileTreeProps {
  tree: Record<string, any>;
  onSelect: (path: string) => void;
  selected: string;
}

export const FileTree = ({ tree, onSelect, selected }: FileTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  useEffect(() => {
    const folders: Record<string, boolean> = {};
    const findFolders = (obj: Record<string, any>, path = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value !== "string") {
          const folderPath = path ? `${path}/${key}` : key;
          folders[folderPath] = true;
          findFolders(value, folderPath);
        }
      });
    };
    findFolders(tree);
    setExpandedFolders(folders);
  }, [tree]);

  const renderTree = (obj: Record<string, any>, path = "") => {
    return (
      <ul className="space-y-1">
        {Object.entries(obj).map(([key, value]) => {
          const currentPath = path ? `${path}/${key}` : key;
          if (typeof value === "string") {
            return (
              <motion.li
                key={value}
                whileHover={{ scale: 1.01 }}
                onClick={() => onSelect(value)}
                className={`cursor-pointer pl-6 pr-2 py-1.5 rounded flex items-center gap-2 text-sm transition-colors
                  ${
                    selected === value
                      ? "bg-blue-900/20 text-blue-400"
                      : "hover:bg-slate-800 text-slate-300"
                  }`}
              >
                <FileText 
                  size={14} 
                  className={`flex-shrink-0 ${
                    selected === value 
                      ? "text-blue-400" 
                      : "text-slate-400"
                  }`} 
                />
                <span className="truncate">
                  {key}
                </span>
              </motion.li>
            );
          } else {
            const isExpanded = expandedFolders[currentPath];
            return (
              <motion.li 
                key={currentPath} 
                className="mb-1"
                whileHover={{ scale: 1.01 }}
              >
                <div
                  onClick={() => toggleFolder(currentPath)}
                  className={`flex items-center gap-2 py-1.5 pl-3 pr-2 rounded cursor-pointer text-sm transition-colors
                    ${
                      isExpanded
                        ? "bg-slate-800 text-blue-400"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                >
                  <motion.div 
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    className="flex items-center justify-center w-5 h-5"
                  >
                    <ChevronRight size={14} className="text-slate-400" />
                  </motion.div>
                  <Folder 
                    size={14} 
                    className={`${
                      isExpanded 
                        ? "text-blue-400" 
                        : "text-slate-400"
                    }`} 
                  />
                  <span className="truncate">{key}</span>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-6 pl-2 border-l border-slate-700"
                    >
                      {renderTree(value, currentPath)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          }
        })}
      </ul>
    );
  };

  return (
    <div className="p-2">
      <div className="mb-2 px-2">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Folder size={16} className="text-blue-400" />
          <span>Project Files</span>
          <Badge className="ml-auto bg-slate-800 text-slate-300 border-slate-700 text-xs">
            {Object.keys(tree).length} items
          </Badge>
        </h3>
      </div>
      {renderTree(tree)}
    </div>
  );
};