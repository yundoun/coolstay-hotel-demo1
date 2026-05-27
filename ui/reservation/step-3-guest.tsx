"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { usePhoneVerification } from "@/application/hooks/usePhoneVerification";
import { formatKoDate, krw, nightsBetween } from "@/domain/shared/utils";

const schema = z.object({
  name: z.string().min(2, "이름을 입력해 주세요.").max(30),
  phone: z
    .string()
    .min(9, "연락 가능한 번호를 입력해 주세요.")
    .regex(/^[0-9+\-\s]+$/u, "숫자와 하이픈만 입력해 주세요."),
});

type FormValues = z.infer<typeof schema>;

export function Step3Guest({ onNext, onPrev }: { onNext?: () => void; onPrev?: () => void } = {}) {
  const s = useReservation();
  const router = useRouter();
  const nights = nightsBetween(s.checkIn, s.checkOut);
  const storeName = s.apiRoom?.storeName ?? null;
  const roomName = s.apiRoom?.roomName ?? null;
  const total = s.apiRoom?.price ?? 0;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: s.guestName,
      phone: s.guestPhone,
    },
  });

  const phoneValue = watch("phone");
  const v = usePhoneVerification();
  const [code, setCode] = useState("");
  const codeInputRef = useRef<HTMLInputElement>(null);

  // 번호 변경 시 인증 초기화
  const prevPhoneRef = useRef(phoneValue);
  useEffect(() => {
    if (prevPhoneRef.current !== phoneValue && v.status !== "idle") {
      v.resetVerification();
      s.setPhoneVerified(false);
      setCode("");
    }
    prevPhoneRef.current = phoneValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneValue]);

  // 인증 완료 시 store 반영
  useEffect(() => {
    if (v.status === "verified") {
      s.setPhoneVerified(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.status]);

  const handleSend = () => {
    v.send(phoneValue);
    setCode("");
    setTimeout(() => codeInputRef.current?.focus(), 100);
  };

  const handleVerify = () => {
    v.verify(code);
  };

  const canSubmit = isValid && v.status === "verified";

  const onSubmit = handleSubmit((values) => {
    if (!canSubmit) return;
    s.setGuestInfo(values);
    if (onNext) onNext();
    else router.push("/reservation?step=4");
  });

  return (
    <div className="mx-auto max-w-[960px]">
      <span className="eyebrow">Step 03</span>
      <h2 className="t-h2 mt-4">투숙객 정보를 입력해 주세요.</h2>
      <p className="t-body mt-4 text-[var(--color-ink-3)]">
        입력하신 정보는 예약 확인 및 호텔 연락 목적으로만 사용됩니다.
      </p>

      {/* Compact summary card */}
      {storeName && roomName && (
        <div className="mt-14 border border-[var(--color-line)] bg-white rounded-[2px] overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {s.apiRoom?.roomImage && (
              <div className="relative aspect-[16/10] sm:aspect-auto sm:w-[240px] shrink-0 bg-[var(--color-line-soft)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.apiRoom.roomImage}
                  alt={roomName ?? ""}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex flex-col gap-1">
                <div className="t-h4">{storeName}</div>
                <div className="t-body-sm text-[var(--color-ink-3)]">{roomName}</div>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 t-caption text-[var(--color-ink-3)]">
                <span>{formatKoDate(s.checkIn)} → {formatKoDate(s.checkOut)}</span>
                <span>{nights}박 · 성인 {s.adults}인</span>
              </div>
              <div className="shrink-0 text-right">
                <div className="t-caption text-[var(--color-ink-3)]">예상 합계</div>
                <div className="t-price-sm mt-0.5">{krw(total)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest form */}
      <form onSubmit={onSubmit} className="mt-10">
        {/* 이름 */}
        <div className="mb-6">
          <Field label="이름" error={errors.name?.message} required>
            <input {...register("name")} className="field" placeholder="홍길동" />
          </Field>
        </div>

        {/* 휴대폰 + 인증 */}
        <p className="mb-4 t-caption text-[var(--color-mute)]">
          * 데모 환경입니다. 아무 번호나 입력 후 인증요청 → 아무 6자리 입력 → 확인을 눌러 주세요.
        </p>
        <div className="mb-2">
          <Field label="휴대폰" error={errors.phone?.message} required>
            <div className="flex gap-3">
              <input
                {...register("phone")}
                className="field flex-1"
                placeholder="010-1234-5678"
                inputMode="tel"
                readOnly={v.status === "verified"}
              />
              {v.status === "verified" ? (
                <span className="inline-flex items-center gap-1.5 shrink-0 h-[48px] md:h-[56px] px-4 md:px-5 rounded-[2px] bg-[var(--color-bg-tint)] border border-[var(--color-line)] t-caption text-[var(--color-ink-3)]">
                  <CheckIcon />
                  인증완료
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!phoneValue || phoneValue.replace(/[^0-9]/g, "").length < 10 || v.status === "sending"}
                  className="shrink-0 h-[48px] md:h-[56px] px-4 md:px-5 rounded-[2px] border border-[var(--color-ink)] bg-[var(--color-ink)] text-white t-caption font-medium hover:bg-[var(--color-ink-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {v.status === "sending"
                    ? "전송 중…"
                    : v.status === "sent" || v.status === "expired"
                      ? "재전송"
                      : "인증요청"}
                </button>
              )}
            </div>
          </Field>
        </div>

        {/* 인증번호 입력 영역 */}
        {(v.status === "sent" || v.status === "verifying" || v.status === "expired") && (
          <div className="mb-6 ml-0">
            <div className="flex gap-3 items-start">
              <div className="flex-1 relative">
                <input
                  ref={codeInputRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="인증번호 6자리"
                  className="field w-full pr-[72px] tracking-[0.2em] font-medium"
                  disabled={v.status === "expired"}
                />
                {v.status === "sent" && v.formatRemaining && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 t-caption tabular-nums text-[var(--color-honey-700)] font-medium">
                    {v.formatRemaining}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleVerify}
                disabled={code.length < 6 || v.status === "verifying" || v.status === "expired"}
                className="shrink-0 h-[48px] md:h-[56px] px-4 md:px-5 rounded-[2px] border border-[var(--color-ink)] text-[var(--color-ink)] t-caption font-medium hover:bg-[var(--color-ink)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {v.status === "verifying" ? "확인 중…" : "확인"}
              </button>
            </div>
            {v.status === "expired" && (
              <p className="mt-2 t-caption text-[var(--color-ink)] border-l-2 border-[var(--color-ink)] pl-2">
                인증 시간이 만료되었습니다. 재전송해 주세요.
              </p>
            )}
            {v.error && (
              <p className="mt-2 t-caption text-[var(--color-ink)] border-l-2 border-[var(--color-ink)] pl-2">
                {v.error}
              </p>
            )}
          </div>
        )}

        {/* 인증 완료 확인 메시지 */}
        {v.status === "verified" && (
          <p className="mb-6 t-caption text-[var(--color-ink-3)]">
            휴대폰 본인인증이 완료되었습니다.
          </p>
        )}

        {/* Nav */}
        <div className="mt-10 flex items-center justify-between border-t border-[var(--color-line)] pt-8">
          {onPrev ? (
            <button type="button" onClick={onPrev} className="btn btn-secondary">
              ← 이전
            </button>
          ) : (
            <Link href="/reservation?step=2" className="btn btn-secondary">
              ← 이전
            </Link>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            다음 →
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  error,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="t-caption text-[var(--color-ink-3)]">
        {label}
        {required && <span className="text-[var(--color-ink)]"> *</span>}
      </span>
      {children}
      {error && (
        <span className="t-caption text-[var(--color-ink)] border-l-2 border-[var(--color-ink)] pl-2 mt-1">
          {error}
        </span>
      )}
    </label>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
