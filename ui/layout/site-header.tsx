"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/ui/lib/cn";
import { siteHotel } from "@/hotel-data/hotel";

const NAV_SECTIONS = [
  { id: "rooms", label: "객실" },
  { id: "lookup", label: "예약 조회", href: "/reservation/lookup" },
  { id: "reservation", label: "예약하기", isButton: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const onDark = isHome && !scrolled;
  const router = useRouter();

  const scrollToEl = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const scrollTo = useCallback((id: string) => {
    const targetId = id === "reservation" ? "step-indicator" : id;

    if (!isHome) {
      router.push("/");
      // 홈 로드 후 스크롤 보정
      const tryScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          scrollToEl(targetId);
        } else {
          requestAnimationFrame(tryScroll);
        }
      };
      setTimeout(tryScroll, 100);
      return;
    }

    scrollToEl(targetId);
  }, [isHome, router, scrollToEl]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color,box-shadow] duration-[240ms] ease-out",
        onDark
          ? "bg-transparent text-white"
          : "bg-white text-[var(--color-ink)] border-b border-[var(--color-line)]",
      )}
    >
      <div className="container-page flex h-[72px] items-center justify-between">
        <Link
          href="/"
          aria-label={`${siteHotel.name} 홈`}
          className="group flex items-center gap-0"
        >
          <span
            className={cn(
              "font-serif-ko text-[15px] font-semibold tracking-[-0.01em] leading-tight transition-colors duration-[240ms]",
              "sm:text-[17px]",
            )}
            style={{ fontFamily: "var(--font-serif-ko)" }}
          >
            {siteHotel.name}
          </span>
        </Link>

        <nav className="flex items-center gap-6 md:gap-10 text-[15px] font-medium">
          {NAV_SECTIONS.map(({ id, label, isButton, href }) =>
            href ? (
              <Link
                key={id}
                href={href}
                className="nav-link"
              >
                {label}
              </Link>
            ) : isButton ? (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="inline-flex items-center justify-center h-[36px] px-5 rounded-[2px] bg-[var(--color-honey-500)] text-[var(--color-ink)] text-[13px] font-semibold tracking-[0.04em] hover:bg-[var(--color-honey-600)] transition-colors cursor-pointer border-none"
              >
                {label}
              </button>
            ) : (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="nav-link cursor-pointer bg-transparent border-none"
              >
                {label}
              </button>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
