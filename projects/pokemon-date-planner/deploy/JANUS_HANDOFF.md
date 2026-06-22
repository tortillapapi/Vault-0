# Janus Handoff: Rare Date Dex

Please deploy the static website package for the Pokemon fan-style date planner.

## Goal

Publish **Rare Date Dex** at:

```text
https://dates.rareforceone.cloud/
```

## Artifact

Upload this zip's contents to the web root:

```text
projects/pokemon-date-planner/deploy/rare-date-dex-hostinger.zip
```

The zip contains:

```text
index.html
styles.css
app.js
```

## Preferred Deployment

Use Hostinger static hosting for the `dates` subdomain if available. Otherwise,
use the existing rareforceone VPS/Caddy path.

## Verification

After deployment, confirm:

- `https://dates.rareforceone.cloud/` loads over HTTPS.
- The first screen says "Will you go on a date adventure with me?"
- The flow reaches the final "open Gmail draft" button.
- No credentials or secrets are exposed.

See `HOSTINGER_DEPLOY_CHECKLIST.md` for the step-by-step checklist.
See `TELEGRAM_MESSAGE_TO_JANUS.md` for the exact user-confirmable Telegram
message.

## Notes

- The Gmail button only opens a prefilled compose draft; it does not send email.
- No backend is required.
- No npm install is required for the deployed site.
