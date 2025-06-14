
import React from 'react';
import { Heart, Github, Star, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background/50 backdrop-blur">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">AI Scanner</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Experience the future of product discovery with our AI-powered barcode scanner. 
              Get instant insights, nutritional analysis, and smart recommendations.
            </p>
          </div>

          {/* Features Section */}
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold text-lg">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>AI-Powered Analysis</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Nutritional Information</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Smart Recommendations</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Real-time Scanning</span>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold text-lg">Connect</h3>
            <div className="flex space-x-4">
              <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors hover-scale">
                <Github className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors hover-scale">
                <Star className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Built with modern web technologies for the best user experience.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 AI Barcode Scanner. Made with{' '}
              <Heart className="inline h-4 w-4 text-red-500 animate-pulse" />{' '}
              using React & AI
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Privacy</button>
              <button className="hover:text-foreground transition-colors">Terms</button>
              <button className="hover:text-foreground transition-colors">Support</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
