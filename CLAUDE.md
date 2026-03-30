# Teek — Developer Guide

## What Teek Is

Teek is a persona simulation engine. It provides a structured schema (8-section cognitive profiles) for modeling how people think, decide, and communicate — then loads those profiles and builds system prompts for any LLM.

Three entity types:

| Kind | Purpose | Example |
|------|---------|---------|
| **Persona** | Cognitive profile of a real or fictional person | Paul Graham, Ada Lovelace |
| **Role** | Professional expertise lens | Staff Engineer, Product Manager |
| **Agent** | Autonomous worker with triggers and mission | Code Reviewer, Research Scout |

## Architecture

```
src/
├── core/               # Layer 1: load + prompt
│   ├── engine.ts          loadEntity, listEntities, listAll
│   ├── prompt.ts          buildSystemPrompt (kind-specific)
│   └── types.ts           TeekConfig, TeekEntity, EntityKind, GenerateFn, CreateOptions
├── create/             # Layer 2: persona creation pipeline
│   ├── scraper.ts         URL → markdown (fetch + node-html-markdown)
│   ├── synthesizer.ts     signals + LLM callback → 8-section profile
│   ├── pipeline.ts        createPersona — orchestrates scrape → signal → synthesize → write
│   └── generator.ts       generatePersona — create fictional personas from constraints
├── cli/                # Layer 3: CLI commands
│   ├── index.ts           entry point (teek roster | ask | create)
│   ├── roster.ts          list entities
│   ├── ask.ts             chat with entity (direct HTTP to Anthropic/OpenAI)
│   └── create.ts          create persona from URLs
└── index.ts            # Public API exports
```

**Key design property:** Everything takes a `TeekConfig` with `rootDir` — no hardcoded paths. This makes Teek usable as a library with any directory layout.

**BYOL (Bring Your Own LLM):** The `generate` callback pattern means zero LLM SDK dependencies. The CLI uses direct HTTP calls. Library consumers pass any `(prompt: string) => Promise<string>` function.

## Public API

Exported from `index.ts`:

```typescript
// Loading entities
loadEntity(config, kind, name)    // → TeekEntity
listEntities(config, kind)        // → string[]
listAll(config)                   // → Record<EntityKind, string[]>

// Prompt building
buildSystemPrompt(entity)         // → string (kind-specific system prompt)

// Creation
createPersona(options)            // → TeekEntity (scrape URLs → synthesize → write profile)
generatePersona(options)          // → TeekEntity (create fictional persona from constraints)

// Types
EntityKind, TeekEntity, TeekConfig, GenerateFn, CreateOptions
```

## Build & Test

```bash
pnpm install          # install dependencies
pnpm run build        # compile TypeScript
pnpm test             # run all tests (vitest)
pnpm run typecheck    # type-check without emitting
```

## Tests

- `test/core.test.ts` — engine loading, listing, prompt building
- `test/create.test.ts` — scraper, synthesizer, full creation pipeline
- `src/tests/generator.test.ts` — fictional persona generation

Test fixtures live in `test/fixtures/` with synthetic entities (not real people).

## The 8-Section Schema

Every persona profile follows this structure:

1. **Identity & Self-Narrative** — how they see themselves
2. **Decision Architecture** — risk tolerance, information needs, speed, time horizon
3. **Values Hierarchy** — what wins when values compete
4. **Communication Patterns** — persuasion style, triggers, approval signals
5. **Trust & Loyalty Model** — how trust is earned and lost
6. **Stress & Conflict Responses** — behavior under pressure
7. **Cognitive Biases** — blind spots (external analysis only, never self-reported)
8. **Narrative Gap** — their story vs. others' story about them

Templates for all three entity types are in `templates/`.

## Entity Directory Convention

```
<rootDir>/
├── personas/<name>/
│   ├── profile.md          # required — the cognitive profile
│   ├── context/            # optional — supporting documents
│   └── signals/            # optional — raw source material
├── roles/<name>/
│   └── profile.md
└── agents/<name>/
    └── profile.md
```

## Contributing

- Entities use codenames in all files and commits — no real names in code
- Persona claims must trace to public sources
- Cognitive Biases section is sourced from external analysis only
- Narrative Gap is mandatory for personas
- Agents must have trigger, cadence, and scope defined — otherwise they're roles
