/** The three kinds of entities Teek manages */
export type EntityKind = "persona" | "role" | "agent";

/** Loaded entity ready for the LLM */
export interface TeekEntity {
  kind: EntityKind;
  name: string;
  displayName: string;
  profile: string;
  context: string;
}

/** Configuration for Teek — tells it where to find entities */
export interface TeekConfig {
  rootDir: string;
}

/** A function that sends a prompt to an LLM and returns the response text */
export type GenerateFn = (prompt: string) => Promise<string>;

/** Options for creating a new persona from source material */
export interface CreateOptions {
  name: string;
  displayName: string;
  urls?: string[];
  signalsDir?: string;
  outputDir: string;
  generate: GenerateFn;
}
