"use client";

import { type ReactNode } from "react";
import { http, createConfig, WagmiProvider } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;
const isTestnet = (process.env.NEXT_PUBLIC_BASEPAY_TESTNET || "false") === "true";

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Mini App",
    projectId: projectId || "",
    chains: isTestnet ? [baseSepolia] : [base],
    transports: {
      [base.id]: http("https://mainnet.base.org"),
      [baseSepolia.id]: http("https://sepolia.base.org"),
    },
    ssr: true,
  })
);

const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
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
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
