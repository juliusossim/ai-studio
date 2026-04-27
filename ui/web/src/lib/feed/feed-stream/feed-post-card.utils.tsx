export function readFeedPostActionClassName(
  interaction: 'like' | 'save' | 'share',
  isLiked: boolean,
): string {
  if (interaction === 'like' && isLiked) {
    return 'border-rose-400/30 bg-rose-500/15 text-rose-200 hover:bg-rose-500/20';
  }

  if (interaction === 'share') {
    return 'border-white/16 bg-white/10 text-white hover:bg-white/14';
  }

  return 'border-white/16 bg-transparent text-white hover:bg-white/10';
}
