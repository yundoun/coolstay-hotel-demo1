import type { SiteContent } from "@/domain/content/types";

export const siteContent: SiteContent = {
  greeting: {
    headline: "천년의 고도에서\n특별한 하루를.",
    body: "경주 황리단길 호텔 팰리스에 오신것을 환영합니다!\n경주에서 최고의 추억을 만들수 있도록\n최선을 다하겠습니다!",
    signature: "경주 황리단길 팰리스 호텔 일동",
  },
  about: [
    {
      type: "image-text",
      eyebrow: "Story",
      title: "황리단길 중심,\n경주의 새로운 랜드마크.",
      body: "천년 고도 경주의 감성과 현대적 편안함이 만나는 곳. 황리단길과 시외버스터미널 근처에 위치하여 경주의 주요 명소를 편리하게 둘러보실 수 있습니다. 5성급 호텔 침구류와 스파욕조를 갖춘 객실에서 여행의 피로를 말끔히 풀어보세요.",
      image:
        "https://cdn.coolstay.co.kr/upload/etc/shark1230/2024/03/14/15/74393ea6ef564f4585db7fb62fccbd93.jpg",
      imagePosition: "right",
    },
  ],
  directions: {
    mapQuery: "경북 경주시 봉황로51번길 11",
    items: [
      { label: "주소", value: "경북 경주시 봉황로51번길 11" },
      { label: "연락처", value: "010-2881-4995" },
      { label: "체크인", value: "15:00" },
      { label: "체크아웃", value: "11:00" },
      { label: "주차", value: "무료 주차 25대 (만차 시 공영주차장 비용 지원)" },
      { label: "경주 시외버스터미널", value: "1.5km, 차량 5분" },
      { label: "경주 황리단길", value: "1.2km, 차량 6분" },
      { label: "경주 대릉원", value: "1.4km, 차량 6분" },
      { label: "경주 첨성대", value: "2.3km, 차량 9분" },
    ],
  },
};
