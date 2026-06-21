// Shared helper: call Anthropic Messages API and parse the JSON the model returns.

export const SYSTEM = (
  "You're a friend riffing on someone's problem out loud. They throw a totally random word " +
  "at you and you have to make it relevant — that's the game. You think on your feet, you " +
  "use contractions, you cut sentences short, you go 'ok hear me out' or 'wait —' or 'so '. " +
  "You're not writing copy. You're talking. " +
  "The mental move: notice some weird, specific thing the random word does, then ram it " +
  "into their problem at a strange angle. Absurd bridges beat tidy ones. " +
  "Return JSON only, no prose, no markdown fences."
);

const MODEL = "claude-sonnet-4-6";

export function parseJson(text) {
  let s = text.indexOf("{");
  let e = text.lastIndexOf("}");
  if (s === -1) { s = text.indexOf("["); e = text.lastIndexOf("]"); }
  if (s === -1 || e === -1) throw new Error("bad json from model: " + text.slice(0, 200));
  return JSON.parse(text.slice(s, e + 1));
}

export async function claude({ user, maxTokens = 320, model = MODEL }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return { ok: false, status: 503, body: { error: "ANTHROPIC_API_KEY not set" } };
  }
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: SYSTEM,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!r.ok) {
    const txt = await r.text();
    return { ok: false, status: 502, body: { error: `claude: ${txt.slice(0, 300)}` } };
  }
  const data = await r.json();
  const text = (data.content?.[0]?.text || "").trim();
  try {
    return { ok: true, status: 200, body: parseJson(text) };
  } catch (err) {
    return { ok: false, status: 502, body: { error: String(err), raw: text.slice(0, 300) } };
  }
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
