"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import SumsubWebSdk from "@sumsub/websdk-react";
import { ShieldCheck, Clock, AlertCircle } from "lucide-react";

export default function SitterVerificationForm({ userId }) {
  const t = useTranslations("sitterVerification");
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [sdkError, setSdkError] = useState(null);
  const hasNotifiedPending = useRef(false);

  useEffect(() => {
    async function load() {
      try {
        const [verificationRes, tokenRes] = await Promise.all([
          fetch("/api/sitter-verification"),
          fetch("/api/sumsub/access-token"),
        ]);

        const verificationData = await verificationRes.json();
        if (verificationRes.ok) {
          setVerification(verificationData.verification || null);
        }

        const tokenData = await tokenRes.json();
        if (tokenRes.ok) {
          setAccessToken(tokenData.token);
        } else {
          setSdkError(tokenData.error || t("errors.sdkLoadFailed"));
        }
      } catch {
        setSdkError(t("errors.sdkLoadFailed"));
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SumSub tokens are short-lived; the SDK calls this to refresh one mid-session.
  const fetchNewToken = useCallback(async () => {
    const res = await fetch("/api/sumsub/access-token");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to refresh SumSub token");
    return data.token;
  }, []);

  // Marks the local record 'pending' once the sitter has finished submitting
  // through the SDK — the webhook later flips it to approved/rejected once
  // SumSub's review completes.
  async function markPendingOnce() {
    if (hasNotifiedPending.current) return;
    hasNotifiedPending.current = true;
    try {
      const res = await fetch("/api/sitter-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) setVerification(data.verification);
    } catch {
      hasNotifiedPending.current = false;
    }
  }

  // The installed @sumsub/websdk-react component only exposes onMessage/
  // onError (confirmed via its shipped type definitions) — applicant status
  // transitions arrive as message *types* through onMessage, not as a
  // separate onApplicantStatusChanged prop.
  function handleMessage(type) {
    if (type === "idCheck.onApplicantStatusChanged" || type === "idCheck.onApplicantSubmitted") {
      markPendingOnce();
    }
  }

  function handleError(error) {
    setSdkError(error?.description || t("errors.sdkLoadFailed"));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (verification?.status === "pending" || verification?.status === "approved") {
    const isApproved = verification.status === "approved";
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isApproved ? "bg-teal-50" : "bg-gray-100"}`}>
          {isApproved ? (
            <ShieldCheck className="w-8 h-8 text-teal-600" />
          ) : (
            <Clock className="w-8 h-8 text-gray-500" />
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isApproved ? t("statusScreen.approved.heading") : t("statusScreen.pending.heading")}
        </h2>
        <p className="text-sm text-gray-500 max-w-sm">
          {isApproved ? t("statusScreen.approved.subtext") : t("statusScreen.pending.subtext")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{t("title")}</h2>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      {verification?.status === "rejected" && verification.rejection_reason && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-[#F96167]/10 border border-[#F96167]/30">
          <AlertCircle className="w-5 h-5 text-[#F96167] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#F96167]">{t("rejectedNotice.title")}</p>
            <p className="text-sm text-[#F96167]">{verification.rejection_reason}</p>
          </div>
        </div>
      )}

      {sdkError && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-[#F96167]/10 border border-[#F96167]/30">
          <AlertCircle className="w-5 h-5 text-[#F96167] shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-[#F96167]">{sdkError}</p>
        </div>
      )}

      {accessToken && (
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          <SumsubWebSdk
            accessToken={accessToken}
            expirationHandler={fetchNewToken}
            config={{
              lang: locale,
              externalWebClientId: userId,
            }}
            options={{ addViewportTag: false, adaptIframeHeight: true }}
            onMessage={handleMessage}
            onError={handleError}
          />
        </div>
      )}
    </div>
  );
}
