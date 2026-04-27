# @org/ui-composed

Concern-shaped reusable UI assembled from `@org/ui-primitives`.

Use this library for presentation-focused compounds that are more specific than
primitives but still reusable across multiple product surfaces.

Examples:

- `property-carousel`
- `feed-post-shell`
- `listing-summary-card`

Boundary guidance:

- can depend on `@org/ui-primitives`, `@org/ui-hooks`, `@org/types`, and
  `@org/utils`
- should not own fetching, mutations, or page workflow logic
- keep feature- or domain-heavy assembly in feature-local packages until reuse
  is proven

Current status:

- the active package surface is intentionally limited to repo-aligned exports
- adapted modules currently available:
  - `amount`
  - `badge/brand-badge`
  - `card/fashion-card`
  - `card/property-card`
  - `carousel/brand-carousel`
  - `carousel/media-carousel`
  - `carousel/product-carousel`
  - `carousel/property-carousel`
  - `command/command-wrapper`
  - `command/suggestion-search`
  - `error-message`
  - `form`
  - `grid/product-grid`
  - `hooks` (repo-native re-exports only)
  - `loading-spinner`
  - `media` (repo-native re-export only)
  - `nav`
  - `social-interactions`
  - `stars/star-rating`
  - `typography`
- imported dumps that still rely on foreign package structure stay isolated until
  they are adapted to `@org/ui-primitives`, `@org/ui-hooks`, `@org/utils`, and
  local `*.types.ts` files
- see `STORYBOOK_ALIGNMENT_PLAN.md` for the current Storybook coverage plan

This library was generated with [Nx](https://nx.dev).

## Storybook

Current Storybook commands for `ui-composed` are:

- `pnpm sb:ui`
  Starts the `ui-composed` Storybook development server.
- `pnpm sb:ui:build`
  Builds the static Storybook site for `ui-composed`.
- `pnpm sb:ui:gen`
  Generates Storybook stories for eligible `ui-composed` components.
- `pnpm sb:ui:gen:one -- --componentPath=src/lib/.../component.tsx`
  Generates a Storybook story for one specific `ui-composed` component.

Current setup notes:

- Storybook is wired through the Nx-inferred `ui-composed:storybook` and
  `ui-composed:build-storybook` targets.
- `@storybook/addon-a11y` is installed and enabled.
- Storybook Essentials are treated as built-in Storybook 10 functionality here,
  so this library does not carry an external `@storybook/addon-essentials`
  package.

## Running unit tests

Current active validation targets are:

- `pnpm nx run ui-composed:lint`
- `pnpm nx run ui-composed:typecheck`
- `pnpm sb:ui:build`

`ui-composed` does not currently have a configured Nx `test` target.
