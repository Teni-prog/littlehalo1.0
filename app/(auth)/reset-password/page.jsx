import Link from "next/link";
import { LockKeyholeOpen, Heart } from "lucide-react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password | littlëHALO",
  description: "Create a new password for your littlëHALO account.",
};

export default function ResetPasswordPage() {
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
              <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-br from-peach to-coral flex items-center justify-center mx-auto mb-8 shadow-lg">
                <LockKeyholeOpen className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Set New Password
              </h1>
              <p className="text-sm text-gray-600">
                Enter a strong password for your account
              </p>
            </div>

            <ResetPasswordForm />
          </div>
        </div>
      </main>
    </>
  );
}
