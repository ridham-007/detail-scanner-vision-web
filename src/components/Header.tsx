
import React, { useEffect, useRef } from 'react';
import { Scan, Sparkles, Brain } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import AuthButton from './AuthButton';
import Logo from '../assets/download.svg';

const Header = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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

  const navigationItems = [
    { path: '/', label: 'Scanner' },
    { path: '/quizzes', label: 'Food IQ Tests' },
    { path: '/blog', label: 'Blogs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => navigate('/')}
            >
              <img src={Logo} alt="eateriq logo" className='h-16 w-16' />
            </div>
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <h2
                ref={titleRef}
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                EaterIQ
              </h2>
              <p 
                ref={subtitleRef}
                className="text-xs md:text-sm text-muted-foreground"
              >
                Smart Food Intelligence & Brain Bites
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => (
                <button
                  aria-label={item.label}
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={` font-medium transition-colors hover:text-primary ${
                    location.pathname === item.path ? 'text-primary font-bold underline underline-offset-4' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            
            <div className="flex items-center gap-4">
              <AuthButton />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
