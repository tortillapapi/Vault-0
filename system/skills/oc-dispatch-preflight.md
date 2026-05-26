# oc-dispatch-preflight

Mirror of the CC orchestrator skill `oc-dispatch-preflight` (canonical:
`/root/.claude/skills/oc-dispatch-preflight.md`).

Checklist to run BEFORE handing a spec to OpenClaw: read the OC CLI cheatsheet
first; pick the agent tier (lead/mid/grunt) by complexity and consequence;
check OC main's context budget and suggest `/clear` between unrelated specs;
batch multi-phase specs into one self-orchestrated dispatch with explicit gates
(saves tokens, ~3× faster); pre-check systemd timers and back up non-git
`/root` configs; ensure vault-touching specs end with git commit + push and
respect spec `owner:` frontmatter.

See [[tier-routing]] and [[orchestrator-role]].
