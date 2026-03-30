import { describe, it, expect } from "vitest";
import { generatePersona } from "../create/generator.js";

describe("generatePersona", () => {
  it("generates a minimal persona from basic constraints", async () => {
    const persona = await generatePersona({
      constraints: {
        age: 27,
        city: "nyc",
        neighborhood: "williamsburg",
      },
      generate: async () => {
        return `# Luna — Cognitive Profile

> Purpose: Predict how Luna would respond to ideas, pitches, proposals, and decisions.
> Created: 2026-03-30

---

## Identity & Self-Narrative

Luna is a 27-year-old creative director living in Williamsburg, Brooklyn.

## Decision Architecture

### Risk Tolerance
Moderate.

### Information Appetite
Headlines first.

### Time Horizon
3-6 months.

### Decision Speed
Fast for social, slow for commitments.

## Values Hierarchy

1. Authenticity
2. Community

### Non-Negotiables
Won't fake enthusiasm.

### Tradeables
Comfort, stability.

## Communication Patterns

### How They Persuade
Story and energy.

### Language Triggers
Positive: authenticity. Negative: hustle culture.

### Approval vs. Rejection Signals
Interested: leans in. Checked out: one-word responses.

### Voice & Tone
Casual, warm.

## Trust & Loyalty Model

### How Trust Is Earned
Shared experiences.

### How Trust Is Lost
Flakiness.

### In-Group vs. Out-Group
Warm to new people, small inner circle.

### How They Test People
Casual hangout invite.

## Stress & Conflict Responses

### Under Pressure
Gets quiet.

### When Wrong
Admits it eventually.

### What Makes Them Defensive vs. Curious
Curious about ideas, defensive about lifestyle.

## Cognitive Biases

Availability bias, social proof.

## Narrative Gap

Sees herself as independent. Others see reliance on friend group.`;
      },
    });

    expect(persona.kind).toBe("persona");
    expect(persona.name).toBeTruthy();
    expect(persona.displayName).toBe("Luna");
    expect(persona.profile).toContain("Identity & Self-Narrative");
  });

  it("passes detailed constraints to the LLM prompt", async () => {
    let capturedPrompt = "";
    const persona = await generatePersona({
      constraints: {
        age: 34,
        city: "nyc",
        neighborhood: "astoria",
        personality: "skeptical engineer who reads too much sci-fi",
        interests: ["rock climbing", "board games"],
        communicationStyle: "dry humor, speaks in metaphors",
      },
      generate: async (prompt: string) => {
        capturedPrompt = prompt;
        return `# Ravi — Cognitive Profile\n\n## Identity & Self-Narrative\nRavi is a 34-year-old engineer.`;
      },
    });

    expect(capturedPrompt).toContain("34");
    expect(capturedPrompt).toContain("astoria");
    expect(capturedPrompt).toContain("skeptical engineer");
    expect(capturedPrompt).toContain("rock climbing");
    expect(capturedPrompt).toContain("dry humor");
    expect(persona.displayName).toBe("Ravi");
  });

  it("accepts raw signals for deep personas", async () => {
    let capturedPrompt = "";
    await generatePersona({
      constraints: { age: 40, city: "nyc" },
      signals: "This person wrote a blog post about urban farming...",
      generate: async (prompt: string) => {
        capturedPrompt = prompt;
        return `# Yara — Cognitive Profile\n\n## Identity & Self-Narrative\nYara is a 40-year-old urban farmer.`;
      },
    });

    expect(capturedPrompt).toContain("urban farming");
  });
});
