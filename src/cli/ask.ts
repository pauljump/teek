import { createInterface } from "readline";
import { loadEntity } from "../core/engine.js";
import { buildSystemPrompt } from "../core/prompt.js";
import type { TeekConfig, EntityKind } from "../core/types.js";

/** Make a direct HTTP call to an LLM provider */
async function callLLM(
  provider: "anthropic" | "openai",
  apiKey: string,
  system: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  if (provider === "anthropic") {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6-20250514",
        max_tokens: 2048,
        system,
        messages,
      }),
    });
    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }
    const data = (await response.json()) as { content: Array<{ text: string }> };
    return data.content[0].text;
  } else {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 2048,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0].message.content;
  }
}

function getProvider(): { provider: "anthropic" | "openai"; apiKey: string } {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (anthropicKey) return { provider: "anthropic", apiKey: anthropicKey };
  if (openaiKey) return { provider: "openai", apiKey: openaiKey };
  console.error("Set ANTHROPIC_API_KEY or OPENAI_API_KEY");
  process.exit(1);
}

export async function ask(
  config: TeekConfig,
  kind: EntityKind,
  name: string,
  question?: string
): Promise<void> {
  const entity = loadEntity(config, kind, name);
  const systemPrompt = buildSystemPrompt(entity);
  const { provider, apiKey } = getProvider();
  const history: Array<{ role: "user" | "assistant"; content: string }> = [];

  // Single question mode
  if (question) {
    const result = await callLLM(provider, apiKey, systemPrompt, [
      { role: "user", content: question },
    ]);
    console.log("\n" + result + "\n");
    return;
  }

  // Interactive mode
  console.log(`┌─────────────────────────────────────┐`);
  console.log(`│  ${entity.displayName} (${kind})`.padEnd(38) + `│`);
  console.log(`│  Ask anything. Type 'quit' to exit. │`);
  console.log(`└─────────────────────────────────────┘\n`);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "You > ",
  });

  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();
    if (!input) { rl.prompt(); return; }
    if (input === "quit" || input === "exit") { rl.close(); return; }

    history.push({ role: "user", content: input });

    try {
      const result = await callLLM(provider, apiKey, systemPrompt, history);
      history.push({ role: "assistant", content: result });
      console.log(`\n${entity.displayName} > ${result}\n`);
    } catch (err) {
      console.error("Error:", err instanceof Error ? err.message : err);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    console.log("\n");
    process.exit(0);
  });
}
