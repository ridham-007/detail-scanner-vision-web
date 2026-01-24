import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie, X, Settings } from 'lucide-react';
import Link from 'next/link';
import { updateAnalyticsConsent } from '@/utils/analytics';

const COOKIE_CONSENT_KEY = 'eateriq_cookie_consent';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      ...prefs,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);

    // Update analytics consent using the centralized utility
    updateAnalyticsConsent(prefs.analytics, prefs.marketing);
  };

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptSelected = () => {
    saveConsent(preferences);
  };

  const rejectNonEssential = () => {
    const essentialOnly = { necessary: true, analytics: false, marketing: false };
    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4 duration-300">
      <Card className="max-w-4xl mx-auto p-6 shadow-lg border bg-card">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Cookie className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Cookie Preferences</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Learn more
                  </Link>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={rejectNonEssential}
                className="shrink-0 -mt-2 -mr-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {showPreferences && (
              <div className="space-y-3 pt-2 border-t">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="rounded border-input"
                  />
                  <div>
                    <span className="text-sm font-medium">Essential Cookies</span>
                    <p className="text-xs text-muted-foreground">Required for the website to function properly</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                    className="rounded border-input"
                  />
                  <div>
                    <span className="text-sm font-medium">Analytics Cookies</span>
                    <p className="text-xs text-muted-foreground">Help us understand how visitors interact with our website</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                    className="rounded border-input"
                  />
                  <div>
                    <span className="text-sm font-medium">Marketing Cookies</span>
                    <p className="text-xs text-muted-foreground">Used to deliver relevant advertisements</p>
                  </div>
                </label>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button onClick={acceptAll} className="flex-1 sm:flex-none">
                Accept All
              </Button>
              {showPreferences ? (
                <Button onClick={acceptSelected} variant="outline" className="flex-1 sm:flex-none">
                  Save Preferences
                </Button>
              ) : (
                <Button
                  onClick={() => setShowPreferences(true)}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              )}
              <Button onClick={rejectNonEssential} variant="ghost" className="flex-1 sm:flex-none">
                Reject Non-Essential
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;
