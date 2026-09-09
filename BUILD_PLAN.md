# FullTote — Build order A/B prototype · Build Plan

**Status:** DRAFT — for review before any code is written.
**Owner:** kstronaty@gmail.com (knaty22)
**Last updated:** 2026-09-09

---

## 1. What we are building

One React web app, but the two options are **fully separate experiences** —
each approach has its own homepage and neither links to the other, so a
participant sent to one variant never sees the other. `/` redirects to `/a`.

| Route | Screen | Source |
|---|---|---|
| `/a`        | **Option A homepage** — intro + the 2 tasks + "Start shopping" | new |
| `/a/shop`   | **Option A — Unified Grid** (Figma "Approach 2", node `6:2`) | Figma |
| `/a/cart`, `/a/review` | Option A cart (by vendor) and review | Figma |
| `/b`        | **Option B homepage** — intro + the 2 tasks + "Start building" | new |
| `/b/build`  | **Option B — Guided Builder** (Figma "Approach 4", node `10:2`) | Figma |

Figma file: `https://www.figma.com/design/0KTUBNGgdwOegBNVmnNjiR/` (frames `6:2` and `10:2`).

Both options are **working prototypes**, not static mockups: a tester can actually add products, see the cart update, and reach a review screen. They must both let a tester complete the two P1 tasks from the Build order critical job card.

### The two P1 tasks (the whole point of this build)

1. **Add items from 2 vendors to one cart.**
2. **Check cart contents across vendors before payment.**

Nothing in this build matters if a tester can't do both of these in **both** options. Section 6 maps each task to exact steps.

### Explicitly OUT of scope (per the JTBD doc, section 3)

- Real payment / Stripe. "Place order" is a stub that shows a success screen.
- DoorDash Drive / pickup-vs-delivery dispatch. Verified separately in a sandbox, not here.
- AIM-booth consolidation, order tracking, "Receive" step.
- Accounts / login. No auth.
- A backend. All data is seeded in the front end; cart lives in the browser.
- Mobile-native. It's a responsive web app sized for a phone viewport (~390px), fine on desktop.

---

## 2. Repo, hosting, toolchain

- **Repo:** reuse the existing, already-connected repo `github.com/knaty22/time-app` (currently holds an unused Vite timer scaffold — we replace `src/`). GitHub auth already works from this machine.
  - *If you'd rather use a fresh repo, say so — it means creating it on GitHub and re-importing on Vercel.*
- **Stack:** keep the current scaffold — Vite 8, React 19, TypeScript 6. Add one dependency: `react-router-dom`.
- **Deploy:** Vercel, imported from the GitHub repo (one-time dashboard step — see section 8). Every push to `main` then auto-deploys; PRs get preview URLs.
- **SPA routing fix:** add `vercel.json` so loading `/a` or `/b` directly doesn't 404:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
  ```

---

## 3. Decisions to confirm (change these before we build if you disagree)

| # | Decision | Default | Why |
|---|---|---|---|
| D1 | Cart isolation between A and B | **Separate carts** (keyed `a` / `b` in storage) | A tester who tries both options shouldn't see Option A's cart bleed into Option B. Each option is its own session. |
| D2 | Search field in Option A | **Functional** (filters the grid live) | Cheap to build, and testers will try to type in it. A dead search box reads as broken. |
| D3 | Category chips in A / category step in B | **Functional** filters | Same reason. |
| D4 | "Payment" | **Stub** — a "Place order" button → "Order placed" confirmation screen showing the grouped order | P1 is "check contents *before* payment", so we need the review screen; we don't need real payment. |
| D5 | Product images | **Flat colour blocks** with the product name | No image sourcing/licensing; keeps it obviously a prototype. |
| D6 | Cart persistence | **localStorage** | A tester's cart survives an accidental refresh mid-session. |
| D7 | Pickup/delivery toggle on review screen | **UI-only, not wired** (or omit) | Out of scope but reviewers may expect to see the choice exists. Flag if you want it fully gone. |
| D8 | Analytics / task logging | **None in v1** | Can add simple event logging later if you want quantitative task-success data. |

---

## 4. Shared foundation (built once, used by both options)

### 4.1 Seed data — `src/data/seed.ts`

~5 vendors, ~14 products, 4 categories. Placeholder content per your brief.

```
Vendors:
  sunrise   "Sunrise Farm"     Stall 4   pickup by 1:00 PM
  berryhill "Berry Hill"       Stall 12  pickup by 1:00 PM
  millers   "Miller's Bakery"  Stall 22  pickup by 1:00 PM
  soapco    "Soap Co."         Stall 31  pickup by 1:00 PM
  greenthumb "Green Thumb"     Stall 38  pickup by 1:00 PM

