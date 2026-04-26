"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addDaysISO, todayISO, formatKoDate, nightsBetween } from "@/lib/utils";

export function HeroBookingBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    const ci = addDaysISO(todayISO(), 14);
    setCheckIn(ci);
    setCheckOut(addDaysISO(ci, 2));
  }, []);

  const nights = nightsBetween(checkIn, checkOut);

  const query = new URLSearchParams({
    step: "1",
    checkIn,
    checkOut,
    adults: String(adults),
    children: String(children),
  }).toString();

  return (
    <div className="relative z-10">
      <div className="container-page">
        <div className="bg-white/95 backdrop-blur-sm border-t-[2px] border-[var(--color-ink)] shadow-[0_-1px_0_var(--color-line)]">
          <div className="grid grid-cols-1 items-stretch md:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto]">
            <BarField label="체크인">
              <input
                type="date"
                value={checkIn}
                min={todayISO()}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent border-0 p-0 font-[var(--font-sans)] text-[16px] text-[var(--color-ink)] outline-none"
              />
              <div className="t-caption mt-1 text-[var(--color-ink-3)]">
                {checkIn ? formatKoDate(checkIn) : "—"}
              </div>
            </BarField>
            <BarField label="체크아웃">
              <input
                type="date"
                value={checkOut}
                min={checkIn || todayISO()}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent border-0 p-0 font-[var(--font-sans)] text-[16px] text-[var(--color-ink)] outline-none"
              />
              <div className="t-caption mt-1 text-[var(--color-ink-3)]">
                {checkOut ? `${formatKoDate(checkOut)} · ${nights}박` : "—"}
              </div>
            </BarField>
            <BarField label="성인">
              <InlineStepper value={adults} min={1} max={4} onChange={setAdults} />
            </BarField>
            <BarField label="아동">
              <InlineStepper value={children} min={0} max={3} onChange={setChildren} />
            </BarField>
            <div className="flex items-stretch">
              <Link
                href={`/reservation?${query}`}
                className="flex h-full items-center justify-center bg-[var(--color-honey-500)] hover:bg-[var(--color-honey-600)] px-10 text-[var(--color-ink)] t-button min-h-[96px] transition-colors"
              >
                예약하기 →
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function BarField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col justify-center gap-1 border-r border-[var(--color-line)] px-6 py-5 last:border-r-0 md:min-h-[96px]">
      <span className="t-label-caps text-[var(--color-ink-3)]">{label}</span>
      <div>{children}</div>
    </label>
  );
}

function InlineStepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-7 w-7 border border-[var(--color-line)] text-[var(--color-ink)] disabled:text-[var(--color-mute)] hover:border-[var(--color-ink)]"
        aria-label="감소"
      >
        −
      </button>
      <span className="t-h4 tabular-nums w-5 text-center">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-7 w-7 border border-[var(--color-line)] text-[var(--color-ink)] disabled:text-[var(--color-mute)] hover:border-[var(--color-ink)]"
        aria-label="증가"
      >
        +
      </button>
    </div>
  );
}
