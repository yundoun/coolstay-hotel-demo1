import { hotels } from "./hotels";

export type Offer = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  hotelId: string;
  image: string;
  discountLabel: string;
  period: string;
};

/**
 * Demo special offers — references real hotel data for images.
 */
export const offers: Offer[] = [
  {
    id: "summer-ocean",
    title: "얼리썸머 오션 패키지",
    subtitle: "해운 부산 × 꿀스테이",
    description:
      "광안리 바다를 품은 오션뷰 객실에서 시작하는 여름. 조식 뷔페와 인피니티 풀 이용이 포함된 2박 3일 패키지.",
    badge: "EARLY BIRD",
    hotelId: "haeun-busan",
    image: hotels.find((h) => h.id === "haeun-busan")!.heroImage,
    discountLabel: "최대 35% 할인",
    period: "2026.06.01 – 08.31",
  },
  {
    id: "jeju-wellness",
    title: "제주 힐링 리트리트",
    subtitle: "월빛 제주 × 꿀스테이",
    description:
      "한라산의 고요함 속에서 몸과 마음을 재충전하는 3일. 프라이빗 스파와 숲길 명상 프로그램이 포함됩니다.",
    badge: "WELLNESS",
    hotelId: "wolbit-jeju",
    image: hotels.find((h) => h.id === "wolbit-jeju")!.heroImage,
    discountLabel: "최대 25% 할인",
    period: "2026.05.01 – 07.31",
  },
  {
    id: "seoul-staycation",
    title: "서울 스테이케이션",
    subtitle: "소월 서울 × 꿀스테이",
    description:
      "남산의 야경과 함께하는 도심 속 럭셔리 휴식. 레이트 체크아웃과 미슐랭 디너 코스가 포함된 특별한 하룻밤.",
    badge: "CITY ESCAPE",
    hotelId: "sowol-seoul",
    image: hotels.find((h) => h.id === "sowol-seoul")!.heroImage,
    discountLabel: "최대 30% 할인",
    period: "2026.05.15 – 06.30",
  },
  {
    id: "gangwon-autumn",
    title: "설악 프리미어 위크",
    subtitle: "설악 소초 × 꿀스테이",
    description:
      "설악산 단풍이 물드는 계절, 마운틴뷰 프리미어 객실에서 맞이하는 가을. 등산 가이드와 로컬 디너가 함께합니다.",
    badge: "PREMIER WEEK",
    hotelId: "seorak-sokcho",
    image: hotels.find((h) => h.id === "seorak-sokcho")!.heroImage,
    discountLabel: "최대 20% 할인",
    period: "2026.09.01 – 11.15",
  },
];
