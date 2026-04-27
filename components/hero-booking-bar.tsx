"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { addDaysISO, todayISO, nightsBetween } from "@/lib/utils";
import { CalendarWidget } from "./calendar-widget";
import type { Region } from "@/lib/types";

const REGIONS: { value: Region; label: string; sub: string }[] = [
  { value: "수도권", label: "서울 · 수도권", sub: "10개 호텔" },
  { value: "영남", label: "부산 · 영남", sub: "5개 호텔" },
  { value: "호남", label: "여수 · 호남", sub: "4개 호텔" },
  { value: "제주", label: "제주", sub: "5개 호텔" },
  { value: "강원", label: "강원", sub: "6개 호텔" },
];

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
  const [region, setRegion] = useState<Region | null>(null);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState<"checkIn" | "checkOut">("checkIn");
  const [guestOpen, setGuestOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

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
    setRegionOpen(false);
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
    ...(region ? { region } : {}),
  }).toString();

  const ciDate = checkIn ? parseLocalDate(checkIn) : null;
  const coDate = checkOut ? parseLocalDate(checkOut) : null;

  return (
    <section className="relative z-20 bg-white border-y border-[var(--color-line)]">
      {/* Dropdowns render here — above the bar */}
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

          {/* ── Region ── */}
          <div className="relative flex-1 min-w-0">
            <button
              type="button"
              onClick={() => {
                setRegionOpen(!regionOpen);
                setCalendarOpen(false);
                setGuestOpen(false);
              }}
              className="w-full flex flex-col items-center justify-center gap-0.5 py-3.5 lg:py-0 lg:h-full cursor-pointer"
            >
              <span className="bar-label">여행지</span>
              <span className="bar-value">
                {region
                  ? REGIONS.find((r) => r.value === region)?.label
                  : "전체 지역"}
              </span>
            </button>

            <AnimatePresence>
              {regionOpen && (
                <RegionDropdown
                  selected={region}
                  onSelect={(r) => {
                    setRegion(r);
                    setRegionOpen(false);
                  }}
                  onClear={() => {
                    setRegion(null);
                    setRegionOpen(false);
                  }}
                  onClose={() => setRegionOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>

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
                setRegionOpen(false);
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
              <span>검색</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Region Dropdown (opens upward) ─────────────── */

function RegionDropdown({
  selected,
  onSelect,
  onClear,
  onClose,
}: {
  selected: Region | null;
  onSelect: (r: Region) => void;
  onClear: () => void;
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
      className="absolute bottom-full left-0 right-0 lg:right-auto lg:w-[380px] mb-2 z-50 bg-white rounded-[6px] shadow-[0_-8px_48px_rgba(0,0,0,0.14),0_-2px_8px_rgba(0,0,0,0.06)] border border-[var(--color-line-soft)] p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-medium tracking-[0.08em] uppercase text-[var(--color-ink-3)]">
          지역 선택
        </span>
        {selected && (
          <button
            type="button"
            onClick={onClear}
            className="text-[12px] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] underline underline-offset-2 transition-colors"
          >
            전체 보기
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {REGIONS.map((r) => {
          const isActive = selected === r.value;
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => onSelect(r.value)}
              className={`
                flex flex-col gap-0.5 rounded-[4px] border px-4 py-3 text-left transition-all duration-150
                ${
                  isActive
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                    : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]"
                }
              `}
            >
              <span className="text-[14px] font-semibold leading-tight">{r.label}</span>
              <span
                className={`text-[11px] ${isActive ? "text-white/60" : "text-[var(--color-mute)]"}`}
              >
                {r.sub}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
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

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[var(--color-ink-3)]">
      <path d="M10 10.5C11.1046 10.5 12 9.60457 12 8.5C12 7.39543 11.1046 6.5 10 6.5C8.89543 6.5 8 7.39543 8 8.5C8 9.60457 8.89543 10.5 10 10.5Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 18C10 18 16 13 16 8.5C16 5.18629 13.3137 2.5 10 2.5C6.68629 2.5 4 5.18629 4 8.5C4 13 10 18 10 18Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[var(--color-ink-3)]">
      <rect x="2.5" y="4" width="15" height="13.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 8H17.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 2.5V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M13.5 2.5V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function GuestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[var(--color-ink-3)]">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 17.5C3.5 14.1863 6.18629 11.5 9.5 11.5H10.5C13.8137 11.5 16.5 14.1863 16.5 17.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

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
