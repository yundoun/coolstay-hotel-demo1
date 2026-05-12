"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/ui/lib/cn";

const NAV_SECTIONS = [
  { id: "rooms", label: "객실" },
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

  const scrollTo = useCallback((id: string) => {
    const targetId = id === "reservation" ? "step-indicator" : id;
    const el = document.getElementById(targetId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

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
          aria-label="꿀스테이 홈"
          className="flex items-center gap-2"
        >
          <Image
            src="/coolstay_logo.png"
            alt="꿀스테이"
            width={120}
            height={28}
            priority
            className={cn(
              "h-[28px] w-auto transition-opacity duration-[240ms]",
              onDark ? "brightness-0 invert" : "",
            )}
          />
          <span className="t-label-caps text-current opacity-80 hidden sm:inline">
            소월 서울
          </span>
        </Link>

        <nav className="flex items-center gap-6 md:gap-10 text-[15px] font-medium">
          {NAV_SECTIONS.map(({ id, label, isButton }) =>
            isButton ? (
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
