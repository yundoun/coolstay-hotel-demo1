import type { Hotel } from "@/domain/hotel/types";

export const SITE_HOTEL_ID = "daegu-february";

export const siteHotel: Hotel = {
  id: SITE_HOTEL_ID,
  name: "대구 2월호텔 더 시그니처-동성로점",
  nameEn: "Daegu February Hotel The Signature",
  city: "대구",
  grade: 5,
  heroImages: [
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2026/01/29/19/d99116baf309418b816435e69d7249c4.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2026/01/29/14/01120d583fed4b2bb4e1169066538401.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2025/07/25/16/ed7dc0cbcab7499db98d0757f564a716.jpg",
  ],
  galleryImages: [
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2025/07/25/17/3994aca4e2f543059106ff57264f6801.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2025/07/25/17/5ef2a77da0604311932a283eca83c576.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2025/07/25/17/d7fbc9405b704fb383b92da31f80b0fc.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2025/07/25/17/986143cff7c845f88167811ee1b76768.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2025/07/25/17/596b8ac9ee9b43f5a7fec06c1a9541b3.jpg",
  ],
  shortConcept: "동성로 중심, 루프탑 노천스파를 갖춘 프리미엄 시그니처 호텔",
  description:
    "대구 2월호텔 더 시그니처-동성로점에 오신 것을 환영합니다. 미국 FDA 승인 유기농 토퍼형 매트리스와 80수 구스다운 필로우, 하만카돈 블루투스 스피커, 65인치 4K TV를 갖춘 객실에서 편안한 휴식을 경험하세요. 약전 루프탑 노천스파, 40여 가지 조식뷔페, 해피아워까지 특별한 대구 여행을 약속드립니다.",
  amenities: [
    "루프탑 노천스파",
    "조식뷔페 (40여 가지)",
    "해피아워 라운지",
    "스타일러",
    "하만카돈 스피커",
    "65인치 4K TV",
    "OTT 7종 (넷플릭스 등)",
    "무료 주차 (50대)",
  ],
  address: "대구 중구 중앙대로81길 13",
  checkInTime: "15:00",
  checkOutTime: "11:00",
  phone: "053-257-9898",
  heroTitleSize: "sm",
};
