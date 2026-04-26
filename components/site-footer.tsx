import Image from "next/image";

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
              Partner Hotels Demo
            </span>
          </div>
          <div className="grid grid-cols-1 gap-x-12 gap-y-2 text-[13px] text-[var(--color-ink-3)] md:grid-cols-3 md:text-right">
            <div>
              <span className="t-label-caps block text-[var(--color-mute)]">
                Inquiry
              </span>
              partners@coolstay.kr
            </div>
            <div>
              <span className="t-label-caps block text-[var(--color-mute)]">
                Phone
              </span>
              1522-0000
            </div>
            <div>
              <span className="t-label-caps block text-[var(--color-mute)]">
                Address
              </span>
              서울 강남구 테헤란로 123
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--color-line)] pt-6 text-[12px] text-[var(--color-mute)] md:flex-row md:items-center md:justify-between">
          <span>© 2026 CoolStay Corp. All rights reserved.</span>
          <span className="t-label-caps">
            CoolStay × Luxury Hotels
          </span>
        </div>
      </div>
    </footer>
  );
}
