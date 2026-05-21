import type { Hotel } from "@/domain/hotel/types";

// ──────────────────────────────────────────────────────────
// Single-hotel site — "소월 서울" 전용 데이터
// ──────────────────────────────────────────────────────────

export const SITE_HOTEL_ID = "sowol-seoul";

export const siteHotel: Hotel = {
  id: SITE_HOTEL_ID,
  name: "소월 서울",
  nameEn: "Sowol Seoul",
  city: "서울",
  grade: 5,
  heroImages: [
    "/hotels/sowol-seoul/hero.jpg",
    "/hotels/sowol-seoul/hero-2.jpg",
    "/hotels/sowol-seoul/hero-3.jpg",
  ],
  galleryImages: [
    "/hotels/sowol-seoul/gallery-1.jpg",
    "/hotels/sowol-seoul/gallery-2.jpg",
    "/hotels/sowol-seoul/gallery-3.jpg",
    "/hotels/sowol-seoul/gallery-4.jpg",
  ],
  shortConcept: "남산 아래 도심 속 어반 생크추어리",
  description:
    "남산의 풍경을 고요히 맞이하는 도심의 안식처. 수공예 가구와 자연광이 어우러진 객실에서 서울의 스카이라인을 품에 안듯 바라봅니다. 모던 한식 미학과 유러피안 호스피탈리티가 교차하는 이곳에서 도시 속 또 하나의 정원을 경험하세요.",
  amenities: ["실내 수영장", "스파", "피트니스", "이그제큐티브 라운지", "루프탑 바", "24시간 룸서비스"],
  address: "서울특별시 중구 퇴계로 100",
  checkInTime: "15:00",
  checkOutTime: "11:00",
  phone: "+82-2-2230-3131",
};
