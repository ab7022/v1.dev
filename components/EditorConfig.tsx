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
          { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'C586C0' },
          { token: 'string', foreground: 'CE9178' },
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
          { token: 'function', foreground: 'DCDCAA' },
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
          'editor.background': '#1E1E1E',
          'editor.selectionBackground': '#264F78',
          'editor.lineHighlightBackground': '#2A2D2E',
          'editorCursor.foreground': '#AEAFAD',
          'editorWhitespace.foreground': '#404040',
          'editorLineNumber.foreground': '#858585',
          'editor.selectionHighlightBackground': '#333B40',
          'editor.findMatchBackground': '#515C6A',
          'editor.findMatchHighlightBackground': '#3A3D41',
        }
      });
    });
  }, []);

  return null;
}