// Enrichment v2 -> v3 for Leonida Atlas (gta6-trophy-guide-01).
// Applies launch-day facts checked 20 Nov 2026 (GTA Zone, Sixshore — both
// citing PowerPyx / GTABase / Push Square / TrueAchievements) to every trophy:
// Gamerscore (sums to 1000), difficulty 1-5, time estimate, chapter, confirm
// status, and expanded guides + steps in our own words. Deterministic: run
//   node enrich-v3.mjs
// from the v3 repo root; it rewrites app/data/trophies.json in place.
import { readFileSync, writeFileSync } from 'node:fs';

const PATH = 'app/data/trophies.json';
const data = JSON.parse(readFileSync(PATH, 'utf8'));

const GZ = {
  name: 'GTA Zone — GTA 6 Trophy List (Gamerscore, chapter timing, unlock tips)',
  url: 'https://gta-zone.com/news/gta-6-trophies-achievements/',
};
const SS = {
  name: 'Sixshore — GTA 6 Trophy and Achievement List (side strands, 100% thresholds)',
  url: 'https://sixshore.com/gta-6/guides/trophies-and-achievements/',
};

// id -> patch. guide/steps replace v2; difficulty 1-5 (guide estimate);
// time is a short human estimate; chapter is 1-5, "any" or "post-story";
// status: confirmed | lead | unconfirmed.
const PATCHES = {
  1: {
    guide: 'The Platinum pops the moment the other 54 are done — there is nothing extra to do. Use this guide’s roadmap as the order and the checklist as the record; when the last bronze, silver or gold lands, this one follows automatically. PowerPyx rates the whole set 4 out of 10 and about 200 hours, Push Square 250 hours or more, so expect a long, steady run rather than a hard one: one playthrough, no online trophies, no difficulty settings, no mission medals.',
    steps: ['Finish the other 54 trophies in any order.', 'Use the roadmap stages to avoid the one missable trophy.', '100% completion (A Long Road) is usually the last step.'],
    difficulty: 1, time: '~200 h total', chapter: 'post-story', gamerscore: 0, status: 'confirmed',
  },
  2: {
    guide: 'Gone Fishing is the opening mission, so this is the first trophy most players earn. Play it as the story asks — no side content is needed first, and it cannot be missed. It is one of 12 story trophies (11 bronze, 1 gold, 250 Gamerscore together) that all unlock automatically through the story.',
    steps: ['Start a new game and play the opening mission through.', 'The trophy pops when the mission ends.'],
    difficulty: 1, time: 'opening mission', chapter: '1', gamerscore: 5, status: 'confirmed',
  },
  3: {
    guide: 'Finish Chapter 1. Chapter trophies can pop a little late, once you clear the first mission or two of the next chapter, so keep playing a few minutes past the last mission if it does not appear at once. Before the chapter ends, do Lucia’s balcony meditation — it is the one possibly missable trophy in the game, and Chapter 1 is the only place it appears.',
    steps: ['Play every Chapter 1 mission in order.', 'Before the chapter ends, do Lucia’s balcony meditation.', 'Keep playing into Chapter 2 if the trophy pops late.'],
    difficulty: 1, time: 'Chapter 1', chapter: '1', gamerscore: 20, status: 'confirmed',
  },
  4: {
    guide: 'Finish Chapter 2. Character switching between Jason and Lucia opens during this chapter; once it does, most of the list opens up, so start the side strands and activities as they appear — Billy’s strand at the Thrillbilly Mudclub, Bret’s hunting, and the partner trophies all become possible once both characters can roam together.',
    steps: ['Complete the Chapter 2 missions.', 'Try switching characters when the game offers it.', 'Start Billy’s and Bret’s strands as their markers appear.'],
    difficulty: 1, time: 'Chapter 2', chapter: '2', gamerscore: 20, status: 'confirmed',
  },
  5: {
    guide: 'Finish Chapter 3. The robbery tools arrive here — the Snap Gun from Yasmani’s Jewelry Jobs, which opens jewelry store robberies, and the street-racing strand with its time-sensitive Yago race — so do the optional missions, not just the story ones. Randy’s wish list of 16 sports cars and Tyrone’s lab strand also open in this chapter.',
    steps: ['Complete the Chapter 3 missions.', 'Take the optional robbery and racing missions as they appear.', 'Race Yago the moment the hourglass shows.'],
    difficulty: 1, time: 'Chapter 3', chapter: '3', gamerscore: 20, status: 'confirmed',
  },
  6: {
    guide: 'Finish Chapter 4. The bank-vault jobs arrive near the end of this chapter through the optional mission That’s Where The Money Is — take it when it appears, and bring your partner, because you cannot carry all the vault bags alone. Three of the six story-mission trophies also sit in Chapter 4.',
    steps: ['Complete the Chapter 4 missions.', 'Do the optional vault mission before the finale.', 'Bring your partner to every vault.'],
    difficulty: 1, time: 'Chapter 4', chapter: '4', gamerscore: 20, status: 'confirmed',
  },
  7: {
    guide: 'Complete the final mission — the gold story trophy, worth 50 Gamerscore. It is the story’s last beat, so finish the other stages first: the side strands, the activities and the collectibles all stay open after the credits, but the missable meditation in Chapter 1 does not. Keep a manual save from just before the final mission; there is no mission replay and no New Game+.',
    steps: ['Finish stages 1–5 of the roadmap first.', 'Keep a manual save from just before the final mission.', 'Play the final mission to its end.'],
    difficulty: 1, time: 'finale', chapter: '5', gamerscore: 50, status: 'confirmed',
  },
  8: {
    guide: 'Complete the mission Breakfast Run, a Chapter 2 story mission. Story missions cannot be missed — play the mission when the story brings it to you. It is one of six story-mission trophies spread across Chapters 2 to 5 (one in Chapter 2, one in Chapter 3, three in Chapter 4, one in Chapter 5).',
    steps: ['Follow the story until Breakfast Run appears in Chapter 2.', 'Complete the mission.'],
    difficulty: 1, time: 'Ch 2 mission', chapter: '2', gamerscore: 10, status: 'confirmed',
  },
  9: {
    guide: 'Complete the mission The Cartel Heist, a Chapter 3 story mission. A story trophy: it pops when the heist ends, and the mission cannot be missed. Chapter 3 is also where the Snap Gun, Randy’s wish list and Tyrone’s strand open, so take the optional missions around it.',
    steps: ['Play the story until The Cartel Heist appears in Chapter 3.', 'Complete the heist.'],
    difficulty: 1, time: 'Ch 3 mission', chapter: '3', gamerscore: 25, status: 'confirmed',
  },
  10: {
    guide: 'Complete the mission Child’s Play, a Chapter 4 story mission. Story trophy — it comes to you through the story, so just play it when it appears. Chapter 4 holds three of the six story-mission trophies, plus the chapter-completion trophy Top Of The World, Ma.',
    steps: ['Follow the story until Child’s Play appears in Chapter 4.', 'Complete the mission.'],
    difficulty: 1, time: 'Ch 4 mission', chapter: '4', gamerscore: 15, status: 'confirmed',
  },
  11: {
    guide: 'Complete the mission Headliners, a Chapter 4 story mission. Story trophy; play the mission when the story offers it. Like every story trophy it cannot be missed, so there is nothing to prepare — just do not start the final mission before the side strands are done.',
    steps: ['Follow the story until Headliners appears in Chapter 4.', 'Complete the mission.'],
    difficulty: 1, time: 'Ch 4 mission', chapter: '4', gamerscore: 15, status: 'confirmed',
  },
  12: {
    guide: 'Complete the mission VCIA Takedown, a Chapter 4 story mission at Vice City International Airport. A story trophy that cannot be missed. The airport is also where Catch Me If You Can happens — steal a passenger jet docked at a boarding gate and fly about 1 km away — so remember the layout for later.',
    steps: ['Follow the story until VCIA Takedown appears in Chapter 4.', 'Complete the mission.'],
    difficulty: 1, time: 'Ch 4 mission', chapter: '4', gamerscore: 25, status: 'confirmed',
  },
  13: {
    guide: 'Complete the mission Operation Savage Glory, the Chapter 5 story mission. Story trophy; it pops at the end of the mission. Chapter 5 is the last chapter — after it, the story ends, free roam continues, and the 100% completion checklist opens under Progress, then Stats, then 100% Completion.',
    steps: ['Follow the story until Operation Savage Glory appears in Chapter 5.', 'Complete the mission.'],
    difficulty: 1, time: 'Ch 5 mission', chapter: '5', gamerscore: 25, status: 'confirmed',
  },
  14: {
    guide: 'Attain 100% completion — the hardest trophy in the game and the last one most players earn. The checklist only appears after the story, under Progress, then Stats, then 100% Completion, but work done earlier still counts, so grind as you go. PowerPyx calls the list lenient, closer to 60% true completion: 100 optional missions out of several hundred, 200 of 277 base-model vehicles, 100 of 255 animals, 50 of 66 weapons, 70 of 80 challenges, 15 of 18 meditations, 300 of 397 stunts, 15 of 18 card sets — plus all robberies, underwater discoveries, shooting ranges, drone races and Bret’s target decks. PowerPyx puts the Platinum at about 200 hours, Push Square at 250 hours or more.',
    steps: ['Open the 100% checklist after the credits and work through it — see the checklist table below.', 'Grind the long counts early: stunts, challenges, vaults, vehicles, card sets.', 'Do 100 optional missions and study 100 animals as you travel.', 'Finish every robbery, underwater discovery, range, drone race and Bret deck.'],
    difficulty: 5, time: '~100 h post-story', chapter: 'post-story', gamerscore: 100, status: 'confirmed',
  },
  15: {
    guide: 'Complete 250 stunts. Stunt jumps, under-the-bridge flights, knife flights and base jumps all count — PowerPyx counts 397 in the game: 130 stunt jumps, 202 under-the-bridge flights, 40 knife flights and 25 base jumps, so you need a little over half. Track them on the map under Touch Pad, then Exploration, then Stunt Spots, and your progress under Touch Pad, then Progress, then Activities, then Stunts. Keep going past 250 — 100% completion needs 300.',
    steps: ['Attempt stunts as you travel; jumps and flights all count.', 'Check the counter under Touch Pad, then Progress, then Activities, then Stunts.', 'Use the map’s Stunt Spots to find the ones left.', 'Push past 250 toward 300 for 100% completion.'],
    difficulty: 4, time: '10–20 h', chapter: 'any', gamerscore: 40, status: 'confirmed',
  },
  16: {
    guide: 'Try each type of activity once. There are nine activity types: fishing, hunting, golf, shooting ranges, pool, basketball, a video game, a race and a stunt. Sampling one of each is enough — you do not need to win or finish anything, just try it. The Activities tab under Progress shows which types you have tried, so check it as you go.',
    steps: ['Open Progress, then Activities, to see the nine types.', 'Try one of each: fishing, hunting, golf, a range, pool, basketball, a video game, a race, a stunt.', 'Check the tab again — all nine ticked means the trophy pops.'],
    difficulty: 1, time: '2–3 h', chapter: 'any', gamerscore: 20, status: 'confirmed',
  },
  17: {
    guide: 'Earn a gold medal in all 42 Shooting Range challenges. There are two ranges — Rodgers Ranch & Shooting Range in Port Gellhorn and Griffin Shooting Range in Balsero — with 42 gold medals between them, most challenges in three difficulty tiers, some locked until you meet their conditions. Find them on the map under Touch Pad, then Activities, then Shooting Ranges, and track golds under Touch Pad, then Progress, then Activities, then Shooting Ranges. Learn each challenge’s weapon and scoring, then repeat it until the gold threshold clears. All 42 are also needed for 100% completion.',
    steps: ['Visit both shooting ranges: Rodgers Ranch in Port Gellhorn, Griffin in Balsero.', 'Gold each challenge; the range shows its medal thresholds.', 'Unlock locked challenges by meeting their conditions first.', 'Repeat until all 42 golds are earned.'],
    difficulty: 3, time: '4–6 h', chapter: 'any', gamerscore: 40, status: 'confirmed',
  },
  18: {
    guide: 'Win a Top Fun Drone Race at every location. There are 14 drone race locations and 42 races in total, and some charge an entry fee — bring cash. Win at least one race at each location; you do not need to win every race, just one per location. Find them on the map under Touch Pad, then Activities, then Drones, then Top Fun Drones. All 42 races are needed for 100% completion, so keep racing past the first win at each spot.',
    steps: ['Find a Top Fun drone race location on the map.', 'Win one race there, then move to the next location.', 'Bring cash — some locations charge an entry fee.', 'Keep going to all 42 races for 100% completion.'],
    difficulty: 2, time: '2–4 h', chapter: 'any', gamerscore: 15, status: 'confirmed',
  },
  19: {
    guide: 'Win 20 different races. Any 20 distinct races count out of 40 in the game — street races, drone races and the other race types. Repeat wins on the same race do not add to the count, so keep moving to new events. The counter tracks distinct wins, and this trophy also feeds Earn Cash, Not Kudos progress while you chase the Top Fun drone races.',
    steps: ['Enter races across Leonida — street, drone and the rest.', 'Win 20 different ones; the counter tracks distinct wins.', 'Do not repeat the same race: only new wins count.'],
    difficulty: 2, time: '3–5 h', chapter: 'any', gamerscore: 20, status: 'confirmed',
  },
  20: {
    guide: 'Beat Cal in a fishing challenge. Cal texts you after a Chapter 1 mission and marks the spot with a purple icon; he asks you to catch a Parrotfish over 2 kg — fish in the marked area until one of that size bites. The challenge is a one-off strand moment: take it the moment he offers it, and treat it as time-sensitive. You need a boat with a fishing rod; plenty sit in the area to borrow if you do not own one. Reel in when the line slackens, ease off when it strains.',
    steps: ['Accept Cal’s fishing challenge when it appears in Chapter 1.', 'Fish the marked area for a Parrotfish over 2 kg.', 'Win the challenge; keep a save from before it, just in case.'],
    difficulty: 2, time: '~30 min', chapter: '1', gamerscore: 10, status: 'confirmed',
  },
  21: {
    guide: 'Complete an arcade game. Three video games run on the TV at home and a fourth on arcade machines around Leonida — start any one of them and play it through to its end; just starting one does not count. One completed game is enough, and it also ticks one of the nine activity types for Master of None. Pick the shortest game if you only want the trophy, and save it for a quiet moment between missions.',
    steps: ['Find an arcade cabinet or the TV at home.', 'Start any of the four video games.', 'Play that game through to its end.'],
    difficulty: 1, time: '~30 min', chapter: 'any', gamerscore: 10, status: 'confirmed',
  },
  22: {
    guide: 'Complete the final mission for Andy. Andy’s strand is Lucia-only: it starts with a phone call in Chapter 3. Play every mission in the strand through to the finale, and finish it before the story’s final mission — side strands are reported to lock once the story passes them. Andy’s strand does not count toward the 8 Strangers & Freaks strands, because it has its own trophy.',
    steps: ['Answer Andy’s phone call in Chapter 3 (Lucia only).', 'Play Andy’s missions through to the finale.', 'Finish the strand before the final mission.'],
    difficulty: 2, time: '2–3 h', chapter: '3', gamerscore: 15, status: 'confirmed',
  },
  23: {
    guide: 'Complete the final mission for Kenton. Kenton’s treasure-diving strand covers 7 shipwrecks in total: take a boat out, dive each wreck and bring back what you find. He goes quiet after Chapter 1 and returns later, so it is not missable — but finish the strand before the finale anyway. The strand ends with the mission Maritime Disputes. Diving pairs well with the underwater discoveries the 100% checklist wants, so do both on the same trips.',
    steps: ['Start Kenton’s strand when its marker appears.', 'Dive all 7 shipwrecks.', 'Play its missions through to the finale, Maritime Disputes.'],
    difficulty: 2, time: '2–4 h', chapter: 'any', gamerscore: 15, status: 'confirmed',
  },
  24: {
    guide: 'Complete the final mission for Billy. His five jobs start at the Thrillbilly Mudclub in Kelly County after a Chapter 2 mission, and the strand stays open after the story. Play all five jobs through to the finale, Hometown Heroes, before the final mission. Billy’s strand does not count toward the 8 Strangers & Freaks strands.',
    steps: ['Go to the Thrillbilly Mudclub in Kelly County after the Chapter 2 mission.', 'Play Billy’s five jobs through.', 'Finish with the finale, Hometown Heroes, before the final mission.'],
    difficulty: 2, time: '2–3 h', chapter: '2', gamerscore: 15, status: 'confirmed',
  },
  25: {
    guide: 'Complete 8 mission strands for strangers across the state of Leonida. Only some optional questlines count: Kirk, Kyle, Yago and Pilot Pete do, while Moses, Tyrone, Yasmani, Andy and Billy do not, because they have their own trophies or strands. One strand is time-sensitive: the Chapter 3 race against Yago carries an hourglass icon, so race the moment it appears and save first. Strangers & Freaks is not part of 100% completion, so you may still need strands after the checklist is done.',
    steps: ['Start stranger strands the moment their markers appear.', 'Race Yago in Chapter 3 as soon as the hourglass shows.', 'Count Kirk, Kyle, Yago and Pilot Pete toward the 8.', 'Check the trophy’s progress counter after each strand.'],
    difficulty: 2, time: '6–10 h', chapter: 'any', gamerscore: 30, status: 'confirmed',
  },
  26: {
    guide: 'Complete the final mission for Randy. Randy’s strand is a wish list of 16 sports cars, and it opens in Chapter 3. Steal and deliver each car on the list, then play the strand through to the finale before the story’s final mission. Randy’s strand does not count toward the 8 Strangers & Freaks strands.',
    steps: ['Start Randy’s strand in Chapter 3.', 'Deliver all 16 sports cars on his wish list.', 'Play the strand through to the finale.'],
    difficulty: 3, time: '3–5 h', chapter: '3', gamerscore: 20, status: 'confirmed',
  },
  27: {
    guide: 'Complete the final mission for Tyrone. Tyrone’s strand shuts down labs in Vice City; it is Jason-only and opens in Chapter 3. Play its missions through to the finale before the story’s final mission. Tyrone’s strand does not count toward the 8 Strangers & Freaks strands, and his Kitty Litter Lab deliveries are part of the strand.',
    steps: ['Start Tyrone’s strand in Chapter 3 (Jason only).', 'Shut down the labs in Vice City, including the Kitty Litter Lab deliveries.', 'Finish the strand before the finale.'],
    difficulty: 2, time: '2–3 h', chapter: '3', gamerscore: 15, status: 'confirmed',
  },
};
Object.assign(PATCHES, {
  28: {
    guide: 'Meditate at every spot across Leonida. There are 18 spots in 10 locations, for Jason and Lucia. The one you can miss is Lucia’s balcony meditation in Chapter 1: one morning at Jason’s house, Lucia says she is going to meditate and walks out to the balcony — follow her and accept the optional quest; it takes a minute and removes the risk. PowerPyx reports that it raises the meditation counter by one, though it is not marked as a meditation spot like the other 18, and nobody has confirmed whether the trophy needs it — do it anyway. The last meditation needs Jason and Lucia playable together, which opens after Chapter 2. A meditation only counts once the final “zen” animation has played. Track your spots under Touch Pad, then Progress, then Collections, then Exploration, then Meditations. 100% completion only asks for 15 of the 18 spots, so the missable one cannot cost you A Long Road.',
    steps: ['In Chapter 1, do the balcony meditation before the chapter ends.', 'Meditate at every spot, bringing your partner to outdoor spots.', 'Wait for the “zen” animation at each spot — that is what marks it complete.', 'Keep a Chapter 1 save until the trophy pops.'],
    difficulty: 2, time: '1–2 h', chapter: '1', gamerscore: 10, status: 'confirmed',
  },
  29: {
    guide: 'Hunt a unique animal for Bret. Bret Vogel’s hunting questline is Jason-only and starts after Chapter 2; it sends you after animals through target decks, and clearing all 15 of Bret’s target decks — which 100% completion needs — should cover it. The exact animal that triggers the trophy is still not confirmed by the guide writers. A clean head or heart shot keeps the carcass pristine — take the shot carefully and finish the strand before the finale.',
    steps: ['Start Bret’s hunting strand after Chapter 2 (Jason only).', 'Follow the target decks and take clean head or heart shots.', 'Clear all 15 target decks; the unique-animal trophy should land along the way.'],
    difficulty: 2, time: '2–4 h', chapter: '2', gamerscore: 15, status: 'confirmed',
  },
  30: {
    guide: 'Complete 3 Collectible Card sets. There are 18 sets of cards across Leonida; completing any three full sets is the ask, and 100% completion needs 15 of them. Cards you sell at Pawn Shops still count toward your progress, so sell duplicates freely. Sweep the map region by region and check your collection as you go — the card tab shows which sets are missing pieces.',
    steps: ['Collect cards as you explore.', 'Complete any 3 full sets.', 'Sell duplicates at Pawn Shops — sold cards still count.', 'Keep going toward 15 sets for 100% completion.'],
    difficulty: 3, time: '4–8 h', chapter: 'any', gamerscore: 30, status: 'confirmed',
  },
  31: {
    guide: 'WAiNK It at 100 locations. WAiNK is an app on Jason’s or Lucia’s phone — hold Up to open it — and it scans landmarks for extra information. There are 31 WAiNK landmarks, 35 curiosities and 23 sculptures to scan, plus No Flusher tags, so 100 of them is the ask. It is a grind best done while you travel for other trophies — tag a location every time you pass somewhere new. Track progress under Touch Pad, then Progress, then Collections, then WAiNK Locations.',
    steps: ['Open the WAiNK app at new locations as you travel.', 'Tag landmarks, curiosities, sculptures and No Flusher tags.', 'Reach 100 tagged locations.', 'Check Touch Pad, then Progress, then Collections, then WAiNK Locations for what is left.'],
    difficulty: 3, time: '6–10 h', chapter: 'any', gamerscore: 30, status: 'confirmed',
  },
  32: {
    guide: 'Complete 50 Challenges. Challenges are in-game feats listed under Touch Pad, then Progress, then Challenges — there are 80 in the game, in 8 categories of 10 each, and you need 50 for this trophy; 100% needs 70 of them. Many complete on their own while you play, so push past 50 as you go — the hardest ones can be skipped, because 70 of 80 is enough.',
    steps: ['Open Touch Pad, then Progress, then Challenges to see what is close.', 'Finish 50; keep going toward 70 for 100%.', 'Skip the hardest challenges — 70 of 80 is enough.'],
    difficulty: 2, time: 'along the way', chapter: 'any', gamerscore: 5, status: 'confirmed',
  },
  33: {
    guide: 'Lose a 4 star Wanted Level with your partner and escape the heat. Do it with Jason and Lucia together — the easiest way is after a bank vault job, which hands you a 4-star wanted level at once. Escape until you leave the red heat zone, not just the flashing search area. This is possible once both characters can roam together in Chapter 2, and bank jobs give you 4 stars anyway.',
    steps: ['Call your partner in.', 'Get a 4-star wanted level (a vault job does it).', 'Escape until you clear the red heat zone.'],
    difficulty: 2, time: '~30 min', chapter: '2', gamerscore: 20, status: 'confirmed',
  },
  34: {
    guide: 'Rob 3 shops back-to-back with your partner without losing your Wanted Level. Call your partner, then rob three shops in a row while the police are still chasing you. If the stars fade and you are only in the red heat zone, the chain breaks. The trophy can take about 30 seconds to pop after you leave the third shop. It opens after the Chapter 2 mission Coffee Break — do it while Jason and Lucia are together and partnered.',
    steps: ['Call your partner in after the Chapter 2 mission Coffee Break.', 'Rob three shops in a row without the wanted level dropping.', 'Wait about 30 seconds after the third shop.'],
    difficulty: 2, time: '~30 min', chapter: '2', gamerscore: 20, status: 'confirmed',
  },
  35: {
    guide: 'Discover 100 vehicles. Scanning a vehicle with the WAiNK app counts as discovering it — you do not have to drive it — so scan traffic as you drive. 100% needs 200 of the 277 base models, so keep scanning past 100. Scan every new vehicle you see during the story and this trophy lands on its own.',
    steps: ['Scan vehicles with the WAiNK app as you drive.', 'Reach 100 discovered.', 'Keep scanning toward 200 of 277 for 100% completion.'],
    difficulty: 2, time: 'along the way', chapter: 'any', gamerscore: 20, status: 'confirmed',
  },
  36: {
    guide: 'Take down 5 enemies in a single use of Combat Focus. Combat Focus is the slow-motion aim — press L3 and R3 while aiming. Pick a group of gang enemies, such as the guards at an illegal operation, and use an assault rifle. PowerPyx reports that gang members count, while soldiers, police and civilians seem not to. Adrenaline extends Focus, so fill it first.',
    steps: ['Fill your Adrenaline first — it extends Focus.', 'Find a group of 5 or more gang enemies.', 'Trigger Combat Focus (L3+R3 while aiming) and down 5 in one use with an assault rifle.'],
    difficulty: 2, time: '~15 min', chapter: 'any', gamerscore: 10, status: 'confirmed',
  },
  37: {
    guide: 'Make an unscheduled departure at VCIA. At Vice City International Airport, steal a large passenger plane docked at a boarding bridge — the planes at gates E3 and E4 work; planes parked elsewhere on the airfield do not count. Go up to the cockpit, back out toward the runway and take off. Fly about 1 km away from the airport and it pops. Save first, because the police come fast.',
    steps: ['Go to VCIA, gates E3 or E4.', 'Steal the docked passenger plane and take off.', 'Fly about 1 km from the airport.'],
    difficulty: 2, time: '~30 min', chapter: 'any', gamerscore: 10, status: 'confirmed',
  },
  38: {
    guide: 'Kinda hot in these Rhinos. The description points at the Rhino tank. PowerPyx found tanks at Mile Zero Air Station in the southwest, on the south side of the air station on the island at the far southwest of the map. Save first, get in, and drive and fire until it pops. No confirmed method was published at launch, so treat these steps as the best current report.',
    steps: ['Go to Mile Zero Air Station, south side.', 'Get into a Rhino tank and drive and fire.', 'Save first — the military response is heavy.'],
    difficulty: 2, time: '~30 min', chapter: 'any', gamerscore: 10, status: 'confirmed',
  },
  39: {
    guide: 'Rob a jewelry store without being detected. The Chapter 3 mission Yasmani’s Jewelry Jobs gives you the Snap Gun and opens jewelry store robberies. Go to a store’s locked back door and use the Snap Gun on it — kicking the door in sets off the alarm. Inside the back room, find the note with the safe code, open the safe, and leave without being seen. Richardson Jewelry & Diamonds in Vice City is a good target. If someone spots you, reload rather than push on.',
    steps: ['Finish Yasmani’s Jewelry Jobs in Chapter 3 to get the Snap Gun.', 'Use the Snap Gun on a jewelry store’s locked back door.', 'Find the safe code note, open the safe, leave unseen.'],
    difficulty: 3, time: '1–2 h', chapter: '3', gamerscore: 10, status: 'confirmed',
  },
  40: {
    guide: 'Rob 5 Bank Vaults and escape. Bank vaults unlock through That’s Where The Money Is, an optional mission near the end of Chapter 4. Tail an armored security van to a large bank and get into the vault while the guard has it open. You cannot carry all the bags alone, so bring your partner. Vault jobs bring a 4-star wanted level straight away, so escaping one with your partner also earns Hot Together. There are 8 vaults in all — 100% needs every one.',
    steps: ['Do That’s Where The Money Is near the end of Chapter 4.', 'Rob 5 vaults with your partner and escape each time.', 'Keep going to all 8 vaults for 100% completion.'],
    difficulty: 3, time: '2–4 h', chapter: '4', gamerscore: 40, status: 'confirmed',
  },
  41: {
    guide: 'Rob an Armored Truck and escape. Find an armored truck on the road, stop it, take its cargo and escape the heat. It pops once you leave the red heat zone, not just the flashing search area. The first bank job counts, or you can blow open a truck’s back door with a sticky bomb earlier.',
    steps: ['Stop an armored truck and take its cargo.', 'Escape until you clear the red heat zone.', 'A sticky bomb on the back door works if you cannot stop the truck cleanly.'],
    difficulty: 1, time: '~30 min', chapter: 'any', gamerscore: 10, status: 'confirmed',
  },
  42: {
    guide: 'Explore all of Leonida. There are 52 areas to visit, from Vice City to the Leonida Keys and the far southwest. Drive and fly through every region — the map fills in as you go, and the counter shows what is left. A plane is fastest for clearing the fog from the whole map: fly a grid over the state and watch the fog lift. Mop up the last few areas on foot or by boat where the map stays grey.',
    steps: ['Visit every region of the map.', 'Fly to clear fog fast — a plane covers ground quickest.', 'Check the area counter to find the ones left.'],
    difficulty: 1, time: '2–4 h', chapter: 'any', gamerscore: 20, status: 'confirmed',
  },
  43: {
    guide: 'Rob an Illegal Operation belonging to each gang. There are nine gangs; rob one illegal operation from each. Operations show on the map once you are close enough to spot them — clear the guards, take the goods and escape the heat. The 100% checklist wants all 39 operations, so this pops along the way; keep robbing past the first one per gang and work through the list region by region.',
    steps: ['Find illegal operations across the map.', 'Rob one operation from each of the 9 gangs.', 'Keep going toward all 39 operations for 100% completion.'],
    difficulty: 2, time: '3–5 h', chapter: 'any', gamerscore: 20, status: 'confirmed',
  },
  44: {
    guide: 'UNCONFIRMED — no guide has pinned this one down at launch. PowerPyx marks it not yet known and Push Square’s guide lists it with no method; the description is the only hint anyone has. Head for the Ocean Beach bars, order a cocktail where you can see the water, and let it pop while you explore; do not chase it until the rest of the list is done. Check back for launch-week reports before grinding it.',
    steps: ['Go to Ocean Beach and find a beachfront bar with a view.', 'Order a cocktail and linger at the view.', 'If it does not pop, move on — no confirmed trigger was published at launch.'],
    difficulty: 1, time: 'unknown', chapter: 'any', gamerscore: 5, status: 'unconfirmed',
  },
  45: {
    guide: 'UNCONFIRMED — the description is the trick itself: drive a car through a vehicle showroom’s front window and out the other side, in the style of the old games. Launch-day reports say a straight crash through the glass is what pops it, though no text guide has confirmed the exact showroom yet. PowerPyx still lists it as not yet known. Save first, pick a quiet showroom, build speed on the approach, and drive straight through the window — the escape, with the police on you, is the hard part.',
    steps: ['Save manually before you try — a failed run means finding another showroom.', 'Pick a vehicle showroom with a clear run-up and a glass front.', 'Drive straight through the front window and out.'],
    difficulty: 2, time: 'unknown', chapter: 'any', gamerscore: 5, status: 'unconfirmed',
  },
  46: {
    guide: 'Follow-through at the Kolt & Associates’ bowling alley. The alley is Kingpin Bowling, an illegal operation you visit in Chapter 2. Bring Sticky Bombs, take all three key valuables — the luxury watch in an office, the shotgun on a table, and the contents of the office safe, which you blow open with a Sticky Bomb — then escape the police. If you leave something behind, the operation comes back later, so it is not missable.',
    steps: ['Visit Kingpin Bowling in Chapter 2 with Sticky Bombs.', 'Take the watch, the shotgun and the safe’s contents.', 'Escape the police.'],
    difficulty: 2, time: '~1 h', chapter: '2', gamerscore: 5, status: 'confirmed',
  },
  47: {
    guide: 'LEAD, NOT CONFIRMED — PowerPyx still marks this one not yet known at launch, and Push Square’s guide lists it with no method; the description is a riddle about a partnership. The best current report is that it pops when Jason and Lucia both reach maximum Strength: buy a gym membership and train with your partner there, since the partner trains alongside you. Treat that as a lead, not a confirmed trigger, and do not grind it until the rest of the list is done.',
    steps: ['Buy a gym membership.', 'Train with your partner until both reach maximum Strength.', 'If it does not pop at maximum Strength, leave it — the trigger is still unconfirmed.'],
    difficulty: 3, time: '3–5 h', chapter: 'any', gamerscore: 5, status: 'lead',
  },
  48: {
    guide: 'Choices made (for better or worse). PSN tracks a count to 500: actions that change your Criminal Profile. Robberies and fights feed it, so it fills up without a separate grind — just play the game. One warning: the Irredeemable criminal profile is permanent and makes police more aggressive. You can still earn everything, but it makes the cleanup harder — so do not push toward Irredeemable on purpose.',
    steps: ['Play normally; robberies and fights feed the counter.', 'Reach 500 profile-changing actions.', 'Do not push toward the Irredeemable profile — it is permanent.'],
    difficulty: 1, time: 'along the way', chapter: 'any', gamerscore: 5, status: 'confirmed',
  },
  49: {
    guide: 'UNCONFIRMED — no guide has pinned this one down at launch. PowerPyx marks it not yet known and Push Square lists it with no method. The description, “Second time’s the charm”, points at failing once and succeeding on the second try, and PowerPyx suspects a link to a Payday Loans store — but that is a guess, not a verified trigger. Play normally, retry anything you fail, and let it come to you; do not chase it until the rest of the list is done.',
    steps: ['Play normally; retry anything you fail.', 'It should pop on a second attempt somewhere in the game.', 'If it has not popped by the end of the list, it is still unconfirmed — check back for launch-week reports.'],
    difficulty: 1, time: 'unknown', chapter: 'any', gamerscore: 5, status: 'unconfirmed',
  },
  50: {
    guide: 'UNCONFIRMED — launch-day videos report this as a UFO random encounter in Kelly County after 2am: a car with flickering lights waits at the roadside, the UFO shows up further up the road, you talk to the stranger, then go back to her car. PowerPyx suspects a UFO questline but has not confirmed the trigger. Treat it as reported, not proven — drive Kelly County’s roads late at night and watch for the flickering lights.',
    steps: ['Drive the Kelly County roads after 2am.', 'Watch for a roadside car with flickering lights.', 'Talk to the stranger, then return to her car when the UFO appears.'],
    difficulty: 1, time: 'unknown', chapter: 'any', gamerscore: 5, status: 'unconfirmed',
  },
  51: {
    guide: 'UNCONFIRMED — bowl ’em over with a melee drive-by. Knock someone down with a melee attack from a moving vehicle. No confirmed trigger was published at launch; the in-game hint points to a melee attack from a moving vehicle, and PowerPyx suspects a kick from a motorcycle. Try a slow drive-by with a melee weapon in a quiet street, and a motorcycle kick if that does not pop it.',
    steps: ['Get in a vehicle with a melee weapon ready.', 'Drive by and knock someone down with the melee attack.', 'If it does not pop, try a kick from a motorcycle.'],
    difficulty: 2, time: 'unknown', chapter: 'any', gamerscore: 5, status: 'unconfirmed',
  },
  52: {
    guide: 'Earn $250,000 laundering Marked Bills through your contacts. Marked bills come from bank and payday loan jobs; launder them by selling them to your contacts through the phone. The $250,000 total is cumulative, and Yasmani pays the most, so use him where you can. The dye pack jammer you need unlocks in a Chapter 3 main mission. Bank vaults are the best late-game earner, so this trophy fills up while you work the vaults for Maximum Withdrawal and the 100% checklist.',
    steps: ['Earn marked bills from bank and payday loan jobs.', 'Sell them to your contacts until $250,000 is laundered.', 'Yasmani pays the most — use him where you can.'],
    difficulty: 2, time: 'along the way', chapter: '3', gamerscore: 20, status: 'confirmed',
  },
  53: {
    guide: 'Spend $100,000 across all shops. The total is cumulative across every kind of shop — weapons, clothes, food, car mods. Guns, car mods and tattoos get you there fastest, so buy the gear you actually want and let the total climb. Spend as you play and it will land on its own; if it is the last economy trophy standing, a car-mod spree closes the gap in minutes.',
    steps: ['Spend across shops as you play.', 'Guns, car mods and tattoos add up fastest.', 'Reach $100,000 total spending.'],
    difficulty: 1, time: 'along the way', chapter: 'any', gamerscore: 15, status: 'confirmed',
  },
  54: {
    guide: 'Purchase all garage properties. Buy the eight garages in the Vice City Real Estate app, which unlocks after the Chapter 2 mission Daily Driver. Together they cost about $160,000. Garages the story gives you do not count. The real estate app arrives in Chapter 2, and you need the garage space for On the Spot, so pair the two trophies.',
    steps: ['Finish the Chapter 2 mission Daily Driver.', 'Buy all 8 garages in the Vice City Real Estate app.', 'Keep free garage space for registering vehicles.'],
    difficulty: 1, time: '~15 min', chapter: '2', gamerscore: 15, status: 'confirmed',
  },
  55: {
    guide: 'Register 10 vehicles to the Scooter Bros app. The Chapter 2 mission Moses opens the Scooter Bros app. Take a stolen car to Moses, choose Respray, then Register. From Chapter 3 you can also register cars with a standard tracker at Pay ’n’ Spray. Each car needs a free garage space, so buy garages first and register cheap cars.',
    steps: ['Finish the Chapter 2 mission Moses.', 'Take stolen cars to Moses, Respray, then Register.', 'Register 10 vehicles in total.'],
    difficulty: 1, time: '1–2 h', chapter: '2', gamerscore: 15, status: 'confirmed',
  },
});

