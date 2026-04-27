import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type {
  SocialInteractionAction,
  SocialInteractionCounts,
  SocialInteractionState,
  SocialInteractionsProps,
} from './social-interactions.types';
import { InlineSocialInteractionsLayout, OverlaySocialInteractionsLayout } from './components';
import {
  buildSocialInteractionActions,
  createNextPresentationState,
} from './social-interactions.utils';

export function SocialInteractions({
  variant = 'inline',
  visibleActions,
  counts,
  state,
  disabledActions,
  reglamMeta,
  onInteraction,
}: Readonly<SocialInteractionsProps>): ReactElement {
  const [presentation, setPresentation] = useState<{
    counts: SocialInteractionCounts;
    state: SocialInteractionState;
  }>({
    counts: counts ?? {},
    state: state ?? {},
  });

  useEffect(() => {
    setPresentation((current) => ({
      ...current,
      counts: counts ?? {},
    }));
  }, [counts]);

  useEffect(() => {
    setPresentation((current) => ({
      ...current,
      state: state ?? {},
    }));
  }, [state]);

  const handleInteraction = (
    action: SocialInteractionAction,
    extra?: Record<string, unknown>,
  ): void => {
    if (disabledActions?.[action]) {
      return;
    }

    setPresentation((current) =>
      createNextPresentationState(action, current.counts, current.state),
    );
    onInteraction?.(action, extra);
  };

  const actions = buildSocialInteractionActions({
    counts: presentation.counts,
    disabledActions,
    onInteraction: handleInteraction,
    reglamMeta,
    state: presentation.state,
    variant,
  });
  const visible = visibleActions
    ? actions.filter((action) => visibleActions.includes(action.id))
    : actions;

  return variant === 'overlay' ? (
    <OverlaySocialInteractionsLayout actions={visible} />
  ) : (
    <InlineSocialInteractionsLayout actions={visible} />
  );
}
