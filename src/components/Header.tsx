
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scan, Trophy, BookOpen } from 'lucide-react';
import AuthButton from './AuthButton';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EQ</span>
              </div>
              <span className="hidden font-bold sm:inline-block">EaterIQ</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-foreground/80 flex items-center space-x-2 ${
                isActive('/') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              <Scan className="h-4 w-4" />
              <span>Scanner</span>
            </Link>
            <Link
              to="/quizzes"
              className={`transition-colors hover:text-foreground/80 flex items-center space-x-2 ${
                isActive('/quizzes') || isActive('/quiz') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Food IQ Tests</span>
            </Link>
            <Link
              to="/blog"
              className={`transition-colors hover:text-foreground/80 flex items-center space-x-2 ${
                isActive('/blog') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
