import type { ReactElement, ReactNode } from 'react';

export function FashionCardViewActionLink({
  href,
  label,
}: Readonly<{ href: string; label: ReactNode }>): ReactElement {
  return (
    <a className="flex flex-row items-center gap-1" href={href}>
      {label}
    </a>
  );
}
