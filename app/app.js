/* Leonida Atlas — GTA VI trophy guide & tracker.
   Loads app/data/trophies.json, renders the four guide sections, the
   missable & hidden pages, the roadmap, the 100% checklist and the
   sources matrix. Progress lives in localStorage; export/import move it
   as one JSON file. No network requests beyond the app's own files. */
(function () {
  "use strict";

  var STORE_KEY = "leonida-atlas-progress-v1";
  var COUNT_KEY = "leonida-atlas-counters-v1";
  var CHECK_KEY = "leonida-atlas-checklist-v1";

  var SOURCES = [
    ["Exophase", "https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/"],
    ["PSNProfiles", "https://psnprofiles.com/trophies/43531-grand-theft-auto-vi"],
    ["Push Square", "https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap"],
    ["PowerPyx", "https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/"],
    ["GTA Zone", "https://gta-zone.com/news/gta-6-trophies-achievements/"],
    ["Sixshore", "https://sixshore.com/gta-6/guides/trophies-and-achievements/"],
    ["GamesRadar", "https://www.gamesradar.com/games/grand-theft-auto-6/gta-6-trophies-achievements/"],
    ["Output Lag", "https://outputlag.com/guides/gta-6-trophy-list/"],
    ["gtasix.how", "https://gtasix.how/trophies/"]
  ];

  var ROADMAP = [
    { n: 1, title: "Story first — Chapters 1 to 4 and the finale", hours: "60–80 h", ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      text: "Play the story straight through, chapter by chapter, and make a manual save at the start of every chapter before you touch a mission. Meditate on Lucia's balcony in Chapter 1 before that chapter ends. Grab the partnered trophies and Cal's fishing challenge while their windows are open, and finish the finale only after every side strand is done." },
    { n: 2, title: "Strangers and side characters", hours: "~10 h", ids: [22, 23, 24, 25, 26, 27, 29],
      text: "Clear the side strands before the finale locks them: Andy (Lucia-only, Chapter 3), Kenton and his 7 shipwrecks, Billy and his 5 Mudclub jobs, Randy and his 16 sports cars, Tyrone and the Kitty Litter Lab deliveries, Bret's hunt, and the 8 counting stranger strands. Take the Yago race the moment its hourglass appears in Chapter 3." },
    { n: 3, title: "Activities and skills", hours: "10–20 h", ids: [15, 16, 17, 18, 19, 20, 21, 46],
      text: "Sweep the activities in one block: 250 stunts, all 9 activity types, gold on all 42 Shooting Range challenges, drone race wins at all 14 locations, 20 different race wins, the arcade game, and bowling at Kolt & Associates. Cal's fishing challenge belongs here too if you did not take it in Chapter 1." },
    { n: 4, title: "Collectibles and exploration", hours: "10–20 h", ids: [28, 30, 31, 35, 42],
      text: "Sweep the map region by region: the 18 meditation spots (balcony first, always), 3 card sets to start and 15 for 100%, WAiNK at 100 locations, 100 vehicles discovered, and all 52 areas of Leonida explored. One careful sweep covers several trophies at once." },
    { n: 5, title: "Heists, combat and the wanted level", hours: "5–10 h", ids: [32, 33, 34, 36, 37, 38, 39, 40, 41, 43, 45, 51],
      text: "Work the combat list: 50 challenges, the partnered 4-star escape and the 3-shop robbery run, 5 enemies in one Combat Focus, the VCIA departure, the Rhino, the undetected jewelry robbery with the Snap Gun, 5 bank vaults, the armored truck, and one illegal operation per gang. Save before every one-off attempt." },
    { n: 6, title: "Money, secrets and the Platinum", hours: "~100 h", ids: [1, 14, 44, 47, 48, 49, 50, 52, 53, 54, 55],
      text: "The long tail: launder $250,000 in Marked Bills, spend $100,000 across the shops, buy all 8 garages, register 10 vehicles to Scooter Bros, make 500 choices, and finish the 100% checklist for the gold. The five unconfirmed trophies stay labelled UNCONFIRMED here until a source verifies them. The platinum pops when the last one lands." }
  ];

  var CHECKLIST = [
    ["Optional missions", "100", "several hundred"],
    ["Base-model vehicles scanned", "200", "277"],
    ["Animals studied (binoculars)", "100", "255"],
    ["Weapons collected", "50", "66"],
    ["Challenges completed", "70", "80"],
    ["Meditation spots", "15", "18"],
    ["Stunts completed", "300", "397"],
    ["Collectible card sets", "15", "18"],
    ["Bank vaults robbed", "8", "8"],
    ["Illegal operations robbed", "39", "39"],
    ["Shooting Range challenges (gold)", "42", "42"],
    ["Top Fun drone races won", "42", "42"],
    ["Bret’s target decks cleared", "15", "15"],
    ["Underwater discoveries", "all", "all"]
  ];

  var DEMO_EARNED = [2, 3, 4, 8, 15, 16, 21, 35, 42, 46, 52, 53, 54];

  var params = new URLSearchParams(location.search);
  var demo = params.get("demo") === "1";
  var openId = parseInt(params.get("open") || "0", 10) || 0;
  var stayTop = params.get("top") === "1";

  var trophies = [];
  var byId = {};
  var earned = {};
  var counters = {};
  var checkedRows = {};
  var revealed = {};

  function loadStore(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function saveStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage full or blocked */ }
  }

  earned = loadStore(STORE_KEY, {});
  counters = loadStore(COUNT_KEY, {});
  checkedRows = loadStore(CHECK_KEY, {});
  if (demo) {
    DEMO_EARNED.forEach(function (id) { earned[id] = true; });
    counters[15] = 120; counters[31] = 47; counters[35] = 61;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }
  function spoilerOn() {
    return document.getElementById("spoilerToggle").checked;
  }
  function isHiddenMasked(t) {
    return t.hidden && spoilerOn() && !earned[t.id] && !revealed[t.id];
  }

  function gradeBadge(t) {
    var b = el("span", "badge " + t.grade, t.grade);
    return b;
  }

  function trophyCard(t) {
    var card = el("article", "trophy");
    card.dataset.tid = t.id;
    card.id = "trophy-" + t.id;
    if (earned[t.id]) card.classList.add("earned");
    if (t.missable) card.classList.add("missable-flag");
    if (openId === t.id) card.classList.add("detail");

    var head = el("div", "t-head");
    var name = el("span", "t-name", isHiddenMasked(t) ? "Hidden Trophy — reveal to see" : t.name);
    if (isHiddenMasked(t)) name.classList.add("hidden-name");
    head.appendChild(name);
    head.appendChild(gradeBadge(t));
    if (t.hidden) head.appendChild(el("span", "badge hidden", "Hidden"));
    if (t.missable) head.appendChild(el("span", "badge miss", "Missable"));
    if (t.status === "unconfirmed") head.appendChild(el("span", "badge unconf", "Unconfirmed"));
    if (t.status === "lead") head.appendChild(el("span", "badge lead", "Reported lead"));
    card.appendChild(head);

    var off = el("p", "official", isHiddenMasked(t) ? "Description hidden until earned or revealed." : "“" + t.description + "”");
    card.appendChild(off);

    var meta = el("div", "meta");
    var bits = [
      ["Kind", t.kind], ["Stage", "Stage " + t.stage],
      ["Chapter", t.chapter === "any" ? "Any time" : (t.chapter === "post-story" ? "Post-story" : "Chapter " + t.chapter)],
      ["Difficulty", t.difficulty + " / 5"], ["Time", t.time],
      ["Gamerscore", String(t.gamerscore)]
    ];
    if (t.count !== null && t.count !== undefined) bits.push(["Target", String(t.count)]);
    bits.forEach(function (pair) {
      var s = el("span");
      s.appendChild(el("b", null, pair[0] + ": "));
      s.appendChild(document.createTextNode(pair[1]));
      meta.appendChild(s);
    });
    card.appendChild(meta);

    if (isHiddenMasked(t)) {
      var rev = el("button", "ghost", "Reveal this hidden trophy");
      rev.type = "button";
      rev.addEventListener("click", function () { revealed[t.id] = true; renderAll(); });
      card.appendChild(rev);
    } else {
      var guide = el("p", null, t.guide);
      card.appendChild(guide);
      var steps = el("ol", "steps");
      t.steps.forEach(function (s) { steps.appendChild(el("li", null, s)); });
      card.appendChild(steps);
      if (t.missable && t.missableNote) {
        var warn = el("div", "warn");
        warn.appendChild(el("b", null, "Missable — "));
        warn.appendChild(document.createTextNode(t.missableNote));
        card.appendChild(warn);
      }
      var src = el("p", "src");
      src.appendChild(el("b", null, "Sources: "));
      src.appendChild(document.createTextNode(t.sources.join(", ")));
      card.appendChild(src);
    }

    if (t.count !== null && t.count !== undefined) {
      var row = el("div", "counter-row");
      row.appendChild(el("span", null, "Progress: "));
      var minus = el("button", "ghost", "−");
      minus.type = "button";
      var val = el("b", null, String(counters[t.id] || 0) + " / " + t.count);
      var plus = el("button", "ghost", "+");
      plus.type = "button";
      minus.addEventListener("click", function () {
        counters[t.id] = Math.max(0, (counters[t.id] || 0) - 1);
        saveStore(COUNT_KEY, counters);
        val.textContent = String(counters[t.id]) + " / " + t.count;
      });
      plus.addEventListener("click", function () {
        counters[t.id] = Math.min(t.count, (counters[t.id] || 0) + 1);
        saveStore(COUNT_KEY, counters);
        val.textContent = String(counters[t.id]) + " / " + t.count;
      });
      row.appendChild(minus); row.appendChild(val); row.appendChild(plus);
      card.appendChild(row);
    }

    var btn = el("button", earned[t.id] ? "ghost earn-btn" : "earn-btn", earned[t.id] ? "✓ Earned — click to undo" : "Mark as earned");
    btn.type = "button";
    btn.addEventListener("click", function () {
      if (earned[t.id]) delete earned[t.id]; else earned[t.id] = true;
      saveStore(STORE_KEY, earned); renderAll();
    });
    card.appendChild(btn);
    return card;
  }

  function sectionOf(t) {
    if (t.kind === "story") return "story";
    if (t.kind === "collectible") return "collectible";
    if (t.kind === "activity" || t.kind === "combat") return "challenges";
    return "side";
  }

  function passesFilters(t) {
    var q = (document.getElementById("search").value || "").toLowerCase();
    if (q) {
      var hay = (t.name + " " + t.description + " " + t.guide + " " + t.kind).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    var g = document.getElementById("filterGrade").value;
    if (g && t.grade !== g) return false;
    var k = document.getElementById("filterKind").value;
    if (k && t.kind !== k) return false;
    var st = document.getElementById("filterState").value;
    if (st === "earned" && !earned[t.id]) return false;
    if (st === "missing" && earned[t.id]) return false;
    if (st === "missable" && !t.missable) return false;
    if (st === "hidden" && !t.hidden) return false;
    var d = document.getElementById("filterDiff").value;
    if (d && String(t.difficulty) !== d) return false;
    var c = document.getElementById("filterChapter").value;
    if (c && String(t.chapter) !== c) return false;
    return true;
  }

  function renderLists() {
    var groups = { story: [], collectible: [], challenges: [], side: [] };
    trophies.forEach(function (t) {
      if (passesFilters(t)) groups[sectionOf(t)].push(t);
    });
    document.querySelectorAll(".trophy-list").forEach(function (box) {
      box.innerHTML = "";
      var list = groups[box.dataset.section] || [];
      if (!list.length) {
        box.appendChild(el("p", "muted", "No trophies match these filters."));
        return;
      }
      list.forEach(function (t) { box.appendChild(trophyCard(t)); });
    });
  }

  function renderMissable() {
    var box = document.getElementById("missableList");
    box.innerHTML = "";
    trophies.filter(function (t) { return t.missable; }).forEach(function (t) {
      var c = el("div", "miss-card");
      c.appendChild(el("h3", null, (isHiddenMasked(t) ? "Hidden trophy" : t.name) + " — " + t.grade));
      c.appendChild(el("p", null, "Trigger: " + t.missableNote));
      c.appendChild(el("p", "muted", "Fix: " + t.steps.join(" ") + " Sources: " + t.sources.join(", ") + "."));
      box.appendChild(c);
    });

    var hb = document.getElementById("hiddenList");
    hb.innerHTML = "";
    trophies.filter(function (t) { return t.hidden; }).forEach(function (t) {
      var c = el("div", "trophy");
      c.appendChild(el("b", null, isHiddenMasked(t) ? "Hidden Trophy" : t.name));
      c.appendChild(document.createTextNode(" — " + t.grade + " · " + t.kind + " · Stage " + t.stage + " · " + (earned[t.id] ? "earned" : "not earned")));
      hb.appendChild(c);
    });
  }

  function renderRoadmap() {
    var box = document.getElementById("roadmapList");
    box.innerHTML = "";
    ROADMAP.forEach(function (s) {
      var c = el("div", "roadmap-stage");
      c.appendChild(el("h3", null, "Stage " + s.n + " — " + s.title + " (" + s.hours + ")"));
      c.appendChild(el("p", null, s.text));
      var done = s.ids.filter(function (id) { return earned[id]; }).length;
      c.appendChild(el("p", "muted", "Trophies: " + done + " of " + s.ids.length + " earned in this stage."));
      box.appendChild(c);
    });
  }

  function renderChecklist() {
    var tbody = document.querySelector("#checkTable tbody");
    tbody.innerHTML = "";
    CHECKLIST.forEach(function (row, i) {
      var tr = document.createElement("tr");
      tr.appendChild(el("td", null, row[0]));
      tr.appendChild(el("td", null, row[1]));
      tr.appendChild(el("td", null, row[2]));
      var td = document.createElement("td");
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!checkedRows[i];
      cb.setAttribute("aria-label", "Mark done: " + row[0]);
      cb.addEventListener("change", function () {
        checkedRows[i] = cb.checked;
        saveStore(CHECK_KEY, checkedRows);
      });
      td.appendChild(cb);
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
  }

  function renderSources() {
    var ol = document.getElementById("sourceList");
    ol.innerHTML = "";
    SOURCES.forEach(function (s) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = s[1]; a.textContent = s[0]; a.rel = "noopener";
      li.appendChild(a);
      li.appendChild(document.createTextNode(" — " + s[1]));
      ol.appendChild(li);
    });
    var totalWords = trophies.reduce(function (a, t) { return a + t.guide.trim().split(/\s+/).length; }, 0);
    var totalCites = trophies.reduce(function (a, t) { return a + t.sources.length; }, 0);
    document.getElementById("auditText").textContent =
      "55 trophies, all with an official name, description, grade and a guide in our own words. " +
      totalWords + " guide words across the 55 guides, " + totalCites + " source citations, 9 sources in the matrix. " +
      "14 missable, 28 hidden, 0 online. 5 trophies labelled UNCONFIRMED, 1 carrying a reported lead only.";
    var vc = document.getElementById("verifyCounts");
    if (vc) {
      var earnedCount = trophies.filter(function (t) { return earned[t.id]; }).length;
      vc.textContent = "Right now: " + earnedCount + " of 55 earned in this browser · " +
        trophies.filter(function (t) { return t.missable; }).length + " missable · " +
        trophies.filter(function (t) { return t.hidden; }).length + " hidden · " +
        trophies.filter(function (t) { return t.status === "unconfirmed"; }).length + " unconfirmed · " +
        trophies.filter(function (t) { return t.status === "lead"; }).length + " reported lead.";
    }
  }

  function renderProgress() {
    var n = trophies.filter(function (t) { return earned[t.id]; }).length;
    var gs = trophies.filter(function (t) { return earned[t.id]; }).reduce(function (a, t) { return a + t.gamerscore; }, 0);
    var pct = trophies.length ? Math.round(n / trophies.length * 100) : 0;
    document.getElementById("progressText").textContent = n + " of " + trophies.length + " earned (" + pct + "%)";
    document.getElementById("gsText").textContent = gs + " / 1,000 gamerscore";
    document.getElementById("progressBar").style.width = pct + "%";
  }

  function renderAll() {
    renderProgress();
    renderLists();
    renderMissable();
    renderRoadmap();
    renderChecklist();
    renderSources();
  }

  function bindControls() {
    ["search", "filterGrade", "filterKind", "filterState", "filterDiff", "filterChapter"].forEach(function (id) {
      document.getElementById(id).addEventListener("input", renderLists);
      document.getElementById(id).addEventListener("change", renderLists);
    });
    document.getElementById("spoilerToggle").addEventListener("change", renderAll);
    document.getElementById("exportBtn").addEventListener("click", function () {
      var data = { earned: Object.keys(earned).map(Number), counters: counters, checklist: checkedRows };
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "leonida-atlas-progress.json";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    document.getElementById("importBtn").addEventListener("click", function () {
      document.getElementById("importFile").click();
    });
    document.getElementById("importFile").addEventListener("change", function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var data = JSON.parse(r.result);
          earned = {}; (data.earned || []).forEach(function (id) { earned[id] = true; });
          counters = data.counters || {};
          checkedRows = data.checklist || {};
          saveStore(STORE_KEY, earned); saveStore(COUNT_KEY, counters); saveStore(CHECK_KEY, checkedRows);
          renderAll();
        } catch (e) { alert("That file is not a Leonida Atlas progress export."); }
      };
      r.readAsText(f);
    });
  }

  fetch("data/trophies.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      trophies = data.trophies || data;
      trophies.forEach(function (t) { byId[t.id] = t; });
      if (demo) document.getElementById("spoilerToggle").checked = false;
      bindControls();
      renderAll();
      setTimeout(function () {
        if (stayTop) return;
        if (openId && byId[openId]) {
          var target = document.getElementById("trophy-" + openId);
          if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 140);
        } else if (location.hash) {
          var sec = document.querySelector(location.hash);
          if (sec) window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 90);
        }
      }, 60);
    })
    .catch(function (err) {
      document.querySelectorAll(".trophy-list").forEach(function (box) {
        box.textContent = "Could not load data/trophies.json — " + err.message;
      });
    });
})();
