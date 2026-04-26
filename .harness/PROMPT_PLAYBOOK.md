# 🎯 프롬프트 플레이북 — 럭셔리 부킹 데모 재현 가이드

> 이 문서는 본 레포 `coolstay-hotel-demo1`을 만들 때 사용된 프롬프트 흐름을
> 단계별로 정리한 것입니다. 다음 프로젝트에서 **레퍼런스 사이트만 바꿔서**
> 같은 품질의 데모를 재현하려면 아래 순서대로 진행하면 됩니다.

---

## 📋 사전 준비

### 필요한 입력 변수 (다음 프로젝트에서 결정)
- **자사 서비스명** (예: 꿀스테이)
- **자사 로고 파일** (PNG, 투명배경)
- **자사 브랜드 컬러 토큰** (300~700 5단계 권장)
- **레퍼런스 사이트 URL** (벤치마킹할 럭셔리 사이트)
- **타깃 업태** (호텔 / 펜션 / 풀빌라 / 료칸 등)
- **GNB 메뉴 개수와 내용** (예: "호텔소개", "예약" 2개)
- **데모 완결성 범위** (예약 완료 페이지까지 만들지)
- **시연 방식** (대면 PT / 링크 공유)
- **예상 제휴점 수** (필터 설계에 영향)

---

## 🌀 11단계 프롬프트 플로우

### **Step 1 — 레퍼런스 사이트 구조 파악**
첫 프롬프트는 **레퍼런스 URL을 던지며 사이트 구조 분석을 요청**.

```
{REFERENCE_URL}

이 사이트의 구조를 파악해줘.
```

→ 어시스턴트가 WebFetch로 사이트 구조, 네비게이션, 브랜드 카테고리, URL 패턴 등을 추출.

**팁**: 후속 프롬프트로 *"호텔 소개와 예약하는 과정에서 확인할 수 있는 UI도 구조 파악해줘"* 처럼 **세부 영역**을 요청하면 더 깊이 분석됨.

---

### **Step 2 — 프로젝트 목적과 범위 정의**
이번 데모가 누구를 위한 것이고, 어떤 페이지가 필요한지 한 번에 명확히 전달.

```
우리 자사 서비스인 {SERVICE_NAME}의 {업태} 업태 제휴점만을 위한
부킹 웹사이트를 만들려고 한다.
{SERVICE_NAME}는 이미 다양한 업태를 중개하고 있지만 {업태} 영업을 위해
{업태} 업태만을 위한 고급스러운 디자인으로 제안을 하려는 거지.

우선 {REFERENCE_NAME}을 레퍼런스로 한 데모 웹페이지를 만들려고 한다.
{SERVICE_NAME} 로고가 좌측 상단에 들어가야 하고,
우측 상단에는 {MENU_1}, {MENU_2} 두 메뉴만 있으면 된다.
가장 핵심 기능인 {핵심1}와 {핵심2}만 데모 페이지에 들어가면 돼.

처음 홈에 들어와서 예약하는 과정까지 mock 데이터를 사용해서
데모 홈 페이지를 만들면 된다.

내가 생각하기에:
1. {REFERENCE_NAME}의 디자인 레퍼런스 상세 정의
2. 디자인 특화된 도구 활용 (Skills, 또는 3-Layer 자가 평가)
3. 기술스택 선정

추가로 검토할 사항이 있는가? 모든 추상화할 결정사항 알려줘
```

→ 어시스턴트가 **D1~D4(디자인) / I1~I4(IA) / M1~M4(데이터) / T1~T8(기술) / O1~O5(시연)** 형태로 결정사항 체크리스트를 출력.

---

### **Step 3 — 브랜드 자산 + 핵심 결정 전달**
어시스턴트가 던진 결정사항에 답하기. **반드시 포함할 것**:
- 브랜드 컬러 토큰 (JSON으로 5단계)
- 배경/포인트 사용 규칙
- 시연 방식
- 데모 완결성 범위

```
{SERVICE_NAME}와 제휴된 모든 {업태} 제휴점을 위한 거지.
로고는 기존에 있는 거 참고하면 되고, 배경은 화이트에 브랜드 컬러는

{BRAND_COLOR_TOKENS_JSON}

나중에 서버에 배포해서 영업 시연할거다.
mock 데이터 라이브러리 사용하면 돼.
예약 완료 화면까지 만들면 된다.
모든 레퍼런스는 {REFERENCE_NAME} 참고.

추가로 검토할 사항 있나? 모든 추상화할 결정사항 알려줘
```

---

