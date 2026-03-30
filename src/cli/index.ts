#!/usr/bin/env node

import { resolve } from "path";
import { roster } from "./roster.js";
import { ask } from "./ask.js";
import { create } from "./create.js";
import type { EntityKind, TeekConfig } from "../core/types.js";

function printUsage(): void {
  console.log(`
teek — persona creation engine

Commands:
  teek roster                         List all entities
  teek ask [question]                 Chat with an entity
  teek create <name>                  Create a persona from sources

Options:
  --root <dir>          Root directory for entities (default: cwd)
  --persona <name>      Select persona (for ask)
  --role <name>         Select role (for ask)
  --agent <name>        Select agent (for ask)
  --kind <type>         Filter by kind (for roster)
  --display-name <name> Display name (for create)
  --urls <url...>       URLs to scrape (for create)
  --signals <dir>       Signals directory (for create)
  --output <dir>        Output directory (for create, default: --root value)
  --help                Show this help
`);
}

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const command = args[0] && !args[0].startsWith("-") ? args[0] : undefined;
  let root = process.cwd();
  let kind: EntityKind = "persona";
  let name = "travis";
  let filterKind: EntityKind | undefined;
  let displayName: string | undefined;
  let urls: string[] = [];
  let signalsDir: string | undefined;
  let output: string | undefined;
  let help = false;
  const rest: string[] = [];

  for (let i = command ? 1 : 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--root" && args[i + 1]) {
      root = resolve(args[++i]);
    } else if (arg === "--persona" && args[i + 1]) {
      kind = "persona";
      name = args[++i];
    } else if (arg === "--role" && args[i + 1]) {
      kind = "role";
      name = args[++i];
    } else if (arg === "--agent" && args[i + 1]) {
      kind = "agent";
      name = args[++i];
    } else if (arg === "--kind" && args[i + 1]) {
      filterKind = args[++i] as EntityKind;
    } else if (arg === "--display-name" && args[i + 1]) {
      displayName = args[++i];
    } else if (arg === "--urls") {
      while (args[i + 1] && !args[i + 1].startsWith("-")) {
        urls.push(args[++i]);
      }
    } else if (arg === "--signals" && args[i + 1]) {
      signalsDir = resolve(args[++i]);
    } else if (arg === "--output" && args[i + 1]) {
      output = resolve(args[++i]);
    } else if (arg === "--help") {
      help = true;
    } else if (!arg.startsWith("-")) {
      rest.push(arg);
    }
  }

  const createName = command === "create" ? rest[0] : undefined;

  return {
    command,
    config: { rootDir: root } satisfies TeekConfig,
    kind,
    name,
    filterKind,
    createName,
    displayName,
    urls,
    signalsDir,
    output: output || root,
    question: command === "ask" ? rest.join(" ") : undefined,
    help,
  };
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv);

  if (parsed.help || !parsed.command) {
    printUsage();
    process.exit(parsed.help ? 0 : 1);
  }

  switch (parsed.command) {
    case "roster":
      roster(parsed.config, parsed.filterKind);
      break;

    case "ask":
      await ask(parsed.config, parsed.kind, parsed.name, parsed.question || undefined);
      break;

    case "create": {
      if (!parsed.createName) {
        console.error("Usage: teek create <name> --display-name <name> [--urls ...] [--signals <dir>]");
        process.exit(1);
      }
      const dn = parsed.displayName || parsed.createName;
      await create(parsed.createName, dn, parsed.output, parsed.urls.length ? parsed.urls : undefined, parsed.signalsDir);
      break;
    }

    default:
      console.error(`Unknown command: ${parsed.command}`);
      printUsage();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
