# Project

Static HTML site. No build tools, tests, or package manager at root.

## Pages

| File | Description |
|------|-------------|
| `index.html` | KP Group conglomerate landing page — links to `kpmedia.html` and `kpelectronics.html` |
| `kpmedia.html` | KP Media subsidiary page — links to `portfolio.html` |
| `portfolio.html` | KP Media portfolio/projects gallery |
| `kpelectronics.html` | KP Electronics store — standalone single-page app (5043 lines); uses the `server/` backend |
| `members.html` | Staff directory — linked from `my site.html` only |

## Experiment / scratch files (not used by any production page)

`style.css`, `variable.js`, `class.css`, `class.html`, `elements.html`, `my site.html` — safe to ignore or delete.

## Server backend (`server/`)

`kpelectronics.html` depends on a Node.js/Express backend at `server/server.js`.

- **Commands** (run from `server/`): `npm start` or `npm run dev` (both do `node server.js`)
- **Dependencies**: express, axios, cors, dotenv — install with `npm install`
- **Requires `.env`** in `server/` with:
  ```
  FLW_PUBLIC_KEY=...
  FLW_SECRET_KEY=...
  WEBHOOK_SECRET=...
  PORT=3000
  ```
- **API endpoints** (all served on PORT, default 3000):
  - `POST /api/create-order` — creates a Flutterwave virtual account
  - `GET /api/order-status/:txRef` — SSE stream for real-time payment status
  - `POST /api/webhook` — Flutterwave webhook receiver
- `.env` and `node_modules/` are gitignored in `server/`

## Development

Open any `.html` directly in a browser. No build step.

For `kpelectronics.html`, the payment features require the server running at `http://localhost:3000` (it serves static files from the repo root).

## Notes

- Assets loaded via CDN: Tailwind CSS, Alpine.js, Font Awesome, Lucide, Fontshare, Google Fonts
- Images served from repo root (not `images/` only)
- `class.html` + `class.css` are HTML/CSS learning files, unrelated to main site
