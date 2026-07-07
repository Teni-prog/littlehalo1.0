import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Logo from "@/public/Logo2.png";
import {
  Shield,
  Heart,
  Globe,
  Star,
  Play,
  Check,
  X,
  Users,
  ChevronRight,
  Clock,
  BarChart2,
  Zap,
} from "lucide-react";

function IconX({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.626 5.903-5.626Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function IconFacebook({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}
function IconInstagram({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
function IconLinkedin({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Home() {
  const t = useTranslations("home");
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-orange-50 via-rose-50 to-pink-50 py-20 px-4 md:px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-outfit leading-tight">
              <span className="text-gray-900">{t("hero.titleLine1")}</span>
              <br />
              <span className="text-primary">{t("hero.titleLine2")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              {t("hero.subtitle")}
            </p>

            <form
              action="/search"
              className="bg-white p-2 rounded-xl shadow-lg border max-w-md flex gap-2"
            >
              <Input
                name="location"
                placeholder={t("hero.searchPlaceholder")}
                className="h-12 border-0 bg-gray-50 focus-visible:ring-0 focus-visible:bg-white transition-all flex-1"
              />
              <button
                type="submit"
                className="h-12 px-5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
              >
                {t("hero.searchButton")}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                {t("hero.trust.verified")}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-500" />
                {t("hero.trust.matchTime")}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-500" />
                {t("hero.trust.languages")}
              </span>
            </div>
          </div>

          {/* Right – image + floating badges */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src="https://images.unsplash.com/photo-1613794713137-a78aba4be84a?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={t("hero.imageAlt")}
              className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            />

            {/* Bottom-left badge */}
            <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100 max-w-[210px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  {t("hero.badges.verifiedLabel")}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-700">{t("hero.badges.backgroundChecked")}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t("hero.badges.backgroundCheckedDesc")}
              </p>
            </div>

            {/* Top-right badge – languages */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
              <div className="flex items-center gap-1 mb-1.5">
                {[
                  { code: "CN", bg: "bg-red-400" },
                  { code: "SA", bg: "bg-green-400" },
                  { code: "ES", bg: "bg-yellow-400" },
                  { code: "IN", bg: "bg-orange-400" },
                ].map((lang) => (
                  <div
                    key={lang.code}
                    className={`w-7 h-7 ${lang.bg} rounded-full flex items-center justify-center text-[10px] font-bold text-white`}
                  >
                    {lang.code}
                  </div>
                ))}
                <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600">
                  {t("hero.badges.languagesCount")}
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-700 text-center">
                {t("hero.badges.languagesLabel")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-gray-50 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
              <Star className="w-3.5 h-3.5" />
              {t("features.badge")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-gray-900">
              {t("features.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Smart Matching */}
            <Card className="bg-white border shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t("features.smartMatching.title")}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("features.smartMatching.desc")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    t("features.smartMatching.tags.tag1"),
                    t("features.smartMatching.tags.tag2"),
                    t("features.smartMatching.tags.tag3"),
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cultural Match */}
            <Card className="bg-white border shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t("features.culturalMatch.title")}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("features.culturalMatch.desc")}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-purple-600 font-semibold">
                    {t("features.culturalMatch.languagesAvailable")}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { code: "CN", cls: "bg-red-100 text-red-700" },
                      { code: "SA", cls: "bg-green-100 text-green-700" },
                      { code: "ES", cls: "bg-yellow-100 text-yellow-700" },
                      { code: "IN", cls: "bg-orange-100 text-orange-700" },
                      { code: "+11", cls: "bg-purple-100 text-purple-700" },
                    ].map((lang) => (
                      <span
                        key={lang.code}
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${lang.cls}`}
                      >
                        {lang.code}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 100% Verified */}
            <Card className="bg-white border shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t("features.verified.title")}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("features.verified.desc")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Micro-Adventures */}
            <Card className="bg-white border shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t("features.microAdventures.title")}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("features.microAdventures.desc")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────── */}
      <section id="comparison" className="py-24 bg-white px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
              <BarChart2 className="w-3.5 h-3.5" />
              {t("comparisonTable.badge")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-gray-900">
              {t("comparisonTable.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("comparisonTable.subtitle")}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">
                    {t("comparisonTable.headers.feature")}
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-gray-700">
                    {t("comparisonTable.headers.daycare")}
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-gray-700">
                    {t("comparisonTable.headers.informalSitter")}
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-primary bg-red-50">
                    {t("comparisonTable.headers.littleHalo")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{t("comparisonTable.rows.waitlist.label")}</td>
                  <td className="py-4 px-4 text-sm text-center text-gray-600">{t("comparisonTable.rows.waitlist.daycare")}</td>
                  <td className="py-4 px-4 text-sm text-center text-gray-600">{t("comparisonTable.rows.waitlist.informalSitter")}</td>
                  <td className="py-4 px-4 text-sm text-center text-primary font-semibold bg-red-50/50">{t("comparisonTable.rows.waitlist.littleHalo")}</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{t("comparisonTable.rows.backgroundChecks.label")}</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <X className="w-5 h-5 text-red-400 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-sm text-center text-primary font-semibold bg-red-50/50">{t("comparisonTable.rows.backgroundChecks.littleHalo")}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{t("comparisonTable.rows.culturalMatch.label")}</td>
                  <td className="py-4 px-4 text-sm text-center text-gray-600">{t("comparisonTable.rows.culturalMatch.daycare")}</td>
                  <td className="py-4 px-4 text-sm text-center text-gray-600">{t("comparisonTable.rows.culturalMatch.informalSitter")}</td>
                  <td className="py-4 px-4 text-sm text-center text-primary font-semibold bg-red-50/50">{t("comparisonTable.rows.culturalMatch.littleHalo")}</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{t("comparisonTable.rows.insurance.label")}</td>
                  <td className="py-4 px-4 text-sm text-center text-gray-600">{t("comparisonTable.rows.insurance.daycare")}</td>
                  <td className="py-4 px-4 text-sm text-center text-gray-600">{t("comparisonTable.rows.insurance.informalSitter")}</td>
                  <td className="py-4 px-4 text-sm text-center text-primary font-semibold bg-red-50/50">{t("comparisonTable.rows.insurance.littleHalo")}</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{t("comparisonTable.rows.cost.label")}</td>
                  <td className="py-4 px-4 text-sm text-center text-gray-600">{t("comparisonTable.rows.cost.daycare")}</td>
                  <td className="py-4 px-4 text-sm text-center text-gray-600">{t("comparisonTable.rows.cost.informalSitter")}</td>
                  <td className="py-4 px-4 text-sm text-center text-primary font-semibold bg-red-50/50">{t("comparisonTable.rows.cost.littleHalo")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 bg-gradient-to-r from-orange-50 via-rose-50 to-pink-50 px-4 md:px-6"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
              <Play className="w-3.5 h-3.5 fill-current" />
              {t("howItWorks.badge")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-gray-900">
              {t("howItWorks.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {[
              {
                step: "01",
                icon: <Users className="w-6 h-6 text-white" />,
                title: t("howItWorks.steps.step1.title"),
                desc: t("howItWorks.steps.step1.desc"),
                note: t("howItWorks.steps.step1.note"),
              },
              {
                step: "02",
                icon: <Shield className="w-6 h-6 text-white" />,
                title: t("howItWorks.steps.step2.title"),
                desc: t("howItWorks.steps.step2.desc"),
                note: t("howItWorks.steps.step2.note"),
              },
              {
                step: "03",
                icon: <Heart className="w-6 h-6 text-white" />,
                title: t("howItWorks.steps.step3.title"),
                desc: t("howItWorks.steps.step3.desc"),
                note: t("howItWorks.steps.step3.note"),
              },
            ].map((card) => (
              <div
                key={card.step}
                className="bg-white rounded-2xl shadow-md p-6 relative overflow-hidden"
              >
                <div className="absolute top-3 right-4 text-8xl font-black text-gray-100 leading-none select-none pointer-events-none">
                  {card.step}
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-xs font-semibold text-teal-600">
                      ✓ {card.note}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3].map((n, i) => (
              <div key={n} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {n}
                </div>
                {i < 2 && <div className="w-16 h-0.5 bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR PARENTS / FOR SITTERS ─────────────────────────────── */}
      <section id="for-parents" className="py-24 bg-[#1a1f2e] px-4 md:px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-700">

            {/* Left: For Parents */}
            <div className="pb-12 md:pb-0 md:pr-16 space-y-6">
              <span className="inline-block text-xs font-bold tracking-widest text-teal-400 uppercase bg-teal-400/10 px-3 py-1 rounded-full">
                {t("forParents.badge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white">
                {t("forParents.title")}
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {t("forParents.desc")}
              </p>
              <ul className="space-y-3">
                {[
                  t("forParents.points.point1"),
                  t("forParents.points.point2"),
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-gray-300 text-sm"
                  >
                    <Check className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup/parent"
                className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold transition-colors"
              >
                {t("forParents.cta")} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: For Sitters */}
            <div id="for-sitters" className="pt-12 md:pt-0 md:pl-16 space-y-6">
              <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
                {t("forSitters.badge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white">
                {t("forSitters.title")}
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {t("forSitters.desc")}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary">{t("forSitters.rate")}</span>
                <span className="text-xl font-bold text-gray-400">{t("forSitters.rateUnit")}</span>
              </div>
              <Link
                href="/signup/sitter"
                className="inline-flex items-center gap-1 text-primary hover:text-red-400 font-semibold transition-colors"
              >
                {t("forSitters.cta")} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4 md:px-6 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-12 mb-12">

            {/* Logo + description */}
            <div className="space-y-4 md:w-72 flex-shrink-0">
              <Image src={Logo} alt={t("footer.logoAlt")} width={80} height={80} />
              <p className="text-gray-400 text-sm leading-relaxed">
                {t("footer.description")}
              </p>
              <div className="flex gap-4 pt-1">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <IconX className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <IconFacebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <IconInstagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <IconLinkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* 4 link columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wide">
                  {t("footer.columns.product.title")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/#features" className="text-sm hover:text-white transition-colors">
                      {t("footer.columns.product.features")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/#how-it-works" className="text-sm hover:text-white transition-colors">
                      {t("footer.columns.product.howItWorks")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wide">
                  {t("footer.columns.forFamilies.title")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/search" className="text-sm hover:text-white transition-colors">
                      {t("footer.columns.forFamilies.findSitter")}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm hover:text-white transition-colors">
                      {t("footer.columns.forFamilies.reviews")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wide">
                  {t("footer.columns.forSitters.title")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/signup/sitter" className="text-sm hover:text-white transition-colors">
                      {t("footer.columns.forSitters.becomeSitter")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wide">
                  {t("footer.columns.company.title")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-sm hover:text-white transition-colors">
                      {t("footer.columns.company.aboutUs")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm hover:text-white transition-colors">
                      {t("footer.columns.company.contact")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              {t("footer.copyright")}
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                {t("footer.privacyPolicy")}
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                {t("footer.termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
