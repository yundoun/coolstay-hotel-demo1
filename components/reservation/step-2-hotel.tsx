"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { siteHotel, siteRooms, SITE_HOTEL_ID, getRoom } from "@/lib/hotels";
import { useReservation } from "@/lib/reservation-store";
import { cn, krw, nightsBetween } from "@/lib/utils";
import type { Room } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";

export function Step2Hotel({ onNext, onPrev }: { onNext?: () => void; onPrev?: () => void } = {}) {
  const s = useReservation();
  const nights = nightsBetween(s.checkIn, s.checkOut);

  // Auto-select the site hotel + reset room selection
  useEffect(() => {
    if (s.hotelId !== SITE_HOTEL_ID) {
      s.setHotel(SITE_HOTEL_ID); // also resets roomId
    } else {
      s.setRoom(null); // clear stale roomId from sessionStorage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canNext = Boolean(s.roomId && nights > 0);
  const selectedRoom = s.roomId ? getRoom(s.roomId) : null;
  const total = selectedRoom && nights > 0 ? selectedRoom.basePrice * nights : 0;


  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <span className="eyebrow">Step 02</span>
      <h2 className="t-h2 mt-4">객실을 선택하세요.</h2>
      <p className="t-body mt-4 text-[var(--color-ink-3)]">
        {nights > 0
          ? `${nights}박 일정에 맞는 객실을 선택해 주세요.`
          : "객실을 선택해 주세요."}
      </p>

      {/* Room list */}
      <section className="mt-10 border border-[var(--color-line)] bg-white rounded-[2px] overflow-hidden">
        <div className="divide-y divide-[var(--color-line)]">
          {siteRooms.map((r) => {
            const isSelected = s.roomId === r.id;
            const roomTotal = nights > 0 ? nights * r.basePrice : r.basePrice;

            return (
              <div
                key={r.id}
                className={cn(
                  "flex flex-col sm:flex-row gap-4 p-5 transition-colors",
                  isSelected && "bg-[var(--color-bg-tint)]",
                )}
              >
                {/* Room image */}
                <div className="relative aspect-[4/3] w-full sm:w-[160px] shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
                  <Image
                    src={r.images[0]}
                    alt={r.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>

                {/* Room info */}
                <div className="flex flex-1 flex-col gap-2 min-w-0">
                  <span className="t-label-caps text-[var(--color-ink-3)]">
                    {r.tier}
                  </span>
                  <h3 className="t-h4">{r.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-ink-2)]">
                    <span>{r.sizeSqm}㎡</span>
                    <Dot />
                    <span>{r.bedType}베드</span>
                    <Dot />
                    <span>{r.view}</span>
                    <Dot />
                    <span>최대 {r.maxOccupancy}인</span>
                  </div>
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {r.amenities.slice(0, 4).map((a) => (
                      <li
                        key={a}
                        className="border border-[var(--color-line)] px-2 py-0.5 text-[11px] text-[var(--color-ink-3)]"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price + select */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:min-w-[140px] shrink-0">
                  <div className="text-right">
                    <div className="t-caption text-[var(--color-ink-3)]">1박 기준</div>
                    <div className="t-price-sm mt-0.5">{krw(r.basePrice)}</div>
                    {nights > 0 && (
                      <div className="t-caption text-[var(--color-ink-3)] mt-0.5">
                        {nights}박 · {krw(roomTotal)}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => s.setRoom(r.id)}
                    className={cn(
                      "btn btn-sm",
                      isSelected ? "btn-primary" : "btn-secondary",
                    )}
                  >
                    {isSelected ? "선택됨" : "선택"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nav */}
      {onNext ? (
        /* 인라인 모드: 이전/다음 버튼 나란히 */
        <div className="mt-16 flex items-center justify-between border-t border-[var(--color-line)] pt-8">
          <button type="button" onClick={onPrev} className="btn btn-secondary">
            ← 이전
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            다음 단계 →
          </button>
        </div>
      ) : (
        <>
          {/* 페이지 모드: 이전 버튼 + sticky 하단 바 */}
          <div className="mt-16 flex items-center border-t border-[var(--color-line)] pt-8">
            <Link href="/reservation?step=1" className="btn btn-secondary">
              ← 이전
            </Link>
          </div>

          <AnimatePresence>
            {canNext && selectedRoom && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-line)] bg-white/95 backdrop-blur-sm shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-[var(--page-gutter)] py-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
                      <Image
                        src={siteHotel.heroImage}
                        alt={siteHotel.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="t-body-sm font-semibold truncate">
                        {selectedRoom.name}
                      </div>
                      <div className="t-caption text-[var(--color-ink-3)] truncate">
                        {nights}박 · {krw(total)}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/reservation?step=3"
                    className="btn btn-primary shrink-0"
                  >
                    다음 단계 →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function Dot() {
  return <span className="text-[var(--color-mute)]">·</span>;
}
