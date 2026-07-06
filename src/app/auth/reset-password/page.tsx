import type { Metadata } from "next";
import ResetPasswordLinkClient from "./ResetPasswordLinkClient";

export const metadata: Metadata = {
  title: "Reset Password | EaterIQ",
  description: "Open EaterIQ to reset your password securely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ResetPasswordLinkClient />;
}
