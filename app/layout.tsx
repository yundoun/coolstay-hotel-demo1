import type { Metadata } from "next";
import { Noto_Serif_KR, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReservationResetGuard } from "@/components/reservation-reset-guard";

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
  title: "꿀스테이 — 파트너 호텔",
  description:
    "꿀스테이 제휴 호텔 예약. 국내 주요 지역의 엄선된 여섯 개 럭셔리 호텔을 소개합니다.",
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
