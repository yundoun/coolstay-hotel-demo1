"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_HOTEL_ID, siteHotel } from "@/hotel-data/hotel";
import { useReservation } from "@/adapters/zustand/reservation-store";
import type { ApiRoom } from "@/adapters/coolstay/types";
import { useApiRooms } from "@/application/hooks/useApiRooms";
import { cn } from "@/ui/lib/cn";
import { krw, nightsBetween } from "@/domain/shared/utils";
import { AnimatePresence, motion } from "framer-motion";

export function Step2Hotel({ onNext, onPrev }: { onNext?: () => void; onPrev?: () => void } = {}) {
  const s = useReservation();
  const nights = nightsBetween(s.checkIn, s.checkOut);
  const { storeData, loading, error } = useApiRooms(s.checkIn, s.checkOut, nights);

  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  // Auto-select the site hotel
  useEffect(() => {
    if (s.hotelId !== SITE_HOTEL_ID) {
      s.setHotel(SITE_HOTEL_ID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // storeData 변경 시 선택 초기화
  useEffect(() => {
    if (storeData) {
      setSelectedPkg(null);
    }
  }, [storeData]);

  const selectedRoom = storeData?.rooms.find((r) => r.packageKey === selectedPkg) ?? null;

  const handleSelect = (room: ApiRoom) => {
    if (!storeData) return;
    setSelectedPkg(room.packageKey);
    s.setRoom(room.itemKey);
    s.setApiRoom({
      motelKey: storeData.motelKey,
      storeName: storeData.storeName,
      sitePayment: storeData.sitePayment,
      packageKey: room.packageKey,
      roomName: room.name,
      roomImage: room.image,
      maxGuests: room.maxGuests,
      price: room.price,
      dailyPrices: room.dailyPrices,
      checkInTime: room.checkInTime,
      checkOutTime: room.checkOutTime,
    });
  };

  const hasRooms = Boolean(storeData && storeData.rooms.length > 0);
  const canNext = Boolean(selectedPkg && nights > 0);

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <span className="eyebrow">Step 02</span>
      <h2 className="t-h2 mt-4">객실을 선택하세요.</h2>
      <p className="t-body mt-4 text-[var(--color-ink-3)]">
        {storeData
          ? `${storeData.storeName} · ${nights}박 일정에 맞는 객실을 선택해 주세요.`
          : `${nights}박 일정에 맞는 객실을 선택해 주세요.`}
      </p>

      {/* Loading */}
      {loading && (
        <div className="mt-10 flex items-center justify-center py-20 text-[var(--color-ink-3)] t-body-sm">
          객실 정보를 불러오는 중...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-10 border border-red-300 bg-red-50 rounded-[2px] px-6 py-4 t-body-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && storeData && storeData.rooms.length === 0 && (
        <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-tint)] text-[var(--color-ink-3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
              <path d="M21 7L12 2 3 7" />
              <line x1="12" y1="11" x2="12" y2="15" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="t-h4 mt-5">선택하신 일정에 예약 가능한 객실이 없습니다</p>
          <p className="t-body-sm mt-2 text-[var(--color-ink-3)]">
            날짜를 변경하시면 더 많은 객실을 확인하실 수 있습니다.
          </p>
          {onPrev ? (
            <button type="button" onClick={onPrev} className="btn btn-secondary mt-6">
              ← 날짜 다시 선택
            </button>
          ) : (
            <Link href="/reservation?step=1" className="btn btn-secondary mt-6">
              ← 날짜 다시 선택
            </Link>
          )}
        </div>
      )}

      {/* Room list */}
      {!loading && storeData && storeData.rooms.length > 0 && (
        <section className="mt-10 border border-[var(--color-line)] bg-white rounded-[2px] overflow-hidden">
          <div className="divide-y divide-[var(--color-line)]">
            {storeData.rooms.map((r) => {
              const isSelected = selectedPkg === r.packageKey;

              return (
                <div
                  key={r.packageKey}
                  className={cn(
                    "flex flex-col sm:flex-row gap-4 p-5 transition-colors",
                    isSelected && "bg-[var(--color-bg-tint)]",
                  )}
                >
                  {/* Room image */}
                  <div className="relative aspect-[4/3] w-full sm:w-[160px] shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
                    {r.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={r.image}
                        alt={r.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center t-caption text-[var(--color-ink-3)]">
                        이미지 없음
                      </div>
                    )}
                  </div>

                  {/* Room info */}
                  <div className="flex flex-1 flex-col gap-2 min-w-0">
                    <h3 className="t-h4">{r.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-ink-2)]">
                      <span>최대 {r.maxGuests}인</span>
                      <Dot />
                      <span>체크인 {r.checkInTime}:00</span>
                      <Dot />
                      <span>체크아웃 {r.checkOutTime}:00</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <span className="border border-[var(--color-line)] px-2 py-0.5 text-[11px] text-[var(--color-ink-3)]">
                        현장결제
                      </span>
                      <span className="border border-[var(--color-line)] px-2 py-0.5 text-[11px] text-[var(--color-ink-3)]">
                        숙박
                      </span>
                    </div>
                  </div>

                  {/* Price + select */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:min-w-[140px] shrink-0">
                    <div className="text-right">
                      {r.dailyPrices.length > 1 && (
                        <div className="t-caption text-[var(--color-ink-3)]">
                          {r.dailyPrices.map((p, i) => `${i + 1}박 ${krw(p)}`).join(" / ")}
                        </div>
                      )}
                      <div className="t-price-sm mt-0.5">{krw(r.price)}</div>
                      <div className="t-caption text-[var(--color-ink-3)] mt-0.5">
                        {nights}박 합계
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelect(r)}
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
      )}

      {/* Nav — 객실이 있을 때만 표시 */}
      {hasRooms && onNext ? (
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
      ) : hasRooms ? (
        <>
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
                        src={siteHotel.heroImages[0]}
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
                        {nights}박 · {krw(selectedRoom.price)}
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
      ) : null}
    </div>
  );
}

function Dot() {
  return <span className="text-[var(--color-mute)]">·</span>;
}
