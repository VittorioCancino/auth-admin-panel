# Structured Commit Layering Skill

Use this workflow when the user wants help staging and committing current repository changes in smaller, ordered commits.

## Goal

Split all changes since the last commit into coherent implementation layers, then provide sequential `git add ... && git commit -m "..."` command blocks for each layer.

This repository was extracted from the larger IdP project, so clean initial commit layers are important for building a useful standalone history.

## Core Rule

Do not create commits yourself while using this skill.

Inspect the worktree, infer logical layers, and output exact commands the user should run manually.

## Inspection Workflow

Run these checks before proposing commit groups:

1. `git status --short --untracked-files=all`
2. `git diff --stat`
3. `git diff`
4. `git diff --cached --stat`
5. `git diff --cached` if anything is staged
6. `git log --oneline -10`

If the repository has no commits yet, say so and continue by classifying untracked files.

Read files only when the diff alone is not enough to understand whether two changes belong together.

## Grouping Strategy

Build commits around meaning, not around directories alone.

Prefer this order in this auth-admin-panel repo:

1. App/tooling foundations: `package.json`, `bun.lock`, framework config, Docker/Compose, base app files.
2. Database foundations: Prisma schema, migrations, seed scripts, generated Prisma client if intentionally committed.
3. Auth/data integration: NextAuth, DB helpers, Hydra wrappers, shared API/type utilities.
4. API routes: authenticated `/api/v1` endpoints.
5. UI features/components: pages and reusable components.
6. Repository/agent context: `AGENTS.md`, `.agents/**`, `docs/skills/**`.
7. Documentation: `README.md`, `HYDRA_API.md`, `TODO.md`, `CONTEXT.md`, `CLAUDE.md`.

Keep files together when one change does not make sense without the other.

Split files apart when they represent separate reviewable concerns.

## Good Reasons To Keep Files Together

- Prisma schema changes with matching migrations and seed scripts.
- Route handlers with the shared types/utilities they introduce.
- UI components with the page that exclusively consumes them.
- Docker/package manager fixes with the package metadata required for the image to build.
- Agent skill entrypoints with their detailed skill docs.

## Good Reasons To Split Files Apart

- Runtime app code versus docs.
- Database foundations versus UI feature work.
- API route behavior versus visual components when independently reviewable.
- Agent/context rules versus application runtime behavior.
- Formatting-only changes.

## Commit Message Guidance

Use concise action-oriented messages, for example:

- `Added admin panel app foundation`
- `Added admin user database schema`
- `Added Hydra client management API`
- `Added OAuth client dashboard`
- `Added admin panel agent context`
- `Added admin panel documentation`

Focus the message on why that layer exists, not just a file list.

## Command Format

For each proposed commit, output:

- short label for the layer
- why those files belong together
- file list
- exact command block the user should run

Use explicit `git add <file>... && git commit -m "..."` commands. Do not use interactive git commands.

Quote every path in command blocks with single quotes, even if it looks simple.

If a commit depends on partial-file staging and there is no safe file-level split, say so clearly instead of inventing a command.

## Safety Notes

- Never run `git commit`, `git add`, `git reset`, or any other mutating git command as part of this skill.
- Never suggest committing likely secret files such as `.env` without an explicit warning.
- Never hide ambiguity. If one file mixes two concerns, say that partial staging or a code split is needed.
- Prefer a smaller number of meaningful commits over a long list of tiny mechanical ones.
