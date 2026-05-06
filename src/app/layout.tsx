import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import CookieConsent from "@/components/CookieConsent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../index.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EaterIQ - Food Scanner",
  description: "Scan any food product barcode and instantly get nutrition analysis, health scores, ingredient warnings, and healthier alternatives.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-inter antialiased">
        <Providers>
          <AnalyticsProvider>
            <div className="min-h-screen bg-background flex flex-col w-full">
              <Header />
              <main className="flex-1 relative z-10">
                {children}
              </main>
              <Footer />
            </div>
            <CookieConsent />
          </AnalyticsProvider>
        </Providers>
      </body>
    </html>
  );
}
