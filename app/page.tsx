"use client";

import { useEffect } from "react";
import { Home } from "./components/DemoComponents";
import { WalletIntegrationDemo } from "./components/WalletIntegrationDemo";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { Wallet } from 'lucide-react'

export default function App() {
  const { address, isConnected } = useAccount()

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
        <div className="flex justify-between items-center mb-3">
          <Link 
            href="/wallet" 
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
          >
            <Wallet className="h-4 w-4" />
            Wallet
          </Link>
          {isConnected ? (
            <div className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          ) : (
            <div className="px-4 py-2 bg-gray-600 rounded-lg text-white font-medium">
              Wallet Not Connected
            </div>
          )}
        </div>
        <main className="flex-1 space-y-6">
          <Home />
          
          {/* WalletConnect Integration Demo */}
          <div className="mt-8">
            <WalletIntegrationDemo />
          </div>
        </main>
        
        <footer className="mt-5 sm:mt-6 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm">
            <span className="text-sm text-gray-300 font-medium">Built on Base • WalletConnect Enabled</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
