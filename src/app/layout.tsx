import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
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
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
            <div className="min-h-screen bg-background flex flex-col w-full">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </Providers>
      </body>
    </html>
  );
}
