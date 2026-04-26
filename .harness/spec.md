# CoolStay Hotel Demo — Product Specification

**Version**: 1.0 (Planner output)
**Target**: B2B sales demo for hotel-only partners of 꿀스테이 (CoolStay)
**Stack posture**: Next.js App Router, TypeScript, Tailwind, mock data only (Generator decides exact libs)

---

## 1. Product Overview

꿀스테이(CoolStay)는 다업종 숙박 애그리게이터로서, 이번 데모는 **호텔 파트너 전용 B2B 영업 도구**다. 목적은 단 하나: 기존 호텔 파트너와 신규 유치 대상 호텔 총지배인/마케팅 실장에게 "CoolStay 플랫폼에 입점해도 당신의 브랜드 톤이 훼손되지 않는다"를 증명하는 것. 일반 예약 엔진이 주는 "가격 비교 사이트 특유의 싸구려 느낌"이 이 데모의 최대 적(敵)이다. 따라서 이 프로덕트는 예약 기능을 내장한 **브랜드 쇼케이스**로 설계된다.

내러티브는 "신라·롯데·조선팰리스 수준의 럭셔리 프레젠테이션을 우리 플랫폼에서 구현할 수 있다"다. Shilla Hotels 공식 사이트가 레퍼런스다 — 풀블리드 히어로, 이미지 중심(시각 비중 70%), 요금은 예약 단계에서만 노출, Serif+Sans 타이포그래피, 여백 활용, 절제된 모션. 꿀스테이 브랜드 컬러인 허니 옐로우(#FFC600)는 CTA와 활성 상태에만 사용되어 "럭셔리 호텔이 먼저, CoolStay는 그 다음"이라는 위계를 유지한다.

세일즈 미팅 시나리오: 영업 담당이 노트북을 열고 홈 → 호텔 상세 → 예약 완료까지 2분 이내로 시연한다. 파트너사는 "아, 우리 호텔도 이렇게 보일 수 있구나"를 느껴야 한다. 따라서 데모는 **완결된 플로우 1개**만 가지되, 각 페이지의 시각적 완성도는 실제 런칭 수준이어야 한다. 데이터는 모두 목업, 로그인/멤버십/다이닝/리뷰는 전부 out-of-scope.

---

## 2. User Stories

**Landing visitor**
- As a guest, I want to feel the brand's luxury tone within 2 seconds of landing, so I trust this is a premium property platform.
- As a guest, I want to immediately see a curated selection of hotels without searching, so I can browse inspirationally.
- As a guest, I want a persistent way to jump into the reservation widget, so I never feel "lost" from the booking intent.

**Hotel browsing (`/hotels`)**
- As a guest, I want to scan all 6 partner hotels in a clean gallery grid, so I can pick by region or vibe.
- As a guest, I want each hotel card to show a hero image, name, city, and one-line concept — but NOT the price — so the browsing experience feels like a magazine, not a marketplace.
- As a guest, I want to filter/sort by region, so I can narrow choices.

**Hotel detail (`/hotels/[id]`)**
- As a guest, I want a full-bleed hero image of the property, so the venue makes a strong first impression.
- As a guest, I want to read a concise concept narrative (2-3 paragraphs), see amenities, see 3-5 room types with tall vertical imagery, and view a gallery, so I understand the property holistically.
- As a guest, I want address, check-in/out times, and phone visible in a dedicated info section, so practical details are handy.
- As a guest, I want a clear "예약하기" CTA tied to a specific room, so intent converts to action.

**Reservation (`/reservation` — 4 steps)**
- As a guest, I want a 4-step reservation flow with a visible progress indicator, so I know where I am.
- As a guest, I want to select dates + guest count (Step 1), so my search is scoped.
- As a guest, I want to see available rooms with price revealed for the first time (Step 2), so pricing is contextualized to my dates.
- As a guest, I want to enter guest info and special requests (Step 3), so the reservation is personalized.
- As a guest, I want to review a summary and confirm (Step 4), so I commit consciously.

**Confirmation (`/reservation/complete`)**
- As a guest, I want a reservation number, full summary of my booking, and next-step guidance, so I feel assured.
- As a guest, I want a "홈으로" link and a "예약 내역 저장" affordance (local, no auth), so I can exit gracefully.

---

## 3. Information Architecture

### 3.1 Sitemap

```
/                              Home (brand + featured hotels + reservation entry)
├── /hotels                    Hotels list (6 properties, filterable by region)
├── /hotels/[id]               Hotel detail (hero, concept, rooms, amenities, gallery, location)
├── /reservation               Reservation flow (step=1..4, query-driven)
│   ├── ?step=1                Dates + guests
│   ├── ?step=2                Hotel + room selection (price revealed here)
│   ├── ?step=3                Guest info + requests
│   └── ?step=4                Review + confirm
└── /reservation/complete      Confirmation
```

### 3.2 Navigation model

- **Top GNB**: logo (left, links to `/`) + two nav items (right): **호텔소개** (→ `/hotels`), **예약** (→ `/reservation?step=1`).
- GNB is fixed to top on all pages. On home, GNB is transparent over hero and transitions to solid white once user scrolls past 80vh.
- No footer nav — just a minimal footer with logo, copyright, and a single phone/email line.
- No sidebar, no drawer, no hamburger on desktop. (Mobile is nice-to-have but desktop-first for demo.)

### 3.3 Reservation flow — inputs & outputs

| Step | Title | Inputs (user supplies) | Outputs (carried forward) |
|------|-------|------------------------|---------------------------|
| 1 | 일정 선택 | checkIn (date), checkOut (date), adults (1-4), children (0-3) | dates + guests object |
| 2 | 객실 선택 | hotelId (pre-filled if arrived from detail page), roomId | selected room + computed totalPrice (nights × basePrice). **Price first visible here.** |
| 3 | 투숙객 정보 | name, phone, email, requests (optional textarea) | guest info object |
| 4 | 예약 확인 | (read-only review; consent checkbox) | final reservation payload |
| → complete | 예약 완료 | — | generated reservationNumber (e.g., `CS-20260423-A7F2`) |

Step state is persisted in URL query + sessionStorage so back button works. If user jumps to step N without required prior data, redirect to earliest missing step.

---

## 4. Design Language

> This section is deliberately opinionated. The Generator MUST treat these as rules, not suggestions.

### 4.1 Color system

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background (base) | `bg-primary` | `#FFFFFF` | Page background — dominant surface |
| Background (subtle tint) | `bg-subtle` | `#FAFAF7` | Only for alternating section bands, sparingly; warm off-white, NOT cool gray |
| Text primary | `text-primary` | `#0A0A0A` | Headlines, body |
| Text secondary | `text-secondary` | `#6B6B6B` | Captions, metadata, labels |
| Text tertiary | `text-tertiary` | `#A3A3A3` | Disabled, placeholder |
| Border (hairline) | `border-hairline` | `#E8E6E1` | 1px dividers, input borders — warm neutral, not `#E5E7EB` slate |
| Honey Yellow (CTA) | `accent` | `#FFC600` | Primary button bg, active step indicator, focus ring |
| Honey Yellow (hover) | `accent-hover` | `#E6B200` | CTA hover state |
| Honey Yellow (subtle tint) | `accent-tint` | `#FFF8E0` | 허용 사용처: 활성 스텝 텍스트 배경 하이라이트 1개소, 그 외 금지 |
| Near-black (CTA text on yellow) | `on-accent` | `#0A0A0A` | Text on Honey Yellow buttons — NOT white |

**Honey Yellow usage rules (strict)**:
- ✅ Primary CTA button background (`예약하기`, `다음`, `확인`)
- ✅ Active state on step indicator (filled circle)
- ✅ Focus ring on interactive elements (2px outline)
- ✅ Underline on active nav item (2px underline, 8px below text)
- ❌ Section backgrounds
- ❌ Card backgrounds
- ❌ Large decorative shapes
- ❌ Gradients of any kind
- ❌ Icon fills (icons are monochrome `#0A0A0A` or `#6B6B6B`)

**Forbidden patterns (AI-slop detectors)**:
- NO purple, indigo, or teal gradients anywhere
- NO drop shadows under white cards (no `shadow-lg`, no `shadow-xl`)
- NO glassmorphism (`backdrop-blur` is forbidden except optionally on the hero GNB before scroll)
- NO emoji icons (use lucide-react or similar monochrome line icons, stroke 1.5px)
- NO "Get Started" / "Learn More" style generic CTA — use specific Korean verbs (`예약하기`, `객실 보기`)
- NO center-aligned body paragraphs (left-align everything longer than 1 line)
- NO overly rounded corners everywhere (see 4.6)

### 4.2 Typography

**Font stack**
- Serif display (EN): **Playfair Display** (weights 400, 500, 700) — for large hero numbers, English property names if any
- Serif Korean: **Noto Serif KR** (weights 400, 500, 700) — for all Korean headlines, section titles, hotel names
- Sans body: **Pretendard** (weights 400, 500, 600) — for body text, UI labels, buttons

**Rule**: Korean headlines use Noto Serif KR, never Pretendard. Body copy always Pretendard. Playfair Display reserved for hero display numerals (e.g., "06 Properties", "2026") and the occasional English accent — not for Korean.

**Type scale** (desktop)

| Token | Font | Size | Line-height | Weight | Letter-spacing | Usage |
|-------|------|------|-------------|--------|----------------|-------|
| `display` | Noto Serif KR / Playfair | 88px | 1.05 | 500 | -0.02em (tight) | Home hero headline |
| `h1` | Noto Serif KR | 56px | 1.15 | 500 | -0.01em | Hotel detail hero title |
| `h2` | Noto Serif KR | 40px | 1.2 | 500 | -0.01em | Section titles |
| `h3` | Noto Serif KR | 28px | 1.3 | 500 | 0 | Subsection, card titles |
| `h4` | Pretendard | 20px | 1.4 | 600 | 0 | Room card title, form section |
| `body-lg` | Pretendard | 18px | 1.7 | 400 | 0 | Lead paragraphs |
| `body` | Pretendard | 16px | 1.7 | 400 | 0 | Default body |
| `body-sm` | Pretendard | 14px | 1.6 | 400 | 0 | Secondary text |
| `caption` | Pretendard | 13px | 1.5 | 500 | 0.02em | Metadata |
| `label-caps` | Pretendard | 12px | 1.4 | 500 | **0.14em (wide)** | Eyebrow labels (e.g., `SUITE`, `DELUXE`) — ALL CAPS |
| `button` | Pretendard | 15px | 1 | 600 | 0.02em | CTA text |

**Letter-spacing principles**:
- Large Serif headlines: tight tracking (-0.01 to -0.02em) — feels editorial
- Small caps labels: wide tracking (0.12-0.16em) — feels couture
- Body: default (0em)

### 4.3 Layout & Spacing

**Grid base**: 8px. All spacing is a multiple of 8 (occasionally 4 for hairline adjustments).

**Container**
- Max content width: **1280px**
- Horizontal page margin: `clamp(24px, 4vw, 64px)` on either side
- Full-bleed sections (hero, image bands) extend to viewport edges; only content within honors max-width

**Section padding (vertical)**
- Hero section: `min-height: 88vh` on home, `72vh` on hotel detail
- Default section: `py-[120px]` (desktop), `py-[80px]` (tablet)
- Compact section: `py-[80px]`
- Between subsections within a section: `my-[64px]`

**Whitespace is a feature**, not an absence. A section heading sits with 64px breathing room above it and 48px below before content begins. Do not collapse these.

**Grid systems**
- Hotel cards on `/hotels`: 3-column grid, gap `32px` horizontal, `80px` vertical (tall vertical gap to let images breathe)
- Room cards on detail: 2-column grid, gap `40px`
- Gallery: asymmetric 12-column grid (mix 6+6, 8+4, 4+4+4 rhythms — NOT a uniform 4×4 tile wall)

### 4.4 Imagery philosophy

**70% visual weight**: On any given page above the fold, imagery should account for roughly 70% of visual mass. Text is the minority, whitespace the connector.

**Aspect ratios**
- Hero (full-bleed, home & detail): `21:9` cinematic OR `16:9` depending on composition — NEVER `1:1` or taller for hero
- Hotel list cards: **`3:4` portrait** (tall, magazine-like)
- Room cards: **`4:5` portrait**
- Gallery tiles: mix `1:1`, `3:4`, `16:9` for rhythm
- Thumbnail/inline: `16:9`

**Treatment**
- NO filters (no sepia, no duotone, no desaturation)
- NO color overlays tinting images
- NO borders around images (use whitespace separation)
- The ONLY overlay permitted: a subtle bottom-gradient on hero for text legibility — `linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 40%)`. No full-frame black wash.
- Corner radius on images: `0px` (sharp) OR `2px` (minimal). Never `rounded-xl` or larger on hero/editorial images. Small UI thumbnails (e.g., step review) may use `4px`.

**Sourcing**: Generator should use Unsplash or similar with curated hotel/interior/landscape photography. Queries should target: luxury hotel rooms, Korean coastal properties, Jeju nature, urban skyline suites, traditional hanok-modern fusion, onsen/spa interiors.

### 4.5 Motion

Restrained. Every animation should feel like the site is breathing, not performing.

| Interaction | Animation | Duration | Easing |
|-------------|-----------|----------|--------|
| Section enter (on scroll) | fade + translateY(12px → 0) | 400ms | `ease-out` |
| Image hover (card) | scale 1.0 → 1.03 | 500ms | `ease-out` |
| Button hover | bg-color transition | 180ms | `ease-out` |
| Underline reveal (nav) | width 0 → 100% | 240ms | `ease-out` |
| Step transition (reservation) | crossfade | 280ms | `ease-in-out` |
| GNB background (scroll past 80vh) | bg + border-bottom fade | 240ms | `ease-out` |

**Forbidden motion**:
- Parallax (except potentially a subtle 0.85x background shift on the home hero — optional)
- Bouncy springs (`overshoot`, `bounce`, `elastic`)
- Page-wide slide transitions
- Typewriter/letter-by-letter text reveals
- Marquee/infinite scrollers
- Cursor follower effects

### 4.6 Corner radius & borders

**Corner radius scale**
- `0px`: Hero images, full-bleed sections
- `2px`: Editorial imagery, cards (default)
- `4px`: Inputs, small thumbnails
- `9999px` (pill): ONLY on small filter chips and the step-indicator dots
- NEVER `rounded-2xl`, `rounded-3xl`, `rounded-full` on buttons or cards

**Borders**
- Default: `1px solid #E8E6E1` (warm hairline)
- Never heavier than 1px for structural borders
- 2px only appears on: focus ring (yellow), active nav underline, active step indicator

**Shadows**
- Forbidden on cards
- Allowed ONLY on:
  - GNB after scroll: `0 1px 0 rgba(232, 230, 225, 1)` (effectively a border-bottom, not a shadow)
  - Modal/dropdown if any: `0 8px 24px rgba(10,10,10,0.08)` (rare)

### 4.7 Buttons

| Variant | Background | Text | Border | Radius | Padding | Height |
|---------|-----------|------|--------|--------|---------|--------|
| Primary | `#FFC600` | `#0A0A0A` | none | `2px` | `0 32px` | 56px |
| Primary hover | `#E6B200` | `#0A0A0A` | none | `2px` | `0 32px` | 56px |
| Secondary | transparent | `#0A0A0A` | `1px solid #0A0A0A` | `2px` | `0 32px` | 56px |
| Tertiary (link) | — | `#0A0A0A` | bottom 1px `#0A0A0A` | 0 | 0 | inline |
| Disabled | `#F0EFEB` | `#A3A3A3` | none | `2px` | `0 32px` | 56px |

Solid fills only. No gradients. No outer shadow. Focus ring `2px #FFC600` with `2px` offset.

### 4.8 Component anti-patterns (explicit)

- ❌ Bordered cards with `shadow-md` or heavier — use either (a) 1px hairline border + no shadow, or (b) no border + whitespace separation. Prefer (b).
- ❌ `rounded-2xl` on cards — keep to `2px` max
- ❌ Gradient buttons (`from-yellow-400 to-orange-500` — forbidden)
- ❌ Center-aligned body paragraphs
- ❌ Emoji in UI (✨🎉🏨 etc.)
- ❌ Stock "hero + 3 feature cards + CTA band" AI layout — sections must feel bespoke
- ❌ Isometric illustrations
- ❌ Neon gradient mesh backgrounds
- ❌ Tabs with pill backgrounds ("glowy" active states)
- ❌ Generic star-rating widgets — grade is shown as "★★★★★" in serif or as text label `5-STAR HOTEL`

---

## 5. Mock Data Schema

### 5.1 `Hotel`

```ts
type Hotel = {
  id: string                    // slug, e.g. "sowol-seoul"
  name: string                  // Korean, e.g. "소월 서울"
  nameEn: string                // "Sowol Seoul"
  city: string                  // "서울"
  region: "수도권" | "영남" | "호남" | "제주" | "강원"
  grade: 4 | 5                  // star rating
  heroImage: string             // URL, 21:9 or 16:9
  galleryImages: string[]       // 6-10 images, mixed aspect ratios
  shortConcept: string          // ≤30 chars Korean, e.g. "도심 속 고요한 안식처"
  description: string           // 2-3 paragraph Korean narrative (150-250 chars)
  amenities: string[]           // e.g. ["스파", "피트니스", "루프탑 바", "수영장"]
  address: string               // Korean full address
  checkInTime: string           // "15:00"
  checkOutTime: string          // "11:00"
  phone: string                 // "+82-2-1234-5678"
}
```

### 5.2 `Room`

```ts
type Room = {
  id: string                    // "sowol-seoul-deluxe-king"
  hotelId: string
  name: string                  // "디럭스 킹"
  concept: string               // ≤40 chars, e.g. "남산 전망의 도심 스위트"
  sizeSqm: number               // 42
  bedType: "킹" | "트윈" | "더블" | "슈퍼킹"
  view: string                  // "시티뷰" | "오션뷰" | "마운틴뷰" | "가든뷰"
  images: string[]              // 3-5 images, 4:5 portrait preferred
  amenities: string[]           // ["무료 Wi-Fi", "네스프레소", "욕조"]
  maxOccupancy: number          // 2
  basePrice: number             // 380000 (KRW per night)
  currency: "KRW"
}
```

### 5.3 `Reservation`

```ts
type Reservation = {
  id: string                    // uuid
  reservationNumber: string     // "CS-20260423-A7F2"
  hotelId: string
  roomId: string
  checkIn: string               // ISO date
  checkOut: string              // ISO date
  guests: {
    adults: number              // 1-4
    children: number            // 0-3
  }
  guest: {
    name: string
    phone: string
    email: string
    requests?: string           // optional
  }
  totalPrice: number            // nights × basePrice
  createdAt: string             // ISO datetime
}
```

### 5.4 The six partner hotels

Each is a distinct property with a clear concept. Names are placeholders chosen to sound like real Korean luxury hotels.

| # | id | Korean name | City | Region | Grade | One-sentence concept |
|---|----|-------------|------|--------|-------|----------------------|
| 1 | `sowol-seoul` | 소월 서울 | 서울 | 수도권 | 5★ | 남산 자락에 자리한 도심 속 고요한 어반 생크추어리 |
| 2 | `haeun-busan` | 해운 부산 | 부산 | 영남 | 5★ | 광안리 파도 소리를 객실 창으로 들이는 오션사이드 리트리트 |
| 3 | `wolbit-jeju` | 월빛 제주 | 제주 | 제주 | 5★ | 한라산 중산간 숲에 숨은 돌과 바람의 포레스트 하이드어웨이 |
| 4 | `seorak-sokcho` | 설악 속초 | 속초 | 강원 | 4★ | 설악의 능선과 동해를 동시에 품는 마운틴-오션 듀얼 뷰 리조트 |
| 5 | `odong-yeosu` | 오동 여수 | 여수 | 호남 | 4★ | 여수 밤바다를 파노라마로 여는 항구 도시의 모던 부티크 |
| 6 | `gyeongpo-gangneung` | 경포 강릉 | 강릉 | 강원 | 4★ | 경포호와 송림 사이, 고요한 동해안의 웰니스 휴양지 |

Each hotel has **3-4 room types** totaling **~20 rooms** across the dataset. Room price range: **220,000 – 980,000 KRW** per night.

---

## 6. Page-by-page Composition

### 6.1 Home (`/`)

Sections top-to-bottom:

1. **GNB** (fixed, transparent over hero until scroll)
   - Logo left, `호텔소개` and `예약` right
2. **Hero** (full-bleed, 88vh)
   - Background: cinematic 21:9 image of a flagship property (e.g., Sowol Seoul exterior at dusk)
   - Bottom-left text block (not centered): Serif display headline in Korean, e.g. 『머무는 모든 순간이 기억이 되도록』 (on 2 lines), a single-line English supporting phrase in Playfair Display below, and a thin "SCROLL" label with a 1px vertical line at bottom center
   - Subtle bottom gradient for legibility
3. **Intro band** (120px py, white)
   - Left 40%: eyebrow label `COOLSTAY × LUXURY HOTELS`, Noto Serif KR h2 title, short 2-sentence description
   - Right 60%: tall vertical editorial image (3:4) of interior detail
4. **Featured hotels** (120px py)
   - Section title `여섯 개의 시간, 여섯 개의 공간.` + caption `국내 파트너 호텔을 소개합니다.`
   - Horizontal-scrolling or 3-up grid of 6 hotel cards (see hotel list card spec)
   - Each card: 3:4 image, eyebrow `CITY·GRADE` label, hotel name in Serif, one-line concept, no price, no button (whole card is clickable to detail)
5. **Reservation entry band** (80px py, background `#FAFAF7`)
   - Left: Serif h2 `지금, 예약을 시작하세요.`, body `일정과 인원을 선택하면 맞춤 객실을 추천해 드립니다.`
   - Right: compact inline form (check-in, check-out, guests selects) + primary `예약하기` CTA that goes to `/reservation?step=1` with values pre-filled
6. **Footer** (minimal)
   - Logo, `© 2026 CoolStay`, phone, email

### 6.2 Hotels list (`/hotels`)

1. GNB (solid white)
2. Page header (80px pt, 48px pb)
   - Eyebrow `HOTELS`
   - h1 `파트너 호텔` (Noto Serif KR, 56px)
   - Caption `국내 주요 지역의 엄선된 여섯 개 호텔을 만나보세요.`
3. Filter bar (hairline border top & bottom, 24px py)
   - Region pills: `전체` `수도권` `영남` `호남` `제주` `강원`
   - Sort dropdown (최신순 / 가나다순) — minimal, no icon
4. Grid (3 columns, gap 32×80)
   - Hotel card:
     - 3:4 image (sharp 2px corner)
     - Below image, 24px padding:
       - Caption row: `서울 · 5-STAR` (wide-tracked small caps)
       - Name in Noto Serif KR 28px
       - Concept in body 15px `#6B6B6B`, single line with ellipsis if overflow
     - Hover: image scales 1.03 over 500ms; name gets 1px underline that wipes in
5. Footer

### 6.3 Hotel detail (`/hotels/[id]`)

1. GNB
2. Hero (72vh, full-bleed, 16:9 or 21:9 image)
   - Bottom-left overlay: eyebrow `SEOUL · 5-STAR HOTEL`, h1 name in Noto Serif KR 56px white
3. Concept section (120px py)
   - Two-column asymmetric: left (5/12) caption label + small Korean vertical divider; right (7/12) 2-3 paragraph narrative in body-lg
4. Signature amenities (80px py, `#FAFAF7` band)
   - Section title h3 `시설 & 서비스`
   - 3-column grid (no cards, no borders) — each item: small line icon (lucide, stroke 1.5), 4-8 char Korean label, 1-line description
5. Rooms (120px py)
   - Section title h2 `객실`
   - 2-column grid (40px gap) of 3-4 room cards:
     - 4:5 portrait image
     - Below: eyebrow label `SUITE` / `DELUXE`, name h3, concept body-sm, meta row `42㎡ · 킹베드 · 시티뷰`, **no price shown here**
     - On hover: "예약하기 →" link appears as bottom-right tertiary link
   - Clicking a room navigates to `/reservation?step=2&hotelId=...&roomId=...`
6. Gallery (120px py)
   - Section title + caption
   - Asymmetric grid (see 4.3): 6-10 images, mixed aspect ratios, 16px gaps
7. Info & location (80px py, hairline border top)
   - 3-column: `주소` | `체크인/체크아웃` | `문의`
   - Left-aligned, plain text with caption labels above each value. No icons.
8. Bottom CTA band (80px py)
   - Centered h2 `지금 예약을 시작하세요`
   - Primary button `예약하기 →` → `/reservation?step=1&hotelId=[id]`
9. Footer

### 6.4 Reservation (`/reservation`)

Shared shell across all 4 steps:

- GNB
- Page-top progress indicator (sticky below GNB):
  - 4 dots connected by hairlines, labels below: `일정` `객실` `투숙객 정보` `확인`
  - Active dot: filled `#FFC600` with 2px ring in `#FFF8E0`; completed dots: filled `#0A0A0A`; upcoming: hollow with `#E8E6E1` border
- Content container: max-width 960px (narrower than normal for form focus)
- Bottom navigation: `← 이전` (secondary) on left, `다음 →` (primary) on right; sticky bottom bar with hairline top border

**Step 1 — 일정 선택**
- h2 `언제 머무르시나요?`
- Two inline date inputs (체크인, 체크아웃) — minimal, native-feeling, 56px height, 1px border
- Guest steppers below: `성인` (1-4, default 2) and `아동` (0-3, default 0) — each is a label + `−` / number / `+` controls with 1px border, NO rounded pill style
- Right rail (desktop): summary card with hairline border showing selected dates and nights count

**Step 2 — 객실 선택**
- h2 `어디에서 머무시겠어요?`
- If no hotelId in query: hotel selector grid (6 compact hotel cards with radio-like selection)
- Once hotel selected: room list appears — vertical stack of room rows (full-width), each row:
  - Left: 4:5 image (240px wide)
  - Middle: eyebrow, name, concept, meta
  - Right: **price revealed for the first time** — `₩380,000` Noto Serif KR 28px, `/박` in caption, total for nights below in body-sm, `선택` primary button
- Selected room shows a 2px `#FFC600` left border accent

**Step 3 — 투숙객 정보**
- h2 `투숙객 정보를 입력해 주세요.`
- Two-column form:
  - 이름 (required), 휴대폰 (required), 이메일 (required), 요청사항 (textarea, optional, 4 rows)
- Inputs: 56px height, 1px `#E8E6E1` border, 16px body, no shadow, 4px radius, focus ring 2px `#FFC600`
- Right rail: running summary (hotel, room, dates, guests)

**Step 4 — 예약 확인**
- h2 `예약 내용을 확인해 주세요.`
- Review card (no shadow, 1px hairline border, 2px radius): structured summary with section dividers
  - 호텔 & 객실 (with small 16:9 thumbnail)
  - 투숙 일정
  - 투숙객
  - 결제 요약 — nights × per-night, total in Noto Serif KR 32px
- Consent checkbox: `예약 내용을 확인했으며, 이에 동의합니다.`
- Primary CTA: `예약 확정` (full-width 56px) — triggers generation of reservationNumber and navigates to `/reservation/complete`

### 6.5 Confirmation (`/reservation/complete`)

1. GNB
2. Hero (compact, 40vh, full-bleed image of the booked hotel)
3. Confirmation block (120px py, centered max-width 720px)
   - Small line icon (lucide `check` 40px, stroke 1.5, color `#0A0A0A`) — NOT in a yellow circle
   - h1 `예약이 완료되었습니다.`
   - Caption with reservation number in mono-ish treatment: `예약번호 · CS-20260423-A7F2`
   - Body paragraph explaining confirmation email (mock) was sent to `{email}`
4. Summary card (same structure as Step 4 review, read-only)
5. Tertiary link row: `홈으로 돌아가기` · `다른 호텔 둘러보기`
6. Footer

---

## 7. Success Criteria (for Evaluator)

### 7.1 Design Quality — Does it read as a luxury hotel site?

**Pass** if:
- Within 3 seconds of landing, a design-literate viewer would describe the site as "editorial / luxury / magazine-like", not "startup / SaaS / booking engine".
- Imagery dominates above the fold (≥60% visual weight).
- Serif headlines are visible on every page.
- Honey Yellow appears ≤5 times per viewport, all on CTAs or active states.
- Whitespace between sections is generous (≥80px vertical).

**Fail** if: any section feels like a generic Tailwind template, cards have shadows, or yellow is used as a section background.

### 7.2 Originality — No AI-slop

**Pass** if NONE of these patterns appear:
- Purple/indigo/teal gradients
- Drop shadows under white cards
- Glassmorphism (except optional GNB pre-scroll)
- Emoji in UI
- `rounded-2xl` cards
- Gradient buttons
- Center-aligned body paragraphs
- Isometric illustrations
- "Hero + 3 feature cards + CTA band" symmetric layout

**Fail** if any 2+ of the above are present.

### 7.3 Craft — Type hierarchy, spacing, color restraint, responsiveness

**Pass** if:
- Type scale is consistent (display/h1/h2/h3/body tokens used, not ad-hoc sizes)
- 8px grid respected (spot-check: no 13px, 27px, etc.)
- Korean headlines use Noto Serif KR, body uses Pretendard — never swapped
- Color palette strictly limited to spec — no stray grays from Tailwind defaults
- Desktop (1280px+) is polished; tablet (768-1279) is acceptable; mobile is best-effort

**Fail** if spacing is ad-hoc, fonts are mixed up, or stray Tailwind default grays appear.

### 7.4 Functionality — Reservation flow completes end-to-end

**Pass** if:
- User can navigate Home → `/hotels` → hotel detail → `/reservation?step=1` → step 2 → step 3 → step 4 → `/reservation/complete` without errors
- Each step persists data (URL query + sessionStorage)
- Back button works between steps
- Reservation number is generated on confirm
- If user jumps to later step without prior data, redirect to earliest missing step

**Fail** if any step is broken, data is lost across steps, or confirmation fails to render.

---

## 8. Explicit non-goals

The following are OUT OF SCOPE for this demo. The Generator MUST NOT implement them.

- ❌ Login, signup, authentication of any kind
- ❌ Membership tier, loyalty points, rewards
- ❌ Dining (restaurants, menus, F&B)
- ❌ Spa / activity / experience booking (beyond listing as amenity strings)
- ❌ Reviews, ratings (user-generated), comments
- ❌ Real payment integration (no PG, no Stripe — "예약 확정" is a mock)
- ❌ Real API calls — all data is mock JSON/TS constants
- ❌ i18n — Korean only (English appears only in small-caps labels and Playfair accents)
- ❌ Admin / partner dashboard
- ❌ Search with autocomplete, map view, calendar heatmaps
- ❌ Email sending (mention "mock email sent" only)
- ❌ Mobile-first design — desktop (1280px) is the primary canvas
- ❌ Dark mode
- ❌ Cookie consent, GDPR banners, newsletter popups
- ❌ Complex state management (Redux, Zustand overkill — use React state + URL + sessionStorage)
- ❌ Unit/integration tests (it's a demo)
- ❌ Animations beyond those listed in §4.5
- ❌ Chatbots, AI assistants, "ask our concierge" widgets
- ❌ Blog, press, careers, about pages — none of these exist

---

## Appendix A — Copy bank (Korean, for Generator to use verbatim)

- Home hero headline: 『머무는 모든 순간이 기억이 되도록』
- Home hero sub (English): *Every stay, a memory worth keeping.*
- Home intro eyebrow: `COOLSTAY × LUXURY HOTELS`
- Home intro title: 『여섯 개의 공간, 하나의 품격.』
- Featured section title: 『여섯 개의 시간, 여섯 개의 공간.』
- Featured section caption: `국내 파트너 호텔을 소개합니다.`
- Reservation band title: 『지금, 예약을 시작하세요.』
- Hotels page h1: `파트너 호텔`
- Hotels page caption: `국내 주요 지역의 엄선된 여섯 개 호텔을 만나보세요.`
- Reservation step labels: `일정` · `객실` · `투숙객 정보` · `확인`
- Step 1 title: 『언제 머무르시나요?』
- Step 2 title: 『어디에서 머무시겠어요?』
- Step 3 title: 『투숙객 정보를 입력해 주세요.』
- Step 4 title: 『예약 내용을 확인해 주세요.』
- Confirm CTA: `예약 확정`
- Confirmation h1: 『예약이 완료되었습니다.』
- Generic primary CTAs: `예약하기`, `다음`, `선택`, `확인`
- Generic secondary: `이전`, `취소`

## Appendix B — Iconography

- Library: **lucide-react** (or equivalent line icon set)
- Stroke width: `1.5px`
- Default size: `20px` (inline), `24px` (section), `40px` (feature/confirmation)
- Color: `#0A0A0A` for primary, `#6B6B6B` for secondary
- NEVER filled icons, NEVER colored icons (no yellow icons)
- NEVER use icons inside yellow circles/badges

## Appendix C — Logo usage

- File: `/coolstay_logo.png`
- GNB placement: left, vertical center, max-height `28px`
- Footer placement: max-height `24px`
- Do NOT colorize, outline, or place on yellow background
- If the logo has transparent bg, use as-is on white; if it has a yellow mark, that is the single exception where yellow appears outside CTAs

---

**End of spec.** The Generator now has enough to build. When in doubt, choose restraint over decoration.
