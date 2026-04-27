import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "일정" },
  { n: 2, label: "호텔 · 객실" },
  { n: 3, label: "투숙객 정보" },
  { n: 4, label: "확인" },
];

export function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="sticky top-[72px] z-40 bg-white border-b border-[var(--color-line)]">
      <div className="container-page py-5">
        <ol className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const isDone = s.n < current;
            const isActive = s.n === current;
            return (
              <li key={s.n} className="flex flex-1 items-center gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "relative inline-flex h-3 w-3 shrink-0 rounded-full transition-colors",
                      isDone && "bg-[var(--color-ink)]",
                      isActive && "bg-[var(--color-honey-500)] ring-4 ring-[var(--color-bg-tint)]",
                      !isDone && !isActive && "border border-[var(--color-line)] bg-white",
                    )}
                  />
                  <span
                    className={cn(
                      "t-caption whitespace-nowrap",
                      isActive
                        ? "text-[var(--color-ink)] font-semibold"
                        : isDone
                          ? "text-[var(--color-ink)]"
                          : "text-[var(--color-mute)]",
                    )}
                  >
                    {String(s.n).padStart(2, "0")} · {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="h-px flex-1 bg-[var(--color-line)]" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
