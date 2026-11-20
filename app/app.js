/* Leonida Atlas — GTA VI trophy guide & tracker. All data comes from data/trophies.json. */
"use strict";

const SOURCES = [
  { name: "Exophase", url: "https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/", read: "20 Nov 2026" },
  { name: "PSNProfiles", url: "https://psnprofiles.com/trophies/43531-grand-theft-auto-vi", read: "20 Nov 2026" },
  { name: "Push Square", url: "https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap", read: "20 Nov 2026" },
  { name: "PowerPyx", url: "https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/", read: "20 Nov 2026" },
  { name: "GTA Zone", url: "https://gta-zone.com/news/gta-6-trophies-achievements/", read: "20 Nov 2026" },
  { name: "Sixshore", url: "https://sixshore.com/gta-6/guides/trophies-and-achievements/", read: "20 Nov 2026" },
  { name: "GamesRadar+ / PC Gamer", url: "https://www.gamesradar.com/games/grand-theft-auto-6/gta-6-trophies-achievements/", read: "20 Nov 2026" },
  { name: "Output Lag", url: "https://outputlag.com/guides/gta-6-trophy-list/", read: "20 Nov 2026" },
  { name: "gtasix.how", url: "https://gtasix.how/trophies/", read: "20 Nov 2026" }
];

const STAGES = [
  { n: 1, title: "Story first — Chapters 1 to 4 and the finale", hours: "60–80 h", ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    advice: "Play the story straight through; the 12 story trophies land as you go. Protect the run: a manual save at every chapter start, the Chapter 1 balcony meditation before Chapter 1 ends, and the Chapter 2 partner trophies while Jason and Lucia are together." },
  { n: 2, title: "Strangers and side characters", hours: "~10 h", ids: [22, 23, 24, 25, 26, 27, 29],
    advice: "Clear every stranger strand before the finale — side strands are reported to lock once the story passes them. Do the Yago race the moment its hourglass appears in Chapter 3, and work each strand's final mission as it appears." },
  { n: 3, title: "Activities and skills", hours: "10–20 h", ids: [15, 16, 17, 18, 19, 20, 21, 46],
    advice: "Sample all 9 activity types first, then grind the counted ones: 250 stunts, 42 gold shooting-range challenges, 14 drone-race locations, 20 race wins. Take Cal's fishing challenge the first time he offers it." },
  { n: 4, title: "Collectibles and exploration", hours: "10–20 h", ids: [28, 30, 31, 35, 42],
    advice: "Sweep region by region: 18 meditation spots, 3 card sets to start (15 for 100%), 100 WAiNK photos, 100 vehicles, all 52 areas. Do the meditations early — the Chapter 1 balcony spot is the game's one missable trophy." },
  { n: 5, title: "Heists, combat and the wanted level", hours: "5–10 h", ids: [32, 33, 34, 36, 37, 38, 39, 40, 41, 43, 45, 51],
    advice: "Partner robberies, 5 enemies in one Combat Focus, 5 bank vaults, one armored truck, one illegal operation per gang. Save before every one-off: the airport departure, the jewelry store, the showroom smash." },
  { n: 6, title: "Money, secrets and the Platinum", hours: "~100 h", ids: [1, 14, 44, 47, 48, 49, 50, 52, 53, 54, 55],
    advice: "Launder $250,000 in Marked Bills, spend $100,000, buy all 8 garages, register 10 vehicles. The 100% checklist is the real work — about 100 hours — and the platinum lands with the last trophy before it." }
];

const CHECKLIST = [
  { item: "Optional missions", need: 100, of: "several hundred", key: "optional" },
  { item: "Base-model vehicles scanned", need: 200, of: 277, key: "vehicles" },
  { item: "Animals studied (binoculars)", need: 100, of: 255, key: "animals" },
  { item: "Weapons collected", need: 50, of: 66, key: "weapons" },
  { item: "Challenges completed", need: 70, of: 80, key: "challenges" },
  { item: "Meditation spots", need: 15, of: 18, key: "meditations" },
  { item: "Stunts completed", need: 300, of: 397, key: "stunts" },
  { item: "Collectible card sets", need: 15, of: 18, key: "cards" },
  { item: "Bank vaults robbed", need: 8, of: 8, key: "vaults" },
  { item: "Illegal operations robbed", need: 39, of: 39, key: "ops" },
  { item: "Shooting Range challenges (gold)", need: 42, of: 42, key: "ranges" },
  { item: "Top Fun drone races won", need: 42, of: 42, key: "drones" },
  { item: "Bret's target decks cleared", need: 15, of: 15, key: "decks" },
  { item: "Underwater discoveries", need: "all", of: "all", key: "underwater" }
];

