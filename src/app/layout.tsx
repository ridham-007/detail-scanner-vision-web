import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../index.css";

export const metadata: Metadata = {
  title: "EaterIQ - Food Scanner",
  description: "Scan any food product barcode and instantly get nutrition analysis, health scores, ingredient warnings, and healthier alternatives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <AnalyticsProvider>
            <div className="min-h-screen bg-background flex flex-col w-full">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AnalyticsProvider>
        </Providers>
      </body>
    </html>
  );
}
