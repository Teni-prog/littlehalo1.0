import Link from "next/link";
import { Mail } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-[#ff6b6b] rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-red-100">
          <Mail className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="text-gray-500 leading-relaxed">
            We sent a confirmation link to your email. Click it to verify your account and complete your profile setup.
          </p>
        </div>

        <div className="bg-red-50 rounded-xl p-4 text-sm text-gray-600">
          After confirming, you'll be taken to a short form to finish setting up your profile.
        </div>

        <p className="text-sm text-gray-400">
          Wrong email?{" "}
          <Link href="/signup" className="text-[#ff6b6b] font-medium hover:underline">
            Start over
          </Link>
        </p>
      </div>
    </div>
  );
}