const DISAGREE = {
  28: "Some guides list 18 meditation spots; others say 15 count. This guide follows the trophy list (18 spots for the trophy) and the 100% checklist (15 of 18). Meditate at all 18 and both numbers are covered.",
  40: "This trophy needs 5 bank vaults robbed, but the 100% checklist needs 8 vaults, and some guides count 22 bank jobs in total. Rob 5 for the trophy, keep going to 8 for the checklist.",
  7: "Some guides place the final mission in Chapter 4, others in Chapter 5. This guide lists it as the finale after Chapter 5's missions. Either way, clear all side content before you start it.",
  13: "Some guides place the final mission in Chapter 4, others in Chapter 5. This guide follows the chapter list that puts Operation Savage Glory in Chapter 5."
};

const TIERS = [
  { key: "possibly", cls: "red", title: "Possibly missable — 1 trophy", note: "One trophy can be lost for good on a normal playthrough. Do it first, keep a manual save.",
    ids: [28] },
  { key: "watch", cls: "amber", title: "Watch — 1 trophy", note: "Time-sensitive: an hourglass marks the moment. Miss the window and the strand may not count.",
    ids: [25] },
  { key: "unconfirmed", cls: "blue", title: "Unconfirmed — 3 trophies", note: "Flagged by the guides, but no launch-day method is confirmed for the trigger. Save first, check the sources, do not trust an invented route.",
    ids: [45, 29, 20] },
  { key: "disagreement", cls: "", title: "Disagreement — 4 trophies", note: "Some guides flag these as missable, others treat them as repeatable. The safe play is the same either way: do them at the first good chance, with a save made first.",
    ids: [33, 34, 37, 39] },
  { key: "cleared", cls: "", title: "Cleared — everything else", note: "The remaining flagged trophies have a understood trigger and a clean avoidance: finish the side strand before the finale, with a chapter-start save behind you.",
    ids: [22, 23, 24, 26, 27] }
];

const LS_KEY = "leonida-atlas-v3";
const GRADE_LETTER = { platinum: "P", gold: "G", silver: "S", bronze: "B" };
const DEMO_EARNED = [2, 3, 4, 8, 15, 16, 20, 21, 35, 41, 46];
const DEMO_COUNTS = { 28: 9, 14: 23, 31: 47, 35: 61, 42: 31, 15: 120, 30: 1, 40: 2 };
const DEMO_CHECKLIST = { optional: 23, meditations: 9, vehicles: 61, vaults: 2 };

