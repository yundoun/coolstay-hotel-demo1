import Link from "next/link";
import Image from "next/image";
import type { Hotel } from "@/lib/types";
import { starString } from "@/lib/utils";

export function HotelCard({ hotel, priority = false }: { hotel: Hotel; priority?: boolean }) {
  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className="group block focus:outline-none"
    >
      <div className="img-hover relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
        <Image
          src={hotel.heroImage}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={priority}
          className="object-cover"
        />
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <div className="t-label-caps text-[var(--color-ink-3)]">
          {hotel.city} · {hotel.grade}-Star Hotel
        </div>
        <h3 className="t-h3 transition-colors group-hover:text-[var(--color-honey-700)]">
          {hotel.name}
        </h3>
        <p className="t-body-sm text-[var(--color-ink-3)] line-clamp-2">
          {hotel.shortConcept}
        </p>
        <div className="mt-1 text-[14px] tracking-[0.12em] text-[var(--color-ink)]">
          {starString(hotel.grade)}
        </div>
      </div>
    </Link>
  );
}
