# Mockup 001 — three directions

Content: `_meta/content/{content,showcase,profile}.md`. Theme is not decided; each direction notes a mood only.

Shared pieces (used by all three):

| component | what | d3? |
|-----------|------|-----|
| `Diagram` | draws one mermaid flowchart from `content.md` as nodes + edges, same look for all 14 | yes, layout + animated flow along edges when in view |
| `Stat` | big number + label (`10M+ records`) | yes, count-up |
| `DemoFrame` | Simzilla (playable iframe), Upskill (prototype iframe) | no |
| `TopicPanel` | title, `(challenge)`, what, `Diagram`, links | no |

Upskill prototype is desktop only -> `DemoFrame` on mobile shows a poster + `[open prototype]`.

---

## A. Apps first

Mood: light, calm, product-landing. The two apps are the proof; projects are supporting evidence.

```text
## Desktop (>= 900px)

| Ming Huang     Apps  Work  Connect                          [CV] |
|------------------------------------------------------------------|
| Software Architect / AI Engineer                                 |
| Making AI-assisted development work at scale                     |
|                                                                  |
| (20+ years) (250+ videos) (50+ skills) (10M+ records)            |
|------------------------------------------------------------------|
| (Simzilla)                         | (Upskill)                   |
| LLM driven game world, 2 days      | Skill sharing for teams     |
| [ playable iframe, 4:3        ]    | [ prototype iframe, 16:10 ] |
| [Play]                             | [Try prototype] [GitHub]    |
|------------------------------------------------------------------|
| Work                                                             |
| | harness^ | millions of files | websites | automation | search | |
| - Co-work Agent Team        (challenge, one line)                |
| - Skill Management                                               |
| - ...                  click a row -> TopicPanel opens in place  |
```

```text
## Mobile (< 900px)

| Ming Huang            [menu] |
| Software Architect / AI Eng. |
| (20+) (250+) (50+) (10M+)    |   <- 2x2
| (Simzilla) [poster] [Play]   |
| (Upskill)  [poster] [GitHub] |
| Work: chips scroll sideways  |
| - topic rows, tap = accordion|
```

- Good: shows the newest work in 5 seconds.
- Risk: the 14 projects become a boring list; the d3 gets little room.

---

## B. The Map

Mood: dark, blueprint. One d3 map is the page; text appears on demand.

Map: Ming in the centre; 5 clusters (harness, files, websites, automation, search) + 2 app nodes. Node radius = scale figure (10M+, 1m+). Hover = challenge. Click = `TopicPanel` slides in.

```text
## Desktop

| Ming Huang                       Map  Apps  About  Connect  [CV] |
|------------------------------------------------------------------|
|                                               | TopicPanel       |
|         (harness)                             | ^ Co-work Agent  |
|            o  o                               | ! (challenge)    |
|   o--(Ming)--o        (search)  o             | ! what           |
|            o  (files)  o  o                   | ! [Diagram]      |
|     (automation)    (websites)                | ! links          |
|        o   o   (Simzilla)  (Upskill)          | v [x] close      |
|------------------------------------------------------------------|
| (20+ years) (250+ videos) (50+ skills) (10M+ records)            |
```

```text
## Mobile

| Ming Huang          [menu]   |
| [ map, 60vh, tap a cluster ] |
| tap -> TopicPanel bottom sheet|
| (stats 2x2)                  |
| list of topics (fallback)    |
```

- Good: unique, d3 is the hero, scale is felt (sizes), one screen shows everything.
- Risk: discoverability (people must know to click); needs a plain list fallback for skimmers and a11y; most work to build.

---

## C. Scroll story

Mood: editorial, high contrast, huge type. One screen per chapter; the diagram animates as you arrive.

```text
## Desktop

| 01 harness  | CHAPTER 01                                         |
| 02 files    | AI Harness Engineering                             |
| 03 websites |                                                    |
| 04 automat. | 3 topics: Co-work | Skill Mgmt | Skill Optim.     |
| 05 search   | -------------------------------------------------- |
| 06 apps     | Co-work Agent Team                                 |
| ^ sticky    | (challenge, large)                                 |
|             | [ Diagram, animated flow, 60% width ]              |
|             | what ... [<] 1/3 [>]                               |
```

```text
## Mobile

| sticky top: 01/06 harness    |
| Chapter title (large)        |
| (challenge)                  |
| [ Diagram, scroll sideways ] |
| what ...                     |
| [<] 1/3 [>]                  |
```

- Good: strong rhythm, diagrams get full attention, easy to read.
- Risk: long (6 screens + topics), still a scroll; apps are chapter 6 unless reordered.

---

## My suggestion

Take B's map as the first screen and A's two app cards right under it; C's chapter layout is what `TopicPanel` becomes for the detail.

```text
page (TD)
|-- top_nav
|-- hero (LR)
|   |-- intro_text
|   |-- map (d3)  -> opens topic_panel
|-- stat_row (LR)
|   |-- stat (LI)
|-- app_row (LR)
|   |-- demo_frame (LI)
|-- topic_list (TD)           <- plain-list fallback, also for skimmers/a11y
|   |-- topic_row (LI) -> topic_panel (diagram)
|-- about
|-- connect
```

## Questions

1. Mood: light (A), dark blueprint (B), or editorial contrast (C)?
2. Should the map exist at all, or is it a gimmick for a CV page?
3. Apps above or below the work?