let TROPHIES = [];
let byId = {};
let state = { earned: [], counts: {}, checklist: {}, revealed: [], spoiler: true };
let selectedId = 28;
let filters = { q: "", grade: "", kind: "", state: "", diff: "", chapter: "" };

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) { const s = JSON.parse(raw); if (s && Array.isArray(s.earned)) return s; }
  } catch (e) { /* corrupted save: start fresh */ }
  const demo = new URLSearchParams(location.search).get("demo") === "1";
  if (demo) return { earned: DEMO_EARNED.slice(), counts: Object.assign({}, DEMO_COUNTS), checklist: Object.assign({}, DEMO_CHECKLIST), revealed: [], spoiler: true };
  return { earned: [], counts: {}, checklist: {}, revealed: [], spoiler: true };
}
function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
  const el = document.getElementById("savedNote");
  if (el) el.textContent = "● Saved in this browser";
}
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function citeHtml(text) {
  return esc(text).replace(/\[(\d+)\]/g, '<span class="cite">[$1]</span>');
}
function isEarned(t) { return state.earned.indexOf(t.id) !== -1; }
function isMasked(t) {
  return state.spoiler && t.hidden && !isEarned(t) && state.revealed.indexOf(t.id) === -1;
}
function toggleEarned(id) {
  const i = state.earned.indexOf(id);
  if (i === -1) state.earned.push(id); else state.earned.splice(i, 1);
  saveState(); renderAll();
}
function bumpCount(id, delta) {
  const t = byId[id];
  if (!t || !t.count) return;
  const cur = state.counts[id] || 0;
  state.counts[id] = Math.max(0, Math.min(t.count, cur + delta));
  saveState(); renderAll();
}
function gradeCounters() {
  const c = { P: [0, 0], G: [0, 0], S: [0, 0], B: [0, 0] };
  TROPHIES.forEach(t => {
    const L = GRADE_LETTER[t.grade];
    c[L][1]++;
    if (isEarned(t)) c[L][0]++;
  });
  return c;
}
function totalPoints() { return TROPHIES.reduce((a, t) => a + t.points, 0); }
function earnedPoints() { return TROPHIES.filter(isEarned).reduce((a, t) => a + t.points, 0); }
function srcCiteCount(n) { return TROPHIES.filter(t => (t.sources || []).indexOf(n) !== -1).length; }

function renderHeader() {
  const earned = state.earned.length;
  const pct = Math.round(earned / TROPHIES.length * 100);
  document.getElementById("progFill").style.width = pct + "%";
  document.getElementById("progText").textContent = earned + " / 55 earned · " + pct + "% · " + earnedPoints() + " / 1,350 trophy points";
  document.getElementById("progPct").textContent = pct + "%";
  const c = gradeCounters();
  document.getElementById("gradeChips").innerHTML =
    '<span class="gchip plat">P ' + c.P[0] + "/" + c.P[1] + "</span>" +
    '<span class="gchip gold">G ' + c.G[0] + "/" + c.G[1] + "</span>" +
    '<span class="gchip silv">S ' + c.S[0] + "/" + c.S[1] + "</span>" +
    '<span class="gchip bronz">B ' + c.B[0] + "/" + c.B[1] + "</span>";
  const tog = document.getElementById("spoilerToggle");
  tog.classList.toggle("off", !state.spoiler);
  tog.querySelector(".lbl").textContent = state.spoiler ? "Spoilers hidden" : "Spoilers shown";
}

function renderAudit() {
  let steps = 0, cited = 0;
  TROPHIES.forEach(t => (t.steps || []).forEach(s => { steps++; if (s.c && s.c.length) cited++; }));
  const single = TROPHIES.filter(t => (t.sources || []).length <= 1).length;
  const guidesCited = TROPHIES.filter(t => (t.sources || []).length > 0).length;
  document.getElementById("auditStrip").innerHTML =
    "<b>55 official</b> · 1P 2G 6S 46B · <b>28 hidden</b> · " + guidesCited + "/55 guides cite a source · " +
    cited + "/" + steps + " steps cited · <b>9 sources read 20 Nov 2026</b> · " +
    '<span class="warn">1 possibly missable</span> · 1 watch · <span class="warn">5 unconfirmed</span> · 4 disagreement · ' +
    single + " single-source · 0 online trophies · <b>1,350 trophy points</b>";
}

function filteredTrophies() {
  const q = filters.q.trim().toLowerCase();
  return TROPHIES.filter(t => {
    if (q && (t.name + " " + t.description + " " + t.guide).toLowerCase().indexOf(q) === -1) return false;
    if (filters.grade && t.grade !== filters.grade) return false;
    if (filters.kind && t.kind !== filters.kind) return false;
    if (filters.state === "earned" && !isEarned(t)) return false;
    if (filters.state === "todo" && isEarned(t)) return false;
    if (filters.diff && String(t.difficulty) !== filters.diff) return false;
    if (filters.chapter && String(t.chapter) !== filters.chapter) return false;
    return true;
  }).sort((a, b) => {
    const ea = isEarned(a) ? 0 : 1, eb = isEarned(b) ? 0 : 1;
    return ea - eb || a.id - b.id;
  });
}

