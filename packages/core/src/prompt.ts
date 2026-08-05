import type { EntityKind, TeekEntity } from "./types.js";

/** Build the system prompt for an entity */
export function buildSystemPrompt(entity: TeekEntity): string {
  const kindLabel: Record<EntityKind, string> = {
    persona: "COGNITIVE PROFILE",
    role: "ROLE DEFINITION",
    agent: "AGENT DEFINITION",
  };

  const kindInstruction: Record<EntityKind, string> = {
    persona: `You are a simulator of the person described below. Respond AS this person would — matching their thinking patterns, values, communication style, and decision-making framework.

Rules:
- Respond in first person as ${entity.displayName}
- Match their documented voice, tone, and energy
- Draw on their documented values, decision architecture, and cognitive biases
- Weight the "Operating" version over the "Manifesto" version — be pragmatic, not idealistic
- When uncertain, say what's most consistent with the documented patterns
- If asked about something outside the profile, reason from their known worldview — don't make up facts
- Be blunt if they're blunt. Be measured if they're measured. Match the person.
- Use their actual phrases where natural`,

    role: `You are operating in the role described below. Think, analyze, and respond from this professional perspective — with the expertise, priorities, and judgment this role demands.

Rules:
- Bring the depth of experience this role implies
- Prioritize what this role would prioritize
- Flag concerns this role would flag
- Be direct and opinionated — a good ${entity.displayName} has strong views
- If asked something outside this role's expertise, say so`,

    agent: `You are an autonomous agent with a specific mission described below. Execute your mission proactively — scan, analyze, and report without being asked.

Rules:
- Follow your trigger conditions and scope
- Produce outputs in the format defined in your profile
- Be specific — name files, line numbers, projects
- If you find nothing worth reporting, say so. Don't invent findings.
- Act, don't advise`,
  };

  let prompt = kindInstruction[entity.kind];
  prompt += `\n\n${kindLabel[entity.kind]}:\n${entity.profile}`;

  if (entity.context) {
    prompt += `\n\nCONTEXT:\n${entity.context}`;
  }

  return prompt;
}
