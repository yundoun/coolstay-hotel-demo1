"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/ui/lib/cn";
import { siteConfig } from "@/hotel-data";

const NAV_SECTIONS = [
  { id: "rooms", label: "객실" },
  { id: "lookup", label: "예약 조회", href: "/reservation/lookup" },
  { id: "reservation", label: "예약하기", isButton: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // 모바일 메뉴 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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

  const handleNav = useCallback((id: string, href?: string) => {
    setMobileOpen(false);
    if (href) {
      router.push(href);
    } else {
      scrollTo(id);
    }
  }, [router, scrollTo]);

  return (
    <>
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
            aria-label={`${siteConfig.name} 홈`}
            className="group flex items-center gap-0"
          >
            <span
              className={cn(
                "font-serif-ko text-[15px] font-semibold tracking-[-0.01em] leading-tight transition-colors duration-[240ms]",
                "sm:text-[17px]",
              )}
              style={{ fontFamily: "var(--font-serif-ko)" }}
            >
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium">
            {NAV_SECTIONS.map(({ id, label, isButton, href }) =>
              href ? (
                <Link key={id} href={href} className="nav-link">
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

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden relative z-[60] w-10 h-10 flex items-center justify-center transition-colors",
              mobileOpen
                ? "text-[var(--color-ink)]"
                : onDark
                  ? "text-white"
                  : "text-[var(--color-ink)]",
            )}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[48] bg-black/40 md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile slide panel */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[49] w-[70%] max-w-[300px] bg-white md:hidden transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          <div className="flex flex-col gap-1 flex-1">
            {NAV_SECTIONS.map(({ id, label, href }, i) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNav(id, href)}
                className="flex items-center justify-between py-4 text-[15px] font-medium text-[var(--color-ink)] border-b border-[var(--color-line-soft)] group text-left"
                style={{ transitionDelay: mobileOpen ? `${(i + 1) * 50}ms` : "0ms" }}
              >
                <span className="group-hover:text-[var(--color-ink-2)] transition-colors">{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--color-line)]">
            <p className="text-[var(--color-ink-3)] text-[12px]">{siteConfig.phone}</p>
            <p className="text-[var(--color-mute)] text-[11px] mt-1">&copy; 2026 {siteConfig.name}</p>
          </div>
        </div>
      </div>
    </>
  );
}
