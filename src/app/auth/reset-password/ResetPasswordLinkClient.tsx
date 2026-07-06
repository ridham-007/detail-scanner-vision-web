"use client";

import { useEffect, useMemo, useState } from "react";

const buildAppLink = () => {
  if (typeof window === "undefined") {
    return "eateriq://auth/reset-password";
  }

  const url = new URL(window.location.href);
  return `eateriq://auth/reset-password${url.search}${url.hash}`;
};

export default function ResetPasswordLinkClient() {
  const appLink = useMemo(buildAppLink, []);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    window.location.href = appLink;

    const fallbackTimer = window.setTimeout(() => {
      setShowFallback(true);
    }, 1200);

    return () => window.clearTimeout(fallbackTimer);
  }, [appLink]);

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
        E
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Open EaterIQ to reset your password
      </h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Your reset link is ready. Continue in the mobile app to set a new password.
      </p>
      <a
        href={appLink}
        className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
      >
        Open EaterIQ
      </a>
      {showFallback ? (
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          If the app did not open, install or update EaterIQ and tap the button again.
        </p>
      ) : null}
    </section>
  );
}
