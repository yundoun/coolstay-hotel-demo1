"use client";

import Link from "next/link";
import { useState } from "react";
import { useReservation } from "@/lib/reservation/store";
import { useSubmitReservation } from "@/lib/reservation/useSubmitReservation";
import {
  formatKoDate,
  krw,
  nightsBetween,
} from "@/lib/utils";

export function Step4Review({ onPrev }: { onPrev?: () => void } = {}) {
  const s = useReservation();
  const { submit, submitting, error } = useSubmitReservation();
  const [agree, setAgree] = useState(false);

  const nights = nightsBetween(s.checkIn, s.checkOut);
  const room = s.apiRoom;

  if (!room) return null;

  const checkInTime = room.checkInTime ? `${room.checkInTime}:00` : "";
  const checkOutTime = room.checkOutTime ? `${room.checkOutTime}:00` : "";

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
          {room.roomImage && (
            <div className="relative aspect-[16/10] w-full md:w-[280px] shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={room.roomImage} alt={room.roomName} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="t-h3">{room.storeName}</h3>
            <div className="mt-4 flex flex-col gap-1">
              <div className="t-h4">{room.roomName}</div>
              {room.maxGuests && (
                <div className="t-caption text-[var(--color-ink-3)]">
                  최대 {room.maxGuests}인
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)]" />

        {/* Schedule */}
        <section className="p-8">
          <span className="t-label-caps text-[var(--color-ink-3)]">투숙 일정</span>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            <SummaryCell label="체크인" value={`${formatKoDate(s.checkIn)} · ${checkInTime}`} />
            <SummaryCell label="체크아웃" value={`${formatKoDate(s.checkOut)} · ${checkOutTime}`} />
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

        {/* Payment method */}
        <section className="p-8">
          <span className="t-label-caps text-[var(--color-ink-3)]">결제수단</span>
          <div className="mt-4">
            <label className="flex items-center gap-3 border border-[var(--color-ink)] rounded-[2px] px-5 py-4 cursor-pointer bg-[var(--color-bg-tint)]">
              <input
                type="radio"
                name="payment"
                checked
                readOnly
                className="h-4 w-4 accent-[var(--color-ink)]"
              />
              <div className="flex-1">
                <span className="t-body-sm font-medium text-[var(--color-ink)]">현장결제</span>
                <span className="t-caption text-[var(--color-ink-3)] ml-2">체크인 시 프론트에서 결제</span>
              </div>
            </label>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)]" />

        {/* Payment summary */}
        <section className="p-8">
          <span className="t-label-caps text-[var(--color-ink-3)]">결제 요약</span>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex justify-between t-body-sm text-[var(--color-ink-2)]">
              <span>
                {nights}박 합계
              </span>
              <span>{krw(room.price)}</span>
            </div>
            <div className="flex justify-between t-body-sm text-[var(--color-ink-3)]">
              <span>세금 및 봉사료</span>
              <span>호텔 결제 시 안내</span>
            </div>
          </div>
          <div className="mt-6 h-px bg-[var(--color-line)]" />
          <div className="mt-6 flex items-baseline justify-between">
            <span className="t-h4">합계</span>
            <span className="t-price">{krw(room.price)}</span>
          </div>
        </section>
      </article>

      {/* Error */}
      {error && (
        <div className="mt-8 border border-red-300 bg-red-50 rounded-[2px] px-6 py-4 t-body-sm text-red-700">
          {error}
        </div>
      )}

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
          {onPrev ? (
            <button type="button" onClick={onPrev} className="btn btn-secondary">
              ← 이전
            </button>
          ) : (
            <Link href="/reservation?step=3" className="btn btn-secondary">
              ← 이전
            </Link>
          )}
          <button
            type="button"
            onClick={submit}
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
