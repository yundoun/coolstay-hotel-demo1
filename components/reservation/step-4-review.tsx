"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useReservation } from "@/lib/reservation-store";
import { getHotel, getRoom } from "@/lib/hotels";
import {
  formatKoDate,
  generateReservationNumber,
  krw,
  nightsBetween,
} from "@/lib/utils";

export function Step4Review() {
  const s = useReservation();
  const router = useRouter();
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hotel = s.hotelId ? getHotel(s.hotelId) : null;
  const room = s.roomId ? getRoom(s.roomId) : null;
  const nights = nightsBetween(s.checkIn, s.checkOut);
  const total = room ? room.basePrice * nights : 0;

  if (!hotel || !room) return null;

  const onConfirm = () => {
    if (!agree || submitting) return;
    setSubmitting(true);
    const num = generateReservationNumber();
    s.setReservationNumber(num);
    // Small delay for feedback
    setTimeout(() => {
      router.push("/reservation/complete");
    }, 280);
  };

  return (
    <div className="mx-auto max-w-[960px]">
      <span className="eyebrow">Step 04</span>
      <h2 className="t-h2 mt-4">예약 내용을 확인해 주세요.</h2>
      <p className="t-body mt-4 text-[var(--color-ink-3)]">
        아래 내용을 최종 확인하신 후 예약을 확정해 주세요.
      </p>

      <article className="mt-12 border border-[var(--color-line)] bg-white rounded-[2px]">
        {/* Hotel + Room */}
        <section className="flex flex-col gap-6 p-8 md:flex-row md:items-center">
          <div className="relative aspect-[16/10] w-full md:w-[280px] shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
            <Image src={hotel.heroImage} alt={hotel.name} fill sizes="280px" className="object-cover" />
          </div>
          <div className="flex-1">
            <span className="t-label-caps text-[var(--color-ink-3)]">
              {hotel.city} · {hotel.grade}-Star Hotel
            </span>
            <h3 className="t-h3 mt-2">{hotel.name}</h3>
            <div className="mt-1 t-body-sm text-[var(--color-ink-3)]">{hotel.address}</div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="t-h4">{room.name}</div>
              <div className="t-caption text-[var(--color-ink-3)]">
                {room.sizeSqm}㎡ · {room.bedType}베드 · {room.view} · 최대 {room.maxOccupancy}인
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)]" />

        {/* Schedule */}
        <section className="p-8">
          <span className="t-label-caps text-[var(--color-ink-3)]">투숙 일정</span>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            <SummaryCell label="체크인" value={`${formatKoDate(s.checkIn)} · ${hotel.checkInTime}`} />
            <SummaryCell label="체크아웃" value={`${formatKoDate(s.checkOut)} · ${hotel.checkOutTime}`} />
            <SummaryCell label="기간" value={`${nights}박 ${nights + 1}일`} />
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)]" />

        {/* Guest */}
        <section className="p-8">
          <span className="t-label-caps text-[var(--color-ink-3)]">투숙객</span>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <SummaryCell label="이름" value={s.guestName} />
            <SummaryCell label="휴대폰" value={s.guestPhone} />
            <SummaryCell label="이메일" value={s.guestEmail} />
            <SummaryCell
              label="인원"
              value={`성인 ${s.adults}인${s.children > 0 ? ` · 아동 ${s.children}인` : ""}`}
            />
          </div>
          {s.guestRequests && (
            <div className="mt-6">
              <span className="t-label-caps text-[var(--color-ink-3)]">요청사항</span>
              <p className="mt-2 t-body-sm text-[var(--color-ink)] whitespace-pre-wrap">
                {s.guestRequests}
              </p>
            </div>
          )}
        </section>

        <div className="h-px bg-[var(--color-line)]" />

        {/* Payment summary */}
        <section className="p-8">
          <span className="t-label-caps text-[var(--color-ink-3)]">결제 요약</span>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex justify-between t-body-sm text-[var(--color-ink-2)]">
              <span>
                {krw(room.basePrice)} × {nights}박
              </span>
              <span>{krw(total)}</span>
            </div>
            <div className="flex justify-between t-body-sm text-[var(--color-ink-3)]">
              <span>세금 및 봉사료</span>
              <span>호텔 결제 시 안내</span>
            </div>
          </div>
          <div className="mt-6 h-px bg-[var(--color-line)]" />
          <div className="mt-6 flex items-baseline justify-between">
            <span className="t-h4">합계</span>
            <span className="t-price">{krw(total)}</span>
          </div>
        </section>
      </article>

      {/* Consent + confirm */}
      <div className="mt-10 flex flex-col gap-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-5 w-5 accent-[var(--color-honey-500)]"
          />
          <span className="t-body-sm text-[var(--color-ink-2)]">
            예약 내용을 확인했으며, 이에 동의합니다. 실제 결제는 호텔에서 안내드리며,
            본 데모는 결제가 진행되지 않습니다.
          </span>
        </label>

        <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-8">
          <Link href="/reservation?step=3" className="btn btn-secondary">
            ← 이전
          </Link>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!agree || submitting}
            className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "예약 확정 중…" : "예약 확정"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="t-caption text-[var(--color-ink-3)]">{label}</div>
      <div className="t-body-sm text-[var(--color-ink)] mt-1">{value}</div>
    </div>
  );
}
