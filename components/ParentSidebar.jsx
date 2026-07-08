"use client";

import { Link, useRouter, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LayoutGrid, Calendar, Settings, Lightbulb, LogOut } from "lucide-react";
import Logo from "@/public/Logo1.png";

const NAV_ITEMS = [
  { id: "dashboard",  labelKey: "dashboard",  href: "/profile/Parents",  Icon: LayoutGrid },
  { id: "schedule",   labelKey: "schedule",   href: "/schedule/parent",  Icon: Calendar },
  { id: "activities", labelKey: "activities", href: "/microadventure",   Icon: Lightbulb },
  { id: "settings",   labelKey: "settings",   href: "/settings/parent",  Icon: Settings },
];

export default function ParentSidebar({ children, userName }) {
  const t = useTranslations("parentSidebar");
  const router     = useRouter();
  const pathname   = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed:", await res.text());
        setLoggingOut(false);
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setLoggingOut(false);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (desktop only) */}
      <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-screen z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3">
            <Image src={Logo} alt={t("logoAlt")} width={40} height={40} className="rounded-lg" />
            <span className="font-bold text-gray-900">{t("brandName")}</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {NAV_ITEMS.map(({ id, labelKey, href, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={id}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  active ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {t(`nav.${labelKey}`)}
              </Link>
            );
          })}
        </nav>

        {/* Footer: Log Out */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5" />
            {loggingOut ? t("loggingOut") : t("logOut")}
          </button>
        </div>
      </div>

      {/* Mobile top bar (logo only) */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-gray-200 flex items-center px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={Logo} alt={t("logoAlt")} width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-gray-900">{t("brandName")}</span>
        </Link>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex items-stretch">
        {NAV_ITEMS.map(({ id, labelKey, href, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={id}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-1.5 text-[11px] font-medium transition-colors ${
                active ? "text-teal-600" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              {t(`nav.${labelKey}`)}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-1.5 text-[11px] font-medium text-red-600 disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          {loggingOut ? t("loggingOut") : t("logOut")}
        </button>
      </nav>

      {/* Main Content */}
      <div className="md:ml-64 flex-1 overflow-auto pt-14 pb-16 md:pt-0 md:pb-0">
        <main className="flex flex-col min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
