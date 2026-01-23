import { Heart, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer role="contentinfo" aria-label="Site footer" className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-lg">🥑</span>
              </div>
              <span className="font-semibold text-primary">EaterIQ</span>
            </Link>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/support" className="hover:text-foreground transition-colors">
              Help Center
            </Link>
            <a 
              href="mailto:hello@eateriq.com" 
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © 2025 EaterIQ
            <Heart className="h-3.5 w-3.5 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
