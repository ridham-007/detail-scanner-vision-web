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
    { path: "/pricing", label: "Pricing" },
  ];

  return (
    <header 
      role="banner"
      className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" aria-label="EaterIQ Home">
              <div className="h-20 w-20 rounded-2xl flex items-center justify-center transition-all duration-300">
                <span className="text-4xl filter" role="img" aria-label="Avocado logo">🥑</span>
              </div>
            </Link>
            <Link to={'/'} className="cursor-pointer group" aria-label="EaterIQ - Smart Food Intelligence">
              <h2
                ref={titleRef}
                className="text-2xl md:text-3xl font-bold text-primary group-hover:text-primary/80 transition-all duration-300"
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
            <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
              {navigationItems.map((item) => (
                <Link
                  to={item.path}
                  aria-label={item.label}
                  aria-current={location.pathname === item.path ? "page" : undefined}
                  key={item.path}
                  className={`font-medium transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm ${
                    location.pathname === item.path
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
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
