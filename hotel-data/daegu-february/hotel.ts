import type { Hotel } from "@/domain/hotel/types";

export const SITE_HOTEL_ID = "daegu-february";

export const siteHotel: Hotel = {
  id: SITE_HOTEL_ID,
  name: "대구 2월호텔 더 시그니처-동성로점",
  city: "대구",
  grade: 5,
  heroImages: [
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2026/01/29/19/d99116baf309418b816435e69d7249c4.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2026/01/29/14/01120d583fed4b2bb4e1169066538401.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2025/07/25/17/3994aca4e2f543059106ff57264f6801.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2025/07/25/17/5ef2a77da0604311932a283eca83c576.jpg",
  ],
  shortConcept: "동성로 중심, 루프탑 노천스파를 갖춘 프리미엄 시그니처 호텔",
  address: "대구 중구 중앙대로81길 13",
  phone: "053-257-9898",
  heroTitleSize: "sm",
};
