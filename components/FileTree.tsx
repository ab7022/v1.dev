import { FileText, Folder, ChevronRight, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
              <li
                key={value}
                onClick={() => onSelect(value)}
                className={`cursor-pointer pl-3 py-2 rounded-md flex items-center gap-2 transition-all duration-200 
                  ${
                    selected === value
                      ? "bg-gray-800/80 text-blue-300 shadow-lg border-l-2 border-cyan-400"
                      : "bg-transparent hover:bg-gray-800/50 hover:border-l hover:border-cyan-500/50"
                  }`}
              >
                <FileText 
                  size={14} 
                  className={`flex-shrink-0 ${selected === value ? "text-cyan-400" : "text-blue-500/70"}`} 
                />
                <span className="truncate text-sm">{key}</span>
              </li>
            );
          } else {
            const isExpanded = expandedFolders[currentPath];
            return (
              <li key={currentPath} className="mb-1">
                <div
                  onClick={() => toggleFolder(currentPath)}
                  className="flex items-center gap-2 py-2 pl-3 rounded-md cursor-pointer text-gray-300 
                    hover:bg-gray-800/30 hover:text-white transition-all duration-200 
                    backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-800/70">
                    {isExpanded ? 
                      <ChevronDown size={10} className="text-cyan-400" /> : 
                      <ChevronRight size={10} className="text-cyan-400" />
                    }
                  </div>
                  <Folder size={14} className="text-indigo-400" />
                  <span className="text-sm font-medium">{key}</span>
                </div>
                {isExpanded && (
                  <div className="ml-4 pl-2 border-l border-indigo-900/50">
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

  return (
    <div className="p-3 rounded-lg bg-gray-900/90 backdrop-blur-md border border-gray-800 shadow-xl">
      <div className="mb-3 px-2 pb-2 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-200 flex items-center gap-2">
          <Folder size={14} className="text-indigo-400" />
          <span>Project Files</span>
        </h3>
      </div>
      {renderTree(tree)}
    </div>
  );
};