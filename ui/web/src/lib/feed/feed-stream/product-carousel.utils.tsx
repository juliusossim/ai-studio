import type { MouseEvent } from 'react';

export function clearProductCarouselBurstTimeout(burstTimeoutRef: {
  current: ReturnType<typeof globalThis.setTimeout> | undefined;
}): void {
  if (burstTimeoutRef.current !== undefined) {
    globalThis.clearTimeout(burstTimeoutRef.current);
  }
}

export function readPreviousMediaIndex(current: number, total: number): number {
  return current === 0 ? total - 1 : current - 1;
}

export function readNextMediaIndex(current: number, total: number): number {
  return current === total - 1 ? 0 : current + 1;
}

export function stopProductCarouselEventPropagation(event: MouseEvent<HTMLElement>): void {
  event.stopPropagation();
}
