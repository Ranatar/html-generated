"use strict";
const A = "assets/";
let META,
  COUNTRIES = {},
  ENV = {},
  RANK = {};
let W,
  H,
  layer = "sim";
const idbuf = { sim: null, real: null };
let S = 1,
  ox = 0,
  oy = 0,
  selected = null,
  hlSet = new Set();
let IMP = [],
  IMP_LINES = [],
  BORDERS = null,
  BORDERS0 = null;
let mode = "base";
const PACKS = {};
let DIFFMAX = 0,
  MAPSIM = "map_sim.png",
  MAPDIFF = "map_diff.png",
  TMAX = 1;
const opts = {
  nat: true,
  int: false,
  hl: true,
  env: false,
  real: false,
  imp: false,
  impRef: "sim",
  changed: false,
};
const ENVcache = {};

let arrival = null,
  baseColor = null,
  order = null,
  cumInc = null,
  totalPix = null,
  totalLand = 0;
let animData = null,
  grayTemplate = null,
  pos = 0,
  seekVal = 0,
  playing = false,
  revealed = null,
  rafid = 0,
  lastT = 0,
  lastBatch = [];
const DURATION = 14;

const $ = (s) => document.querySelector(s);
const base = $("#base"),
  overlay = $("#overlay"),
  anim = $("#anim"),
  fx = $("#fx"),
  vec = $("#vec");
const viewport = $("#viewport"),
  world = $("#world");

function loadImage(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}
async function imgData(url) {
  const img = await loadImage(url);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const cx = c.getContext("2d", { willReadFrequently: true });
  cx.drawImage(img, 0, 0, W, H);
  return cx.getImageData(0, 0, W, H).data;
}
const fmt = (n) => Math.round(n).toLocaleString("ru-RU");

async function init() {
  META = await (await fetch(A + "meta.json")).json();
  ENV = await (await fetch(A + "envelopes.json")).json();
  IMP = await (await fetch(A + "imposedness.json")).json();
  IMP_LINES = await (await fetch(A + "imp_lines.json")).json();
  BORDERS = await (await fetch(A + "borders.json")).json();
  BORDERS0 = { nat_sim: BORDERS.nat_sim, adm_sim: BORDERS.adm_sim };
  W = META.W;
  H = META.H;
  world.style.width = W + "px";
  world.style.height = H + "px";
  for (const el of [overlay, anim, fx]) {
    el.width = W;
    el.height = H;
  }
  base.width = W;
  base.height = H;
  sizeVec();
  idbuf.real = decodeIds(await imgData(A + "ids_real.png"));
  PACKS.base = await buildPack("base");
  mode = "base";
  applyPack(PACKS.base);
  updateDiffLegend();
  setLayerImages();
  fitView();
  bindUI();
  buildAbout();
}
async function buildPack(m) {
  const sfx = m === "absorb" ? "2" : "";
  const C = await (await fetch(A + "countries" + sfx + ".json")).json();
  const Rk = await (await fetch(A + "rankings" + sfx + ".json")).json();
  let ns = BORDERS0.nat_sim,
    ad = BORDERS0.adm_sim;
  if (m === "absorb") {
    const B2 = await (await fetch(A + "borders2.json")).json();
    ns = B2.nat_sim;
    ad = B2.adm_sim;
  }
  const ids = decodeIds(await imgData(A + "ids_sim" + sfx + ".png"));
  const bc = await imgData(A + "map_sim" + sfx + ".png");
  const da = await imgData(A + "arrival_sim" + sfx + ".png");
  const an = buildAnimStructures(da, ids);
  return {
    COUNTRIES: C,
    RANK: Rk,
    idsim: ids,
    baseColor: bc,
    nat_sim: ns,
    adm_sim: ad,
    tmax: m === "absorb" ? META.tmax2 : META.tmax,
    diff_max: m === "absorb" ? META.diff_max2 : META.diff_max,
    mapsim: "map_sim" + sfx + ".png",
    mapdiff: "map_diff" + sfx + ".png",
    anim: an,
  };
}
function applyPack(pk) {
  COUNTRIES = pk.COUNTRIES;
  RANK = pk.RANK;
  idbuf.sim = pk.idsim;
  baseColor = pk.baseColor;
  BORDERS.nat_sim = pk.nat_sim;
  BORDERS.adm_sim = pk.adm_sim;
  DIFFMAX = pk.diff_max;
  TMAX = pk.tmax;
  MAPSIM = pk.mapsim;
  MAPDIFF = pk.mapdiff;
  arrival = pk.anim.arrival;
  cumInc = pk.anim.cumInc;
  totalLand = pk.anim.totalLand;
  order = pk.anim.order;
  totalPix = pk.anim.totalPix;
  grayTemplate = pk.anim.grayTemplate;
  revealed = new Int32Array(totalPix.length);
  animData = anim.getContext("2d").createImageData(W, H);
  pos = 0;
  lastBatch = [];
  for (const k in ENVcache) delete ENVcache[k];
}
function updateDiffLegend() {
  const e = $("#diffnum");
  if (e) e.textContent = "±" + (DIFFMAX / 1e6).toFixed(1) + " млн км²";
}
async function setMode(m) {
  if (m === mode || !["base", "absorb"].includes(m)) return;
  if (playing) stop();
  seekVal = 0;
  if (!PACKS[m]) PACKS[m] = await buildPack(m);
  mode = m;
  applyPack(PACKS[m]);
  updateDiffLegend();
  setLayerImages();
  if (selected != null) hlSet = new Set([selected]);
  redraw();
  drawChanged();
  drawVec();
  updateCounter();
  showInfo(selected == null ? -1 : selected);
}
function decodeIds(d) {
  const o = new Int32Array(W * H);
  for (let i = 0, p = 0; i < W * H; i++, p += 4)
    o[i] = d[p + 3] === 0 ? -1 : (d[p] << 8) | d[p + 1];
  return o;
}

