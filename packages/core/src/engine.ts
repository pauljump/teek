import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import type { EntityKind, TeekEntity, TeekConfig } from "./types.js";

const kindDirNames: Record<EntityKind, string> = {
  persona: "personas",
  role: "roles",
  agent: "agents",
};

function loadDir(dir: string): string {
  if (!existsSync(dir)) return "";
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => readFileSync(join(dir, f), "utf-8"))
    .join("\n\n---\n\n");
}

export function listEntities(config: TeekConfig, kind: EntityKind): string[] {
  const dir = join(config.rootDir, kindDirNames[kind]);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function listAll(config: TeekConfig): Record<EntityKind, string[]> {
  return {
    persona: listEntities(config, "persona"),
    role: listEntities(config, "role"),
    agent: listEntities(config, "agent"),
  };
}

export function loadEntity(config: TeekConfig, kind: EntityKind, name: string): TeekEntity {
  const dir = join(config.rootDir, kindDirNames[kind]);
  const entityDir = join(dir, name);

  if (!existsSync(entityDir)) {
    const available = listEntities(config, kind);
    throw new Error(
      `${kind} "${name}" not found. Available: ${available.join(", ") || "(none)"}`
    );
  }

  const profilePath = join(entityDir, "profile.md");
  if (!existsSync(profilePath)) {
    throw new Error(`${kind} "${name}" has no profile.md`);
  }

  const profile = readFileSync(profilePath, "utf-8");
  const context = loadDir(join(entityDir, "context"));

  const heading = profile.match(/^#\s+(.+?)(?:\s*—.*)?$/m);
  const displayName = heading ? heading[1].trim() : name;

  return { kind, name, displayName, profile, context };
}
