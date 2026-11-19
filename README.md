# Leonida Atlas — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sixthin016/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sixthin016/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 Grand Theft Auto VI PlayStation 5 trophies**: the official names, descriptions and grades, a cited guide to each trophy in our own words, a six-stage roadmap to the Platinum, missable warnings, and a checklist whose progress saves in the browser with export and import.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. It works with the network off — every file it loads lives under `app/`.

## What is inside

- `app/index.html` — the guide: progress bar, filters, roadmap, checklist, guide pane, method note.
- `app/app.js` — the tracker: saved progress (localStorage), search, kind/grade filters, spoiler-safe mode, per-trophy counters, export/import.
- `app/style.css` — the original design (dark Vice City night palette, no artwork).
- `app/data/trophies.json` — the official 55 trophies with a guide, steps and sources for each, plus the six-stage roadmap.
- `main.ts` — the entry program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
- `screenshots/` — 4 real renders of the guide in desktop Chrome.

## The list, honestly

Names, descriptions and grades are PlayStation's official text, as listed by Exophase and PSNProfiles on 18 November 2026 and reported by Push Square: 1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden until earned; no online trophies. GTA VI launches 19 November 2026, so the guides are written from the official descriptions, Rockstar's trailers and launch-week reporting — in our own words, never copied — and each one cites its sources beside it. Where a step is not yet confirmed in-game, the guide says so instead of guessing.

The one reported missable trophy is **Positive Mental Attitude**: Lucia's balcony meditation spot in Chapter 1 disappears after that chapter, and the game has no mission replay. Keep a manual save at the start of every chapter. The other 13 flags are time-sensitive (a partner, a one-off event, a strand that can lock) and each note says why.

## Build the hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=wffmhs5a&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
