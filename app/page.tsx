"use client";

import { Home } from "./components/DemoComponents";

export default function App() {

  return (
    <div className="flex flex-col min-h-screen font-sans text-white" style={{ backgroundColor: "#0a0b2b" }}>
      <div className="w-full max-w-md mx-auto px-4 py-3">
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
