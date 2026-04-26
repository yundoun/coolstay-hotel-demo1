"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  hotels,
  getHotelRooms,
  getHotel,
  regions,
  getRegionCounts,
} from "@/lib/hotels";
import { useReservation } from "@/lib/reservation-store";
import { cn, krw, nightsBetween } from "@/lib/utils";
import type { Region } from "@/lib/types";
import {
  HotelFilters,
  filterHotels,
  type HotelSort,
} from "@/components/hotel-filters";

export function Step2Room() {
  const s = useReservation();
  const nights = nightsBetween(s.checkIn, s.checkOut);
  const selectedHotel = s.hotelId ? getHotel(s.hotelId) : null;
  const rooms = useMemo(
    () => (selectedHotel ? getHotelRooms(selectedHotel.id) : []),
    [selectedHotel],
  );
  const roomsRef = useRef<HTMLElement | null>(null);

  const [region, setRegion] = useState<"전체" | Region>("전체");
  const [sort, setSort] = useState<HotelSort>("추천순");

  const filteredHotels = useMemo(
    () => filterHotels(hotels, region, sort),
    [region, sort],
  );
  const counts = useMemo(() => getRegionCounts(), []);

  const canNext = Boolean(s.hotelId && s.roomId && nights > 0);

  // Auto-scroll to the room list when a hotel is selected
  useEffect(() => {
    if (selectedHotel && roomsRef.current) {
      const y = roomsRef.current.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [selectedHotel]);

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <span className="eyebrow">Step 02</span>
      <h2 className="t-h2 mt-4">어디에서 머무시겠어요?</h2>
      <p className="t-body mt-4 text-[var(--color-ink-3)]">
        {nights > 0
          ? `${nights}박 기준으로 호텔과 객실을 안내해 드립니다.`
          : "호텔을 선택하면 객실이 안내됩니다."}
      </p>

      {/* Filters — full-bleed within the reservation container */}
      <div className="-mx-[var(--page-gutter)] mt-10">
        <HotelFilters
          regions={regions}
          region={region}
          onRegionChange={(v) => {
            setRegion(v);
          }}
          sort={sort}
          onSortChange={setSort}
          counts={counts}
          resultCount={filteredHotels.length}
          totalCount={hotels.length}
        />
      </div>

      {/* Hotel grid (always visible) */}
      <section className="mt-10">
        {filteredHotels.length === 0 ? (
          <p className="t-body text-[var(--color-ink-3)]">
            해당 지역의 호텔이 없습니다.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.map((h) => {
              const isSelected = s.hotelId === h.id;
              return (
                <li key={h.id}>
                  <button
                    onClick={() => s.setHotel(h.id)}
                    className={cn(
                      "group block w-full text-left border transition-colors rounded-[2px] overflow-hidden bg-white",
                      isSelected
                        ? "border-[var(--color-honey-500)] ring-[3px] ring-[var(--color-bg-tint)]"
                        : "border-[var(--color-line)] hover:border-[var(--color-ink)]",
                    )}
                  >
                    <div className="img-hover relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-line-soft)]">
                      <Image
                        src={h.heroImage}
                        alt={h.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      {isSelected && (
                        <div className="absolute left-3 top-3 bg-[var(--color-honey-500)] px-2 py-1 t-label-caps text-[var(--color-ink)]">
                          선택됨
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="t-label-caps text-[var(--color-ink-3)]">
                        {h.city} · {h.grade}-Star
                      </div>
                      <div className="t-h4 mt-2">{h.name}</div>
                      <div className="t-body-sm text-[var(--color-ink-3)] mt-1 line-clamp-2">
                        {h.shortConcept}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Rooms list — appears after hotel selection */}
      {selectedHotel && (
        <section ref={roomsRef} className="mt-20 scroll-mt-40">
          <div className="flex items-end justify-between border-t border-[var(--color-line)] pt-10 mb-8">
            <div className="flex flex-col gap-2">
              <span className="t-label-caps text-[var(--color-ink-3)]">객실 선택</span>
              <h3 className="t-h3">{selectedHotel.name}의 객실</h3>
            </div>
            <span className="t-caption text-[var(--color-ink-3)]">
              총 <span className="text-[var(--color-ink)] tabular-nums">{rooms.length}</span>개의 객실
            </span>
          </div>
          <ul className="flex flex-col gap-4">
            {rooms.map((r) => {
              const isSelected = s.roomId === r.id;
              const total = nights > 0 ? nights * r.basePrice : r.basePrice;
              return (
                <li key={r.id}>
                  <article
                    className={cn(
                      "grid grid-cols-1 md:grid-cols-[240px_1fr_auto] gap-6 p-4 border bg-white rounded-[2px] transition-[border-color] duration-200 border-l-[2px]",
                      isSelected
                        ? "border-[var(--color-line)] border-l-[var(--color-honey-500)]"
                        : "border-[var(--color-line)] hover:border-[var(--color-ink-2)]",
                    )}
                  >
                    <div className="img-hover relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
                      <Image
                        src={r.images[0]}
                        alt={r.name}
                        fill
                        sizes="240px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="t-label-caps text-[var(--color-ink-3)]">{r.tier}</span>
                      <h3 className="t-h3">{r.name}</h3>
                      <p className="t-body-sm text-[var(--color-ink-3)]">{r.concept}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-ink-2)]">
                        <span>{r.sizeSqm}㎡</span>
                        <Dot />
                        <span>{r.bedType}베드</span>
                        <Dot />
                        <span>{r.view}</span>
                        <Dot />
                        <span>최대 {r.maxOccupancy}인</span>
                      </div>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {r.amenities.slice(0, 4).map((a) => (
                          <li
                            key={a}
                            className="border border-[var(--color-line)] px-2 py-1 text-[12px] text-[var(--color-ink-3)]"
                          >
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-4 min-w-[180px]">
                      <div className="text-right">
                        <div className="t-caption text-[var(--color-ink-3)]">1박 기준</div>
                        <div className="t-price-md mt-1">{krw(r.basePrice)}</div>
                        {nights > 0 && (
                          <div className="t-caption text-[var(--color-ink-3)] mt-1">
                            {nights}박 합계 · {krw(total)}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => s.setRoom(r.id)}
                        className={cn(
                          "btn",
                          isSelected ? "btn-primary" : "btn-secondary",
                        )}
                      >
                        {isSelected ? "선택됨" : "선택"}
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Nav */}
      <div className="mt-16 flex items-center justify-between border-t border-[var(--color-line)] pt-8">
        <Link href="/reservation?step=1" className="btn btn-secondary">
          ← 이전
        </Link>
        <Link
          href="/reservation?step=3"
          aria-disabled={!canNext}
          onClick={(e) => {
            if (!canNext) e.preventDefault();
          }}
          className={canNext ? "btn btn-primary" : "btn btn-primary opacity-40 pointer-events-none"}
        >
          다음 →
        </Link>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="text-[var(--color-mute)]">·</span>;
}
