export type SiteContent = {
  /** 사장님 인사말 */
  greeting: {
    headline: string;
    body: string;
    signature: string;
  };
  /** About 섹션 */
  about: {
    subtitle?: string;
    title: string;
    body?: string;
    images: string[];
  };
  /** 찾아오는 길 — 지도 + 안내 항목 */
  directions: {
    /** 주차 안내 — 없으면 빈 문자열 */
    parkingInfo: string;
    /** 주변 관광지·교통·연락처 안내 */
    nearbyItems: { label: string; value: string }[];
  };
};
