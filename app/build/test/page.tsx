"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Snack } from 'snack-sdk';

// 1. Install: yarn add snack-sdk
// 2. Create your Snack instance
export default function LiveSnackPreview() {
  const webPreviewRef = useRef<Window | null>(null);
  const [snack] = useState(() =>
    new Snack({
      files: {
        'App.js': {
          type: 'CODE',
          contents: `
            import React from 'react';
            import { View, Text } from 'react-native';
            export default () => (
              <View style={{flex:1,justifyContent:'center'}}>
                <Text>Hello from Snack!</Text>
              </View>
            );
          `,
        },
      },
      dependencies: { expo: { version: '^52.0.0' } },
      sdkVersion: '52.0.0',
      webPreviewRef,            // <-- enable web preview
      online: true,             // <-- advertises to clients
    })
  );

  // 3. React to URL changes
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const update = () => {
      const state = snack.getState();
      setUrl(state.webPreviewURL || null);
      console.log('Snack URL:', url); // Debugging line
    };
    snack.addStateListener(update);
    update(); // initial
    return () => snack.setOnline(false);
  }, [snack]);
  console.log('Snack URL:', snack.getPreviewAsync()); // Debugging line
  console.log('Snack URL:', url); // Debugging line
  return url ? (
    <iframe
      title="Snack Preview"
      ref={(el) => {
        if (el) webPreviewRef.current = el.contentWindow;
      }}
      src={url}
      allow="geolocation; camera; microphone"
      style={{ width: '100%', height: '600px', border: 'none' }}
    />
  ) : (
    <p>Loading preview…</p>
  );
}
