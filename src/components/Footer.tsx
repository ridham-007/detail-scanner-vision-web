import { Mail, Smartphone, BookOpen, Shield, HelpCircle, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { to: "/scanner", label: "Food Scanner", icon: Smartphone },
    { to: "/categories", label: "Browse Categories", icon: BookOpen },
    { to: "/quiz", label: "Health Quizzes", icon: FileText },
  ];

  const supportLinks = [
    { to: "/about", label: "About Us", icon: Users },
    { to: "/support", label: "Help Center", icon: HelpCircle },
    { to: "/contributions", label: "Contribute Data", icon: BookOpen },
    { to: "/blog", label: "Health Blog", icon: FileText },
  ];

  const legalLinks = [
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Service" },
  ];

  return (
    <footer 
      role="contentinfo" 
      aria-label="Site footer"
      itemScope 
      itemType="https://schema.org/WPFooter"
      className="border-t border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link 
              to="/" 
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
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
              Product
            </h3>
            <ul className="space-y-3">
              {productLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link 
                    to={to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-label="Support navigation">
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
              Resources
            </h3>
            <ul className="space-y-3">
              {supportLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link 
                    to={to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Section */}
          <address className="not-italic">
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:hello@eateriq.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  itemProp="email"
                >
                  <Mail className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  hello@eateriq.com
                </a>
              </li>
            </ul>
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
                {legalLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link 
                      to={to}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
