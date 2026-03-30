// Core — entity loading and prompt building
export { loadEntity, listEntities, listAll } from "./core/engine.js";
export { buildSystemPrompt } from "./core/prompt.js";

// Create — persona creation pipeline
export { createPersona } from "./create/pipeline.js";
export { generatePersona, type PersonaConstraints, type GeneratePersonaOptions } from "./create/generator.js";

// Types
export type {
  EntityKind,
  TeekEntity,
  TeekConfig,
  GenerateFn,
  CreateOptions,
} from "./core/types.js";
