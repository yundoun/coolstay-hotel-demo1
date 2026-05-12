# 꿀스테이 호텔 데모 — 아키텍처 가이드 (Ports & Adapters)

> 이 문서는 코드 품질 게이트 역할을 합니다.
> 하네스(hooks)가 편집 시 이 규칙을 자동으로 검증합니다.

---

## 1. Hexagonal Architecture 개요

```
          ┌──────────────────────────┐
          │       domain/            │  순수 타입·포트·유틸
          │  (외부 의존 0)           │  adapters/app/ui import 금지
          └────────────┬─────────────┘
                       │ implements
          ┌────────────▼─────────────┐
          │      adapters/           │  CoolStay PMS, 정적 데이터, Zustand
          │  (포트 구현체)           │  domain/ + 외부 라이브러리만 import
          └────────────┬─────────────┘
                       │ uses
          ┌────────────▼─────────────┐
          │    application/          │  훅·서비스가 어댑터를 조합
          │  (유스케이스 오케스트레이션)  │  domain/, adapters/ import
          └────────────┬─────────────┘
                       │ uses
          ┌────────────▼─────────────┐
          │        ui/               │  프레젠테이션 컴포넌트
          │   (props → JSX)          │  domain/(타입), application/(훅), ui/lib/
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
domain/                          ← 순수 타입·포트·유틸 (date-fns 허용)
  hotel/
    types.ts                     ← Hotel, Room, Region, Reservation
    ports.ts                     ← interface HotelProvider
  reservation/
    types.ts                     ← ApiRoomSelection, ReservationReadyParams, ReservationResult
    ports.ts                     ← interface RoomRepository, ReservationGateway
  content/
    types.ts                     ← SiteContent, AboutBlock
    ports.ts                     ← interface ContentProvider, StoreInfoRepository
  shared/
    utils.ts                     ← krw, formatKoDate, nightsBetween, todayISO, addDaysISO

adapters/                        ← 포트 구현 (교체 가능 단위)
  coolstay/
    client.ts                    ← getToken, getApiBase, fetchStoreDetail, MOTEL_KEY
    mappers.ts                   ← toApiRoom, toRoomType, parseExtras
    types.ts                     ← ApiRoom, RoomsResponse, StoreInfo, RoomType
  static/
    hotel-provider.ts            ← siteHotel, rooms[], getHotel, getRoom, SITE_HOTEL_ID
    content-provider.ts          ← siteContent 데이터
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
  api/store/rooms/route.ts       ← validate → adapter 호출 → respond
  api/store/info/route.ts
  api/reservation/ready/route.ts
```

---

## 3. 레이어 규칙

| 규칙 | 설명 |
|------|------|
| **H1** | `domain/`은 `adapters/`, `application/`, `ui/`, `app/`을 import할 수 없다. |
| **H2** | `adapters/`는 `domain/`과 외부 라이브러리만 import한다. |
| **H3** | `application/`은 `domain/`과 `adapters/`만 import한다. |
| **H4** | `ui/`는 `domain/`(타입), `application/`(훅), `ui/lib/`만 import한다. |
| **H5** | `ui/`는 `adapters/`를 직접 import할 수 없다. (Zustand store, static 예외) |
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

## 5. 포트 인터페이스

### `domain/reservation/ports.ts`
- `RoomRepository.fetchRooms(checkIn, checkOut)` — 날짜 기반 객실 조회
- `ReservationGateway.submitReservation(params)` — 예약 제출

### `domain/hotel/ports.ts`
- `HotelProvider` — getHotel, getRoom, getSiteHotel, getAllRooms

### `domain/content/ports.ts`
- `ContentProvider.getSiteContent()` — 사이트 콘텐츠 조회
- `StoreInfoRepository.fetchStoreInfo()` — 숙소 정보 조회

---

## 6. 커스텀 훅 계약

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

## 7. API Route 구조

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

## 8. 금지 패턴 (Anti-Patterns)

| 코드 | 이유 | 대안 |
|------|------|------|
| ui/ 내 `fetch()` | View와 IO 결합 | `application/hooks/`로 추출 |
| `s.apiMotelKey!` | 런타임 에러 위험 | `if (!s.apiRoom) return null` |
| domain/에서 adapters/ import | 의존성 역전 위반 | 포트 인터페이스 사용 |
| 동일 타입 재정의 | 드리프트 위험 | `import type { X } from "domain/"` |
| route.ts에서 30줄+ transform | 핸들러 비대화 | `adapters/coolstay/mappers.ts`에 추출 |
