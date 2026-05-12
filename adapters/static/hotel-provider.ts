import type { Hotel, Room } from "@/domain/hotel/types";

// ──────────────────────────────────────────────────────────
// Single-hotel site — "소월 서울" 전용 데이터
// ──────────────────────────────────────────────────────────

export const SITE_HOTEL_ID = "sowol-seoul";

const IMAGES = {
  hero: "/hotels/sowol-seoul/hero.jpg",
  gallery: [
    "/hotels/sowol-seoul/gallery-1.jpg",
    "/hotels/sowol-seoul/gallery-2.jpg",
    "/hotels/sowol-seoul/gallery-3.jpg",
    "/hotels/sowol-seoul/gallery-4.jpg",
  ],
  rooms: {
    deluxe: "/hotels/sowol-seoul/rooms/deluxe.jpg",
    premier: "/hotels/sowol-seoul/rooms/premier.jpg",
    suite: "/hotels/sowol-seoul/rooms/suite.jpg",
  },
};

export const siteHotel: Hotel = {
  id: SITE_HOTEL_ID,
  name: "소월 서울",
  nameEn: "Sowol Seoul",
  city: "서울",
  region: "수도권",
  grade: 5,
  heroImage: IMAGES.hero,
  galleryImages: [...IMAGES.gallery, IMAGES.rooms.deluxe, IMAGES.rooms.suite],
  shortConcept: "남산 아래 도심 속 어반 생크추어리",
  description:
    "남산의 풍경을 고요히 맞이하는 도심의 안식처. 수공예 가구와 자연광이 어우러진 객실에서 서울의 스카이라인을 품에 안듯 바라봅니다. 모던 한식 미학과 유러피안 호스피탈리티가 교차하는 이곳에서 도시 속 또 하나의 정원을 경험하세요.",
  amenities: ["실내 수영장", "스파", "피트니스", "이그제큐티브 라운지", "루프탑 바", "24시간 룸서비스"],
  address: "서울특별시 중구 퇴계로 100",
  checkInTime: "15:00",
  checkOutTime: "11:00",
  phone: "+82-2-2230-3131",
};

// ── 객실 프리셋 ──

type PriceKey = "standard" | "deluxe" | "deluxe_twin" | "premier" | "premier_twin" | "family" | "junior_suite" | "suite";

const PRICES: Record<PriceKey, number> = {
  standard: 280000, deluxe: 380000, deluxe_twin: 400000,
  premier: 540000, premier_twin: 560000, family: 620000,
  junior_suite: 720000, suite: 920000,
};

type RoomPreset = {
  tier: Room["tier"];
  name: string;
  concept: string;
  sizeSqm: number;
  bedType: Room["bedType"];
  maxOccupancy: number;
  amenities: string[];
  priceKey: PriceKey;
  imageKey: keyof typeof IMAGES.rooms;
};

const ROOM_PRESETS: RoomPreset[] = [
  { tier: "STANDARD", name: "스탠다드 룸", concept: "깔끔하고 기능적인 비즈니스 스테이", sizeSqm: 28, bedType: "더블", maxOccupancy: 2, amenities: ["무료 Wi-Fi", "미니바", "샤워부스", "워크데스크"], priceKey: "standard", imageKey: "deluxe" },
  { tier: "DELUXE", name: "디럭스 킹", concept: "호텔의 시그니처 뷰를 정면에 두는 객실", sizeSqm: 38, bedType: "킹", maxOccupancy: 2, amenities: ["무료 Wi-Fi", "네스프레소", "욕조", "웰컴 어메니티"], priceKey: "deluxe", imageKey: "deluxe" },
  { tier: "DELUXE_TWIN", name: "디럭스 트윈", concept: "두 개의 싱글베드로 자유롭게 구성한 디럭스", sizeSqm: 40, bedType: "트윈", maxOccupancy: 2, amenities: ["무료 Wi-Fi", "네스프레소", "욕조", "웰컴 어메니티"], priceKey: "deluxe_twin", imageKey: "deluxe" },
  { tier: "PREMIER", name: "프리미어 킹", concept: "거실이 분리된 넉넉한 프리미어 공간", sizeSqm: 58, bedType: "킹", maxOccupancy: 3, amenities: ["거실 분리", "에스프레소 머신", "욕조", "레이트 체크아웃"], priceKey: "premier", imageKey: "premier" },
  { tier: "FAMILY", name: "패밀리 스위트", concept: "아이와 함께하는 가족을 위한 넓은 공간", sizeSqm: 72, bedType: "킹", maxOccupancy: 4, amenities: ["키즈 어메니티", "거실 분리", "욕조", "미니 주방"], priceKey: "family", imageKey: "premier" },
  { tier: "JUNIOR_SUITE", name: "주니어 스위트", concept: "스위트의 여유를 합리적으로 누리는 선택", sizeSqm: 68, bedType: "킹", maxOccupancy: 3, amenities: ["거실·침실 분리", "에스프레소 머신", "욕조 & 샤워부스", "웰컴 과일"], priceKey: "junior_suite", imageKey: "suite" },
  { tier: "SIGNATURE", name: "시그니처 스위트", concept: "파노라마와 프라이버시가 만나는 최상위 스위트", sizeSqm: 96, bedType: "슈퍼킹", maxOccupancy: 4, amenities: ["프라이빗 버틀러", "다이닝·거실 분리", "욕조 & 샤워부스", "공항 리무진"], priceKey: "suite", imageKey: "suite" },
];

const VIEW = "시티뷰";

export const rooms: Room[] = ROOM_PRESETS.map((preset, idx) => ({
  id: `${SITE_HOTEL_ID}-${preset.tier.toLowerCase()}${ROOM_PRESETS.slice(0, idx).some((p) => p.tier === preset.tier) ? `-${idx}` : ""}`,
  hotelId: SITE_HOTEL_ID,
  name: preset.name,
  concept: preset.concept,
  sizeSqm: preset.sizeSqm,
  bedType: preset.bedType,
  view: VIEW,
  images: [IMAGES.rooms[preset.imageKey], IMAGES.gallery[0], IMAGES.gallery[1]],
  amenities: preset.amenities,
  maxOccupancy: preset.maxOccupancy,
  basePrice: PRICES[preset.priceKey],
  currency: "KRW" as const,
  tier: preset.tier,
}));

// ── 조회 함수 ──

export function getHotel(id: string): Hotel | undefined {
  return id === SITE_HOTEL_ID ? siteHotel : undefined;
}

export function getRoom(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}
