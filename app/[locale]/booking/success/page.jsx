"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/Logo1.png";

export default function BookingSuccessPage() {
  const t = useTranslations("bookingSuccess");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-CA" : "en-US";
  const router = useRouter();

  // Sitter/date context saved by the confirmation page before it cleared localStorage
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ratingContext");
      if (raw) {
        setCtx(JSON.parse(raw));
        localStorage.removeItem("ratingContext");
      }
    } catch {}
  }, []);

  const sessionDateFormatted = ctx?.sessionDate
    ? new Date(ctx.sessionDate).toLocaleDateString(dateLocale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
        <Image
          src={Logo}
          alt={t("logoAlt")}
          width={48}
          height={48}
          className="mx-auto mb-6 rounded-lg"
        />

        <CheckCircle className="w-16 h-16 text-teal-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h1>
        <p className="text-gray-500 text-sm mb-6">{t("description")}</p>

        {ctx?.sitterName && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="font-semibold text-gray-900">{ctx.sitterName}</p>
            {sessionDateFormatted && (
              <p className="text-sm text-gray-500 mt-0.5">
                {sessionDateFormatted}
                {ctx.sessionTime && ` · ${ctx.sessionTime}`}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 sm:gap-3">
          <Button
            onClick={() => router.push("/profile/Parents")}
            className="flex-1 px-2 sm:px-4 bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white cursor-pointer"
          >
            {t("cta.goToDashboard")}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/microadventure")}
            className="flex-1 px-2 sm:px-4 cursor-pointer"
          >
            {t("cta.browseActivities")}
          </Button>
        </div>
      </div>
    </div>
  );
}
