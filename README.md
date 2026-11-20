# Leonida Atlas — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sixthin016/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sixthin016/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that guides and tracks all 55 PlayStation 5 trophies of Grand Theft Auto VI: a checklist saved in your browser (with export and import), filters by grade, kind, state, difficulty and chapter, a spoiler setting that hides story trophies until they are earned, a six-stage roadmap to the platinum, an evidence-tiered missables section, per-trophy count steppers, the 14-row 100% completion checklist, and a guide to every trophy written in our own words with its sources named beside each step.

Everything runs from the files in `app/` — no build step, no network requests. Open it with any static server.

## What is inside

- `app/index.html` + `app/app.js` + `app/style.css` — the guide and tracker
- `app/data/trophies.json` — all 55 trophies with official names, descriptions, grades, trophy points (Bronze 15, Silver 30, Gold 90, Platinum 300 — 1,350 in total), hidden flags, stages, chapters, difficulty, time estimates, counts and cited guides
- `screenshots/` — four real renders of the app
- `main.ts` — builds the submission dossier into the output directory
- `serve.ts` — a tiny static server for local use

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. Add `?demo=1` to the address to preview the tracker with a mid-progress save (11 of 55 earned). Your own progress is stored in the browser's local storage, and you can export it to a file and import it back.

## Honesty note

Five trophies are labelled UNCONFIRMED in the app — In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin — because no launch-day method exists for them, and this guide invents no steps for them. Personal Best carries a reported lead only (max Strength for both characters), not a confirmed method. Where the sources disagree — meditation spots 18 vs 15, bank vaults 5 vs 8 vs 22 bank jobs, the final mission in Chapter 4 vs 5 — both versions are shown side by side instead of picking one.