function buildAnimStructures(d, idsim) {
  const arr = new Int32Array(W * H);
  const hist = new Int32Array(65536);
  let tl = 0;
  for (let i = 0, p = 0; i < W * H; i++, p += 4) {
    if (d[p + 3] === 0) {
      arr[i] = -1;
    } else {
      const q = (d[p] << 8) | d[p + 1];
      arr[i] = q;
      hist[q]++;
      tl++;
    }
  }
  const ci = new Int32Array(65536);
  let c = 0;
  for (let q = 0; q < 65536; q++) {
    c += hist[q];
    ci[q] = c;
  }
  const off = new Int32Array(65536);
  let r = 0;
  for (let q = 0; q < 65536; q++) {
    off[q] = r;
    r += hist[q];
  }
  const ord = new Int32Array(tl);
  for (let i = 0; i < W * H; i++) {
    const q = arr[i];
    if (q >= 0) ord[off[q]++] = i;
  }
  let maxid = 0;
  for (let i = 0; i < W * H; i++) {
    const v = idsim[i];
    if (v > maxid) maxid = v;
  }
  const tp = new Int32Array(maxid + 1);
  for (let i = 0; i < W * H; i++) {
    const v = idsim[i];
    if (v >= 0) tp[v]++;
  }
  const gt = new Uint8ClampedArray(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    if (arr[i] >= 0) {
      const p = i * 4;
      gt[p] = 32;
      gt[p + 1] = 37;
      gt[p + 2] = 45;
      gt[p + 3] = 255;
    }
  }
  return {
    arrival: arr,
    cumInc: ci,
    totalLand: tl,
    order: ord,
    totalPix: tp,
    grayTemplate: gt,
  };
}

function setLayerImages() {
  base.src =
    A +
    (layer === "real" ? "map_real.png" : layer === "diff" ? MAPDIFF : MAPSIM);
  $("#difflegend").classList.toggle("hidden", layer !== "diff");
  setView();
}
function animActive() {
  return playing || (seekVal > 0.5 && seekVal < 65534.5);
}
function setView() {
  const av = animActive();
  anim.style.display = av ? "block" : "none";
  base.style.display = av ? "none" : "block";
  overlay.style.display = av ? "none" : "block";
  fx.style.display = av ? "none" : "block";
  drawVec();
}

