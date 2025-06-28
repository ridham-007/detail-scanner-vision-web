import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { initGA, trackPageView } from "@/utils/analytics";
import Index from "./pages/Index";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPage from "./pages/QuizPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import UserProfilePage from "./pages/UserProfilePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import SupportPage from "./pages/SupportPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle page view tracking //
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

const App = () => {
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
  }, []);

  return (
    <div className="h-dvh">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <PageTracker />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/quizzes" element={<QuizzesPage />} />
                  <Route path="/quiz/:quizId" element={<QuizPage />} />
                  <Route path="/settings" element={<UserSettingsPage />} />
                  <Route
                    path="/profile/:username"
                    element={<UserProfilePage />}
                  />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