### **Step 4 — 하네스 자율 구현 위임 (CRITICAL)**
이 단계가 데모 품질을 좌우하는 **가장 중요한 프롬프트**.
Anthropic Engineering 블로그 *"Harness design for long-running application development"* 글을
통째로 붙이고 다음과 같이 위임.

```
아니면 아래 글 바탕으로 하네스 구성해서 너가 결정해서 구현해볼래?

---
{ANTHROPIC_HARNESS_BLOG_FULL_TEXT}
```

→ 어시스턴트가 **Planner → Generator → Evaluator 3-Agent 하네스**를 구성:
- **Planner**: 600줄 분량의 풀 제품 스펙 + 디자인 랭귀지 정의 (`.harness/spec.md`)
- **Generator**: Next.js 스캐폴딩 + 모든 페이지 구현
- **Evaluator**: 4가지 기준 (Design Quality / Originality / Craft / Functionality)으로 채점
- **Iterate**: Evaluator 피드백 자동 반영

**핵심**: 이 단계에선 어시스턴트가 모든 결정을 하도록 위임. 중간 개입 금지.

---

### **Step 5 — 1차 구현 결과물 확인 + 정합성 검증 요청**
어시스턴트가 "200 OK = 완료"로 판단하기 쉬운 함정. 반드시 **실제 렌더링 확인**을 요구.

```
실제 작동 확인했어? Playwright 같은 걸로 스크린샷 찍어서 보여줘.
```

→ 어시스턴트가 Playwright 스크립트 작성 → 모든 페이지 스크린샷 캡처
→ 자가 진단으로 깨진 부분 발견하고 보고.

**자주 나오는 1차 이슈**:
- 외부 이미지 호스팅 Rate Limit (Unsplash 429)
- 폰트 CSS 변수 체인 끊김 (Next.js 최적화 폰트 미적용)
- Framer Motion `whileInView` opacity:0 트랩
- Hot reload 시 styled-jsx 충돌

---

### **Step 6 — 사용자 피드백 라운드 1: UX/디자인 충실도**
1차 결과물을 보고 **레퍼런스와의 차이**를 구체적으로 지적.

```
{REFERENCE_NAME} 레퍼런스 참고하라고 했는데 전혀 비슷하지 않다.
특히 {예약/특정 영역}이 왜 {위치}에 있지? 사용자 플로우를 고려하지 않았나?
그리고 mock 데이터 안 나오고 깨지는 부분이 너무 많은데?
어떻게 개선 계획 세울 거지?
```

→ 어시스턴트가 Phase A/B/C로 개선 계획 제시 + 우선순위 정렬.

---

### **Step 7 — 기술 안정성 (필요 시)**
Next 최신 버전이 불안정하면 LTS로 다운그레이드 요청.

```
Next 16이 불안정한데 14로 다운그레이드 가능한가?
```

→ 어시스턴트가 호환성 분석 (params API, config 파일 형식, React 18 vs 19) → 정리된 다운그레이드 절차 제시.

**다음 프로젝트 기준**: 처음부터 Next 14 LTS로 시작하면 이 단계 스킵 가능.

---

### **Step 8 — Critical Fix 위임**
Phase A 계획 (이미지 로컬화 + 위젯 위치 변경 + 다운그레이드) 한꺼번에 진행.

```
어 제안대로 가보자. (그전에 다운그레이드 진행하자)
```

→ 어시스턴트가 순차 실행 + 매 단계 검증.

**이 단계의 핵심 산출물**:
- `/public/{업태}/...` 로컬 이미지 풀 (40~50장)
- 히어로 오버랩 검색 위젯
- 안정된 빌드

---

### **Step 9 — 실 시연 검증 + 잔여 이슈 수정**
스크린샷 보면서 픽셀 단위 이슈 발견되면 그 자리에서 지적.

```
{특정 섹션}이 안 보인다 / 깨진다.
```

→ 어시스턴트가 원인 분석 (Reveal IO 트리거, 폰트 미적용 등) + 즉시 수정 + 재검증.

**자주 등장한 수정**:
- `Reveal` 컴포넌트의 IntersectionObserver 페일세이프
- 히어로 GNB 가시성 (상단 그라디언트 추가)
- 아이콘 명시 사이즈

---

### **Step 10 — 데이터 스케일 업**
실제 운영 규모로 데이터 확장 + 필터링 시스템 추가.

```
찾아보니까 우리 제휴점이 {N}개가 넘더라고. {URL}에 필터가 들어가야 할 것 같다.
또 수정할 부분이 있는가?
```