Products (vendor · name · price · unit · category):
  sunrise   Heirloom Tomatoes  4.50  basket   Produce
  sunrise   Salad Greens       5.00  bag      Produce
  sunrise   Rainbow Chard      3.50  bunch    Produce
  sunrise   Farm Eggs          7.00  dozen    Dairy
  berryhill Strawberries       6.00  basket   Produce
  berryhill Blueberries        7.00  pint     Produce
  berryhill Berry Jam          9.00  jar      Artisan
  millers   Sourdough Loaf     8.00  each     Bakery
  millers   Baguette           4.00  each     Bakery
  millers   Morning Buns       12.00 half-dozen Bakery
  soapco    Lavender Soap      9.00  bar      Artisan
  soapco    Oatmeal Soap       9.00  bar      Artisan
  greenthumb Basil Plant       6.00  pot      Produce
  greenthumb Cut Flowers       15.00 bunch    Artisan
```

Types:
```ts
type Category = 'Produce' | 'Bakery' | 'Dairy' | 'Artisan'
type Vendor  = { id: string; name: string; stall: string; pickupBy: string }
type Product = { id: string; vendorId: string; name: string; price: number; unit: string; category: Category }
```

### 4.2 Cart state — `src/cart/CartContext.tsx`

- React Context + `useReducer`.
- State: `Record<productId, qty>` per approach key (`'a' | 'b'`).
- Actions: `add(productId)`, `setQty(productId, qty)`, `remove(productId)`, `clear()`.
- Persist each approach's cart to `localStorage` under `fulltote-cart-a` / `fulltote-cart-b`.
- Selectors (pure helpers in `src/cart/selectors.ts`):
  - `lineItems(state)` → `{ product, qty, lineTotal }[]`
  - `byVendor(state)` → `{ vendor, items, subtotal }[]`  ← **this is what powers both P1 tasks**
  - `totals(state)` → `{ vendorCount, itemCount, total }`

### 4.3 Design tokens — `src/styles/tokens.css`

Pull the exact values from the Figma file (they're already in the "FullTote Colors" collection / the frames). Approx:
```
--bg:#fbf9f4  --surface:#ffffff  --ink:#1f241f  --muted:#6b736e
--border:#e7e3d9  --primary:#2f7a3e  --primary-soft:#e7f1e8
--accent:#b5384d  --chip:#f1efe9
--radius:12px  --radius-pill:20px
font: Inter (Google Fonts), system fallback
```

### 4.4 Shared components — `src/components/`

- `ProductCard` — colour block + name + price/unit + vendor caption + Add/stepper (variant prop for grid vs list)
- `QtyStepper` — `– n +`
- `VendorGroup` — vendor header + subtotal + list of `CartLine`
- `CartLine` — stepper + name + line price + remove
- `CartSummaryBar` — "N vendors · M items · $X" pill/bar (variant prop)
- `PhoneFrame` — centers content in a ~390px column with the app chrome, so `/a` and `/b` look like the Figma screens
- `AppHeader` — "BUILD ORDER" kicker + title

---

## 5. The two options

### 5.1 Option A — Unified Grid (`/a`)  → Figma node `6:2`

Files: `src/approaches/a/GridScreen.tsx`, `CartScreen.tsx`, `ReviewScreen.tsx` (sub-routes `/a`, `/a/cart`, `/a/review`).

**GridScreen `/a`**
- `AppHeader` "Shop the whole market"
- Search input (D2) — filters products by name
- Category chips: All · Produce · Bakery · Dairy · Artisan (D3) — filter by category
- One product grid, **all vendors mixed**, 2 columns. Each card: colour block, name, price, **vendor name as small muted caption**, `+` button (becomes a stepper once in cart)
- `CartSummaryBar` fixed near bottom: "N vendors · M items · $X" → tapping navigates to `/a/cart`

**CartScreen `/a/cart`** — *this is P1 task 2 for Option A*
- Items **grouped by vendor** (`byVendor` selector), each group: vendor name + subtotal, then each line with a stepper + remove
- Grand total
- "Review & check out" → `/a/review`
- Back to grid

**ReviewScreen `/a/review`**
- Read-only grouped summary + pickup time per vendor
- (D7) pickup/delivery toggle, UI only
- "Place order" → confirmation state ("Order placed — N items from M vendors"), offer "Start over" (clears cart `a`)

### 5.2 Option B — Guided Builder (`/b`)  → Figma node `10:2`

Files: `src/approaches/b/WizardScreen.tsx` with 3 steps (state-driven, single route `/b`, `?step=` optional).

**Stepper chrome** (all steps): numbered 1 Categories · 2 Items · 3 Review, Back / Continue footer, running "M items · N vendors · $X".

**Step 1 — Categories**
- "What are you shopping for today?" → multi-select category cards (Produce, Bakery, Dairy, Artisan)
- Continue enabled once ≥1 selected

**Step 2 — Items** — *this is P1 task 1 for Option B*
- Items from the chosen categories, **across all vendors**, grouped by category, each row shows the vendor as a caption
- Checkbox / qty to add each; adding from 2 vendors is the natural path
- Continue → step 3

**Step 3 — Review** — *this is P1 task 2 for Option B*
- Full order **grouped by vendor** with subtotals (`byVendor`), editable qty + remove
- Pickup time per vendor
- (D7) pickup/delivery toggle, UI only
- "Place order" → confirmation state, "Start over" (clears cart `b`)

---

## 6. P1 task → exact test path (acceptance criteria)

| Task | Option A path | Option B path |
|---|---|---|
| **Add items from 2 vendors to one cart** | On `/a`: tap `+` on "Heirloom Tomatoes" (Sunrise Farm), then `+` on "Strawberries" (Berry Hill). Cart bar shows **"2 vendors · 2 items"**. | On `/b`: step 1 pick Produce; step 2 check "Heirloom Tomatoes" (Sunrise Farm) and "Strawberries" (Berry Hill); footer shows **"2 items · 2 vendors"**. |
| **Check cart contents across vendors before payment** | Tap the cart bar → `/a/cart` shows **two vendor groups** (Sunrise Farm, Berry Hill) each with its own subtotal, before the "Review & check out" / "Place order" buttons. | Continue to step 3 Review → **two vendor groups** with subtotals, before "Place order". |

**Definition of done for the build:** both rows above are completable end-to-end on the deployed Vercel URL, on a phone-width viewport, without console errors.

---

## 7. Build steps (the handoff Claude Code executes)

1. **Branch:** `git checkout -b build/ab-prototype`.
2. **Deps:** `npm i react-router-dom`.
3. **Strip scaffold:** replace `src/App.tsx`, `src/App.css`, `src/index.css`, `src/main.tsx` contents; delete `src/assets/react.svg`. Keep all config files, `package.json` scripts, `index.html` (update `<title>` to "FullTote — Build order A/B").
4. **Tokens + base CSS:** `src/styles/tokens.css`, `src/styles/base.css`; load Inter from Google Fonts in `index.html`.
5. **Data:** `src/data/seed.ts` (section 4.1).
6. **Cart:** `src/cart/CartContext.tsx`, `src/cart/selectors.ts` (section 4.2) + a tiny unit test for `byVendor` / `totals` if a test runner is quick to add; otherwise skip.
7. **Shared components** (section 4.4).
8. **Pull Figma reference:** `get_design_context` on `6:2` and `10:2`; match layout, spacing, colours, copy. Screens should be recognisably the Figma frames.
9. **Router:** `src/main.tsx` sets up `createBrowserRouter` with `/`, `/a`, `/a/cart`, `/a/review`, `/b`, and a catch-all → `/`.
10. **Home** `src/routes/Home.tsx` — title, one-paragraph explanation, two link cards, the 2 tasks listed as "things to try".
11. **Option A** screens (section 5.1).
12. **Option B** wizard (section 5.2).
13. **`vercel.json`** (section 2).
14. **Verify:** `npm run build` must pass with zero TS errors. Then `npm run dev` and walk both P1 paths from section 6 manually; capture a screenshot of each option + each cart/review screen.
15. **Self-check against section 6 acceptance criteria.** Fix anything failing.
16. **Commit** in small logical commits; open a PR against `main` with a description that includes the section 6 test paths. Do **not** merge/push to `main` without the user's OK.
17. **User** merges → imports repo on Vercel (section 8) → confirms both P1 paths on the live URL.

---

## 8. Vercel connection (one-time, done by the user)

1. Push the branch / merge to `main` so the repo has code.
2. vercel.com → **Continue with GitHub** → **Add New… → Project**.
3. **Import Git Repository** → if repos don't appear, **Install/Adjust GitHub App permissions** for `knaty22/time-app`.
4. Import `time-app`. Framework preset auto-detects **Vite** (build `npm run build`, output `dist`). Deploy.
5. After first deploy: every push to `main` deploys to production; PRs get preview URLs.

---

## 9. Risks / things to watch during iteration

- **Bleeding-edge versions.** The scaffold pins Vite 8 / React 19 / TS 6. If `react-router-dom` or the build fights these, fall back to the latest stable RR and note it here.
- **Scope creep in the wizard.** Option B's step 2 can balloon. Keep it to: pick categories → tick items → review. No search, no sorting, no "recommended" logic.
- **Two carts, one codebase.** The `approach` key must be threaded through context correctly or A and B will share a cart (D1). Verify explicitly.
- **Figma fidelity vs. time.** Match layout, hierarchy, colour, copy. Do not spend time on pixel-perfect shadows/animation.
- **Direct-link 404s on Vercel.** If `/a/cart` 404s on the deployed site, `vercel.json` rewrite is missing or wrong.
- **"Place order" doing something real.** It must not. It only sets local state to a confirmation view.

---

## 10. Open questions for you

1. Repo: reuse `time-app`, or new repo? (default: reuse)
2. Any of the D1–D8 defaults you want changed?
3. Do you want simple task-success logging (which button, timestamps) for your research write-up, or is observation enough for now? (default: none)
4. Keep the pickup/delivery toggle visible-but-inert on the review screens, or remove it entirely? (default: keep, inert)
