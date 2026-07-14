import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Heart,
  ShieldCheck,
  Scan,
  Sparkles,
  Smartphone,
  Zap,
  BarChart3,
  Shield,
  ListChecks,
  Clock3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Download EaterIQ | Scan Smarter on iPhone and Android",
  description:
    "Download EaterIQ to scan barcodes, check ingredients, review health scores, and unlock smarter food choices on mobile.",
  keywords: [
    "download EaterIQ",
    "food scanner app",
    "barcode scanner app",
    "nutrition scanner",
    "ingredient checker app",
    "health score app",
  ],
  alternates: {
    canonical: "https://www.eateriq.com/download/",
  },
  openGraph: {
    type: "website",
    title: "Download EaterIQ | Scan Smarter on iPhone and Android",
    description:
      "Get the EaterIQ app for fast barcode scanning, ingredient insights, and healthier choices.",
    url: "https://www.eateriq.com/download/",
    siteName: "EaterIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Download EaterIQ | Scan Smarter on iPhone and Android",
    description:
      "Get the EaterIQ app for fast barcode scanning, ingredient insights, and healthier choices.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const appHighlights = [
  {
    icon: Scan,
    title: "Fast barcode scanning",
    description:
      "Scan packaged food products quickly and get results in seconds.",
  },
  {
    icon: ListChecks,
    title: "Ingredient breakdown",
    description:
      "See what’s inside with clear ingredient explanations and warnings.",
  },
  {
    icon: BarChart3,
    title: "Nutrition at a glance",
    description:
      "Review calories, macros, and product quality without reading a wall of text.",
  },
  {
    icon: Shield,
    title: "Allergen and additive flags",
    description:
      "Spot ingredients you may want to avoid based on your health goals.",
  },
];

const proHighlights = [
  "Unlimited scans every day",
  "Full nutrition breakdowns",
  "Allergen and additive flags",
  "Healthier product alternatives",
  "Preference-aware filtering",
  "Unlimited scan history and favorites",
];

const howItWorks = [
  {
    step: "01",
    title: "Download the app",
    copy: "Install EaterIQ from the App Store or Google Play.",
  },
  {
    step: "02",
    title: "Scan a product",
    copy: "Use your camera or enter a barcode manually when needed.",
  },
  {
    step: "03",
    title: "Read the insights",
    copy: "Check ingredients, nutrition, health score, and warnings instantly.",
  },
  {
    step: "04",
    title: "Choose better",
    copy: "Save time and make more confident food decisions every day.",
  },
];

const faqs = [
  {
    question: "Is the app free to use?",
    answer:
      "Yes. You can start free, and the app gives you a limited number of scans each day. Pro unlocks unlimited scans and deeper insights.",
  },
  {
    question: "Does the app work on both iPhone and Android?",
    answer:
      "Yes. EaterIQ is available on both major mobile platforms through the App Store and Google Play.",
  },
  {
    question: "What makes Pro worth it?",
    answer:
      "Pro is built for frequent scanners. It removes daily limits and unlocks more detailed product analysis, alternatives, and history features.",
  },
  {
    question: "Can I still use the web version?",
    answer:
      "Yes. The browser experience stays available for quick scans, while the mobile app is designed for faster everyday use.",
  },
];

