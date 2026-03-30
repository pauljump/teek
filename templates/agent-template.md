# {Agent Name}

> {One-sentence description: what this agent does and why it exists.}

## Mission

<!-- One paragraph. What is this agent trying to accomplish? What outcome does it drive? -->

## Trigger

<!-- When does this agent run? Options:
  - Session start (background agent, runs automatically)
  - On demand (invoked when needed)
  - Event-driven (runs when a specific thing happens, e.g., before deploy, after commit)
  - Scheduled (runs on a cadence, e.g., daily, weekly)
-->

## Cadence

<!-- How often and in what pattern does this agent do its work?
  - Continuous (watches in real-time)
  - Per-session (one scan per session)
  - Periodic (every N hours/days)
  - One-shot (runs once per invocation)
-->

## Scope

<!-- What does this agent look at? Be specific:
  - Which directories, files, or patterns?
  - Which external systems (GitHub, APIs, logs)?
  - What is explicitly OUT of scope?
-->

## What You Watch For / What You Do

<!-- The core logic. What does this agent actually check, analyze, or produce?
  Organize by category. Be specific enough that the agent can act autonomously. -->

## Output Format

<!-- Exactly what the agent produces. Include a template or example.
  Where does the output go? (stdout, a file, a GitHub issue, a comment?) -->

## How You Think

<!-- The agent's judgment framework. When something is ambiguous, how does it decide?
  What's the threshold for reporting vs. ignoring? What's noise vs. signal? -->
