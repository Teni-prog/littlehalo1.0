import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthVisual } from "@/components/auth/AuthVisual";

export const metadata = {
  title: "Sign Up | littlëHALO",
  description:
    "Join littlëHALO today - Sign up to find trusted, culturally-matched childcare or become a verified sitter in your community.",
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Signup Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Create an account
            </h1>
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#E5533D] font-semibold hover:text-[#D4442C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5533D] focus-visible:ring-offset-2 rounded px-1"
              >
                Log in
              </Link>
            </p>
          </div>

          <SignupForm />
        </div>

        {/* Right Side - Visual */}
        <AuthVisual
          badge="Join 2,000+ Happy Families"
          title="Start finding trusted care today"
          description="Get matched with culturally-aligned, verified babysitters in under 2 hours. It's free to join."
          features={[
            {
              icon: "solar:clock-circle-bold",
              title: "Fast Matching",
              description:
                "Get matched with qualified sitters in under 2 hours",
            },
            {
              icon: "solar:verified-check-bold",
              title: "Fully Verified",
              description:
                "Every sitter goes through background checks and ID verification",
            },
            {
              icon: "solar:heart-bold",
              title: "Peace of Mind",
              description: "Comprehensive insurance coverage on every booking",
            },
          ]}
        />
      </div>
    </AuthLayout>
  );
}
