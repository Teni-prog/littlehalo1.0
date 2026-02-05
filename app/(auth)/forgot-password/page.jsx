import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { AuthNavbar } from "@/components/auth/AuthNavbar";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | littlëHALO",
  description:
    "Reset your littlëHALO password - Enter your email to receive password reset instructions.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen">
      <AuthNavbar backHref="/login" backText="Back to login" />

      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-peach to-coral rounded-full blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-gradient-to-br from-coral to-peach rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-gradient-to-br from-peach to-coral rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <main className="pt-16 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Decorative Circle */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-peach/30 to-coral/30 rounded-full blur-3xl -z-10" />

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 sm:p-10">
            {/* Dotted Pattern */}
            <div
              className="absolute inset-0 opacity-5 rounded-3xl"
              style={{
                backgroundImage:
                  "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>

            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-peach to-coral rounded-2xl blur-xl opacity-40" />
              <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-br from-peach to-coral flex items-center justify-center mx-auto mb-8 shadow-lg">
                <LockKeyhole className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Forgot your password?
              </h1>
              <p className="text-sm text-gray-600">
                No worries! Enter your email and we'll send you a reset link.
              </p>
            </div>

            <ForgotPasswordForm />

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Remember your password?{" "}
                <span className="text-primary font-semibold hover:text-primary-dark">
                  Log in
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
