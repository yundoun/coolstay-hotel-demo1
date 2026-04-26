import { hotels, regions, getRegionCounts } from "@/lib/hotels";
import { HotelsListClient } from "@/components/hotels-list-client";

export const metadata = { title: "파트너 호텔 — 꿀스테이" };

export default function HotelsIndexPage() {
  const counts = getRegionCounts();
  return (
    <>
      <section className="pt-[128px] pb-[48px]">
        <div className="container-page">
          <span className="eyebrow">Hotels</span>
          <h1 className="t-h1 mt-6">파트너 호텔</h1>
          <p className="t-body-lg mt-6 max-w-[56ch] text-[var(--color-ink-3)]">
            국내 주요 지역의 엄선된{" "}
            <span className="text-[var(--color-ink)]">{hotels.length}개</span>{" "}
            호텔을 만나보세요. 각 호텔은 지역과 호흡을 맞춘 고유한 서사를 품고 있습니다.
          </p>
        </div>
      </section>
      <HotelsListClient hotels={hotels} regions={regions} counts={counts} />
    </>
  );
}
