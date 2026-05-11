/**
 * 호텔별 갈아끼울 수 있는 사이트 콘텐츠.
 * 새 호텔 온보딩 시 이 파일만 교체하면 됩니다.
 */

export type AboutBlock = {
  /** 블록 유형: text = 텍스트 중심, image-text = 이미지+텍스트, feature-grid = 특징 그리드 */
  type: "text" | "image-text" | "feature-grid";
  eyebrow?: string;
  title: string;
  body?: string;
  image?: string;
  /** image-text 타입에서 이미지 위치 */
  imagePosition?: "left" | "right";
  /** feature-grid 타입에서 사용 */
  features?: { icon: string; title: string; description: string }[];
};

export type SiteContent = {
  /** 사장님 인사말 */
  greeting: {
    headline: string;
    body: string;
    signature: string;
  };
  /** About 섹션 블록들 — 순서대로 렌더링 */
  about: AboutBlock[];
  /** 찾아오는 길 교통 안내 */
  directions: {
    mapImage?: string;
    transport: { icon: string; label: string; description: string }[];
  };
};

// ──────────────────────────────────────────────────────────
// 소월 서울 콘텐츠 (교체 가능)
// ──────────────────────────────────────────────────────────
export const siteContent: SiteContent = {
  greeting: {
    headline: "머무는 모든 순간이\n기억이 되도록.",
    body: "안녕하세요, 소월 서울을 찾아주셔서 감사합니다.\n저희는 한 분 한 분의 여정이 특별해지기를 바라며,\n정성스러운 서비스와 아늑한 공간으로\n잊지 못할 시간을 선사하고자 합니다.",
    signature: "소월 서울 대표 일동",
  },
  about: [
    {
      type: "image-text",
      eyebrow: "Story",
      title: "남산 아래,\n도심 속 안식처.",
      body: "남산의 풍경을 고요히 맞이하는 도심의 안식처. 수공예 가구와 자연광이 어우러진 객실에서 서울의 스카이라인을 품에 안듯 바라봅니다. 모던 한식 미학과 유러피안 호스피탈리티가 교차하는 이곳에서 도시 속 또 하나의 정원을 경험하세요.",
      image: "/hotels/sowol-seoul/gallery-1.jpg",
      imagePosition: "right",
    },
  ],
  directions: {
    transport: [
      { icon: "map-pin", label: "주소", description: "서울특별시 중구 퇴계로 100" },
      { icon: "car", label: "자가용", description: "호텔 지하 주차장 이용 (발레파킹 가능)" },
      { icon: "train", label: "대중교통", description: "지하철 4호선 명동역 3번 출구 도보 10분" },
    ],
  },
};
