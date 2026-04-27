import Image from "next/image";
import { hotels, getRegionCounts, hotelPoolMap } from "@/lib/hotels";
import { offers } from "@/lib/offers";
import { Reveal } from "@/components/reveal";
import { HeroBookingBar } from "@/components/hero-booking-bar";
import { SpecialOffers } from "@/components/special-offers";
import { RegionCuration } from "@/components/region-curation";
import { ThemeCuration } from "@/components/theme-curation";

export default function HomePage() {
  const counts = getRegionCounts();

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

      {/* ============== SPECIAL OFFERS ============== */}
      <SpecialOffers offers={offers} />

      {/* ============== REGION CURATION ============== */}
      <RegionCuration counts={counts} />

      {/* ============== THEME CURATION ============== */}
      <ThemeCuration hotels={hotels} hotelPoolMap={hotelPoolMap} />
    </>
  );
}
