import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthVisual } from "@/components/auth/AuthVisual";

export const metadata = {
  title: "Log In | littlëHALO",
  description:
    "Log in to littlëHALO - Access your account to manage bookings, find sitters, or connect with families.",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary font-semibold hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1"
              >
                Sign up
              </Link>
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Right Side - Visual */}
        <AuthVisual
          badge="Trusted by 2,000+ Families"
          title="Find trusted childcare in minutes"
          description="Connect with culturally-aligned, verified babysitters who understand your family's unique needs."
          features={[
            {
              icon: "solar:verified-check-bold",
              title: "100% Verified Sitters",
              description:
                "Background checks and ID verification on every sitter",
            },
            {
              icon: "solar:global-linear",
              title: "Cultural Matching",
              description:
                "Find sitters who speak your language and understand traditions",
            },
            {
              icon: "solar:shield-check-linear",
              title: "Fully Insured",
              description:
                "Every booking includes comprehensive insurance coverage",
            },
          ]}
        />
      </div>
    </AuthLayout>
  );
}
