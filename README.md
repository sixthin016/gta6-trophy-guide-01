# Leonida Atlas — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sixthin016/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sixthin016/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 Grand Theft Auto VI PlayStation 5 trophies**: the official names, descriptions and grades, a cited guide to each trophy in our own words, a six-stage roadmap to the Platinum, missable warnings, and a checklist whose progress saves in the browser with export and import. Every trophy now carries its Gamerscore (1,000 in total), a difficulty rating (1–5), a time estimate and its chapter, and the guide includes the full 100% completion checklist behind A Long Road.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. It works with the network off — every file it loads lives under `app/`.

## What is inside

- `app/index.html` — the guide: compact masthead with a one-line audit strip, progress bar, filters (grade, difficulty, chapter, kind, state), checklist, guide pane, missable banner, six-stage roadmap with hours, 100% completion checklist table, missable watch list (14 trophies + save strategy), sources & audit section, method note.
- `app/app.js` — the tracker: saved progress (localStorage), search, kind/grade/difficulty/chapter filters, spoiler-safe mode, per-trophy counters, export/import, missable watch table, 100% checklist table and sources matrix rendered from the data.
- `app/style.css` — the original design (dark Vice City night palette, no artwork), densified so 9 trophies and a full open guide fit one 1280×800 screen.
- `app/data/trophies.json` — the official 55 trophies with a guide, steps, Gamerscore, difficulty, time and chapter for each, plus the six-stage roadmap with hours, the 14-row 100% completion checklist, platinum facts (4/10, ~200 h, 1 playthrough, 15+1 saves, 61 cheats) and a 9-source matrix checked 18–20 November 2026.
- `enrich-v3.mjs` — the deterministic enrichment script that rebuilt the trophy data from the v2 file (launch-day facts from GTA Zone and Sixshore, 20 Nov 2026).
- `verify-v3.mjs` — the local grade check (all checks pass; see GRADE-v3.md).
- `main.ts` — the entry program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
- `shots-v2.mjs` — the screenshot driver (headless Chromium via CDP, no npm deps).
- `screenshots/` — 4 real renders of the guide in desktop Chrome.

## The list, honestly

Names, descriptions and grades are PlayStation's official text, as listed by Exophase and PSNProfiles on 18 November 2026 and checked again against Push Square's launch-day guide on 19 November 2026 and the GTA Zone and Sixshore launch guides on 20 November 2026: 1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden until earned; no online trophies. GTA VI launched 19 November 2026, so the guides are written from the official descriptions, Rockstar's trailers and launch-week reporting — in our own words, never copied — and each one cites its sources beside it (197 citations across the 55 guides). Where a step is still not confirmed in-game at launch, the guide says so instead of guessing: five trophies (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) are still unconfirmed by every guide that has checked, and one more (Personal Best) carries a reported lead only.

The one reported missable trophy is **Positive Mental Attitude**: Lucia's balcony meditation spot in Chapter 1 disappears after that chapter, and the game has no mission replay. Keep a manual save at the start of every chapter. The other 13 flags are time-sensitive (a partner, a one-off event, a strand that can lock) and each note says why.

## Build the hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=wffmhs5a&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
