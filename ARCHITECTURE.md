# 꿀스테이 호텔 데모 — 아키텍처 가이드 (템플릿 아키텍처)

> 이 문서는 코드 품질 게이트 역할을 합니다.
> 하네스(hooks)가 편집 시 이 규칙을 자동으로 검증합니다.

---

## 1. 템플릿 아키텍처 개요

이 프로젝트는 **하나의 코드베이스(템플릿)로 호텔 데이터만 교체하면서 여러 호텔 사이트를 양산**하는 구조입니다.

핵심 원칙: **"바뀌는 것"과 "바뀌지 않는 것"을 물리적으로 분리**

```
          ┌──────────────────────────┐
          │      hotel-data/         │  🔄 호텔별 교체 데이터 (단일 교체 경계)
          │  (domain/ 타입만 import)  │  Hotel, Room[], SiteContent
          └────────────┬─────────────┘
                       │ consumed by
          ┌────────────▼─────────────┐
          │       domain/            │  순수 타입·유틸
          │  (외부 의존 0)           │
          └────────────┬─────────────┘
                       │
          ┌────────────▼─────────────┐
          │      adapters/           │  CoolStay PMS, Zustand
          │  (외부 API 통합)         │  domain/, hotel-data/ import
          └────────────┬─────────────┘
                       │
          ┌────────────▼─────────────┐
          │    application/          │  훅·서비스 오케스트레이션
          │                          │  domain/, adapters/ import
          └────────────┬─────────────┘
                       │
          ┌────────────▼─────────────┐
          │        ui/               │  프레젠테이션 컴포넌트
          │   (props → JSX)          │  domain/, application/, hotel-data/, ui/lib/
          └────────────┬─────────────┘
                       │ composed by
          ┌────────────▼─────────────┐
          │        app/              │  Next.js 라우팅 (얇은 진입점)
          │  (routes + pages)        │  전체 import 허용
          └──────────────────────────┘
```

---

## 2. 디렉토리 구조

```
hotel-data/                      ← 🔄 호텔별 교체 데이터 (단일 교체 경계)
  hotel.ts                       ← Hotel 기본 정보, Room[], 가격, 이미지
  content.ts                     ← 인사말, 소개 블록, 찾아오는 길
  index.ts                       ← barrel re-export

domain/                          ← 순수 타입·유틸 (date-fns 허용)
  hotel/
    types.ts                     ← Hotel, Room
  reservation/
    types.ts                     ← ApiRoomSelection, ReservationReadyParams, ReservationResult
  content/
    types.ts                     ← SiteContent, AboutBlock
  shared/
    utils.ts                     ← krw, formatKoDate, nightsBetween, todayISO, addDaysISO

adapters/                        ← 외부 시스템 통합 (교체 불필요)
  coolstay/
    client.ts                    ← getToken, getApiBase, fetchStoreDetail (MOTEL_KEY는 환경변수)
    mappers.ts                   ← toApiRoom, toRoomType, parseExtras
    types.ts                     ← ApiRoom, RoomsResponse, StoreInfo, RoomType
  zustand/
    reservation-store.ts         ← Zustand persist store

application/                     ← 유스케이스 오케스트레이션
  hooks/
    useApiRooms.ts               ← 객실 조회 훅
    useSubmitReservation.ts      ← 예약 확정 훅
    useStoreInfo.ts              ← 숙소 정보 조회 훅
  services/
    reservation-api.ts           ← createGuestReservation (클라이언트 fetch)

ui/                              ← 프레젠테이션
  lib/cn.ts                      ← cn() (clsx + tailwind-merge)
  layout/                        ← 셸·크롬 (layout.tsx에서 렌더)
    site-header.tsx
    site-footer.tsx
    reservation-reset-guard.tsx
  shared/                        ← 크로스피처 UI 프리미티브
    reveal.tsx
    calendar-widget.tsx
    step-indicator.tsx
  home/                          ← 홈페이지 전용 섹션
    about-blocks.tsx
    api-room-tabs.tsx
    hero-booking-bar.tsx
  reservation/                   ← 예약 플로우 (자기 완결)
    onepage-reservation.tsx
    inline-reservation.tsx
    step-1-dates.tsx … step-4-review.tsx
    complete-client.tsx

app/                             ← Next.js 라우팅 (얇은 진입점)
  page.tsx, layout.tsx, globals.css
  reservation/page.tsx
  reservation/complete/page.tsx
  api/store/rooms/route.ts
  api/store/info/route.ts
  api/reservation/ready/route.ts
```

---

## 3. 레이어 규칙

| 규칙 | 설명 |
|------|------|
| **H1** | `domain/`은 `adapters/`, `application/`, `ui/`, `app/`, `hotel-data/`를 import할 수 없다. |
| **H2** | `adapters/`는 `domain/`, `hotel-data/`와 외부 라이브러리만 import한다. |
| **H3** | `application/`은 `domain/`과 `adapters/`만 import한다. |
| **H4** | `ui/`는 `domain/`(타입), `application/`(훅), `hotel-data/`(데이터), `ui/lib/`만 import한다. |
| **H5** | `ui/`는 `adapters/`를 직접 import할 수 없다. (Zustand store 예외) |
| **H6** | `hotel-data/`는 `domain/`만 import할 수 있다. |
| **R1** | `ui/` 컴포넌트에 `fetch` 금지 — 데이터 페칭은 `application/hooks/`를 거친다. |
| **R4** | `ui/`에서 타입 재정의 금지 — `domain/` 또는 `adapters/` 타입을 `import type`으로 소비. |
| **S1** | flat api 필드 사용 금지 — `apiRoom` 단일 객체로 접근. |
| **S3** | Store 값에 non-null assertion(`!`) 금지 — guard 또는 early return으로 처리. |

