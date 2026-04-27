import Image from "next/image";
import Link from "next/link";
import type { Region } from "@/lib/types";
import { Reveal } from "./reveal";

type RegionCard = {
  region: Region;
  label: string;
  tagline: string;
  count: number;
  image: string;
};

const REGION_DATA: Omit<RegionCard, "count">[] = [
  {
    region: "수도권",
    label: "서울 · 수도권",
    tagline: "도심이 건네는 고요한 안식",
    image: "/hotels/sowol-seoul/hero.jpg",
  },
  {
    region: "제주",
    label: "제주",
    tagline: "바람과 돌이 빚은 섬의 시간",
    image: "/hotels/wolbit-jeju/hero.jpg",
  },
  {
    region: "영남",
    label: "부산 · 영남",
    tagline: "파도와 함께 걷는 남쪽 바다",
    image: "/hotels/haeun-busan/hero.jpg",
  },
  {
    region: "강원",
    label: "강원",
    tagline: "산과 호수가 여는 느린 아침",
    image: "/hotels/seorak-sokcho/hero.jpg",
  },
  {
    region: "호남",
    label: "여수 · 호남",
    tagline: "남도의 맛과 정이 머무는 곳",
    image: "/hotels/odong-yeosu/hero.jpg",
  },
];

export function RegionCuration({ counts }: { counts: Record<string, number> }) {
  const cards: RegionCard[] = REGION_DATA.map((d) => ({
    ...d,
    count: counts[d.region] ?? 0,
  }));

  // First card is large (hero), rest are 2x2 grid
  const [hero, ...rest] = cards;

  return (
    <section className="py-[120px]">
      <div className="container-page">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-[56px]">
          <div>
            <Reveal>
              <span className="eyebrow">Destinations</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="t-h2 mt-4">어디로 떠나시나요?</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="t-body text-[var(--color-ink-3)] md:max-w-[32ch] md:text-right">
              다섯 개의 지역, 서른 곳의 파트너 호텔.<br />
              당신의 다음 여행지를 골라보세요.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* Hero region card — spans 2 cols × 2 rows */}
          <Reveal className="lg:col-span-2 lg:row-span-2">
            <RegionCardItem card={hero} aspect="aspect-[3/4] lg:aspect-auto lg:h-full" />
          </Reveal>

          {/* Remaining 4 cards in 2×2 */}
          {rest.map((card, i) => (
            <Reveal key={card.region} delay={0.06 + i * 0.04}>
              <RegionCardItem card={card} aspect="aspect-[4/3]" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionCardItem({
  card,
  aspect,
}: {
  card: RegionCard;
  aspect: string;
}) {
  return (
    <Link
      href={`/hotels?region=${encodeURIComponent(card.region)}`}
      className={`group relative block w-full h-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)] ${aspect}`}
    >
      <Image
        src={card.image}
        alt={card.label}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <span className="t-label-caps text-white/60">
          {card.count}개 호텔
        </span>
        <h3 className="t-h3 mt-1 text-white">{card.label}</h3>
        <p className="mt-1 t-body-sm text-white/70">{card.tagline}</p>
      </div>
    </Link>
  );
}
