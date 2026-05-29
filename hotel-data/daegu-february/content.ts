import type { SiteContent } from "@/domain/content/types";

export const siteContent: SiteContent = {
  greeting: {
    headline: "동성로 한복판,\n특별한 시그니처.",
    body: "대구 2월호텔 더 시그니처-동성로점에 오신 것을 환영합니다!\n루프탑 노천스파와 40여 가지 조식뷔페,\n해피아워까지 잊지 못할 대구 여행을 선사합니다.",
    signature: "대구 2월호텔 더 시그니처 일동",
  },
  about: [
    {
      type: "image-text",
      eyebrow: "Story",
      title: "동성로 중심,\n대구의 시그니처 호텔.",
      body: "대구 도심 동성로에 위치한 2월호텔 더 시그니처는 약전 루프탑 노천스파, 40여 가지 조식뷔페, 해피아워 라운지를 갖춘 프리미엄 호텔입니다. 디럭스부터 가든 카라반 스위트까지 다양한 객실에서 특별한 하루를 경험하세요.",
      image:
        "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2026/01/29/19/909f9a90bbeb49859b254ea119698389.jpg",
      imagePosition: "right",
    },
  ],
  directions: {
    mapQuery: "대구 중구 중앙대로81길 13",
    items: [
      { label: "주소", value: "대구 중구 중앙대로81길 13" },
      { label: "연락처", value: "053-257-9898" },
      {
        label: "주차",
        value:
          "무료 주차 50대\n(만차 시 인근 제휴 주차장 안내, 주차요금 지원)",
      },
      { label: "대구 동성로", value: "도보 3분" },
      { label: "대구역", value: "도보 10분" },
    ],
  },
};