export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Download" }]} />

      <header className="relative overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,253,249,0.99),rgba(255,246,235,0.9))] px-5 py-8 shadow-product sm:px-8 sm:py-10">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,214,163,0.13),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,226,191,0.16),transparent_26%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge
              variant="secondary"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-primary"
            >
              <Sparkles className="h-4 w-4" />
              Mobile food scanning, built for daily use
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Download{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  EaterIQ
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Scan food products on the go, uncover ingredient details, check
                nutrition scores, and make smarter choices in seconds.
              </p>
            </div>

            {/* App Store Badges */}
            <div className="flex items-center gap-3 sm:flex-row sm:gap-4 sm:justify-start lg:justify-start">
              <a
                href="https://apps.apple.com/sg/app/eateriq/id6757137222"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                  alt="Download on the App Store"
                  width={126}
                  height={42}
                  className="h-[42px] w-auto md:h-[52px]"
                  loading="lazy"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.eateriq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  width={155}
                  height={60}
                  className="h-[60px] md:h-[74px] w-auto -my-[10px]"
                  loading="lazy"
                />
              </a>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 shadow-[var(--shadow-soft)]">
                <Download className="h-4 w-4 text-primary" />
                Free to start
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 shadow-[var(--shadow-soft)]">
                <Zap className="h-4 w-4 text-primary" />
                Fast scans
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 shadow-[var(--shadow-soft)]">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Pro unlocks more
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto w-full max-w-[420px] rounded-[34px] border border-white/70 bg-white/85 p-4 shadow-[0_26px_60px_-26px_hsl(var(--primary)/0.34)] backdrop-blur-sm">
              <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,245,236,0.98),rgba(255,255,255,0.98))] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      EaterIQ mobile
                    </p>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Scan smarter
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-orange-50 p-3 shadow-[var(--shadow-soft)]">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="rounded-[24px] border-white/70 bg-white/92 shadow-product">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="rounded-2xl bg-orange-50 p-3">
                        <Scan className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">
                          Instant scan results
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Barcode scan, analysis, and health score
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[24px] border-white/70 bg-white/92 shadow-product">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">
                          Pro benefits
                        </p>
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-orange-50 text-primary"
                        >
                          Unlimited
                        </Badge>
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Unlimited scans
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Full nutrition breakdowns
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Healthier alternatives
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {appHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="rounded-[28px] border-white/70 bg-white/88 shadow-product transition-transform duration-300 hover:-translate-y-1"
            >
              <CardContent className="space-y-3 p-6">
                <div className="inline-flex rounded-2xl bg-orange-50 p-3 shadow-[var(--shadow-soft)]">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mt-10">
        <Card className="rounded-[32px] border-white/70 bg-white/88 shadow-product">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="rounded-2xl bg-orange-50 p-3 shadow-[var(--shadow-soft)]">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              Why people keep the app installed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              EaterIQ is built for anyone who wants a faster, clearer way to
              understand packaged food. Instead of guessing from a label, you
              get actionable information in a clean, mobile-friendly flow.
            </p>
            <div className="grid gap-3">
              {proHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[20px] border border-orange-100/70 bg-orange-50/50 px-4 py-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <Badge
              variant="secondary"
              className="mb-3 rounded-full border border-orange-200 bg-orange-50 text-primary"
            >
              <Clock3 className="mr-2 h-3.5 w-3.5" />
              Simple setup
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              How it works
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {howItWorks.map((item) => (
            <Card
              key={item.step}
              className="rounded-[28px] border-white/70 bg-white/88 shadow-product"
            >
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-[0.24em] text-primary">
                    {item.step}
                  </span>
                  <div className="rounded-full bg-orange-50 p-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.copy}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <Card className="rounded-[32px] border-white/70 bg-white/88 shadow-product">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="rounded-2xl bg-orange-50 p-3 shadow-[var(--shadow-soft)]">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              Compare mobile vs web
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              Use the browser version when you want a quick scan on desktop.
              Download the app when you want the fastest everyday experience on
              your phone.
            </p>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <div className="rounded-[20px] border border-orange-100/70 bg-orange-50/50 px-4 py-3">
                Web: best for quick access and larger screens
              </div>
              <div className="rounded-[20px] border border-orange-100/70 bg-orange-50/50 px-4 py-3">
                App: best for frequent scanning and on-the-go use
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <div className="mb-6">
          <Badge
            variant="secondary"
            className="mb-3 rounded-full border border-orange-200 bg-orange-50 text-primary"
          >
            FAQ
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Questions before you install?
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map((faq) => (
            <Card
              key={faq.question}
              className="rounded-[28px] border-white/70 bg-white/88 shadow-product"
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {faq.question}
                </h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10 mb-2">
        <Card className="overflow-hidden rounded-[34px] border-white/80 bg-[linear-gradient(135deg,rgba(255,253,249,0.99),rgba(255,248,240,0.92))] shadow-product">
          <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Download EaterIQ and scan with confidence
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Keep the app in your pocket for everyday shopping, label checks,
                and quicker health decisions.
              </p>
            </div>

            <div className="flex items-center gap-3 sm:flex-row sm:gap-4 sm:justify-start lg:justify-start">
              <a
                href="https://apps.apple.com/sg/app/eateriq/id6757137222"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                  alt="Download on the App Store"
                  width={126}
                  height={42}
                  className="h-[42px] md:h-[52px] w-auto"
                  loading="lazy"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.eateriq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  width={155}
                  height={60}
                  className="h-[60px] md:h-[74px] w-auto -my-[10px]"
                  loading="lazy"
                />
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
