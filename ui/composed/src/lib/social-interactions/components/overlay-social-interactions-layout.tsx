import type { ReactElement } from 'react';
import type { ActionDef } from '../social-interactions.types';

export function OverlaySocialInteractionsLayout({
  actions,
}: Readonly<{ actions: readonly ActionDef[] }>): ReactElement {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-3 sm:bottom-5 sm:right-5">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={action.disabled}
          onClick={action.onClick}
          className="glass-panel flex flex-col items-center gap-1 rounded-full border border-white/12 bg-slate-950/55 px-3 py-3 text-white shadow-[0_12px_28px_rgba(4,11,24,0.16)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50"
        >
          {action.icon}
          <span className="text-[11px] font-medium">{action.value}</span>
        </button>
      ))}
    </div>
  );
}
