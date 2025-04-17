// SnackPreview.tsx
import React, { useEffect, useState } from "react";
import { Snack, createRuntimeUrl } from "snack-sdk";

export default function SnackPreview({
  aiOutput,
  dependencies,
}: {
  aiOutput: any;
  dependencies: any;
}) {
  const [snackUrl, setSnackUrl] = useState("");
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
        function transformDependencies(deps) {
          const transformed = {};
          for (const [pkg, version] of Object.entries(deps)) {
            transformed[pkg] = { version };
          }
          return { dependencies: transformed };
        }
        
        const cleanedDeps = transformDependencies(dependencies);        
        const snack = new Snack({
          name: "AI Generated Preview",
          description: "Preview from AI-generated code",
          files: snackFiles,
          sdkVersion: "52.0.0",
           dependencies : transformDependencies(dependencies).dependencies,
            // apiURL: "https://snack.expo.dev/api/v2",
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
      } catch (error) {
        console.error("Error generating Snack preview:", error);
      }
    };

    if (aiOutput) {
      generateSnack();
    }
  }, [aiOutput]);

  return snackUrl ? (
    <iframe
      src={snackUrl}
      style={{
        width: "100%",
        height: "600px",
        border: "none",
        borderRadius: 8,
      }}
    />
  ) : (
    <p>Generating preview...</p>
  );
}
