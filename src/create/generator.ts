import { readFileSync, mkdirSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import type { TeekEntity, EntityKind } from "../core/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, "..", "..", "templates", "profile-template.md");

export interface PersonaConstraints {
  age?: number;
  city?: string;
  neighborhood?: string;
  personality?: string;
  interests?: string[];
  communicationStyle?: string;
  occupation?: string;
  background?: string;
  [key: string]: unknown;
}

export type GenerateFn = (prompt: string) => Promise<string>;

export interface GeneratePersonaOptions {
  constraints: PersonaConstraints;
  signals?: string;
  generate: GenerateFn;
  name?: string;
}

const KNOWN_KEYS = [
  "age",
  "city",
  "neighborhood",
  "personality",
  "interests",
  "communicationStyle",
  "occupation",
  "background",
];

/** Load markdown files from a directory, concatenated */
function loadDir(dir: string): string {
  if (!existsSync(dir)) return "";
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readFileSync(join(dir, f), "utf-8"))
    .join("\n\n---\n\n");
}

/** Load a TeekEntity from an arbitrary root directory */
function loadEntityFromDir(rootDir: string, kind: EntityKind, name: string): TeekEntity {
  const kindDirs: Record<EntityKind, string> = {
    persona: join(rootDir, "personas"),
    role: join(rootDir, "roles"),
    agent: join(rootDir, "agents"),
  };

  const entityDir = join(kindDirs[kind], name);
  const profilePath = join(entityDir, "profile.md");

  if (!existsSync(profilePath)) {
    throw new Error(`${kind} "${name}" has no profile.md at ${profilePath}`);
  }

  const profile = readFileSync(profilePath, "utf-8");
  const context = loadDir(join(entityDir, "context"));

  // Extract display name from first heading (e.g. "# Luna — Cognitive Profile" → "Luna")
  const heading = profile.match(/^#\s+(.+?)(?:\s*—.*)?$/m);
  const displayName = heading ? heading[1].trim() : name;

  return { kind, name, displayName, profile, context };
}

export async function generatePersona(options: GeneratePersonaOptions): Promise<TeekEntity> {
  const { constraints, signals, generate } = options;

  const template = readFileSync(templatePath, "utf-8");

  let prompt =
    "You are generating a fictional person for a simulation. Create a believable, specific individual — not a stereotype.\n\nCONSTRAINTS:\n";

  if (constraints.age !== undefined) prompt += `- Age: ${constraints.age}\n`;
  if (constraints.city) prompt += `- City: ${constraints.city}\n`;
  if (constraints.neighborhood) prompt += `- Neighborhood: ${constraints.neighborhood}\n`;
  if (constraints.personality) prompt += `- Personality: ${constraints.personality}\n`;
  if (constraints.interests) prompt += `- Interests: ${constraints.interests.join(", ")}\n`;
  if (constraints.communicationStyle)
    prompt += `- Communication style: ${constraints.communicationStyle}\n`;
  if (constraints.occupation) prompt += `- Occupation: ${constraints.occupation}\n`;
  if (constraints.background) prompt += `- Background: ${constraints.background}\n`;

  // Any extra keys not in the known list
  for (const [key, value] of Object.entries(constraints)) {
    if (!KNOWN_KEYS.includes(key)) {
      prompt += `- ${key}: ${value}\n`;
    }
  }

  if (signals) {
    prompt += `\nSOURCE MATERIAL (use to inform the profile):\n${signals}\n`;
  }

  prompt += `\nINSTRUCTIONS:\n1. Choose a first name that fits the demographic. Use it everywhere {Name} appears.\n2. Fill in ALL sections of the template below with specific, concrete details.\n3. Make this person feel real — give them contradictions, blind spots, specific tastes.\n4. Do NOT use generic descriptions. Every detail should be specific to THIS person.\n5. Replace all placeholder text including HTML comments.\n6. Replace {date} with "2026-03-30".\n\nTEMPLATE:\n${template}`;

  const profileContent = await generate(prompt);

  // Extract name from first heading: "# Luna — Cognitive Profile" → "luna"
  const nameMatch = profileContent.match(/^#\s+(\w+)/m);
  const generatedName =
    options.name ||
    (nameMatch?.[1] ? nameMatch[1].toLowerCase() : `persona-${randomUUID().slice(0, 8)}`);

  // Write to a temp directory and load back as a TeekEntity
  const tempDir = join(tmpdir(), `teek-gen-${randomUUID()}`);
  const personaDir = join(tempDir, "personas", generatedName);
  mkdirSync(personaDir, { recursive: true });
  writeFileSync(join(personaDir, "profile.md"), profileContent);

  return loadEntityFromDir(tempDir, "persona", generatedName);
}
