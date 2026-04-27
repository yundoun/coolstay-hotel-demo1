import Image from "next/image";
import Link from "next/link";
import type { Hotel } from "@/lib/types";
import { Reveal } from "./reveal";

type Theme = {
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  image: string;
  hotels: Hotel[];
};

/**
 * Pool-key → theme mapping. Each theme picks one representative image
 * and collects matching hotels.
 */
const THEME_DEFS: {
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  pools: string[];
  image: string;
}[] = [
  {
    slug: "ocean",
    title: "바다가 보이는 아침",
    titleEn: "Ocean Morning",
    description: "수평선이 눈높이에 놓이는 오션뷰 호텔. 파도 소리로 시작하는 하루.",
    pools: ["ocean"],
    image: "/hotels/haeun-busan/hero.jpg",
  },
  {
    slug: "urban",
    title: "도심 속 리트리트",
    titleEn: "Urban Retreat",
    description: "스카이라인이 창 너머로 흐르는 시티 호텔. 도시의 에너지와 고요함 사이.",
    pools: ["urban"],
    image: "/hotels/sowol-seoul/hero.jpg",
  },
  {
    slug: "forest",
    title: "숲으로 들어가는 시간",
    titleEn: "Into the Forest",
    description: "나무 사이로 스며드는 빛과 바람. 자연이 치유하는 포레스트 스테이.",
    pools: ["forest"],
    image: "/hotels/wolbit-jeju/hero.jpg",
  },
  {
    slug: "mountain",
    title: "산이 건네는 여유",
    titleEn: "Mountain Calm",
    description: "능선의 곡선을 따라 흐르는 고요. 사계절 산의 표정을 객실에서.",
    pools: ["mountain"],
    image: "/hotels/seorak-sokcho/hero.jpg",
  },
];

export function ThemeCuration({
  hotels,
  hotelPoolMap,
}: {
  hotels: Hotel[];
  hotelPoolMap: Record<string, string>;
}) {
  const themes: Theme[] = THEME_DEFS.map((def) => ({
    ...def,
    hotels: hotels.filter((h) => def.pools.includes(hotelPoolMap[h.id] ?? "")),
  }));

  return (
    <section className="py-[120px] bg-[var(--color-bg-soft)]">
      <div className="container-page">
        <div className="mb-[56px]">
          <Reveal>
            <span className="eyebrow">Travel by Theme</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="t-h2 mt-4">당신의 취향으로 떠나는 여행.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-body-lg mt-6 text-[var(--color-ink-2)] max-w-[50ch]">
              바다, 도심, 숲, 산 — 여행의 풍경이 곧 취향입니다.
              마음이 끌리는 테마를 선택하세요.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {themes.map((theme, i) => (
            <Reveal key={theme.slug} delay={(i % 2) * 0.06}>
              <Link
                href={`/hotels?theme=${theme.slug}`}
                className="group block"
              >
                <div className="img-hover relative aspect-[16/9] w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
                  <Image
                    src={theme.image}
                    alt={theme.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <span className="t-label-caps text-white/60">
                      {theme.titleEn} · {theme.hotels.length}개 호텔
                    </span>
                    <h3 className="t-h3 mt-1 text-white">{theme.title}</h3>
                  </div>
                </div>

                <p className="mt-4 t-body text-[var(--color-ink-3)] group-hover:text-[var(--color-ink-2)] transition-colors">
                  {theme.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
