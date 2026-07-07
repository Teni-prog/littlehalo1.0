import { Inter, Outfit } from "next/font/google";
//It hosts font files with other static assets so that there are no additional network requests.
import "@/app/globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/navbar";
import BodyWrapper from "./BodyWrapper";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// for body text
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
// for headings

export const metadata = {
  title: "Little Halo - Babysitting Marketplace",
  description: "Connect with local babysitters who speak your language.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <BodyWrapper>{children}</BodyWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
