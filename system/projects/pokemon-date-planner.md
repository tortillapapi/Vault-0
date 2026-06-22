---
type: project
title: Pokemon Date Planner
slug: pokemon-date-planner
created: 2026-06-22
last_updated: 2026-06-22
status: implemented-predeploy
priority: personal
tags: [project, website, pokemon, dates, hostinger, gmail]
domain_tags: [relationships, web-app, automation]
---

# Pokemon Date Planner

A cute Pokemon-themed website for planning dates with the user's girlfriend,
inspired by the provided Instagram Reel:
`https://www.instagram.com/reel/DYwUJ81I3-1/?igsh=NzgyYTk0Y2YyNg==`

## Current ask

Before implementation starts, identify everything needed up front so Codex can
build, test, and prepare deployment with minimal user oversight.

## Hard constraints

- Do not modify unrelated vault files.
- For now, only document this project in the vault.
- Use `rareforceone.cloud` as the target domain, through the user's Hostinger
  account.
- The user permits reading relevant Hermes, OpenClaw, Terminal CLI, and shared
  vault files when they help unblock the project.
- The user permits using Janus through Telegram if available; this Codex session
  does not currently expose a Telegram connector.
- Gmail target account: `mramirez021111@gmail.com`.

## Known local context

- Existing rareforceone infrastructure exists in the vault, especially
  `n8n.rareforceone.cloud` behind Caddy.
- Gmail and n8n operational context is documented under the n8n order parser
  project pages.
- Gmail connector tools are available in this Codex session, but outgoing email
  still requires exact user confirmation before sending.
- Source app created at `projects/pokemon-date-planner/`.
- Deployment target approved by user: `dates.rareforceone.cloud`.

## Up-front inputs that would prevent blockers

- A screen recording, screenshots, or a concise written description of the
  Instagram Reel flow, since the Reel URL is not readable from this session.
- Permission to create a dedicated app folder, either in this vault or outside
  it, with normal website source files and package metadata.
- Deployment preference: Hostinger static site, VPS/Caddy reverse proxy, or
  another host.
- Hostinger access path: credentials are not needed in chat if Janus can perform
  DNS/hosting steps, but Codex needs either a deploy target, API/SSH path, or a
  Janus handoff route.
- Intended Gmail behavior: draft date invitations, send confirmations, collect
  RSVPs, store date ideas, or only use Gmail for account/deployment
  verification.
- Girlfriend-facing personalization: names/nicknames, favorite Pokemon, favorite
  colors, favorite date types, city/region, budget ranges, and any inside jokes
  to include or avoid.
- Privacy level: public link, private shared link, password protected, or
  invite-only.
- Pokemon IP comfort level: official-looking fan theme versus Pokemon-inspired
  original creatures/icons/assets.

## Reasonable defaults if the user says go

- Build a small static-first web app with a polished mobile experience.
- Keep data local in the browser for v1 unless Gmail or server persistence is
  explicitly needed.
- Use Pokemon-inspired original visuals rather than copyrighted game art.
- Make the first screen the actual date-planning experience, not a landing page.
- Include date idea cards, mood/category filters, randomized "choose our
  adventure" flow, a cute itinerary builder, and a share/draft summary action.
- Document all project decisions in this page before touching broader
  infrastructure.

## Product concept

Working title: **Rare Date Dex**.

The app should feel like opening a playful Pokemon-style field guide for the
relationship. The core interaction is a "choose our adventure" planner: the user
and girlfriend pick a mood, budget, time window, and activity type, then the app
reveals cute date options as collectible cards. Selected cards build an
itinerary that can be saved, copied, or drafted into an email.

This should be a usable tool first, not a marketing page. The first viewport
should contain the planner itself.

## Reference video readout

The provided screen recording was inspected on 2026-06-22. The target flow is:

