import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Sparkles, Heart, Trophy } from 'lucide-react';

const AppShell = ({ children, title = "Resilience Rituals" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-white/15 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-60 left-1/4 w-3 h-3 bg-white/25 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-80 right-1/3 w-5 h-5 bg-white/10 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
              <p className="text-white/80 text-sm">Build unbreakable emotional resilience</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;