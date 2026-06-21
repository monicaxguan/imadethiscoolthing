import { claude, json } from "./_anthropic.mjs";

const buildPrompt = (word, challenge, association) => (
  `CHALLENGE: "${challenge}"\n` +
  `RANDOM WORD: "${word}"\n` +
  `THE ONE ASSOCIATION TO FORCE: "${association}"\n\n` +
  "Make the bridge visible — don't solve the challenge. Explain the click between " +
  "this association and the challenge in 1–3 sentences (25–60 words).\n\n" +
  "HOW:\n" +
  "- Open mid-thought. No setup. No 'X is a Y for Z'.\n" +
  "- Show what the association notices about the challenge that nothing else would.\n" +
  "- Hand the spark over, don't finish it for them. The user does the naming / the move / the rest.\n" +
  "- Sound like a person talking, not writing copy. Contractions, fragments, the odd 'so' or 'wait —'.\n\n" +
  "Don't use: ritual, lens, reframe, journey, signal, beacon, threshold, witness, " +
  "narrative, vibe, essence, holistic, curated, authentic, meaningful.\n\n" +
  "EXAMPLES:\n" +
  'CHALLENGE "name a sustainable coffee brand" · WORD "post office" · ASSOCIATION "stamped" →\n' +
  '{ "explanation": "Stamps prove a thing came from one specific somewhere, sent by one specific someone. A coffee that wore that — a date, an address, a hand — wouldn\'t taste of \'origin\', it\'d taste of a person who put it in the mail." }\n\n' +
  'CHALLENGE "memorable NPC for a harbour town" · WORD "moth" · ASSOCIATION "attracted to what destroys it" →\n' +
  '{ "explanation": "If the moth-thing is the pull toward the thing that hurts you, you\'re looking for someone whose job, hobby, or grief lives next to the harbour\'s most dangerous light. They\'d show up wherever the worst story is unfolding. Quietly. Every time." }\n\n' +
  'CHALLENGE "writing a poem about my mother without sentiment" · WORD "scaffold" · ASSOCIATION "ugly but necessary" →\n' +
  '{ "explanation": "Scaffolds disappear once the building stands — nobody photographs them, nobody thanks them. Your mother probably built things like that for you too. The poem isn\'t about her; it\'s about the planks she left up under everything." }\n\n' +
  "Now do yours. Return JSON only: { \"explanation\": \"...\" }"
);

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  const { word = "", challenge = "", association = "" } = await req.json().catch(() => ({}));
  if (!word || !association) return json({ error: "word and association required" }, 400);
  const r = await claude({ user: buildPrompt(word, challenge, association), maxTokens: 400 });
  return json(r.body, r.status);
};
