import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naturel Peruk | Gerçek Saç Peruk ve Protez Saç Çözümleri",
  description:
    "Doğal görünümlü gerçek saç peruk, protez saç ve medikal peruk çözümleri. İstanbul ve Türkiye geneli hizmet.",
  
  keywords: [
    "peruk",
    "gerçek saç peruk",
    "protez saç",
    "medikal peruk",
    "kadın peruk",
    "erkek peruk",
    "doğal peruk",
    "saç protezi",
    "istanbul peruk",
    "peruk fiyatları",
    "kanser hastaları için peruk",
    "dökülme için peruk",
  ],

  openGraph: {
    title: "Naturel Peruk",
    description:
      "Gerçek saç peruk ve protez saç çözümleri ile doğal görünüm.",
    url: "https://www.naturelperuk.com/",
    siteName: "Naturel Peruk",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* GOOGLE DOĞRULAMA */}
        <meta
          name="google-site-verification"
          content="vhq7OgSaYJLBZi3mY4Td_HBX5733sBBeajYbf39MunU"
        />
      </head>

      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}