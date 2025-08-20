import React, { useEffect, useRef } from "react";
import { Scan, Sparkles, Brain, History } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";

const Header = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(
        titleRef.current,
        {
          x: -50,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      )
      .from(
        subtitleRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      );
  }, []);

  const navigationItems = [
    { path: "/", label: "Scanner" },
    { path: "/quizzes", label: "Food IQ Tests" },
    { path: "/blog", label: "Blogs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-gradient-to-r from-background/95 via-primary/5 to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center hover:from-primary/20 hover:to-accent/20 transition-all duration-300 shadow-md">
                <span className="text-4xl filter drop-shadow-sm">🥑</span>
              </div>
            </Link>
            <Link to={'/'} className="cursor-pointer group">
              <h2
                ref={titleRef}
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-accent/80 transition-all duration-300"
              >
                EaterIQ
              </h2>
              <p
                ref={subtitleRef}
                className="text-xs md:text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-300"
              >
                Smart Food Intelligence & Brain Bites
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => (
                <Link
                  to={item.path}
                  aria-label={item.label}
                  key={item.path}
                  className={`font-medium transition-all duration-300 relative group ${
                    location.pathname === item.path
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 ${
                    location.pathname === item.path 
                      ? "w-full" 
                      : "w-0 group-hover:w-full"
                  }`}></span>
                </Link>
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
