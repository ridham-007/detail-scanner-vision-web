import React, { useEffect, useRef } from "react";
import {
  Heart,
  Brain,
  Zap,
  Award,
  Users,
  Mail,
  Shield,
  HelpCircle,
  FileText,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(footerRef.current?.querySelectorAll(".footer-section"), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
      },
    });
  }, []);

  const handleContactClick = () => {
    window.location.href = "mailto:hello@eateriq.com";
  };

  return (
    <footer ref={footerRef} className="border-t border-primary/20 bg-gradient-to-br from-muted/20 via-primary/5 to-muted/20 backdrop-blur">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="footer-section space-y-4">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-sm hover:from-primary/30 hover:to-accent/30 transition-all duration-300">
                  <span className="text-2xl filter drop-shadow-sm">🥑</span>
                </div>
              </Link>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">EaterIQ</h3>
                <p className="text-sm text-muted-foreground">Smart Food Intelligence</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Experience the future of food intelligence with EaterIQ's
              AI-powered barcode scanner. Make smarter eating choices with
              instant health scores and personalized recommendations.
            </p>
          </div>

          {/* Features Section */}
          <div className="footer-section space-y-4">
            <h3 className="font-semibold text-base md:text-lg">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Award className="h-4 w-4 text-primary" />
                <span>Health Score Analysis</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Brain className="h-4 w-4 text-accent" />
                <span>AI-Powered Insights</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Zap className="h-4 w-4 text-secondary" />
                <span>Smart Recommendations</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Users className="h-4 w-4 text-primary/80" />
                <span>Real-time Scanning</span>
              </li>
            </ul>
          </div>

          {/* Support & Resources Section */}
          <div className="footer-section space-y-4">
            <h3 className="font-semibold text-base md:text-lg">
              Support & Resources
            </h3>
            <div className="space-y-3">
              <button
                aria-label="Contact Support"
                onClick={handleContactClick}
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Mail className="h-4 w-4 text-primary group-hover:text-primary/80" />
                <span>Contact Support</span>
              </button>
              <Link
                to="/support"
                aria-label="Help Center"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <HelpCircle className="h-4 w-4 text-accent group-hover:text-accent/80" />
                <span>Help Center</span>
              </Link>
              <Link
                to="/privacy"
                aria-label="Privacy Policy"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Shield className="h-4 w-4 text-secondary group-hover:text-secondary/80" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                to="/terms"
                aria-label="Terms of Service"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <FileText className="h-4 w-4 text-primary/70 group-hover:text-primary" />
                <span>Terms of Service</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2025 EaterIQ. Made with{" "}
              <Heart className="inline h-4 w-4 text-red-500 animate-pulse" />{" "}
              for smarter eating
            </p>
            <div className="flex space-x-4 md:space-x-6 text-sm text-muted-foreground">
              <Link
                to="/privacy"
                aria-label="Privacy"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to={"/terms"}
                aria-label="Terms"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                to={"/support"}
                aria-label="Support"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-foreground transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
