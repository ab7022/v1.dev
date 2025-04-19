// SnackPreview.tsx
import React, { useEffect, useRef, useState } from "react";
import { Snack, createRuntimeUrl } from "snack-sdk";

export default function SnackPreview({
  aiOutput,
  dependencies,
}: {
  aiOutput: any;
  dependencies: any;
}) {
  const [snackUrl, setSnackUrl] = useState("");
  const webPreviewRef = useRef<Window | null>(null);

  useEffect(() => {
    const generateSnack = async () => {
      try {
        const snackFiles = Object.entries(aiOutput).reduce(
          (acc, [filename, fileData]) => {
            const parsed =
              typeof fileData === "string" ? JSON.parse(fileData) : fileData;

            acc[filename] = {
              type: "CODE",
              contents: parsed.contents, // use only the inner contents
            };

            return acc;
          },
          {}
        );
    
        
        const snack = new Snack({
          name: "AI Generated Preview",
          description: "Preview from AI-generated code",
          files: snackFiles,
          sdkVersion: "52.0.0",
           dependencies : transformDependencies(dependencies).dependencies,
           webPreviewRef,      // ← Tells Snack to set up the web preview transport
      online: true,
            // apiURL: "https://snack.expo.dev/api/v2",
        });
        const unsubscribe = snack.addStateListener((state) => {
          if (state.webPreviewURL) {
            setSnackUrl(state.webPreviewURL);
          }
        });
    
      
        // const snack = new Snack({
        //   name: "AI Generated Preview",
        //   description: "Preview from AI-generated code",
        //   sdkVersion: "52.0.0",
        //   dependencies: {
        //     'expo-linear-gradient': {
        //       version: '14.0.2'
        //     },
           

        //   },

        //   // dependencies: dependencies,
        //   files: {
        //     'App.js': {
        //       type: 'CODE',
        //       contents: `
        // import * as React from 'react';
        // import { LinearGradient } from 'expo-linear-gradient';
        
        // export default () => (
        //   <LinearGradient style={{flex: 1}} colors={['red', 'white', 'blue']} />
        // );
        // `
        //     }
        //   }
        // });
        console.log("Snack Object", snack); 
        snack.setDeviceId("web"); 
        snack.setUser({sessionSecret:"Secret"})
        snack.setOnline(true);      
        const { url } = await snack.getStateAsync();
        setSnackUrl(url);
        console.log("Snack URL:", url); 
        console.log("Snack URL2:", snackUrl); // Debugging line
        return () => {
          unsubscribe.remove();
          snack.setOnline(false);
        };
      } catch (error) {
        console.error("Error generating Snack preview:", error);
      }
    };

    if (aiOutput) {
      generateSnack();
    }
  }, [aiOutput,dependencies]);

  return snackUrl ? (
    console.log("Snack URL:", snackUrl), // Debugging line
    <iframe className="w-full h-full rounded-lg" 
    ref={(el) => {
      // Wire the iframe’s window into webPreviewRef
      if (el) webPreviewRef.current = el.contentWindow;
    }}
    src={snackUrl}
    style={{ width: "100%", height: "1000px", border: "none", borderRadius: 8,zIndex: 70, }}
    allow="geolocation; camera; microphone"
  />
  
  ) : (
    <p >Generating preview...</p>
  );
}


function transformDependencies(deps) {
  const transformed = {};
  for (const [pkg, version] of Object.entries(deps)) {
    transformed[pkg] = { version };
  }
  return { dependencies: transformed };
}