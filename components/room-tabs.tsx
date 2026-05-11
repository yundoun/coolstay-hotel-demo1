"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Room } from "@/lib/types";
import { cn, krw } from "@/lib/utils";

export function RoomTabs({ rooms }: { rooms: Room[] }) {
  const [active, setActive] = useState(0);
  const room = rooms[active];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-[var(--color-line)] scrollbar-hide">
        {rooms.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 px-5 py-3 text-[13px] tracking-[0.02em] transition-colors whitespace-nowrap cursor-pointer",
              i === active
                ? "border-b-2 border-[var(--color-ink)] text-[var(--color-ink)] font-medium"
                : "text-[var(--color-ink-3)] hover:text-[var(--color-ink-2)]",
            )}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:gap-10">
        {/* Image */}
        <Link
          href={`/rooms/${room.id}`}
          className="group relative aspect-[16/10] w-full md:w-[56%] shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]"
        >
          <Image
            src={room.images[0]}
            alt={room.name}
            fill
            sizes="(max-width: 768px) 100vw, 56vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="t-h3">{room.name}</h3>
            <p className="t-body mt-3 text-[var(--color-ink-3)]">{room.concept}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-ink-2)]">
              <span>{room.sizeSqm}㎡</span>
              <span className="text-[var(--color-mute)]">·</span>
              <span>{room.bedType}베드</span>
              <span className="text-[var(--color-mute)]">·</span>
              <span>{room.view}</span>
              <span className="text-[var(--color-mute)]">·</span>
              <span>최대 {room.maxOccupancy}인</span>
            </div>

            <div className="mt-5">
              <span className="t-caption text-[var(--color-ink-3)]">1박 기준</span>
              <div className="t-price mt-1">{krw(room.basePrice)}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href={`/rooms/${room.id}`} className="btn btn-secondary">
              상세보기
            </Link>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("step-indicator");
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 72;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              className="btn btn-primary"
            >
              예약하기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
