---
name: project-context
description: read before changing code or docs in mingzillastudio - conventions by topic, the agreements behind them, and requirements
---

## Rule

- [TEXT] Write the absolute minimum text, in bullet points. `Do x -> Do y -> Do z` beats many words.
- [ALLOWED CONTENT] Consolidate, do not append: edit the existing text so it states the forward desired content. Ban duplication. Ban history.
- [ORGANISING] Group in H2. Each bullet has a `[LABEL]` prefix.
- [POINT] Point to the project's own documents. Do not copy them.

## Editing Order

`context md -> content -> context md`. Follow `flow__requirement`, section `SOP`.

## Convention

`_meta/convention.md` holds how work is done in the project, in groups. Defined in `flow__requirement`, section `Convention`.

- [ADOPT] when work should follow the project, read the index of `_meta/convention.md`, then the groups whose `Read when` matches the task. Nothing else.
- [PROPOSE] when a solution differs from a rule, check the group's Exceptions first: an option may already be approved or rejected.
- [EDIT] when changing a rule, change it and its Exceptions together. A new decision that conflicts with an earlier one: alert the author, resolve it, mark the earlier `(overridden)`.
- [DIRECTION] a rule says `new`, `touched` or `all` code. A convention may name a direction to move in.
- [STATE] the convention is not in `_meta/convention.md` yet: read the file for the topic in `_meta/decisions/decision__*.md` instead.

## Requirements

- [REQUIREMENT] `_meta/requirement__high_level.md`
