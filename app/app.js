// Leonida Atlas — GTA VI trophy guide and tracker.
// Static, offline: loads data/trophies.json from its own folder, saves progress
// in localStorage, exports and imports that progress as a JSON file.

const STORAGE_KEY = 'leonida-atlas-progress-v1';
const TOTAL = 55;

const DEMO_EARNED_13 = [2, 3, 4, 5, 8, 15, 16, 18, 21, 35, 42, 46, 52];
const DEMO_EARNED_27 = DEMO_EARNED_13.concat([6, 9, 10, 11, 12, 13, 17, 19, 20, 28, 30, 31, 33, 36]);

const KIND_LABELS = {
  all: 'All kinds', story: 'Story', missable: 'Missable', collectible: 'Collectibles',
  activity: 'Activities', side: 'Side characters', combat: 'Combat & heists',
  economy: 'Money', secret: 'Secrets', completion: 'Completion',
};

const state = {
  data: null,
  earned: new Set(),
  counts: {},
  spoiler: false,
  kind: 'all',
  grade: 'all',
  show: 'all',
  query: '',
  selected: null,
  demoMode: false,
};

const $ = (id) => document.getElementById(id);

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatCount(n) {
  return Number(n).toLocaleString('en-US');
}

function trophyById(id) {
  return state.data.trophies.find((t) => t.id === id);
}

function isSpoilerHidden(trophy) {
  return state.spoiler && trophy.kind === 'story' && !state.earned.has(trophy.id);
}

function kindOf(trophy) {
  return trophy.kind;
}

function matchesFilters(trophy) {
  if (state.kind === 'missable') {
    if (!trophy.missable) return false;
  } else if (state.kind !== 'all' && kindOf(trophy) !== state.kind) {
    return false;
  }
  if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
  if (state.show === 'earned' && !state.earned.has(trophy.id)) return false;
  if (state.show === 'missing' && state.earned.has(trophy.id)) return false;
  if (state.query) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(state.query)) return false;
  }
  return true;
}

// ---------- persistence ----------

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.earned)) state.earned = new Set(saved.earned.filter((id) => Number.isInteger(id)));
    if (saved.counts && typeof saved.counts === 'object') state.counts = saved.counts;
    if (typeof saved.spoiler === 'boolean') state.spoiler = saved.spoiler;
  } catch {
    // A corrupt save is ignored; the tracker starts empty.
  }
}

function saveProgress() {
  if (state.demoMode) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      earned: [...state.earned].sort((a, b) => a - b),
      counts: state.counts,
      spoiler: state.spoiler,
    }));
    $('savedNote').textContent = 'Progress saved in this browser.';
  } catch {
    $('savedNote').textContent = 'Could not save progress in this browser.';
  }
}

function exportProgress() {
  const payload = {
    app: 'Leonida Atlas',
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...state.earned].sort((a, b) => a - b),
    counts: state.counts,
    spoiler: state.spoiler,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-atlas-progress.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (!Array.isArray(data.earned)) throw new Error('bad file');
      state.earned = new Set(data.earned.filter((id) => Number.isInteger(id) && trophyById(id)));
      state.counts = (data.counts && typeof data.counts === 'object') ? data.counts : {};
      if (typeof data.spoiler === 'boolean') state.spoiler = data.spoiler;
      saveProgress();
      syncControls();
      renderAll();
      $('savedNote').textContent = 'Progress imported.';
    } catch {
      $('savedNote').textContent = 'That file is not a Leonida Atlas export.';
    }
  };
  reader.readAsText(file);
}

function resetProgress() {
  if (!window.confirm('Clear all earned trophies and counts?')) return;
  state.earned = new Set();
  state.counts = {};
  saveProgress();
  renderAll();
}

// ---------- rendering ----------

function updateProgressBar() {
  const earned = state.earned.size;
  const pct = Math.round((earned / TOTAL) * 100);
  $('progressText').textContent = `${earned} of ${TOTAL} earned — ${pct}%`;
  $('progressDetail').textContent = earned === TOTAL
    ? 'Platinum: earned — Vice Got a Price!'
    : `Platinum: ${TOTAL - earned} to go`;
  $('progressFill').style.width = `${pct}%`;
  $('progressBar').setAttribute('aria-valuenow', String(earned));
}

function buildKindChips() {
  const box = $('kindChips');
  box.innerHTML = '';
  for (const [kind, label] of Object.entries(KIND_LABELS)) {
    const count = kind === 'all'
      ? TOTAL
      : kind === 'missable'
        ? state.data.trophies.filter((t) => t.missable).length
        : state.data.trophies.filter((t) => t.kind === kind).length;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'kind-chip';
    chip.setAttribute('aria-pressed', String(state.kind === kind));
    chip.dataset.kind = kind;
    chip.innerHTML = `${escapeHtml(label)} <span class="chip-count">${count}</span>`;
    chip.addEventListener('click', () => {
      state.kind = kind;
      buildKindChips();
      renderChecklist();
    });
    box.appendChild(chip);
  }
}

