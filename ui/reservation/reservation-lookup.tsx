"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, AlertCircle } from "lucide-react";
import { useReservationLookup } from "@/application/hooks/useReservationLookup";
import { siteHotel } from "@/hotel-data/hotel";
import { krw } from "@/domain/shared/utils";
import type { BookingItem, BookingStatus } from "@/domain/reservation/types";
import { cn } from "@/ui/lib/cn";

/* ── 상수 ── */

const STATUS_MAP: Record<BookingStatus, { label: string; color: string }> = {
  BEFORE: { label: "이용 전", color: "bg-[var(--color-honey-500)] text-[var(--color-ink)]" },
  AFTER: { label: "이용 완료", color: "bg-[var(--color-ink)] text-white" },
  CANCEL: { label: "취소됨", color: "bg-[var(--color-mute)] text-white" },
};

const PAYMENT_METHOD_MAP: Record<string, string> = {
  SITE: "현장결제",
  CARD: "신용카드",
  ACCOUNT_TRANSFER: "계좌이체",
  PHONE: "휴대폰",
  TOSS_PAY: "토스페이",
  TOSSPAY: "토스페이",
  KAKAO_PAY: "카카오페이",
  KAKAOPAY: "카카오페이",
  NAVER_PAY: "네이버페이",
  NAVERPAY: "네이버페이",
};

const ease = [0.2, 0.7, 0.2, 1] as const;

/* ── 날짜 포맷 (timestamp → 표시) ── */

