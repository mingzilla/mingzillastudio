---
name: project-context
description: read before changing code or docs in mingzillastudio - conventions by topic, the agreements behind them, and requirements
---

## Rule

- [TEXT] Write the absolute minimum text, in bullet points. `Do x -> Do y -> Do z` beats many words.
- [ALLOWED CONTENT] Forward desired content only. Ban duplication. Ban history.
- [ORGANISING] Group in H2. Each bullet has a `[LABEL]` prefix.
- [POINT] Point to the project's own documents. Do not copy them.

## Editing Order

`context md -> content -> context md`. Detail: `flow__requirement`, section `Editing Order`.

- [BEFORE] read the context md that covers the change: `convention.md` of the topic, or the requirement
- [AFTER] update it in the same change, or the change is not done. Nothing to update: say so

## Convention by Topic

`_meta/convention_by_topic/<topic>/` holds how work is done in the project. Defined in `flow__requirement`, section `Convention by Topic`.

- [ADOPT] when work should follow the project, read `convention.md` of the topic. Nothing else.
- [PROPOSE] when a solution differs from `convention.md`, read `_agreement.md` first: an option may already be approved or rejected.
- [EDIT] when changing a convention, read `_agreement.md`, then change both files together.
- [DIRECTION] a rule says `new`, `touched` or `all` code. A convention may name a direction to move in.

## Requirements

- [REQUIREMENT] `_meta/requirement__high_level.md`

## Topics

| Topic | Where |
|-------|-------|
| existing decision files, not yet moved into topics | `_meta/decisions/decision__*.md` |