function trophyRow(t) {
  const masked = isMasked(t);
  const L = GRADE_LETTER[t.grade];
  let name = masked ? "Hidden trophy — earn it to reveal" : esc(t.name);
  let meta = masked ? "Story trophy · hidden on PlayStation until earned" :
    esc(t.description) + " · Ch " + t.chapter + " · Stage " + t.stage + " · ★".repeat(t.difficulty) + " · " + esc(t.time);
  let badges = '<span class="badge ' + L + '">' + L + " " + t.points + " pts</span>";
  if (t.hidden && !masked) badges += '<span class="badge hidden">hidden</span>';
  if (t.missable) badges += '<span class="badge miss">missable</span>';
  if (t.status === "unconfirmed") badges += '<span class="badge unc">UNCONFIRMED</span>';
  if (t.status === "lead") badges += '<span class="badge lead">lead only</span>';
  const reveal = masked ? '<button class="btn reveal" data-reveal="' + t.id + '">Reveal</button>' : "";
  const cnt = t.count ? ' <span class="tmeta">· ' + (state.counts[t.id] || 0) + "/" + t.count + " " + esc(t.countLabel || "") + "</span>" : "";
  return '<li data-id="' + t.id + '" class="' + (isEarned(t) ? "earned" : "") + (selectedId === t.id ? " sel" : "") + '">' +
    '<input type="checkbox" ' + (isEarned(t) ? "checked" : "") + ' data-check="' + t.id + '" aria-label="earned">' +
    '<div><span class="tname">' + name + "</span>" + badges + reveal +
    '<div class="tmeta">' + meta + cnt + "</div></div></li>";
}

function renderList() {
  const list = filteredTrophies();
  document.getElementById("trophyList").innerHTML = list.map(trophyRow).join("") ||
    '<li style="cursor:default">No trophies match these filters.</li>';
  document.getElementById("listCount").textContent = "Showing " + list.length + " of 55 · earned first";
}

function detailHtml(t) {
  const L = GRADE_LETTER[t.grade];
  let h = '<h2>' + esc(t.name) + ' <span class="badge ' + L + '">' + L + " " + t.points + ' pts</span>';
  if (t.hidden) h += ' <span class="badge hidden">hidden</span>';
  if (t.missable) h += ' <span class="badge miss">missable</span>';
  if (t.status === "unconfirmed") h += ' <span class="badge unc">UNCONFIRMED</span>';
  if (t.status === "lead") h += ' <span class="badge lead">lead only</span>';
  h += "</h2>";
  h += '<div class="quote">“' + esc(t.description) + '” — official PlayStation description</div>';
  h += '<div class="chips">' +
    '<span class="chip">Grade <b>' + t.grade + " · " + t.points + ' pts</b></span>' +
    '<span class="chip">Kind <b>' + esc(t.kind) + "</b></span>" +
    '<span class="chip">Stage <b>' + t.stage + "</b></span>" +
    '<span class="chip">Chapter <b>' + esc(String(t.chapter)) + "</b></span>" +
    '<span class="chip">Difficulty <b>' + "★".repeat(t.difficulty) + "☆".repeat(5 - t.difficulty) + "</b></span>" +
    '<span class="chip">Time <b>' + esc(t.time) + "</b></span>" +
    '<span class="chip">Status <b>' + esc(t.status) + "</b></span></div>";
  if (t.count) {
    const cur = state.counts[t.id] || 0;
    const pct = Math.round(cur / t.count * 100);
    h += '<div class="stepper"><button data-count="' + t.id + '|-1" aria-label="decrease">−</button>' +
      '<span class="val">' + cur + " / " + t.count + " " + esc(t.countLabel || "") + "</span>" +
      '<button data-count="' + t.id + '|1" aria-label="increase">+</button></div>' +
      '<div class="minibar"><i style="width:' + pct + '%"></i></div>';
  }
  if (t.missable && t.missableNote) {
    h += '<div class="callout red"><b>⚠ MISSABLE — read before you play</b>' + esc(t.missableNote) +
      (t.save ? "<br>Save window: " + esc(t.save) : "") + "</div>";
  }
  if (DISAGREE[t.id]) {
    h += '<div class="callout blue"><b>SOURCES DISAGREE — both versions shown</b>' + esc(DISAGREE[t.id]) + "</div>";
  }
  if (t.status === "unconfirmed") {
    h += '<div class="callout amber"><b>UNCONFIRMED — no launch-day method</b>No launch-day method exists for this trophy. This guide invents no steps for it — check the sources below for updates.</div>';
  }
  if (t.status === "lead") {
    h += '<div class="callout amber"><b>REPORTED LEAD ONLY — not a confirmed method</b>The lead in the guides is max Strength for both characters. It is reported, not confirmed in the game.</div>';
  }
  h += "<p>" + citeHtml(t.guide) + "</p>";
  h += "<h3>What to do</h3><ol class=\"steps\">";
  (t.steps || []).forEach((s, i) => {
    h += "<li>" + citeHtml(s.t) + " " + (s.c || []).map(n => '<span class="cite">[' + n + "]</span>").join(" ") + "</li>";
  });
  h += "</ol>";
  if (t.save && !t.missable) h += '<div class="callout green"><b>Save strategy</b>' + esc(t.save) + "</div>";
  const srcs = (t.sources || []).map(n => {
    const s = SOURCES[n - 1];
    return '<a href="' + s.url + '">' + esc(s.name) + "</a> [" + n + "]";
  }).join(" · ");
  h += '<div class="srcs">Sources: ' + srcs + " — read 20 Nov 2026. A source is cited, never copied.</div>";
  h += '<div style="margin-top:10px"><button class="btn primary" data-check="' + t.id + '">' +
    (isEarned(t) ? "✓ Earned — uncheck" : "Mark earned") + "</button> " +
    '<button class="btn" data-next="1">Next trophy →</button></div>';
  return h;
}

