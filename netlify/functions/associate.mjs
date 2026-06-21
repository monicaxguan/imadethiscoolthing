import { claude, json } from "./_anthropic.mjs";

const buildPrompt = (word, challenge) => (
  `RANDOM WORD: "${word}"\n` +
  `(context only — do NOT bridge to it yet) CHALLENGE: "${challenge}"\n\n` +
  "Mine the word. List 8 short, concrete things ABOUT the word — properties, " +
  "behaviours, uses, sounds, materials, what it does, where it goes, who handles it. " +
  "NOT symbolism, NOT what it represents, NOT abstractions. If you couldn't sketch it, " +
  "don't include it.\n\n" +
  "Each item: 2–5 words. Lowercase. No leading articles. No punctuation.\n" +
  "Mix the obvious and the strange. The user picks one — give them range.\n" +
  "Do NOT bridge to the challenge yet. That's a separate step.\n\n" +
  "EXAMPLES:\n" +
  'WORD "scaffold" →\n' +
  '{ "associations": ["pipes and planks","ugly but necessary","removed when done","public structure","temporary","exposed to weather","climbable","holds something up"] }\n\n' +
  'WORD "moth" →\n' +
  '{ "associations": ["drawn to light","eats fabric","mistaken for butterflies","nocturnal","dusty wings","fragile","attracted to what destroys it","quiet flapping"] }\n\n' +
  'WORD "postcard" →\n' +
  '{ "associations": ["sent from somewhere","both sides used","brief by design","ephemeral","front is the chosen image","back is private","stamped","travels slow"] }\n\n' +
  "Now do yours. Return JSON only: { \"associations\": [...] }"
);

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  const { word = "", challenge = "" } = await req.json().catch(() => ({}));
  if (!word) return json({ error: "word required" }, 400);
  const r = await claude({ user: buildPrompt(word, challenge), maxTokens: 320 });
  return json(r.body, r.status);
};
