"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, arbitrum, omax } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import {
  cookieStorage,
  cookieToInitialState,
  createStorage,
  WagmiProvider,
  type Config,
} from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// Set up queryClient
const queryClient = new QueryClient();

const omaxTestnet = {
  id: 332, // Replace with your testnet's chain ID
  caipNetworkId: "eip155:332", // Replace with your testnet's CAIP network ID
  chainNamespace: "eip155", // Replace with your testnet's chain namespace
  name: "Omax Testnet",
  nativeCurrency: {
    name: "OMAX",
    symbol: "OMAX",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testapi.omaxray.com"], // Replace with your testnet's RPC URL
      webSocket: ["wss://ws.testapi.omaxray.com"], // Replace with your testnet's WebSocket URL (optional)
    },
  },
  blockExplorers: {
    default: { name: "Omax Explorer", url: "https://explorer.omaxray.com" }, // Replace with your testnet's explorer URL
  },
  contracts: {},
};

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

export const networks = [mainnet, arbitrum, omax, omaxTestnet];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

if (!projectId) {
  throw new Error("Project ID is not defined");
}

console.log("projectId", projectId);
console.log("wagmiAdapter", wagmiAdapter);

// Set up metadata
const metadata = {
  name: "appkit-example",
  description: "AppKit Example",
  url: "https://appkitexampleapp.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, omax, omaxTestnet],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
