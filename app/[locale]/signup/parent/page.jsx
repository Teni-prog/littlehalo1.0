"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Baby,
  Mail,
  Lock,
  User,
  ArrowLeft,
  MapPin,
  DollarSign,
  Languages,
  Phone,
  Plus,
  Trash2,
  FileText,
} from "lucide-react";
import { signupParent } from "@/app/[locale]/actions/auth";
import { NEIGHBOURHOODS, NEIGHBOURHOOD_COORDS } from "@/lib/neighbourhoods";

const LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "Mandarin",
  "Arabic",
  "Hindi",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Swahili",
  "Portuguese",
  "Punjabi",
  "Tagalog",
  "Urdu",
  "Bengali",
  "Tamil",
  "Somali",
  "Amharic",
];

const SPECIAL_NEEDS = [
  "Autism",
  "ADHD",
  "Language Barrier",
  "Hearing Impairment",
  "Visual Impairment",
  "Down Syndrome",
  "Cerebral Palsy",
  "Speech Delay",
  "Anxiety",
  "Sensory Processing",
];

const emptyChild = { name: "", age: "", needs: [] };

export default function ParentSignupPage() {
  const t = useTranslations("signupParent");
  const [children, setChildren] = useState([{ ...emptyChild }]);
  const [selectedLanguages, setSelectedLanguages] = useState(["English"]);
  const [neighbourhood, setNeighbourhood] = useState("");
  const [state, formAction, isPending] = useActionState(signupParent, null);

  function handleNeighbourhood(name) {
    setNeighbourhood(name);
  }

  useEffect(() => {
    if (state?.error) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state?.error]);

  function addChild() {
    setChildren((prev) => [...prev, { ...emptyChild }]);
  }

  function removeChild(index) {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  }

  function updateChild(index, field, value) {
    setChildren((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    );
  }

  function toggleNeed(childIndex, need) {
    setChildren((prev) =>
      prev.map((c, i) => {
        if (i !== childIndex) return c;
        const needs = c.needs.includes(need)
          ? c.needs.filter((n) => n !== need)
          : [...c.needs, need];
        return { ...c, needs };
      }),
    );
  }

  function toggleLanguage(lang) {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/signup"
          className="inline-flex left-0 gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {t("back")}
        </Link>
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#ff6b6b] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-100">
            <Baby className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("title")}
          </h1>
          <p className="text-gray-500 mt-2">
            {t("subtitle")}
          </p>
        </div>

        {state?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {/* Hidden inputs for arrays and location */}
          <input type="hidden" name="child_count" value={children.length} />
          <input type="hidden" name="neighbourhood" value={neighbourhood} />
          {neighbourhood && NEIGHBOURHOOD_COORDS[neighbourhood] && (
            <>
              <input type="hidden" name="latitude"  value={NEIGHBOURHOOD_COORDS[neighbourhood].lat} />
              <input type="hidden" name="longitude" value={NEIGHBOURHOOD_COORDS[neighbourhood].lng} />
            </>
          )}
          {selectedLanguages.map((lang) => (
            <input key={lang} type="hidden" name="languages" value={lang} />
          ))}
          {children.map((child, i) =>
            child.needs.map((need) => (
              <input
                key={`${i}-${need}`}
                type="hidden"
                name={`child_needs_${i}`}
                value={need}
              />
            )),
          )}

          {/* ── Section 1: Account Details ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-1 border-b border-gray-100">
              {t("sections.account.title")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {t("sections.account.fullName")}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    placeholder={t("sections.account.fullNamePlaceholder")}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {t("sections.account.phone")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="phone"
                    type="tel"
                    placeholder={t("sections.account.phonePlaceholder")}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                {t("sections.account.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder={t("sections.account.emailPlaceholder")}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                {t("sections.account.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder={t("sections.account.passwordPlaceholder")}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: Your Family ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-1 border-b border-gray-100">
              {t("sections.family.title")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {t("sections.family.neighbourhood")} <span className="text-[#ff6b6b]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={neighbourhood}
                    onChange={e => handleNeighbourhood(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none appearance-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
                  >
                    <option value="">{t("sections.family.neighbourhoodPlaceholder")}</option>
                    {NEIGHBOURHOODS.map(n => (
                      <option key={n.name} value={n.name}>{n.name}</option>
                    ))}
                  </select>
                </div>
                {neighbourhood && (
                  <p className="text-xs text-[#ff6b6b] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {t("sections.family.neighbourhoodSelected", { neighbourhood })}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {t("sections.family.maxBudget")}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="max_budget"
                    type="number"
                    placeholder={t("sections.family.maxBudgetPlaceholder")}
                    required
                    min={10}
                    max={100}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                {t("sections.family.aboutFamily")}
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <textarea
                  name="family_bio"
                  placeholder={t("sections.family.aboutFamilyPlaceholder")}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all resize-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-[#ff6b6b]" /> {t("sections.family.preferredLanguages")}
              </label>
              <p className="text-xs text-gray-400">
                {t("sections.family.preferredLanguagesHint")}
              </p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedLanguages.includes(lang)
                        ? "bg-[#ff6b6b] text-white border-[#ff6b6b]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#ff6b6b]/50"
                    }`}
                  >
                    {t(`languageOptions.${lang}`)}
                  </button>
                ))}
              </div>
              {selectedLanguages.length === 0 && (
                <p className="text-xs text-red-500">
                  {t("sections.family.languageRequired")}
                </p>
              )}
            </div>
          </div>

          {/* ── Section 3: Children ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                {t("sections.children.title")}
              </h2>
              <button
                type="button"
                onClick={addChild}
                className="flex items-center gap-1 text-sm text-[#ff6b6b] font-medium hover:underline"
              >
                <Plus className="w-4 h-4" /> {t("sections.children.addButton")}
              </button>
            </div>

            {children.map((child, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl p-4 space-y-4 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    {t("sections.children.childLabel", { number: i + 1 })}
                  </span>
                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChild(i)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      {t("sections.children.name")}
                    </label>
                    <input
                      name={`child_name_${i}`}
                      type="text"
                      placeholder={t("sections.children.namePlaceholder")}
                      value={child.name}
                      onChange={(e) => updateChild(i, "name", e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      {t("sections.children.age")}
                    </label>
                    <input
                      name={`child_age_${i}`}
                      type="number"
                      placeholder={t("sections.children.agePlaceholder")}
                      value={child.age}
                      onChange={(e) => updateChild(i, "age", e.target.value)}
                      min={0}
                      max={18}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">
                    {t("sections.children.specialNeeds")}{" "}
                    <span className="text-gray-400 font-normal">
                      {t("sections.children.optional")}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SPECIAL_NEEDS.map((need) => (
                      <button
                        key={need}
                        type="button"
                        onClick={() => toggleNeed(i, need)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                          child.needs.includes(need)
                            ? "bg-[#ff6b6b] text-white border-[#ff6b6b]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#ff6b6b]/50"
                        }`}
                      >
                        {t(`specialNeedsOptions.${need}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isPending || selectedLanguages.length === 0}
            className="w-full bg-[#ff6b6b] text-white py-4 rounded-xl font-bold text-base hover:bg-[#ff5252] transition-colors shadow-lg shadow-red-100 cursor-pointer disabled:opacity-60"
          >
            {isPending ? t("submit.creating") : t("submit.createAccount")}
          </button>

          <p className="text-center text-gray-500 text-sm pb-8">
            {t("footer.alreadyHaveAccount")}{" "}
            <Link
              href="/signin/parent"
              className="text-[#ff6b6b] font-bold hover:underline"
            >
              {t("footer.signIn")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