→ 어시스턴트가 데이터 확장 + 필터 컴포넌트 + 카운트 배지 + 정렬 기능 제안.

**중요한 후속 프롬프트**:
```
필터는 지역으로만 고정하자. 너무 많은 거 다 지원하지도 않고
지역으로 나눠도 충분할 것 같다.
UX 디테일에서는 너가 판단했을 때 가장 UX 경험이 좋아 보이는 형태로 구현하자.
```

→ 단순화 지시. 어시스턴트가 오버엔지니어링 안 하도록 가이드.

---

### **Step 11 — 시연 리허설 가이드 작성**
영업 담당자용 Happy Path + Q&A 가이드.

```
시연 리허설 가보자.
```

→ 어시스턴트가 `.harness/DEMO_GUIDE.md` 작성:
- 3분 Happy Path 시나리오
- 2분 압축 버전
- 예상 Q&A 5개
- 시연 전 체크리스트
- 세션 초기화 방법

---

## 🔧 기술 스택 (재사용 가능)

```
- Next.js 14.2 LTS (Turbopack 비활성, Webpack 안정)
- React 18.3
- TypeScript 5
- Tailwind CSS v4
- Framer Motion 11
- Zustand 5 + sessionStorage persist
- React Hook Form + Zod 3
- date-fns 3
- lucide-react
- next/font/google (Noto Serif KR + Playfair Display + Pretendard CDN)
```

---

## 📐 디자인 시스템 패턴 (재사용 가능)

CSS 변수 토큰 (브랜드 컬러만 바꾸면 됨):

```css
@theme {
  --color-bg: #ffffff;
  --color-bg-soft: #fafaf7;       /* warm off-white band */
  --color-bg-tint: #fff8e0;        /* brand tint (10% saturation) */
  --color-ink: #0a0a0a;
  --color-ink-2: #3d3d3d;
  --color-ink-3: #6b6b6b;
  --color-mute: #a3a3a3;
  --color-line: #e8e6e1;           /* warm hairline */

  --color-brand-300: {BRAND_300};
  --color-brand-500: {BRAND_500};  /* CTA bg */
  --color-brand-600: {BRAND_600};  /* CTA hover */
  --color-brand-700: {BRAND_700};

  --font-serif-ko: var(--font-noto-serif-kr), serif;
  --font-serif-en: var(--font-playfair), serif;
  --font-sans: "Pretendard", sans-serif;
}
```

타입 토큰 (절대 변경 금지):
- `t-display` 88px / `t-h1` 56px / `t-h2` 40px / `t-h3` 28px / `t-h4` 20px
- `t-body-lg` 18px / `t-body` 16px / `t-body-sm` 14px / `t-caption` 13px
- `t-label-caps` 12px tracking 0.14em uppercase
- `t-price` 32px / `t-price-md` 28px / `t-price-sm` 24px (Noto Serif KR)

---

## 🎨 럭셔리 UX 원칙 (모든 프로젝트 공통)

1. **Restraint as luxury** — 브랜드 컬러는 CTA·active state에만 (≤5회/뷰포트)
2. **이미지 70% 비중** — 풀블리드 히어로, 비대칭 갤러리
3. **가격은 예약 단계에서만** — 매거진 톤 유지
4. **Serif 헤드라인 / Sans 본문** — 절대 섞지 말기
5. **Whitespace는 디자인 요소** — `py-[120px]` 섹션 간격
6. **Sharp corners** — `rounded-[2px]` 최대, 절대 `rounded-2xl` 금지
7. **No shadows on cards** — 1px hairline border만
8. **Restrained motion** — 400ms 페이드인업, 1.03 호버 스케일
9. **No AI slop** — 보라 그라디언트, 글래스모피즘, 이모지 절대 금지

---

## 🚦 실수했던 지점 (재발 방지 체크리스트)

| 실수 | 재발 방지 방법 |
|-----|---------------|
| Unsplash 런타임 호출 | 처음부터 로컬 이미지 풀 다운로드 |
| Next 16 + React 19 채택 | Next 14.2 LTS로 시작 |
| `200 OK = 완성` 판단 | Playwright 스크린샷 필수 |
| `Reveal` `whileInView` opacity:0 트랩 | IO + 800ms 페일세이프 패턴 |
| 폰트 CSS 변수 체인 끊김 | `var(--font-noto-serif-kr)` 형태로 연결 |
| 사이드 필터 오버엔지니어링 | 30개 미만이면 상단 칩 필터 |
| styled-jsx 충돌 | inline tailwind class만 사용 |

