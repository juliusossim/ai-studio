import { Bookmark, Heart, MessageCircle, Repeat2, Share2 } from 'lucide-react';
import { cn } from '@org/ui-primitives';
import type {
  ActionDef,
  SocialInteractionAction,
  SocialInteractionCounts,
  SocialInteractionState,
  SocialInteractionsProps,
} from './social-interactions.types';

export function formatSocialInteractionMetric(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toLocaleString();
}

export function createNextPresentationState(
  action: SocialInteractionAction,
  counts: SocialInteractionCounts,
  state: SocialInteractionState,
): Readonly<{
  counts: SocialInteractionCounts;
  state: SocialInteractionState;
}> {
  if (action === 'comment') {
    return { counts, state };
  }

  const currentState = Boolean(getActionStateValue(action, state));
  const nextActive = !currentState;
  const metricKey = getMetricKey(action);
  const nextCounts: SocialInteractionCounts = {
    ...counts,
    [metricKey]: Math.max(0, (counts[metricKey] ?? 0) + (nextActive ? 1 : -1)),
  };
  const nextState: SocialInteractionState = {
    ...state,
    ...getNextActionState(action, nextActive),
  };

  return {
    counts: nextCounts,
    state: nextState,
  };
}

function getActionStateValue(
  action: Exclude<SocialInteractionAction, 'comment'>,
  state: SocialInteractionState,
): boolean | undefined {
  switch (action) {
    case 'like':
      return state.liked;
    case 'save':
      return state.saved;
    case 'share':
      return state.shared;
    case 'reglam':
      return state.reglammed;
  }
}

function getMetricKey(
  action: Exclude<SocialInteractionAction, 'comment'>,
): keyof SocialInteractionCounts {
  switch (action) {
    case 'like':
      return 'likes';
    case 'save':
      return 'saves';
    case 'share':
      return 'shares';
    case 'reglam':
      return 'reglams';
  }
}

function getNextActionState(
  action: Exclude<SocialInteractionAction, 'comment'>,
  nextActive: boolean,
): SocialInteractionState {
  switch (action) {
    case 'like':
      return { liked: nextActive };
    case 'save':
      return { saved: nextActive };
    case 'share':
      return { shared: nextActive };
    case 'reglam':
      return { reglammed: nextActive };
  }
}

function getActionColorClass(
  activeClassName: string,
  inactiveInlineClassName: string,
  isActive: boolean | undefined,
  variant: SocialInteractionsProps['variant'],
): string {
  if (isActive) {
    return activeClassName;
  }

  return variant === 'overlay' ? 'text-white' : inactiveInlineClassName;
}

function getReglamColorClass(
  isActive: boolean | undefined,
  reglamEnabled: boolean | undefined,
  variant: SocialInteractionsProps['variant'],
): string {
  if (isActive) {
    return 'fill-emerald-500 text-emerald-500';
  }

  if (variant === 'overlay') {
    return reglamEnabled ? 'text-amber-300' : 'text-white';
  }

  return 'text-emerald-500';
}

function getReglamValue(
  reglamMeta: SocialInteractionsProps['reglamMeta'],
  reglams: number,
  variant: SocialInteractionsProps['variant'],
): string {
  if (variant === 'overlay' && reglamMeta?.enabled) {
    return `${reglamMeta.commissionRate}%`;
  }

  return formatSocialInteractionMetric(reglams);
}

export function buildSocialInteractionActions({
  counts,
  disabledActions,
  onInteraction,
  reglamMeta,
  state,
  variant,
}: Readonly<
  Required<Pick<SocialInteractionsProps, 'variant'>> & Omit<SocialInteractionsProps, 'variant'>
>): ActionDef[] {
  const likes = counts?.likes ?? 0;
  const saves = counts?.saves ?? 0;
  const comments = counts?.comments ?? 0;
  const shares = counts?.shares ?? 0;
  const reglams = counts?.reglams ?? 0;

  const baseActions: ActionDef[] = [
    {
      id: 'like',
      icon: (
        <Heart
          className={cn(
            'h-5 w-5',
            getActionColorClass(
              'fill-rose-500 text-rose-500',
              'text-rose-500',
              state?.liked,
              variant,
            ),
          )}
        />
      ),
      label: 'Likes',
      disabled: disabledActions?.like,
      onClick: () => onInteraction?.('like'),
      value: formatSocialInteractionMetric(likes),
    },
    {
      id: 'save',
      icon: (
        <Bookmark
          className={cn(
            'h-5 w-5',
            getActionColorClass(
              'fill-amber-300 text-amber-300',
              'text-amber-500',
              state?.saved,
              variant,
            ),
          )}
        />
      ),
      label: 'Saves',
      disabled: disabledActions?.save,
      onClick: () => onInteraction?.('save'),
      value: formatSocialInteractionMetric(saves),
    },
    {
      id: 'comment',
      icon: (
        <MessageCircle
          className={cn('h-5 w-5', variant === 'overlay' ? 'text-white' : 'text-muted-foreground')}
        />
      ),
      label: 'Comments',
      disabled: disabledActions?.comment,
      onClick: () => onInteraction?.('comment'),
      value: formatSocialInteractionMetric(comments),
    },
    {
      id: 'share',
      icon: (
        <Share2
          className={cn(
            'h-5 w-5',
            getActionColorClass(
              'fill-sky-500 text-sky-500',
              'text-sky-500',
              state?.shared,
              variant,
            ),
          )}
        />
      ),
      label: 'Shares',
      disabled: disabledActions?.share,
      onClick: () => onInteraction?.('share'),
      value: formatSocialInteractionMetric(shares),
    },
  ];

  const reglamAction: ActionDef = {
    id: 'reglam',
    icon: (
      <Repeat2
        className={cn(
          'h-5 w-5',
          getReglamColorClass(state?.reglammed, reglamMeta?.enabled, variant),
        )}
      />
    ),
    label: variant === 'overlay' && reglamMeta?.enabled ? 'Reglam & Earn' : 'Reglams',
    disabled: disabledActions?.reglam,
    onClick: () =>
      onInteraction?.(
        'reglam',
        reglamMeta?.enabled ? { commissionRate: reglamMeta.commissionRate } : undefined,
      ),
    value: getReglamValue(reglamMeta, reglams, variant),
  };

  return [...baseActions, reglamAction];
}
