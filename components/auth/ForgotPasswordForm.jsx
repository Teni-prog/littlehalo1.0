"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Send Reset Link
        </button>

        {/* Success Message */}
        {submitted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-900">
                  Check your email
                </p>
                <p className="text-sm text-emerald-700 mt-1">
                  We've sent a password reset link to your email address.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
}
