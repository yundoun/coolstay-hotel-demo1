import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";
import type { AboutBlock } from "@/lib/content/site-content";
import {
  Sparkles,
  Utensils,
  Wine,
  Dumbbell,
  Waves,
  Headset,
} from "lucide-react";

const FEATURE_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  spa: Sparkles,
  dining: Utensils,
  lounge: Wine,
  fitness: Dumbbell,
  pool: Waves,
  concierge: Headset,
};

export function AboutBlocks({ blocks }: { blocks: AboutBlock[] }) {
  return (
    <div className="flex flex-col gap-0">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={i} block={block} />;
          case "image-text":
            return <ImageTextBlock key={i} block={block} index={i} />;
          case "feature-grid":
            return <FeatureGridBlock key={i} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

/* ── Text Block ── */
function TextBlock({ block }: { block: AboutBlock }) {
  return (
    <section className="py-[120px]">
      <div className="container-page max-w-[800px]">
        {block.eyebrow && (
          <Reveal>
            <span className="eyebrow">{block.eyebrow}</span>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h2 className="t-h2 mt-6 whitespace-pre-line">{block.title}</h2>
        </Reveal>
        {block.body && (
          <Reveal delay={0.1}>
            <p className="t-body-lg mt-8 text-[var(--color-ink-2)] leading-[1.9]">
              {block.body}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ── Image + Text Block ── */
function ImageTextBlock({ block, index }: { block: AboutBlock; index: number }) {
  const isImageLeft = block.imagePosition === "left";
  const bgClass = index % 2 === 0 ? "" : "bg-[var(--color-bg-soft)]";

  return (
    <section className={`py-[120px] ${bgClass}`}>
      <div className="container-page">
        <div
          className={`grid grid-cols-1 gap-10 md:gap-16 md:grid-cols-2 items-center ${
            isImageLeft ? "" : "md:[&>*:first-child]:order-2"
          }`}
        >
          {/* Image */}
          <Reveal delay={0.05}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
              {block.image && (
                <Image
                  src={block.image}
                  alt={block.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
          </Reveal>

          {/* Text */}
          <div>
            {block.eyebrow && (
              <Reveal>
                <span className="eyebrow">{block.eyebrow}</span>
              </Reveal>
            )}
            <Reveal delay={0.08}>
              <h2 className="t-h2 mt-6 whitespace-pre-line">{block.title}</h2>
            </Reveal>
            {block.body && (
              <Reveal delay={0.14}>
                <p className="t-body-lg mt-8 text-[var(--color-ink-2)] leading-[1.9]">
                  {block.body}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Feature Grid Block ── */
function FeatureGridBlock({ block }: { block: AboutBlock }) {
  return (
    <section className="bg-[var(--color-bg-soft)] py-[120px]">
      <div className="container-page">
        {block.eyebrow && (
          <Reveal>
            <span className="eyebrow">{block.eyebrow}</span>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h2 className="t-h2 mt-6">{block.title}</h2>
        </Reveal>

        {block.features && (
          <ul className="mt-[64px] grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
            {block.features.map((f, i) => {
              const Icon = FEATURE_ICONS[f.icon] ?? Sparkles;
              return (
                <Reveal key={f.title} delay={(i % 3) * 0.04} as="li">
                  <div className="flex flex-col gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white border border-[var(--color-line)]">
                      <Icon className="h-6 w-6 text-[var(--color-ink)]" strokeWidth={1.5} />
                    </div>
                    <h3 className="t-h4">{f.title}</h3>
                    <p className="t-body-sm text-[var(--color-ink-3)]">{f.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