function fitView() {
  const vw = viewport.clientWidth,
    vh = viewport.clientHeight;
  S = Math.min(vw / W, vh / H);
  ox = (vw - W * S) / 2;
  oy = (vh - H * S) / 2;
  applyTransform();
}
function applyTransform() {
  world.style.transform = `translate(${ox}px,${oy}px) scale(${S})`;
  drawVec();
}
function toImage(vx, vy) {
  return [Math.floor((vx - ox) / S), Math.floor((vy - oy) / S)];
}
function currentIds() {
  return idbuf[layer === "diff" ? "sim" : layer];
}
function idAt(vx, vy) {
  const a = toImage(vx, vy);
  const x = a[0],
    y = a[1];
  if (x < 0 || y < 0 || x >= W || y >= H) return -1;
  const b = currentIds();
  return b ? b[y * W + x] : -1;
}

function convexHull(pts) {
  pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const n = pts.length;
  if (n < 3) return pts;
  const cr = (o, a, b) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [];
  for (const p of pts) {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0)
      lo.pop();
    lo.push(p);
  }
  const hi = [];
  for (let i = n - 1; i >= 0; i--) {
    const p = pts[i];
    while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0)
      hi.pop();
    hi.push(p);
  }
  lo.pop();
  hi.pop();
  return lo.concat(hi);
}
function expandPoly(poly, d) {
  let cx = 0,
    cy = 0;
  for (const p of poly) {
    cx += p[0];
    cy += p[1];
  }
  cx /= poly.length;
  cy /= poly.length;
  return poly.map(([x, y]) => {
    const dx = x - cx,
      dy = y - cy,
      L = Math.hypot(dx, dy) || 1;
    return [x + (dx / L) * d, y + (dy / L) * d];
  });
}
function chaikin(poly, it) {
  let P = poly;
  for (let k = 0; k < it; k++) {
    const Q = [],
      n = P.length;
    for (let i = 0; i < n; i++) {
      const a = P[i],
        b = P[(i + 1) % n];
      Q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]);
      Q.push([0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    }
    P = Q;
  }
  return P;
}
function envelopeFor(id) {
  const eff0 = layer === "diff" ? "sim" : layer;
  const key = eff0 + ":" + id;
  if (ENVcache[key] !== undefined) return ENVcache[key];
  let poly = null;
  const eff = layer === "diff" ? "sim" : layer;
  if (eff === "sim" && mode === "base" && ENV[id]) poly = ENV[id];
  else {
    const b = idbuf[eff];
    const pts = [];
    for (let y = 0; y < H; y++) {
      let lo = -1,
        hi = -1;
      const bb = y * W;
      for (let x = 0; x < W; x++) {
        if (b[bb + x] === id) {
          if (lo < 0) lo = x;
          hi = x;
        }
      }
      if (lo >= 0) {
        pts.push([lo, y]);
        pts.push([hi, y]);
      }
    }
    if (pts.length >= 3) {
      let h = convexHull(pts);
      h = expandPoly(h, 4);
      h = chaikin(h, 2);
      poly = h;
    }
  }
  ENVcache[key] = poly;
  return poly;
}

