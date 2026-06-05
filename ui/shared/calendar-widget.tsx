"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
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
  differenceInCalendarDays,
} from "date-fns";
import { ko } from "date-fns/locale";
import { motion } from "framer-motion";
import { MAX_NIGHTS } from "@/domain/shared/constants";

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
  const [currentMonth, setCurrentMonth] = useState(() => today);
  const [activeMode, setActiveMode] = useState<CalendarMode>(initialMode);
  const [hovered, setHovered] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const nextMonth = addMonths(currentMonth, 1);

  // checkOut 모드일 때 선택 가능한 최대 날짜 (checkIn + MAX_NIGHTS)
  const maxCheckOut = useMemo(
    () => (checkIn ? addDays(checkIn, MAX_NIGHTS) : null),
    [checkIn],
  );

  const handleDayClick = useCallback(
    (day: Date) => {
      if (isBefore(day, today)) return;

      if (activeMode === "checkIn") {
        onSelect(day, null);
        setActiveMode("checkOut");
      } else {
        if (checkIn && (isSameDay(day, checkIn) || isBefore(day, checkIn))) {
          onSelect(day, null);
          setActiveMode("checkOut");
        } else {
          // 최대 박수 초과 시 클릭 무시
          if (maxCheckOut && isAfter(day, maxCheckOut)) return;
          onSelect(checkIn, day);
          setTimeout(onClose, 280);
        }
      }
    },
    [activeMode, checkIn, checkOut, maxCheckOut, onSelect, onClose, today],
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
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
      className="bg-white rounded-[6px] shadow-[0_-8px_48px_rgba(0,0,0,0.14),0_-2px_8px_rgba(0,0,0,0.06)] border border-[var(--color-line-soft)] overflow-hidden"
    >
      {/* Mode tabs */}
      <div className="flex border-b border-[var(--color-line-soft)]">
        <button
          type="button"
          onClick={() => setActiveMode("checkIn")}
          className={`flex-1 py-3.5 text-center transition-colors ${
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
          className={`flex-1 py-3.5 text-center transition-colors ${
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
          maxCheckOut={activeMode === "checkOut" ? maxCheckOut : null}
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
          maxCheckOut={activeMode === "checkOut" ? maxCheckOut : null}
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

      {/* Footer — summary */}
      <div className="border-t border-[var(--color-line-soft)] px-6 py-3 text-center">
        {(() => {
          const previewEnd = checkOut ?? (checkIn && hovered && isAfter(hovered, checkIn) ? hovered : null);
          const previewNights = checkIn && previewEnd ? differenceInCalendarDays(previewEnd, checkIn) : 0;
          const isPreview = !checkOut && !!hovered;

          if (!checkIn || previewNights <= 0) {
            return (
              <span className="text-[13px] text-[var(--color-mute)]">
                날짜를 선택해 주세요
              </span>
            );
          }

          return (
            <span className={`text-[13px] font-medium ${isPreview ? "text-[var(--color-ink-3)]" : "text-[var(--color-ink)]"}`}>
              {format(checkIn, "M월 d일 (EEE)", { locale: ko })}
              <span className="text-[var(--color-mute)] mx-2">→</span>
              {format(previewEnd!, "M월 d일 (EEE)", { locale: ko })}
              <span className={`ml-2 inline-flex h-[22px] items-center rounded-full px-2 text-[11px] font-semibold tracking-wide align-middle ${
                isPreview
                  ? "bg-[var(--color-line-soft)] text-[var(--color-ink-3)]"
                  : "bg-[var(--color-bg-tint)] text-[var(--color-honey-700)]"
              }`}>
                {previewNights}박
              </span>
              <span className="ml-1.5 text-[11px] text-[var(--color-mute)]">
                / 최대 {MAX_NIGHTS}박
              </span>
            </span>
          );
        })()}
      </div>
    </motion.div>
  );
}

/* ─────────────── Month Grid ─────────────── */

function MonthGrid({
  month,
  today,
  maxCheckOut,
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
  maxCheckOut: Date | null;
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

          // Out-of-month days: render empty placeholder to keep grid alignment
          if (!inMonth) {
            return <div key={day.toISOString()} className="h-10" />;
          }

          const isPast = isBefore(day, today) || (maxCheckOut != null && isAfter(day, maxCheckOut));
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
                disabled={isPast}
                onClick={() => onDayClick(day)}
                onMouseEnter={() => !isPast && onDayHover(day)}
                onMouseLeave={() => onDayHover(null)}
                className={`
                  relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-medium transition-all duration-150
                  ${isPast ? "text-[var(--color-line)] cursor-default" : "cursor-pointer"}
                  ${!isPast && !rangeStart && !rangeEnd ? "hover:bg-[var(--color-line-soft)]" : ""}
                  ${rangeStart || rangeEnd ? "bg-[var(--color-ink)] text-white" : ""}
                  ${isTodayDate && !rangeStart && !rangeEnd ? "ring-2 ring-[var(--color-honey-500)] font-bold text-[var(--color-ink)]" : ""}
                  ${!isPast && !rangeStart && !rangeEnd && !isTodayDate && isSunday ? "text-red-400" : ""}
                  ${!isPast && !rangeStart && !rangeEnd && !isTodayDate && !isSunday ? "text-[var(--color-ink)]" : ""}
                `}
              >
                {format(day, "d")}
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
