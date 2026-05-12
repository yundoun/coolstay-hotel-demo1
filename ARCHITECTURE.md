# 꿀스테이 호텔 데모 — 아키텍처 가이드

> 이 문서는 코드 품질 게이트 역할을 합니다.
> 하네스(hooks)가 편집 시 이 규칙을 자동으로 검증합니다.

---

## 1. 디렉토리 구조

```
components/
  layout/                  ← 셸·크롬 (layout.tsx에서 렌더)
    site-header.tsx
    site-footer.tsx
    reservation-reset-guard.tsx
  shared/                  ← 크로스피처 UI 프리미티브
    reveal.tsx
    calendar-widget.tsx
    step-indicator.tsx
  home/                    ← 홈페이지 전용 섹션
    about-blocks.tsx
    api-room-tabs.tsx
    hero-booking-bar.tsx
  reservation/             ← 예약 플로우 (자기 완결)
    onepage-reservation.tsx
    inline-reservation.tsx
    step-1-dates.tsx … step-4-review.tsx
    complete-client.tsx

lib/
  types.ts                 ← 프로젝트 공통 도메인 타입
  utils.ts                 ← 프로젝트 공통 유틸 (date, currency, cn)
  hotels.ts                ← 싱글 호텔 데이터 + getHotel/getRoom
  content/                 ← 사이트 콘텐츠 도메인
    site-content.ts
    useStoreInfo.ts
  reservation/             ← 예약 도메인 (상태 + API + 훅)
    store.ts
    api.ts
    useApiRooms.ts
    useSubmitReservation.ts

app/api/
  store/                   ← CoolStay upstream 프록시
    _lib.ts
    info/route.ts
    rooms/route.ts
  reservation/
    ready/route.ts
```

---

## 2. 레이어 경계

```
┌─────────────────────────────────────────────┐
│  app/page.tsx, app/layout.tsx               │  Page — 조합만, 로직 없음
├─────────────────────────────────────────────┤
│  components/{layout,shared,home,reservation}│  View — props → JSX
├─────────────────────────────────────────────┤
│  lib/*/use*.ts                              │  Hook — fetch·mutation 캡슐화
├─────────────────────────────────────────────┤
│  lib/reservation/store.ts                   │  Store — 상태 + 순수 액션
├─────────────────────────────────────────────┤
│  lib/*.ts (utils, types, hotels)            │  Domain — 순수 함수·타입·데이터
├─────────────────────────────────────────────┤
│  app/api/**/route.ts                        │  API Route — validate → delegate → respond
│  app/api/**/_lib.ts                         │  API Lib — transform·파싱 로직
└─────────────────────────────────────────────┘
```

### 레이어 규칙

| 규칙 | 설명 |
|------|------|
| **R1** | **컴포넌트에 `fetch` 금지** — 데이터 페칭은 도메인별 커스텀 훅을 거친다. |
| **R2** | **API route에 transform 로직 금지** — 파싱/매핑은 `_lib.ts`에 추출. route 핸들러는 `validate → delegate → respond` 3단계만. |
| **R3** | **Store는 순수 액션만** — 비동기 호출, 라우팅, side-effect 금지. |
| **R4** | **타입은 발행처에서 export** — API 응답 타입은 route에서 정의·export, 컴포넌트는 `import type`으로 소비. 재정의 금지. |
| **R5** | **단일 책임** — 한 파일의 cyclomatic complexity ≤ 4. CRAP(테스트 0%) 기준 ≤ 20, 목표 ≤ 5. |

---

## 3. 상태 관리 구조

```
useReservation (Zustand + sessionStorage persist)  ← lib/reservation/store.ts
├── dates     : { checkIn, checkOut }
├── guests    : { adults, children }
├── hotel     : { hotelId, roomId }
├── apiRoom   : ApiRoomSelection | null   ← 단일 nullable 객체
├── guest     : { guestName, guestPhone, guestEmail, guestRequests }
└── outcome   : { reservationNumber }
```

### Store 규칙

| 규칙 | 설명 |
|------|------|
| **S1** | **Flat 필드 대신 도메인 객체 사용** — 관련 필드는 하나의 nullable 객체로 묶는다. |
| **S2** | **INITIAL_STATE 상수화** — `reset()`은 스프레드로 초기값을 참조한다. 값 중복 금지. |
| **S3** | **Non-null assertion(`!`) 금지** — Store 값 사용 시 가드 또는 early return으로 처리. |

---

## 4. 파일 명명·배치 규칙

| 패턴 | 위치 | 예시 |
|------|------|------|
| `use*.ts` (예약) | `lib/reservation/` | `useApiRooms.ts`, `useSubmitReservation.ts` |
| `use*.ts` (콘텐츠) | `lib/content/` | `useStoreInfo.ts` |
| `store.ts` | `lib/reservation/` | 예약 Zustand store |
| `api.ts` | `lib/reservation/` | 예약 API 클라이언트 |
| `step-*.tsx` | `components/reservation/` | `step-2-hotel.tsx` |
| `_lib.ts` | `app/api/**/` | `app/api/store/_lib.ts` |
| `route.ts` | `app/api/**/` | `app/api/store/rooms/route.ts` |

### 배치 원칙

- **훅은 소비하는 도메인에 co-locate** — 예약 전용 훅은 `lib/reservation/`, 콘텐츠 전용 훅은 `lib/content/`
- **크로스커팅 파일은 `lib/` 루트** — `types.ts`, `utils.ts`, `hotels.ts`
- **컴포넌트는 기능 기반 그룹** — `layout/`, `shared/`, `home/`, `reservation/`

---

## 5. 금지 패턴 (Anti-Patterns)

| 코드 | 이유 | 대안 |
|------|------|------|
| 컴포넌트 내 `fetch()` / `useEffect` + fetch | View와 IO 결합 | 도메인 훅으로 추출 |
| `s.apiMotelKey!` (non-null assertion) | 런타임 에러 위험 | `if (!s.apiRoom) return null` |
| Store에 flat api* 필드 | God-store, reset 중복 | `apiRoom` 단일 객체 |
| 동일 타입 재정의 | 드리프트 위험 | `import type { X } from "route"` |
| route.ts에서 30줄+ transform | 핸들러 비대화 | `_lib.ts`에 파서 함수 추출 |

---

## 6. 커스텀 훅 계약

### `useApiRooms(checkIn, checkOut, nights)`
- **반환**: `{ storeData, loading, error }`
- **책임**: fetch + abort + 에러 핸들링
- **위치**: `lib/reservation/useApiRooms.ts`

### `useSubmitReservation()`
- **반환**: `{ submit, submitting, error, canSubmit }`
- **책임**: store 검증 → API 호출 → 라우팅
- **위치**: `lib/reservation/useSubmitReservation.ts`

### `useStoreInfo()`
- **반환**: `{ data, loading }`
- **책임**: 숙소 기본 정보 조회 (홈페이지용)
- **위치**: `lib/content/useStoreInfo.ts`

---

## 7. API Route 구조 템플릿

```typescript
// app/api/example/route.ts
import { NextResponse } from "next/server";
import { parseX, transformY } from "./_lib";  // transform은 _lib에

export type ResponseType = { ... };  // 타입은 여기서 export

export async function GET(request: Request) {
  // 1. Validate
  // 2. Delegate
  // 3. Respond
}
```
