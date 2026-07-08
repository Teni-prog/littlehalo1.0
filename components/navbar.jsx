"use client";

import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Logo from "@/public/Logo1.png";
import Image from "next/image";
import { UserCircle, Settings, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
  const t = useTranslations("navbar");
  const router = useRouter();
  const pathname = usePathname();

  const NAV_LINKS = [
    { label: t("activities"), href: "/microadventure" },
  ];
  const [user, setUser] = useState(null);
  const [hasAvailability, setHasAvailability] = useState(true); // true = no notification
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Check if sitter has availability set
  useEffect(() => {
    if (user?.user_metadata?.user_type !== "sitter") return;

    const supabase = createClient();
    const checkAvailability = async () => {
      try {
        const { data: profile } = await supabase
          .from("sitter_profiles")
          .select("recurring_availability")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          const hasAvail = profile.recurring_availability && Object.keys(profile.recurring_availability).length > 0;
          setHasAvailability(hasAvail);
        }
      } catch (err) {
        setHasAvailability(true); // Default to no notification on error
      }
    };

    checkAvailability();
  }, [user]);

  async function handleLogout() {
    setMobileMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  // Hide navbar on pages that use a sidebar layout (sitter or parent)
  const isSidebarPage =
    pathname?.startsWith("/profile/Sitter")  ||
    pathname?.startsWith("/schedule/sitter") ||
    pathname?.startsWith("/settings/sitter") ||
    pathname?.startsWith("/sessions/sitter") ||
    pathname?.startsWith("/profile/Parents") ||
    pathname?.startsWith("/schedule/parent") ||
    pathname?.startsWith("/settings/parent") ||
    pathname?.startsWith("/bookings/parent");

  if (isSidebarPage) {
    return null;
  }

  const userType = user?.user_metadata?.user_type;
  const profileHref = userType === "sitter" ? "/profile/Sitter" : "/profile/Parents";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image
              src={Logo}
              alt="Little Halo Logo"
              width={75}
              height={80}
              className="ml-5 cursor-pointer"
            />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop controls */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          {user ? (
            <>
              {(userType === "parent" || userType === "sitter") && (
                <Link
                  href={userType === "sitter" ? "/settings/sitter" : "/settings/parent"}
                  aria-label={t("settingsAriaLabel")}
                  className="relative"
                >
                  <Settings className="w-5 h-5 text-gray-500 hover:text-primary transition-colors cursor-pointer" />
                  {userType === "sitter" && !hasAvailability && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </Link>
              )}
              <Link href={profileHref} aria-label={t("profileAriaLabel")}>
                <UserCircle className="w-8 h-8 text-gray-500 hover:text-primary transition-colors cursor-pointer" />
              </Link>
              <Button onClick={handleLogout} variant="outline" className="cursor-pointer">
                {t("logOut")}
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t("logIn")}
              </Link>
              <Link href="/signup">
                <Button className="cursor-pointer bg-primary hover:bg-primary/90 text-white">
                  {t("signUp")}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? t("closeMenuAriaLabel") : t("openMenuAriaLabel")}
          className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 text-gray-700"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="py-3 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <LanguageSwitcher />

          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            {user ? (
              <>
                {(userType === "parent" || userType === "sitter") && (
                  <Link
                    href={userType === "sitter" ? "/settings/sitter" : "/settings/parent"}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 py-3 text-base font-medium text-gray-700"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    {t("settingsAriaLabel")}
                    {userType === "sitter" && !hasAvailability && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </Link>
                )}
                <Link
                  href={profileHref}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 py-3 text-base font-medium text-gray-700"
                >
                  <UserCircle className="w-5 h-5 text-gray-500" />
                  {t("profileAriaLabel")}
                </Link>
                <Button onClick={handleLogout} variant="outline" className="w-full cursor-pointer min-h-[44px]">
                  {t("logOut")}
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="py-3 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {t("logIn")}
                </Link>
                <Link href="/signup" onClick={closeMobileMenu}>
                  <Button className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-white min-h-[44px]">
                    {t("signUp")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
