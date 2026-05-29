import type { Hotel } from "@/domain/hotel/types";

export const SITE_HOTEL_ID = "daegu-february";

export const siteHotel: Hotel = {
  id: SITE_HOTEL_ID,
  name: "대구 2월호텔 더 시그니처 동성로점",
  city: "대구",
  grade: 5,
  heroImages: [
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2026/01/29/19/909f9a90bbeb49859b254ea119698389.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2026/02/23/14/93eabaab3d464095a4af3632492080a3.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2025/04/18/11/0ed34933c53f4d56b6ccb7a5105367e4.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2024/08/22/12/a17c5d5dda4b43ddb898d57c69221ff3.jpg",
  ],
  shortConcept: "동성로 중심, 루프탑 노천스파를 갖춘 프리미엄 시그니처 호텔",
  address: "대구 중구 중앙대로81길 13",
  phone: "053-257-9898",
  heroTitleSize: "sm",
};
