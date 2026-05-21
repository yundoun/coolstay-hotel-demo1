import type { Metadata } from "next";
import { Noto_Serif_KR, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/ui/layout/site-header";
import { SiteFooter } from "@/ui/layout/site-footer";
import { ReservationResetGuard } from "@/ui/layout/reservation-reset-guard";

const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "경주 황리단길 팰리스 호텔 — 꿀스테이",
  description:
    "천년 고도 경주, 황리단길의 프리미엄 호텔. 온라인 객실 예약.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${notoSerifKR.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-ink)]">
        <ReservationResetGuard />
        <SiteHeader />
        <main className="min-h-dvh">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
