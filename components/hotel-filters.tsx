"use client";

import type { Hotel, Region } from "@/lib/types";
import { cn } from "@/lib/utils";

export type RegionOption = { value: "전체" | Region; label: string };
export type HotelSort = "추천순" | "가나다순" | "등급높은순";

export function HotelFilters({
  regions,
  region,
  onRegionChange,
  sort,
  onSortChange,
  counts,
  resultCount,
  totalCount,
  compact = false,
}: {
  regions: RegionOption[];
  region: "전체" | Region;
  onRegionChange: (v: "전체" | Region) => void;
  sort: HotelSort;
  onSortChange: (v: HotelSort) => void;
  counts: Record<string, number>;
  resultCount: number;
  totalCount: number;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-y border-[var(--color-line)]",
        compact ? "" : "",
      )}
    >
      <div className="container-page flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap items-center gap-2">
          {regions.map((r) => {
            const active = r.value === region;
            const count = counts[r.value] ?? 0;
            return (
              <li key={r.value}>
                <button
                  type="button"
                  onClick={() => onRegionChange(r.value)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors",
                    active
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                      : "border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
                  )}
                >
                  <span>{r.label}</span>
                  <span
                    className={cn(
                      "tabular-nums text-[11px]",
                      active ? "text-white/70" : "text-[var(--color-mute)]",
                    )}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-6">
          <span className="t-caption text-[var(--color-ink-3)]">
            <span className="tabular-nums text-[var(--color-ink)]">{resultCount}</span>
            <span className="text-[var(--color-mute)]"> / {totalCount}</span> 개 호텔
          </span>
          <div className="flex items-center gap-3">
            <span className="t-label-caps text-[var(--color-ink-3)]">Sort</span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as HotelSort)}
              className="h-9 border border-[var(--color-line)] bg-white px-3 text-[14px] focus:outline-none focus:border-[var(--color-ink)] rounded-[2px]"
            >
              <option value="추천순">추천순</option>
              <option value="가나다순">가나다순</option>
              <option value="등급높은순">등급 높은순</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export function filterHotels(
  hotels: Hotel[],
  region: "전체" | Region,
  sort: HotelSort,
): Hotel[] {
  const base = region === "전체" ? hotels : hotels.filter((h) => h.region === region);
  const sorted = [...base];
  if (sort === "가나다순") {
    sorted.sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));
  } else if (sort === "등급높은순") {
    sorted.sort((a, b) => b.grade - a.grade);
  }
  // 추천순 = insertion order (spec order) — no-op
  return sorted;
}
