# d3 ideas — WHAT only

Each idea: what the visitor sees, and what it proves about the work. No implementation yet.

Rule for all: a still, readable fallback (reduced-motion, mobile, no-JS-timing). Motion supports the message, never replaces text.

## Tier 1 — the page's identity

| # | idea | the visitor sees | it proves |
|---|------|------------------|-----------|
| 1 | **The Map** | Ming in the centre, 5 work clusters + 2 apps around. Bubble size = scale figure (10M+, 1m+). Hover shows the challenge; click morphs the bubble into the topic panel. | breadth at a glance, scale felt not read |
| 2 | **One Diagram, 14 topics** | Every mermaid flowchart in `content.md` drawn by the same d3 renderer: same look, auto layout. Light travels along the arrows as the diagram scrolls into view; click a node to highlight its path. | consistency, and each system's flow |
| 3 | **Isolation demo** (Harness) | The WHAT -> HOW -> CASE tree. Toggle "change a requirement": in a normal codebase the change ripples through many nodes; with the harness only one branch lights up. | the core claim: small change, small blast radius |

## Tier 2 — make the numbers real

| # | idea | the visitor sees | it proves |
|---|------|------------------|-----------|
| 4 | **Scale field** | 10M+ records as a field of dots that fills the screen as you scroll (sampled, 1 dot = many). A counter runs alongside; `50GB+` as a growing block. | 10M+ is large |
| 5 | **5 minutes vs millions** | Two lanes: one record at a time (5 min each) vs sharded parallel. The slow lane barely moves; the fast lane finishes. | why sharding + code beat per-record LLM |
| 6 | **Classification long tail** | `100% classified, ~12% long tail` as a treemap or Pareto bar: most files handled by rules, the thin tail by LLM. Hover a block for the file type. | the approach, in one picture |
| 7 | **Search load** | UI -> Load Balancer -> API x n -> Cache -> DB. Requests stream through; a slider adds APIs and the queue drains. | scales query traffic independently |

## Tier 3 — people and process

| # | idea | the visitor sees | it proves |
|---|------|------------------|-----------|
| 8 | **Agent team at work** | Worker, Reviewer, Researcher, Supervisor as nodes; tickets (dots) move Ticket -> Proposal -> Implement -> Review -> Document, bouncing back from Review sometimes. | agents work unattended, with review |
| 9 | **Skill layers** | 50+ skills as a layered treemap/sunburst: operational, authoring, project-specific. Click a layer to collapse the rest. | skills stay manageable at 50+ |
| 11 | **Career line** | 2014 -> 2025 BI platform, 2026 AI work, 250+ videos, as one timeline with density bumps. | 20+ years, not a recent pivot |

## Tier 4 — page glue (cheap, high polish)

- **Count-up stats** when visible (20+, 250+, 50+, 10M+).
- **Scroll progress** line in gold, active section in the nav.
- **Ambient hero**: very slow drifting dots behind the intro; pointer nudges them.
- **Shared-element morph**: map bubble -> topic panel, so the page feels like one object.

## Suggested cut

Build first: **1 Map, 2 One Diagram, 3 Isolation demo, count-up/progress**. They carry the page's message and reuse one data source (`content.md`).
Add later by appetite: **5**, **7**, **8** (best story-per-effort), then 4, 6, 9, 11.

## Open questions

1. Which 2-3 of tier 2/3 would you like to see first?
2. Should motion autoplay, or only on click/scroll-in?
3. Is the isolation demo (3) the right "hero argument", or is something else your strongest claim?
