import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LogIn,
  LogOut,
  User,
  Settings,
  Scan,
  Trophy,
  Menu,
  BookOpen,
  Shield,
  ShoppingCart,
  History,
  CreditCard,
  Heart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const AuthButton = () => {
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from("profiles")
        .select("username, avatar_url, full_name")
        .eq("id", user.id)
        .single();

      if (data) {
        setUsername(data.username);
        setFullName(data.full_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const navigationItems = [
    { path: "/food-scanner", label: "Scanner", icon: Scan },
    { path: "/quiz", label: "Quiz", icon: Trophy },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/pricing", label: "Pricing", icon: CreditCard },
    { path: "/history", label: "History", icon: History },
    { path: "/favorites", label: "Favourites", icon: Heart },
    { path: "/shopping-lists", label: "Lists", icon: ShoppingCart },
  ];

  const getUserInitials = () => {
    if (username) return username.substring(0, 2).toUpperCase();
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return "US";
  };

  const displayName =
    fullName?.trim() ||
    username?.trim() ||
    user?.email?.split("@")[0] ||
    "User";

  // =========================
  // LOADING STATE
  // =========================
  if (loading && !user) {
    return (
      <>
        {/* Mobile Loading Button */}
        <div className="md:hidden">
          <Button
            aria-label="Loading"
            variant="outline"
            size="sm"
            disabled
            className="
              rounded-full
              border-white/70
              bg-white/85
              shadow-[var(--shadow-soft)]
              shrink-0
            "
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Loading Button */}
        <Button
          aria-label="Loading"
          disabled
          className="
            hidden
            md:flex
            items-center
            justify-center
            rounded-full
            shadow-[var(--shadow-warm)]
          "
        >
          <div className="flex gap-2">
            <LogIn className="h-2 w-2" />
            Loading..
          </div>
        </Button>
      </>
    );
  }

  // =========================
  // USER LOGGED IN
  // =========================
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="User Menu"
            variant="outline"
            size="sm"
            className="
              max-w-[170px]
              gap-2
              overflow-hidden
              rounded-full
              border-white/70
              bg-white/85
              shadow-[var(--shadow-soft)]
              hover:bg-orange-50
              hover:text-foreground
              shrink-0
            "
          >
            <Avatar className="h-6 w-6">
              <AvatarImage alt="user avatar" src={avatarUrl || undefined} />
              <AvatarFallback className="text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            <span className="hidden md:block truncate max-w-[90px]">
              {displayName}
            </span>

            <Menu className="h-4 w-4 md:hidden" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={10}
          collisionPadding={20}
          className="
            z-[99999]
            w-56
            rounded-3xl
            border-white/70
            bg-white/95
            p-2
            shadow-product
            backdrop-blur-sm
          "
        >
          {/* Mobile Navigation */}
          <div className="md:hidden">
            {navigationItems.map((item) => (
              <DropdownMenuItem
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`rounded-2xl hover:!bg-orange-50 hover:!text-foreground ${
                  pathname === item.path ? "bg-orange-50 text-foreground" : ""
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
          </div>

          {/* Profile */}
          {username && (
            <DropdownMenuItem
              onClick={() => router.push(`/profile/${username}`)}
              className="rounded-2xl hover:!bg-orange-50 hover:!text-foreground"
            >
              <User className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
          )}

          {/* History */}
          <DropdownMenuItem
            onClick={() => router.push("/history")}
            className={`rounded-2xl hover:!bg-orange-50 hover:!text-foreground ${
              pathname === "/history" ? "bg-orange-50 text-foreground" : ""
            }`}
          >
            <History className="h-4 w-4 mr-2" />
            History
          </DropdownMenuItem>

          {/* Favorites */}
          <DropdownMenuItem asChild>
            <Link
              href="/favorites"
              className={`flex items-center gap-2 cursor-pointer rounded-2xl px-2 py-1.5 text-sm hover:bg-orange-50 hover:text-foreground ${
                pathname === "/favorites" ? "bg-orange-50 text-foreground" : ""
              }`}
            >
              <Heart className="h-4 w-4" />
              Favourites
            </Link>
          </DropdownMenuItem>

          {/* Settings */}
          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="rounded-2xl hover:!bg-orange-50 hover:!text-foreground"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>

          {/* Admin */}
          {isAdmin && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push("/admin/blogs")}
                className="rounded-2xl hover:!bg-orange-50 hover:!text-foreground"
              >
                <Shield className="h-4 w-4 mr-2" />
                Manage Blogs
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={signOut}
            className="rounded-2xl hover:!bg-orange-50 hover:!text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // =========================
  // NOT LOGGED IN
  // =========================
  return (
    <>
      {/* Mobile Menu */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Mobile Menu"
              variant="outline"
              size="sm"
              className="
                rounded-full
                border-white/70
                bg-white/85
                shadow-[var(--shadow-soft)]
              "
            >
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="
              w-56
              rounded-3xl
              border-white/70
              bg-white/95
              p-2
              shadow-product
              backdrop-blur-sm
            "
          >
            {navigationItems.map((item) => (
              <DropdownMenuItem
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`rounded-2xl hover:!bg-orange-50 hover:!text-foreground ${
                  pathname === item.path ? "bg-orange-50 text-foreground" : ""
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push("/auth")}
              className="rounded-2xl hover:!bg-orange-50 hover:!text-foreground"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Sign In Button */}
      <Button
        aria-label="Sign In"
        onClick={() => router.push("/auth")}
        className="
          hidden
          md:flex
          items-center
          justify-center
          rounded-full
          shadow-[var(--shadow-warm)]
          min-w-[120px]
        "
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    </>
  );
};

export default AuthButton;
