"use client";

// components/Footer.tsx
import { Mail, Smartphone, BookOpen, Shield, HelpCircle, FileText, Facebook, Twitter, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = "hello@eateriq.com";
    navigator.clipboard.writeText(email).then(() => {
      toast({
        title: "Email Copied",
        description: "Email address copied to clipboard!",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy email.",
        variant: "destructive",
      });
    });
  };


  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      itemScope
      itemType="https://schema.org/WPFooter"
      className="border-t border-border bg-card/50 backdrop-blur-sm mt-8"
    >
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-4 group"
              aria-label="EaterIQ - Go to homepage"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                <span className="text-xl" role="img" aria-label="Avocado">🥑</span>
              </div>
              <span className="text-xl font-bold text-foreground">EaterIQ</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-4">
              Scan, understand, and make healthier food choices. Your personal nutrition companion.
            </p>

            {/* App Store Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://apps.apple.com/sg/app/eateriq/id6757137222"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                  alt="Download on the App Store"
                  className="h-[32px]"
                  loading="lazy"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.eateriq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-[48px] -my-[8px]"
                  loading="lazy"
                />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <nav aria-label="Product navigation">
            <span className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
              Product
            </span>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/scanner/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <Smartphone className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" aria-hidden="true" />
                  Food Scanner
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" aria-hidden="true" />
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <FileText className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" aria-hidden="true" />
                  Health Quizzes
                </Link>
              </li>
              <li>
                <Link
                  href="/compare/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <TrendingUp className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" aria-hidden="true" />
                  Food Battle
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-label="Support navigation">
            <span className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
              Resources
            </span>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/support/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" aria-hidden="true" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contributions/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" aria-hidden="true" />
                  Contribute Data
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <FileText className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" aria-hidden="true" />
                  Health Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/dietary-guides/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <FileText className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" aria-hidden="true" />
                  Dietary Cheat Sheets
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact Section */}
          <address className="not-italic">


            <span className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
              Contact
            </span>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@eateriq.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  itemProp="email"
                >
                  <Mail className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" aria-hidden="true" />
                  hello@eateriq.com
                </a>
              </li>
              <li>
                <Link
                  href="/about/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <Shield className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" aria-hidden="true" />
                  About Us
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <span className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                Social
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61587144212003"
                  className="bg-primary/10 p-2 rounded-full text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://x.com/Eaateriq"
                  className="bg-primary/10 p-2 rounded-full text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="mailto:hello@eateriq.com"
                  onClick={handleCopyEmail}
                  className="bg-primary/10 p-2 rounded-full text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                  aria-label="Copy Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </address>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground order-2 sm:order-1">
              © {currentYear} EaterIQ. All rights reserved.
            </p>

            <nav aria-label="Legal navigation" className="order-1 sm:order-2">
              <ul className="flex items-center gap-6">
                <li>
                  <Link
                    href="/privacy/"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms/"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}