1. POV/social setup.
2. Cute centered invite card with floating flowers.
3. Question: "Will you go on a date with me?"
4. A clear pink YES button and a tiny/evasive "no" button.
5. Excited confirmation: "WAIT, YOU ACTUALLY SAID YES??"
6. Date picker screen: "So... when are you free?"
7. Playful time dropdown options.
8. Food picker screen: "What are we feeling?"
9. Final confirmation message with selected plan.

The implemented v1 follows this structure with a Pokemon fan-style skin.

## Implemented v1

| Item | Detail |
|---|---|
| App path | `projects/pokemon-date-planner/` |
| Build output | `projects/pokemon-date-planner/dist/` |
| Hostinger zip | `projects/pokemon-date-planner/deploy/rare-date-dex-hostinger.zip` |
| Janus handoff | `projects/pokemon-date-planner/deploy/JANUS_HANDOFF.md` |
| Hostinger checklist | `projects/pokemon-date-planner/deploy/HOSTINGER_DEPLOY_CHECKLIST.md` |
| Janus Telegram message | `projects/pokemon-date-planner/deploy/TELEGRAM_MESSAGE_TO_JANUS.md` |
| Stack | Static HTML, CSS, and JavaScript; no npm dependencies |
| Local storage | Saves the last mission as `rareDateDex:lastMission` |
| Gmail behavior | Opens a prefilled Gmail compose URL; does not send automatically |
| Target URL | `https://dates.rareforceone.cloud/` |

Commands:

```text
cd projects/pokemon-date-planner
npm run build
npm run verify
npm run package
python3 -m http.server 4173 -d dist
```

Verified locally:

- `npm run build` passed.
- `npm run verify` passed.
- `npm run package` produced a Hostinger-ready zip.
- Browser flow passed: invite → yes confirmation → date/time → food → side
  quest → final Gmail-ready summary.
- Browser console had no errors or warnings.
- Desktop and mobile-width visual checks passed.

## Target audience and tone

- Primary user: the couple, mostly on mobile.
- Mood: cute, affectionate, playful, and lightly game-like.
- Avoid: dense dashboards, generic romance stock-photo styling, public-facing
  marketing copy, or anything that feels like a corporate event planner.
- Pokemon treatment: use fan-inspired language and original UI/art direction
  unless the user explicitly approves official Pokemon assets.

## Proposed v1 flow

1. Open the page and see a compact "Date Dex" planner.
2. Choose the current mood: cozy, adventure, food quest, creative, chill,
   surprise, celebration, or budget-friendly.
3. Pick date constraints: day/night, indoors/outdoors, budget, travel distance,
   energy level, and weather sensitivity.
4. Reveal three date cards with type, estimated cost, duration, location idea,
   and a cute "encounter" flavor line.
5. Tap a card to add it to the itinerary.
6. Optionally reroll choices, lock favorites, or combine multiple cards into a
   full plan.
7. Review a final itinerary with time blocks, checklist items, and a copy/draft
   message action.

## Feature set

| Feature | v1 behavior | Notes |
|---|---|---|
| Mood picker | Segmented/icon controls | No instructional text needed in app |
| Date card reveal | Animated card flip or pack-opening style reveal | Inspired by the Instagram reference if assets become available |
| Reroll | Randomizes unlocked cards | Keeps the experience playful |
| Favorites | Browser-local saved cards | No server needed for v1 |
| Itinerary builder | Selected cards become ordered plan blocks | Supports quick editing |
| Share action | Copy formatted plan and/or Gmail draft | Sending email requires explicit confirmation |
| Personalization | Names, favorite Pokemon, colors, inside jokes | User-supplied if available |
| Privacy | Public, private URL, or password gate | Depends on deployment choice |

## Starter date idea taxonomy

| Category | Examples |
|---|---|
| Cozy | movie night, bookstore date, cafe crawl, home-cooked dinner |
| Food quest | taco route, dessert stop, farmers market, ramen hunt |
| Adventure | scenic walk, arcade, mini golf, local landmark, sunset drive |
| Creative | pottery, painting, scrapbook night, photo walk |
| Celebration | dinner reservation, flowers, surprise playlist, dress-up night |
| Budget | picnic, library stop, free museum day, homemade tasting flight |

