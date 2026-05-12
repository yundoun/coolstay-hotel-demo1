import Image from "next/image";
import { siteHotel } from "@/hotel-data/hotel";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-white">
      <div className="container-page py-[56px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/coolstay_logo.png"
              alt="꿀스테이"
              width={100}
              height={24}
              className="h-[24px] w-auto"
            />
            <span className="t-label-caps text-[var(--color-ink-3)]">
              {siteHotel.name}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-x-12 gap-y-2 text-[13px] text-[var(--color-ink-3)] md:grid-cols-3 md:text-right">
            <div>
              <span className="t-label-caps block text-[var(--color-mute)]">
                Phone
              </span>
              {siteHotel.phone}
            </div>
            <div>
              <span className="t-label-caps block text-[var(--color-mute)]">
                Check-in · out
              </span>
              {siteHotel.checkInTime} · {siteHotel.checkOutTime}
            </div>
            <div>
              <span className="t-label-caps block text-[var(--color-mute)]">
                Address
              </span>
              {siteHotel.address}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-line)] pt-6 text-[12px] text-[var(--color-mute)] md:flex-row md:items-center md:justify-between">
          <span>© 2026 {siteHotel.name}. All rights reserved.</span>
          <span className="t-label-caps">
            Powered by CoolStay
          </span>
        </div>
      </div>
    </footer>
  );
}
