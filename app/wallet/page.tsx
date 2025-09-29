"use client";

import { WalletKitManager } from "@/app/components/WalletKitManager";
import { Toaster } from "@/app/components/ui/toaster";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-[#0a0b2b]">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Buy Me A Coffee Wallet
          </h1>
          <p className="text-lg text-[#c8c8d1] max-w-2xl mx-auto">
            Connect your wallet to dApps using WalletConnect. Manage your Web3 connections securely.
          </p>
        </div>
        
        <WalletKitManager />
        <Toaster />
      </div>
    </div>
  );
}