function renderDetail() {
  const t = byId[selectedId] || TROPHIES[0];
  const box = document.getElementById("detailBox");
  if (isMasked(t)) {
    box.innerHTML = "<h2>Hidden trophy</h2><p class=\"masked\">This story trophy stays hidden on PlayStation until it is earned. Its name and description are masked by the spoiler setting.</p>" +
      '<button class="btn primary" data-reveal="' + t.id + '">Reveal this trophy</button> ' +
      '<button class="btn" data-check="' + t.id + '">Mark earned</button>';
    return;
  }
  box.innerHTML = detailHtml(t);
}

function renderSourcesPanel() {
  document.getElementById("sourceList").innerHTML = SOURCES.map((s, i) => {
    const n = i + 1;
    return "<li><span class=\"n\">" + n + "</span><b>" + esc(s.name) + "</b> — read " + s.read +
      '<div class="cited">cited by ' + srcCiteCount(n) + ' of 55 guides</div>' +
      '<a href="' + s.url + '">' + esc(s.url) + "</a></li>";
  }).join("");
}

function renderRoadmap() {
  document.getElementById("stageGrid").innerHTML = STAGES.map(st => {
    const earned = st.ids.filter(id => state.earned.indexOf(id) !== -1).length;
    const chips = st.ids.map(id => {
      const t = byId[id];
      return '<span class="tchip' + (isEarned(t) ? " earned" : "") + (t.missable ? " miss" : "") + '">' +
        (isEarned(t) ? "✓ " : "") + esc(t.name) + "</span>";
    }).join("");
    return '<div class="stage"><h2>Stage ' + st.n + " — " + esc(st.title) + "</h2>" +
      '<div class="hours">' + esc(st.hours) + ' · <span class="count">' + earned + "/" + st.ids.length + " earned</span></div>" +
      "<p>" + esc(st.advice) + "</p><div class=\"tchips\">" + chips + "</div></div>";
  }).join("");
}

function missCard(t) {
  const L = GRADE_LETTER[t.grade];
  let h = '<div class="misscard"><span class="tname">' + esc(t.name) + '</span> <span class="badge ' + L + '">' + L + " " + t.points + " pts</span>";
  if (t.status === "unconfirmed") h += ' <span class="badge unc">UNCONFIRMED</span>';
  h += "<p><b>Trigger:</b> " + esc(t.missableNote || t.description) + "</p>";
  h += "<p><b>What to do:</b> " + citeHtml(t.guide.split(". ")[0] + ".") + "</p>";
  if (t.save) h += "<p><b>Save window:</b> " + esc(t.save) + "</p>";
  h += '<p class="srcs">Sources: ' + (t.sources || []).map(n => esc(SOURCES[n - 1].name) + " [" + n + "]").join(" · ") + "</p></div>";
  return h;
}

