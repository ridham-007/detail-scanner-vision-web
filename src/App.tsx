import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import FoodScannerPage from "./pages/FoodScannerPage";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPage from "./pages/QuizPage";
import UserProfilePage from "./pages/UserProfilePage";
import UserSettingsPage from "./pages/UserSettingsPage";
import NotFound from "./pages/NotFound";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import SupportPage from "./pages/SupportPage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import ScanHistoryPage from "./pages/ScanHistoryPage";
import ShoppingListsPage from "./pages/ShoppingListsPage";
import AdminBlogsPage from "./pages/admin/AdminBlogsPage";
import CreateBlogPage from "./pages/admin/CreateBlogPage";
import EditBlogPage from "./pages/admin/EditBlogPage";
import ProductSubmissionsPage from "./pages/admin/ProductSubmissionsPage";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";
import ContributionsPage from "./pages/ContributionsPage";
import PricingPage from "./pages/PricingPage";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage";
import ScrollToTop from "./components/scrollToTop";
import AuthPage from "./pages/AuthPage";
import CategoriesPage from "./pages/CategoriesPage";
import DeleteAccountPage from "./pages/DeleteAccountPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <ScrollToTop />   {/* 👈 Add here */}
              <div className="min-h-screen bg-background flex flex-col w-full">
                {/* Skip to main content link for keyboard navigation */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Skip to main content
                </a>
                <Header />
                <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/scanner" element={<FoodScannerPage />} />
                    <Route path="/history" element={<ScanHistoryPage />} />
                    <Route path="/shopping-lists" element={<ShoppingListsPage />} />
                    <Route path="/quiz" element={<QuizzesPage />} />
                    <Route path="/quiz/:slug" element={<QuizPage />} />
                    <Route path="/profile/:username" element={<UserProfilePage />} />
                    <Route path="/settings" element={<UserSettingsPage />} />
                    <Route path="/blog" element={<BlogListPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/admin/blogs" element={<AdminBlogsPage />} />
                    <Route path="/admin/blogs/new" element={<CreateBlogPage />} />
                    <Route path="/admin/blogs/edit/:id" element={<EditBlogPage />} />
                    <Route path="/admin/submissions" element={<ProductSubmissionsPage />} />
                    <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                    <Route path="/contributions" element={<ContributionsPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/subscription-success" element={<SubscriptionSuccessPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/delete-account" element={<DeleteAccountPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <CookieConsent />
              </div>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
