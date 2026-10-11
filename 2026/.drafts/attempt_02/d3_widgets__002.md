# One bespoke d3 widget per topic

Replaces "one shared diagram renderer". `content.md` stays the source of the facts (steps, names, figures); each topic gets its own small living scene. Each widget is one file, `draw(host, opts)`, no framework. Shared kit only: theme palettes, panel look, reduced-motion still frame, speed control.

Rules for every widget: it moves on its own, it has one thing to play with (toggle / slider / drag / click), it ends on a number or a visible result, it has a still frame for reduced-motion and a layout for 390px.

| topic | scene | moves by itself | you can play with | ends on |
|-------|-------|-----------------|-------------------|---------|
| **Co-work Agent Team** | night shift: Ticket -> Proposal -> Implement -> Review -> Document stations, agents at their desks, supervisor watching | tickets flow; reviewer bounces some back; a worker's context gauge fills, then hands over to a fresh worker; sky goes dark while "you" sleep | switch Rules & Hooks off: bad tickets leak through; speed | done / bounced / bugs shipped / handovers |
| **Skill Management** | 50+ skills as a living cloud, rings Core / General / Workflow, 3 islands Operational / Authoring / Projects | dots orbit their ring | click a skill: its dependants light up; split into islands | "50+ skills, nothing tangled" |
| **Skill Optimisation** | one skill as a long ribbon of blocks | heat glows on wasteful tool calls and cache-breakers | "clean": ribbon shortens; drag a block from the LLM lane to the Code lane | tokens, time, cost meters drop |
| **Whole UK Investment Data** | a map in fog: "did this company receive investment?" | research reveals taxonomy, then a decision tree, then the formula collapses to a few lines | drop a company in; it falls through the tree (plinko) to yes / no | a simple formula |
| **PDF Discovery & Processing** | river: Discovery -> API Harvest -> Download -> Convert -> Analysis | documents stream down; coverage bar fills | "something is missing" flags a gap you can fill | 100% before analysis starts |
| **PDF Text to Tables** | race: 5 min per record vs sharded rules; files sorted into bins by type, format, generation | the slow lane crawls, the sharded lane finishes; ~12% long tail trickles to the LLM | pick a file type, watch its route | 100% classified, ~12% long tail |
| **Websites Scale & Speed** | a wall of millions of tiles | a sweep cleans, prompts, summarises each (1.5 s / site); tiles light up | hover a tile for its summary; at the end tiles cluster by similarity | throughput counter |
| **UI & Test Automation** | a mock app: Screen / Panel / Button, with Flow / Task / Wrapper above it | the bot runs its flow, green ticks | "change the UI": layout shuffles; only the element layer blinks, flows stay green | nothing rewritten |
| **Videos to Knowledge** | a video timeline | transcript scrolls; relevant moments glow | type what you care about; the hour collapses to the highlights | 1 h -> 3 moments |
| **UK Tax Return** | inbox -> folder -> normalise -> group -> extract -> verify -> report | envelopes arrive and get sorted into piles | "run it twice": same report, no duplicates (idempotent) | a stamped report |
| **Similarity Search (Vector DB)** | 10M points as a sampled star field | slow drift | zoom; click a point: neighbours ripple out; slider trades 50 GB size against query speed | 10M+ rows, 50 GB+ |
| **Smart Search (Micro Services)** | UI -> Load Balancer -> API x n -> Cache -> DB | requests stream; cache hits take the short path | slider adds APIs; kill one and traffic reroutes | latency histogram |
| **Harness for coding** | WHAT -> HOW -> CASE tree | quiet | "change a requirement": without the harness it ripples through many nodes, with it one branch lights up | blast radius 1 |
| **Apps** | Simzilla and Upskill are the real thing | | | iframe / prototype |

## Build order

1. Co-work Agent Team (first topic, most game-like) - sets the bar.
2. Harness isolation (your strongest claim).
3. Smart Search (cheap, impressive).
4. Websites wall and PDF race (scale feel).
5. The rest, by appetite.

## Shared kit (small)

`theme` (dark / light panel palettes), `still frame` when reduced-motion, a speed control, a tooltip, one helper to size to the host width and switch to a vertical layout under 560px.
