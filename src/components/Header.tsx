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
import { Shield, FileText, Package, Bell } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const { data: isAdmin } = useIsAdmin();

  const navigationItems = [
    { path: "/", label: "Scanner" },
    { path: "/quiz", label: "Quiz" },
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
            <Link href="/" aria-label="EaterIQ Home">
              <div className="h-10 w-10 sm:h-20 sm:w-20 rounded-2xl flex items-center justify-center transition-all duration-300">
                <span className="text-4xl filter" role="img" aria-label="Avocado logo">🥑</span>
              </div>
            </Link>
            <Link href={'/'} className="cursor-pointer group" aria-label="EaterIQ - Smart Food Intelligence">
              <h2
                // ref={titleRef}
                className="text-2xl md:text-3xl font-bold text-primary group-hover:text-primary/80 transition-all duration-300"
              >
                EaterIQ
              </h2>
              <p
                // ref={subtitleRef}
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
                  href={item.path}
                  aria-label={item.label}
                  aria-current={pathname === item.path ? "page" : undefined}
                  key={item.path}
                  className={`font-medium transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm ${
                    pathname === item.path
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    pathname === item.path 
                      ? "w-full" 
                      : "w-0 group-hover:w-full"
                  }`}></span>
                </Link>
              ))}

              {/* Admin Dropdown */}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 font-medium text-muted-foreground hover:text-primary transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm">
                    <Shield className="h-4 w-4" />
                    Admin
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
