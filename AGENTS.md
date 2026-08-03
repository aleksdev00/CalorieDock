<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CalorieDock Repository Rules

These rules apply permanently to every development task in this repository.

## Documentation and Scope

- Treat the documentation in `docs/` as the single source of truth.
- Never violate the Feature Dependency Map. Do not begin a feature until every required dependency is complete or explicitly approved.
- Never implement future, post-MVP, premium, or otherwise out-of-scope features unless the documentation and the user explicitly authorize them.
- Stop after completing the requested task. Do not expand the scope with unsolicited features, refactors, or cleanup.

## Architecture and Code Quality

- Follow the repository's Coding Standards.
- Use the documented feature-based architecture and preserve feature boundaries.
- Explain architectural decisions, including their rationale and material tradeoffs.
- Prefer maintainable, readable, predictable solutions over clever code.
- Never edit unrelated files.

## Security

- Follow the Security Strategy for every change.
- Use Supabase Auth as the only authentication provider.
- Never expose secrets, credentials, tokens, service-role keys, or private user data.
- Never bypass Row Level Security. All user-owned data access must respect the documented RLS policies and ownership model.

## Version Control

- Keep commits focused on one logical change.
- Do not mix unrelated modifications in the same commit.

## Verification and Completion

- Run lint before finishing a development task.
- Run typecheck before finishing a development task.
- Fix every error introduced by the task before stopping.
- Do not report completion until the requested scope is complete and the required checks pass.
