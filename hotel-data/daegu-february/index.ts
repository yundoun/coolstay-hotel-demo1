import type { SiteConfig } from "@/domain/site-config/types";

/**
 * ┌─────────────────────────────────────────────┐
 * │  대구 2월호텔 더 시그니처 — 웹사이트 설정     │
 * │                                             │
 * │  새 호텔 세팅 시                              │
 * │  아래 값들만 교체하면 됩니다.                  │
 * └─────────────────────────────────────────────┘
 */

const config: SiteConfig = {
  /* ── 기본 정보 ─────────────────────────────── */
  id: "daegu-february",
  name: "대구 2월호텔 더 시그니처 동성로점",
  city: "대구",
  grade: 5,
  address: "대구 중구 중앙대로81길 13",
  phone: "053-257-9898",

  /* ── Hero 섹션 (배너 슬라이드 이미지, 최대 5장) ── */
  heroImages: [
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2026/01/29/19/909f9a90bbeb49859b254ea119698389.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2026/02/23/14/93eabaab3d464095a4af3632492080a3.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2025/04/18/11/0ed34933c53f4d56b6ccb7a5105367e4.jpg",
    "https://storage.googleapis.com/coolstay-prd/v2/owner/jmyong77/2024/08/22/12/a17c5d5dda4b43ddb898d57c69221ff3.jpg",
  ],
  shortConcept: "동성로 중심, 루프탑 노천스파를 갖춘 프리미엄 시그니처 호텔",
  heroTitleSize: "sm",

  /* ── 인사말 섹션 ────────────────────────────── */
  greeting: {
    headline: "동성로 한복판,\n특별한 시그니처.",
    body: "대구 2월호텔 더 시그니처 동성로점에 오신 것을 환영합니다!\n루프탑 노천스파와 40여 가지 조식뷔페,\n해피아워까지 잊지 못할 대구 여행을 선사합니다.",
    signature: "대구 2월호텔 더 시그니처 일동",
  },

  /* ── 호텔 소개(About) 섹션 ──────────────────── */
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

  /* ── 찾아오는 길 섹션 ───────────────────────── */
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

export default config;
