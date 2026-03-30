import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { GenerateFn } from "../core/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, "..", "..", "templates", "profile-template.md");

export interface SynthesizeOptions {
  displayName: string;
  signals: string;
  generate: GenerateFn;
}

/** Use an LLM to synthesize source signals into an 8-section cognitive profile */
export async function synthesizeProfile(options: SynthesizeOptions): Promise<string> {
  const { displayName, signals, generate } = options;

  const template = readFileSync(templatePath, "utf-8");

  const prompt = `You are building a cognitive profile of ${displayName}.

SOURCE MATERIAL:
${signals}

Fill in the following template. Every claim must trace to the source material above.
If you can't fill a section from the sources, say "Insufficient source material."
Replace all placeholder text (including HTML comments) with actual content.
Replace {Name} with "${displayName}" and {date} with today's date.

TEMPLATE:
${template}`;

  return generate(prompt);
}
