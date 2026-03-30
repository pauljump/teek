import { describe, it, expect, vi } from "vitest";
import { scrapeUrl } from "../src/create/scraper.js";
import { synthesizeProfile } from "../src/create/synthesizer.js";
import { createPersona } from "../src/create/pipeline.js";
import { existsSync, mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("scrapeUrl", () => {
  it("converts HTML to markdown", async () => {
    const html = `<html><body>
      <h1>Test Article</h1>
      <p>This is a <strong>test</strong> paragraph.</p>
    </body></html>`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(html),
    }) as unknown as typeof fetch;

    const result = await scrapeUrl("https://example.com/article");
    expect(result).toContain("Test Article");
    expect(result).toContain("**test**");
    expect(result).toContain("paragraph");
  });

  it("throws on failed fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    }) as unknown as typeof fetch;

    await expect(scrapeUrl("https://example.com/missing")).rejects.toThrow("404");
  });
});

describe("synthesizeProfile", () => {
  it("calls generate with signals and template", async () => {
    const generate = vi.fn().mockResolvedValue("# Warren Buffett — Cognitive Profile\n\n## Identity & Self-Narrative\n\nThe Oracle of Omaha.");

    const result = await synthesizeProfile({
      displayName: "Warren Buffett",
      signals: "Warren Buffett believes in value investing. He reads 500 pages a day.",
      generate,
    });

    expect(generate).toHaveBeenCalledOnce();
    const prompt = generate.mock.calls[0][0];
    expect(prompt).toContain("Warren Buffett");
    expect(prompt).toContain("value investing");
    expect(prompt).toContain("Identity & Self-Narrative");
    expect(result).toContain("Oracle of Omaha");
  });

  it("includes the full 8-section template in the prompt", async () => {
    const generate = vi.fn().mockResolvedValue("# Test — Cognitive Profile");

    await synthesizeProfile({
      displayName: "Test Person",
      signals: "Some signals.",
      generate,
    });

    const prompt = generate.mock.calls[0][0];
    expect(prompt).toContain("Decision Architecture");
    expect(prompt).toContain("Values Hierarchy");
    expect(prompt).toContain("Communication Patterns");
    expect(prompt).toContain("Trust & Loyalty Model");
    expect(prompt).toContain("Stress & Conflict Responses");
    expect(prompt).toContain("Cognitive Biases");
    expect(prompt).toContain("Narrative Gap");
  });
});

describe("createPersona", () => {
  it("creates persona directory with profile.md", async () => {
    const outputDir = mkdtempSync(join(tmpdir(), "teek-test-"));

    const generate = vi.fn().mockResolvedValue(
      "# Test Person — Cognitive Profile\n\n## Identity & Self-Narrative\n\nA test person."
    );

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("<html><body><p>Some article content about Test Person.</p></body></html>"),
    }) as unknown as typeof fetch;

    const entity = await createPersona({
      name: "test-person",
      displayName: "Test Person",
      urls: ["https://example.com/article"],
      outputDir,
      generate,
    });

    expect(entity.kind).toBe("persona");
    expect(entity.name).toBe("test-person");
    expect(entity.displayName).toBe("Test Person");
    expect(existsSync(join(outputDir, "personas", "test-person", "profile.md"))).toBe(true);
    expect(existsSync(join(outputDir, "personas", "test-person", "signals"))).toBe(true);

    expect(generate).toHaveBeenCalledOnce();
    const prompt = generate.mock.calls[0][0];
    expect(prompt).toContain("Some article content");

    rmSync(outputDir, { recursive: true });
  });

  it("uses existing signals directory", async () => {
    const outputDir = mkdtempSync(join(tmpdir(), "teek-test-"));
    const fixturesDir = join(import.meta.dirname, "fixtures");

    const generate = vi.fn().mockResolvedValue(
      "# Ada Lovelace — Cognitive Profile\n\n## Identity & Self-Narrative\n\nA mathematician."
    );

    const entity = await createPersona({
      name: "ada",
      displayName: "Ada Lovelace",
      signalsDir: join(fixturesDir, "personas", "test-person", "context"),
      outputDir,
      generate,
    });

    expect(entity.kind).toBe("persona");
    expect(generate).toHaveBeenCalledOnce();
    const prompt = generate.mock.calls[0][0];
    expect(prompt).toContain("Analytical Engine");

    rmSync(outputDir, { recursive: true });
  });
});
