# Evaluation — Round 1

## Overall verdict
**Needs another round** — structurally solid, reservation flow works end-to-end, but 3 ship-blocking issues and several Craft violations need fixing before demo.

## Scorecard

| Criterion | Score | One-line |
|-----------|-------|----------|
| Design Quality | PASS with notes | Luxury feel achieved; serif headlines on every page, restrained yellow, generous whitespace. Hotel-detail bottom CTA band centers copy. |
| Originality | PASS with notes | No gradients, glassmorphism, emoji, rounded-2xl, shadow-lg. One `shadow-[inset...]` on selected room card violates no-shadow rule. |
| Craft | FAIL | Ad-hoc inline font sizes bypass token system (6+ places). Font CSS var chain broken — Next.js optimized fonts may not render. Honey-700 used as error color. |
| Functionality | PASS with notes | Full 4-step flow works, guards fire correctly, reservation number generates. Zustand hydration race can redirect away from /reservation/complete on mount. |

## Top 3 ship-blocking bugs

1. **`app/globals.css` lines 21-22** — `--font-serif-ko` and `--font-serif-en` use literal font name strings instead of `var(--font-noto-serif-kr)` / `var(--font-playfair)`. Next.js font optimization requires the CSS variable chain; without it, fonts fall back to system serif.
   Fix: `--font-serif-ko: var(--font-noto-serif-kr), ui-serif, Georgia, serif;`

2. **`components/reservation/complete-client.tsx` lines 16-20** — Zustand sessionStorage hydration race can redirect the user from the confirmation page back to step 1 immediately after booking. Demo-breaking.
   Fix: add `mounted` state guard before the redirect fires.

3. **`components/reservation/step-2-room.tsx` line 116** — `shadow-[inset_2px_0_0_var(--color-honey-500)]` on selected room card violates the no-shadows-on-cards rule (spec §4.6).
   Fix: replace with `border-l-[2px] border-[var(--color-honey-500)]`.

## Craft violations (type tokens)

- `app/page.tsx:36` — `text-[20px]` on Playfair subtitle bypasses token system.
- `components/reservation/step-2-room.tsx:156` — inline `font-[var(--font-serif-ko)] text-[28px]` for price.
- `components/reservation/step-3-guest.tsx:111` — inline `text-[24px]` for price.
- `components/reservation/step-4-review.tsx:125` — inline `text-[32px]` for total.
- `components/reservation/complete-client.tsx:108` — inline `text-[32px]` for total.
Fix: create a `t-price` token (Noto Serif KR, 32px, weight 500, leading 1.2) and apply uniformly.

## Design / polish

- `app/page.tsx:12` — hero is `h-[100svh]`; spec §6.1 says `88vh` min-height.
- `app/hotels/[id]/page.tsx:121` — `AMENITY_ICONS` falls back to `Sparkles` for most amenities; repeats visually. Expand map to cover at least 실내 수영장 (Waves), 도서 라운지 (BookOpen), 키즈 클럽 (Baby), 요가 데크 (Activity).
- `components/reservation/step-3-guest.tsx:153` — error text uses `text-[var(--color-honey-700)]`. Use ink color for errors; yellow is CTA-only.
- `app/hotels/page.tsx:9` — `pt-[120px]` vs spec's `pt-[80px]`.

## Things that work — do not touch

- Type token classes themselves (`t-display`/`t-h1`/`t-h2`/`t-h3`/`t-h4`/etc.) are spec-compliant.
- `.btn` primitives match spec §4.7 exactly.
- `hero-veil` gradient correctly scoped to bottom 55%.
- Site header transparent→solid-white transition at 80vh scroll.
- No Tailwind default grays anywhere — all colors through CSS custom properties.
- `generateReservationNumber()` format matches spec.
- All 6 hotels, ~20 rooms, prices in 220k-1.18M KRW range.
- Hotel cards: no shadows, `rounded-[2px]`, 3:4 portrait, monochrome star string.
- Step indicator: honey dot active, black done, hollow hairline upcoming.
- `lib/reservation-store.ts` Zustand + sessionStorage persist is clean.

## Feedback for Generator (priority order)

1. Fix font CSS var chain in `globals.css`.
2. Add `mounted` guard in `complete-client.tsx`.
3. Replace `shadow-[inset...]` with `border-l-2` on selected room card.
4. Create `t-price` token; replace 4 inline price-size usages.
5. `app/page.tsx:36` → `t-body-lg` or `text-[18px]`.
6. `app/page.tsx:12` → `min-h-[88vh]` not `h-[100svh]`.
7. Expand `AMENITY_ICONS` map in hotel-detail page.
8. Change error color in Step 3 from honey-700 to ink.
