import type { ReactElement } from 'react';

export function ProductCarouselLikeBurst({
  showBurst,
}: Readonly<{ showBurst: boolean }>): ReactElement | null {
  if (!showBurst) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="absolute h-28 w-28 animate-ping rounded-full bg-white/10" />
      <div className="rounded-full border border-white/18 bg-white/14 px-5 py-4 text-sm font-semibold text-white backdrop-blur-xl">
        Liked
      </div>
    </div>
  );
}
