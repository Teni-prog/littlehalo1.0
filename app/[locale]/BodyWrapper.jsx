"use client";

import { usePathname } from "@/i18n/navigation";

export default function BodyWrapper({ children }) {
  const pathname = usePathname();
  
  // Don't add top padding on sidebar pages (sitter or parent — they own their full viewport)
  const isSidebarPage =
    pathname?.startsWith("/profile/Sitter")  ||
    pathname?.startsWith("/schedule/sitter") ||
    pathname?.startsWith("/settings/sitter") ||
    pathname?.startsWith("/sessions/sitter") ||
    pathname?.startsWith("/profile/Parents") ||
    pathname?.startsWith("/schedule/parent") ||
    pathname?.startsWith("/settings/parent") ||
    pathname?.startsWith("/bookings/parent");

  return (
    <div className={isSidebarPage ? "" : "pt-16"}>
      {children}
    </div>
  );
}
