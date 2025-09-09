"use client";

import { useEffect } from "react";
import { Home } from "./components/DemoComponents";
import { sdk } from "@farcaster/miniapp-sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const hasProjectId = Boolean(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);

export default function App() {
  useEffect(() => {
    // Initialize the MiniApp SDK and signal that the app is ready
    const initializeSdk = async () => {
      try {
        // Signal that the app is ready and the splash screen can be hidden
        await sdk.actions.ready();
        console.log("MiniApp SDK initialized successfully");
      } catch (error) {
        console.error("Failed to initialize MiniApp SDK:", error);
      }
    };

    initializeSdk();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans text-white" style={{ backgroundColor: "#0a0b2b" }}>
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <div className="flex justify-end mb-3">
          {hasProjectId ? (
            <ConnectButton showBalance={false} chainStatus="icon" />
          ) : null}
        </div>
        <main className="flex-1">
          <Home />
        </main>
        <footer className="mt-5 sm:mt-6 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm">
            <span className="text-sm text-gray-300 font-medium">Built on Base</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
