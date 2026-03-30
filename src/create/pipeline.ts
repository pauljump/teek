import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { scrapeUrl } from "./scraper.js";
import { synthesizeProfile } from "./synthesizer.js";
import { loadEntity } from "../core/engine.js";
import type { CreateOptions, TeekEntity } from "../core/types.js";

/** Create a new persona from URLs and/or existing signal documents */
export async function createPersona(options: CreateOptions): Promise<TeekEntity> {
  const { name, displayName, urls, signalsDir, outputDir, generate } = options;

  const personaDir = join(outputDir, "personas", name);
  const personaSignalsDir = join(personaDir, "signals");

  // Ensure directories exist
  mkdirSync(personaSignalsDir, { recursive: true });

  // Step 1: Scrape URLs into signals
  if (urls && urls.length > 0) {
    for (const url of urls) {
      const slug = new URL(url).pathname
        .replace(/\//g, "-")
        .replace(/^-|-$/g, "")
        .replace(/[^a-z0-9-]/gi, "") || "page";
      const markdown = await scrapeUrl(url);
      writeFileSync(join(personaSignalsDir, `${slug}.md`), markdown);
    }
  }

  // Step 2: Collect all signals
  let signals = "";

  // From scraped URLs
  if (existsSync(personaSignalsDir)) {
    const files = readdirSync(personaSignalsDir).filter((f) => f.endsWith(".md"));
    for (const file of files.sort()) {
      signals += readFileSync(join(personaSignalsDir, file), "utf-8") + "\n\n---\n\n";
    }
  }

  // From existing signals directory
  if (signalsDir && existsSync(signalsDir)) {
    const files = readdirSync(signalsDir).filter((f) => f.endsWith(".md"));
    for (const file of files.sort()) {
      signals += readFileSync(join(signalsDir, file), "utf-8") + "\n\n---\n\n";
    }
  }

  // Step 3: Synthesize profile
  const profileContent = await synthesizeProfile({
    displayName,
    signals: signals.trim(),
    generate,
  });

  // Step 4: Write profile
  writeFileSync(join(personaDir, "profile.md"), profileContent);

  // Step 5: Return loaded entity
  return loadEntity({ rootDir: outputDir }, "persona", name);
}
