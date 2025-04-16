// File: components/Preview.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import * as Babel from '@babel/standalone';

export default function Preview({ code }: { code: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    try {
      // Pre-process code to handle React Native specifics
      const processedCode = code
        // Handle React Native specific imports that won't work in browser
        .replace(/import {([^}]*)} from ['"]react-native['"];?/g, 
                 'const {$1} = ReactNative;')
        // Handle other React Native specific imports
        .replace(/import ([^{]*) from ['"]react-native['"];?/g, 
                 'const $1 = ReactNative;')
        // Handle expo imports
        .replace(/import {([^}]*)} from ['"]expo([^'"]*)['"]/g, 
                 '// Expo import removed: {$1} from expo$2')
        // Handle AppRegistry
        .replace(/AppRegistry\.registerComponent\(['"]([^'"]*)['"],[^;]*;/g, 
                 '// AppRegistry.registerComponent removed');

      // Transpile the processed code
      const transpiled = Babel.transform(processedCode, {
        presets: ['react', 'env'],
        plugins: ['transform-class-properties', 'transform-object-rest-spread']
      }).code;

      // Create HTML with proper React Native Web polyfills
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              html, body {
                margin: 0;
                padding: 0;
                background: #1a1a1a;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                height: 100%;
                overflow: hidden;
              }
              #root {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: 16px;
              }
              .error {
                color: #ff3e3e;
                background: rgba(255, 0, 0, 0.1);
                border: 1px solid rgba(255, 0, 0, 0.2);
                border-radius: 4px;
                padding: 10px;
                margin: 10px 0;
                font-family: monospace;
                white-space: pre-wrap;
                overflow-wrap: break-word;
              }
            </style>
            <!-- React and React DOM -->
            <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
            
            <!-- React Native Web (for React Native compatibility) -->
            <script src="https://unpkg.com/react-native-web@0.18.10/dist/index.js"></script>
            
            <script>
              // Create React Native compatibility layer
              window.ReactNative = window.ReactNativeWeb;
              
              // Define common React Native components
              const { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, FlatList } = ReactNative;
              
              // Mock Paper components if used in the code
              window.ReactNativePaper = {
                Provider: ({children}) => children,
                Text: ({children, style, ...props}) => React.createElement(Text, {style, ...props}, children),
                Button: ({children, mode, style, onPress, ...props}) => {
                  const buttonStyle = mode === 'contained' 
                    ? {backgroundColor: '#6200ee', padding: 8, borderRadius: 4} 
                    : {borderColor: '#6200ee', borderWidth: 1, padding: 8, borderRadius: 4};
                  const textStyle = mode === 'contained' 
                    ? {color: '#fff', textAlign: 'center'} 
                    : {color: '#6200ee', textAlign: 'center'};
                  return React.createElement(
                    TouchableOpacity, 
                    {style: [buttonStyle, style], onPress, ...props},
                    React.createElement(Text, {style: textStyle}, children)
                  );
                },
                Appbar: {
                  Header: ({children, style, ...props}) => 
                    React.createElement(View, {
                      style: [{backgroundColor: '#6200ee', height: 56, flexDirection: 'row', alignItems: 'center', elevation: 4}, style],
                      ...props
                    }, children),
                  Content: ({title, style, ...props}) => 
                    React.createElement(View, {
                      style: [{flex: 1, marginLeft: 8}, style],
                      ...props
                    }, React.createElement(Text, {style: {color: '#fff', fontSize: 18}}, title))
                },
                Card: {
                  Title: ({title, subtitle, style, ...props}) => 
                    React.createElement(View, {style: [style, {padding: 16}], ...props}, [
                      React.createElement(Text, {key: 'title', style: {fontSize: 16, fontWeight: 'bold'}}, title),
                      subtitle && React.createElement(Text, {key: 'subtitle', style: {fontSize: 14, opacity: 0.7}}, subtitle)
                    ])
                }
              };
              
              // Insert mock for PaperProvider if we detect its usage
              if (${code.includes('PaperProvider')}) {
                window.PaperProvider = window.ReactNativePaper.Provider;
              }

              // Fix for Alert
              window.Alert = {
                alert: (title, message) => {
                  window.alert(title + (message ? "\\n" + message : ""));
                }
              };

              // Helper functions to simulate React Native behavior
              window.AppRegistry = {
                registerComponent: (appKey, componentProvider) => {
                  window.AppComponent = componentProvider();
                  return { appKey };
                },
                runApplication: (appKey, appParameters) => {
                  // Will be called by the script to render
                }
              };

              // Console log override to capture errors
              const originalConsoleError = console.error;
              console.error = function() {
                document.getElementById('error-log').style.display = 'block';
                document.getElementById('error-log').innerText += Array.from(arguments).join(' ') + '\\n';
                originalConsoleError.apply(console, arguments);
              };
            </script>
          </head>
          <body>
            <div id="root"></div>
            <div id="error-log" class="error" style="display: none;"></div>
            <script>
              try {
                // Execute transpiled code
                ${transpiled}
                
                // Render App component or use AppRegistry
                if (typeof App !== 'undefined') {
                  ReactDOM.render(React.createElement(App), document.getElementById('root'));
                } else if (window.AppComponent) {
                  ReactDOM.render(React.createElement(window.AppComponent), document.getElementById('root'));
                } else {
                  throw new Error('No App component or AppRegistry found');
                }
              } catch (e) {
                console.error(e);
                document.getElementById('error-log').style.display = 'block';
                document.getElementById('error-log').innerText = 'Error: ' + e.message;
              }
            </script>
          </body>
        </html>
      `;

      // Set the iframe content
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.srcdoc = html;
        setError(null);
      }
    } catch (e) {
      console.error("Preview error:", e);
      setError(e instanceof Error ? e.message : 'Unknown error');
      
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.srcdoc = `
          <html>
            <head>
              <style>
                body { 
                  background: #1a1a1a; 
                  color: #ff5555; 
                  font-family: monospace; 
                  padding: 20px;
                  font-size: 14px;
                  line-height: 1.5;
                }
                .error {
                  background: rgba(255, 0, 0, 0.1);
                  border: 1px solid rgba(255, 0, 0, 0.2);
                  border-radius: 4px;
                  padding: 10px;
                  white-space: pre-wrap;
                  overflow-wrap: break-word;
                }
              </style>
            </head>
            <body>
              <h3>Preview Error</h3>
              <div class="error">${e instanceof Error ? e.message : 'Unknown error'}</div>
 <p>Check your code for syntax or runtime issues. React Native Web emulation might not support every feature.</p>
            </body>
          </html>
        `;
      }
    }
  }, [code]);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 shadow-inner">
      {error && (
        <div className="text-red-500 text-sm mb-2 font-mono p-2 bg-red-900 bg-opacity-10 rounded">
          Preview Error: {error}
        </div>
      )}
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-[500px] bg-black rounded"
      />
    </div>
  );
}