import { createPersona } from "../create/pipeline.js";
import type { GenerateFn } from "../core/types.js";

/** Build a GenerateFn from env vars for CLI use */
function makeGenerate(): GenerateFn {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (anthropicKey) {
    return async (prompt: string) => {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6-20250514",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }
      const data = (await response.json()) as { content: Array<{ text: string }> };
      return data.content[0].text;
    };
  }

  if (openaiKey) {
    return async (prompt: string) => {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
      const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
      return data.choices[0].message.content;
    };
  }

  console.error("Set ANTHROPIC_API_KEY or OPENAI_API_KEY");
  process.exit(1);
}

export async function create(
  name: string,
  displayName: string,
  outputDir: string,
  urls?: string[],
  signalsDir?: string
): Promise<void> {
  const generate = makeGenerate();

  console.log(`Creating persona "${displayName}" (${name})...`);
  if (urls?.length) console.log(`  Scraping ${urls.length} URL(s)...`);
  if (signalsDir) console.log(`  Reading signals from ${signalsDir}`);

  const entity = await createPersona({
    name,
    displayName,
    urls,
    signalsDir,
    outputDir,
    generate,
  });

  console.log(`\nPersona created: ${entity.displayName}`);
  console.log(`  Profile: ${outputDir}/personas/${name}/profile.md`);
}
