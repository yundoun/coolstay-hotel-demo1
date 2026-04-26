import Image from "next/image";
import Link from "next/link";
import { hotels } from "@/lib/hotels";
import { HotelCard } from "@/components/hotel-card";
import { Reveal } from "@/components/reveal";
import { HeroBookingBar } from "@/components/hero-booking-bar";

export default function HomePage() {
  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative w-full">
        <div className="relative h-[92vh] min-h-[720px] w-full overflow-hidden">
          <Image
            src={hotels[0].heroImage}
            alt={hotels[0].name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 hero-veil" aria-hidden />

          {/* Hero copy */}
          <div className="absolute inset-x-0 top-0 bottom-[96px] flex items-end">
            <div className="container-page pb-[72px]">
              <Reveal>
                <span className="t-label-caps block text-white/80">
                  CoolStay × Luxury Hotels
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="t-display mt-4 max-w-[16ch] text-white">
                  머무는 모든 순간이<br />
                  기억이 되도록.
                </h1>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="t-serif-en t-body-lg mt-6 text-white/80">
                  Every stay, a memory worth keeping.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Hero booking bar — overlaps the bottom of the hero */}
          <div className="absolute inset-x-0 bottom-0">
            <HeroBookingBar />
          </div>
        </div>
      </section>

      {/* ============== INTRO BAND ============== */}
      <section className="py-[120px]">
        <div className="container-page grid grid-cols-1 items-start gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <span className="eyebrow">CoolStay × Luxury Hotels</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="t-h2 mt-6">
                여섯 개의 공간,<br />하나의 품격.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-body-lg mt-8 text-[var(--color-ink-2)]">
                꿀스테이가 엄선한 여섯 호텔은 저마다의 풍경과 서사로 손님을 맞이합니다.
                도심의 고요함에서 해변의 파도까지, 당신의 하루가 가장 길게 머무를 수 있는
                자리를 모았습니다.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-10">
                <Link
                  href="/hotels"
                  className="t-label-caps border-b border-current pb-1 hover:opacity-70 transition-opacity"
                >
                  모든 호텔 둘러보기 →
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-7">
            <Reveal delay={0.1}>
              <div className="img-hover relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
                <Image
                  src={hotels[2].heroImage}
                  alt="인테리어 디테일"
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============== FEATURED HOTELS ============== */}
      <section className="pb-[140px]">
        <div className="container-page">
          <div className="mb-[64px] flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <span className="eyebrow">Featured Properties</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="t-h2 mt-4">
                  여섯 개의 시간,<br />여섯 개의 공간.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <p className="t-body text-[var(--color-ink-3)] md:max-w-[32ch] md:text-right">
                국내 파트너 호텔 중 여섯 곳을 먼저 소개합니다.
                각 호텔은 지역의 결을 따른 고유한 이야기를 지니고 있습니다.
              </p>
            </Reveal>
          </div>

          <ul className="grid grid-cols-1 gap-x-8 gap-y-[80px] md:grid-cols-2 lg:grid-cols-3">
            {hotels.slice(0, 6).map((h, i) => (
              <Reveal key={h.id} delay={(i % 3) * 0.06} as="li">
                <HotelCard hotel={h} priority={i < 3} />
              </Reveal>
            ))}
          </ul>

          <div className="mt-[96px] flex justify-center">
            <Link href="/hotels" className="btn btn-secondary">
              모든 호텔 {hotels.length}개 보기 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