function renderMissable() {
  document.getElementById("tierGrid").innerHTML = TIERS.map(tier =>
    '<div class="tier ' + tier.cls + '"><h2>' + esc(tier.title) + "</h2><p>" + esc(tier.note) + "</p>" +
    tier.ids.map(id => missCard(byId[id])).join("") + "</div>"
  ).join("");
}

function renderChecklist() {
  let rows = CHECKLIST.map(r => {
    const cur = typeof r.need === "number" ? (state.checklist[r.key] || 0) : null;
    const pct = cur === null ? 0 : Math.min(100, Math.round(cur / r.need * 100));
    const val = cur === null ? "—" : cur + " / " + r.need;
    return "<tr><td>" + esc(r.item) + "</td><td class=\"num\">" + val + "</td><td>" + esc(String(r.of)) + "</td>" +
      '<td style="min-width:110px"><div class="minibar" style="margin:0"><i style="width:' + pct + '%"></i></div></td></tr>';
  }).join("");
  document.getElementById("checkTable").innerHTML =
    "<tr><th>100% checklist item</th><th>Need</th><th>Of</th><th>Progress</th></tr>" + rows;
  const med = byId[28], road = byId[14];
  document.getElementById("counterCards").innerHTML =
    '<div class="panel"><h2>Count steppers — track them here</h2>' +
    "<p><b>" + esc(med.name) + "</b> — " + esc(med.description) + "</p>" +
    '<div class="stepper"><button data-count="28|-1">−</button><span class="val">' + (state.counts[28] || 0) + ' / 18 meditations</span><button data-count="28|1">+</button></div>' +
    '<div class="minibar"><i style="width:' + Math.round((state.counts[28] || 0) / 18 * 100) + '%"></i></div>' +
    "<p><b>" + esc(road.name) + "</b> — optional missions toward 100% completion</p>" +
    '<div class="stepper"><button data-checkcount="optional|-1">−</button><span class="val">' + (state.checklist.optional || 0) + ' / 100 optional missions</span><button data-checkcount="optional|1">+</button></div>' +
    '<div class="minibar"><i style="width:' + Math.min(100, (state.checklist.optional || 0)) + '%"></i></div>' +
    "<p class=\"srcs\">Counts are PlayStation's own targets: 18 meditation spots, 100 optional missions [1][2][3]. The 100% row needs 15 of 18 meditations — sources disagree on the spot count, so this guide tracks all 18.</p></div>";
}

