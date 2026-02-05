import Link from "next/link";
import { Mail, Heart } from "lucide-react";

export const metadata = {
  title: "Verify Email | littlëHALO",
  description:
    "Verify your email address to complete your littlëHALO account setup.",
};

export default function VerifyEmailPage() {
  return (
    <>
      {/* Simple centered logo */}
      <div className="pt-8 pb-4 flex justify-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Heart className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex items-baseline gap-0.5 text-lg font-bold tracking-tight">
            <span className="text-[#111827]">littlë</span>
            <span className="text-primary">HALO</span>
          </div>
        </Link>
      </div>

      <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
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
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-peach to-coral flex items-center justify-center mx-auto mb-8 animate-pulse shadow-lg">
                <Mail className="w-9 h-9 text-primary" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Check your email
              </h1>
              <p className="text-sm text-gray-600">
                We sent a verification link to
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                your@email.com
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">1</span>
                </div>
                <p className="text-sm text-gray-700">
                  Click the link in the email to verify your account
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">2</span>
                </div>
                <p className="text-sm text-gray-700">
                  You'll be redirected to complete your profile
                </p>
              </div>
            </div>

            {/* Resend Button */}
            <button
              type="button"
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 mb-4"
            >
              Resend email
            </button>

            <p className="text-xs text-center text-gray-500">
              Didn't receive the email? Check your spam folder.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