function formatBookingDate(raw: string): string {
  if (!raw) return "—";
  // timestamp(초) 형식이면 변환
  const ts = Number(raw);
  if (!isNaN(ts) && ts > 1_000_000_000) {
    const d = new Date(ts * 1000);
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()} (${["일", "월", "화", "수", "목", "금", "토"][d.getDay()]})`;
  }
  // ISO or yyyyMMddHHmmss
  if (raw.length === 14) {
    const y = raw.slice(0, 4);
    const m = raw.slice(4, 6);
    const dd = raw.slice(6, 8);
    const hh = raw.slice(8, 10);
    const mm = raw.slice(10, 12);
    return `${y}. ${Number(m)}. ${Number(dd)} ${hh}:${mm}`;
  }
  return raw;
}

function formatBookingTime(raw: string): string {
  if (!raw) return "";
  const ts = Number(raw);
  if (!isNaN(ts) && ts > 1_000_000_000) {
    const d = new Date(ts * 1000);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  if (raw.length === 14) {
    return `${raw.slice(8, 10)}:${raw.slice(10, 12)}`;
  }
  return "";
}

/* ── 전화번호 포맷 ── */

function formatPhone(v: string): string {
  const d = v.replace(/\D/g, "");
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
}

/* ── 메인 컴포넌트 ── */

export function ReservationLookup() {
  const { state, lookup, reset } = useReservationLookup();
  const [bookId, setBookId] = useState("");
  const [phone, setPhone] = useState("");

  const canSubmit = bookId.trim().length > 0 && phone.replace(/\D/g, "").length >= 10;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    lookup(bookId.trim(), phone.replace(/\D/g, ""));
  }

  function handleReset() {
    reset();
    setBookId("");
    setPhone("");
  }

  return (
    <>
      {/* Hero — compact */}
      <section className="relative h-[35svh] min-h-[280px] w-full overflow-hidden">
        <Image
          src={siteHotel.heroImage}
          alt={siteHotel.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 hero-veil" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-center text-white"
          >
            <p className="t-label-caps tracking-[0.2em] opacity-80">Reservation</p>
            <h1 className="t-h1 mt-3">예약 내역 조회</h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-[100px] md:py-[120px]">
        <div className="container-page max-w-[720px]">
          <AnimatePresence mode="wait">
            {state.phase === "idle" || state.phase === "loading" || state.phase === "error" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
              >
                {/* Intro */}
                <div className="text-center">
                  <span className="eyebrow">Booking Inquiry</span>
                  <h2 className="t-h2 mt-4">예약 확인</h2>
                  <p className="t-body mt-4 text-[var(--color-ink-3)] max-w-[44ch] mx-auto">
                    예약 시 사용하신 전화번호와 예약번호를 입력하시면<br className="hidden sm:inline" />
                    예약 내역을 확인하실 수 있습니다.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-14">
                  <div className="space-y-5">
                    {/* 예약번호 */}
                    <div>
                      <label htmlFor="lookup-book-id" className="t-caption text-[var(--color-ink-3)] mb-2 block">
                        예약번호
                      </label>
                      <input
                        id="lookup-book-id"
                        type="text"
                        value={bookId}
                        onChange={(e) => setBookId(e.target.value)}
                        placeholder="CS-20260512-ABCD"
                        className="field w-full"
                        autoComplete="off"
                      />
                    </div>

                    {/* 전화번호 */}
                    <div>
                      <label htmlFor="lookup-phone" className="t-caption text-[var(--color-ink-3)] mb-2 block">
                        전화번호
                      </label>
                      <input
                        id="lookup-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        placeholder="010-1234-5678"
                        maxLength={13}
                        className="field w-full"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {state.phase === "error" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 flex items-start gap-3 rounded-[2px] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-4">
                          <AlertCircle size={18} strokeWidth={1.5} className="mt-px shrink-0 text-[var(--color-ink-3)]" />
                          <p className="t-body-sm text-[var(--color-ink-2)]">{state.message}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!canSubmit || state.phase === "loading"}
                    className="btn btn-primary w-full mt-8"
                  >
                    {state.phase === "loading" ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        조회 중
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search size={18} strokeWidth={1.5} />
                        예약 조회
                      </span>
                    )}
                  </button>
                </form>

                {/* Help text */}
                <p className="mt-8 text-center t-caption text-[var(--color-mute)]">
                  예약번호는 예약 완료 시 안내된 번호입니다.
                </p>
              </motion.div>
            ) : (
              /* ── 조회 결과 ── */
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
              >
                {/* Back button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 t-body-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors cursor-pointer bg-transparent border-none mb-10"
                >
                  <ArrowLeft size={16} strokeWidth={1.5} />
                  다시 조회하기
                </button>

                {state.books.length === 0 ? (
                  /* Empty state */
                  <div className="text-center py-16">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-soft)] border border-[var(--color-line)]">
                      <Search size={24} strokeWidth={1.2} className="text-[var(--color-mute)]" />
                    </div>
                    <h3 className="t-h3 mt-6">예약 내역이 없습니다</h3>
                    <p className="t-body mt-3 text-[var(--color-ink-3)] max-w-[36ch] mx-auto">
                      입력하신 정보와 일치하는 예약을 찾을 수 없습니다. 예약번호와 전화번호를 다시 확인해주세요.
                    </p>
                  </div>
                ) : (
                  /* Booking cards */
                  <div className="space-y-6">
                    <div className="text-center mb-12">
                      <span className="eyebrow">Result</span>
                      <h2 className="t-h2 mt-4">예약 내역</h2>
                      <p className="t-body-sm mt-3 text-[var(--color-ink-3)]">
                        총 {state.books.length}건의 예약이 확인되었습니다.
                      </p>
                    </div>

                    {state.books.map((book, i) => (
                      <motion.div
                        key={book.bookId}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                      >
                        <BookingCard booking={book} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-14 flex flex-col items-center gap-4 border-t border-[var(--color-line)] pt-8 md:flex-row md:justify-center md:gap-10">
                  <Link href="/" className="btn-tertiary">
                    홈으로 돌아가기
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

/* ── 예약 카드 ── */

function BookingCard({ booking }: { booking: BookingItem }) {
  const statusInfo = STATUS_MAP[booking.status] ?? STATUS_MAP.BEFORE;
  const paymentLabel = PAYMENT_METHOD_MAP[booking.payment.method] ?? booking.payment.method;
  const checkInDate = formatBookingDate(booking.checkIn);
  const checkOutDate = formatBookingDate(booking.checkOut);
  const checkInTime = formatBookingTime(booking.checkIn);
  const checkOutTime = formatBookingTime(booking.checkOut);

  return (
    <article className="border border-[var(--color-line)] bg-white rounded-[2px] overflow-hidden">
      {/* Header — hotel + room with image */}
      <section className="flex flex-col gap-5 p-6 sm:p-8 sm:flex-row sm:items-center">
        {booking.roomImage && (
          <div className="relative aspect-[16/10] w-full sm:w-[200px] shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={booking.roomImage}
              alt={booking.roomName}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn("inline-flex px-2.5 py-1 rounded-[2px] text-[11px] font-semibold tracking-[0.04em]", statusInfo.color)}>
              {statusInfo.label}
            </span>
            <span className="t-caption text-[var(--color-mute)]">
              {booking.bookId}
            </span>
          </div>
          <h3 className="t-h4 mt-3">{booking.storeName || siteHotel.name}</h3>
          <p className="t-body-sm text-[var(--color-ink-2)] mt-1">{booking.roomName}</p>
        </div>
      </section>

      <div className="h-px bg-[var(--color-line)]" />

      {/* Schedule */}
      <section className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Row label="체크인" value={checkInTime ? `${checkInDate} · ${checkInTime}` : checkInDate} />
          <Row label="체크아웃" value={checkOutTime ? `${checkOutDate} · ${checkOutTime}` : checkOutDate} />
        </div>
      </section>

      <div className="h-px bg-[var(--color-line)]" />

      {/* Guest info */}
      <section className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Row label="예약자" value={booking.guestName || "—"} />
          <Row label="연락처" value={booking.guestPhone ? formatPhone(booking.guestPhone) : "—"} />
        </div>
      </section>

      <div className="h-px bg-[var(--color-line)]" />

      {/* Payment */}
      <section className="p-6 sm:p-8">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="t-caption text-[var(--color-ink-3)]">결제 금액</span>
            <p className="t-caption text-[var(--color-mute)] mt-0.5">{paymentLabel}</p>
          </div>
          <span className="t-price-sm">{krw(booking.totalPrice)}</span>
        </div>
      </section>
    </article>
  );
}

/* ── Row 서브컴포넌트 ── */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="t-caption text-[var(--color-ink-3)]">{label}</div>
      <div className="t-body-sm text-[var(--color-ink)] mt-1">{value}</div>
    </div>
  );
}
