import { Inter, Outfit } from "next/font/google";
//It hosts font files with other static assets so that there are no additional network requests.
import "./globals.css";
import { PublicNavbar } from '@/components/layout/PublicNavbar';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Little Halo - Babysitting Marketplace",
  description: "Connect with local babysitters who speak your language.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <PublicNavbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
