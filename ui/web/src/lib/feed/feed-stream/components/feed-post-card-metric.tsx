import type { ReactElement } from 'react';

export function FeedPostCardMetric({
  label,
  value,
}: Readonly<{ label: string; value: string }>): ReactElement {
  return (
    <div>
      <p className="text-base font-semibold text-white">{value}</p>
      <p className="text-xs text-white/58">{label}</p>
    </div>
  );
}
