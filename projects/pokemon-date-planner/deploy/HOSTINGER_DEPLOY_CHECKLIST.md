# Hostinger Deploy Checklist

Target URL:

```text
https://dates.rareforceone.cloud/
```

Deploy package:

```text
projects/pokemon-date-planner/deploy/rare-date-dex-hostinger.zip
```

## Steps

1. In Hostinger, create or select the `dates.rareforceone.cloud` subdomain.
2. Open the file manager or static-site upload area for that subdomain.
3. Upload `rare-date-dex-hostinger.zip`.
4. Extract it so these files are directly in the web root:

   ```text
   index.html
   styles.css
   app.js
   ```

5. Confirm DNS for `dates.rareforceone.cloud` points to the selected Hostinger
   hosting target.
6. Enable or confirm HTTPS/SSL for the subdomain.
7. Open `https://dates.rareforceone.cloud/` in a private browser window.
8. Run the app flow:
   - YES button
   - date/time picker
   - food picker
   - side quest picker
   - Gmail draft button visible

## Success Criteria

- Site loads over HTTPS.
- First card says "Will you go on a date adventure with me?"
- No directory listing is visible.
- No 404s for `styles.css` or `app.js`.
- Gmail draft link opens a compose draft; it does not send automatically.