## Starter content pack

These cards are implementation-ready seed content. Keep titles short so cards
fit on mobile.

| ID | Title | Category | Mood | Budget | Duration | Setting | Energy | Type | Flavor |
|---|---|---|---|---|---|---|---|---|---|
| cafe-crawl | Cafe Crawl | Food quest | cozy, chill | $ | 2h | indoor | low | grass | Follow the scent of pastries and collect tiny moments together. |
| sunset-drive | Sunset Route | Adventure | romantic, chill | $ | 1.5h | outdoor | low | fire | A golden-hour cruise with the perfect song queued up. |
| arcade-battle | Arcade Battle | Adventure | playful, surprise | $$ | 2h | indoor | medium | electric | Two trainers enter, one wins bragging rights, both get snacks. |
| picnic-patch | Picnic Patch | Budget | cozy, romantic | $ | 2h | outdoor | low | grass | A soft blanket, favorite bites, and a little pocket of peace. |
| ramen-quest | Ramen Quest | Food quest | cozy, celebration | $$ | 1.5h | indoor | low | fire | Warm bowls, shared appetizers, and one dessert scouting mission. |
| bookstore-sidequest | Bookstore Sidequest | Cozy | chill, creative | $ | 1.5h | indoor | low | psychic | Pick books for each other and leave with a tiny shared prophecy. |
| mini-golf-gym | Mini Golf Gym | Adventure | playful, celebration | $$ | 2h | mixed | medium | rock | A low-stakes gym challenge with high-stakes flirting. |
| movie-nest | Movie Nest | Cozy | cozy, budget | $ | 3h | indoor | low | fairy | Build the comfiest nest possible and let the credits roll. |
| photo-walk | Photo Walk | Creative | creative, adventure | $ | 2h | outdoor | medium | flying | Hunt for cute corners, reflections, and accidental album covers. |
| dessert-evolution | Dessert Evolution | Food quest | romantic, playful | $$ | 1h | indoor | low | fairy | Start with one sweet thing and see what it evolves into. |
| farmers-market | Market Stroll | Adventure | chill, food | $$ | 2h | outdoor | medium | grass | Wander the stalls and let the best-looking snack choose you. |
| paint-night | Paint Night | Creative | creative, cozy | $$ | 2.5h | indoor | medium | water | Two canvases, zero pressure, maximum cute chaos. |
| museum-mystery | Museum Mystery | Creative | chill, budget | $ | 2h | indoor | low | psychic | Pick favorite pieces and invent dramatic backstories for them. |
| breakfast-date | Breakfast Spawn | Food quest | cozy, celebration | $$ | 1.5h | indoor | low | normal | A rare morning encounter with pancakes, coffee, and sleepy smiles. |
| stargaze-savepoint | Stargaze Savepoint | Cozy | romantic, chill | $ | 1.5h | outdoor | low | dark | Park somewhere quiet and save the memory under the night sky. |
| flower-run | Flower Run | Celebration | romantic, surprise | $$ | 1h | mixed | low | grass | Pick flowers, snacks, or both; return with affection boosted. |

### Card checklist ideas

| Card | Checklist |
|---|---|
| Cafe Crawl | Pick two cafes; order one thing to share; take one photo booth-style selfie |
| Sunset Route | Build a 30-minute playlist; choose a viewpoint; bring a cozy layer |
| Arcade Battle | Set a prize for the winner; play one co-op game; end with dessert |
| Picnic Patch | Pack a blanket; bring fruit or pastries; choose a park backup |
| Bookstore Sidequest | Pick one book for each other; find a postcard; read first lines aloud |
| Movie Nest | Choose a double feature; build snacks; phones on quiet mode |
| Photo Walk | Pick a neighborhood; choose 5 photo prompts; make a shared album |
| Stargaze Savepoint | Check cloud cover; bring a warm drink; choose one wish each |

