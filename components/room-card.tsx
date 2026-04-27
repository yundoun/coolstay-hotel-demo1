import Link from "next/link";
import Image from "next/image";
import type { Room } from "@/lib/types";

export function RoomCard({ room, hotelId }: { room: Room; hotelId: string }) {
  const href = `/reservation?step=1&hotelId=${hotelId}&roomId=${room.id}`;
  return (
    <Link href={href} className="group block focus:outline-none">
      <div className="img-hover relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover"
        />
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <span className="t-label-caps text-[var(--color-ink-3)]">{room.tier}</span>
        <h3 className="t-h3 transition-colors group-hover:text-[var(--color-honey-700)]">
          {room.name}
        </h3>
        <p className="t-body-sm text-[var(--color-ink-3)]">{room.concept}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[var(--color-ink-2)]">
          <span>{room.sizeSqm}㎡</span>
          <span className="text-[var(--color-mute)]">·</span>
          <span>{room.bedType}베드</span>
          <span className="text-[var(--color-mute)]">·</span>
          <span>{room.view}</span>
          <span className="text-[var(--color-mute)]">·</span>
          <span>최대 {room.maxOccupancy}인</span>
        </div>
        <span className="t-label-caps mt-3 inline-block opacity-0 transition-opacity group-hover:opacity-100">
          예약하기 →
        </span>
      </div>
    </Link>
  );
}
