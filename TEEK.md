# Teek: Operating File

**Read this first.** Every session starts here. Then read `HANDOFF.md` for where the last session stopped.

## What Teek Is

Teek builds **falsifiable cognitive profiles of real people** from their public verbal output, and tests whether those profiles predict decisions.

Not "act like Andrew Chen." Anyone can write that prompt. Teek's claim is narrower and harder:

> Every behavioral claim traces to a dated, cited source with a verbatim excerpt. Claims carry a status, a confidence, and an expiry. The profile is built from a corpus cut at a date, then scored against what the person actually did after that date.

## This Is A Teaching Repo, Not A Startup

**Decided 2026-08-04.** Teek is not being commercialized. The deliverable is the method, taught well enough that a reader can run it themselves.

That decision resolves more than it costs. The landscape research (`docs/research/2026-08-04-persona-ai-landscape.md`) found a well-capitalized competitor in the predictive-fidelity lane (Simile, $100M Series A) and a legal wall around simulating named living people without consent. Both constraints bind a company. Neither binds a teacher. And the thing the whole category is missing, published measurement discipline, is precisely what a teaching artifact is for.

So the test of every change here is: **does this make the method easier to learn, run, and check?** Not: does this make a better product.

Primary artifact: `docs/how-to-build-a-mind-model.md`. Everything else exists to make that document true and runnable.

## The One Distinction That Governs Everything

| | Entertainment fidelity | Predictive fidelity |
|---|---|---|
| Question | Does it *feel* like them? | Does it *decide* like them? |
| Validation | Vibes, engagement | Held-out decisions, scored |
| Failure mode | Forer effect: sounds right about anyone | Measurable, and reported when bad |

**We build the right column.** Any feature that improves the feel without improving the score is decoration. When in doubt: does this move a number in `evaluation.json`?

## Before, Predict, After

The spine of the whole thing, and the reason it is teachable:

1. Cut the corpus at a date.
2. Build the profile using only what came before.
3. Make it predict specific, falsifiable decisions from after.
4. Check, and publish the score including when it is bad.

Nothing in this repo matters except as it serves that loop. Protocol in `docs/evaluation.md`.

## The Five Layers

A person moves up these layers only as far as a decision requires. Most stop at L0.

| Layer | Artifact | What it is | Cost |
|---|---|---|---|
| **L0** | `card.yaml` | Routing card. ~200 words. Who they are, what they decide, what gets a yes. | Cheap, run on a whole cohort |
| **L1** | `corpus/` | Normalized sourced documents with provenance frontmatter. Never loaded wholesale. | Crawl |
| **L2** | `evidence.json` | Claim ledger. Each claim: statement, status, confidence, source, excerpt, expiry. | Extraction pass |
| **L3** | `coding.json` | Scored trait layer from published at-a-distance methods. Comparable across people. | Coding pass |
| **L4** | `profile.md` | Human-readable cognitive synthesis. Every section cites claim IDs from L2/L3. | Synthesis pass |
| **L5** | `evaluation.md` | Held-out decisions, predicted vs actual, scored. | Evaluation pass |

**L4 is derived, not written.** A profile sentence with no claim ID behind it is decoration and gets cut. This is the rule that separates Teek from a prompt library.

## Cohorts

A **cohort** is a defined population mined at volume: VCs, historical figures, founders, critics. Defined in `cohorts/<name>.yaml`: membership, shared source patterns, and the shared evaluation questions every member is scored on.

Cohorts are why this is a mining operation and not a persona collection. The unit of work is the population, not the person.

## Evolving, Not Static

Every claim has `review_after`. Every coding run records the corpus window it scored.

- `teek decay` reports which profiles have gone stale.
- Re-crawling produces new corpus documents, which produce a new coding run.
- Diffing coding runs produces **drift**: what changed about this person, and when.

A static persona card is a photograph. A Teek profile has a changelog. That is the part nobody else has.

## Ethics, Non-Negotiable

Read `docs/ethics.md` before adding anyone. Short version:

- **Public figures, public statements only.** No private individuals, no private material.
- **Every claim cited.** An uncited claim about a real person is a fabrication with their name on it.
- **Simulate decisions, never speak as them in public.** Teek output is research and rehearsal, not publication.
- **Clinical language is out of bounds.** No diagnoses, no disorders, no pathology. The methods here measure decision style, not mental health.
- **The Narrative Gap and Cognitive Biases sections are external analysis.** They must be sourced to someone else's published observation, never invented.

## Repo Map

```
docs/method.md        the science Teek implements, and the honest limits
docs/schema.md        the L0-L5 artifact contracts
docs/evaluation.md    how predictive accuracy is measured
docs/ethics.md        what we will and will not do
packages/core         load entities, build system prompts
packages/corpus       crawl, normalize, store sourced documents
packages/ledger       build and validate the evidence ledger
packages/coder        automated at-a-distance coding (L3)
packages/eval         held-out decision harness and scoring
profiles/<cohort>/<person>/
cohorts/<name>.yaml
```

## Working Rules

1. **Scout, then build.** Present approaches before writing code.
2. **No stealth decisions.** Say when you picked between two options.
3. **Checkpoint often.** Update `HANDOFF.md` whenever a phase completes. A new session must be able to resume from it cold.
4. **No metered API calls.** LLM work runs through Claude Code subagents. Never call a paid API autonomously.
5. **Provenance or it does not ship.** A claim without a source is a bug, not a draft.

## Origin

Extracted from the Monorepo factory on 2026-08-04. Prior history lives in `pauljump/Monorepo` under `teek/`, `packages/teek/`, and `intel/achen/`. See `docs/provenance.md`.
