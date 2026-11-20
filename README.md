# Leonida Atlas — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sixthin016/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sixthin016/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that guides and tracks all 55 PlayStation 5 trophies of Grand Theft Auto VI: the official names, descriptions and grades, a guide to each in our own words that cites its sources, a six-stage roadmap to the platinum, a dedicated missable and hidden section with the save strategy, a 100% completion checklist, and a tracker that saves progress in the browser with export and import. Search and filters cover grade, kind, state, difficulty and chapter, and spoiler-safe mode hides story trophies until they are earned. It runs entirely from its own files with the network off.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser.

## Build the dossier

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That writes `out/dossier.json` from `app/` and `screenshots/`.

## Honesty note

Five trophies are labelled UNCONFIRMED in the app because no source has verified how they trigger yet, and this guide invents no steps for them. Personal Best carries a reported lead only (max Strength for both characters), not a confirmed method. Where a figure is unknown, the guide says “unknown”. The missable list is built from the official descriptions and the cited guides: the Chapter 1 balcony meditation disappears after that chapter, side strands lock once the story passes them, and the game has no mission replay — so make a manual save at the start of every chapter.