// ---------- apply ----------
let patched = 0;
for (const t of data.trophies) {
  const p = PATCHES[t.id];
  if (!p) throw new Error('no patch for trophy ' + t.id);
  t.guide = p.guide;
  t.steps = p.steps;
  t.difficulty = p.difficulty;
  t.time = p.time;
  t.chapter = p.chapter;
  t.gamerscore = p.gamerscore;
  t.status = p.status;
  // Every trophy cites GTA Zone (full list + Gamerscore + unlock tips);
  // side strands, activities and the 100% thresholds also cite Sixshore.
  const extra = [GZ];
  if ([14, 16, 22, 23, 24, 25, 26, 27, 28, 29, 32, 40, 46, 47, 48].includes(t.id)) extra.push(SS);
  const have = new Set(t.sources.map((s) => s.name));
  for (const s of extra) if (!have.has(s.name)) t.sources.push(s);
  patched++;
}
if (patched !== 55) throw new Error('patched ' + patched);

// ---------- top level ----------
data.platinum = {
  difficulty: '4/10',
  time: 'About 200 hours (PowerPyx); 250+ hours (Push Square)',
  playthroughs: 1,
  saves: '15 manual save slots + 1 autosave',
  cheats: '61 cheats, all locked until after the story; using one disables trophies, achievements and saving',
  noReplay: 'No mission replay, no New Game+, no difficulty settings, no mission medals',
  storyHours: '60–80 hours for the 5 chapters',
  checklistHours: 'About 100 hours for the 100% checklist',
  cleanupHours: 'About 10 hours for Strangers & Freaks and cleanup',
};
data.checklist100 = [
  { item: 'Optional missions', need: '100', of: 'several hundred' },
  { item: 'Base-model vehicles scanned', need: '200', of: '277' },
  { item: 'Animals studied (binoculars)', need: '100', of: '255' },
  { item: 'Weapons collected', need: '50', of: '66' },
  { item: 'Challenges completed', need: '70', of: '80' },
  { item: 'Meditation spots', need: '15', of: '18' },
  { item: 'Stunts completed', need: '300', of: '397' },
  { item: 'Collectible card sets', need: '15', of: '18' },
  { item: 'Bank vaults robbed', need: '8', of: '8' },
  { item: 'Illegal operations robbed', need: '39', of: '39' },
  { item: 'Shooting Range challenges (gold)', need: '42', of: '42' },
  { item: 'Top Fun drone races won', need: '42', of: '42' },
  { item: 'Bret’s target decks cleared', need: '15', of: '15' },
  { item: 'Underwater discoveries', need: 'all', of: 'all' },
];
data.listNote = 'Names, descriptions and grades are PlayStation’s official text, as listed by Exophase and PSNProfiles on 18 Nov 2026 and checked again against Push Square’s launch-day guide on 19 Nov 2026 and the GTA Zone / Sixshore launch guides on 20 Nov 2026. Counts (42 Shooting Range challenges, 14 drone race locations, 18 meditation spots, 52 areas, 9 gangs, 8 garages, 397 stunts, 18 card sets, 80 challenges, 100 WAiNK spots) are the counts PlayStation tracks for those trophies. Gamerscore values come from GTABase / TrueAchievements via GTA Zone and Sixshore and sum to 1,000. Hidden flags follow the 28 hidden trophies listed by Output Lag on 19 Nov 2026. GTA VI launched 19 Nov 2026; where a step is still not confirmed in-game at launch, the guide says so instead of guessing: five trophies are still unconfirmed and one carries a reported lead only.';
data.sources = [
  {
    name: 'Exophase — GTA VI trophy list',
    date: '18 Nov 2026',
    verified: 'All 55 official names, descriptions and grades',
    url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
  },
  {
    name: 'PSNProfiles — GTA VI trophies',
    date: '18 Nov 2026',
    verified: 'PSN counts: 42 Shooting Range, 14 drone races, 18 meditation, 52 areas, 9 gangs, 8 garages; 1,350 PSN points',
    url: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  },
  {
    name: 'Push Square — GTA 6 Trophy Guide & Roadmap',
    date: '19 Nov 2026',
    verified: 'Launch-day methods: 397 stunts, 2 shooting ranges, 18 card sets, 80 challenges, 18 meditation spots, WAiNK breakdown, 250+ hour estimate',
    url: 'https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap',
  },
  {
    name: 'PowerPyx — GTA 6 Trophy Guide & Roadmap',
    date: '20 Nov 2026',
    verified: 'Platinum 4/10, about 200 hours; 3-step roadmap (60–80 h story, ~100 h checklist, ~10 h cleanup); one possibly missable trophy; cheats disable trophies',
    url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
  },
  {
    name: 'GTA Zone — GTA 6 Trophy List',
    date: '20 Nov 2026',
    verified: 'All 55 with Gamerscore and unlock tips; chapter timing for all 12 story trophies; counting vs non-counting Strangers & Freaks strands; five entries still unconfirmed',
    url: 'https://gta-zone.com/news/gta-6-trophies-achievements/',
  },
  {
    name: 'Sixshore — GTA 6 Trophy and Achievement List',
    date: '20 Nov 2026',
    verified: 'Side-strand details (Andy Lucia-only, Kenton 7 shipwrecks, Billy 5 jobs, Randy 16 cars, Bret 15 decks); 100% checklist thresholds; 15+1 save slots; suspected triggers for the 5 unconfirmed',
    url: 'https://sixshore.com/gta-6/guides/trophies-and-achievements/',
  },
  {
    name: 'GamesRadar+ / PC Gamer — GTA 6 trophy lists',
    date: '18 Nov 2026',
    verified: 'Same 55 names in the same order; Gamerscore values; 9 activity types',
    url: 'https://www.gamesradar.com/games/grand-theft-auto-6/gta-6-trophies-achievements/',
  },
  {
    name: 'Output Lag — GTA 6 Trophy List',
    date: '19 Nov 2026',
    verified: '28 hidden trophies; Chapter 1 meditation warning; no mission replay',
    url: 'https://outputlag.com/guides/gta-6-trophy-list/',
  },
  {
    name: 'gtasix.how — GTA 6 Trophies and Achievements',
    date: '19 Nov 2026',
    verified: 'Launch-day reports: UFO encounter in Kelly County, showroom crash, VCIA plane steal, tank at Mile Zero',
    url: 'https://gtasix.how/trophies/',
  },
];
// Roadmap stages get an hours label from the PowerPyx 3-step roadmap.
const HOURS = { 1: '60–80 h', 2: '~10 h', 3: '10–20 h', 4: '10–20 h', 5: '5–10 h', 6: '~100 h' };
const ADVICE = {
  1: 'Play the story straight through — 5 chapters, 60–80 hours — but keep a manual save at the start of every chapter. Do Lucia’s balcony meditation in Chapter 1 before the chapter ends: it is the one reported missable. Do not start the final mission until stages 2 and 3 are done.',
  2: 'Clear the five side-character finales, the 8 stranger strands and Bret’s hunt before the finale. Start each strand the moment its marker appears, and race Yago the moment the hourglass shows in Chapter 3. Only Kirk, Kyle, Yago and Pilot Pete count toward the 8 strands.',
  3: 'Try all 9 activity types once, win the drone races and the 20 races, beat Cal at fishing, and work on the 250 stunts and the 42 gold Shooting Range challenges. This is the longest skill stage — start it early and chip at it between story missions.',
  4: 'Meditate at all 18 spots with your partner along, finish 3 card sets, WAiNK It at 100 locations, discover 100 vehicles and explore all 52 areas. Sweep the map region by region so nothing is left behind.',
  5: 'The robbery tools arrive in Chapters 3 and 4. Do the partner trophies while Jason and Lucia are together, bring your partner to every vault, and keep a getaway car ready for every robbery.',
  6: 'Launder $250,000, spend $100,000, buy all 8 garages and register 10 vehicles, then let the choice counter and the strange-event trophies finish. The 100% checklist is about 100 hours on its own — see the checklist table. 100% completion pops A Long Road, and the Platinum follows.',
};
for (const s of data.roadmap) {
  s.hours = HOURS[s.stage];
  s.advice = ADVICE[s.stage];
}

writeFileSync(PATH, JSON.stringify(data, null, 2) + '\n');
console.log('enriched', patched, 'trophies; gamerscore sum:',
  data.trophies.reduce((a, t) => a + t.gamerscore, 0));
console.log('guide words total:',
  data.trophies.reduce((a, t) => a + t.guide.split(/\s+/).filter(Boolean).length, 0));
console.log('steps total:', data.trophies.reduce((a, t) => a + t.steps.length, 0));
console.log('citations total:', data.trophies.reduce((a, t) => a + t.sources.length, 0));
console.log('sources matrix:', data.sources.length, '| checklist100 rows:', data.checklist100.length);