function impColor(n) {
  const t = Math.max(0, Math.min(1, n / 2.2));
  return "hsl(" + Math.round(200 * (1 - t)) + ",80%,55%)";
}
function sizeVec() {
  vec.width = viewport.clientWidth;
  vec.height = viewport.clientHeight;
}
function strokeVec(cx, polys) {
  cx.beginPath();
  for (const pl of polys) {
    if (!pl.length) continue;
    cx.moveTo(pl[0][0], pl[0][1]);
    for (let k = 1; k < pl.length; k++) cx.lineTo(pl[k][0], pl[k][1]);
  }
  cx.stroke();
}
function vecLayers(cx, lw) {
  cx.lineJoin = "round";
  cx.lineCap = "round";
  const eff = layer === "real" ? "real" : "sim",
    av = animActive();
  cx.lineWidth = lw;
  cx.strokeStyle = "rgba(150,160,173,0.92)";
  strokeVec(cx, BORDERS.coast);
  if (!av && opts.int) {
    cx.lineWidth = lw * 0.85;
    cx.strokeStyle = "rgba(206,216,232,0.22)";
    strokeVec(cx, eff === "real" ? BORDERS.adm_real : BORDERS.adm_sim);
  }
  if (!av && opts.nat) {
    cx.lineWidth = lw * 1.25;
    cx.strokeStyle = "rgba(8,11,16,0.85)";
    strokeVec(cx, eff === "real" ? BORDERS.nat_real : BORDERS.nat_sim);
  }
  if (!av && opts.env && selected != null) {
    const poly = envelopeFor(selected);
    if (poly) {
      cx.beginPath();
      cx.moveTo(poly[0][0], poly[0][1]);
      for (let k = 1; k < poly.length; k++) cx.lineTo(poly[k][0], poly[k][1]);
      cx.closePath();
      cx.lineWidth = lw * 2.4;
      cx.strokeStyle = "#0c1116";
      cx.stroke();
      cx.lineWidth = lw * 1.4;
      cx.strokeStyle = "#fff";
      cx.stroke();
    }
  }
  if (!av && opts.imp) {
    cx.lineWidth = lw * 1.7;
    cx.strokeStyle = "#0c1116";
    strokeVec(
      cx,
      IMP_LINES.map((L) => L.p),
    );
    cx.lineWidth = lw * 1.05;
    for (const L of IMP_LINES) {
      const p = L.p,
        arr = opts.impRef === "vor" ? L.v : L.s;
      for (let k = 0; k < p.length - 1; k++) {
        const n = (arr[k] + arr[k + 1]) / 2;
        cx.strokeStyle = impColor(n);
        cx.beginPath();
        cx.moveTo(p[k][0], p[k][1]);
        cx.lineTo(p[k + 1][0], p[k + 1][1]);
        cx.stroke();
      }
    }
  }
}
function drawVec() {
  if (!BORDERS || !vec.width) return;
  const cx = vec.getContext("2d");
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.clearRect(0, 0, vec.width, vec.height);
  cx.setTransform(S, 0, 0, S, ox, oy);
  vecLayers(cx, Math.max(0.35, 1.1 / S));
  cx.setTransform(1, 0, 0, 1, 0, 0);
}
function drawChanged() {
  const cx = fx.getContext("2d");
  cx.clearRect(0, 0, W, H);
  if (!(opts.changed && layer === "diff")) return;
  const s = idbuf.sim,
    r = idbuf.real;
  const img = cx.createImageData(W, H),
    d = img.data;
  for (let i = 0, p = 0; i < W * H; i++, p += 4) {
    if (s[i] >= 0 && s[i] === r[i]) {
      d[p] = 42;
      d[p + 1] = 47;
      d[p + 2] = 55;
      d[p + 3] = 255;
    }
  }
  cx.putImageData(img, 0, 0);
}
function exportPNG() {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const cx = c.getContext("2d");
  const av = animActive();
  if (av) {
    cx.drawImage(anim, 0, 0);
  } else if (base.complete) {
    cx.drawImage(base, 0, 0);
  }
  if (!av) {
    cx.drawImage(fx, 0, 0);
    cx.drawImage(overlay, 0, 0);
  }
  vecLayers(cx, 1.4);
  const link = document.createElement("a");
  link.download = "coalescent_map.png";
  link.href = c.toDataURL("image/png");
  link.click();
}
function redraw() {
  const cx = overlay.getContext("2d");
  cx.clearRect(0, 0, W, H);
  const drawHl = opts.hl && hlSet.size,
    drawReal = opts.real && selected != null;
  if (drawHl || drawReal) {
    const bh = currentIds(),
      br = idbuf.real;
    const img = cx.createImageData(W, H);
    const d = img.data;
    if (drawHl) {
      for (let i = 0, p = 0; i < W * H; i++, p += 4) {
        if (hlSet.has(bh[i])) {
          d[p] = 255;
          d[p + 1] = 255;
          d[p + 2] = 255;
          d[p + 3] = 110;
        }
      }
    }
    if (drawReal) {
      const set = (i) => {
        const p = i * 4;
        d[p] = 43;
        d[p + 1] = 212;
        d[p + 2] = 255;
        d[p + 3] = 255;
      };
      for (let y = 0; y < H; y++) {
        const row = y * W;
        for (let x = 0; x < W; x++) {
          const i = row + x;
          if (br[i] === selected) {
            const up = y > 0 ? br[i - W] : -1,
              dn = y < H - 1 ? br[i + W] : -1,
              lf = x > 0 ? br[i - 1] : -1,
              rt = x < W - 1 ? br[i + 1] : -1;
            if (
              up !== selected ||
              dn !== selected ||
              lf !== selected ||
              rt !== selected
            ) {
              set(i);
              if (x < W - 1) set(i + 1);
              if (y < H - 1) set(i + W);
            }
          }
        }
      }
    }
    cx.putImageData(img, 0, 0);
  }
}