## UI copy bank

Keep app copy short and affectionate. Avoid visible instructions when the
control itself is obvious.

| Surface | Copy |
|---|---|
| App title | Rare Date Dex |
| Subtitle | Pick the vibe. Reveal the date. Start the adventure. |
| Mood label | Today's vibe |
| Constraint label | Field conditions |
| Reveal button | Reveal encounters |
| Reroll button | Reroll |
| Lock button | Lock |
| Add button | Add to plan |
| Empty itinerary | No date cards chosen yet. |
| Itinerary title | Our date plan |
| Copy button | Copy plan |
| Draft button | Draft invite |
| Saved toast | Added to the Date Dex. |
| Copied toast | Plan copied. Go be cute. |
| Error copy | The Dex got shy. Try again. |

## Share message template

```text
Date plan unlocked:

<title>
Mood: <mood>
When: <date/time>
Plan:
1. <itinerary item>
2. <itinerary item>
3. <itinerary item>

Tiny mission: <checklist item>
```

## Suggested data model

```json
{
  "dateIdea": {
    "id": "cafe-crawl",
    "title": "Cafe Crawl",
    "category": "food",
    "mood": ["cozy", "chill"],
    "budget": "$",
    "durationMinutes": 120,
    "setting": "indoor",
    "energy": "low",
    "weatherSafe": true,
    "starterPokemonType": "grass",
    "flavor": "A gentle encounter with pastries, lattes, and hand-holding.",
    "checklist": ["Pick two cafes", "Bring a shared notes prompt"]
  }
}
```

## Visual direction

- Mobile-first composition with a compact planner panel and collectible date
  cards.
- Use a balanced palette: soft pinks/reds for romance, yellow accents for
  electricity/playfulness, leafy greens/blues for adventure and calm.
- Use original creature-badge motifs, Pokeball-inspired controls, map route
  details, card rarity labels, and gym-badge-like achievement chips.
- Use crisp icons and subtle motion; avoid heavy purple/blue gradients and
  one-note palettes.
- Prefer generated/original bitmap assets for hero/card art if assets are
  needed.

## Asset plan

For v1, use original Pokemon-inspired assets rather than official Pokemon art.
This keeps the site personal and reduces IP risk.

| Asset | Format | Notes |
|---|---|---|
| App background | CSS + optional bitmap | Soft route-map pattern with hearts, badges, and dotted paths |
| Date card art | Generated bitmap or CSS illustration | One small scene per category |
| Type badges | CSS/icons | Grass, fire, water, electric, fairy, psychic, flying, dark, rock, normal |
| Reveal animation | CSS | Card flip, shimmer, or pack-opening motion |
| Empty state | CSS illustration | Tiny field guide silhouette, no official characters |
| Favicon | CSS/vector-derived export | Heart badge or original capture-orb motif |

### Image generation prompts

Use these prompts only for original assets; do not request official Pokemon,
Pikachu, Pokeballs, or named copyrighted characters.

```text
Cute original monster-catching field guide background for a romantic date
planner web app, soft pink and warm yellow accents, tiny route-map paths, heart
badges, picnic icons, cafe icons, subtle paper texture, mobile app background,
no text, no copyrighted characters, no official Pokemon.
```

```text
Original collectible card art for a cozy cafe date, whimsical creature-adventure
inspired style, warm pastries, two drinks, soft romantic lighting, playful
field-guide framing, no text, no copyrighted characters, no official Pokemon.
```

```text
Original collectible card art for an arcade date, cute electric adventure mood,
glowing cabinets, tokens, playful couple silhouettes, bright yellow and coral
accents, no text, no copyrighted characters, no official Pokemon.
```

```text
Original collectible card art for a stargazing date, dreamy night sky, blanket,
warm drink, small heart-shaped constellation, gentle monster-adventure inspired
style, no text, no copyrighted characters, no official Pokemon.
```

## Component handoff

Likely component breakdown:

