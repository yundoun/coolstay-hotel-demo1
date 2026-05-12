"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useReservation } from "@/lib/reservation/store";
import { formatKoDate, krw, nightsBetween } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "이름을 입력해 주세요.").max(30),
  phone: z
    .string()
    .min(9, "연락 가능한 번호를 입력해 주세요.")
    .regex(/^[0-9+\-\s]+$/u, "숫자와 하이픈만 입력해 주세요."),
  email: z.string().email("올바른 이메일을 입력해 주세요."),
  requests: z.string().max(500).optional(),
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
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: s.guestName,
      phone: s.guestPhone,
      email: s.guestEmail,
      requests: s.guestRequests,
    },
  });

  const onSubmit = handleSubmit((values) => {
    s.setGuestInfo(values);
    if (onNext) onNext();
    else router.push("/reservation?step=4");
  });

  return (
    <div className="mx-auto max-w-[1040px]">
      <span className="eyebrow">Step 03</span>
      <h2 className="t-h2 mt-4">투숙객 정보를 입력해 주세요.</h2>
      <p className="t-body mt-4 text-[var(--color-ink-3)]">
        입력하신 정보는 예약 확인 및 호텔 연락 목적으로만 사용됩니다.
      </p>

      <form onSubmit={onSubmit} className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="이름" error={errors.name?.message} required>
              <input {...register("name")} className="field" placeholder="홍길동" />
            </Field>
            <Field label="휴대폰" error={errors.phone?.message} required>
              <input {...register("phone")} className="field" placeholder="010-1234-5678" inputMode="tel" />
            </Field>
          </div>
          <Field label="이메일" error={errors.email?.message} required>
            <input {...register("email")} className="field" placeholder="guest@coolstay.kr" inputMode="email" />
          </Field>
          <Field label="요청사항 (선택)" hint="예: 고층 객실 선호, 늦은 체크인 예정">
            <textarea {...register("requests")} className="field" rows={5} />
          </Field>
        </div>

        {/* Summary rail */}
        <aside className="border border-[var(--color-line)] bg-white rounded-[2px] h-fit overflow-hidden">
          {storeName && roomName && (
            <>
              {s.apiRoom?.roomImage && (
                <div className="relative aspect-[16/10] w-full bg-[var(--color-line-soft)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.apiRoom.roomImage}
                    alt={roomName ?? ""}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <span className="t-label-caps text-[var(--color-ink-3)]">예약 요약</span>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="t-h4">{storeName}</div>
                  <div className="t-body-sm text-[var(--color-ink-3)]">{roomName}</div>
                </div>
                <div className="my-5 h-px bg-[var(--color-line)]" />
                <div className="flex flex-col gap-3">
                  <Row label="체크인" value={formatKoDate(s.checkIn)} />
                  <Row label="체크아웃" value={formatKoDate(s.checkOut)} />
                  <Row label="기간" value={`${nights}박`} />
                  <Row
                    label="인원"
                    value={`성인 ${s.adults}인${s.children > 0 ? ` · 아동 ${s.children}인` : ""}`}
                  />
                </div>
                <div className="my-5 h-px bg-[var(--color-line)]" />
                <div className="flex items-baseline justify-between">
                  <span className="t-caption text-[var(--color-ink-3)]">예상 합계</span>
                  <span className="t-price-sm">{krw(total)}</span>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Nav */}
        <div className="lg:col-span-2 mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-8">
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
            disabled={!isValid}
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
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="t-caption text-[var(--color-ink-3)]">
        {label}
        {required && <span className="text-[var(--color-ink)]"> *</span>}
      </span>
      {children}
      {hint && !error && <span className="t-caption text-[var(--color-mute)]">{hint}</span>}
      {error && <span className="t-caption text-[var(--color-ink)] border-l-2 border-[var(--color-ink)] pl-2 mt-1">{error}</span>}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="t-caption text-[var(--color-ink-3)]">{label}</span>
      <span className="t-body-sm text-right">{value}</span>
    </div>
  );
}
