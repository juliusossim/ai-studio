# UI Composed Storybook Alignment Plan

## Working Commands

- `pnpm sb:ui`
  Starts the `ui-composed` Storybook development server.
- `pnpm sb:ui:build`
  Builds the static Storybook site for `ui-composed`.
- `pnpm sb:ui:gen`
  Generates stories for eligible components across `ui-composed`.
- `pnpm sb:ui:gen:one -- --componentPath=src/lib/.../component.tsx`
  Generates a story for one specific `ui-composed` component.

## Current Setup Notes

- Storybook is configured through the Nx-inferred `ui-composed:storybook` and
  `ui-composed:build-storybook` targets.
- `@storybook/addon-a11y` is enabled.
- This library intentionally does not carry an external
  `@storybook/addon-essentials` package; for this Storybook 10 setup,
  essentials are treated as built-in functionality.

## Goal

Keep the stories that already express useful component intent, rewrite the low-signal ones,
and add first-class stories for the active composed surface that currently has no Storybook
coverage.

This is intentionally not a "delete and regenerate everything" plan. The generated stories from
Nx would be broader but much shallower than the hand-authored stories we already have.

## Audit Outcome

### Keep With Minor Polish

These already map to active components and can stay with small title/args cleanup:

- `src/lib/badge/BrandBadge.stories.tsx`
- `src/lib/error-message/error-message.stories.tsx`
- `src/lib/loading-spinner/loading-spinner.stories.tsx`

### Rewrite

These existed as low-signal placeholders. The current status is:

- completed: `src/lib/amount/Amount.stories.tsx`
- completed: `src/lib/media/MediaRenderer.stories.tsx`
- completed: `src/lib/stars/Star.stories.tsx`
- completed: typography rewrite into:
  - `src/lib/typography/MoreInfoText.stories.tsx`
  - `src/lib/typography/typography.stories.tsx`
  - `src/lib/typography/truncated-text.stories.tsx`

### Add

This gap is now effectively closed for the active `ui/composed` runtime surface.

Completed additions from the first batches:

- `src/lib/carousel/brand-carousel/brand-carousel.stories.tsx`
- `src/lib/carousel/carousel-wrapper/carousel-wrapper.stories.tsx`
- `src/lib/carousel/media-carousel/media-carousel.stories.tsx`
- `src/lib/carousel/product-carousel/product-carousel.stories.tsx`
- `src/lib/carousel/property-carousel/property-carousel.stories.tsx`
- `src/lib/card/fashion-card/fashion-card.stories.tsx`
- `src/lib/card/property-card/property-card.stories.tsx`
- `src/lib/command/command-wrapper/command-wrapper.stories.tsx`
- `src/lib/command/suggestion-search/suggestion-search.stories.tsx`
- `src/lib/form/field-wrapper/field-wrapper.stories.tsx`
- `src/lib/form/form-checkbox/form-checkbox.stories.tsx`
- `src/lib/form/form-input/form-input.stories.tsx`
- `src/lib/form/form-select/form-select.stories.tsx`
- `src/lib/form/form-textarea/form-textarea.stories.tsx`
- `src/lib/grid/product-grid/product-grid.stories.tsx`
- `src/lib/nav/nav-list-item/nav-list-item.stories.tsx`
- `src/lib/nav/nav-menu/nav-menu.stories.tsx`
- `src/lib/form/search-input/search-input.stories.tsx`
- `src/lib/form/searchable-select/searchable-select.stories.tsx`
- `src/lib/social-interactions/social-interactions.stories.tsx`

## Rewrite Standards

For rewritten stories:

- use stable story titles grouped by domain, not single loose names
- use realistic args instead of empty objects
- prefer `Default`, `Variants`, `States`, and `Interactive` over `Primary` and `Heading`
- only keep `play` functions where they validate meaningful behavior
- avoid stories that only assert the component name renders

## New Title Shape

Use this structure going forward:

- `Composed/Badge/BrandBadge`
- `Composed/Card/FashionCard`
- `Composed/Card/PropertyCard`
- `Composed/Carousel/BrandCarousel`
- `Composed/Carousel/MediaCarousel`
- `Composed/Form/FormInput`
- `Composed/Form/FormSearchableSelect`
- `Composed/Nav/NavMenu`
- `Composed/Social/SocialInteractions`
- `Composed/Typography/Text`

## Recommended Implementation Order

1. Optional polish on `BrandBadge`, `ErrorMessage`, and `LoadingSpinner`
2. Optional accessibility/content review across story args and descriptions
3. Optional consolidation if any stories feel too fine-grained after live review

## Completed Batches

- rewritten: `Amount`, `StarRating`, and `MediaRenderer`
- rewritten: typography into coherent grouped stories
- added: `SocialInteractions`, `BrandCarousel`, and `MediaCarousel`
- added: `FashionCard`, `PropertyCard`, `ProductCarousel`, and `PropertyCarousel`
- added: `FieldWrapper`, `FormInput`, `FormCheckbox`, `FormSelect`, `FormTextarea`, `SearchInput`, and `FormSearchableSelect`
- added: `CarouselWrapper`, `NavListItem`, `NavMenu`, `CommandWrapper`, `SuggestionSearch`, and `ProductGrid`