| Component | Responsibility |
|---|---|
| `AppShell` | Page layout, responsive frame, background |
| `MoodPicker` | Mood segmented controls |
| `FieldConditions` | Budget, time, setting, energy filters |
| `EncounterDeck` | Generated card list, reroll, lock state |
| `DateCard` | Individual card UI and add/lock controls |
| `Itinerary` | Selected plan, ordering, removal |
| `SharePanel` | Copy output and optional Gmail draft body |
| `Toast` | Lightweight success/error messages |

Recommended project files if using Vite + React:

```text
projects/pokemon-date-planner/
  package.json
  index.html
  src/
    App.tsx
    main.tsx
    styles.css
    data/dateIdeas.ts
    lib/planner.ts
    components/
      DateCard.tsx
      EncounterDeck.tsx
      FieldConditions.tsx
      Itinerary.tsx
      MoodPicker.tsx
      SharePanel.tsx
```

## Verification checklist

Run before calling the site done:

- `npm run build` succeeds.
- App loads locally with no console errors.
- Mobile viewport around 390x844 shows the planner immediately.
- Desktop viewport around 1440x900 remains polished and not sparse.
- Date cards do not overflow their containers.
- Long card titles/flavor text wrap cleanly.
- Reroll, lock, add, remove, favorite, and copy actions work.
- localStorage persistence survives refresh.
- Keyboard focus is visible and controls are reachable.
- Generated/deployed build has no missing asset references.

## Implementation plan after approval

1. Create a dedicated app directory.
2. Build a static-first web app with local JSON seed data.
3. Add responsive UI, animations, and mobile layout QA.
4. Add local persistence for favorites and itinerary drafts.
5. Add copy/share output. If Gmail is desired, create a Gmail draft, not an
   automatic send.
6. Run local verification with desktop and mobile viewport screenshots.
7. Package a deployable build.
8. Deploy or hand off deployment depending on Hostinger/VPS access.
9. Update this project page with final paths, URL, and operating notes.

## Build task breakdown

Use this as the first implementation checklist after approval.

| Task | Files | Done when |
|---|---|---|
| Scaffold app | `projects/pokemon-date-planner/` | Vite app runs locally |
| Add seed data | `src/data/dateIdeas.ts` | Starter content pack represented as typed data |
| Planner logic | `src/lib/planner.ts` | Filters, reroll, lock, and itinerary helpers work |
| Main layout | `src/App.tsx`, `src/styles.css` | First viewport is the planner |
| Controls | `MoodPicker`, `FieldConditions` | Mood and constraints update state |
| Card reveal | `EncounterDeck`, `DateCard` | Three cards reveal, reroll, lock, and add correctly |
| Itinerary | `Itinerary` | Selected cards render, persist, reorder/remove if supported |
| Sharing | `SharePanel` | Copy output matches share template |
| Persistence | localStorage helper | Favorites/itinerary survive refresh |
| Polish | CSS/assets | Mobile and desktop are visually complete |
| Build | package scripts | `npm run build` succeeds |
| QA | browser screenshots | Desktop/mobile verification completed |
| Deployment | `dist/` + DNS/hosting notes | Public URL or exact deployment blocker documented |

## Implementation risks

| Risk | Mitigation |
|---|---|
| Instagram reference remains inaccessible | Approximate with documented reveal/card-planner flow |
| Official Pokemon IP exposure | Use original assets and generic type/badge language |
| Hostinger access unavailable | Produce verified static `dist/` artifact and Janus handoff |
| Gmail send safety | Use copy/draft only unless exact send confirmation is provided |
| Vault scope creep | Keep app in dedicated folder and update only this project doc/index |
| Mobile card overflow | Use fixed card dimensions, wrapping text, and viewport QA |

## Recommended technical default

Use a lightweight Vite app with React or plain TypeScript. React is preferred if
the app grows into reusable card/filter/itinerary components; plain TypeScript
is enough if the first release stays static. Avoid a backend for v1 unless the
user wants shared saved plans or server-side Gmail automation.

