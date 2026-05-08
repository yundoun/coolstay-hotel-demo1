import type { Hotel, Room } from "./types";

/**
 * Image pools — each pool has 1 hero + 4 gallery + 3 room images.
 * Multiple hotels share the same pool (stock photography is acceptable for a demo;
 * the alternative — downloading 200+ images — is demo-day fragile).
 */
const POOLS: Record<
  string,
  { hero: string; gallery: string[]; rooms: { deluxe: string; premier: string; suite: string } }
> = {
  urban: {
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
  },
  ocean: {
    hero: "/hotels/haeun-busan/hero.jpg",
    gallery: [
      "/hotels/haeun-busan/gallery-1.jpg",
      "/hotels/haeun-busan/gallery-2.jpg",
      "/hotels/haeun-busan/gallery-3.jpg",
      "/hotels/haeun-busan/gallery-4.jpg",
    ],
    rooms: {
      deluxe: "/hotels/haeun-busan/rooms/ocean-deluxe.jpg",
      premier: "/hotels/haeun-busan/rooms/gwangan.jpg",
      suite: "/hotels/haeun-busan/rooms/signature.jpg",
    },
  },
  forest: {
    hero: "/hotels/wolbit-jeju/hero.jpg",
    gallery: [
      "/hotels/wolbit-jeju/gallery-1.jpg",
      "/hotels/wolbit-jeju/gallery-2.jpg",
      "/hotels/wolbit-jeju/gallery-3.jpg",
      "/hotels/wolbit-jeju/gallery-4.jpg",
    ],
    rooms: {
      deluxe: "/hotels/wolbit-jeju/rooms/forest.jpg",
      premier: "/hotels/wolbit-jeju/rooms/stone.jpg",
      suite: "/hotels/wolbit-jeju/rooms/villa.jpg",
    },
  },
  mountain: {
    hero: "/hotels/seorak-sokcho/hero.jpg",
    gallery: [
      "/hotels/seorak-sokcho/gallery-1.jpg",
      "/hotels/seorak-sokcho/gallery-2.jpg",
      "/hotels/seorak-sokcho/gallery-3.jpg",
      "/hotels/seorak-sokcho/gallery-4.jpg",
    ],
    rooms: {
      deluxe: "/hotels/seorak-sokcho/rooms/mountain.jpg",
      premier: "/hotels/seorak-sokcho/rooms/ocean.jpg",
      suite: "/hotels/seorak-sokcho/rooms/dual.jpg",
    },
  },
  harbor: {
    hero: "/hotels/odong-yeosu/hero.jpg",
    gallery: [
      "/hotels/odong-yeosu/gallery-1.jpg",
      "/hotels/odong-yeosu/gallery-2.jpg",
      "/hotels/odong-yeosu/gallery-3.jpg",
      "/hotels/odong-yeosu/gallery-4.jpg",
    ],
    rooms: {
      deluxe: "/hotels/odong-yeosu/rooms/harbor.jpg",
      premier: "/hotels/odong-yeosu/rooms/loft.jpg",
      suite: "/hotels/odong-yeosu/rooms/night.jpg",
    },
  },
  wellness: {
    hero: "/hotels/gyeongpo-gangneung/hero.jpg",
    gallery: [
      "/hotels/gyeongpo-gangneung/gallery-1.jpg",
      "/hotels/gyeongpo-gangneung/gallery-2.jpg",
      "/hotels/gyeongpo-gangneung/gallery-3.jpg",
      "/hotels/gyeongpo-gangneung/gallery-4.jpg",
    ],
    rooms: {
      deluxe: "/hotels/gyeongpo-gangneung/rooms/pine.jpg",
      premier: "/hotels/gyeongpo-gangneung/rooms/lake.jpg",
      suite: "/hotels/gyeongpo-gangneung/rooms/wellness.jpg",
    },
  },
};

type PoolKey = keyof typeof POOLS;

type HotelSpec = Omit<Hotel, "heroImage" | "galleryImages"> & { pool: PoolKey };

