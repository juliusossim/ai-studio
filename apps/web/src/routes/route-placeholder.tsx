import type { ReactElement } from 'react';
import { Link } from 'react-router';

export interface RoutePlaceholderAction {
  readonly href: string;
  readonly label: string;
}

export interface RoutePlaceholderProps {
  readonly actions?: readonly RoutePlaceholderAction[];
  readonly description: string;
  readonly eyebrow?: string;
  readonly title: string;
}

export function RoutePlaceholder({
  actions,
  description,
  eyebrow = 'Route boundary',
  title,
}: Readonly<RoutePlaceholderProps>): ReactElement {
  return (
    <main className="min-h-[60vh] bg-background px-6 py-12 text-foreground">
      <section className="mx-auto max-w-3xl rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
        {actions?.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                className="rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                key={action.href}
                to={action.href}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
