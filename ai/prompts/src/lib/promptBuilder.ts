import type { SystemPrompt } from '@org/types';

export const buildSystemPrompt = ({ input, rules, profile }: SystemPrompt): string => {
  return `
  ${input}
  rules:
  ${rules}
  ${profile?.preferredLanguage ? `The user's preferred language is ${profile.preferredLanguage}.` : ''}
  ${profile?.userName ? `The user's name is ${profile.userName}.` : ''}
  `;
};