const HOTEL_SPECS: HotelSpec[] = [
  // ═══ 수도권 10 ═══
  {
    id: "sowol-seoul",
    name: "소월 서울",
    nameEn: "Sowol Seoul",
    city: "서울",
    region: "수도권",
    grade: 5,
    pool: "urban",
    shortConcept: "남산 아래 도심 속 어반 생크추어리",
    description:
      "남산의 풍경을 고요히 맞이하는 도심의 안식처. 수공예 가구와 자연광이 어우러진 객실에서 서울의 스카이라인을 품에 안듯 바라봅니다. 모던 한식 미학과 유러피안 호스피탈리티가 교차하는 이곳에서 도시 속 또 하나의 정원을 경험하세요.",
    amenities: ["실내 수영장", "스파", "피트니스", "이그제큐티브 라운지", "루프탑 바", "24시간 룸서비스"],
    address: "서울특별시 중구 퇴계로 100",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-2-2230-3131",
  },
  {
    id: "yongsan-seoul",
    name: "용산 스테이",
    nameEn: "Yongsan Stay",
    city: "서울",
    region: "수도권",
    grade: 5,
    pool: "urban",
    shortConcept: "한강이 눈높이에서 흐르는 시티 리트리트",
    description:
      "용산의 모던한 스카이라인과 한강의 곡선을 동시에 담는 고층 호텔. 수평으로 뻗은 창과 수직의 건축이 만나는 자리에서, 도시가 쉬는 법을 새로 배웁니다. 라운지의 차 한 잔이 낮을 길게 만들어 줍니다.",
    amenities: ["한강뷰 라운지", "스파", "피트니스", "이그제큐티브 라운지", "주차", "24시간 룸서비스"],
    address: "서울특별시 용산구 한강대로 405",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-2-777-5000",
  },
  {
    id: "gangnam-seoul",
    name: "강남 메종",
    nameEn: "Gangnam Maison",
    city: "서울",
    region: "수도권",
    grade: 5,
    pool: "urban",
    shortConcept: "도산공원 옆 프라이빗 부티크 메종",
    description:
      "도산공원의 나지막한 나무 사이, 오직 스물네 개의 객실만 허락하는 도심 메종. 공간의 소리마저 디자인된 이곳은 비즈니스 게스트에게도, 서울의 밤을 남기고 싶은 연인에게도 조용히 기대는 자리가 됩니다.",
    amenities: ["프라이빗 라운지", "컨시어지", "피트니스", "발레파킹", "웰컴 드링크", "신문 서비스"],
    address: "서울특별시 강남구 도산대로 138",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    phone: "+82-2-540-3000",
  },
  {
    id: "seongsu-seoul",
    name: "성수 아틀리에",
    nameEn: "Seongsu Atelier",
    city: "서울",
    region: "수도권",
    grade: 4,
    pool: "urban",
    shortConcept: "붉은 벽돌과 공장 유리로 지은 아티스트 호텔",
    description:
      "성수의 붉은 벽돌과 철제 창틀을 그대로 남긴 공간. 낮에는 서울숲으로 이어지는 산책, 밤에는 로컬 카페와 갤러리. 머무는 동안 이 동네의 창작자가 된 듯한 착각을 주는 것이 이 호텔의 취향입니다.",
    amenities: ["아트 갤러리", "루프탑 바", "로컬 다이닝", "자전거 대여", "도서 라운지", "펫 동반 객실"],
    address: "서울특별시 성동구 연무장길 7",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-2-460-8000",
  },
  {
    id: "ikseon-seoul",
    name: "익선 한옥",
    nameEn: "Ikseon Hanok",
    city: "서울",
    region: "수도권",
    grade: 4,
    pool: "forest",
    shortConcept: "도심 한복판, 한옥 마당을 품은 부티크 스테이",
    description:
      "익선동 골목 깊숙이, 나무 기둥과 흙벽이 도시의 소리를 거르는 한옥 호텔. 마당의 돌 위에 떨어지는 빗소리, 처마 밑의 풍경 소리가 서울의 시계를 느리게 돌립니다. 아침은 한정식, 밤은 정원에서의 차 한 잔.",
    amenities: ["한옥 마당", "한정식 조식", "전통 다도", "한복 대여", "도보 관광 컨시어지", "웰컴 차"],
    address: "서울특별시 종로구 수표로28길 16",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-2-725-2000",
  },
  {
    id: "incheon-harbor",
    name: "인천 하버",
    nameEn: "Incheon Harbor",
    city: "인천",
    region: "수도권",
    grade: 4,
    pool: "harbor",
    shortConcept: "월미도 바다로 이어지는 하버 뷰 리조트",
    description:
      "서해의 노을이 객실 발코니에 오래 머무는 시간. 공항에서 15분 거리의 접근성을 지닌 이 호텔은, 한국의 첫 인상과 마지막 인사를 모두 맡기기에 알맞은 자리입니다.",
    amenities: ["하버뷰 객실", "공항 셔틀", "루프탑 바", "키즈 클럽", "피트니스", "실내 풀"],
    address: "인천광역시 중구 월미로 110",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-32-890-1000",
  },
  {
    id: "suwon-hwaseong",
    name: "수원 화성",
    nameEn: "Suwon Hwaseong",
    city: "수원",
    region: "수도권",
    grade: 4,
    pool: "forest",
    shortConcept: "화성 성곽이 창밖에 흐르는 헤리티지 호텔",
    description:
      "유네스코 세계문화유산 화성의 성곽과 나란히 선 호텔. 역사의 호흡을 느끼면서도 모던한 객실에서 편안히 머무는 두 결이 교차합니다. 저녁엔 성곽 야경이 로비의 벽을 대신합니다.",
    amenities: ["헤리티지 투어", "전통 조식", "피트니스", "실내 풀", "자전거 대여", "도서 라운지"],
    address: "경기도 수원시 팔달구 정조로 825",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-31-228-0000",
  },
  {
    id: "gapyeong-forest",
    name: "가평 숲빛",
    nameEn: "Gapyeong Forest",
    city: "가평",
    region: "수도권",
    grade: 4,
    pool: "forest",
    shortConcept: "자라섬을 내려다보는 숲 속 부티크",
    description:
      "자라섬의 물안개와 가평의 숲을 동시에 담은 부티크. 봄에는 야생화 산책로, 여름에는 강가 카약, 가을에는 단풍 드라이브, 겨울에는 난로와 책. 계절의 네 얼굴을 모두 머무름으로 수집합니다.",
    amenities: ["숲 산책로", "카약 액티비티", "스파", "바베큐 덱", "키즈 플레이룸", "피트니스"],
    address: "경기도 가평군 청평면 자라섬로 90",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-31-584-7000",
  },
  {
    id: "paju-book",
    name: "파주 북스테이",
    nameEn: "Paju Bookstay",
    city: "파주",
    region: "수도권",
    grade: 4,
    pool: "urban",
    shortConcept: "출판도시 한가운데, 책이 주인공인 호텔",
    description:
      "파주출판도시의 건축과 책이 교차하는 지점. 객실마다 큐레이션된 장서와, 로비의 거대한 서가가 하루를 채웁니다. 오후의 길어진 독서, 밤의 느린 생각. 책을 사랑하는 이를 위한 호텔입니다.",
    amenities: ["프라이빗 서재", "북 큐레이션", "조용한 라운지", "카페", "자전거 대여", "워크데스크"],
    address: "경기도 파주시 회동길 145",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-31-955-3000",
  },
  {
    id: "ganghwa-island",
    name: "강화 인셋",
    nameEn: "Ganghwa Inset",
    city: "강화",
    region: "수도권",
    grade: 4,
    pool: "wellness",
    shortConcept: "서해 갯벌이 내다보이는 힐링 웰니스",
    description:
      "강화도의 너른 갯벌과 노을이 창문의 액자 안에 담기는 자리. 사찰 명상 프로그램과 한방 스파가 고단한 일상을 느리게 풀어냅니다. 주말의 도심 탈출, 웰니스의 새 기준.",
    amenities: ["한방 스파", "사찰 명상", "로컬 식재 다이닝", "요가 스튜디오", "해변 산책", "실내 풀"],
    address: "인천광역시 강화군 길상면 해안남로 450",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-32-937-8000",
  },

  // ═══ 영남 5 ═══
  {
    id: "haeun-busan",
    name: "해운 부산",
    nameEn: "Haeun Busan",
    city: "부산",
    region: "영남",
    grade: 5,
    pool: "ocean",
    shortConcept: "광안리 파도를 창으로 들이는 오션사이드 리트리트",
    description:
      "광안대교의 야경과 파도 소리가 하루의 호흡을 맞추는 해운대의 새로운 기준. 바다를 향해 완전히 열린 객실은 수평선을 무대로, 파도를 음악으로 둡니다. 오션뷰 인피니티 풀과 해변을 직접 잇는 프라이빗 덱에서 진정한 휴식의 온도를 느껴보세요.",
    amenities: ["오션뷰 인피니티 풀", "스파", "비치 액세스", "루프탑 바", "피트니스", "키즈 클럽"],
    address: "부산광역시 해운대구 해운대해변로 264",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-51-749-2000",
  },
  {
    id: "gwangalli-busan",
    name: "광안 소도",
    nameEn: "Gwangan Sodo",
    city: "부산",
    region: "영남",
    grade: 4,
    pool: "ocean",
    shortConcept: "광안대교 불빛이 벽이 되는 미드센추리 호텔",
    description:
      "1960년대 건축의 결을 되살린 미드센추리 인테리어에, 광안대교 야경을 창으로 초대합니다. 모던과 클래식의 미세한 균형. 도시가 준비하는 밤의 색이 가장 먼저 도착하는 호텔.",
    amenities: ["루프탑 바", "재즈 라운지", "오션뷰 객실", "도서 라운지", "피트니스", "자전거 대여"],
    address: "부산광역시 수영구 광안해변로 219",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-51-754-2000",
  },
  {
    id: "dalmaji-busan",
    name: "달맞이 부티크",
    nameEn: "Dalmaji Boutique",
    city: "부산",
    region: "영남",
    grade: 4,
    pool: "ocean",
    shortConcept: "달맞이 언덕의 고요한 오션 뷰 부티크",
    description:
      "해운대의 번잡함에서 한 걸음 떨어진 달맞이 언덕. 작고 단정한 스물여섯 개의 객실에서 오직 바다와 나무만을 바라봅니다. 혼자 머물기에도, 둘이 머물기에도 알맞은 온도의 호텔입니다.",
    amenities: ["프라이빗 테라스", "스파", "로컬 다이닝", "북 컬렉션", "요가 매트", "웰컴 차"],
    address: "부산광역시 해운대구 달맞이길 140",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-51-747-8000",
  },
  {
    id: "gyeongju-heritage",
    name: "경주 유정",
    nameEn: "Gyeongju Yujeong",
    city: "경주",
    region: "영남",
    grade: 5,
    pool: "forest",
    shortConcept: "천년 고도, 왕릉과 나란한 헤리티지 호텔",
    description:
      "경주의 왕릉과 고분군이 조경의 일부가 되는 호텔. 돌담과 기와가 호텔의 축을 이루고, 로비를 지나면 천년의 시간이 복도를 따라 흐릅니다. 역사 위에서 맞는 아침이 특별합니다.",
    amenities: ["헤리티지 투어", "한정식", "한방 스파", "도보 관광", "전통 공연", "자전거 대여"],
    address: "경상북도 경주시 보문로 409",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-54-748-7000",
  },
  {
    id: "daegu-downtown",
    name: "대구 다운타운",
    nameEn: "Daegu Downtown",
    city: "대구",
    region: "영남",
    grade: 4,
    pool: "urban",
    shortConcept: "동성로 한복판, 비즈니스와 휴양의 교차점",
    description:
      "대구의 생활과 문화가 한자리에 모이는 동성로의 한가운데. 비즈니스 게스트의 워크데스크부터 주말 여행자의 루프탑 바까지, 도시의 모든 리듬을 한 호텔에서 담아냅니다.",
    amenities: ["루프탑 바", "비즈니스 센터", "피트니스", "세탁 서비스", "발레파킹", "24시간 룸서비스"],
    address: "대구광역시 중구 동성로 27",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    phone: "+82-53-420-9000",
  },

  // ═══ 호남 4 ═══
  {
    id: "odong-yeosu",
    name: "오동 여수",
    nameEn: "Odong Yeosu",
    city: "여수",
    region: "호남",
    grade: 4,
    pool: "harbor",
    shortConcept: "여수 밤바다를 파노라마로 여는 모던 부티크",
    description:
      "항구 도시 여수의 밤은 오래 빛납니다. 오동 여수는 그 밤을 객실의 주인공으로 삼습니다. 타일과 원목, 놋쇠가 조용히 교차하는 인테리어, 발코니 끝까지 내려앉는 바다의 조명. 작지만 섬세한 이 부티크 호텔은 '도시가 주는 낭만'을 기억하려는 이들을 위합니다.",
    amenities: ["루프탑 풀", "재즈 라운지", "로컬 다이닝", "자전거 대여", "하버 뷰 테라스", "도서 라운지"],
    address: "전라남도 여수시 돌산읍 평사리 1",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-61-660-5800",
  },
  {
    id: "jeonju-hanok",
    name: "전주 한옥채",
    nameEn: "Jeonju Hanokchae",
    city: "전주",
    region: "호남",
    grade: 5,
    pool: "forest",
    shortConcept: "전주 한옥마을의 기와 물결 위에 자리한 전통 스테이",
    description:
      "전주 한옥마을의 지붕들이 객실 창 너머로 물결처럼 펼쳐집니다. 목재의 향과 닥종이 창호의 결, 온돌에 누운 밤의 온기. 한국의 전통 숙박이 가진 정서를 가장 예민하게 담아낸 호텔입니다.",
    amenities: ["온돌 객실", "한정식", "전통 다도", "한복 대여", "전주 도보 투어", "정원 차실"],
    address: "전라북도 전주시 완산구 기린대로 99",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-63-232-7000",
  },
  {
    id: "boseong-tea",
    name: "보성 다원",
    nameEn: "Boseong Dawon",
    city: "보성",
    region: "호남",
    grade: 4,
    pool: "wellness",
    shortConcept: "녹차밭 능선 위, 티 웰니스 리트리트",
    description:
      "보성의 녹차밭이 산자락을 따라 파도처럼 흐르는 자리. 호텔의 모든 체험은 차로 시작해 차로 끝납니다. 티 스파, 티 테이스팅, 티 다이닝. 녹차의 쓴맛까지도 풍경의 일부가 됩니다.",
    amenities: ["녹차밭 산책", "티 스파", "티 클래스", "한방 다이닝", "요가 데크", "명상 공간"],
    address: "전라남도 보성군 회천면 녹차로 763",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-61-850-2000",
  },
  {
    id: "damyang-bamboo",
    name: "담양 죽림",
    nameEn: "Damyang Jungnim",
    city: "담양",
    region: "호남",
    grade: 4,
    pool: "forest",
    shortConcept: "죽녹원 대숲이 객실 창을 채우는 힐링 호텔",
    description:
      "담양의 대숲이 바람에 흔들릴 때, 객실의 장지문 너머로 초록빛 그림자가 춤춥니다. 대나무 숲의 소리는 명상의 언어가 되어, 도시에서 가져온 소음을 서서히 덜어내 줍니다.",
    amenities: ["대숲 산책로", "명상 공간", "로컬 다이닝", "요가 클래스", "자전거 투어", "티 라운지"],
    address: "전라남도 담양군 담양읍 죽녹원로 119",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-61-380-3000",
  },

  // ═══ 제주 5 ═══
  {
    id: "wolbit-jeju",
    name: "월빛 제주",
    nameEn: "Wolbit Jeju",
    city: "제주",
    region: "제주",
    grade: 5,
    pool: "forest",
    shortConcept: "한라산 숲에 숨은 돌과 바람의 하이드어웨이",
    description:
      "중산간 원시림 속, 현무암과 바람이 지은 은신처. 객실 창밖으로는 계절마다 바뀌는 숲의 색이, 욕실 너머로는 돌담 정원이 펼쳐집니다. 제주의 시간에 순응하는 건축, 느리게 걷는 식사, 깊이 잠드는 밤. 월빛 제주는 섬의 본질을 그대로 두고 담았습니다.",
    amenities: ["프라이빗 온천", "포레스트 스파", "로컬 파인다이닝", "승마 체험", "사이클링 루트", "요가 데크"],
    address: "제주특별자치도 서귀포시 표선면 가시리 산 1",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-64-735-5114",
  },
  {
    id: "seogwipo-cliff",
    name: "서귀포 클리프",
    nameEn: "Seogwipo Cliff",
    city: "서귀포",
    region: "제주",
    grade: 5,
    pool: "ocean",
    shortConcept: "해안 절벽 위 무릉도원의 오션뷰 리조트",
    description:
      "서귀포의 해안 절벽을 따라 설계된 객실은, 전면 유리 너머로 태평양의 수평선을 독점합니다. 아침에는 거문오름의 안개, 저녁에는 성산일출봉의 실루엣. 제주의 모든 방향이 한자리에 모입니다.",
    amenities: ["오션뷰 인피니티 풀", "스파", "프라이빗 비치 액세스", "파인 다이닝", "요가 데크", "선셋 바"],
    address: "제주특별자치도 서귀포시 중문관광로 72",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-64-735-8000",
  },
  {
    id: "jeju-hallim",
    name: "한림 포구",
    nameEn: "Hallim Pogu",
    city: "제주",
    region: "제주",
    grade: 4,
    pool: "harbor",
    shortConcept: "협재 바다 앞, 현지인의 리듬으로 머무는 스테이",
    description:
      "협재 해수욕장의 에메랄드빛 바다가 걸어서 2분 거리. 한림의 오일장과 작은 어촌, 노을의 비양도를 객실에서 모두 담아내는 캐주얼 부티크. 관광보다는 현지인의 하루를 살고 싶은 이에게.",
    amenities: ["비치 액세스", "자전거 대여", "로컬 카페", "해산물 조식", "요가 클래스", "서핑 강습"],
    address: "제주특별자치도 제주시 한림읍 협재리 1321",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-64-796-7000",
  },
  {
    id: "jeju-aewol",
    name: "애월 돌담",
    nameEn: "Aewol Dolam",
    city: "제주",
    region: "제주",
    grade: 4,
    pool: "wellness",
    shortConcept: "애월의 현무암 돌담 사이, 단독 풀 빌라 스테이",
    description:
      "애월 해안의 돌담과 동백이 경계를 이루는 단독 풀 빌라. 각 빌라엔 프라이빗 풀과 정원, 그리고 오션뷰. 가족 단위, 소규모 모임에 이상적인 자리. 제주의 부드러운 바람이 하루를 다정하게 감쌉니다.",
    amenities: ["프라이빗 풀", "바베큐 덱", "오션뷰 정원", "요가 매트", "키즈 어메니티", "웰컴 바구니"],
    address: "제주특별자치도 제주시 애월읍 애월해안로 562",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-64-799-2000",
  },
  {
    id: "jeju-city",
    name: "제주 시티",
    nameEn: "Jeju City",
    city: "제주",
    region: "제주",
    grade: 4,
    pool: "urban",
    shortConcept: "제주 국제공항 10분, 비즈니스 & 스탑오버 호텔",
    description:
      "제주의 관광과 도시 생활이 만나는 교차점. 공항에서 10분, 제주 시내의 문화와 음식이 10분. 짧은 출장부터 긴 여행의 시작까지, 제주의 모든 여정에 자연스럽게 녹아듭니다.",
    amenities: ["공항 셔틀", "비즈니스 센터", "피트니스", "루프탑 바", "발레파킹", "24시간 룸서비스"],
    address: "제주특별자치도 제주시 노형동 924",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    phone: "+82-64-740-9000",
  },

  // ═══ 강원 6 ═══
  {
    id: "seorak-sokcho",
    name: "설악 속초",
    nameEn: "Seorak Sokcho",
    city: "속초",
    region: "강원",
    grade: 4,
    pool: "mountain",
    shortConcept: "설악 능선과 동해를 동시에 품은 듀얼 뷰 리조트",
    description:
      "한쪽 창은 설악의 능선, 반대편 창은 동해의 수평선. 두 풍경을 한 객실에 담은 설계는 강원 해안의 지형이 준 선물입니다. 아침 산행 뒤 온천수 스파에서 하루를 녹이고, 저녁엔 장작 벽난로 앞에서 파도 소리를 듣는 시간. 사계가 뚜렷하게 머무는 리조트입니다.",
    amenities: ["온천 스파", "실내외 풀", "등산 컨시어지", "장작 라운지", "피트니스", "키즈 플레이룸"],
    address: "강원특별자치도 속초시 대포항길 45",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-33-635-8000",
  },
  {
    id: "gyeongpo-gangneung",
    name: "경포 강릉",
    nameEn: "Gyeongpo Gangneung",
    city: "강릉",
    region: "강원",
    grade: 4,
    pool: "wellness",
    shortConcept: "경포호와 송림 사이, 고요한 동해안 웰니스 휴양지",
    description:
      "송림 너머로 경포호의 수면이 아침을 밝히고, 바다는 저녁의 여운을 건넵니다. 경포 강릉은 자연의 두 얼굴이 만나는 자리에서 웰니스를 이야기합니다. 한방 허브를 활용한 스파, 지역 식재로 차린 테이블, 맨발로 걷는 송림 산책로. 깊이 쉬기 위한 모든 것이 여기 있습니다.",
    amenities: ["한방 웰니스 스파", "송림 산책로", "지역 식재 다이닝", "사이클 투어", "실내 풀", "요가 스튜디오"],
    address: "강원특별자치도 강릉시 경포로 365",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-33-640-6000",
  },
  {
    id: "pyeongchang-alpen",
    name: "평창 알펜",
    nameEn: "Pyeongchang Alpen",
    city: "평창",
    region: "강원",
    grade: 5,
    pool: "mountain",
    shortConcept: "대관령 능선 위, 알파인 럭셔리 리조트",
    description:
      "대관령의 고지대, 구름이 객실 아래로 흐르는 날이 자주 있습니다. 여름엔 야생화, 겨울엔 스키. 알파인 리조트의 전형을 한국의 산에서 구현한, 사계가 뚜렷한 럭셔리 리트리트입니다.",
    amenities: ["스키 인/아웃", "온천 스파", "인피니티 풀", "파인 다이닝", "승마 체험", "키즈 클럽"],
    address: "강원특별자치도 평창군 대관령면 올림픽로 715",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-33-335-7000",
  },
  {
    id: "yangyang-surf",
    name: "양양 서프",
    nameEn: "Yangyang Surf",
    city: "양양",
    region: "강원",
    grade: 4,
    pool: "ocean",
    shortConcept: "서퍼들의 동해, 라이프스타일 비치 호텔",
    description:
      "죽도 해변 앞, 보드랙과 루프탑 바가 만나는 라이프스타일 호텔. 아침엔 파도, 낮엔 해변, 밤엔 디제이 세트. 속초와 강릉 사이의 가장 젊은 해변에서 여름을 수집합니다.",
    amenities: ["서프보드 대여", "루프탑 바", "야외 샤워", "비치 액세스", "디제이 라운지", "자전거 대여"],
    address: "강원특별자치도 양양군 현남면 인구중앙길 22",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-33-670-5000",
  },
  {
    id: "donghae-cliff",
    name: "동해 절벽",
    nameEn: "Donghae Cliff",
    city: "동해",
    region: "강원",
    grade: 4,
    pool: "ocean",
    shortConcept: "추암 촛대바위를 마주 보는 드라마틱 클리프 호텔",
    description:
      "추암의 촛대바위와 수평선이 창의 프레임을 가득 채웁니다. 일출을 가장 먼저 맞는 동해안의 호텔. 극적인 자연과 조용한 건축이 만나는 자리에서, 여정의 전환점을 맞이해 보세요.",
    amenities: ["선라이즈 덱", "오션뷰 스파", "로컬 다이닝", "도서 라운지", "실내 풀", "자전거 대여"],
    address: "강원특별자치도 동해시 촛대바위길 31",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-33-530-7000",
  },
  {
    id: "chuncheon-lake",
    name: "춘천 호반",
    nameEn: "Chuncheon Hoban",
    city: "춘천",
    region: "강원",
    grade: 4,
    pool: "wellness",
    shortConcept: "의암호 물안개 사이, 호반의 조용한 리트리트",
    description:
      "의암호의 수면이 아침마다 물안개로 접히는 호반 호텔. 춘천의 느린 기운이 객실의 결마다 배어 있습니다. 책 한 권, 차 한 잔, 그리고 호수 위로 떨어지는 봄날의 빗소리.",
    amenities: ["호수뷰 라운지", "요가 데크", "자전거 트레일", "명상 공간", "로컬 다이닝", "카누 체험"],
    address: "강원특별자치도 춘천시 영서로 2854",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    phone: "+82-33-250-3000",
  },
];