## Deployment options to decide

| Option | Pros | Tradeoffs |
|---|---|---|
| Hostinger static site | Directly matches domain ownership | Needs Hostinger access or Janus help |
| VPS + Caddy subdomain | Fits existing `rareforceone.cloud` infrastructure | Requires VPS access path and service setup |
| GitHub Pages / static host + DNS | Simple for static builds | Requires DNS changes |

Likely URLs:

- `https://rareforceone.cloud/` if this should be the primary site.
- `https://dates.rareforceone.cloud/` if it should live beside existing
  services.
- `https://love.rareforceone.cloud/` if the user wants it to feel more personal.

## Deployment runbook

Preferred default: deploy the static build to `dates.rareforceone.cloud`.

### Static artifact path

If using Vite, the production build should produce:

```text
projects/pokemon-date-planner/dist/
  index.html
  assets/
```

Anything under `dist/` should be safe to upload to Hostinger static hosting or
serve from a VPS/Caddy static file root. Do not deploy source files, `.env`
files, or package manager caches.

### Hostinger static handoff

Use this path if Janus or the user handles Hostinger:

1. Build locally with `npm run build`.
2. Zip or otherwise transfer the contents of `dist/`.
3. In Hostinger, attach `dates.rareforceone.cloud` or the chosen domain to a
   static website root.
4. Upload the contents of `dist/` into that root.
5. Confirm HTTPS is active.
6. Visit the URL in a private browser window and verify the app loads.

### VPS/Caddy handoff

Use this path if the existing rareforceone VPS is chosen:

1. Build locally with `npm run build`.
2. Copy `dist/` to a dedicated read-only web root on the VPS.
3. Add a Caddy site block for the selected subdomain.
4. Point DNS for the subdomain at the VPS.
5. Reload Caddy and confirm HTTPS issuance.
6. Visit the URL and verify no missing assets or console errors.

### DNS verification

Record the final DNS decision here before deployment:

| Field | Value |
|---|---|
| Chosen host | TBD: Hostinger static hosting or VPS/Caddy |
| DNS record type | TBD |
| DNS target | TBD |
| HTTPS provider | TBD |
| Final URL | `https://dates.rareforceone.cloud/` |

Current deployment blocker: Codex does not have Hostinger or VPS deployment
access in this session, and sending a Telegram message to Janus requires
action-time confirmation. Static artifacts are ready at
`projects/pokemon-date-planner/dist/` and
`projects/pokemon-date-planner/deploy/rare-date-dex-hostinger.zip`.

### Deployment success evidence

Completion should be backed by:

- Production URL loads over HTTPS.
- Fresh/private browser session can open the planner.
- Mobile viewport shows the planner immediately.
- Static assets load without 404s.
- Project page has final URL and hosting notes filled in.

## One-message approval packet

The user can approve the build with a single message like this:

```text
Approved: create the Pokemon Date Planner website source files in
projects/pokemon-date-planner/ inside this vault.

Use the documented defaults:
- Vite + React + TypeScript
- dates.rareforceone.cloud
- browser localStorage
- copy-to-clipboard sharing for v1
- original Pokemon-inspired assets, no official Pokemon art
- unlisted public URL

You may install local npm dependencies, run a dev server, build deployment
artifacts, and request escalated approval for network/package/deployment steps
when needed. Approximate the Instagram Reel flow from the project spec unless I
provide screenshots/video first.
```

## Gmail use cases

| Use case | Autonomy level |
|---|---|
| Draft a date invitation to review manually | Codex can create a draft if recipient and body are confirmed |
| Send a date invitation | Requires exact final user confirmation before sending |
| Receive RSVPs or replies | Possible through Gmail search/read tools |
| Store date plans by email | Possible but clunky; browser storage or a small database is cleaner |
| Hostinger verification email | Codex can inspect Gmail if the message IDs are found by search |

## Janus handoff template

Use this if Telegram or Janus becomes available through another agent:

