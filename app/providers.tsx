"use client";

import { type ReactNode } from "react";
import { http, WagmiProvider, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;
const isTestnet = (process.env.NEXT_PUBLIC_BASEPAY_TESTNET || "false") === "true";

// Only create AppKit if projectId exists
let wagmiAdapter: WagmiAdapter | null = null;

if (projectId) {
  wagmiAdapter = new WagmiAdapter({
    ssr: true,
    projectId,
    networks: isTestnet ? [baseSepolia] : [base]
  });

  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: isTestnet ? [baseSepolia] : [base],
    defaultNetwork: isTestnet ? baseSepolia : base,
    metadata: {
      name: "Buy Me A Coffee",
      description: "Support creators with crypto donations",
      url: "https://buymeacoffee.com",
      icons: ["https://buymeacoffee.com/icon.png"]
    },
    features: {
      analytics: true,
    }
  });
}

const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  const config = wagmiAdapter?.wagmiConfig || createConfig({
    chains: isTestnet ? [baseSepolia] : [base],
    connectors: [
      injected(),
      ...(projectId ? [walletConnect({ projectId })] : [])
    ],
    transports: {
      [base.id]: http("https://mainnet.base.org"),
      [baseSepolia.id]: http("https://sepolia.base.org"),
    },
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={isTestnet ? baseSepolia : base}
          config={{
            appearance: {
              mode: "auto",
              theme: "mini-app-theme",
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
              logo: process.env.NEXT_PUBLIC_ICON_URL,
            },
          }}
        >
          {props.children}
        </MiniKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
