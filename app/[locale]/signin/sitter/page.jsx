"use client";

import { Link } from "@/i18n/navigation";
import { ShieldCheck, UserCircle, Mail, Lock, ArrowLeft } from "lucide-react";
import { useActionState } from "react";
import { loginSitter } from "@/app/[locale]/actions/auth";
import { useTranslations } from "next-intl";

export default function SitterLoginPage() {
  const [state, formAction, isPending] = useActionState(loginSitter, null);
  const t = useTranslations("signinSitter");

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Side */}
          <div className="hidden md:block">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t("welcomeBack")}</h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              {t("welcomeMessage")}
            </p>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#ff6b6b]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("safeSecure")}</h3>
                  <p className="text-gray-500">{t("safeSecureDesc")}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                  <UserCircle className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("personalizedExperience")}</h3>
                  <p className="text-gray-500">{t("personalizedExperienceDesc")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 relative">
            <Link
              href="/login"
              className="absolute top-8 left-8 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("changeAccountType")}
            </Link>

            <div className="text-center mt-8 mb-8">
              <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-100">
                <UserCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("sitterSignIn")}</h2>
              <p className="text-gray-500 mt-2">{t("enterCredentials")}</p>
            </div>

            {state?.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t("emailAddress")}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t("password")}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-teal-500 text-white py-3.5 rounded-xl font-bold hover:bg-teal-600 transition-colors shadow-lg shadow-teal-100 cursor-pointer disabled:opacity-60"
              >
                {isPending ? t("signingIn") : t("signIn")}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-8 text-sm">
              {t("dontHaveAccount")}{" "}
              <Link href="/signup/sitter" className="text-teal-500 font-bold hover:underline">
                {t("signUp")}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