function guideBlock(t) {
  const masked = isMasked(t);
  const L = GRADE_LETTER[t.grade];
  let h = '<div class="tblock" id="t' + t.id + '"><div class="thead">' +
    '<input type="checkbox" ' + (isEarned(t) ? "checked" : "") + ' data-check="' + t.id + '">' +
    '<span class="tname">' + (masked ? "Hidden trophy — earn it to reveal" : esc(t.name)) + "</span>" +
    '<span class="badge ' + L + '">' + L + " " + t.points + " pts</span>";
  if (t.hidden && !masked) h += '<span class="badge hidden">hidden</span>';
  if (t.missable) h += '<span class="badge miss">missable</span>';
  if (t.status === "unconfirmed") h += ' <span class="badge unc">UNCONFIRMED</span>';
  if (t.status === "lead") h += ' <span class="badge lead">lead only</span>';
  h += "</div>";
  if (masked) {
    h += '<p class="masked">Masked by the spoiler setting. <button class="btn reveal" data-reveal="' + t.id + '">Reveal</button></p></div>';
    return h;
  }
  h += '<div class="quote">“' + esc(t.description) + '” — official PlayStation description</div>';
  if (t.count) {
    const cur = state.counts[t.id] || 0;
    h += '<div class="stepper"><button data-count="' + t.id + '|-1">−</button><span class="val">' + cur + " / " + t.count + " " + esc(t.countLabel || "") + '</span><button data-count="' + t.id + '|1">+</button></div>' +
      '<div class="minibar"><i style="width:' + Math.round(cur / t.count * 100) + '%"></i></div>';
  }
  h += "<p>" + citeHtml(t.guide) + "</p><ol class=\"steps\">";
  (t.steps || []).forEach(s => {
    h += "<li>" + citeHtml(s.t) + " " + (s.c || []).map(n => '<span class="cite">[' + n + "]</span>").join(" ") + "</li>";
  });
  h += "</ol>";
  if (t.missable && t.missableNote) h += '<div class="callout red"><b>⚠ MISSABLE</b>' + esc(t.missableNote) + "</div>";
  if (DISAGREE[t.id]) h += '<div class="callout blue"><b>SOURCES DISAGREE — both versions shown</b>' + esc(DISAGREE[t.id]) + "</div>";
  h += '<div class="verify">Verification — time <b>' + esc(t.time) + "</b> · difficulty <b>" + "★".repeat(t.difficulty) + "☆".repeat(5 - t.difficulty) +
    "</b> · stage <b>" + t.stage + "</b> · chapter <b>" + esc(String(t.chapter)) + "</b> · sources <b>" +
    (t.sources || []).map(n => esc(SOURCES[n - 1].name)).join(", ") + "</b></div></div>";
  return h;
}

function renderGuide() {
  const sec = (kindList, title, note) => {
    const ts = TROPHIES.filter(t => kindList.indexOf(t.kind) !== -1).sort((a, b) => a.id - b.id);
    return '<div class="gsec"><h2>' + title + " (" + ts.length + ')</h2><p class="note">' + note + "</p>" +
      ts.map(guideBlock).join("") + "</div>";
  };
  document.getElementById("guideSections").innerHTML =
    sec(["story"], "1 · Story Missions", "The 12 story trophies, in chapter order. All unmissable on the main path — but do the Chapter 1 balcony meditation before Chapter 1 ends.") +
    sec(["collectible"], "2 · Collectibles", "Meditations, cards, WAiNK photos, vehicles and exploring Leonida. The missable trophy lives here.") +
    sec(["activity", "combat"], "3 · Challenges", "Activities, shooting ranges, races, and combat — heists, vaults, the wanted level and one-off attempts. Save before every one-off.") +
    sec(["side", "economy", "secret", "completion", "platinum"], "4 · Side Characters, Money & Secrets", "Stranger strands, money, secrets, the 100% gold and the platinum. This game has NO multiplayer or online trophies — 0 online — so there is no multiplayer section.");
}

function renderSourcesView() {
  document.getElementById("verifyStats").innerHTML =
    '<div><div class="stat">55</div><div class="statlabel">official trophies</div></div>' +
    '<div><div class="stat">1,350</div><div class="statlabel">trophy points (P 300 · G 90 · S 30 · B 15)</div></div>' +
    '<div><div class="stat">28</div><div class="statlabel">hidden trophies</div></div>' +
    '<div><div class="stat">0</div><div class="statlabel">online / multiplayer trophies</div></div>' +
    '<div><div class="stat">5</div><div class="statlabel">unconfirmed — no invented steps</div></div>' +
    '<div><div class="stat">9</div><div class="statlabel">sources read 20 Nov 2026</div></div>';
  document.getElementById("sourceMatrix").innerHTML = SOURCES.map((s, i) =>
    "<tr><td>" + (i + 1) + "</td><td><b>" + esc(s.name) + "</b><br><a href=\"" + s.url + "\">" + esc(s.url) + "</a></td><td>" + s.read + "</td><td class=\"num\">" + srcCiteCount(i + 1) + " / 55</td></tr>"
  ).join("");
}

