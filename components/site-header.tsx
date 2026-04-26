"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
            Partner Hotels
          </span>
        </Link>

        <nav className="flex items-center gap-10 text-[15px] font-medium">
          <Link
            href="/hotels"
            className="nav-link"
            data-active={pathname.startsWith("/hotels")}
          >
            호텔소개
          </Link>
          <Link
            href="/reservation"
            className="nav-link"
            data-active={pathname.startsWith("/reservation")}
          >
            예약
          </Link>
        </nav>
      </div>
    </header>
  );
}
