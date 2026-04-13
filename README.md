# Teek

**Persona simulation is a schema, not a prompt.**

Most AI personas are system prompts: "You are Warren Buffett. Talk like him." The result is generic, inconsistent, and sounds like every other AI roleplay. Teek takes a different approach — it models *how someone thinks*, not just what they sound like.

The core of Teek is an 8-section cognitive profile that captures decision-making patterns, value hierarchies, communication signatures, trust dynamics, stress responses, cognitive biases, and the gap between someone's self-narrative and how others see them. Feed it source material (essays, interviews, talks) and an LLM, and it produces a structured profile that makes simulation actually predictive.

```bash
npm install teek
```

## Quick Start

```bash
# Create a persona from source material
teek create pg \
  --display-name "Paul Graham" \
  --urls "https://paulgraham.com/startupideas.html" "https://paulgraham.com/ds.html" \
  --output ./my-personas

# Ask it something
teek ask --root ./my-personas --persona pg "Should I pivot?"

# See what you've built
teek roster --root ./my-personas
```

Three commands. No config files. No API lock-in. Bring your own LLM.

## Why This Works

A typical AI persona prompt:

> You are Paul Graham. You are the co-founder of Y Combinator. You write essays about startups. Respond in his style.

What you get: a parody. Vaguely intellectual sentences peppered with "startup" and "growth." No real predictive power. Ask it something PG never wrote about and it falls apart.

A Teek cognitive profile:

> **Decision Architecture → Risk Tolerance:** High tolerance for unconventional ideas, low tolerance for derivative ones. Will fund something that "sounds like a bad idea but is actually good" over something that sounds reasonable. Hates consensus picks.
>
> **Values Hierarchy:** When values conflict: (1) Organic authenticity — the idea must come from genuine need (2) Taste — knowing what good looks like (3) Simplicity — the right answer is almost always simpler (4) Earnestness (5) Independence
>
> **Narrative Gap:** Presents as a detached essayist extracting timeless principles. Others see an opinionated investor whose framework privileges a specific founder archetype (young, technical, unconventional) and underweights operational excellence and domain expertise.

What you get: a model that responds *the way PG would actually respond*. It knows what he'd push back on, what would light him up, what his blind spots are. Ask it something he never wrote about and the decision architecture still holds because it's modeled from how he thinks, not what he's said.

The difference is the schema.

## The Schema

Every persona is a `profile.md` with 8 sections:

| Section | What it captures | Why it matters |
|---------|-----------------|----------------|
| **Identity & Self-Narrative** | How they see themselves | The lens they filter everything through |
| **Decision Architecture** | Risk tolerance, information appetite, time horizon, speed | How they'd approach a problem they've never seen |
| **Values Hierarchy** | What wins when values compete | Predicts tradeoffs, not just preferences |
| **Communication Patterns** | How they persuade, what triggers them, approval signals | Makes the voice authentic, not just stylistic |
| **Trust & Loyalty Model** | How trust is earned, lost, and tested | Models relationship dynamics, not just opinions |
| **Stress & Conflict Responses** | Behavior under pressure, when wrong | The part most personas completely miss |
| **Cognitive Biases** | Blind spots — external analysis only | Prevents the persona from being a flattering self-portrait |
| **Narrative Gap** | Their story vs. others' story about them | Where the real predictive power lives |

**Cognitive Biases** is sourced from external analysis, never from the person's own statements. **Narrative Gap** is mandatory — it's the tension between self-image and reality, and it's where the most interesting simulation behavior emerges.

Templates are included in the package at `templates/profile-template.md`.

## Three Entity Types

| Kind | What it is | Example | Question it answers |
|------|-----------|---------|-------------------|
| **Persona** | Cognitive profile of a real person | Paul Graham | "What would *this person* say?" |
| **Role** | Professional expertise lens | Staff Engineer | "What would *someone in this role* say?" |
| **Agent** | Autonomous worker with a mission | Code Reviewer | "What needs to be done right now?" |

Each entity is a directory with a `profile.md` and optional `context/` files. Teek loads them and builds system prompts for any LLM.

## Programmatic API

### Load and use an entity

```typescript
import { loadEntity, buildSystemPrompt } from "teek";

const config = { rootDir: "./my-personas" };
const persona = loadEntity(config, "persona", "pg");
const systemPrompt = buildSystemPrompt(persona);

// Use with any LLM — Teek doesn't care which one
const response = await yourLLM.chat({
  system: systemPrompt,
  messages: [{ role: "user", content: "Should I pivot to enterprise?" }],
});
```

### List entities

```typescript
import { listAll, listEntities } from "teek";

const config = { rootDir: "./my-personas" };

const all = listAll(config);
// { persona: ["pg", "buffett"], role: ["staff-eng"], agent: [] }

const personas = listEntities(config, "persona");
// ["pg", "buffett"]
```

### Create a persona from source material

```typescript
import { createPersona } from "teek";

const entity = await createPersona({
  name: "pg",
  displayName: "Paul Graham",
  urls: [
    "https://paulgraham.com/startupideas.html",
    "https://paulgraham.com/ds.html",
  ],
  outputDir: "./my-personas",
  generate: async (prompt) => {
    // Any function that takes a prompt and returns text
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
    return res.content[0].text;
  },
});
// Profile written to ./my-personas/personas/pg/profile.md
```

## CLI

Set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in your environment.

```bash
# List everything
teek roster --root ./my-personas

# Filter by kind
teek roster --kind persona

# Chat with a persona
teek ask --root ./my-personas --persona pg "What do you think of vertical SaaS?"

# Chat with a role
teek ask --root ./my-personas --role staff-eng "Review this architecture"

# Create a persona from URLs
teek create buffett \
  --display-name "Warren Buffett" \
  --urls "https://example.com/berkshire-letters" "https://example.com/interview" \
  --output ./my-personas
```

## Directory Structure

```
my-personas/
├── personas/
│   └── pg/
│       ├── profile.md       # 8-section cognitive profile
│       ├── context/         # Supporting documents (optional)
│       └── signals/         # Raw source material (optional)
├── roles/
│   └── staff-eng/
│       └── profile.md
└── agents/
    └── reviewer/
        └── profile.md
```

## BYOL (Bring Your Own LLM)

Teek has zero LLM dependencies. The `createPersona` function takes a `generate` callback — any async function that accepts a string and returns a string. The CLI makes direct HTTP calls. No SDK lock-in.

```typescript
// Anthropic
generate: (prompt) => claude(prompt)

// OpenAI
generate: (prompt) => gpt(prompt)

// Local model
generate: (prompt) => ollama.generate({ model: "llama3", prompt })

// Anything that speaks HTTP
generate: (prompt) => myCustomLLM(prompt)
```

## How It Works

1. **Scrape** — `teek create` fetches URLs and converts HTML to markdown
2. **Signal** — source material is saved as raw signals in `signals/`
3. **Synthesize** — an LLM fills the 8-section template from the source material, with the constraint that every claim must trace to a source
4. **Load** — `loadEntity` reads the profile + context files from disk
5. **Prompt** — `buildSystemPrompt` assembles a system prompt tuned to the entity kind
6. **Simulate** — send it to any LLM and get responses shaped by the cognitive profile

## License

MIT

---

**Part of a larger system.** See [pauljump/portfolio](https://github.com/pauljump/portfolio) for the full picture — 16 production apps, shared infrastructure, and the factory that builds them.
