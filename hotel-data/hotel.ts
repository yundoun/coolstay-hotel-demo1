import type { Hotel } from "@/domain/hotel/types";

// ──────────────────────────────────────────────────────────
// Single-hotel site — "경주 황리단길 팰리스 호텔" 전용 데이터
// ──────────────────────────────────────────────────────────

export const SITE_HOTEL_ID = "gyeongju-palace";

export const siteHotel: Hotel = {
  id: SITE_HOTEL_ID,
  name: "경주 황리단길 팰리스 호텔",
  nameEn: "Gyeongju Hwangridangil Palace Hotel",
  city: "경주",
  grade: 5,
  heroImages: [
    "https://cdn.coolstay.co.kr/upload/etc/shark1230/2024/03/14/15/74393ea6ef564f4585db7fb62fccbd93.jpg",
    "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/5c33de52373b482eae2fc1966d7a07d5.jpg",
    "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/85b9dd32a5a241f0b5f2e35580b005c2.jpg",
  ],
  galleryImages: [
    "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/95af3f6d1e2e4c3e99fd49ee90caabb0.jpg",
    "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/327a1b2c3d4e5f6a7b8c9d0e1f2a3b4c.jpg",
  ],
  shortConcept: "천년 고도 경주, 황리단길의 프리미엄 호텔",
  description:
    "경주 황리단길 호텔 팰리스에 오신것을 환영합니다! 경주에서 최고의 추억을 만들수 있도록 최선을 다하겠습니다. 스파욕조와 5성급 침구류를 갖춘 객실, 2층 카페테리아 조식 무료 제공 등 편안하고 특별한 경주 여행을 약속드립니다.",
  amenities: [
    "스파욕조",
    "스타일러",
    "비데",
    "공기청정기",
    "65인치 TV",
    "무료 조식",
    "카페테리아",
    "무료 주차",
  ],
  address: "경북 경주시 봉황로51번길 11",
  checkInTime: "15:00",
  checkOutTime: "11:00",
  phone: "010-2881-4995",
};
