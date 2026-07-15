import type { Metadata } from "next";
import AuthPage from "@/views/AuthPage";

export const metadata: Metadata = {
  title: "Admin Sign In | EaterIQ",
  description: "Sign in to access EaterIQ admin tools.",
};

export default function Page() {
  return <AuthPage redirectTo="/admin/blogs" />;
}
