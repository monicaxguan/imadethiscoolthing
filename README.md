# Creative Connections — Netlify deploy

A typed-out random-word-association tool (de Bono). Frontend is a single HTML page; backend is three Netlify Functions calling the Anthropic API.

## Deploy

1. Push this folder to a Git repo (GitHub / GitLab / Bitbucket).
2. In Netlify: **Add new site → Import from Git**, pick the repo.
3. Build settings — Netlify will read `netlify.toml`. Leave the defaults:
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
4. Under **Site settings → Environment variables**, add:
   - `ANTHROPIC_API_KEY` = your key from https://console.anthropic.com
5. Deploy. The first build provisions the functions. After ~30s the site is live.

Alternatively, drag-and-drop the folder into Netlify's **Sites → Deploys → Drag & drop**, then add the env var afterwards.

## Local dev

```
npm install -g netlify-cli
netlify dev
```

This serves `index.html` and the functions together on http://localhost:8888.

## How it's wired

- `index.html` — the whole UI. React + Tailwind + Babel loaded from CDN. Calls `/api/status`, `/api/associate`, `/api/connect`.
- `netlify.toml` — redirects `/api/*` → `/.netlify/functions/:splat`, so the frontend's existing paths just work.
- `netlify/functions/_anthropic.mjs` — shared helper: SYSTEM prompt, Anthropic call, JSON parse.
- `netlify/functions/associate.mjs` — mines 8 concrete attributes of the random word.
- `netlify/functions/connect.mjs` — given a chosen association, returns 4 candidate ideas forced onto the challenge.
- `netlify/functions/status.mjs` — reports whether `ANTHROPIC_API_KEY` is set.

No dependencies. Node 20+ (Netlify default) provides `fetch`.

## Model

Both `associate` and `connect` use `claude-sonnet-4-6`. Swap in `_anthropic.mjs` if you want a different one.
