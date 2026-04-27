import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { Caption, H1, H2, H3, H4, Label, SmallText, Text, Typography } from './typography';

function StoryPanel({
  children,
  title,
}: Readonly<{ children: ReactNode; title: string }>): ReactElement {
  return (
    <section className="space-y-4 rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      {children}
    </section>
  );
}

const meta: Meta<typeof Typography> = {
  component: Typography,
  title: 'Composed/Typography/Typography',
  args: {
    children:
      'Ripples helps real estate teams present listings with the confidence of a design system rather than a collection of ad hoc text styles.',
    color: 'default',
    variant: 'body1',
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <div className="max-w-4xl bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] p-6 text-foreground">
        {Story()}
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hierarchy: Story = {
  render: () => (
    <div className="space-y-6">
      <StoryPanel title="Headings">
        <div className="space-y-3">
          <H1>Feed-first listing presentation</H1>
          <H2>Editorial hierarchy for modern property storytelling</H2>
          <H3>Balanced mid-level section heading</H3>
          <H4>Compact support heading</H4>
        </div>
      </StoryPanel>
      <StoryPanel title="Body styles">
        <div className="space-y-3">
          <Text>
            Default body text for listing descriptions, onboarding copy, and feature callouts.
          </Text>
          <SmallText>
            Smaller support text for captions, disclaimers, and metadata around the primary content.
          </SmallText>
          <Caption>Caption text for secondary data points and subtle interface labels.</Caption>
          <Label>Agent verified</Label>
        </div>
      </StoryPanel>
    </div>
  ),
};

export const ColorStates: Story = {
  render: () => (
    <StoryPanel title="Semantic colors">
      <div className="space-y-3">
        <Text color="default">Default text stays anchored to the foreground token.</Text>
        <Text color="muted">
          Muted text softens supporting information without losing legibility.
        </Text>
        <Text color="primary">Primary text pulls attention toward emphasized copy.</Text>
        <Text color="success">Success text can reinforce verified or completed states.</Text>
        <Text color="warning">Warning text surfaces cautionary messaging.</Text>
        <Text color="error">Error text highlights validation or blocked actions.</Text>
      </div>
    </StoryPanel>
  ),
};

export const AlignmentAndWeight: Story = {
  render: () => (
    <div className="space-y-6">
      <StoryPanel title="Weight">
        <div className="space-y-2">
          <Text weight="light">Light weight for subtle descriptive copy.</Text>
          <Text weight="normal">Normal weight for standard reading flow.</Text>
          <Text weight="medium">Medium weight for slightly stronger emphasis.</Text>
          <Text weight="semibold">Semibold weight for callouts and interface emphasis.</Text>
          <Text weight="bold">Bold weight for strong emphasis.</Text>
        </div>
      </StoryPanel>
      <StoryPanel title="Alignment">
        <div className="space-y-3">
          <Text align="left">Left aligned text remains the default reading posture.</Text>
          <Text align="center">Centered text works for hero moments and short declarations.</Text>
          <Text align="right">Right aligned text can support compact metadata blocks.</Text>
        </div>
      </StoryPanel>
    </div>
  ),
};
