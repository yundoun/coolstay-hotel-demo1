import type { SiteContent } from "@/domain/content/types";

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
    mapQuery: "서울특별시 금천구 디지털로9길 99 스타밸리",
    items: [
      { label: "주소", value: "서울특별시 금천구 디지털로9길 99 스타밸리" },
      { label: "연락처", value: "+82-2-2230-3131" },
      { label: "체크인", value: "15:00" },
      { label: "체크아웃", value: "11:00" },
      { label: "주차", value: "지하 주차장 (발레파킹 가능)" },
    ],
  },
};
