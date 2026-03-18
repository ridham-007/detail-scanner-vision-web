"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";
import NotificationBell from "./NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, FileText, Package, Bell, BookOpen, ScanLine, Sparkles } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const { data: isAdmin } = useIsAdmin();

  const navigationItems = [
    { path: "/scanner", label: "Scanner" },
    { path: "/quiz", label: "Quiz" },
    { path: "/blog", label: "Blogs" },
    { path: "/pricing", label: "Pricing" },
  ];

  return (
    <header 
      role="banner"
      className="sticky top-0 z-50 w-full bg-transparent"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between rounded-[28px] border border-white/60 px-4 py-3 shadow-product bg-white">
          <div className="flex items-center space-x-3">
            <Link href="/" aria-label="EaterIQ Home">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600 text-white shadow-[var(--shadow-warm)] transition-transform duration-300 hover:scale-105">
                <ScanLine className="h-5 w-5" />
              </div>
            </Link>
            <Link href={'/'} className="cursor-pointer group" aria-label="EaterIQ - Smart Food Intelligence">
              <h2
                className="text-2xl font-extrabold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary md:text-3xl"
              >
                EaterIQ
              </h2>
              <p
                className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground/70 md:text-sm"
              >
                Bright scans, smarter food choices
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
              {navigationItems.map((item) => (
                <Link
                  href={item.path}
                  aria-label={item.label}
                  aria-current={pathname === item.path ? "page" : undefined}
                  key={item.path}
                  className={`font-medium transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm ${
                    pathname === item.path
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                    pathname === item.path 
                      ? "w-full" 
                      : "w-0 group-hover:w-full"
                  }`}></span>
                </Link>
              ))}

              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 rounded-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  Resources
                  <Sparkles className="h-3.5 w-3.5 text-primary/70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 rounded-2xl border-border/80 bg-white/95 shadow-product">
                  <DropdownMenuItem asChild>
                    <Link href="/user-guide" className="flex items-center gap-2 cursor-pointer">
                      <BookOpen className="h-4 w-4" />
                      User Guide
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dietary-guides" className="flex items-center gap-2 cursor-pointer">
                      <FileText className="h-4 w-4" />
                      Dietary Sheets
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/support" className="flex items-center gap-2 cursor-pointer">
                      <Shield className="h-4 w-4" />
                      Support Center
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin Dropdown */}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 rounded-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl border-border/80 bg-white/95 shadow-product">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/blogs" className="flex items-center gap-2 cursor-pointer">
                        <FileText className="h-4 w-4" />
                        Blog Management
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/submissions" className="flex items-center gap-2 cursor-pointer">
                        <Package className="h-4 w-4" />
                        Product Submissions
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/notifications" className="flex items-center gap-2 cursor-pointer">
                        <Bell className="h-4 w-4" />
                        Notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <NotificationBell />
              <AuthButton />
              {/* <ThemeToggle /> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
