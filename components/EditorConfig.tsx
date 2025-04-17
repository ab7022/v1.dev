
// File: components/EditorConfig.tsx
"use client";
import { useEffect } from 'react';
import { loader } from '@monaco-editor/react';

// Configure Monaco Editor for better syntax highlighting and theme
export default function configureMonaco() {
  useEffect(() => {
    // Define a custom theme with better syntax highlighting
    loader.init().then(monaco => {
      monaco.editor.defineTheme('bolt-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6C8A9C', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'C586C0' },
          { token: 'string', foreground: '4EC9B0' },
          { token: 'number', foreground: 'B5CEA8' },
          { token: 'regexp', foreground: 'D16969' },
          { token: 'operator', foreground: 'D4D4D4' },
          { token: 'namespace', foreground: '4EC9B0' },
          { token: 'type', foreground: '4EC9B0' },
          { token: 'struct', foreground: '4EC9B0' },
          { token: 'class', foreground: '4EC9B0' },
          { token: 'interface', foreground: '4EC9B0' },
          { token: 'enum', foreground: '4EC9B0' },
          { token: 'typeParameter', foreground: '4EC9B0' },
          { token: 'function', foreground: '88BAFF' },
          { token: 'member', foreground: '9CDCFE' },
          { token: 'variable', foreground: '9CDCFE' },
          { token: 'variable.predefined', foreground: '4FC1FF' },
          { token: 'constant', foreground: '4FC1FF' },
          { token: 'annotation', foreground: 'DCDCAA' },
          { token: 'tag', foreground: '569CD6' },
          { token: 'attribute.name', foreground: '9CDCFE' },
          { token: 'attribute.value', foreground: 'CE9178' },
          { token: 'delimiter', foreground: 'D4D4D4' },
          { token: 'delimiter.html', foreground: '808080' },
          { token: 'delimiter.xml', foreground: '808080' },
          { token: 'meta', foreground: 'D4D4D4' },
          { token: 'meta.tag', foreground: '569CD6' },
        ],
        colors: {
          'editor.foreground': '#D4D4D4',
          'editor.background': '#121318',
          'editor.selectionBackground': '#264F78',
          'editor.lineHighlightBackground': '#1D2028',
          'editorCursor.foreground': '#85C5FF',
          'editorWhitespace.foreground': '#404040',
          'editorLineNumber.foreground': '#4D5569',
          'editorLineNumber.activeForeground': '#85C5FF',
          'editor.selectionHighlightBackground': '#333B40',
          'editor.findMatchBackground': '#515C6A',
          'editor.findMatchHighlightBackground': '#3A3D41',
          'editorBracketMatch.background': '#292F46',
          'editorBracketMatch.border': '#4C5374',
          'editorGutter.background': '#12131A',
          'editorWidget.background': '#1E2030',
          'editorWidget.border': '#303450',
          'editorSuggestWidget.background': '#1E2030',
          'scrollbarSlider.background': '#303450AA',
          'scrollbarSlider.hoverBackground': '#303450DD',
        }
      });
    });
  }, []);

  return null;
}

// Custom CSS you might want to add to your global stylesheet:
// .editor-container {
//   position: relative;
//   overflow: hidden;
// }
// 
// .editor-container::after {
//   content: '';
//   position: absolute;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   width: 6px;
//   background: linear-gradient(to right, transparent, rgba(28, 30, 38, 0.8));
//   pointer-events: none;
//   z-index: 10;
// }