---

## 4. 상태 관리 구조

```
useReservation (Zustand + sessionStorage persist)  ← adapters/zustand/reservation-store.ts
├── dates     : { checkIn, checkOut }
├── guests    : { adults, children }
├── hotel     : { hotelId, roomId }
├── apiRoom   : ApiRoomSelection | null   ← 단일 nullable 객체
├── guest     : { guestName, guestPhone, guestEmail, guestRequests }
└── outcome   : { reservationNumber }
```

---

## 5. 커스텀 훅 계약

### `useApiRooms(checkIn, checkOut, nights)`
- **반환**: `{ storeData, loading, error }`
- **위치**: `application/hooks/useApiRooms.ts`

### `useSubmitReservation()`
- **반환**: `{ submit, submitting, error, canSubmit }`
- **위치**: `application/hooks/useSubmitReservation.ts`

### `useStoreInfo()`
- **반환**: `{ data, loading }`
- **위치**: `application/hooks/useStoreInfo.ts`

---

## 6. API Route 구조

```typescript
// app/api/example/route.ts — thin handler
import { NextResponse } from "next/server";
import { fetchStoreDetail } from "@/adapters/coolstay/client";
import { toApiRoom } from "@/adapters/coolstay/mappers";

export async function GET(request: Request) {
  // 1. Validate params
  // 2. Call adapter
  // 3. Return response
}
```

---

## 7. 금지 패턴 (Anti-Patterns)

| 코드 | 이유 | 대안 |
|------|------|------|
| ui/ 내 `fetch()` | View와 IO 결합 | `application/hooks/`로 추출 |
| `s.apiMotelKey!` | 런타임 에러 위험 | `if (!s.apiRoom) return null` |
| domain/에서 adapters/ import | 의존성 역전 위반 | domain 타입 사용 |
| 동일 타입 재정의 | 드리프트 위험 | `import type { X } from "domain/"` |
| route.ts에서 30줄+ transform | 핸들러 비대화 | `adapters/coolstay/mappers.ts`에 추출 |
| hotel-data/에서 adapters/ import | 교체 경계 오염 | domain/ 타입만 import |

---

## 8. 새 호텔 배포 가이드

새 호텔 사이트를 만들 때 **`hotel-data/` 폴더와 환경변수만 교체**하면 됩니다.

### Step 1: 호텔 데이터 교체

`hotel-data/hotel.ts`를 새 호텔 정보로 교체:

```typescript
import type { Hotel, Room } from "@/domain/hotel/types";

export const SITE_HOTEL_ID = "new-hotel-id";

export const siteHotel: Hotel = {
  id: SITE_HOTEL_ID,
  name: "새 호텔명",
  nameEn: "New Hotel Name",
  // ... Hotel 타입의 모든 필드 채우기
};

export const rooms: Room[] = [
  // ... Room 타입의 객실 데이터
];

export function getHotel(id: string): Hotel | undefined { ... }
export function getRoom(id: string): Room | undefined { ... }
```

### Step 2: 콘텐츠 교체

`hotel-data/content.ts`를 새 콘텐츠로 교체:

```typescript
import type { SiteContent } from "@/domain/content/types";

export const siteContent: SiteContent = {
  greeting: { ... },
  about: [ ... ],
  directions: { ... },
};
```

### Step 3: 이미지 교체

`public/hotels/<hotel-id>/` 디렉토리에 이미지 배치:
- `hero.jpg` — 히어로 이미지
- `gallery-*.jpg` — 갤러리 이미지
- `rooms/*.jpg` — 객실 이미지

### Step 4: 환경변수 설정

```env
COOLSTAY_API_BASE=http://dev.server.coolstay.co.kr:10000
COOLSTAY_MOTEL_KEY=<새 호텔의 CoolStay PMS 키>
```

### 검증

- `npx tsc --noEmit` — Hotel, Room, SiteContent 타입 필드 누락 시 컴파일 에러
- `npm run dev` — 브라우저에서 호텔명, 객실, 예약 플로우 확인

---

## 9. 데이터 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT CONFIG                         │
│  .env.local: COOLSTAY_API_BASE, COOLSTAY_MOTEL_KEY           │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    hotel-data/   (SWAP THIS)                 │
│  hotel.ts : siteHotel, rooms[], SITE_HOTEL_ID                │
│  content.ts : siteContent (greeting, about, directions)      │
│  + public/hotels/<slug>/  (images)                           │
└──────┬──────────────────────────────┬───────────────────────┘
       │                              │
       ▼                              ▼
  ┌──────────┐                 ┌──────────────┐
  │   ui/    │                 │  adapters/   │
  │  header  │ ◄── siteHotel   │  zustand/   │ ◄── SITE_HOTEL_ID
  │  footer  │     .name       │  coolstay/  │ ◄── MOTEL_KEY (env)
  │  home/   │                 └──────┬───────┘
  └────┬─────┘                        │
       │                              ▼
       │                     ┌────────────────┐
       │                     │ application/   │
       │                     │ hooks/services │
       └─────────────────────┴────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │     app/       │
              │  pages/routes  │
              └────────────────┘
```
