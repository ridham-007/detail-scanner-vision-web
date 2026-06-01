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
import {
  Shield,
  FileText,
  Package,
  Bell,
  BookOpen,
  ScanLine,
  Sparkles,
  Heart,
  Calculator,
} from "lucide-react";
import LogoIcon from "./LogoIcon";
const Header = () => {
  const pathname = usePathname();
  const { data: isAdmin } = useIsAdmin();

  const navigationItems = [
    { path: "/food-scanner", label: "Scanner" },
    { path: "/quiz", label: "Quiz" },
    { path: "/blog", label: "Blogs" },
    { path: "/pricing", label: "Pricing" },
  ];

  return (
    <header
      role="banner"
      className="sticky top-0 left-0 z-[9999] w-full bg-white/95 backdrop-blur-md border-b border-border/40"
      style={{ marginTop: "env(safe-area-inset-top)" }}
    >
      <div className="container mx-auto px-2 py-2 md:py-3">
        <div className="flex items-center justify-between rounded-[28px] border border-white/60 px-4 py-3 shadow-product bg-white/95 backdrop-blur-md">
          <Link
            href="/"
            aria-label="EaterIQ Home"
            className="flex items-center space-x-3 transition-transform duration-300 hover:scale-105 group"
          >
            <LogoIcon className="h-12 w-12" />
            <div className="flex flex-col">
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-none">
                Eater
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  IQ
                </span>
              </p>
              <span className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground/70 md:text-sm">
                Bright scans, smarter food choices
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 min-w-0">
            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-6"
              role="navigation"
              aria-label="Main navigation"
            >
              {navigationItems.map((item) => (
                <Link
                  href={item.path}
                  aria-label={item.label}
                  aria-current={pathname === item.path ? "page" : undefined}
                  key={item.path}
                  className={`font-medium transition-all duration-300 relative group outline-none focus:outline-none focus-visible:outline-none rounded-none ${
                    pathname === item.path
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                      pathname === item.path
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              ))}

              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 font-medium text-muted-foreground transition-all duration-300 hover:text-foreground outline-none focus:outline-none focus-visible:outline-none">
                  Resources
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={10}
                  className="z-[99999] w-52 rounded-2xl border border-border/80 bg-white shadow-2xl"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/user-guide"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="h-4 w-4" />
                      User Guide
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dietary-guides"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="h-4 w-4" />
                      Dietary Sheets
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/support"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="h-4 w-4" />
                      Support Center
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/calculator"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Calculator className="h-4 w-4" />
                      Health Calculators
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin Dropdown */}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 whitespace-nowrap font-medium text-muted-foreground transition-all duration-300 hover:text-foreground outline-none focus:outline-none focus-visible:outline-none">
                    <Shield className="h-4 w-4" />
                    Admin
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    sideOffset={12}
                    collisionPadding={20}
                    className="
    z-[99999]
    w-64
    rounded-2xl
    border
    border-border/80
    bg-white/95
    p-2
    shadow-2xl
    backdrop-blur-md
  "
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/blogs"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="h-4 w-4" />
                        Blog Management
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/submissions"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Package className="h-4 w-4" />
                        Product Submissions
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/notifications"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Bell className="h-4 w-4" />
                        Notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            <div className="flex items-center gap-2 md:gap-4 shrink-0 min-w-[44px] md:min-w-[172px]">
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
