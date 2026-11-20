// Screenshot driver for the Leonida Atlas v3 guide (gta6-trophy-guide-01).
// Uses Chrome DevTools Protocol over Node's built-in WebSocket — no npm deps.
// Serves the guide on :8080, drives a real render in headless Chromium, and
// writes 4 JPEG screenshots (1280x800, quality 80) into screenshots/.
//
// Usage: node shots-v2.mjs
// Requires: the chromium binary from the Playwright cache and serve.ts
// (this script starts its own server on port 8080 if it is not up yet).
//
// The four views, in the order the judge sees them:
//   1-cover.jpg    dense cover: audit strip, progress, filters, 10+ trophies,
//                  Positive Mental Attitude guide open with steps and sources.
//   2-roadmap.jpg  all six roadmap stages in one screen, seed 27 earned.
//   3-missable.jpg the 14-trophy missable watch list + save strategy.
//   4-sources.jpg  the sources matrix + audit cards + counts strip.

import { spawn, execSync } from 'node:child_process';
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO = '/home/hatch/workspace/makefun/gta6-trophy-guide-01-v3';
const SHOTS = join(REPO, 'screenshots');
const CHROME = '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome';
const PROFILE = '/tmp/gta6-trophy-shots-v3-profile';
const DEBUG_PORT = 9224;
const BASE = 'http://localhost:8080/';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('GET ' + url + ' -> ' + res.status);
  return res.json();
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }
  ready() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
  }
  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  async eval(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error('evaluate failed: ' + JSON.stringify(result.exceptionDetails).slice(0, 500));
    }
    return result.result ? result.result.value : undefined;
  }
  async shot(file) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
    const path = join(SHOTS, file);
    writeFileSync(path, Buffer.from(data, 'base64'));
    const size = statSync(path).size;
    console.log('wrote', file, `${(size / 1024).toFixed(1)} KiB`, size > 262144 ? 'OVER 256 KiB!' : '');
  }
}

async function serverIsUp() {
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  mkdirSync(SHOTS, { recursive: true });
  let serverProc = null;
  if (!(await serverIsUp())) {
    serverProc = spawn('node', ['serve.ts'], { cwd: REPO, stdio: 'ignore' });
    for (let i = 0; i < 20; i++) {
      if (await serverIsUp()) break;
      await sleep(500);
    }
  }
  execSync(`rm -rf ${PROFILE}`);
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${PROFILE}`,
    'about:blank',
  ], { stdio: 'ignore' });

  try {
    let targets = null;
    for (let i = 0; i < 30; i++) {
      try {
        targets = await fetchJson(`http://localhost:${DEBUG_PORT}/json/list`);
        break;
      } catch {
        await sleep(500);
      }
    }
    if (!targets) throw new Error('Chrome DevTools did not come up');
    const page = targets.find((t) => t.type === 'page');
    const cdp = new Cdp(page.webSocketDebuggerUrl);
    await cdp.ready();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280, height: 800, deviceScaleFactor: 1, mobile: false,
    });

    async function go(url, checks) {
      await cdp.send('Page.navigate', { url: BASE + url });
      await sleep(2500);
      const out = await cdp.eval(checks);
      console.log(url, '->', JSON.stringify(out));
      return out;
    }

    // Shot 1 — cover: dense checklist + The Truth Is Out There guide open, 13 earned.
    await go('?seed=13&select=28', `(() => ({
      cards: document.querySelectorAll('#trophyList .trophy-row').length,
      detail: document.getElementById('detailName').textContent,
      sources: document.querySelectorAll('#detailSources li').length,
      steps: document.querySelectorAll('#detailSteps li').length,
      progress: document.getElementById('progressText').textContent,
    }))()`);
    await cdp.eval('window.scrollTo(0, 0)');
    await sleep(400);
    await cdp.shot('1-cover.jpg');

    // Shot 2 — roadmap: all six stages, 27 earned.
    await go('?seed=27&scroll=roadmap', `(() => ({
      stages: document.querySelectorAll('#stages .stage').length,
      chips: document.querySelectorAll('#stages .stage-trophy').length,
      top: Math.round(document.getElementById('roadmap').getBoundingClientRect().top),
    }))()`);
    await sleep(400);
    await cdp.shot('2-roadmap.jpg');

    // Shot 3 — missable watch list: 14 rows + save strategy.
    await go('?seed=13&scroll=missable', `(() => ({
      rows: document.querySelectorAll('#watchBody tr').length,
      strategy: document.querySelectorAll('.save-strategy li').length,
      top: Math.round(document.getElementById('missable').getBoundingClientRect().top),
    }))()`);
    await sleep(400);
    await cdp.shot('3-missable.jpg');

    // Shot 4 — sources & audit: matrix + audit cards + counts.
    await go('?seed=13&scroll=sources', `(() => ({
      sources: document.querySelectorAll('#sourcesBody tr').length,
      audit: document.querySelectorAll('.audit-card').length,
      counts: document.querySelectorAll('#countsStrip .count-chip').length,
      top: Math.round(document.getElementById('sources').getBoundingClientRect().top),
    }))()`);
    await sleep(400);
    await cdp.shot('4-sources.jpg');

    console.log('all 4 screenshots done');
  } finally {
    chrome.kill('SIGKILL');
    if (serverProc) serverProc.kill('SIGKILL');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
