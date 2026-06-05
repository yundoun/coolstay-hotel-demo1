export type AboutBlock = {
  /** 블록 유형: text = 텍스트 중심, image-text = 이미지+텍스트, feature-grid = 특징 그리드 */
  type: "text" | "image-text" | "feature-grid";
  /** 섹션 소제목 — 제목 위에 작게 표시 (예: "Story", "Facilities") */
  subtitle?: string;
  /** 제목 (줄바꿈: \n) */
  title: string;
  /** 본문 설명 */
  body?: string;
  /** 이미지 URL — image-text 타입에서 사용 */
  image?: string;
  /** image-text 타입에서 이미지 위치 ("left" 또는 "right") */
  imagePosition?: "left" | "right";
  /** feature-grid 타입에서 사용할 특징 목록 */
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
  /** 찾아오는 길 — 지도 + 안내 항목 */
  directions: {
    /** 주차 안내 — 없으면 빈 문자열 */
    parkingInfo: string;
    /** 주변 관광지·교통·연락처 안내 */
    nearbyItems: { label: string; value: string }[];
  };
};
