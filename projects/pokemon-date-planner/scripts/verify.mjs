import { access, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const required = [
  "dist/index.html",
  "dist/styles.css",
  "dist/app.js",
  "README.md"
];

for (const file of required) {
  const path = resolve(root, file);
  await access(path);
  const info = await stat(path);
  if (info.size < 100) {
    throw new Error(`${file} looks too small to be a valid build artifact`);
  }
}

const html = await readFile(resolve(root, "dist/index.html"), "utf8");
const js = await readFile(resolve(root, "dist/app.js"), "utf8");
const css = await readFile(resolve(root, "dist/styles.css"), "utf8");

const checks = [
  ["invite prompt", html.includes("Will you go on a date adventure with me?")],
  ["yes confirmation", html.includes("WAIT, YOU ACTUALLY SAID YES??")],
  ["date picker", html.includes("So... when are you free?")],
  ["food picker", html.includes("What are we feeling?")],
  ["gmail compose", js.includes("mail.google.com/mail/")],
  ["local storage", js.includes("localStorage")],
  ["pokemon fan styling", html.includes("Rare Date Dex") && css.includes("poke-ball")],
  ["target domain docs", (await readFile(resolve(root, "README.md"), "utf8")).includes("dates.rareforceone.cloud")]
];

const failed = checks.filter(([, pass]) => !pass).map(([name]) => name);
if (failed.length) {
  throw new Error(`Verification failed: ${failed.join(", ")}`);
}

console.log("Static build verification passed.");
