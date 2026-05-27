"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { useSubmitReservation } from "@/application/hooks/useSubmitReservation";
import { useTerms } from "@/application/hooks/useTerms";
import {
  formatKoDate,
  krw,
  nightsBetween,
} from "@/domain/shared/utils";

export function Step4Review({ onPrev }: { onPrev?: () => void } = {}) {
  const s = useReservation();
  const { submit, submitting, error } = useSubmitReservation();

  const nights = nightsBetween(s.checkIn, s.checkOut);
  const room = s.apiRoom;

  const { terms, refundPolicies, loading: termsLoading, error: termsError } = useTerms({
    storeKey: room?.motelKey ?? null,
    itemKey: s.roomId,
    packKey: room?.packageKey ?? null,
    checkIn: s.checkIn,
    checkOut: s.checkOut,
  });

  // 동의 항목: 약관 + 취소환불규정
  const agreementItems = useMemo(() => {
    const items: { key: string; label: string; url?: string; required: boolean }[] = [];
    for (const t of terms) {
      items.push({ key: t.code, label: t.name, url: t.url, required: t.required });
    }
    if (refundPolicies.length > 0) {
      items.push({ key: "REFUND_POLICY", label: "취소·환불 규정 동의", required: true });
    }
    return items;
  }, [terms, refundPolicies]);

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [modalTerm, setModalTerm] = useState<{ label: string; url: string } | null>(null);

  const allChecked = agreementItems.length > 0 && agreementItems.every((item) => checked[item.key]);
  const requiredAllChecked = agreementItems.filter((i) => i.required).every((i) => checked[i.key]);

  const handleToggle = useCallback((key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleToggleAll = useCallback(() => {
    const next = !allChecked;
    setChecked(
      Object.fromEntries(agreementItems.map((item) => [item.key, next])),
    );
  }, [allChecked, agreementItems]);

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
        <section className="flex flex-col gap-5 p-5 md:gap-6 md:p-8 md:flex-row md:items-center">
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
        <section className="p-5 md:p-8">
          <span className="t-label-caps text-[var(--color-ink-3)]">투숙 일정</span>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            <SummaryCell label="체크인" value={`${formatKoDate(s.checkIn)} · ${checkInTime}`} />
            <SummaryCell label="체크아웃" value={`${formatKoDate(s.checkOut)} · ${checkOutTime}`} />
            <SummaryCell label="기간" value={`${nights}박 ${nights + 1}일`} />
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)]" />

        {/* Guest */}
        <section className="p-5 md:p-8">
          <span className="t-label-caps text-[var(--color-ink-3)]">투숙객</span>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            <SummaryCell label="이름" value={s.guestName} />
            <SummaryCell label="휴대폰" value={s.guestPhone} />
            <SummaryCell
              label="인원"
              value={`성인 ${s.adults}인`}
            />
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)]" />

        {/* Payment method */}
        <section className="p-5 md:p-8">
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

        {/* Refund policy */}
        {refundPolicies.length > 0 && (
          <>
            <RefundPolicySection policies={refundPolicies} />
            <div className="h-px bg-[var(--color-line)]" />
          </>
        )}

        {/* Payment summary */}
        <section className="p-5 md:p-8">
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

      {/* Consent */}
      <div className="mt-10 flex flex-col gap-4">
        {termsLoading ? (
          <p className="t-caption text-[var(--color-ink-3)]">약관 정보를 불러오는 중...</p>
        ) : termsError ? (
          <p className="t-caption text-red-600">{termsError}</p>
        ) : agreementItems.length > 0 ? (
          <>
            {/* 전체 동의 */}
            <label className="flex items-center gap-3 cursor-pointer border-b border-[var(--color-line)] pb-4">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={handleToggleAll}
                className="h-5 w-5 accent-[var(--color-honey-500)]"
              />
              <span className="t-body-sm font-medium text-[var(--color-ink)]">
                전체 동의
              </span>
            </label>

            {/* 개별 동의 */}
            {agreementItems.map((item) => (
              <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked[item.key] ?? false}
                  onChange={() => handleToggle(item.key)}
                  className="h-4 w-4 accent-[var(--color-honey-500)]"
                />
                <span className="flex-1 t-caption text-[var(--color-ink-2)]">
                  {item.label}
                  {item.required ? (
                    <span className="text-[var(--color-ink)] ml-1">(필수)</span>
                  ) : (
                    <span className="text-[var(--color-ink-3)] ml-1">(선택)</span>
                  )}
                </span>
                {item.url && (
                  <button
                    type="button"
                    className="shrink-0 t-caption text-[var(--color-ink-3)] underline underline-offset-2 hover:text-[var(--color-ink)]"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setModalTerm({ label: item.label, url: item.url! });
                    }}
                  >
                    보기
                  </button>
                )}
              </label>
            ))}
          </>
        ) : (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={handleToggleAll}
              className="mt-1 h-5 w-5 accent-[var(--color-honey-500)]"
            />
            <span className="t-body-sm text-[var(--color-ink-2)]">
              예약 내용을 확인했으며, 이에 동의합니다.
            </span>
          </label>
        )}

        {/* 약관 모달 */}
        {modalTerm && (
          <TermsModal
            title={modalTerm.label}
            url={modalTerm.url}
            onClose={() => setModalTerm(null)}
          />
        )}

        <div className="sticky bottom-0 z-30 -mx-4 mt-2 pointer-events-none px-4 py-4 sm:-mx-0 sm:px-0">
          <div className="pointer-events-auto rounded-lg border border-[var(--color-line)] bg-white/90 backdrop-blur-sm px-4 py-4 flex items-center justify-between">
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
              disabled={!requiredAllChecked || submitting}
              className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "예약 확정 중…" : "예약 확정"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RefundPolicySection({ policies }: { policies: { until: string; percent: number; amount: number }[] }) {
  const [open, setOpen] = useState(false);

  // 무료 취소(100%) 마감일 요약
  const freeCancel = policies.find((p) => p.percent === 100);
  const summary = freeCancel
    ? `${freeCancel.until.replace(/:\d{2}$/, "")}까지 무료 취소 가능`
    : `취소 시 수수료가 발생합니다`;

  return (
    <section className="p-5 md:p-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <div className="flex flex-col gap-1">
          <span className="t-label-caps text-[var(--color-ink-3)]">취소·환불 규정</span>
          <span className="t-caption text-[var(--color-ink-2)]">{summary}</span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`shrink-0 text-[var(--color-ink-3)] transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left t-caption">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                <th className="pb-2 pr-4 font-medium text-[var(--color-ink-3)]">취소 기한</th>
                <th className="pb-2 pr-4 font-medium text-[var(--color-ink-3)] text-right">환불률</th>
                <th className="pb-2 font-medium text-[var(--color-ink-3)] text-right">환불 금액</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p, i) => (
                <tr key={i} className="border-b border-[var(--color-line-soft)]">
                  <td className="py-2 pr-4 text-[var(--color-ink-2)]">
                    {p.until.replace(/:\d{2}$/, "")} 까지
                  </td>
                  <td className="py-2 pr-4 text-right text-[var(--color-ink)]">{p.percent}%</td>
                  <td className="py-2 text-right text-[var(--color-ink)]">{krw(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
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

function TermsModal({ title, url, onClose }: { title: string; url: string; onClose: () => void }) {
  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* dialog */}
      <div
        className="relative w-full max-w-[640px] max-h-[80vh] bg-white rounded-[4px] shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-line)]">
          <h3 className="t-h4">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={url}
            title={title}
            className="w-full h-full min-h-[50vh]"
            sandbox="allow-same-origin"
          />
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-[var(--color-line)]">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary w-full"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
