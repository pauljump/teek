import { listAll, listEntities } from "../core/engine.js";
import type { TeekConfig, EntityKind } from "../core/types.js";

export function roster(config: TeekConfig, kind?: EntityKind): void {
  if (kind) {
    const names = listEntities(config, kind);
    if (names.length === 0) {
      console.log(`No ${kind}s found.`);
      return;
    }
    console.log(`\n${kind}s:`);
    names.forEach((n) => console.log(`  - ${n}`));
  } else {
    const all = listAll(config);
    let found = false;
    for (const [k, names] of Object.entries(all)) {
      if (names.length > 0) {
        found = true;
        console.log(`\n${k}s:`);
        names.forEach((n) => console.log(`  - ${n}`));
      }
    }
    if (!found) {
      console.log("No entities found.");
    }
  }
}
