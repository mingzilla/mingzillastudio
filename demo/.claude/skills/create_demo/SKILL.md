---
name: create_demo
description: recipes for building consistent, one-pass demo artifacts
---

# Create Demo

Pick exactly one section below based on what the demo needs. Each section is self-contained and produces one artifact.

## Table of Contents
- [Low Poly Game](#low-poly-game)
- [Dashboard](#dashboard)
- [CLI Tool](#cli-tool)
- [API Mock](#api-mock)
- [Landing Page](#landing-page)
- [Data Viz](#data-viz)
- [Scraper](#scraper)
- [Chat Bot](#chat-bot)
- [Test Suite](#test-suite)
- [Spec First](#spec-first)
- [Demo Ready](#demo-ready)

## Low Poly Game
- create a folder as the root folder
- inside the folder, make a game using d3 - use cdn version. no extra dependencies
- entities like characters etc all need to be done in low poly items
- put each entity in a file within `assets/`, referred by the game
- use colour and art style like the video game Dorfromantik
- avoid image generation llm model
- if main character is needed, use keyboard to move character

## Dashboard
- single HTML file, Chart.js via CDN, no build step, no npm
- fixed layout: KPI row / 2 charts / 1 table
- data embedded as a JSON literal in the file, no API calls
- pick one non-default palette and use it everywhere
- responsive down to 768px, no further
- no frameworks, no CSS libraries

## CLI Tool
- single-file Python (stdlib only) or Node (no deps)
- must support `--help`, `--version`, and at least one subcommand
- output format: human table by default, JSON with `--json`
- tests in a sibling `_test` file that pass before finishing
- exit codes: 0 success, 1 user error, 2 internal error

## API Mock
- single-file FastAPI or Express, in-memory store only
- fixed routes: `GET /items`, `POST /items`, `GET /items/:id`, `GET /health`
- seeded with deterministic fake data on startup
- CORS wide open so a browser dashboard can hit it
- port from env var, default 3000

## Landing Page
- single HTML + one CSS file, no JS framework
- fixed sections in order: hero / features / CTA / footer
- system font stack only, no web fonts
- one accent colour, one neutral background, generous whitespace
- no Tailwind CDN unless a specific look is required

## Data Viz
- takes a CSV path as arg, outputs a single HTML file
- D3 or Plot via CDN, no other deps
- chart type chosen by heuristic from column count and dtypes
- fixed color ramp, legend always present
- title and axis labels derived from CSV headers

## Scraper
- single Python file, `httpx` + `selectolax` only
- output JSONL to stdout, one record per line
- polite defaults: 1 req/sec, real user-agent string, respect robots.txt
- no headless browser, no Selenium
- `--limit N` flag, default 20

## Chat Bot
- single file, one dependency max
- fixed command set: `ping`, `roll`, `echo`
- token from env var, never hardcoded, never logged
- `--dry-run` mode that prints instead of posting
- clear startup log line showing which workspace/channel it's bound to

## Test Suite
- given a source file path, produce pytest or vitest tests
- fixed structure: happy path / edge case / error case per public function
- tests must run and pass before finishing
- no mocking frameworks, no network calls
- output the exact command to run them at the end

## Spec First
- before writing any code, write `SPEC.md` in the root folder
- spec must list: artifact name, files to create, interfaces (function names, routes, message shapes), and one acceptance test
- do not write any other file until `SPEC.md` exists
- if the spec is ambiguous, state the assumption inline rather than asking

## Demo Ready
- after the artifact works, append a `RUN.md` with the exact command to start it
- include one smoke test command whose output proves it works
- include a `FALLBACK.md` line describing how to demo if this piece fails
- no setup steps longer than one line