import { claude, json } from "./_anthropic.mjs";

const buildPrompt = (word, challenge, association) => (
  `CHALLENGE: "${challenge}"\n` +
  `RANDOM WORD: "${word}"\n` +
  `THE ONE ASSOCIATION TO FORCE: "${association}"\n\n` +
  "Force that one association onto the challenge. Generate 4 short candidates.\n\n" +
  "Each candidate is a single line, standing alone — could be a name, a tagline, a " +
  "structural move, a gesture, a character beat, a mechanism. Whatever actually fits " +
  "the challenge.\n\n" +
  "HOW:\n" +
  "- 1–12 words each. Concrete > clever. Picture-able > poetic.\n" +
  "- Mix the kinds when it helps. Don't return 4 names if a tagline + a move + a name\n" +
  "  + a mechanism is the better answer.\n" +
  "- Don't soften the collision. The whole point is that the random word is in the room.\n" +
  "- Sound like a person talking, not writing copy. Contractions ok. Fragments ok.\n\n" +
  "Don't use: ritual, lens, reframe, journey, signal, beacon, threshold, witness, " +
  "narrative, vibe, essence, holistic, curated, authentic, meaningful.\n\n" +
  "EXAMPLES:\n" +
  'CHALLENGE "name a sustainable coffee brand" · WORD "post office" · ASSOCIATION "stamped" →\n' +
  '{ "candidates": ["Stamped, not sprayed", "Return Address Coffee", "Each bag postmarked from a farm", "From: a grower. To: your kitchen."] }\n\n' +
  'CHALLENGE "memorable NPC for a harbour town" · WORD "moth" · ASSOCIATION "attracted to what destroys it" →\n' +
  '{ "candidates": ["A lamplighter who collects shards of the lighthouse that killed his brother", "An ex-sailor who sits closer to the fire than is safe", "A widow paid to dim lamps the wrong ships steer by", "Sleeps under the harbour beacon every storm"] }\n\n' +
  'CHALLENGE "writing a poem about my mother without sentiment" · WORD "scaffold" · ASSOCIATION "ugly but necessary" →\n' +
  '{ "candidates": ["A list of the pipes and planks she built for me — none of them admired", "Open with the parts the photographer cropped out", "End on what stayed up when the rest came down", "Write only what would be invoiced if she\'d charged"] }\n\n' +
  "Now do yours. Return JSON only: { \"candidates\": [...] }"
);

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  const { word = "", challenge = "", association = "" } = await req.json().catch(() => ({}));
  if (!word || !association) return json({ error: "word and association required" }, 400);
  const r = await claude({ user: buildPrompt(word, challenge, association), maxTokens: 700 });
  return json(r.body, r.status);
};
