"use client";

import { type ReactNode } from "react";
import { WagmiProvider, cookieToInitialState, type Config } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { config, networks, projectId, wagmiAdapter } from "@/config";
import { base, baseSepolia } from "@reown/appkit/networks";

// Initialize AppKit once when projectId is present
if (projectId) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork: networks[0],
    metadata: {
      name: "Buy Me A Coffee",
      description: "Support creators with crypto donations",
      url: "https://buymeacoffee.com",
      icons: ["https://buymeacoffee.com/icon.png"],
    },
    features: {
      analytics: true,
      email: false,
      socials: [],
      emailShowWallets: false,
    },
  });
}

const queryClient = new QueryClient();

export function Providers({ children, cookies }: { children: ReactNode; cookies?: string | null }) {
  const initialState = cookieToInitialState(config as Config, cookies ?? null);

  const isTestnet = (process.env.NEXT_PUBLIC_BASEPAY_TESTNET || "false") === "true";

  return (
    <WagmiProvider config={config as Config} initialState={initialState}>
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
          {children}
        </MiniKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
