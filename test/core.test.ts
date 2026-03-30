import { describe, it, expect } from "vitest";
import { join } from "path";
import { loadEntity, listEntities, listAll } from "../src/core/engine.js";
import type { TeekConfig } from "../src/core/types.js";
import { buildSystemPrompt } from "../src/core/prompt.js";

const config: TeekConfig = {
  rootDir: join(import.meta.dirname, "fixtures"),
};

describe("listEntities", () => {
  it("lists personas", () => {
    const names = listEntities(config, "persona");
    expect(names).toContain("test-person");
  });

  it("lists roles", () => {
    const names = listEntities(config, "role");
    expect(names).toContain("test-role");
  });

  it("lists agents", () => {
    const names = listEntities(config, "agent");
    expect(names).toContain("test-agent");
  });

  it("returns empty array for missing kind directory", () => {
    const emptyConfig: TeekConfig = { rootDir: join(import.meta.dirname, "nonexistent") };
    const names = listEntities(emptyConfig, "persona");
    expect(names).toEqual([]);
  });
});

describe("listAll", () => {
  it("returns all three kinds", () => {
    const all = listAll(config);
    expect(all.persona).toContain("test-person");
    expect(all.role).toContain("test-role");
    expect(all.agent).toContain("test-agent");
  });
});

describe("loadEntity", () => {
  it("loads a persona with correct shape", () => {
    const entity = loadEntity(config, "persona", "test-person");
    expect(entity.kind).toBe("persona");
    expect(entity.name).toBe("test-person");
    expect(entity.displayName).toBe("Ada Lovelace");
    expect(entity.profile).toContain("Identity & Self-Narrative");
    expect(entity.context).toContain("Analytical Engine");
  });

  it("loads a role", () => {
    const entity = loadEntity(config, "role", "test-role");
    expect(entity.kind).toBe("role");
    expect(entity.displayName).toBe("Code Reviewer");
    expect(entity.context).toBe("");
  });

  it("loads an agent", () => {
    const entity = loadEntity(config, "agent", "test-agent");
    expect(entity.kind).toBe("agent");
    expect(entity.displayName).toBe("Lint Watcher");
  });

  it("throws on missing entity", () => {
    expect(() => loadEntity(config, "persona", "nonexistent")).toThrow(
      'persona "nonexistent" not found'
    );
  });

  it("includes available entities in error message", () => {
    expect(() => loadEntity(config, "persona", "nonexistent")).toThrow(
      "test-person"
    );
  });
});

describe("buildSystemPrompt", () => {
  it("builds persona prompt with simulator instructions", () => {
    const entity = loadEntity(config, "persona", "test-person");
    const prompt = buildSystemPrompt(entity);
    expect(prompt).toContain("You are a simulator of the person described below");
    expect(prompt).toContain("Ada Lovelace");
    expect(prompt).toContain("COGNITIVE PROFILE");
    expect(prompt).toContain("Identity & Self-Narrative");
  });

  it("builds role prompt with role instructions", () => {
    const entity = loadEntity(config, "role", "test-role");
    const prompt = buildSystemPrompt(entity);
    expect(prompt).toContain("You are operating in the role described below");
    expect(prompt).toContain("ROLE DEFINITION");
    expect(prompt).toContain("Code Reviewer");
  });

  it("builds agent prompt with agent instructions", () => {
    const entity = loadEntity(config, "agent", "test-agent");
    const prompt = buildSystemPrompt(entity);
    expect(prompt).toContain("You are an autonomous agent");
    expect(prompt).toContain("AGENT DEFINITION");
  });

  it("includes context when present", () => {
    const entity = loadEntity(config, "persona", "test-person");
    const prompt = buildSystemPrompt(entity);
    expect(prompt).toContain("CONTEXT:");
    expect(prompt).toContain("Analytical Engine");
  });

  it("omits context section when empty", () => {
    const entity = loadEntity(config, "role", "test-role");
    const prompt = buildSystemPrompt(entity);
    expect(prompt).not.toContain("CONTEXT:");
  });
});
