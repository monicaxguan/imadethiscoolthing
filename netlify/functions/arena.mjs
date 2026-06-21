import { json } from "./_anthropic.mjs";

export default async (req) => {
  if (req.method !== "GET") return json({ error: "method not allowed" }, 405);
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  if (!q) return json({ blocks: [] });

  const r = await fetch(
    `https://api.are.na/v2/search/blocks?q=${encodeURIComponent(q)}&per=12`,
    { headers: { "Accept": "application/json" } }
  );
  if (!r.ok) return json({ blocks: [] }, 502);
  const data = await r.json();
  return json(data);
};