function showInfo(id) {
  const box = $("#info-body");
  if (id < 0 || !COUNTRIES[id]) {
    box.innerHTML = '<span class="muted">Океан</span>';
    return;
  }
  const c = COUNTRIES[id];
  const d = c.delta,
    dc = d >= 0 ? "delta-pos" : "delta-neg",
    sign = d >= 0 ? "+" : "";
  const env =
    layer === "sim" && mode === "base" && ENV[id]
      ? "огибающая (без моря) готова"
      : "огибающая строится по запросу";
  box.innerHTML =
    `<div class="name">${c.ru}</div>` +
    `<div class="row">${c.en} · ${c.a3} · слой: ${{ sim: "симуляция", real: "реальная", diff: "разница" }[layer]}</div>` +
    `<div class="area"><span>реальная площадь</span><b>${fmt(c.ar_real)} км²</b></div>` +
    `<div class="area"><span>в модели</span><b>${fmt(c.ar_model)} км²</b></div>` +
    `<div class="area"><span>разница</span><b class="${dc}">${sign}${fmt(d)} км²</b></div>` +
    (c.div != null
      ? `<div class="area"><span>расхождение границ</span><b>${c.div}</b></div>`
      : "") +
    `<div class="row" style="margin-top:6px">${env}</div>`;
}

function clearAnim() {
  animData.data.set(grayTemplate);
  pos = 0;
  revealed.fill(0);
  lastBatch = [];
}
function revealTo(target) {
  if (target < pos) {
    clearAnim();
  }
  const d = animData.data,
    bc = baseColor,
    ids = idbuf.sim;
  for (const i of lastBatch) {
    const p = i * 4;
    d[p] = bc[p];
    d[p + 1] = bc[p + 1];
    d[p + 2] = bc[p + 2];
  }
  while (pos < target) {
    const i = order[pos],
      p = i * 4;
    d[p] = bc[p];
    d[p + 1] = bc[p + 1];
    d[p + 2] = bc[p + 2];
    d[p + 3] = 255;
    const cid = ids[i];
    if (cid >= 0) revealed[cid]++;
    pos++;
  }
  const glowN = Math.max(1, Math.round(totalLand * 0.012));
  const nb = [];
  for (let k = pos - glowN; k < pos; k++) {
    if (k < 0) continue;
    const i = order[k],
      p = i * 4;
    d[p] = bc[p] * 0.4 + 150;
    d[p + 1] = bc[p + 1] * 0.4 + 150;
    d[p + 2] = bc[p + 2] * 0.4 + 150;
    nb.push(i);
  }
  lastBatch = nb;
  anim.getContext("2d").putImageData(animData, 0, 0);
}
function updateCounter() {
  const el = $("#counter");
  if (selected != null && COUNTRIES[selected] && totalPix[selected]) {
    const frac = revealed[selected] / totalPix[selected];
    const km = COUNTRIES[selected].ar_model * frac;
    el.innerHTML = `${COUNTRIES[selected].ru}: <b>${fmt(km)}</b> км² (${Math.round(frac * 100)}%)`;
  } else {
    el.textContent = `захвачено суши: ${Math.round((pos / totalLand) * 100)}%`;
  }
}
function seekToValue(v) {
  seekVal = v;
  $("#seek").value = v;
  const f = Math.max(0, Math.min(1, v / 65535));
  $("#tlabel").textContent = Math.round(f * 100) + "%";
  revealTo(Math.round(f * totalLand));
  updateCounter();
  setView();
}
function frame(ts) {
  if (!playing) return;
  if (!lastT) lastT = ts;
  const dt = (ts - lastT) / 1000;
  lastT = ts;
  const spd = parseFloat($("#speed").value);
  seekVal += (65535 / DURATION) * spd * dt;
  if (seekVal >= 65535) {
    seekToValue(65535);
    stop();
    return;
  }
  seekToValue(seekVal);
  rafid = requestAnimationFrame(frame);
}
function play() {
  if (seekVal >= 65535) {
    seekVal = 0;
  }
  if (pos === 0) clearAnim();
  playing = true;
  lastT = 0;
  $("#play").textContent = "⏸";
  setView();
  rafid = requestAnimationFrame(frame);
}
function stop() {
  playing = false;
  $("#play").textContent = "▶";
  cancelAnimationFrame(rafid);
  setView();
}

