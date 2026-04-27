"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isBefore,
  isAfter,
  isSameMonth,
  isToday,
  startOfDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

type CalendarMode = "checkIn" | "checkOut";

interface CalendarWidgetProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (checkIn: Date | null, checkOut: Date | null) => void;
  onClose: () => void;
  mode: CalendarMode;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function CalendarWidget({
  checkIn,
  checkOut,
  onSelect,
  onClose,
  mode: initialMode,
}: CalendarWidgetProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [currentMonth, setCurrentMonth] = useState(
    () => checkIn ?? today,
  );
  const [activeMode, setActiveMode] = useState<CalendarMode>(initialMode);
  const [hovered, setHovered] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const nextMonth = addMonths(currentMonth, 1);

  const handleDayClick = useCallback(
    (day: Date) => {
      if (isBefore(day, today)) return;

      if (activeMode === "checkIn") {
        // If picking check-in, set it and auto-switch to check-out
        if (checkOut && (isSameDay(day, checkOut) || isAfter(day, checkOut))) {
          onSelect(day, null);
        } else {
          onSelect(day, checkOut);
        }
        setActiveMode("checkOut");
      } else {
        // Picking check-out
        if (checkIn && (isSameDay(day, checkIn) || isBefore(day, checkIn))) {
          // If user picks before check-in, restart with this as check-in
          onSelect(day, null);
          setActiveMode("checkOut");
        } else {
          onSelect(checkIn, day);
          // Done — close after a short delay
          setTimeout(onClose, 220);
        }
      }
    },
    [activeMode, checkIn, checkOut, onSelect, onClose, today],
  );

  const isInRange = useCallback(
    (day: Date) => {
      if (!checkIn) return false;
      const end = checkOut ?? hovered;
      if (!end) return false;
      return isAfter(day, checkIn) && isBefore(day, end);
    },
    [checkIn, checkOut, hovered],
  );

  const isRangeStart = useCallback(
    (day: Date) => checkIn != null && isSameDay(day, checkIn),
    [checkIn],
  );

  const isRangeEnd = useCallback(
    (day: Date) => {
      const end = checkOut ?? (activeMode === "checkOut" ? hovered : null);
      return end != null && isSameDay(day, end);
    },
    [checkOut, hovered, activeMode],
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
      className="absolute top-full left-0 right-0 mt-3 z-50 bg-white rounded-[4px] shadow-[0_12px_48px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.06)] border border-[var(--color-line-soft)] overflow-hidden"
    >
      {/* Mode tabs */}
      <div className="flex border-b border-[var(--color-line-soft)]">
        <button
          type="button"
          onClick={() => setActiveMode("checkIn")}
          className={`flex-1 py-4 text-center transition-colors ${
            activeMode === "checkIn"
              ? "bg-[var(--color-bg)] text-[var(--color-ink)] border-b-2 border-[var(--color-ink)]"
              : "bg-[var(--color-bg-soft)] text-[var(--color-ink-3)] hover:text-[var(--color-ink-2)]"
          }`}
        >
          <span className="t-label-caps block text-[10px]">체크인</span>
          <span className="block mt-1 text-[15px] font-medium">
            {checkIn ? format(checkIn, "M월 d일 (EEE)", { locale: ko }) : "날짜 선택"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMode("checkOut")}
          className={`flex-1 py-4 text-center transition-colors ${
            activeMode === "checkOut"
              ? "bg-[var(--color-bg)] text-[var(--color-ink)] border-b-2 border-[var(--color-ink)]"
              : "bg-[var(--color-bg-soft)] text-[var(--color-ink-3)] hover:text-[var(--color-ink-2)]"
          }`}
        >
          <span className="t-label-caps block text-[10px]">체크아웃</span>
          <span className="block mt-1 text-[15px] font-medium">
            {checkOut ? format(checkOut, "M월 d일 (EEE)", { locale: ko }) : "날짜 선택"}
          </span>
        </button>
      </div>

      {/* Calendar grid — two months side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <MonthGrid
          month={currentMonth}
          today={today}
          isInRange={isInRange}
          isRangeStart={isRangeStart}
          isRangeEnd={isRangeEnd}
          onDayClick={handleDayClick}
          onDayHover={setHovered}
          onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
          showPrevArrow={!isSameMonth(currentMonth, today)}
          showNextArrow={false}
        />
        <MonthGrid
          month={nextMonth}
          today={today}
          isInRange={isInRange}
          isRangeStart={isRangeStart}
          isRangeEnd={isRangeEnd}
          onDayClick={handleDayClick}
          onDayHover={setHovered}
          onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
          showPrevArrow={false}
          showNextArrow
          borderLeft
        />
      </div>
    </motion.div>
  );
}

/* ─────────────── Month Grid ─────────────── */

function MonthGrid({
  month,
  today,
  isInRange,
  isRangeStart,
  isRangeEnd,
  onDayClick,
  onDayHover,
  onPrevMonth,
  onNextMonth,
  showPrevArrow,
  showNextArrow,
  borderLeft,
}: {
  month: Date;
  today: Date;
  isInRange: (d: Date) => boolean;
  isRangeStart: (d: Date) => boolean;
  isRangeEnd: (d: Date) => boolean;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  showPrevArrow?: boolean;
  showNextArrow?: boolean;
  borderLeft?: boolean;
}) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  return (
    <div
      className={`px-6 py-5 ${borderLeft ? "md:border-l md:border-[var(--color-line-soft)]" : ""}`}
    >
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-8">
          {showPrevArrow && onPrevMonth && (
            <button
              type="button"
              onClick={onPrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-3)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)] transition-colors"
              aria-label="이전 달"
            >
              <ChevronLeft />
            </button>
          )}
        </div>
        <span className="text-[15px] font-semibold tracking-[0.02em] text-[var(--color-ink)]">
          {format(month, "yyyy년 M월", { locale: ko })}
        </span>
        <div className="w-8">
          {showNextArrow && onNextMonth && (
            <button
              type="button"
              onClick={onNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-3)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)] transition-colors"
              aria-label="다음 달"
            >
              <ChevronRight />
            </button>
          )}
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((wd, i) => (
          <div
            key={wd}
            className={`text-center text-[11px] font-medium tracking-[0.06em] uppercase py-2 ${
              i === 0 ? "text-red-400" : "text-[var(--color-mute)]"
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const isPast = isBefore(day, today);
          const disabled = !inMonth || isPast;
          const rangeStart = isRangeStart(day);
          const rangeEnd = isRangeEnd(day);
          const inRange = isInRange(day);
          const isTodayDate = isToday(day);
          const isSunday = day.getDay() === 0;

          return (
            <div
              key={day.toISOString()}
              className={`relative flex items-center justify-center ${
                inRange ? "bg-[var(--color-bg-tint)]" : ""
              } ${rangeStart ? "rounded-l-full bg-[var(--color-bg-tint)]" : ""} ${
                rangeEnd ? "rounded-r-full bg-[var(--color-bg-tint)]" : ""
              }`}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onDayClick(day)}
                onMouseEnter={() => !disabled && onDayHover(day)}
                onMouseLeave={() => onDayHover(null)}
                className={`
                  relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-medium transition-all duration-150
                  ${disabled ? "text-[var(--color-line)] cursor-default" : "cursor-pointer"}
                  ${!disabled && !rangeStart && !rangeEnd ? "hover:bg-[var(--color-line-soft)]" : ""}
                  ${rangeStart || rangeEnd ? "bg-[var(--color-ink)] text-white" : ""}
                  ${!disabled && !rangeStart && !rangeEnd && isSunday ? "text-red-400" : ""}
                  ${!disabled && !rangeStart && !rangeEnd && !isSunday ? "text-[var(--color-ink)]" : ""}
                `}
              >
                {inMonth ? format(day, "d") : ""}
                {isTodayDate && !rangeStart && !rangeEnd && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-[var(--color-honey-500)]" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Icons ─── */

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
