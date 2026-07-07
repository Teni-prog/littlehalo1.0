"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ReportIssueForm({ bookingId, onSubmitted = () => {}, onCancel = () => {} }) {
  const t = useTranslations("reportIssueForm");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const ISSUE_TYPES = [
    { value: "no-show", label: t("issueTypes.noShow") },
    { value: "safety-concern", label: t("issueTypes.safetyConcern") },
    { value: "payment-issue", label: t("issueTypes.paymentIssue") },
    { value: "other", label: t("issueTypes.other") },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!issueType || !description.trim()) {
      setError(t("errors.selectIssueAndDescription"));
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          issue_type: issueType,
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("errors.failedToSubmit"));
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        onSubmitted();
      }, 2000);
    } catch (err) {
      setError(t("errors.somethingWentWrong"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-sm font-medium text-green-700">
          ✓ {t("successMessage")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-gray-900">{t("title")}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Issue Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            {t("issueTypeLabel")}
          </label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:outline-none cursor-pointer"
          >
            <option value="">{t("selectIssueTypePlaceholder")}</option>
            {ISSUE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            {t("descriptionLabel")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("descriptionPlaceholder")}
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:bg-white resize-none outline-none transition-colors"
          />
          <div className="text-xs text-gray-400 text-right mt-1">
            {t("charCount", { count: description.length, max: 500 })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