function bindUI() {
  document
    .querySelectorAll("input[name=mode]")
    .forEach((r) =>
      r.addEventListener("change", (e) => setMode(e.target.value)),
    );
  document.querySelectorAll("input[name=layer]").forEach((rdo) =>
    rdo.addEventListener("change", (e) => {
      layer = e.target.value;
      setLayerImages();
      redraw();
      drawChanged();
      showInfo(selected == null ? -1 : selected);
    }),
  );
  $("#opt-imp").addEventListener("change", (e) => {
    opts.imp = e.target.checked;
    $("#implegend").classList.toggle("on", opts.imp);
    drawVec();
  });
  document.querySelectorAll("input[name=impref]").forEach((r) =>
    r.addEventListener("change", (e) => {
      opts.impRef = e.target.value;
      drawVec();
    }),
  );
  $("#opt-changed").addEventListener("change", (e) => {
    opts.changed = e.target.checked;
    drawChanged();
  });
  $("#snap").addEventListener("click", exportPNG);
  $("#opt-nat").addEventListener("change", (e) => {
    opts.nat = e.target.checked;
    drawVec();
  });
  $("#opt-int").addEventListener("change", (e) => {
    opts.int = e.target.checked;
    drawVec();
  });
  $("#opt-hl").addEventListener("change", (e) => {
    opts.hl = e.target.checked;
    redraw();
  });
  $("#opt-env").addEventListener("change", (e) => {
    opts.env = e.target.checked;
    drawVec();
  });
  $("#opt-real").addEventListener("change", (e) => {
    opts.real = e.target.checked;
    redraw();
  });
  $("#reset").addEventListener("click", () => {
    selected = null;
    hlSet.clear();
    redraw();
    drawVec();
    showInfo(-1);
    updateCounter();
  });

  $("#play").addEventListener("click", () => {
    playing ? stop() : play();
  });
  $("#seek").addEventListener("input", (e) => {
    if (playing) stop();
    seekToValue(parseFloat(e.target.value));
  });

  $("#btn-about").addEventListener("click", () =>
    $("#modal-about").classList.remove("hidden"),
  );
  $("#btn-rank").addEventListener("click", () => {
    showRank("delta");
    $("#modal-rank").classList.remove("hidden");
  });
  document
    .querySelectorAll("[data-close]")
    .forEach((b) =>
      b.addEventListener("click", (e) =>
        e.target.closest(".modal").classList.add("hidden"),
      ),
    );
  document.querySelectorAll(".modal").forEach((m) =>
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.add("hidden");
    }),
  );
  document.querySelectorAll(".tab").forEach((t) =>
    t.addEventListener("click", (e) => {
      document
        .querySelectorAll(".tab")
        .forEach((x) => x.classList.remove("active"));
      e.target.classList.add("active");
      showRank(e.target.dataset.tab);
    }),
  );

  let dragging = false,
    moved = false,
    sx = 0,
    sy = 0,
    sox = 0,
    soy = 0;
  viewport.addEventListener("mousedown", (e) => {
    dragging = true;
    moved = false;
    sx = e.clientX;
    sy = e.clientY;
    sox = ox;
    soy = oy;
    viewport.classList.add("drag");
  });
  window.addEventListener("mousemove", (e) => {
    const r = viewport.getBoundingClientRect();
    if (dragging) {
      const dx = e.clientX - sx,
        dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      ox = sox + dx;
      oy = soy + dy;
      applyTransform();
    } else {
      const id = idAt(e.clientX - r.left, e.clientY - r.top);
      $("#hover").textContent =
        id >= 0 && COUNTRIES[id] ? COUNTRIES[id].ru : "—";
    }
  });
  window.addEventListener("mouseup", (e) => {
    if (dragging && !moved) {
      const r = viewport.getBoundingClientRect();
      const id = idAt(e.clientX - r.left, e.clientY - r.top);
      selected = id < 0 ? null : id;
      hlSet = selected != null ? new Set([selected]) : new Set();
      redraw();
      drawVec();
      showInfo(id);
      updateCounter();
    }
    dragging = false;
    viewport.classList.remove("drag");
  });
  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const r = viewport.getBoundingClientRect();
      const vx = e.clientX - r.left,
        vy = e.clientY - r.top;
      const f = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const nS = Math.max(0.1, Math.min(20, S * f));
      ox = vx - (vx - ox) * (nS / S);
      oy = vy - (vy - oy) * (nS / S);
      S = nS;
      applyTransform();
    },
    { passive: false },
  );
  window.addEventListener("resize", () => {
    sizeVec();
    fitView();
  });
}

