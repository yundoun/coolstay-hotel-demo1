import Image from "next/image";
import { Reveal } from "@/ui/shared/reveal";

type AboutData = {
  subtitle?: string;
  title: string;
  body?: string;
  images: string[];
};

export function AboutSection({ about }: { about: AboutData }) {
  return (
    <section className="py-16 md:py-[120px]">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 md:gap-16 md:grid-cols-2 items-center md:[&>*:first-child]:order-2">
          {/* Image */}
          {about.images[0] && (
            <Reveal delay={0.05}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
                <Image
                  src={about.images[0]}
                  alt={about.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}

          {/* Text */}
          <div>
            {about.subtitle && (
              <Reveal>
                <span className="eyebrow">{about.subtitle}</span>
              </Reveal>
            )}
            <Reveal delay={0.08}>
              <h2 className="t-h2 mt-6 whitespace-pre-line">{about.title}</h2>
            </Reveal>
            {about.body && (
              <Reveal delay={0.14}>
                <p className="t-body-lg mt-8 text-[var(--color-ink-2)] leading-[1.9]">
                  {about.body}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
