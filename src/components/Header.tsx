
import React, { useEffect, useRef } from 'react';
import { Scan, Sparkles, Brain } from 'lucide-react';
import { gsap } from 'gsap';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(logoRef.current, {
      scale: 0,
      rotation: 180,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .from(titleRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .from(subtitleRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.2");

    // Continuous sparkle animation
    gsap.to(logoRef.current?.querySelector('.sparkle'), {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: "none"
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              ref={logoRef}
              className="relative p-3 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              <Brain className="h-6 w-6 text-white" />
              <Sparkles className="sparkle absolute -top-1 -right-1 h-4 w-4 text-yellow-400" />
            </div>
            <div>
              <h1 
                ref={titleRef}
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                EaterIQ
              </h1>
              <p 
                ref={subtitleRef}
                className="text-xs md:text-sm text-muted-foreground"
              >
                Smart Food Intelligence
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