function showRank(tab) {
  const body = $("#rank-body");
  let html = '<div class="rank-list">';
  if (tab === "delta") {
    const arr = RANK.delta;
    html +=
      '<div class="rank-row" style="cursor:default;color:#9aa3b2"><span>приобрели / потеряли</span><span class="v">км²</span></div>';
    const top = arr
      .slice(-15)
      .reverse()
      .concat([{ ru: "…", delta: null }])
      .concat(arr.slice(0, 15));
    let rk = 1;
    for (const r of top) {
      if (r.delta === null) {
        html +=
          '<div class="rank-row" style="cursor:default;justify-content:center;color:#5a6372">\u22ef</div>';
        continue;
      }
      const cls = r.delta >= 0 ? "delta-pos" : "delta-neg",
        s = r.delta >= 0 ? "+" : "";
      html += `<div class="rank-row" data-id="${r.id}"><span><span class="rk">${rk++}</span>${r.ru}</span><span class="v ${cls}">${s}${fmt(r.delta)}</span></div>`;
    }
  } else if (tab === "div") {
    let rk = 1;
    for (const r of RANK.divergence.slice(0, 40))
      html += `<div class="rank-row" data-id="${r.id}"><span><span class="rk">${rk++}</span>${r.ru}</span><span class="v">${r.div}</span></div>`;
  } else {
    html +=
      '<div class="rank-row" style="cursor:default;color:#9aa3b2"><span>граница (откл. от модели / людской масштаб)</span><span class="v">индекс</span></div>';
    let rk = 1;
    for (const r of IMP)
      html += `<div class="rank-row" data-pair="${r.a_id},${r.b_id}"><span><span class="rk">${rk++}</span>${r.a_ru} – ${r.b_ru}</span><span class="v">${r.idx}</span></div>`;
  }
  html += "</div>";
  body.innerHTML = html;
  body.querySelectorAll(".rank-row[data-pair]").forEach((row) =>
    row.addEventListener("click", () => {
      const pr = row.dataset.pair.split(",").map(Number);
      const a = pr[0],
        b = pr[1];
      if (playing) stop();
      seekVal = 0;
      setView();
      selected = a;
      hlSet = new Set([a, b].filter((x) => x >= 0));
      redraw();
      showInfo(a);
      updateCounter();
      $("#modal-rank").classList.add("hidden");
      centerOnSet(hlSet);
    }),
  );
  body.querySelectorAll(".rank-row[data-id]").forEach((row) =>
    row.addEventListener("click", () => {
      const id = parseInt(row.dataset.id);
      selected = id;
      hlSet = new Set([id]);
      if (playing) stop();
      seekVal = 0;
      setView();
      redraw();
      showInfo(id);
      updateCounter();
      $("#modal-rank").classList.add("hidden");
      centerOn(id);
    }),
  );
}
function centerOn(id) {
  centerOnSet(new Set([id]));
}
function centerOnSet(ids) {
  const b = currentIds();
  let minx = W,
    miny = H,
    maxx = 0,
    maxy = 0,
    found = false;
  for (let y = 0; y < H; y++) {
    const bb = y * W;
    for (let x = 0; x < W; x++) {
      if (ids.has(b[bb + x])) {
        found = true;
        if (x < minx) minx = x;
        if (x > maxx) maxx = x;
        if (y < miny) miny = y;
        if (y > maxy) maxy = y;
      }
    }
  }
  if (!found) return;
  const cx = (minx + maxx) / 2,
    cy = (miny + maxy) / 2;
  const vw = viewport.clientWidth,
    vh = viewport.clientHeight;
  S = Math.min(
    8,
    Math.max(1, Math.min(vw / (maxx - minx + 80), vh / (maxy - miny + 80))),
  );
  ox = vw / 2 - cx * S;
  oy = vh / 2 - cy * S;
  applyTransform();
}

