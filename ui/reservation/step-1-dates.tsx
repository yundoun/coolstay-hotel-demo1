"use client";

import Link from "next/link";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { addDaysISO, formatKoDate, nightsBetween, todayISO } from "@/domain/shared/utils";
import { MAX_NIGHTS } from "@/domain/shared/constants";

export function Step1Dates({ onNext }: { onNext?: () => void } = {}) {
  const s = useReservation();
  const nights = nightsBetween(s.checkIn, s.checkOut);
  const canNext = nights > 0;

  return (
    <div className="mx-auto max-w-[960px]">
      <span className="eyebrow">Step 01</span>
      <h2 className="t-h2 mt-4">언제 머무르시나요?</h2>
      <p className="t-body mt-4 text-[var(--color-ink-3)]">
        투숙 일정과 인원을 선택해 주세요. 다음 단계에서 호텔을 안내해 드립니다.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="flex flex-col gap-10">
          <fieldset className="flex flex-col gap-4">
            <legend className="t-label-caps text-[var(--color-ink-3)]">투숙 일정</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="t-caption text-[var(--color-ink-3)]">체크인</span>
                <input
                  type="date"
                  value={s.checkIn}
                  min={todayISO()}
                  onChange={(e) => {
                    const newCheckIn = e.target.value;
                    const keepNights = Math.min(
                      Math.max(nightsBetween(s.checkIn, s.checkOut), 1),
                      MAX_NIGHTS,
                    );
                    s.setDates(newCheckIn, addDaysISO(newCheckIn, keepNights));
                  }}
                  className="field"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="t-caption text-[var(--color-ink-3)]">체크아웃</span>
                <input
                  type="date"
                  value={s.checkOut}
                  min={s.checkIn || todayISO()}
                  max={addDaysISO(s.checkIn, MAX_NIGHTS)}
                  onChange={(e) => s.setDates(s.checkIn, e.target.value)}
                  className="field"
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="t-label-caps text-[var(--color-ink-3)]">투숙 인원</legend>
            <GuestStepper
              label="성인"
              hint="만 13세 이상"
              value={s.adults}
              min={1}
              max={10}
              onChange={(n) => s.setAdults(n)}
            />
          </fieldset>
        </div>

        {/* Right rail summary */}
        <aside className="border border-[var(--color-line)] p-6 h-fit rounded-[2px] bg-white">
          <span className="t-label-caps text-[var(--color-ink-3)]">요약</span>
          <div className="mt-4 flex flex-col gap-3">
            <SummaryRow label="체크인" value={formatKoDate(s.checkIn)} />
            <SummaryRow label="체크아웃" value={formatKoDate(s.checkOut)} />
            <div className="h-px bg-[var(--color-line)] my-2" />
            <SummaryRow label="박" value={nights > 0 ? `${nights}박` : "—"} />
            <SummaryRow label="인원" value={`성인 ${s.adults}인`} />
          </div>
        </aside>
      </div>

      {/* Nav */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-16 pointer-events-none px-4 py-4 sm:-mx-0 sm:px-0">
        <div className="pointer-events-auto rounded-lg border border-[var(--color-line)] bg-white/90 backdrop-blur-sm px-4 py-4 flex items-center justify-between">
          <Link href="/" className="btn-tertiary">
            ← 홈으로
          </Link>
          {onNext ? (
            <button
              type="button"
              onClick={onNext}
              disabled={!canNext}
              className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              객실 선택 →
            </button>
          ) : (
            <Link
              href="/reservation?step=2"
              aria-disabled={!canNext}
              onClick={(e) => {
                if (!canNext) e.preventDefault();
              }}
              className={canNext ? "btn btn-primary" : "btn btn-primary opacity-40 pointer-events-none"}
            >
              객실 선택 →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function GuestStepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border border-[var(--color-line)] rounded-[2px] bg-white px-5 py-4">
      <div>
        <div className="t-h4">{label}</div>
        <div className="t-caption text-[var(--color-ink-3)]">{hint}</div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-10 w-10 border border-[var(--color-line)] text-[var(--color-ink)] disabled:text-[var(--color-mute)] disabled:border-[var(--color-line-soft)] hover:border-[var(--color-ink)]"
          aria-label="감소"
        >
          −
        </button>
        <span className="t-h4 tabular-nums w-5 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="h-10 w-10 border border-[var(--color-line)] text-[var(--color-ink)] disabled:text-[var(--color-mute)] disabled:border-[var(--color-line-soft)] hover:border-[var(--color-ink)]"
          aria-label="증가"
        >
          +
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="t-caption text-[var(--color-ink-3)]">{label}</span>
      <span className="t-body-sm text-[var(--color-ink)] text-right">{value || "—"}</span>
    </div>
  );
}
