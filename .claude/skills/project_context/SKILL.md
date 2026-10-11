---
name: project_context
description: project context by topic
---

## Rule

- [TEXT] Write the absolute minimum text about the decisions in bullet points.
- [APPROACH] Take simple approaches to reduce text - e.g. `Do x -> Do y -> Do z` conveys the same info as many words or bullets.
- [ALLOWED CONTENT] Consolidate forward desired content. Ban duplication. Ban history or how it's changed from.
- [ORGANISING] Group in H2. Each bullet point has `[LABEL]` prefix to assist categorizing.

## High Level Requirement

- [REQUIREMENT] `_meta/requirement__high_level.md`

## One File per Topic

[ALLOWED CONTENT] Only document decisions/reasoning that are not possible to be derived by reading code. They are to be read only when EDITing related code topics.

- [<LABEL>] `_meta/decisions/decision__<category>__<topic>.md`

## Schema Taxonomy

- [TAXONOMY][DB] `_meta/taxonomy__schema.md` - 1 Tree Structure for Tables and Relationship. 1 Table for enum and valuse