---

## 📁 산출 디렉토리 구조 (참고)

```
{project-name}/
├── .harness/
│   ├── spec.md                  # Planner 산출물 (600줄)
│   ├── evaluation-round-1.md    # Evaluator 채점표
│   ├── DEMO_GUIDE.md            # 시연 가이드
│   ├── PROMPT_PLAYBOOK.md       # 이 문서
│   ├── screenshot.mjs           # Playwright 스크립트
│   ├── flow-screenshot.mjs      # 예약 플로우 시뮬레이션
│   └── screenshots/             # 시연 검증용 스냅샷
├── app/
│   ├── layout.tsx               # 루트 + 폰트 + GNB/푸터
│   ├── globals.css              # 디자인 토큰 + 유틸 클래스
│   ├── page.tsx                 # 홈
│   ├── {업태}/
│   │   ├── page.tsx             # 리스트
│   │   └── [id]/page.tsx        # 상세
│   └── reservation/
│       ├── page.tsx             # 예약 셸
│       └── complete/page.tsx    # 완료
├── components/
│   ├── site-header.tsx          # 트랜스페어런트→솔리드 GNB
│   ├── site-footer.tsx
│   ├── reveal.tsx               # IO + 페일세이프 모션
│   ├── hero-booking-bar.tsx     # 히어로 오버랩 검색 위젯
│   ├── hotel-filters.tsx        # 공통 필터 컴포넌트
│   ├── hotel-card.tsx
│   ├── room-card.tsx
│   ├── step-indicator.tsx
│   └── reservation/
│       ├── reservation-shell.tsx
│       ├── step-1-dates.tsx
│       ├── step-2-room.tsx
│       ├── step-3-guest.tsx
│       ├── step-4-review.tsx
│       └── complete-client.tsx
├── lib/
│   ├── types.ts
│   ├── {업태}.ts                # Mock 데이터 + getRegionCounts
│   ├── reservation-store.ts     # Zustand
│   └── utils.ts
└── public/
    ├── {logo}.png
    └── {업태}/                  # 로컬 이미지 풀
        └── {item-id}/
            ├── hero.jpg
            ├── gallery-1~4.jpg
            └── rooms/
                ├── deluxe.jpg
                ├── premier.jpg
                └── suite.jpg
```

---

## 🎬 다음 프로젝트 시작 시 권장 흐름

1. **0~5분**: 사전 준비 변수 정리 (위 입력 변수 섹션)
2. **5~15분**: Step 1 (레퍼런스 분석)
3. **15~25분**: Step 2~3 (목적·결정사항 정리)
4. **25분~3시간**: Step 4 (하네스 자율 구현) — 이 동안 다른 일 가능
5. **+30분**: Step 5~6 (검증 + 1차 피드백)
6. **+30분**: Step 7~9 (안정화 + 실 시연 검증)
7. **+45분**: Step 10 (데이터 스케일업 + 필터)
8. **+15분**: Step 11 (시연 가이드)

**총 약 5~6시간**으로 영업 시연 가능한 데모 완성.

---

## 📝 다음 프로젝트 시작 프롬프트 템플릿

처음 한 번에 다 던져도 됩니다 (긴 프롬프트 OK):

```
{REFERENCE_URL} 이 사이트 구조부터 파악해줘.

목표: 우리 {SERVICE_NAME}의 {업태} 업태 제휴점 영업을 위한 데모 부킹 사이트를
{REFERENCE_NAME} 수준의 럭셔리 톤으로 만든다.

브랜드 컬러:
{BRAND_COLOR_TOKENS_JSON}

GNB는 좌측 {SERVICE_NAME} 로고 + 우측 {MENU_1}, {MENU_2} 두 개만.
{핵심기능1}와 {핵심기능2}만 데모에 포함.
mock 데이터로 예약 완료 화면까지 구현.
배포는 Vercel, 시연은 대면 PT.
제휴점은 약 {N}개 가정.

기술 스택은 Next.js 14 LTS + React 18 + Tailwind v4 + Framer Motion + Zustand
+ RHF/Zod로 진행.

Anthropic Harness 블로그 (Planner → Generator → Evaluator 3-Agent)
패턴으로 구현하되, 너가 모든 결정 내려서 자율적으로 진행해.
실제 렌더링은 Playwright 스크린샷으로 반드시 자가 검증해.
완료되면 시연 가이드까지 작성.
```

이 한 프롬프트가 이번 세션 11단계의 진행 의도를 모두 담고 있습니다.
