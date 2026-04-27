"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  hotels,
  regions,
  getRegionCounts,
  getHotelRooms,
  getHotel,
  getRoom,
} from "@/lib/hotels";
import { useReservation } from "@/lib/reservation-store";
import { cn, krw, nightsBetween } from "@/lib/utils";
import type { Region, Room } from "@/lib/types";
import {
  HotelFilters,
  filterHotels,
  type HotelSort,
} from "@/components/hotel-filters";
import { AnimatePresence, motion } from "framer-motion";

export function Step2Hotel() {
  const s = useReservation();
  const nights = nightsBetween(s.checkIn, s.checkOut);

  const [region, setRegion] = useState<"전체" | Region>("전체");
  const [sort, setSort] = useState<HotelSort>("추천순");
  const filteredHotels = useMemo(
    () => filterHotels(hotels, region, sort),
    [region, sort],
  );
  const counts = useMemo(() => getRegionCounts(), []);

  // Track which hotel's accordion is open
  const [expandedId, setExpandedId] = useState<string | null>(s.hotelId);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Toggle accordion — clicking same hotel closes it
  const toggleHotel = (hotelId: string) => {
    setExpandedId((prev) => (prev === hotelId ? null : hotelId));
  };

  // Scroll into view when accordion opens
  useEffect(() => {
    if (expandedId && accordionRef.current) {
      setTimeout(() => {
        accordionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }, [expandedId]);

  const canNext = Boolean(s.hotelId && s.roomId && nights > 0);
  const selectedHotel = s.hotelId ? getHotel(s.hotelId) : null;
  const selectedRoom = s.roomId ? getRoom(s.roomId) : null;
  const total = selectedRoom && nights > 0 ? selectedRoom.basePrice * nights : 0;

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <span className="eyebrow">Step 02</span>
      <h2 className="t-h2 mt-4">호텔과 객실을 선택하세요.</h2>
      <p className="t-body mt-4 text-[var(--color-ink-3)]">
        {nights > 0
          ? `${nights}박 일정에 맞는 호텔을 선택하면 객실이 표시됩니다.`
          : "호텔을 선택하면 객실이 표시됩니다."}
      </p>

      {/* Filters */}
      <div className="-mx-[var(--page-gutter)] mt-10">
        <HotelFilters
          regions={regions}
          region={region}
          onRegionChange={setRegion}
          sort={sort}
          onSortChange={setSort}
          counts={counts}
          resultCount={filteredHotels.length}
          totalCount={hotels.length}
        />
      </div>

      {/* Hotel list — horizontal cards with accordion rooms */}
      <section className="mt-10">
        {filteredHotels.length === 0 ? (
          <p className="t-body text-[var(--color-ink-3)]">
            해당 지역의 호텔이 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {filteredHotels.map((h) => {
              const isExpanded = expandedId === h.id;
              const isSelected = s.hotelId === h.id;
              const rooms = getHotelRooms(h.id);

              return (
                <li key={h.id}>
                  {/* Hotel card — horizontal layout */}
                  <button
                    onClick={() => toggleHotel(h.id)}
                    className={cn(
                      "group flex w-full text-left border transition-colors bg-white overflow-hidden rounded-[2px]",
                      isExpanded
                        ? "border-[var(--color-honey-500)] ring-[3px] ring-[var(--color-bg-tint)]"
                        : "border-[var(--color-line)] hover:border-[var(--color-ink)]",
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="img-hover relative w-[200px] shrink-0 overflow-hidden bg-[var(--color-line-soft)] hidden sm:block">
                      <Image
                        src={h.heroImage}
                        alt={h.name}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                      {isSelected && (
                        <div className="absolute left-3 top-3 bg-[var(--color-honey-500)] px-2 py-1 t-label-caps text-[var(--color-ink)]">
                          선택됨
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 items-center justify-between gap-4 p-5">
                      <div className="min-w-0">
                        <div className="t-label-caps text-[var(--color-ink-3)]">
                          {h.city} · {h.grade}-Star
                        </div>
                        <div className="t-h4 mt-2">{h.name}</div>
                        <div className="t-body-sm text-[var(--color-ink-3)] mt-1 line-clamp-1">
                          {h.shortConcept}
                        </div>
                      </div>

                      {/* Toggle indicator */}
                      <div className="shrink-0 flex items-center gap-3">
                        <span className="t-caption text-[var(--color-ink-3)] hidden md:inline">
                          객실 {rooms.length}개
                        </span>
                        <svg
                          className={cn(
                            "h-5 w-5 text-[var(--color-ink-3)] transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Accordion: room list */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        ref={accordionRef}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border border-t-0 border-[var(--color-line)] bg-[var(--color-bg)] rounded-b-[2px]">
                          <RoomList
                            rooms={rooms}
                            nights={nights}
                            selectedRoomId={s.roomId}
                            onSelectRoom={(roomId) => {
                              if (s.hotelId !== h.id) s.setHotel(h.id);
                              s.setRoom(roomId);
                            }}
                            isHotelSelected={isSelected}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Inline nav (이전 only) */}
      <div className="mt-16 flex items-center border-t border-[var(--color-line)] pt-8">
        <Link href="/reservation?step=1" className="btn btn-secondary">
          ← 이전
        </Link>
      </div>

      {/* Sticky bottom bar — slides up when room is selected */}
      <AnimatePresence>
        {canNext && selectedHotel && selectedRoom && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-line)] bg-white/95 backdrop-blur-sm shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
          >
            <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-[var(--page-gutter)] py-4">
              {/* Selected info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
                  <Image
                    src={selectedHotel.heroImage}
                    alt={selectedHotel.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="t-body-sm font-semibold truncate">
                    {selectedHotel.name}
                  </div>
                  <div className="t-caption text-[var(--color-ink-3)] truncate">
                    {selectedRoom.name} · {nights}박 · {krw(total)}
                  </div>
                </div>
              </div>

              {/* CTA */}
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Room list inside accordion                                         */
/* ------------------------------------------------------------------ */

function RoomList({
  rooms,
  nights,
  selectedRoomId,
  onSelectRoom,
  isHotelSelected,
}: {
  rooms: Room[];
  nights: number;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  isHotelSelected: boolean;
}) {
  return (
    <div className="divide-y divide-[var(--color-line)]">
      {rooms.map((r) => {
        const isSelected = isHotelSelected && selectedRoomId === r.id;
        const total = nights > 0 ? nights * r.basePrice : r.basePrice;

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
                    {nights}박 · {krw(total)}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRoom(r.id);
                }}
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
  );
}

function Dot() {
  return <span className="text-[var(--color-mute)]">·</span>;
}
