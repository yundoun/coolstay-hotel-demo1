"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { getHotel, getRoom } from "@/adapters/static/hotel-provider";
import { formatKoDate, krw, nightsBetween } from "@/domain/shared/utils";

export function ReservationCompleteClient() {
  const s = useReservation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isApiMode = Boolean(s.apiRoom);

  useEffect(() => {
    if (!mounted) return;
    if (!s.reservationNumber || !s.hotelId) {
      router.replace("/reservation?step=1");
    }
  }, [mounted, s.reservationNumber, s.hotelId, router]);

  const hotel = s.hotelId ? getHotel(s.hotelId) : null;
  const room = s.roomId ? getRoom(s.roomId) : null;
  const nights = nightsBetween(s.checkIn, s.checkOut);

  const displayRoomName = isApiMode ? s.apiRoom?.roomName : room?.name;
  const displayCheckInTime = isApiMode ? `${s.apiRoom?.checkInTime}:00` : hotel?.checkInTime;
  const displayCheckOutTime = isApiMode ? `${s.apiRoom?.checkOutTime}:00` : hotel?.checkOutTime;
  const total = isApiMode ? (s.apiRoom?.price ?? 0) : (room ? room.basePrice * nights : 0);

  if (!mounted || !hotel || !s.reservationNumber) return null;
  if (!isApiMode && !room) return null;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40svh] min-h-[320px] w-full overflow-hidden">
        <Image src={hotel.heroImage} alt={hotel.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 hero-veil" aria-hidden />
      </section>

      {/* Confirmation */}
      <section className="py-[120px]">
        <div className="container-page max-w-[880px]">
          <div className="flex flex-col items-center text-center">
            <Check strokeWidth={1.5} className="h-10 w-10 text-[var(--color-ink)]" />
            <h1 className="t-h1 mt-8">예약이 완료되었습니다.</h1>
            <div className="mt-5 t-caption text-[var(--color-ink-3)]">
              예약번호 ·{" "}
              <span className="font-[var(--font-serif-en)] text-[15px] tracking-[0.08em] text-[var(--color-ink)]">
                {s.reservationNumber}
              </span>
            </div>
            <p className="t-body mt-6 max-w-[52ch] text-[var(--color-ink-3)]">
              예약 확인 메일이{" "}
              <span className="text-[var(--color-ink)]">{s.guestEmail}</span>로 발송되었습니다.
              <br/>
              호텔에서 체크인 전 상세 안내를 드릴 예정입니다.
            </p>
          </div>

          {/* Summary card */}
          <article className="mt-16 border border-[var(--color-line)] bg-white rounded-[2px]">
            <section className="flex flex-col gap-6 p-8 md:flex-row md:items-center">
              <div className="relative aspect-[16/10] w-full md:w-[280px] shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
                <Image src={hotel.heroImage} alt={hotel.name} fill sizes="280px" className="object-cover" />
              </div>
              <div className="flex-1">
                <span className="t-label-caps text-[var(--color-ink-3)]">
                  {hotel.city} · {hotel.grade}-Star Hotel
                </span>
                <h3 className="t-h3 mt-2">{hotel.name}</h3>
                <div className="mt-4 t-h4">{displayRoomName}</div>
                {!isApiMode && room && (
                  <div className="t-caption text-[var(--color-ink-3)] mt-1">
                    {room.sizeSqm}㎡ · {room.bedType}베드 · {room.view}
                  </div>
                )}
              </div>
            </section>

            <div className="h-px bg-[var(--color-line)]" />

            <section className="p-8">
              <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                <Row label="체크인" value={`${formatKoDate(s.checkIn)} · ${displayCheckInTime}`} />
                <Row label="체크아웃" value={`${formatKoDate(s.checkOut)} · ${displayCheckOutTime}`} />
                <Row label="기간" value={`${nights}박 ${nights + 1}일`} />
                <Row label="인원" value={`성인 ${s.adults}${s.children > 0 ? ` · 아동 ${s.children}` : ""}`} />
              </div>
            </section>

            <div className="h-px bg-[var(--color-line)]" />

            <section className="p-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Row label="투숙객" value={s.guestName} />
                <Row label="연락처" value={s.guestPhone} />
                <Row label="이메일" value={s.guestEmail} />
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

            <section className="p-8">
              <div className="flex items-baseline justify-between">
                <span className="t-h4">결제 예정 합계</span>
                <span className="t-price">{krw(total)}</span>
              </div>
              <div className="mt-3 t-caption text-[var(--color-ink-3)]">
                현장결제 — 체크인 시 호텔 프론트에서 결제가 진행됩니다.
              </div>
            </section>
          </article>

          {/* Footer actions */}
          <div className="mt-12 flex flex-col items-center gap-4 border-t border-[var(--color-line)] pt-8 md:flex-row md:justify-center md:gap-10">
            <Link href="/" className="btn-tertiary">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="t-caption text-[var(--color-ink-3)]">{label}</div>
      <div className="t-body-sm text-[var(--color-ink)] mt-1">{value}</div>
    </div>
  );
}