/** Hotel-id → pool-key mapping (used by theme curation on the homepage). */
export const hotelPoolMap: Record<string, string> = Object.fromEntries(
  HOTEL_SPECS.map((s) => [s.id, s.pool]),
);

// Expand specs → full Hotel objects (pull images from the pool)
export const hotels: Hotel[] = HOTEL_SPECS.map((spec) => {
  const pool = POOLS[spec.pool];
  const { pool: _p, ...rest } = spec;
  return {
    ...rest,
    heroImage: pool.hero,
    galleryImages: [
      ...pool.gallery,
      pool.rooms.deluxe,
      pool.rooms.suite,
    ],
  };
});

// ──────────────────────────────────────────────────────────
// Rooms — 호텔당 최대 10개 객실.
// 기본 프리셋 3개 + 사이트 호텔용 확장 프리셋.
// Prices vary by region × grade so the demo has realistic diversity.
// ──────────────────────────────────────────────────────────

type PriceSet = {
  standard: number; deluxe: number; deluxe_twin: number;
  premier: number; premier_twin: number; family: number;
  junior_suite: number; suite: number;
};

const PRICE_MATRIX: Record<string, PriceSet> = {
  "수도권-5": { standard: 280000, deluxe: 380000, deluxe_twin: 400000, premier: 540000, premier_twin: 560000, family: 620000, junior_suite: 720000, suite: 920000 },
  "수도권-4": { standard: 180000, deluxe: 260000, deluxe_twin: 280000, premier: 380000, premier_twin: 400000, family: 440000, junior_suite: 500000, suite: 620000 },
  "영남-5": { standard: 320000, deluxe: 420000, deluxe_twin: 440000, premier: 600000, premier_twin: 620000, family: 680000, junior_suite: 780000, suite: 960000 },
  "영남-4": { standard: 200000, deluxe: 280000, deluxe_twin: 300000, premier: 400000, premier_twin: 420000, family: 460000, junior_suite: 520000, suite: 640000 },
  "호남-5": { standard: 260000, deluxe: 360000, deluxe_twin: 380000, premier: 520000, premier_twin: 540000, family: 600000, junior_suite: 700000, suite: 880000 },
  "호남-4": { standard: 160000, deluxe: 240000, deluxe_twin: 260000, premier: 360000, premier_twin: 380000, family: 420000, junior_suite: 460000, suite: 580000 },
  "제주-5": { standard: 360000, deluxe: 480000, deluxe_twin: 500000, premier: 680000, premier_twin: 700000, family: 780000, junior_suite: 900000, suite: 1180000 },
  "제주-4": { standard: 240000, deluxe: 320000, deluxe_twin: 340000, premier: 460000, premier_twin: 480000, family: 540000, junior_suite: 580000, suite: 720000 },
  "강원-5": { standard: 340000, deluxe: 460000, deluxe_twin: 480000, premier: 640000, premier_twin: 660000, family: 740000, junior_suite: 860000, suite: 1080000 },
  "강원-4": { standard: 180000, deluxe: 260000, deluxe_twin: 280000, premier: 380000, premier_twin: 400000, family: 440000, junior_suite: 500000, suite: 620000 },
};

