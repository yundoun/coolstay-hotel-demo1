"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { addDaysISO, todayISO, nightsBetween } from "@/lib/utils";
import { CalendarWidget } from "./calendar-widget";

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
  const [calendarMode, setCalendarMode] = useState<"checkIn" | "checkOut">(
    "checkIn",
  );
  const [guestOpen, setGuestOpen] = useState(false);

  useEffect(() => {
    const ci = addDaysISO(todayISO(), 14);
    setCheckIn(ci);
    setCheckOut(addDaysISO(ci, 2));
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
      else if (ci) {
        // Auto set checkout to checkIn + 2 if cleared
        setCheckOut(addDaysISO(toISO(ci), 2));
      }
    },
    [],
  );

  const closeCalendar = useCallback(() => setCalendarOpen(false), []);

  const query = new URLSearchParams({
    step: "1",
    checkIn,
    checkOut,
    adults: String(adults),
    children: String(children),
  }).toString();

  const ciDate = checkIn ? parseLocalDate(checkIn) : null;
  const coDate = checkOut ? parseLocalDate(checkOut) : null;

  return (
    <div className="relative z-10">
      <div className="container-page">
        <div className="relative">
          {/* Main bar */}
          <div className="bg-white/97 backdrop-blur-md rounded-[3px] shadow-[0_-4px_32px_rgba(0,0,0,0.08),0_2px_12px_rgba(0,0,0,0.04)] border border-white/60">
            <div className="flex flex-col md:flex-row md:items-stretch">
              {/* Check-in */}
              <BarField
                active={calendarOpen && calendarMode === "checkIn"}
                onClick={() => openCalendar("checkIn")}
                className="flex-1"
              >
                <div className="flex items-center gap-3">
                  <CalendarIcon />
                  <div>
                    <span className="t-label-caps block text-[10px] text-[var(--color-mute)]">
                      체크인
                    </span>
                    <span className="block text-[16px] font-medium text-[var(--color-ink)] mt-0.5 leading-tight">
                      {ciDate
                        ? format(ciDate, "M월 d일", { locale: ko })
                        : "날짜 선택"}
                    </span>
                    <span className="block text-[12px] text-[var(--color-ink-3)] mt-0.5">
                      {ciDate ? format(ciDate, "EEE", { locale: ko }) : ""}
                    </span>
                  </div>
                </div>
              </BarField>

              {/* Divider with nights badge */}
              <div className="hidden md:flex items-center justify-center relative w-[1px]">
                <div className="absolute h-[40%] w-[1px] bg-[var(--color-line)]" />
                {nights > 0 && (
                  <span className="relative z-10 flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--color-ink)] px-2 text-[11px] font-semibold text-white tracking-wider">
                    {nights}박
                  </span>
                )}
              </div>

              {/* Check-out */}
              <BarField
                active={calendarOpen && calendarMode === "checkOut"}
                onClick={() => openCalendar("checkOut")}
                className="flex-1"
              >
                <div className="flex items-center gap-3">
                  <CalendarIcon />
                  <div>
                    <span className="t-label-caps block text-[10px] text-[var(--color-mute)]">
                      체크아웃
                    </span>
                    <span className="block text-[16px] font-medium text-[var(--color-ink)] mt-0.5 leading-tight">
                      {coDate
                        ? format(coDate, "M월 d일", { locale: ko })
                        : "날짜 선택"}
                    </span>
                    <span className="block text-[12px] text-[var(--color-ink-3)] mt-0.5">
                      {coDate ? format(coDate, "EEE", { locale: ko }) : ""}
                    </span>
                  </div>
                </div>
              </BarField>

              {/* Divider */}
              <div className="hidden md:flex items-center justify-center w-[1px]">
                <div className="h-[40%] w-[1px] bg-[var(--color-line)]" />
              </div>

              {/* Guest selector */}
              <div className="relative flex-1">
                <BarField
                  active={guestOpen}
                  onClick={() => {
                    setGuestOpen(!guestOpen);
                    setCalendarOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <GuestIcon />
                    <div>
                      <span className="t-label-caps block text-[10px] text-[var(--color-mute)]">
                        투숙객
                      </span>
                      <span className="block text-[16px] font-medium text-[var(--color-ink)] mt-0.5 leading-tight">
                        성인 {adults}명
                        {children > 0 ? `, 아동 ${children}명` : ""}
                      </span>
                      <span className="block text-[12px] text-[var(--color-ink-3)] mt-0.5">
                        총 {adults + children}명
                      </span>
                    </div>
                  </div>
                </BarField>

                {/* Guest dropdown */}
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

              {/* CTA */}
              <div className="p-2 md:p-2 flex">
                <Link
                  href={`/reservation?${query}`}
                  className="flex w-full items-center justify-center gap-2 rounded-[2px] bg-[var(--color-honey-500)] hover:bg-[var(--color-honey-600)] active:scale-[0.98] px-8 md:px-10 py-4 md:py-0 text-[var(--color-ink)] t-button transition-all duration-200"
                >
                  <span>예약하기</span>
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* Calendar widget — positioned below the bar */}
          <AnimatePresence>
            {calendarOpen && (
              <CalendarWidget
                checkIn={ciDate}
                checkOut={coDate}
                onSelect={handleCalendarSelect}
                onClose={closeCalendar}
                mode={calendarMode}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Bar Field ─────────────── */

function BarField({
  children,
  active,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group text-left px-5 py-4 md:py-5 transition-colors duration-150 cursor-pointer
        border-b md:border-b-0 border-[var(--color-line-soft)] last:border-b-0
        ${active ? "bg-[var(--color-bg-tint)]" : "hover:bg-[var(--color-bg-soft)]"}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

/* ─────────────── Guest Dropdown ─────────────── */

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
      className="absolute top-full right-0 left-0 md:left-auto md:w-[300px] mt-3 z-50 bg-white rounded-[4px] shadow-[0_12px_48px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.06)] border border-[var(--color-line-soft)] p-6"
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
        className="mt-6 w-full h-10 rounded-[2px] bg-[var(--color-ink)] text-white text-[13px] font-semibold tracking-[0.04em] hover:bg-[var(--color-ink-2)] transition-colors"
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

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 text-[var(--color-ink-3)]"
    >
      <rect
        x="2.5"
        y="4"
        width="15"
        height="13.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M2.5 8H17.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 2.5V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M13.5 2.5V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function GuestIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 text-[var(--color-ink-3)]"
    >
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3.5 17.5C3.5 14.1863 6.18629 11.5 9.5 11.5H10.5C13.8137 11.5 16.5 14.1863 16.5 17.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
