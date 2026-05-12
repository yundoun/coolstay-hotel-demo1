"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { addDaysISO, todayISO, nightsBetween } from "@/domain/shared/utils";
import { CalendarWidget } from "@/ui/shared/calendar-widget";
import { SITE_HOTEL_ID } from "@/hotel-data/hotel";

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISO(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function HeroBookingBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState<"checkIn" | "checkOut">("checkIn");
  const [guestOpen, setGuestOpen] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ci = todayISO();
    setCheckIn(ci);
    setCheckOut(addDaysISO(ci, 1));
  }, []);

  const nights = nightsBetween(checkIn, checkOut);

  const openCalendar = (mode: "checkIn" | "checkOut") => {
    setCalendarMode(mode);
    setCalendarOpen(true);
    setGuestOpen(false);
  };

  const handleCalendarSelect = useCallback(
    (ci: Date | null, co: Date | null) => {
      if (ci) setCheckIn(toISO(ci));
      if (co) setCheckOut(toISO(co));
      else setCheckOut("");
    },
    [],
  );

  const closeCalendar = useCallback(() => setCalendarOpen(false), []);

  const query = new URLSearchParams({
    step: "2",
    checkIn,
    checkOut,
    adults: String(adults),
    children: String(children),
    hotelId: SITE_HOTEL_ID,
  }).toString();

  const ciDate = checkIn ? parseLocalDate(checkIn) : null;
  const coDate = checkOut ? parseLocalDate(checkOut) : null;

  return (
    <section className="relative z-20 bg-white border-y border-[var(--color-line)]">
      {/* Calendar dropdown */}
      <AnimatePresence>
        {calendarOpen && (
          <div className="absolute bottom-full left-0 right-0 z-50">
            <div className="container-page relative">
              <CalendarWidget
                checkIn={ciDate}
                checkOut={coDate}
                onSelect={handleCalendarSelect}
                onClose={closeCalendar}
                mode={calendarMode}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="container-page" ref={barRef}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:h-[72px]">

          {/* ── Check-in ── */}
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => openCalendar("checkIn")}
              className="w-full flex flex-col items-center justify-center gap-0.5 py-3.5 lg:py-0 lg:h-full cursor-pointer"
            >
              <span className="bar-label">체크인</span>
              <span className="bar-value">
                {ciDate ? format(ciDate, "M월 d일 (EEE)", { locale: ko }) : "날짜 선택"}
              </span>
            </button>
          </div>

          {/* ── Nights label ── */}
          <div className="hidden lg:flex items-center justify-center shrink-0 px-1">
            <span className="inline-flex h-[24px] items-center rounded-full bg-[var(--color-bg-tint)] border border-[var(--color-honey-300)] px-2.5 text-[11px] font-semibold text-[var(--color-honey-700)] tracking-wide">
              {nights > 0 ? `${nights}박` : "—"}
            </span>
          </div>

          {/* ── Check-out ── */}
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => openCalendar("checkOut")}
              className="w-full flex flex-col items-center justify-center gap-0.5 py-3.5 lg:py-0 lg:h-full cursor-pointer"
            >
              <span className="bar-label">체크아웃</span>
              <span className="bar-value">
                {coDate ? format(coDate, "M월 d일 (EEE)", { locale: ko }) : "날짜 선택"}
              </span>
            </button>
          </div>

          {/* ── Guest ── */}
          <div className="relative flex-1 min-w-0">
            <button
              type="button"
              onClick={() => {
                setGuestOpen(!guestOpen);
                setCalendarOpen(false);
              }}
              className="w-full flex flex-col items-center justify-center gap-0.5 py-3.5 lg:py-0 lg:h-full cursor-pointer"
            >
              <span className="bar-label">투숙객</span>
              <span className="bar-value">
                성인 {adults}명{children > 0 ? ` · 아동 ${children}명` : ""}
              </span>
            </button>

            <AnimatePresence>
              {guestOpen && (
                <GuestDropdown
                  adults={adults}
                  children={children}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                  onClose={() => setGuestOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* ── CTA ── */}
          <div className="flex items-center py-3 lg:py-0 lg:pl-2">
            <Link
              href={`/reservation?${query}`}
              className="flex w-full lg:w-auto items-center justify-center gap-2 rounded-[4px] bg-[var(--color-honey-500)] hover:bg-[var(--color-honey-600)] active:scale-[0.98] h-[44px] px-8 text-[var(--color-ink)] t-button transition-all duration-200"
            >
              <SearchIcon />
              <span>예약하기</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Guest Dropdown (opens upward) ─────────────── */

function GuestDropdown({
  adults,
  children,
  onAdultsChange,
  onChildrenChange,
  onClose,
}: {
  adults: number;
  children: number;
  onAdultsChange: (n: number) => void;
  onChildrenChange: (n: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
      className="absolute bottom-full right-0 left-0 lg:left-auto lg:w-[300px] mb-2 z-50 bg-white rounded-[6px] shadow-[0_-8px_48px_rgba(0,0,0,0.14),0_-2px_8px_rgba(0,0,0,0.06)] border border-[var(--color-line-soft)] p-6"
    >
      <GuestRow
        label="성인"
        sub="만 13세 이상"
        value={adults}
        min={1}
        max={4}
        onChange={onAdultsChange}
      />
      <div className="my-4 h-[1px] bg-[var(--color-line-soft)]" />
      <GuestRow
        label="아동"
        sub="만 2–12세"
        value={children}
        min={0}
        max={3}
        onChange={onChildrenChange}
      />
      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full h-10 rounded-[4px] bg-[var(--color-ink)] text-white text-[13px] font-semibold tracking-[0.04em] hover:bg-[var(--color-ink-2)] transition-colors"
      >
        확인
      </button>
    </motion.div>
  );
}

function GuestRow({
  label,
  sub,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sub: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-[15px] font-medium text-[var(--color-ink)]">
          {label}
        </span>
        <span className="block text-[12px] text-[var(--color-ink-3)] mt-0.5">
          {sub}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink-2)] transition-all hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] disabled:text-[var(--color-line)] disabled:border-[var(--color-line-soft)] disabled:cursor-not-allowed"
          aria-label={`${label} 감소`}
        >
          <Minus />
        </button>
        <span className="w-6 text-center text-[16px] font-semibold tabular-nums text-[var(--color-ink)]">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink-2)] transition-all hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] disabled:text-[var(--color-line)] disabled:border-[var(--color-line-soft)] disabled:cursor-not-allowed"
          aria-label={`${label} 증가`}
        >
          <Plus />
        </button>
      </div>
    </div>
  );
}

/* ─── Icons ─── */

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Minus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7H11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function Plus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 3V11M3 7H11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