type RoomPreset = {
  tier: Room["tier"];
  name: string;
  concept: string;
  sizeSqm: number;
  bedType: Room["bedType"];
  maxOccupancy: number;
  amenities: string[];
  priceKey: keyof PriceSet;
  imageKey: "deluxe" | "premier" | "suite";
};

/** 기본 3개 프리셋 — 모든 호텔 공통 */
const BASE_PRESETS: RoomPreset[] = [
  {
    tier: "DELUXE",
    name: "디럭스 룸",
    concept: "호텔의 시그니처 뷰를 정면에 두는 객실",
    sizeSqm: 38,
    bedType: "킹",
    maxOccupancy: 2,
    amenities: ["무료 Wi-Fi", "네스프레소", "욕조", "웰컴 어메니티"],
    priceKey: "deluxe",
    imageKey: "deluxe",
  },
  {
    tier: "PREMIER",
    name: "프리미어 룸",
    concept: "거실이 분리된 넉넉한 프리미어 공간",
    sizeSqm: 58,
    bedType: "킹",
    maxOccupancy: 3,
    amenities: ["거실 분리", "에스프레소 머신", "욕조", "레이트 체크아웃"],
    priceKey: "premier",
    imageKey: "premier",
  },
  {
    tier: "SIGNATURE",
    name: "시그니처 스위트",
    concept: "파노라마와 프라이버시가 만나는 최상위 스위트",
    sizeSqm: 96,
    bedType: "슈퍼킹",
    maxOccupancy: 4,
    amenities: ["프라이빗 버틀러", "다이닝·거실 분리", "욕조 & 샤워부스", "공항 리무진"],
    priceKey: "suite",
    imageKey: "suite",
  },
];

