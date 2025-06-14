
import React from 'react';
import { Scan, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg hover-scale">
              <Scan className="h-6 w-6 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Barcode Scanner
              </h1>
              <p className="text-sm text-muted-foreground">Powered by AI Intelligence</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
