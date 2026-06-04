import Image from "next/image";

import { cn } from "@/lib/utils";

// next/image photo card with a circuit-trace border (glowing corner ticks) and a
// gentle cyan hover glow. A branded poster gradient sits under the image as a
// blur-up substitute (public/ string srcs can't carry a blurDataURL), and the
// card degrades gracefully to that poster + a faint circuit motif when `src` is
// missing. `alt` is REQUIRED; all decorative chrome is aria-hidden.

export function PhotoCard({
  src,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  aspect = "aspect-[16/10]",
  tone = "light",
  className,
  children,
}: {
  /** public/ path, e.g. "/projects/solar-alaminos.webp". Omit → poster fallback. */
  src?: string;
  /** Required for real photos; pass "" only for the decorative fallback card. */
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Tailwind aspect utility, e.g. "aspect-[16/10]" | "aspect-[4/5]". */
  aspect?: string;
  tone?: "light" | "dark";
  className?: string;
  /** Overlay content — voltage tags, captions; rendered above the image. */
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "circuit-card photo-card group/photo relative overflow-hidden rounded-(--r-glass)",
        tone === "dark" && "circuit-card-dark",
        aspect,
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0",
          tone === "dark" ? "photo-poster-dark" : "photo-poster",
        )}
      />

      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-jce group-hover/photo:scale-[1.04]"
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center text-jce-green-700/30"
        >
          <svg viewBox="0 0 48 48" className="size-12" fill="none">
            <circle
              cx="24"
              cy="24"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M24 10v8m0 12v8m-14-14h8m12 0h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}

      {/* Legibility scrim for overlay content (tags/captions) */}
      {children ? (
        <>
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-jce-dark/90 via-jce-dark/40 to-transparent"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            {children}
          </div>
        </>
      ) : null}
    </div>
  );
}
