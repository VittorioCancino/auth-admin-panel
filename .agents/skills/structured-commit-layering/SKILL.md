---
name: structured-commit-layering
description: Plan a layered git commit sequence for the current auth-admin-panel worktree without creating commits. Use this skill whenever the user asks how to split changes into commits, wants a clean git history, or wants repo-split initial commits.
compatibility:
  tools: Bash, Read, Glob, Grep
---

# Structured Commit Layering

Analyze the current branch changes and propose a clean commit sequence that the user can run manually.

Why this skill exists: the auth-admin-panel repo should have a reviewable history where app foundations, database/schema files, Hydra integration, UI features, docs, and agent context can be committed separately when practical.

## Required Context

Read these files before preparing commit commands:

1. `AGENTS.md`
2. `docs/skills/structured-commit-layering.md`

## Core Rule

Do not create commits yourself.

Your job is to inspect the worktree, infer logical layers, and output exact commands the user should run.

## Required Checks

Start by gathering the branch state:

```bash
git status --short --untracked-files=all
git diff --stat
git diff --cached --stat
git log --oneline -10
```

Also inspect `git diff` and `git diff --cached` when needed to understand whether files belong together.

If the repo has no commits yet, state that this is initial repository layering and continue with untracked-file classification.

## Admin Panel Commit Layers

Prefer this order for this repository:

1. App/tooling foundations: package files, config, Docker/Compose, static app shell.
2. Database foundations: Prisma schema, migrations, seed scripts, generated Prisma client if intentionally committed.
3. Auth/data integration: NextAuth, DB helpers, Hydra wrappers, shared API/type utilities.
4. API routes: authenticated `/api/v1` endpoints.
5. UI features/components: pages and reusable components.
6. Repository/agent context: `AGENTS.md`, `.agents/**`, `docs/skills/**`.
7. Documentation: `README.md`, `HYDRA_API.md`, `TODO.md`, `CONTEXT.md`, `CLAUDE.md`.

## Command Format

Output exact commands using this shape:

```bash
git add 'file-a' 'file-b' && git commit -m "Commit message"
```

Quote every path with single quotes.

Never use interactive git commands.

For the full workflow, follow `docs/skills/structured-commit-layering.md`.
