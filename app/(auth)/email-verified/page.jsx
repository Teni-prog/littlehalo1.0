import Link from "next/link";
import { CheckCircle2, UserCheck, Sparkles, Heart } from "lucide-react";

export const metadata = {
  title: "Email Verified | littlëHALO",
  description:
    "Your email has been successfully verified. Welcome to littlëHALO!",
};

export default function EmailVerifiedPage() {
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
        <div className="w-full max-w-lg">
          {/* Decorative Circle */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/40 to-peach/40 rounded-full blur-3xl -z-10" />

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-10 md:p-14">
            {/* Dotted Pattern */}
            <div
              className="absolute inset-0 opacity-5 rounded-3xl"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #10b981 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>

            {/* Confetti Elements */}
            <div className="absolute top-8 right-8 w-3 h-3 bg-emerald-400 rounded-full animate-bounce" />
            <div className="absolute top-12 right-16 w-2 h-2 bg-coral rounded-full animate-bounce animation-delay-1000" />
            <div className="absolute top-6 left-8 w-2.5 h-2.5 bg-peach rounded-full animate-bounce animation-delay-2000" />

            {/* Success Icon */}
            <div className="relative mx-auto mb-8">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-30" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                <CheckCircle2
                  className="w-14 h-14 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div
                className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping"
                style={{ animationDuration: "2s" }}
              />
            </div>

            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
                Email Verified! 🎉
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Your email has been successfully verified. You're all set to get
                started!
              </p>
            </div>

            {/* Next Steps */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-peach/30 to-coral/10 rounded-xl border border-primary/20">
                <UserCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Complete your profile
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Tell us about yourself and your family
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-peach/30 to-coral/10 rounded-xl border border-primary/20">
                <Sparkles className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Start browsing sitters
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Find the perfect match for your family
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/dashboard"
              className="block w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Continue to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
