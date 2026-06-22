import { mkdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const deploy = resolve(root, "deploy");
const archive = resolve(deploy, "rare-date-dex-hostinger.zip");

await mkdir(deploy, { recursive: true });
await rm(archive, { force: true });

await new Promise((resolvePromise, reject) => {
  const child = spawn("zip", ["-r", archive, "."], {
    cwd: resolve(root, "dist"),
    stdio: "inherit"
  });
  child.on("exit", (code) => {
    if (code === 0) resolvePromise();
    else reject(new Error(`zip exited with code ${code}`));
  });
  child.on("error", reject);
});

console.log(`Packaged ${archive}`);
