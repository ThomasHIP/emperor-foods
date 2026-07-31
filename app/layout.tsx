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
  title: {
    default: "EMPEROR FOODS | Premium Asian Gifting",
    template: "%s | EMPEROR FOODS",
  },
  description:
    "Discover EMPEROR Mooncake and the Pink–Blue Collection for Mid-Autumn Festival 2026. Premium personal and corporate gifting in Thailand.",
  keywords: [
    "EMPEROR FOODS",
    "EMPEROR Mooncake",
    "pink blue mooncake",
    "Mid-Autumn Festival 2026",
    "corporate gifts Thailand",
    "ขนมไหว้พระจันทร์",
    "ขนมไหว้พระจันทร์ชมพูฟ้า",
  ],
  openGraph: {
    title: "EMPEROR FOODS — Modern Flavours, Traditional Craftsmanship",
    description: "The Pink–Blue Mooncake Collection for Mid-Autumn 2026.",
    type: "website",
    locale: "th_TH",
    alternateLocale: ["en_US", "zh_CN"],
    images: [{ url: "/brand/emperor-primary.png", width: 1536, height: 1536, alt: "EMPEROR FOODS" }],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <meta name="theme-color" content="#4b0717" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "Organization", name: "EMPEROR FOODS", slogan: "Premium Asian Lifestyle", url: "https://emperor-foods.vatisp.chatgpt.site" },
                { "@type": "Product", name: "EMPEROR Pink–Blue Mooncake", brand: { "@type": "Brand", name: "EMPEROR" }, category: "Mooncake", offers: { "@type": "Offer", priceCurrency: "THB", price: "200", availability: "https://schema.org/PreOrder" } },
                { "@type": "FAQPage", mainEntity: [
                  { "@type": "Question", name: "How does the ฿200 HERO Insure privilege work?", acceptedAnswer: { "@type": "Answer", text: "Every mooncake generates one individual ฿200 code for one vehicle and one PRB policy through HERO Insure. Codes cannot be combined." } },
                  { "@type": "Question", name: "Which payment methods are supported?", acceptedAnswer: { "@type": "Answer", text: "HERO PAY supports Dynamic Thai QR and PromptPay, cards, Alipay, WeChat Pay and Payment Links after merchant activation." } }
                ] }
              ]
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
