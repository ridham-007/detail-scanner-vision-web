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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center hover:bg-primary/10 transition-colors">
                <span className="text-3xl">🥑</span>
              </div>
            </Link>
            <Link to={'/'} className="cursor-pointer">
              <h2
                ref={titleRef}
                className="text-2xl md:text-3xl font-bold text-foreground"
              >
                EaterIQ
              </h2>
              <p
                ref={subtitleRef}
                className="text-xs md:text-sm text-muted-foreground"
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
                  className={` font-medium transition-colors hover:text-foreground ${
                    location.pathname === item.path
                      ? "text-foreground font-bold underline underline-offset-4"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
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
