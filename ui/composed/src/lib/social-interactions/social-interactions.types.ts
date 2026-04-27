import type { ReactNode } from 'react';

export type SocialInteractionAction = 'like' | 'save' | 'comment' | 'share' | 'reglam';
export type SocialInteractionVariant = 'inline' | 'overlay';

export type SocialInteractionCounts = Readonly<{
  likes?: number;
  saves?: number;
  comments?: number;
  shares?: number;
  reglams?: number;
}>;

export type SocialInteractionState = Readonly<{
  liked?: boolean;
  saved?: boolean;
  shared?: boolean;
  reglammed?: boolean;
}>;

export type SocialReglamMeta = Readonly<{
  enabled: boolean;
  commissionRate: number;
  shareCount?: number;
}>;

export type SocialInteractionsProps = Readonly<{
  variant?: SocialInteractionVariant;
  visibleActions?: readonly SocialInteractionAction[];
  counts?: SocialInteractionCounts;
  state?: SocialInteractionState;
  disabledActions?: Partial<Record<SocialInteractionAction, boolean>>;
  reglamMeta?: SocialReglamMeta;
  onInteraction?: (action: SocialInteractionAction, extra?: Record<string, unknown>) => void;
}>;

export type ActionDef = Readonly<{
  id: SocialInteractionAction;
  icon: ReactNode;
  value: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}>;
