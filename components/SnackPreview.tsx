// SnackPreview.tsx
import React, { useEffect, useState } from "react";
import { Snack } from "snack-sdk";

export default function SnackPreview({
  aiOutput,
  dependencies,
}: {
  aiOutput: any;
  dependencies: any;
}) {
  const [snackUrl, setSnackUrl] = useState("");
  console.log("dependencies2", dependencies); // Debugging line to check the dependencies
  // console.log("AI Output:", aiOutput); // Debugging line to check the AI output
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
        function cleanDependencies(
          deps: Record<string, any>
        ): Record<string, string> {
          const fixed: Record<string, string> = {};

          for (const [pkg, version] of Object.entries(deps)) {
            if (typeof version === "string") {
              fixed[pkg] = version;
            } else if (typeof version === "object") {
              // Rebuild version string from indexed object like { 0: '^', 1: '6', 2: '.', ... }
              fixed[pkg] = Object.keys(version)
                .filter((k) => !isNaN(Number(k)))
                .sort((a, b) => Number(a) - Number(b))
                .map((k) => version[k])
                .join("")
                .trim();
            } else {
              fixed[pkg] = String(version);
            }
          }

          return fixed;
        }
        const cleanedDeps = cleanDependencies(dependencies);
        console.log("Cleaned Dependencies", cleanedDeps);
        
        const snack = new Snack({
          name: "AI Generated Preview",
          description: "Preview from AI-generated code",
          files: snackFiles,
          sdkVersion: "52.0.0",
          //@ts-ignore
          dependencies:cleanedDeps, // Use the cleaned dependencies
        });
        snack.setOnline(true);
        // snack.setUser({ sessionSecret: "sessionSecret" }); // Set user info if needed

        const { url } = await snack.getStateAsync();
        setSnackUrl(url);
        console.log("Snack State Dependendies", snack.getState()); // Debugging line to check the generated Snack URL
        console.log("Snack URL:", url); // Debugging line to check the generated Snack URL
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