function buildAbout() {
  $("#about-text").innerHTML = `
  <p>Карта строится моделью <b>коалесцентного роста</b>. Это ответ на вопрос: если бы границы определялись не историей, а «гравитацией населения» и географией, как бы поделилась суша?</p>
  <h3>Семена</h3>
  <p>В каждый административный центр первого уровня (всего ~4,6 тыс.) сажается «семя». Население региона берётся из реального растра плотности (GHS-POP, 2020), просуммированного по его территории.</p>
  <h3>Скорость фронта &#8733; &#8730;населения</h3>
  <p>От каждого семени распространяется фронт; его скорость пропорциональна корню из населения той связной области, к которой фронт принадлежит в данный момент. Чем многолюднее держава, тем быстрее она тянется к новым землям.</p>
  <h3>Слияние (коалесценция)</h3>
  <p>Когда два фронта одной страны соприкасаются, их области <b>сливаются</b>, население складывается, и весь объединённый периметр ускоряется. Плотные компактные страны быстро «сшивают» себя изнутри и дальше идут наружу почти как единая масса.</p>
  <h3>Конечная скорость проекции</h3>
  <p>Отрезанные куски — острова, эксклавы, дальние окраины за пустотами — не успевают слиться с ядром и растут лишь на своём малом населении. Поэтому огромные разреженные державы (Россия, Канада, Казахстан) теряют дальние рубежи: масса не успевает «дотянуться» через пустоту. Это подпись модели — финитная скорость проекции силы.</p>
  <h3>Что вы видите</h3>
  <p>Граница между странами — там, где встретились их фронты. «Реальная карта» дана для сравнения; цвета согласованы — страна сохраняет цвет в обоих слоях. Анимация проигрывает рост от семян до готовой карты по сохранённым временам прихода фронта.</p>
  <h3>Режим «с поглощением анклавов»</h3>
  <p>Альтернативный прогон: если связный кусок страны оказывается полностью окружён одной другой страной <i>и не имеет выхода к открытому океану</i> (внутренние замкнутые моря окружение не разрывают, ведь рост не пересекает берег и подпитки оттуда нет), он поглощается этой страной — с пересчётом населения и ускорением её фронта. Истинные сухопутные анклавы (Лесото, Сан-Марино) защищены. Так подчищаются застрявшие внутренние осколки; побережья (выход в океан) остаются нетронутыми.</p>`;
}

init();