```text
Janus, please help Codex with the Pokemon Date Planner project.

Goal: deploy a cute Pokemon-themed date-planning website for rareforceone.cloud.
Current blocker: <specific blocker>
Needed action: <DNS update / Hostinger static deployment / provide Reel screenshots / Gmail verification>
Domain preference: <rareforceone.cloud / dates.rareforceone.cloud / love.rareforceone.cloud>
Do not expose credentials in chat. Confirm only the result, target URL, and any verification steps.
```

## Permission gates

Codex can proceed autonomously after the user grants:

- Permission to create and edit website source files for this project.
- Permission to install/use local npm dependencies if the chosen app stack needs
  them.
- Permission to run a local dev server for verification.
- Permission to create deployment artifacts.
- Permission to request escalated commands for network/package/deployment
  operations.
- Either Hostinger/VPS deployment access or confirmation that Janus will handle
  deployment steps.

## Autonomy checklist

| Area | Current state | Needed to avoid pause |
|---|---|---|
| Reference Reel | URL provided, not readable from this session | Screenshots, screen recording, or written flow |
| Source edits | Only documentation currently allowed | Explicit approval to create app source files |
| App location | Not chosen | Preferred folder path or permission for Codex to choose |
| Package install | Not approved | Approval for network/npm dependency install if needed |
| Gmail | Connector available | Exact approved recipient/body before draft/send actions |
| Telegram/Janus | Permission granted, no connector exposed here | A usable connector, or user/Janus relays deployment answers |
| Hostinger | Domain known, account access not exposed | Deployment instructions, access path, or Janus handoff |
| Domain route | `rareforceone.cloud` known | Pick root domain or subdomain |
| Personalization | Not provided | Names/nicknames/favorites, or approval to use placeholders |
| Privacy | Not decided | Public/private/password choice |

## Default decisions if user does not specify

- App folder: `projects/pokemon-date-planner/` if project source is allowed in
  this vault; otherwise ask for an external repo/path.
- URL: `dates.rareforceone.cloud`.
- Stack: Vite + React + TypeScript.
- Storage: browser localStorage.
- Email: copy-to-clipboard only in v1, with Gmail draft as optional follow-up.
- Personalization placeholders: "Trainer 1" and "Trainer 2" until names are
  provided.
- Privacy: unlisted public URL with no sensitive personal details.

## Open questions to ask once, then proceed

1. Can Codex create the website source files for this project, and should they
   live inside this vault?
2. Can you provide the Instagram Reel screenshots/video, or should Codex
   approximate the flow from the written product spec above?
3. Which URL should be used: `rareforceone.cloud`,
   `dates.rareforceone.cloud`, or another subdomain?
4. Should v1 use Gmail at all, or just copy/share text from the browser?
5. Should the site be public, private/unlisted, or password protected?

## Build notes for future agents

- Do not touch unrelated vault pages beyond this project page and its explicit
  index entry unless the user broadens permission.
- If source files are created in this vault, keep them under a dedicated project
  directory and avoid modifying global vault tooling.
- Use generated/original visual assets or code-native CSS/canvas assets. Do not
  scrape official Pokemon art unless the user explicitly approves that IP risk.
- Verify the UI visually in both desktop and mobile viewports before claiming
  completion.
- If deployment cannot be completed because Hostinger, DNS, or Janus access is
  unavailable, leave a deployable artifact and record the exact blocker here.

## Acceptance criteria

- The site opens on mobile and desktop.
- The first screen is the planner, not a landing page.
- The experience is Pokemon-themed and relationship/date-planning focused.
- The user can filter or choose a date mood/constraint set.
- The user can generate/reroll date ideas.
- The user can select ideas into an itinerary.
- The user can copy or draft a shareable plan.
- The design is cute, polished, responsive, and not text-heavy.
- The app is deployed at the chosen `rareforceone.cloud` URL or has a verified
  deployable build plus clear remaining deployment blocker.
- This page records final app path, deployment URL, and any ongoing maintenance
  notes.
