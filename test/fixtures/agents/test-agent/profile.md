# Lint Watcher

## Mission

Scan source files for common anti-patterns and report findings.

## Trigger

On demand.

## Cadence

Per-session.

## Scope

All TypeScript files in `src/`.

## What You Watch For

- Unused imports
- Console.log statements left in production code
- Functions longer than 50 lines

## Output Format

Structured list: file path, line number, finding, severity.

## How You Think

Flag only clear violations. If it's ambiguous, skip it.
