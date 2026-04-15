# AI Studio — Agent Instructions

You are an expert-level AI coding agent working on **ai-studio**, an Nx monorepo that builds LLM-powered agentic AI systems in TypeScript.

You have deep expertise in: TypeScript (strict, NodeNext), Nx monorepos, LLM function calling, agent orchestration, prompt engineering, OpenAI SDK, and modern Node.js tooling.

## Critical Rules

1. **Read before writing** — Never generate code without first reading the existing source files to understand current patterns
2. **Respect module boundaries** — `shared/*` never imports from `ai/*`. `ai/*` never cross-imports. Check before adding imports
3. **Run tasks through Nx** — Use `pnpm nx run <project>:<target>`, never raw `tsc`/`jest`/`eslint`
4. **TypeScript strict mode** — No `any`. Use `unknown` + type guards. Explicit return types on exports
5. **tsconfig `paths: {}` override** — Every `tsconfig.lib.json` and `tsconfig.spec.json` must set `"paths": {}` to isolate builds
6. **Conventional Commits** — All commit messages follow `type(scope): description` format

## Project Layout

| Package         | Import           | Purpose                                               |
| --------------- | ---------------- | ----------------------------------------------------- |
| `ai/core`       | `@org/core`      | Agent runtime, orchestration loop, base agent types   |
| `ai/functions`  | `@org/functions` | LLM function calling schemas (JSON Schema + TS types) |
| `ai/prompts`    | `@org/prompts`   | Prompt templates as composable functions              |
| `ai/tools`      | `@org/tools`     | Tool implementations — pure functions agents invoke   |
| `shared/config` | `@org/config`    | `requireEnv()`, `getEnv()`, environment detection     |
| `shared/types`  | `@org/types`     | Shared interfaces and type definitions                |
| `shared/utils`  | `@org/utils`     | Pure utility functions                                |
| `shared/ui`     | `@org/ui`        | UI components (future)                                |

## Dependency Flow

```text
apps/* → ai/* + shared/*
ai/*   → shared/* only
shared/* → nothing internal
```

## Code Patterns

- **One file per function/tool** in `@org/functions` and `@org/tools`
- **Tools are pure**: `(input: ValidatedInput) => Promise<ToolResult>`
- **Prompts are functions**: Accept context parameters, return strings. No string concatenation
- **Validate at boundaries**: LLM outputs are untrusted — validate with type guards or schemas
- **Environment config**: Use `requireEnv()` from `@org/config` for mandatory variables
- **Errors**: Throw `Error` subclasses with descriptive messages, never plain strings

## Testing

- Jest for `ai/*` and `shared/utils` — `.spec.ts` files next to source
- Vitest for `shared/types`, `shared/ui` — `.spec.ts` files next to source
- Mock LLM responses in tests. Test tool dispatch logic. Validate prompt assembly

## Style

- Single quotes, semicolons, trailing commas, 100 char width
- kebab-case files, camelCase functions, PascalCase types/classes

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
