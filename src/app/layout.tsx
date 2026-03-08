import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "CocoElif - Lifestyle, Travel & Inspiration",
    template: "%s | CocoElif",
  },
  description: "Lifestyle, Travel & Inspiration. Sharing stories from around the world - Fashion, Travel Guides, und mehr.",
  keywords: ["lifestyle", "travel", "fashion", "blog", "inspiration", "reisen", "mode"],
  authors: [{ name: "CocoElif" }],
  creator: "CocoElif",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://cocoelif.de",
    siteName: "CocoElif",
    title: "CocoElif - Lifestyle, Travel & Inspiration",
    description: "Lifestyle, Travel & Inspiration. Sharing stories from around the world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CocoElif - Lifestyle, Travel & Inspiration",
    description: "Lifestyle, Travel & Inspiration. Sharing stories from around the world.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
