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
  metadataBase: new URL("https://la-biblia-cambia-noticias.vercel.app"),
  title: {
    default: "La Biblia Cambia Noticias",
    template: "%s | La Biblia Cambia Noticias",
  },
  description: "Noticias, actualidad, fe y esperanza para un mundo que necesita conocer la verdad.",
  keywords: ["noticias cristianas", "noticias biblia", "fe cristiana", "iglesia", "noticias evangelicas", "actualidad cristiana", "Israel noticias"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "La Biblia Cambia Noticias",
    title: "La Biblia Cambia Noticias",
    description: "Noticias, actualidad, fe y esperanza para un mundo que necesita conocer la verdad.",
    images: ["/LOGO-ISRAEL.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Biblia Cambia Noticias",
    description: "Noticias, actualidad, fe y esperanza para un mundo que necesita conocer la verdad.",
    images: ["/LOGO-ISRAEL.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