/** 사이트 호텔 전용 확장 프리셋 — 7개 (기본 3 + 추가 4) */
const SITE_HOTEL_PRESETS: RoomPreset[] = [
  {
    tier: "STANDARD",
    name: "스탠다드 룸",
    concept: "깔끔하고 기능적인 비즈니스 스테이",
    sizeSqm: 28,
    bedType: "더블",
    maxOccupancy: 2,
    amenities: ["무료 Wi-Fi", "미니바", "샤워부스", "워크데스크"],
    priceKey: "standard",
    imageKey: "deluxe",
  },
  {
    tier: "DELUXE",
    name: "디럭스 킹",
    concept: "호텔의 시그니처 뷰를 정면에 두는 객실",
    sizeSqm: 38,
    bedType: "킹",
    maxOccupancy: 2,
    amenities: ["무료 Wi-Fi", "네스프레소", "욕조", "웰컴 어메니티"],
    priceKey: "deluxe",
    imageKey: "deluxe",
  },
  {
    tier: "DELUXE_TWIN",
    name: "디럭스 트윈",
    concept: "두 개의 싱글베드로 자유롭게 구성한 디럭스",
    sizeSqm: 40,
    bedType: "트윈",
    maxOccupancy: 2,
    amenities: ["무료 Wi-Fi", "네스프레소", "욕조", "웰컴 어메니티"],
    priceKey: "deluxe_twin",
    imageKey: "deluxe",
  },
  {
    tier: "PREMIER",
    name: "프리미어 킹",
    concept: "거실이 분리된 넉넉한 프리미어 공간",
    sizeSqm: 58,
    bedType: "킹",
    maxOccupancy: 3,
    amenities: ["거실 분리", "에스프레소 머신", "욕조", "레이트 체크아웃"],
    priceKey: "premier",
    imageKey: "premier",
  },
  {
    tier: "FAMILY",
    name: "패밀리 스위트",
    concept: "아이와 함께하는 가족을 위한 넓은 공간",
    sizeSqm: 72,
    bedType: "킹",
    maxOccupancy: 4,
    amenities: ["키즈 어메니티", "거실 분리", "욕조", "미니 주방"],
    priceKey: "family",
    imageKey: "premier",
  },
  {
    tier: "JUNIOR_SUITE",
    name: "주니어 스위트",
    concept: "스위트의 여유를 합리적으로 누리는 선택",
    sizeSqm: 68,
    bedType: "킹",
    maxOccupancy: 3,
    amenities: ["거실·침실 분리", "에스프레소 머신", "욕조 & 샤워부스", "웰컴 과일"],
    priceKey: "junior_suite",
    imageKey: "suite",
  },
  {
    tier: "SIGNATURE",
    name: "시그니처 스위트",
    concept: "파노라마와 프라이버시가 만나는 최상위 스위트",
    sizeSqm: 96,
    bedType: "슈퍼킹",
    maxOccupancy: 4,
    amenities: ["프라이빗 버틀러", "다이닝·거실 분리", "욕조 & 샤워부스", "공항 리무진"],
    priceKey: "suite",
    imageKey: "suite",
  },
];