function renderRoadmap() {
  const list = $('stages');
  list.innerHTML = '';
  for (const stage of state.data.roadmap) {
    const li = document.createElement('li');
    li.className = 'stage';
    const chips = stage.trophies.map((id) => {
      const t = trophyById(id);
      const earned = state.earned.has(id);
      return `<button type="button" class="stage-trophy${earned ? ' earned' : ''}" data-trophy="${id}">${escapeHtml(t ? t.name : `#${id}`)}</button>`;
    }).join('');
    li.innerHTML = `<h3><span class="stage-num">Stage ${stage.stage}</span>${escapeHtml(stage.title)}</h3>`
      + `<p>${escapeHtml(stage.advice)}</p><div class="stage-trophies">${chips}</div>`;
    list.appendChild(li);
  }
  list.querySelectorAll('.stage-trophy').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectTrophy(Number(btn.dataset.trophy));
      $('tracker').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderChecklist() {
  const list = $('trophyList');
  const visible = state.data.trophies.filter(matchesFilters);
  $('listHeading').textContent = state.kind === 'missable'
    ? 'Checklist — missable & time-sensitive trophies'
    : state.kind === 'all'
      ? 'Checklist — 55 trophies'
      : `Checklist — ${KIND_LABELS[state.kind].toLowerCase()} trophies`;
  $('listCount').textContent = `Showing ${visible.length} of ${TOTAL} trophies · ${state.earned.size} earned`;
  list.innerHTML = '';
  for (const trophy of visible) {
    const earned = state.earned.has(trophy.id);
    const hidden = isSpoilerHidden(trophy);
    const li = document.createElement('li');
    li.className = `trophy-row${earned ? ' earned' : ''}${state.selected === trophy.id ? ' selected' : ''}`;
    li.dataset.trophy = String(trophy.id);
    const name = hidden ? 'Hidden story trophy' : trophy.name;
    const desc = hidden ? 'Earn this trophy to reveal its name and description.' : trophy.description;
    const tags = [`<span class="tag">${escapeHtml(trophy.kind)}</span>`];
    if (trophy.hidden) tags.push('<span class="tag hidden-tag">Hidden on PSN</span>');
    if (trophy.missable) tags.push('<span class="tag missable">Missable</span>');
    if (trophy.count) tags.push(`<span class="tag count-tag">0–${formatCount(trophy.count)}</span>`);
    li.innerHTML = `<input type="checkbox" ${earned ? 'checked' : ''} aria-label="Mark ${escapeHtml(name)} earned">`
      + `<div><div class="trophy-name">${escapeHtml(name)}</div>`
      + `<p class="trophy-desc">${escapeHtml(desc)}</p>`
      + `<div class="trophy-tags">${tags.join('')}</div></div>`
      + `<span class="grade-label"><span class="medal ${trophy.grade}"></span>${trophy.grade}</span>`;
    li.addEventListener('click', (event) => {
      if (event.target.tagName === 'INPUT') return;
      selectTrophy(trophy.id);
    });
    li.querySelector('input').addEventListener('change', (event) => {
      event.stopPropagation();
      toggleEarned(trophy.id, event.target.checked);
    });
    list.appendChild(li);
  }
  if (visible.length === 0) {
    list.innerHTML = '<li class="trophy-row"><div><div class="trophy-name">No trophies match</div><p class="trophy-desc">Try a different search or filter.</p></div></li>';
  }
}

function renderDetail() {
  const card = $('detailCard');
  const empty = $('detailEmpty');
  const trophy = state.selected ? trophyById(state.selected) : null;
  if (!trophy) {
    card.hidden = true;
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  card.hidden = false;
  const earned = state.earned.has(trophy.id);
  const hidden = isSpoilerHidden(trophy);
  $('detailMedal').className = `medal ${trophy.grade}`;
  $('detailGradeText').textContent = `${trophy.grade} · ${trophy.kind}`;
  $('detailName').textContent = hidden ? 'Hidden story trophy' : trophy.name;
  $('detailDesc').textContent = hidden ? 'Earn this trophy to reveal its name and description.' : trophy.description;
  const meta = [`Stage ${trophy.stage} of the roadmap`];
  if (trophy.hidden) meta.push('Hidden on PlayStation until earned');
  if (trophy.count) meta.push(`PSN tracks a count to ${formatCount(trophy.count)}`);
  $('detailMeta').textContent = meta.join(' · ');
  const missable = $('detailMissable');
  if (trophy.missable && trophy.missableNote) {
    missable.hidden = false;
    missable.textContent = `⚠ ${trophy.missableNote}`;
  } else {
    missable.hidden = true;
  }
  $('detailGuide').textContent = hidden ? 'The guide is hidden with the trophy — earn it to read how to get it.' : trophy.guide;
  const steps = $('detailSteps');
  steps.innerHTML = '';
  if (!hidden) {
    for (const step of trophy.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      steps.appendChild(li);
    }
  }
  const counter = $('detailCounter');
  if (trophy.count && !hidden) {
    counter.hidden = false;
    $('counterLabel').textContent = `Progress toward ${formatCount(trophy.count)}`;
    $('counterOf').textContent = `/ ${formatCount(trophy.count)}`;
    const input = $('counterInput');
    input.max = String(trophy.count);
    input.value = String(state.counts[trophy.id] ?? 0);
    input.onchange = () => setCounter(trophy.id, Number(input.value));
  } else {
    counter.hidden = true;
  }
  const sources = $('detailSources');
  sources.innerHTML = '';
  if (!hidden) {
    for (const source of trophy.sources) {
      const li = document.createElement('li');
      if (source.url) {
        const a = document.createElement('a');
        a.href = source.url;
        a.rel = 'noopener';
        a.textContent = source.name;
        li.appendChild(a);
      } else {
        li.textContent = source.name;
      }
      sources.appendChild(li);
    }
  } else {
    sources.innerHTML = '<li>Sources are hidden with the trophy.</li>';
  }
  const toggle = $('detailToggle');
  toggle.textContent = earned ? '✓ Earned — tap to undo' : 'Mark earned';
  toggle.classList.toggle('earned-state', earned);
  toggle.onclick = () => toggleEarned(trophy.id, !earned);
}

function renderAll() {
  updateProgressBar();
  renderRoadmap();
  renderChecklist();
  renderDetail();
}

// ---------- actions ----------

function toggleEarned(id, earned) {
  if (earned) state.earned.add(id); else state.earned.delete(id);
  saveProgress();
  renderAll();
}

function setCounter(id, value) {
  const trophy = trophyById(id);
  if (!trophy || !trophy.count) return;
  const clamped = Math.max(0, Math.min(trophy.count, Math.floor(value) || 0));
  state.counts[id] = clamped;
  saveProgress();
  renderDetail();
}

function setSpoilerMode(on) {
  state.spoiler = on;
  $('spoiler').checked = on;
  saveProgress();
  renderChecklist();
  renderDetail();
}

function selectTrophy(id) {
  state.selected = id;
  renderChecklist();
  renderDetail();
}

function syncControls() {
  $('spoiler').checked = state.spoiler;
  $('grade').value = state.grade;
  $('state').value = state.show;
  $('search').value = state.query;
  buildKindChips();
}

// ---------- demo params (screenshots only) ----------

function readDemoParams() {
  const params = new URLSearchParams(window.location.search);
  const seed = params.get('seed');
  if (seed === '13') {
    state.demoMode = true;
    state.earned = new Set(DEMO_EARNED_13);
  } else if (seed === '27') {
    state.demoMode = true;
    state.earned = new Set(DEMO_EARNED_27);
  }
  const select = params.get('select');
  if (select) state.selected = Number(select);
  if (params.get('spoiler') === 'on') state.spoiler = true;
  if (params.get('kind')) state.kind = params.get('kind');
  if (params.get('grade')) state.grade = params.get('grade');
  if (params.get('q')) state.query = params.get('q');
}

// Scroll to a section after the first render (screenshot views only).
function scrollToDemoSection() {
  const target = new URLSearchParams(window.location.search).get('scroll');
  if (!target) return;
  const el = document.getElementById(target);
  if (el) el.scrollIntoView();
}

// ---------- boot ----------

async function loadTrophyData() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error(`trophies.json: ${response.status}`);
  return response.json();
}

function bindControls() {
  $('search').addEventListener('input', (event) => {
    state.query = event.target.value.trim().toLowerCase();
    renderChecklist();
  });
  $('grade').addEventListener('change', (event) => {
    state.grade = event.target.value;
    renderChecklist();
  });
  $('state').addEventListener('change', (event) => {
    state.show = event.target.value;
    renderChecklist();
  });
  $('spoiler').addEventListener('change', (event) => setSpoilerMode(event.target.checked));
  $('exportBtn').addEventListener('click', exportProgress);
  $('importFile').addEventListener('change', (event) => {
    if (event.target.files && event.target.files[0]) importProgress(event.target.files[0]);
    event.target.value = '';
  });
  $('resetBtn').addEventListener('click', resetProgress);
  document.querySelectorAll('[data-filter-kind]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      state.kind = link.dataset.filterKind;
      buildKindChips();
      renderChecklist();
      $('tracker').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

async function bootTracker() {
  try {
    state.data = await loadTrophyData();
  } catch {
    $('trophyList').innerHTML = '<li class="trophy-row"><div><div class="trophy-name">Could not load the trophy list</div><p class="trophy-desc">data/trophies.json failed to load. Serve app/ over HTTP and reload.</p></div></li>';
    return;
  }
  readDemoParams();
  if (!state.demoMode) loadProgress();
  bindControls();
  syncControls();
  renderAll();
  scrollToDemoSection();
}

bootTracker();
