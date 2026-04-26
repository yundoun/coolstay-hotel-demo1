"use client";

import { useMemo, useState } from "react";
import type { Hotel, Region } from "@/lib/types";
import { HotelCard } from "@/components/hotel-card";
import { Reveal } from "@/components/reveal";
import {
  HotelFilters,
  filterHotels,
  type RegionOption,
  type HotelSort,
} from "@/components/hotel-filters";

export function HotelsListClient({
  hotels,
  regions,
  counts,
}: {
  hotels: Hotel[];
  regions: RegionOption[];
  counts: Record<string, number>;
}) {
  const [region, setRegion] = useState<"전체" | Region>("전체");
  const [sort, setSort] = useState<HotelSort>("추천순");

  const filtered = useMemo(
    () => filterHotels(hotels, region, sort),
    [hotels, region, sort],
  );

  return (
    <>
      <HotelFilters
        regions={regions}
        region={region}
        onRegionChange={setRegion}
        sort={sort}
        onSortChange={setSort}
        counts={counts}
        resultCount={filtered.length}
        totalCount={hotels.length}
      />

      <section className="py-[80px]">
        <div className="container-page">
          {filtered.length === 0 ? (
            <p className="t-body text-[var(--color-ink-3)]">
              해당 지역의 호텔이 없습니다.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-x-8 gap-y-[80px] md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((h, i) => (
                <Reveal key={h.id} delay={(i % 3) * 0.05} as="li">
                  <HotelCard hotel={h} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
