# Rare Date Dex

A Pokemon fan-style date invitation website inspired by the provided Instagram
Reel flow.

## What It Does

- Starts with a cute invite card.
- Makes the `no` button evasive.
- Celebrates a `YES` click.
- Collects a date, time, food choice, and side quest.
- Creates a final mission briefing.
- Opens a prefilled Gmail compose draft without sending automatically.

## Commands

```sh
npm run build
npm run verify
npm run package
npm run start
```

## Deploy

The production site is static. Upload the contents of `dist/` to the chosen web
root for `dates.rareforceone.cloud`.

For Hostinger handoff, use:

```text
deploy/rare-date-dex-hostinger.zip
```

That archive contains the built static files directly at the zip root:

```text
index.html
styles.css
app.js
```

After upload, verify:

- `https://dates.rareforceone.cloud/` loads over HTTPS.
- The invite card appears immediately.
- The flow reaches the Gmail draft button.
- No static assets return 404.
