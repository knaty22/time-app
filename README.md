# FullTote — Build order A/B prototype

Two interactive prototypes of the **Build order** critical job for the Grand Lake
Farmers Market (FullTote UX capstone). Used for an A/B usability test.

| Route | Option | Approach |
| ----- | ------ | -------- |
| `/`   | Home   | Explains the test, links to both options |
| `/a`  | Option A | **Unified Grid** — one category-filtered product grid across every vendor |
| `/b`  | Option B | **Guided Builder** — a 3-step wizard: categories → items → review |

Both options support the two P1 tasks from the Build order job card:

1. **Add items from 2 vendors to one cart.**
2. **Check cart contents across vendors before payment.**

See [`BUILD_PLAN.md`](./BUILD_PLAN.md) for scope, decisions, and the exact test paths.

## Run locally

```bash
npm install
npm run dev
```

## Tech

Vite + React + TypeScript. Client-side routing (`react-router-dom`). Cart state in
React context, persisted to `localStorage`; **carts for A and B are separate**.
No backend, no real payment — "Place order" is a stub confirmation screen.

## Deploy

Auto-deploys to Vercel on push to `main`. `vercel.json` rewrites all paths to
`index.html` so deep links to `/a`, `/b`, `/a/cart` work.
