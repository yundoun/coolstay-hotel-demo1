"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Room } from "@/lib/types";
import { cn, krw } from "@/lib/utils";

/**
 * Sticky 이미지 전환 객실 쇼케이스.
 *
 * 왼쪽: 객실 이미지가 sticky로 고정, 현재 활성 객실에 따라 전환.
 * 오른쪽: 객실 정보 카드를 스크롤하면서 탐색.
 * IntersectionObserver로 활성 객실 감지 → 이미지 crossfade.
 */
export function RoomShowcase({
  rooms,
  hotelId,
  onRoomSelect,
}: {
  rooms: Room[];
  hotelId: string;
  /** 제공 시 Link 대신 콜백 사용 (onepage 모드) */
  onRoomSelect?: (roomId: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [rooms.length]);

  const activeRoom = rooms[activeIndex];

  return (
    <>
      {/* ── Desktop: Sticky 이미지 + 스크롤 텍스트 ── */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-12 lg:gap-20">
        {/* 왼쪽 — Sticky 이미지 */}
        <div className="relative">
          <div className="sticky top-[120px] h-[calc(100vh-180px)]">
            {/* 이미지 스택 — crossfade */}
            <div className="relative h-full w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
              {rooms.map((room, i) => (
                <Image
                  key={room.id}
                  src={room.images[0]}
                  alt={room.name}
                  fill
                  sizes="50vw"
                  className={cn(
                    "object-cover transition-opacity duration-700 ease-out",
                    i === activeIndex ? "opacity-100" : "opacity-0",
                  )}
                  priority={i === 0}
                />
              ))}

              {/* Tier 배지 */}
              <div className="absolute left-5 top-5">
                <span
                  key={activeRoom.tier}
                  className="inline-block bg-[var(--color-ink)] text-white px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase"
                >
                  <TierLabel tier={activeRoom.tier} />
                </span>
              </div>

              {/* 하단 인디케이터 */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                <div className="flex items-center gap-2">
                  {rooms.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-[3px] rounded-full transition-all duration-500",
                        i === activeIndex
                          ? "w-8 bg-white"
                          : "w-3 bg-white/40",
                      )}
                    />
                  ))}
                  <span className="ml-auto text-[12px] text-white/70 tabular-nums">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(rooms.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 — 스크롤 객실 카드 */}
        <div className="flex flex-col gap-10 py-[20vh]">
          {rooms.map((room, i) => (
            <div
              key={room.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={cn(
                "transition-opacity duration-500",
                i === activeIndex ? "opacity-100" : "opacity-40",
              )}
            >
              <RoomInfoCard room={room} hotelId={hotelId} active={i === activeIndex} onSelect={onRoomSelect} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: 카드 리스트 ── */}
      <div className="flex flex-col gap-8 md:hidden">
        {rooms.map((room) => (
          <MobileRoomCard key={room.id} room={room} hotelId={hotelId} onSelect={onRoomSelect} />
        ))}
      </div>
    </>
  );
}

/* ── 객실 정보 카드 (데스크톱 오른쪽) ── */
function RoomInfoCard({
  room,
  hotelId,
  active,
  onSelect,
}: {
  room: Room;
  hotelId: string;
  active: boolean;
  onSelect?: (roomId: string) => void;
}) {
  const href = `/reservation?step=1&hotelId=${hotelId}&roomId=${room.id}`;

  return (
    <div
      className={cn(
        "border bg-white rounded-[2px] p-8 transition-all duration-500",
        active
          ? "border-[var(--color-ink)] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          : "border-[var(--color-line)]",
      )}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="t-label-caps text-[var(--color-ink-3)]">
            <TierLabel tier={room.tier} />
          </span>
          <h3 className="t-h3 mt-2">{room.name}</h3>
        </div>
        <div className="text-right shrink-0">
          <div className="t-caption text-[var(--color-ink-3)]">1박</div>
          <div className="t-price-sm mt-0.5">{krw(room.basePrice)}</div>
        </div>
      </div>

      {/* 컨셉 */}
      <p className="t-body mt-4 text-[var(--color-ink-3)]">{room.concept}</p>

      {/* 스펙 */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[var(--color-ink-2)]">
        <span>{room.sizeSqm}㎡</span>
        <Dot />
        <span>{room.bedType}베드</span>
        <Dot />
        <span>{room.view}</span>
        <Dot />
        <span>최대 {room.maxOccupancy}인</span>
      </div>

      {/* 어메니티 */}
      <ul className="mt-5 flex flex-wrap gap-2">
        {room.amenities.map((a) => (
          <li
            key={a}
            className="border border-[var(--color-line)] px-2.5 py-1 text-[11px] text-[var(--color-ink-3)]"
          >
            {a}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {onSelect ? (
        <button
          type="button"
          onClick={() => onSelect(room.id)}
          className={cn(
            "mt-8 flex items-center justify-center h-[48px] w-full rounded-[2px] t-button transition-all duration-300 cursor-pointer",
            active
              ? "bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-2)]"
              : "border border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
          )}
        >
          예약하기 →
        </button>
      ) : (
        <Link
          href={href}
          className={cn(
            "mt-8 flex items-center justify-center h-[48px] w-full rounded-[2px] t-button transition-all duration-300",
            active
              ? "bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-2)]"
              : "border border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
          )}
        >
          예약하기 →
        </Link>
      )}
    </div>
  );
}

/* ── 모바일 카드 ── */
function MobileRoomCard({ room, hotelId, onSelect }: { room: Room; hotelId: string; onSelect?: (roomId: string) => void }) {
  const href = `/reservation?step=1&hotelId=${hotelId}&roomId=${room.id}`;

  const Wrapper = onSelect
    ? ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <button type="button" onClick={() => onSelect(room.id)} className={`${className} text-left w-full`}>
          {children}
        </button>
      )
    : ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <Link href={href} className={className}>{children}</Link>
      );

  return (
    <Wrapper className="group block">
      <div className="overflow-hidden rounded-[2px] border border-[var(--color-line)] bg-white">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-line-soft)]">
          <Image
            src={room.images[0]}
            alt={room.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute left-3 top-3">
            <span className="inline-block bg-[var(--color-ink)] text-white px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase">
              <TierLabel tier={room.tier} />
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="t-h4 group-hover:text-[var(--color-honey-700)] transition-colors">
              {room.name}
            </h3>
            <div className="text-right shrink-0">
              <div className="t-price-sm">{krw(room.basePrice)}</div>
              <div className="t-caption text-[var(--color-ink-3)]">/ 1박</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--color-ink-3)]">
            <span>{room.sizeSqm}㎡</span>
            <Dot />
            <span>{room.bedType}베드</span>
            <Dot />
            <span>{room.view}</span>
            <Dot />
            <span>최대 {room.maxOccupancy}인</span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

/* ── Utilities ── */
function TierLabel({ tier }: { tier: Room["tier"] }) {
  const label: Record<string, string> = {
    STANDARD: "Standard",
    DELUXE: "Deluxe",
    DELUXE_TWIN: "Deluxe Twin",
    PREMIER: "Premier",
    PREMIER_TWIN: "Premier Twin",
    FAMILY: "Family",
    JUNIOR_SUITE: "Junior Suite",
    SIGNATURE: "Signature",
    SUITE: "Suite",
    ONDOL: "Ondol",
  };
  return <>{label[tier] ?? tier}</>;
}

function Dot() {
  return <span className="text-[var(--color-mute)]">·</span>;
}