/** 호텔별 프리셋 오버라이드 맵 */
const HOTEL_ROOM_OVERRIDES: Record<string, RoomPreset[]> = {
  "sowol-seoul": SITE_HOTEL_PRESETS,
};

function viewForHotel(h: Hotel): Record<string, string> {
  const pool = HOTEL_SPECS.find((s) => s.id === h.id)!.pool;
  const byPool: Record<PoolKey, string> = {
    urban: "시티뷰",
    ocean: "오션뷰",
    forest: "포레스트뷰",
    mountain: "마운틴뷰",
    harbor: "하버뷰",
    wellness: "레이크뷰",
  };
  return { view: byPool[pool] };
}

export const rooms: Room[] = hotels.flatMap((h) => {
  const priceKey = `${h.region}-${h.grade}`;
  const prices = PRICE_MATRIX[priceKey] ?? PRICE_MATRIX["수도권-4"];
  const { view } = viewForHotel(h);
  const pool = POOLS[HOTEL_SPECS.find((s) => s.id === h.id)!.pool];
  const presets = HOTEL_ROOM_OVERRIDES[h.id] ?? BASE_PRESETS;

  return presets.map((preset, idx) => ({
    id: `${h.id}-${preset.tier.toLowerCase()}${presets.filter((p, j) => j < idx && p.tier === preset.tier).length > 0 ? `-${idx}` : ""}`,
    hotelId: h.id,
    name: preset.name,
    concept: preset.concept,
    sizeSqm: preset.sizeSqm,
    bedType: preset.bedType,
    view,
    images: [
      pool.rooms[preset.imageKey],
      pool.gallery[0],
      pool.gallery[1],
    ],
    amenities: preset.amenities,
    maxOccupancy: preset.maxOccupancy,
    basePrice: prices[preset.priceKey],
    currency: "KRW" as const,
    tier: preset.tier,
  }));
});

export function getHotel(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}

export function getHotelRooms(hotelId: string): Room[] {
  return rooms.filter((r) => r.hotelId === hotelId);
}

export function getRoom(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}

export const regions: Array<{ value: "전체" | import("./types").Region; label: string }> = [
  { value: "전체", label: "전체" },
  { value: "수도권", label: "수도권" },
  { value: "영남", label: "영남" },
  { value: "호남", label: "호남" },
  { value: "제주", label: "제주" },
  { value: "강원", label: "강원" },
];

export function getRegionCounts(): Record<string, number> {
  const counts: Record<string, number> = { 전체: hotels.length };
  for (const h of hotels) {
    counts[h.region] = (counts[h.region] ?? 0) + 1;
  }
  return counts;
}

// ──────────────────────────────────────────────────────────
// Single-hotel site mode
// ──────────────────────────────────────────────────────────
export const SITE_HOTEL_ID = "sowol-seoul";
export const siteHotel = getHotel(SITE_HOTEL_ID)!;
export const siteRooms = getHotelRooms(SITE_HOTEL_ID);