const VIEWS = ["dashboard", "roadmap", "missable", "checklist", "guide", "sources"];
function currentView() {
  const h = (location.hash || "#dashboard").replace("#", "");
  return VIEWS.indexOf(h) !== -1 ? h : "dashboard";
}
function showView() {
  const v = currentView();
  VIEWS.forEach(name => {
    const el = document.getElementById("view-" + name);
    if (el) el.classList.toggle("hidden-view", name !== v);
  });
  document.querySelectorAll("nav.tabs a").forEach(a => a.classList.toggle("on", a.dataset.view === v));
  if (v === "roadmap") renderRoadmap();
  if (v === "missable") renderMissable();
  if (v === "checklist") renderChecklist();
  if (v === "guide") renderGuide();
  if (v === "sources") renderSourcesView();
}

function renderAll() {
  renderHeader(); renderAudit(); renderList(); renderDetail(); renderSourcesPanel();
  const v = currentView();
  if (v === "roadmap") renderRoadmap();
  if (v === "missable") renderMissable();
  if (v === "checklist") renderChecklist();
  if (v === "guide") renderGuide();
  if (v === "sources") renderSourcesView();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ app: "leonida-atlas-v3", earned: state.earned, counts: state.counts, checklist: state.checklist }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "leonida-atlas-progress.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function importProgress(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (d && Array.isArray(d.earned)) {
        state.earned = d.earned.filter(id => byId[id]);
        state.counts = d.counts || {};
        state.checklist = d.checklist || {};
        saveState(); renderAll();
      }
    } catch (e) { alert("That file is not a Leonida Atlas progress export."); }
  };
  r.readAsText(file);
}

function bindEvents() {
  document.addEventListener("click", ev => {
    const check = ev.target.closest("[data-check]");
    if (check) { toggleEarned(parseInt(check.dataset.check, 10)); return; }
    const rev = ev.target.closest("[data-reveal]");
    if (rev) {
      const id = parseInt(rev.dataset.reveal, 10);
      if (state.revealed.indexOf(id) === -1) state.revealed.push(id);
      saveState(); renderAll(); return;
    }
    const cnt = ev.target.closest("[data-count]");
    if (cnt) {
      const parts = cnt.dataset.count.split("|");
      bumpCount(parseInt(parts[0], 10), parseInt(parts[1], 10)); return;
    }
    const cc = ev.target.closest("[data-checkcount]");
    if (cc) {
      const parts = cc.dataset.checkcount.split("|");
      const row = CHECKLIST.find(r => r.key === parts[0]);
      if (row && typeof row.need === "number") {
        state.checklist[parts[0]] = Math.max(0, Math.min(row.need, (state.checklist[parts[0]] || 0) + parseInt(parts[1], 10)));
        saveState(); renderAll();
      }
      return;
    }
    const next = ev.target.closest("[data-next]");
    if (next) {
      const ids = TROPHIES.map(t => t.id);
      selectedId = ids[(ids.indexOf(selectedId) + 1) % ids.length];
      renderDetail(); renderList(); return;
    }
    const row = ev.target.closest("#trophyList li[data-id]");
    if (row) { selectedId = parseInt(row.dataset.id, 10); renderDetail(); renderList(); }
  });
  document.getElementById("spoilerToggle").addEventListener("click", () => {
    state.spoiler = !state.spoiler;
    saveState(); renderAll();
  });
  document.getElementById("exportBtn").addEventListener("click", exportProgress);
  document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
  document.getElementById("importFile").addEventListener("change", ev => {
    if (ev.target.files[0]) importProgress(ev.target.files[0]);
    ev.target.value = "";
  });
  document.getElementById("searchBox").addEventListener("input", ev => { filters.q = ev.target.value; renderList(); });
  ["gradeFilter", "kindFilter", "stateFilter", "diffFilter", "chapterFilter"].forEach(id => {
    document.getElementById(id).addEventListener("change", ev => {
      const key = { gradeFilter: "grade", kindFilter: "kind", stateFilter: "state", diffFilter: "diff", chapterFilter: "chapter" }[id];
      filters[key] = ev.target.value; renderList();
    });
  });
  window.addEventListener("hashchange", showView);
}

async function init() {
  state = loadState();
  const res = await fetch("data/trophies.json");
  const data = await res.json();
  TROPHIES = data.trophies;
  TROPHIES.forEach(t => { byId[t.id] = t; });
  bindEvents();
  renderAll();
  showView();
}
document.addEventListener("DOMContentLoaded", init);
