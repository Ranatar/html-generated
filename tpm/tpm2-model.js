// Transcription of Latin-letter Quenya and Sindarin into the signs of the TPM-2 layout (tehta modes).
// The rules follow the descriptions of the classical mode (Quenya) and the general use of the Third Age (Sindarin)
// by Måns Björkman, Amanyë Tenceli (at.boktypografen.se), as also implemented in Glǽmscribe (glaemscrafu.jrrvf.com);
// this is an independent implementation limited to the signs on the shuttle.
// transcribe(text, mode) -> { items: [{k, src, warn}], warnings: [..] }; k: layout item (codepoint number or 'mark:…',
// 'combo:ára+…', ' ' for a space, '\n' for a new line).
const TPM2_TR = (function () {
  const TW = {
    tinco: 0xe000, parma: 0xe001, calma: 0xe002, quesse: 0xe003, ando: 0xe004, umbar: 0xe005, anga: 0xe006, ungwe: 0xe007,
    sule: 0xe008, formen: 0xe009, harma: 0xe00a, hwesta: 0xe00b, anto: 0xe00c, ampa: 0xe00d, anca: 0xe00e, unque: 0xe00f,
    numen: 0xe010, malta: 0xe011, noldo: 0xe012, nwalme: 0xe013, ore: 0xe014, vala: 0xe015, anna: 0xe016, vilya: 0xe017,
    romen: 0xe020, arda: 0xe021, lambe: 0xe022, alda: 0xe023, silme: 0xe024, silmen: 0xe025, esse: 0xe026, essen: 0xe027,
    hyarmen: 0xe028, hwestas: 0xe029, yanta: 0xe02a, ure: 0xe02b, halla: 0xe02d, telco: 0xe02e, sarince: 0xe058,
  };
  const WIDE = new Set(['ando', 'umbar', 'anga', 'ungwe', 'anto', 'ampa', 'anca', 'unque', 'numen', 'malta', 'noldo', 'nwalme']);
  const PUNCT = { ',': 0xe060, ';': 0xe060, ':': 0xe060, '·': 0xe060, '.': 0xe061, '!': 0xe065, '?': 0xe066,
    '(': 0xe067, ')': 0xe067, '«': 0xe06a, '“': 0xe06a, '„': 0xe06a, '»': 0xe06b, '”': 0xe06b };
  const VOW = 'aeiouy';
  const LONG = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ý: 'y' };

  function norm(s) {
    s = s.toLowerCase().normalize('NFC');
    const map = { ä: 'a', ë: 'e', ï: 'i', ö: 'o', ü: 'u', ÿ: 'y', â: 'á', ê: 'é', î: 'í', ô: 'ó', û: 'ú', ŷ: 'ý',
      ā: 'á', ē: 'é', ī: 'í', ō: 'ó', ū: 'ú', ȳ: 'ý', ŋ: 'ñ', 'ʒ': 'z', '’': "'", 'ð': 'đ' };
    s = s.replace(/[äëïöüÿâêîôûŷāēīōūȳŋʒ’ð]/g, (c) => map[c]);
    return s.replace(/aa/g, 'á').replace(/ee/g, 'é').replace(/ii/g, 'í').replace(/oo/g, 'ó').replace(/uu/g, 'ú');
  }
  const bar = (name, kind) => (name === 'lambe' || name === 'alda' ? (kind === 'dbl' ? 'mark:dblL' : 'mark:nas')
    : WIDE.has(name) ? `mark:${kind}W` : `mark:${kind}`);
  const tehta = (v) => 'mark:' + v;

  // units of a word: {c: [letters], m: [marks], after: [letters after the tehta]} or {v, long} or {d: diphthong}
  function units(w, table, diphs) {
    const out = [];
    let i = 0;
    while (i < w.length) {
      const ch = w[i];
      if (LONG[ch]) { out.push({ v: LONG[ch], long: true, src: ch }); i++; continue; }
      if (VOW.includes(ch) && !(ch === 'y' && table.yCons)) {
        const two = w.slice(i, i + 2);
        const vv = table.yCons ? 'aeiou' : VOW;
        if (diphs[two] && !(i + 2 < w.length && vv.includes(w[i + 2]) && two[1] !== 'w')) { out.push({ d: two, src: two }); i += 2; continue; }
        out.push({ v: ch, long: false, src: ch }); i++; continue;
      }
      let u = null, pat = '';
      for (const [p, f] of table.cons) {
        if (!w.startsWith(p, i)) continue;
        const r = f({ initial: i === 0, final: i + p.length >= w.length, next: w[i + p.length] || '' });
        if (r) { u = Object.assign({ src: p }, r); pat = p; break; }
      }
      if (!u) { out.push({ bad: ch, src: ch }); i++; continue; }
      i += pat.length;
      // palatalized consonant (Quenya): consonant + y + vowel -> two dots below
      if (table.palatal && u.pal !== false && w[i] === 'y' && 'aeiouáéíóú'.includes(w[i + 1] || '-')) {
        u.m = (u.m || []).concat('mark:ddotb'); u.src += 'y'; i++;
      }
      out.push(u);
    }
    return out;
  }
  const C = (c, m, extra) => Object.assign({ c: Array.isArray(c) ? c : [c], m: m || [] }, extra || {});

  // ------------------------------------------------------------------ Quenya, classical mode
  const Q = {
    palatal: true, yCons: true,
    cons: [
      ['lld', () => C('alda', [bar('alda', 'dbl')])], ['ll', () => C('lambe', [bar('lambe', 'dbl')])], ['ld', () => C('alda')],
      ['rrd', () => C('arda', [bar('arda', 'dbl')])], ['rr', () => C('romen', [bar('romen', 'dbl')])], ['rd', () => C('arda')],
      ['nnd', () => C('ando', [bar('ando', 'dbl')])], ['nnt', () => C('anto', [bar('anto', 'dbl')])],
      ['ngw', () => C('ungwe')], ['nqu', () => C('unque')], ['nq', () => C('unque')], ['nd', () => C('ando')], ['nt', () => C('anto')],
      ['nc', () => C('anca')], ['nk', () => C('anca')], ['ng', () => C('anga')], ['ñw', () => C('nwalme')], ['ñ', () => C('noldo')],
      ['nn', () => C('numen', [bar('numen', 'dbl')])], ['nw', (x) => (x.initial ? C('nwalme') : null)],
      ['n', () => C('numen')],
      ['mb', () => C('umbar')], ['mp', () => C('ampa')], ['mm', () => C('malta', [bar('malta', 'dbl')])], ['m', () => C('malta')],
      ['tt', () => C('tinco', [bar('tinco', 'dbl')])], ['ts', () => C('tinco', [], { sar: true, pal: false })],
      ['th', () => C('sule')], ['þ', () => C('sule')], ['t', () => C('tinco')],
      ['pp', () => C('parma', [bar('parma', 'dbl')])], ['ps', () => C('parma', [], { sar: true, pal: false })], ['p', () => C('parma')],
      ['cc', () => C('calma', [bar('calma', 'dbl')])], ['kk', () => C('calma', [bar('calma', 'dbl')])],
      ['cs', () => C('calma', [], { sar: true, pal: false })], ['ks', () => C('calma', [], { sar: true, pal: false })],
      ['x', () => C('calma', [], { sar: true, pal: false })], ['c', () => C('calma')], ['k', () => C('calma')],
      ['qu', () => C('quesse', [], { pal: false })], ['q', () => C('quesse', [], { pal: false })],
      ['hw', () => C('hwesta', [], { pal: false })], ['hy', () => C('hyarmen', ['mark:ddotb'], { pal: false })],
      ['hl', () => C(['halla', 'lambe'])], ['hr', () => C(['halla', 'romen'])],
      ['h', (x) => (x.initial && 'aeiouáéíóú'.includes(x.next) ? C('hyarmen', [], { pal: false }) : C('harma', [], { pal: false }))],
      ['χ', () => C('harma')], ['ff', () => C('formen', [bar('formen', 'dbl')])], ['f', () => C('formen')],
      ['gw', () => C('ungwe')], ['g', () => C('anga')], ['d', () => C('ando')], ['b', () => C('umbar')],
      ['v', () => C('vala')], ['w', () => C('vilya')], ['y', () => C('anna', ['mark:ddotb'], { pal: false })],
      ['ss', () => C('esse', [], { s: 'essen' })], ['z', () => C('esse', [], { s: 'essen' })], ['s', () => C('silme', [], { s: 'silmen' })],
      ['r', () => C('romen', [], { r: true })], ['l', () => C('lambe')], ["'", () => C([])],
    ],
  };
  const QDIPH = { ai: ['yanta', 'a'], au: ['ure', 'a'], eu: ['ure', 'e'], iu: ['ure', 'i'], oi: ['yanta', 'o'], ui: ['yanta', 'u'] };

  function quenyaWord(w) {
    const U = units(w, Q, QDIPH), out = [];
    for (let i = 0; i < U.length; i++) {
      const u = U[i], nx = U[i + 1];
      if (u.bad) { out.push({ k: null, src: u.bad, warn: `«${u.bad}» — нет в правилах классического режима` }); continue; }
      if (u.c) {
        if (!u.c.length) continue;
        let letters = u.c.slice();
        const vowelNext = nx && (nx.v || nx.d);
        if (u.r && !vowelNext) letters[letters.length - 1] = 'ore';
        const carries = nx && nx.v && !nx.long && nx.v !== 'y';
        if (u.s && carries) letters[letters.length - 1] = u.s;
        letters.forEach((L, j) => out.push({ k: TW[L], src: j === letters.length - 1 ? u.src : '' }));
        for (const m of u.m) out.push({ k: m, src: '' });
        if (carries) { out.push({ k: tehta(nx.v), src: nx.src }); i++; }
        if (u.sar) out.push({ k: TW.sarince, src: '' });
        continue;
      }
      if (u.d) { const [L, v] = QDIPH[u.d]; out.push({ k: TW[L], src: u.d }, { k: tehta(v), src: '' }); continue; }
      if (u.long) { out.push({ k: 'combo:ára+' + u.v, src: u.src }); continue; }
      out.push({ k: TW.telco, src: u.src }, { k: tehta(u.v), src: '' });
    }
    return out;
  }

  // ------------------------------------------------------------------ Sindarin, general use of the Third Age
  const S = {
    palatal: false, yCons: false,
    cons: [
      ['nth', () => C('sule', [bar('sule', 'nas')])], ['mph', () => C('formen', [bar('formen', 'nas')])],
      ['nch', () => C('hwesta', [bar('hwesta', 'nas')])], ['ngw', () => C('ungwe', [bar('ungwe', 'nas')], { lab: true })],
      ['nc', () => C('quesse', [bar('quesse', 'nas')])], ['nk', () => C('quesse', [bar('quesse', 'nas')])],
      ['nt', () => C('tinco', [bar('tinco', 'nas')])], ['mp', () => C('parma', [bar('parma', 'nas')])],
      ['mb', () => C('umbar', [bar('umbar', 'nas')])], ['nd', () => C('ando', [bar('ando', 'nas')])],
      ['ng', (x) => (x.initial || x.final ? C('nwalme') : C('ungwe', [bar('ungwe', 'nas')]))],
      ['nn', () => C('numen', [bar('numen', 'nas')])], ['mm', () => C('malta', [bar('malta', 'nas')])],
      ['ns', () => C('silmen', [bar('silmen', 'nas')])],
      ['th', () => C('sule')], ['þ', () => C('sule')], ['ph', () => C('formen')], ['ff', () => C('formen')],
      ['f', (x) => (x.final ? C('ampa') : C('formen'))], ['ch', () => C('hwesta')], ['dh', () => C('anto')], ['đ', () => C('anto')],
      ['bh', () => C('ampa')], ['v', () => C('ampa')], ['rh', (x) => (x.initial ? C('arda') : null)],
      ['lh', (x) => (x.initial ? C('alda') : null)], ['hw', () => C('hwestas')],
      ['ll', () => C('lambe', [bar('lambe', 'dbl')])], ['ss', () => C('esse', [], { s: 'essen' })],
      ['t', () => C('tinco')], ['p', () => C('parma')], ['c', () => C('quesse')], ['k', () => C('quesse')],
      ['gw', () => C('ungwe', [], { lab: true })], ['d', () => C('ando')], ['b', () => C('umbar')], ['g', () => C('ungwe')],
      ['n', () => C('numen')], ['m', () => C('malta')], ['r', (x) => C(x.final ? 'ore' : 'romen')], ['l', () => C('lambe')],
      ['w', () => C('vala')], ['s', () => C('silme', [], { s: 'silmen' })], ['h', () => C('hyarmen')], ['j', () => C('yanta')],
      ["'", () => C([])],
    ],
  };
  const SDIPH = { ai: ['anna', 'a'], ei: ['anna', 'e'], ui: ['anna', 'u'], ae: ['yanta', 'a'], oe: ['yanta', 'o'], au: ['vala', 'a'], aw: ['vala', 'a'] };

  function sindarinWord(w) {
    const U = units(w, S, SDIPH), out = [];
    let pend = null; // a short vowel waiting for the next consonant
    const flush = () => {
      if (!pend) return;
      if (pend.v === 'y') out.push({ k: null, src: pend.src, warn: 'гласной y (две точки сверху) на челноке нет' });
      else out.push({ k: TW.telco, src: pend.src }, { k: tehta(pend.v), src: '' });
      pend = null;
    };
    for (let i = 0; i < U.length; i++) {
      const u = U[i];
      if (u.bad) { flush(); out.push({ k: null, src: u.bad, warn: `«${u.bad}» — нет в правилах общего режима` }); continue; }
      if (u.c) {
        if (!u.c.length) continue;
        const letters = u.c.slice();
        if (pend && u.s) letters[letters.length - 1] = u.s;
        letters.forEach((L, j) => out.push({ k: TW[L], src: j === letters.length - 1 ? u.src : '' }));
        for (const m of u.m) out.push({ k: m, src: '' });
        if (pend) {
          if (pend.v === 'y') out.push({ k: null, src: pend.src, warn: 'гласной y (две точки сверху) на челноке нет' });
          else out.push({ k: tehta(pend.v), src: pend.src });
          pend = null;
        }
        if (u.lab) out.push({ k: TW.vala, src: '', warn: 'завитка w на челноке нет: w записано валой' });
        continue;
      }
      flush();
      if (u.d) { const [L, v] = SDIPH[u.d]; out.push({ k: TW[L], src: u.d }, { k: tehta(v), src: '' }); continue; }
      if (u.long) {
        if (u.v === 'y') out.push({ k: null, src: u.src, warn: 'долгой y на челноке нет' });
        else out.push({ k: 'combo:ára+' + u.v, src: u.src });
        continue;
      }
      pend = u;
    }
    flush();
    return out;
  }

  function transcribe(text, mode) {
    const word = mode === 'sindarin' ? sindarinWord : quenyaWord;
    const s = norm(text), items = [];
    let buf = '';
    const pushWord = () => {
      if (!buf) return;
      const w = mode === 'quenya' ? buf.replace(/qu/g, 'q') : buf;
      for (const it of word(w)) items.push(it);
      buf = '';
    };
    for (const ch of s) {
      if (/[a-zá-ýñþχđ']/.test(ch) && ch !== '÷' && ch !== '×') { buf += ch; continue; }
      pushWord();
      if (ch === '\n') items.push({ k: '\n', src: '↵' });
      else if (/\s/.test(ch)) { if (items.length && items[items.length - 1].k !== ' ') items.push({ k: ' ', src: ' ' }); }
      else if (/[0-9]/.test(ch)) items.push({ k: 0xe070 + +ch, src: ch });
      else if (PUNCT[ch] !== undefined) items.push({ k: PUNCT[ch], src: ch });
      else if (ch === '-' || ch === '–' || ch === '—') continue;
      else items.push({ k: null, src: ch, warn: `знака «${ch}» на челноке нет` });
    }
    pushWord();
    while (items.length && items[items.length - 1].k === ' ') items.pop();
    return { items, warnings: items.filter((x) => x.warn).map((x) => x.warn) };
  }
  return { transcribe, TW };
})();

// the model comes from tpm2-model-data.js: metadata as JSON and the shapes as one deflated binary
async function loadModel() {
  const T = window.TPM2_DATA;
  if (!T) throw new Error('нет файла tpm2-model-data.js рядом со страницей');
  if (T.shapes) {
    // readable variant (build_page.py --plain): plain arrays per shape
    T.meta.plain = T.shapes;
    return T.meta;
  }
  const z = Uint8Array.from(atob(T.geom.join('')), (ch) => ch.charCodeAt(0));
  const stream = new Blob([z]).stream().pipeThrough(new DecompressionStream('deflate'));
  T.meta.buf = await new Response(stream).arrayBuffer();
  return T.meta;
}
(async function () {
  'use strict';
  let D;
  try {
    D = await loadModel();
  } catch (e) {
    const l = document.getElementById('loading');
    if (l) l.textContent = 'Модель не загрузилась: ' + e.message;
    throw e;
  }
  const C = D.C,
    U = C.U,
    S_FONT = C.EM / 1000,
    MOTOR = C.MOTOR;
  const $ = (id) => document.getElementById(id);
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const deg = Math.PI / 180;

  // ---------------------------------------------------------------- renderer, light, environment
  const canvas = $('gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 5, 6000);
  camera.up.set(0, 0, 1);
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.autoRotateSpeed = 0.7;

  // a gradient environment so that steel reads as steel without an HDR file
  function makeEnv(dark) {
    const c = document.createElement('canvas');
    c.width = 16;
    c.height = 256;
    const g = c.getContext('2d'),
      grd = g.createLinearGradient(0, 0, 0, 256);
    if (dark) {
      grd.addColorStop(0, '#5a6573');
      grd.addColorStop(0.48, '#2a313a');
      grd.addColorStop(0.52, '#1a1f25');
      grd.addColorStop(1, '#0b0d10');
    } else {
      grd.addColorStop(0, '#ffffff');
      grd.addColorStop(0.45, '#c9d0d8');
      grd.addColorStop(0.55, '#8e969f');
      grd.addColorStop(1, '#4a5058');
    }
    g.fillStyle = grd;
    g.fillRect(0, 0, 16, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    const pm = new THREE.PMREMGenerator(renderer);
    pm.compileEquirectangularShader();
    const env = pm.fromEquirectangular(tex).texture;
    tex.dispose();
    pm.dispose();
    return env;
  }
  const isDark = () => (css('color-scheme') || '').includes('dark');
  function setTheme() {
    scene.background = new THREE.Color(css('--view') || '#dfe3e8').convertSRGBToLinear();
    scene.environment = makeEnv(isDark());
    drawCycle();
  }
  scene.add(new THREE.HemisphereLight(0xf2f5ff, 0x6d6457, 0.45));
  const sun = new THREE.DirectionalLight(0xfff3e0, 1.25);
  sun.position.set(-380, -620, 900);
  sun.target.position.set(0, -120, 120);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -460, right: 460, top: 460, bottom: -460, near: 200, far: 2400 });
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.6;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight(0xc8dcff, 0.35);
  fill.position.set(520, 600, 320);
  scene.add(fill);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.ShadowMaterial({ opacity: 0.18 }));
  ground.position.z = -0.6;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---------------------------------------------------------------- meshes
  // smooth normals within a crease angle: round shafts look round, box edges stay sharp
  function creased(pos, idx, angle) {
    const nt = idx.length / 3,
      nv = pos.length / 3,
      fn = new Float32Array(nt * 3),
      fa = new Float32Array(nt * 3);
    for (let t = 0; t < nt; t++) {
      const a = idx[3 * t] * 3,
        b = idx[3 * t + 1] * 3,
        c = idx[3 * t + 2] * 3;
      const ux = pos[b] - pos[a],
        uy = pos[b + 1] - pos[a + 1],
        uz = pos[b + 2] - pos[a + 2];
      const vx = pos[c] - pos[a],
        vy = pos[c + 1] - pos[a + 1],
        vz = pos[c + 2] - pos[a + 2];
      const x = uy * vz - uz * vy,
        y = uz * vx - ux * vz,
        z = ux * vy - uy * vx,
        l = Math.hypot(x, y, z) || 1;
      fa[3 * t] = x;
      fa[3 * t + 1] = y;
      fa[3 * t + 2] = z;
      fn[3 * t] = x / l;
      fn[3 * t + 1] = y / l;
      fn[3 * t + 2] = z / l;
    }
    const cnt = new Uint32Array(nv + 1);
    for (let i = 0; i < idx.length; i++) cnt[idx[i] + 1]++;
    for (let i = 0; i < nv; i++) cnt[i + 1] += cnt[i];
    const adj = new Uint32Array(idx.length),
      fillp = cnt.slice(0, nv);
    for (let i = 0; i < idx.length; i++) adj[fillp[idx[i]]++] = (i / 3) | 0;
    const cosA = Math.cos(angle * deg),
      P = new Float32Array(idx.length * 3),
      N = new Float32Array(idx.length * 3);
    for (let i = 0; i < idx.length; i++) {
      const v = idx[i],
        t = (i / 3) | 0;
      let x = 0,
        y = 0,
        z = 0;
      for (let j = cnt[v]; j < cnt[v + 1]; j++) {
        const f = adj[j];
        if (fn[3 * f] * fn[3 * t] + fn[3 * f + 1] * fn[3 * t + 1] + fn[3 * f + 2] * fn[3 * t + 2] >= cosA) {
          x += fa[3 * f];
          y += fa[3 * f + 1];
          z += fa[3 * f + 2];
        }
      }
      const l = Math.hypot(x, y, z) || 1;
      P[3 * i] = pos[3 * v];
      P[3 * i + 1] = pos[3 * v + 1];
      P[3 * i + 2] = pos[3 * v + 2];
      N[3 * i] = x / l;
      N[3 * i + 1] = y / l;
      N[3 * i + 2] = z / l;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(P, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(N, 3));
    return g;
  }
  const METAL = /сталь|жесть|бронза/,
    ALU = /алюмин|Д16Т/;
  const mats = {};
  function matFor(p) {
    const cls = ALU.test(p.mt) ? 'alu' : METAL.test(p.mt) ? 'steel' : /резина/.test(p.mt) ? 'rubber' : 'plastic';
    const key = cls + p.c.join(',');
    if (!mats[key]) {
      const col = new THREE.Color(p.c[0] / 255, p.c[1] / 255, p.c[2] / 255).convertSRGBToLinear();
      const o = { color: col, side: THREE.DoubleSide };
      if (cls === 'steel') Object.assign(o, { metalness: 0.9, roughness: 0.32, envMapIntensity: 1.1 });
      else if (cls === 'alu') Object.assign(o, { metalness: 0.75, roughness: 0.42 });
      else if (cls === 'rubber') Object.assign(o, { metalness: 0, roughness: 0.92 });
      else Object.assign(o, { metalness: 0, roughness: 0.6, envMapIntensity: 0.6 });
      mats[key] = new THREE.MeshStandardMaterial(o);
    }
    return mats[key];
  }
  // a shape from the data file: planar delta-coded vertices and zigzag delta-coded indices (see build_page.py)
  const shapes = [];
  function shape(k) {
    if (shapes[k]) return shapes[k];
    if (D.plain) {
      const p = D.plain[k];
      return (shapes[k] = [Uint16Array.from(p.v), p.v.length / 3 > 65535 ? Uint32Array.from(p.i) : Uint16Array.from(p.i)]);
    }
    const [off, nv, ni, wide] = D.geoms[k];
    const d = new Int16Array(D.buf, off, nv * 3),
      q = new Uint16Array(nv * 3);
    for (let c = 0; c < 3; c++) {
      let a = 0;
      for (let i = 0; i < nv; i++) {
        a = (a + d[c * nv + i]) & 0xffff;
        q[3 * i + c] = a;
      }
    }
    const io = Math.ceil((off + nv * 6) / 4) * 4;
    const z = wide ? new Uint32Array(D.buf, io, ni) : new Uint16Array(D.buf, io, ni);
    const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
    let a = 0;
    for (let i = 0; i < ni; i++) {
      const v = z[i];
      a += v & 1 ? -((v + 1) / 2) : v / 2;
      idx[i] = a;
    }
    return (shapes[k] = [q, idx]);
  }
  const meshes = [],
    caps = {};
  let ribbonMesh = null,
    ribbonRest = null,
    ribbonLast = -1;
  for (const p of D.parts) {
    const [q, idx] = shape(p.geo),
      pos = new Float32Array(q.length);
    for (let i = 0; i < q.length; i += 3) {
      pos[i] = p.o[0] + q[i] * D.Q;
      pos[i + 1] = p.o[1] + q[i + 1] * D.Q;
      pos[i + 2] = p.o[2] + q[i + 2] * D.Q;
    }
    const g = creased(pos, idx, 32);
    let mat = matFor(p);
    if (p.n.startsWith('cap ')) mat = mat.clone(); // each key cap lights up on its own
    const m = new THREE.Mesh(g, mat);
    m.matrixAutoUpdate = false;
    m.userData = p;
    m.castShadow = true;
    m.receiveShadow = true;
    if (p.n === 'paper') m.visible = false; // the printed sheet below replaces it
    scene.add(m);
    meshes.push(m);
    if (p.n.startsWith('cap ')) {
      g.computeBoundingBox();
      caps[p.m.n] = m;
    }
    if (p.n === 'ribbon') {
      ribbonMesh = m;
      ribbonRest = Float32Array.from(g.attributes.position.array);
    }
  }
  $('loading').remove();

  // printed sheet on the paper: a canvas texture moving with the carriage
  const sheet = $('sheet'),
    sctx = sheet.getContext('2d');
  const PX = sheet.width / 216; // px per mm
  const SHEET_TOP = C.ROLLER[1] - 4,
    SHEET_H = sheet.height / PX;
  const tex = new THREE.CanvasTexture(sheet);
  tex.encoding = THREE.sRGBEncoding;
  tex.anisotropy = 4;
  const sheetMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(216, SHEET_H),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, toneMapped: false }),
  );
  sheetMesh.rotation.x = Math.PI / 2; // plane faces -Y, text upright
  sheetMesh.position.set(C.CAR0, -0.12, SHEET_TOP - SHEET_H / 2);
  sheetMesh.receiveShadow = true;
  const sheetGroup = new THREE.Group();
  sheetGroup.add(sheetMesh);
  scene.add(sheetGroup);

  // ---------------------------------------------------------------- glyph legends (font units, y up)
  const keyByN = {};
  for (const k of D.keys) keyByN[k.n] = k;
  const isAdv = (it) => ['T', 'C', 'N', 'P'].includes(it.kind);
  // one legend = glyph pieces placed relative to the letter's anchor, plus a dotted carrier for dead marks
  function legend(it) {
    if (!it) return null;
    if (it.kind === 'C')
      return {
        parts: [
          [it.glyph, -it.ax],
          [it.mark, -it.max],
        ],
      };
    if (isAdv(it)) return { parts: [[it.glyph, 0]] };
    return { parts: [[it.glyph, -it.ax]], carrier: true };
  }
  function legendBox(L) {
    let x0 = 1e9,
      x1 = -1e9;
    for (const [g, dx] of L.parts) {
      const b = D.bbox[g];
      x0 = Math.min(x0, b[0] + dx);
      x1 = Math.max(x1, b[2] + dx);
    }
    if (L.carrier) {
      x0 = Math.min(x0, -190);
      x1 = Math.max(x1, 190);
    }
    return [x0, x1];
  }
  const Y0 = -340,
    Y1 = 760; // fixed vertical frame: every legend at the same scale
  function legendSvg(it, cls) {
    const L = legend(it);
    if (!L) return '';
    const [x0, x1] = legendBox(L),
      w = Math.max(x1 - x0, 500),
      cx = (x0 + x1) / 2;
    let body = L.carrier ? `<circle class="carrier" cx="0" cy="${-200}" r="165"/>` : '';
    for (const [g, dx] of L.parts)
      body += `<path fill="currentColor" transform="translate(${dx},0) scale(1,-1)" d="${D.paths[g]}"/>`;
    return `<svg class="${cls || ''}" viewBox="${cx - w / 2} ${-Y1} ${w} ${Y1 - Y0}" aria-hidden="true">${body}</svg>`;
  }
  const pathCache = {};
  const path2d = (g) => pathCache[g] || (pathCache[g] = new Path2D(D.paths[g]));
  // draw a legend into a box (x, y = top-left, w, h) of a 2D context
  function drawLegend(ctx, it, x, y, w, h, color, carrierColor) {
    const L = legend(it);
    if (!L) return;
    const [x0, x1] = legendBox(L),
      s = Math.min(h / (Y1 - Y0), w / Math.max(x1 - x0, 1)),
      cx = (x0 + x1) / 2;
    ctx.save();
    ctx.translate(x + w / 2 - cx * s, y + Y1 * s);
    ctx.scale(s, -s);
    if (L.carrier) {
      ctx.strokeStyle = carrierColor;
      ctx.lineWidth = 24;
      ctx.setLineDash([32, 36]);
      ctx.beginPath();
      ctx.arc(0, 200, 165, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = color;
    for (const [g, dx] of L.parts) {
      ctx.save();
      ctx.translate(dx, 0);
      ctx.fill(path2d(g));
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- legends on the model's key caps (one atlas)
  const ATL = 2048,
    CELL = 256,
    NCOL = ATL / CELL;
  const atlas = document.createElement('canvas');
  atlas.width = atlas.height = ATL;
  const actx = atlas.getContext('2d');
  const atlasTex = new THREE.CanvasTexture(atlas);
  atlasTex.encoding = THREE.sRGBEncoding;
  atlasTex.anisotropy = 8;
  const legendMat = new THREE.MeshStandardMaterial({
    map: atlasTex,
    transparent: true,
    roughness: 0.55,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  const SERVICE_TEXT = {
    shift: ['РЕГ.', ''],
    bksp: ['ЗАБОЙ', '1u'],
    back: ['НАЗАД', 'на литеру'],
    space4: ['пробел 4u'],
    space6: ['пробел 6u'],
  };
  let cell = 0;
  for (const k of D.keys) {
    const cap = caps[k.n];
    if (!cap) continue;
    const bb = cap.geometry.boundingBox,
      cx = (bb.min.x + bb.max.x) / 2,
      cy = (bb.min.y + bb.max.y) / 2;
    const w = (bb.max.x - bb.min.x) * 0.9,
      h = (bb.max.y - bb.min.y) * 0.9;
    const ci = cell++,
      u0 = (ci % NCOL) * CELL,
      v0 = Math.floor(ci / NCOL) * CELL;
    const ch = Math.round(CELL * Math.min(1, h / w)); // used height of the cell (space bars are long)
    const ix = u0 + 10,
      iy = v0 + 10,
      iw = CELL - 20,
      ih = ch - 20;
    const ink = '#efe6cf',
      faint = 'rgba(239,230,207,.45)',
      dead = '#b9d3ef';
    if (k.kind === 'char') {
      const deadKey = k.lo && !isAdv(k.lo);
      // lower register large at the bottom left, upper register small at the top right, as on typewriter keys
      drawLegend(actx, k.lo, ix, iy + ih * 0.28, iw * 0.7, ih * 0.72, deadKey ? dead : ink, faint);
      if (k.up)
        drawLegend(actx, k.up, ix + iw * 0.55, iy, iw * 0.45, ih * 0.45, k.up && !isAdv(k.up) ? dead : ink, faint);
      actx.fillStyle = faint;
      actx.font = `500 ${Math.round(ih * 0.17)}px "IBM Plex Mono", monospace`;
      actx.textAlign = 'right';
      actx.textBaseline = 'alphabetic';
      actx.fillText(D.legends[k.r][k.c].toUpperCase(), ix + iw, iy + ih);
    } else {
      const t = SERVICE_TEXT[k.id] || [k.label];
      actx.fillStyle = ink;
      actx.textAlign = 'center';
      actx.textBaseline = 'middle';
      if (k.kind === 'space') {
        actx.font = `500 ${Math.round(ih * 0.55)}px "IBM Plex Sans", sans-serif`;
        actx.fillText(t[0], u0 + CELL / 2, v0 + ch / 2);
      } else {
        actx.font = `600 ${Math.round(ih * 0.24)}px "IBM Plex Sans Condensed", sans-serif`;
        actx.fillText(t[0], u0 + CELL / 2, v0 + ch * 0.42);
        if (t[1]) {
          actx.fillStyle = faint;
          actx.font = `500 ${Math.round(ih * 0.17)}px "IBM Plex Sans", sans-serif`;
          actx.fillText(t[1], u0 + CELL / 2, v0 + ch * 0.7);
        }
      }
    }
    const g = new THREE.PlaneGeometry(w, h);
    const uv = g.attributes.uv; // plane uv (0..1) -> this cell; canvas y runs down, texture v up (flipY)
    for (let i = 0; i < uv.count; i++)
      uv.setXY(i, (u0 + uv.getX(i) * CELL) / ATL, 1 - (v0 + (1 - uv.getY(i)) * ch) / ATL);
    g.translate(cx, cy, bb.max.z + 0.05);
    const m = new THREE.Mesh(g, legendMat);
    m.matrixAutoUpdate = false;
    m.userData = { n: 'legend', g: 'keys', m: { t: 'keyz', n: k.n }, key: k.n };
    scene.add(m);
    meshes.push(m);
  }
  // web fonts may arrive after the first paint: redraw the service-key text once they do
  atlasTex.needsUpdate = true;
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => {
      atlasTex.needsUpdate = true;
    });

  // ---------------------------------------------------------------- machine state and motions
  const HOMEP = (C.NPOS - 1) / 2;
  const st = {
    f: {},
    frames: { R: 0, W: 0, B: 0, C: 0, O: 0, N: 0 },
    tier: 0,
    bits: {},
    pos: HOMEP,
    row: C.REST_ROW,
    slide: 0,
    detent: 0,
    hammer: 0,
    cock: 0,
    lock: 0,
    phi: 0,
    ncyc: 0,
    car: C.CAR0,
    mem: { b: 0, c: 0, w: 0 },
    item: null,
    shift: false,
    shiftHeld: false,
    reserve: MOTOR.chars,
    wind: 0,
    explode: 0,
    msg: '',
  };
  function cyc(t) {
    t = Math.min(Math.max(t, 0), 1);
    return t - Math.sin(2 * Math.PI * t) / (2 * Math.PI);
  }
  function camLift(kind, a) {
    const c = C.CYCLE;
    if (kind === 'out') {
      if (a < c.out[0]) return 0;
      if (a < c.out[1]) return cyc((a - c.out[0]) / (c.out[1] - c.out[0]));
      if (a < c.back[0]) return 1;
      if (a < c.back[1]) return 1 - cyc((a - c.back[0]) / (c.back[1] - c.back[0]));
      return 0;
    }
    if (kind === 'detent' || kind === 'ribbon') {
      // rev. 0.9c: ramps of 35 deg (detent) and 80 deg (ribbon)
      const d0 = c[kind][0],
        d1 = c[kind][1],
        rp = C.RAMP[kind];
      if (a < d0 - rp || a > d1 + rp) return 0;
      if (a < d0) return cyc((a - d0 + rp) / rp);
      if (a > d1) return 1 - cyc((a - d1) / rp);
      return 1;
    }
    if (kind === 'cock') {
      // hammer spring cocked over 10..150 deg, released at the strike
      const s0 = c.strike;
      if (a < 10) return 0;
      if (a < 150) return cyc((a - 10) / 140);
      if (a < s0) return 1;
      if (a < s0 + 2) return 1 - (a - s0) / 2;
      return 0;
    }
    if (kind === 'strike') {
      // the hammer flies in 8 deg, rests on the paper, returns by 190 deg
      const s0 = c.strike;
      if (a >= s0 && a < s0 + 8) return cyc((a - s0) / 8);
      if (a >= s0 + 8 && a < s0 + 11) return 1;
      if (a >= s0 + 11 && a < s0 + 30) return 1 - cyc((a - s0 - 11) / 19);
      return 0;
    }
    return 0;
  }
  const lockAt = (a) => (a < 0.5 ? 0 : a < 5 ? cyc(a / 5) : a < 345 ? 1 : a < 355 ? 1 - cyc((a - 345) / 10) : 0);
  const PROFILE = { lift: 'out', rotate: 'out', detent: 'detent', hammer: 'cock', ribbon: 'ribbon' };
  // whiffletrees (mirror of parts.tree_pose / tree_nodes): bits and drive phase follow the shuttle position
  function treePose(name) {
    const t = C.TREES[name],
      nb = t.bits.length;
    const raised = t.bits.map((b) => ((st.bits[b] || 0) > 0.5 ? 1 : 0)),
      any = raised.some((v) => v);
    let cb = 0;
    raised.forEach((v, i) => {
      cb |= v << i;
    });
    let c, f;
    if (name === 'rotate') {
      const d = st.pos - HOMEP;
      if (any && Math.abs(cb - HOMEP) > 1e-9) c = cb;
      else if (Math.abs(d) > 1e-9) c = d > 0 ? C.NPOS - 1 : 0;
      else c = cb;
      f = Math.abs(c - HOMEP) > 1e-9 ? d / (c - HOMEP) : 0;
    } else {
      const d = st.row - C.REST_ROW;
      c = any ? cb : d > 1e-9 ? C.NROWS - 1 : 0;
      f = d / (c - C.REST_ROW);
    }
    f = Math.min(Math.max(f, 0), 1);
    return { bits: t.bits.map((_, i) => (c >> i) & 1), f };
  }
  let treeCache = null;
  function treeNodes(name) {
    if (treeCache && treeCache[name]) return treeCache[name];
    const t = C.TREES[name],
      p = treePose(name);
    const y = p.bits.map((b) => C.S * p.f * b),
      n = [y[0]];
    let acc = 1;
    for (let k = 1; k < y.length; k++) {
      const w = 2 ** k;
      n.push((acc * n[k - 1] + w * y[k]) / (acc + w));
      acc += w;
    }
    const yF = t.delta * p.f,
      yo = t.G * n[n.length - 1] + (1 - t.G) * yF;
    const r = { y, n, yF, yo, f: p.f };
    (treeCache = treeCache || {})[name] = r;
    return r;
  }
  // a slotted lever between two pins: rest pins (xa, y0), (xb, y0) -> (xa, ya), (xb, yb); stretched along its length
  function leverM(xa, xb, y0, ya, yb) {
    const L0 = xb - xa,
      dx = L0,
      dy = yb - ya,
      L = Math.hypot(dx, dy),
      sg = Math.sign(L0) || 1;
    const ux = dx / L0,
      uy = dy / L0,
      vx = (-dy / L) * sg,
      vy = (dx / L) * sg;
    const m = new M();
    m.set(ux, vx, 0, xa - ux * xa - vx * y0, uy, vy, 0, ya - uy * xa - vy * y0, 0, 0, 1, 0, 0, 0, 0, 1);
    return m;
  }
  function followAngle(b) {
    const F = C.FOLLOW;
    // a sector held by its pawl keeps its follower up: memory of B, C (units) and W (as w - 4)
    const mem = { B: st.mem.b || 0, C: st.mem.c || 0, W: Math.max(0, (st.mem.w || 0) - 4) }[b] || 0;
    let s = Math.max(st.frames[b] || 0, mem);
    s = b === 'R' ? Math.min(s, 4) : Math.min(s, 12);
    return (Math.asin((F.H0 + s) / F.R) * 180) / Math.PI - F.TH0;
  }
  const M = THREE.Matrix4;
  // rev. 0.8b: stops of the print unit (mirror of parts.mark_stops / o_link)
  function stopsM(m) {
    const S = C.STOPS, d = st.slide * U, sO = Math.min(st.frames.O || 0, S.O_CLAMP);
    const nsh = Math.min(S.N_SHIFT, S.N_OUT * Math.min(1, (st.frames.N || 0) / S.N_IN));
    const F = C.FOLLOW, dO = Math.asin((F.H0 + sO) / F.R) * 180 / Math.PI - F.TH0;
    const p = S.O_ARM * Math.sin(dO * deg), q = d * S.ROCKER[0] / S.ROCKER[1];
    switch (m.s) {
      case 'stopbc': return rZ(-Math.asin(Math.min(1, d / S.BC_R)), S.SBC[0], S.SBC[1]);
      case 'stopcar': return T(0, -d, 0);
      case 'stopfin': return T(-nsh, -d, 0);
      case 'nsel': return rY(-Math.asin(nsh / S.N_OUT), S.NSEL[0], S.NSEL[2]);
      case 'orodA': return T(0, p, 0);
      case 'orodAf': return T(0, q, 0);
      case 'orodS': {        // the spring between the two halves of rod A stretches or shortens
        const k = (m.L + q - p) / m.L, y0 = m.y0;
        return new M().set(1, 0, 0, 0, 0, k, 0, y0 + p - k * y0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      case 'orock': return rX(Math.asin(Math.min(1, q / S.ROCKER[0])), S.OROCK[0], S.OROCK[1]);
      case 'orodB': return T(0, -d, 0);
      case 'obc': return rZ(-Math.asin(Math.min(1, d / S.O_BC_R)), S.OBC[0], S.OBC[1]);
    }
    return null;
  }
  // rev. 0.9c: the escapement (mirror of escape.py): B and K turn CCW (machine frame) to take the wheel back, U and M
  // CW with the width, the rockers about Y; the links are stretched between their two balls
  function escB() {
    const E = C.ESC2,
      fb = st.f[46] || 0,
      fk = st.f[47] || 0;
    return Math.max(E.bksp * fb, (E.catch + 6 * (st.mem.w || 0) + E.play) * fk);
  }
  function rockerAt(key) {
    const R = C.ESC2.rock[key],
      f = Math.min(1, Math.max(0, st.f[key === 'bksp' ? 46 : 47] || 0)) * 20,
      i = Math.min(19, Math.floor(f)),
      t = f - i;
    const lerp = (a, b) => a + (b - a) * t;
    return { deg: lerp(R.deg[i], R.deg[i + 1]), A: [0, 1, 2].map((j) => lerp(R.A[i][j], R.A[i + 1][j])) };
  }
  function studAt(key, ang) {
    const E = C.ESC2,
      R = E.rock[key],
      a = (R.stud[1] - ang) * deg;
    return [-(E.c[0] + R.stud[0] * Math.cos(a)), E.c[1] + R.stud[0] * Math.sin(a), R.sz];
  }
  function stretch(A0, B0, A1, B1) {
    const v0 = new THREE.Vector3(B0[0] - A0[0], B0[1] - A0[1], B0[2] - A0[2]),
      v1 = new THREE.Vector3(B1[0] - A1[0], B1[1] - A1[1], B1[2] - A1[2]);
    const k = v1.length() / v0.length();
    const u0 = v0.clone().normalize(),
      u1 = v1.clone().normalize();
    const S = new M().makeScale(1, 1, 1);
    // scale along u0: I + (k - 1) u0 u0^T
    const e = S.elements;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) e[c * 4 + r] += (k - 1) * u0.getComponent(r) * u0.getComponent(c);
    const R = new M().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(u0, u1));
    return T(A1[0], A1[1], A1[2]).multiply(R).multiply(S).multiply(T(-A0[0], -A0[1], -A0[2]));
  }
  function esc2M(m) {
    const E = C.ESC2,
      cx = E.c[0],
      cy = E.c[1],
      sW = st.frames.W || 0;
    const beta = escB(),
      fk = (st.f[47] || 0) > 0;
    switch (m.s) {
      case 'dog': {
        const r = ((((st.car - C.CAR0) / 5.053 / deg) % E.pitch) + E.pitch) % E.pitch,
          i = Math.floor((r / E.pitch) * 24) % 24;
        return T(0, E.dog[i], 0);
      }
      case 'U':
        return rZ(-6 * sW * deg, cx, cy);
      case 'Uf': {
        const inn = sW > 0.01 ? 1 : 0;
        return rZ(-6 * sW * deg, cx, cy).multiply(T(-3 * inn * E.uw[0], -3 * inn * E.uw[1], 0));
      }
      case 'B':
        return rZ(beta * deg, cx, cy);
      case 'K':
        return rZ(E.bksp * (st.f[46] || 0) * deg, cx, cy);
      case 'pawl': {
        const R = rZ(beta * deg, cx, cy);
        return beta < E.drop ? R : R.multiply(rZ(-E.lift * deg, E.pv[0], E.pv[1]));
      }
      case 'M':
      case 'wedge': {
        const coup = fk ? Math.max(0, beta - E.catch - E.play) : 0;
        const R = rZ(-(6 * (st.mem.w || 0) - coup) * deg, cx, cy);
        return m.s === 'wedge' && fk ? R.multiply(T(0, 0, -E.wedge)) : R;
      }
      case 'rock': {
        const R = E.rock[m.k];
        return rY(rockerAt(m.k).deg * deg, R.xa, R.z);
      }
      case 'link': {
        const R = E.rock[m.k],
          A1 = rockerAt(m.k).A,
          ang = m.k === 'bksp' ? E.bksp * (st.f[46] || 0) : beta;
        return stretch(R.A[0], studAt(m.k, 0), A1, studAt(m.k, ang));
      }
    }
    return null;
  }
  function about(rot, x, y, z) {
    return new M()
      .makeTranslation(x, y, z)
      .multiply(rot)
      .multiply(new M().makeTranslation(-x, -y, -z));
  }
  const rX = (a, y, z) => about(new M().makeRotationX(a), 0, y, z);
  const rY = (a, x, z) => about(new M().makeRotationY(a), x, 0, z);
  const rZ = (a, x, y) => about(new M().makeRotationZ(a), x, y, 0);
  const T = (x, y, z) => new M().makeTranslation(x, y, z);
  function colRise(c) {
    let f = 0;
    for (let n = 4 * c; n < 4 * c + 4; n++) f = Math.max(f, st.f[n] || 0);
    return 4 * Math.min(1, f * 1.4);
  }
  const keyF = (n) => (n === -5 ? Math.max(st.f[n] || 0, st.shift || st.shiftHeld ? 1 : 0) : st.f[n] || 0);

  function matrixFor(m) {
    const lift = (st.row - C.HOME_ROW) * C.RH,
      th = (st.pos - HOMEP) * C.STEP_DEG * deg;
    switch (m.t) {
      case 'lever':
        return rX(Math.atan2(C.KEY_TRAVEL * keyF(m.n), m.L), C.PIVOT[0], C.PIVOT[1]);
      case 'keyz':
        return T(0, 0, -C.KEY_TRAVEL * keyF(m.n));
      case 'pusher':
        return T(0, 0, colRise(m.c));
      case 'bit':
        return T(0, 0, 4 * (st.bits[m.b] || 0));
      case 'bail':
        return T(0, C.TIER * st.tier, -st.frames[m.b]);
      case 'sector':
        return rX(3.6 * st.frames[m.b] * deg, C.SECT[0], C.SECT[1]);
      case 'unit': {
        const base = T(-st.slide * U, 0, 0);
        if (m.s === 'shuttle') return base.multiply(T(0, 0, lift)).multiply(rZ(th, 0, C.AXIS_Y));
        if (m.s === 'drum') return base.multiply(rZ(th, 0, C.AXIS_Y));
        if (m.s === 'tape') return base.multiply(T(0, -(st.pos - HOMEP) * C.TAPE, 0));
        if (m.s === 'fork') return base.multiply(rY(-Math.atan((lift - C.LIFT_MIN) / 150), C.FORK[0], C.FORK[1]));
        if (m.s === 'collar') return base.multiply(T(0, 0, lift - C.LIFT_MIN));
        if (m.s === 'detent') return base.multiply(T(-3 * st.detent, 0, 0));
        if (m.s === 'detlink') return base.multiply(T(0, 0, C.DET_RISE * st.detent));
        if (m.s === 'hammer') return base.multiply(rX(18 * st.hammer * deg, C.HAMMER[0], C.HAMMER[1]));
        if (m.s === 'cock') return base.multiply(T(0, 0, C.COCK.lift * st.cock));
        if (m.s === 'cock_lever')
          return base.multiply(rX(Math.atan2(C.COCK.lift * st.cock, C.COCK.rc), C.HAMMER[0], C.HAMMER[1]));
        if (m.s === 'rowwedge') {
          const a = C.ROWDET.dir * deg,
            d = C.ROWDET.stroke * st.detent;
          return base.multiply(T(-d * Math.cos(a), 0, -d * Math.sin(a)));
        }
        return base;
      }
      case 'wt': {
        const base = T(-st.slide * U, 0, 0),
          q = treeNodes(m.tr),
          sd = C.TREES[m.tr].dir,
          S = C.S;
        switch (m.w) {
          case 'bit':
            return base.multiply(T(0, sd * q.y[m.i], 0));
          case 'pin':
            return base.multiply(T(0, sd * q.y[m.i], 3.5 * (st.bits[m.b] || 0)));
          case 'node':
            return base.multiply(T(0, sd * q.n[m.i], 0));
          case 'lev':
            return base.multiply(leverM(m.xa, m.xb, m.y, m.y + sd * q.n[m.i - 1], m.y + sd * q.y[m.i]));
          case 'amp':
            return base.multiply(leverM(m.xa, m.xb, m.y, m.y + sd * q.yo, m.y + sd * q.yF));
          case 'fs':
            return base.multiply(T(0, sd * q.yF, 0));
          case 'bail':
            return base.multiply(T(0, sd * S * q.f, 0));
          case 'link':
            return base.multiply(T(0, -S * q.f, 0));
          case 'bc':
            return base.multiply(rX(Math.atan2(S * q.f, m.L) * (sd > 0 ? -1 : 1), m.p[0], m.p[1]));
          case 'out':
            return base.multiply(T(0, q.yo, 0));
          case 'obc':
            return base.multiply(rX(-Math.atan2(q.yo, m.h), m.p[0], m.p[1]));
          case 'push':
            return base.multiply(T(0, 0, q.yo));
        }
        return base;
      }
      case 'follow':
        return rX(followAngle(m.b) * deg, C.FOLLOW.AX[0], C.FOLLOW.AX[1]);
      case 'escl': {
        const sW = st.frames.W || 0,
          E = C.ESCL;
        if (m.s === 'rodY') return T(0, -sW, 0);
        if (m.s === 'rodX') return T(-sW, 0, 0);
        if (m.s === 'bc') return rZ(sW / E.ra, E.px, E.py);
        return rZ(-6 * sW * deg, E.wheel[0], E.wheel[1]);
      }
      case 'stops': return stopsM(m);
      case 'esc2': return esc2M(m);
      case 'fspring': {      // a frame spring: compressed between the strip and the sleeve
        const k = (m.L - (st.frames[m.b] || 0)) / m.L, z0 = m.z0;
        const mm = new M().set(1, 0, 0, 0, 0, 1, 0, C.TIER * st.tier, 0, 0, k, z0 - k * z0, 0, 0, 0, 1);
        return mm;
      }
      case 'lock':
        return T(C.LOCK_SHIFT * st.lock, 0, 0);
      case 'tier':
        return T(0, C.TIER * st.tier, 0);
      case 'ribbon':
        return m.s === 'vib' ? T(-st.slide * U, 0, C.RIB_DROP * (st.rib || 0)) : null; // the strip is bent in place
      case 'camrod':
        return T(0, 0, C.CAM_LIFT[m.k] * camLift(PROFILE[m.k], st.phi));
      case 'cyc':
        return rX(-st.phi * deg, C.CYC[0], C.CYC[1]);
      case 'car':
        return T(st.car - C.CAR0, 0, 0);
      case 'esc':
        return rZ((st.car - C.CAR0) / 5.053, C.ESC[0], C.ESC[1]);
      case 'gov':
        return rX(-C.GOV * st.phi * deg, C.YD, C.CYC[1]);
      case 'rot':
      case 'wind': {
        // motor train: turns with the cycle shaft; winding side with the crank
        const a = (m.t === 'rot' ? st.ncyc * 360 + st.phi : st.wind * 360) * m.k * deg;
        return m.a === 'x' ? rX(a, m.p[0], m.p[1]) : rY(a, m.p[0], m.p[1]);
      }
      default:
        return null;
    }
  }
  // exploded view: each assembly moves off along its own direction
  const EXPL = {
    frame: [0, 0, -70],
    keys: [0, -110, 95],
    levers: [0, -110, 25],
    plates: [0, -80, -55],
    bails: [0, -40, -95],
    sectors: [0, 0, -120],
    select: [0, 30, 55],
    uframe: [0, 70, 120],
    shuttle: [0, 70, 170],
    hammer: [0, 70, 120],
    carriage: [0, 150, 170],
    paper: [0, 150, 170],
    esc: [0, 150, 170],
    ribbon: [0, 110, 230],
    drive: [170, 0, 30],
  };
  const ID = new M(),
    TMP = new M();
  let dirty = true;
  // the ribbon strip: its middle (between the vibrator fingers) rises with the vibrator, the ends stay at the guides
  function bendRibbon() {
    if (!ribbonMesh) return;
    const lz = C.RIB_DROP * st.detent,
      cx = -st.slide * U,
      key = lz * 1000 + cx;
    if (key === ribbonLast) return;
    ribbonLast = key;
    const p = ribbonMesh.geometry.attributes.position,
      a = p.array;
    for (let i = 0; i < a.length; i += 3) {
      const x = ribbonRest[i],
        d = Math.abs(x - cx);
      const w = d <= C.VIB_X ? 1 : Math.max(0, (150 - d) / (150 - C.VIB_X));
      a[i + 2] = ribbonRest[i + 2] + lz * w;
    }
    p.needsUpdate = true;
  }
  function applyState() {
    treeCache = null;
    bendRibbon();
    const e = st.explode;
    for (const mesh of meshes) {
      const mm = matrixFor(mesh.userData.m) || ID,
        ex = EXPL[mesh.userData.g];
      if (ex && e > 0) mesh.matrix.copy(TMP.makeTranslation(ex[0] * e, ex[1] * e, ex[2] * e)).multiply(mm);
      else mesh.matrix.copy(mm);
    }
    const ec = EXPL.carriage;
    sheetGroup.position.set(st.car - C.CAR0 + ec[0] * e, ec[1] * e, ec[2] * e);
    dirty = true;
  }

  // ---------------------------------------------------------------- sheet and typed text
  const LS = 1.6 * C.EM; // line spacing, mm
  let lines = [[]],
    typed = '';
  function drawSheet() {
    sctx.fillStyle = '#fbfaf6';
    sctx.fillRect(0, 0, sheet.width, sheet.height);
    sctx.fillStyle = '#e6e2d8';
    sctx.fillRect(0, (SHEET_TOP - C.ZP) * PX - 0.5, sheet.width, 1);
    sctx.fillStyle = '#20232a';
    lines.forEach((ln, k) => {
      const zb = C.ZP - 0.18 * C.EM + k * LS;
      const y = (SHEET_TOP - zb) * PX;
      if (y < -40) return;
      for (const g of ln) {
        sctx.save();
        sctx.translate(g.x * PX, y);
        sctx.scale(S_FONT * PX, -S_FONT * PX);
        sctx.fill(path2d(g.g));
        sctx.restore();
      }
    });
    tex.needsUpdate = true;
  }
  function paperX(worldX) {
    return worldX - (st.car - 108);
  }
  const cp = (g) => String.fromCodePoint(parseInt(g.slice(3, 7), 16)); // 'uniE050.wide' -> U+E050 (CSUR)
  function strike(it) {
    const hx = -st.slide * U; // hammer axis, world x
    if (isAdv(it)) {
      lines[0].push({ g: it.glyph, x: paperX(hx + it.a * U - it.ax * S_FONT) });
      typed += cp(it.glyph);
      if (it.kind === 'C') {
        lines[0].push({ g: it.mark, x: paperX(hx + it.a * U - it.max * S_FONT) });
        typed += cp(it.mark);
      }
    } else {
      lines[0].push({ g: it.glyph, x: paperX(hx + C.MARKREF * U - it.ax * S_FONT) });
      typed += cp(it.glyph);
    }
    drawSheet();
  }

  // ---------------------------------------------------------------- animation
  let slow = 4;
  function tween(ms, fn, scale) {
    return new Promise((res) => {
      const t0 = performance.now(),
        dur = Math.max(1, ms * (scale === false ? 1 : slow));
      function step(now) {
        const t = Math.min(1, (now - t0) / dur);
        fn(t);
        applyState();
        if (t < 1) requestAnimationFrame(step);
        else res();
      }
      requestAnimationFrame(step);
    });
  }
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  function lugs(it) {
    if (isAdv(it)) return { R: C.TP, W: C.K * (it.w - C.WOFF), B: C.K * it.b, C: C.K * it.c };
    const o = { O: C.TP };
    if (it.below) o.N = C.TP;
    return o;
  }
  async function carriageTo(x, ms) {
    const x0 = st.car;
    await tween(ms, (t) => {
      st.car = x0 + (x - x0) * ease(t);
    });
  }
  async function newLine() {
    await carriageTo(C.CAR0, 380);
    lines.unshift([]);
    if (lines.length > 14) lines.pop();
    typed += '\n';
    drawSheet();
  }
  async function tapKey(n) {
    // a service key: down and up, nothing else
    hit(n, true);
    await tween(90, (t) => {
      st.f[n] = ease(t);
    });
    await tween(90, (t) => {
      st.f[n] = 1 - ease(t);
    });
    hit(n, false);
  }
  async function backspace() {
    await tapKey(46);
    await carriageTo(Math.min(C.CAR0, st.car + U), 100);
  }
  async function backLetter() {
    await tapKey(47);
    await carriageTo(Math.min(C.CAR0, st.car + (st.mem.w || 0) * U), 120);
  }
  async function press(n, tier) {
    const k = keyByN[n];
    if (!k) return;
    if (k.kind === 'space') {
      hit(n, true);
      const w = k.id === 'space4' ? 4 : 6;
      await tween(110, (t) => {
        st.f[n] = ease(t);
      });
      await tween(110, (t) => {
        st.f[n] = 1 - ease(t);
      });
      await carriageTo(st.car - w * U, 100);
      st.mem = { b: 0, c: 0, w };
      typed += ' ';
      hit(n, false);
      return;
    }
    const it = tier ? k.up : k.lo;
    if (!it) return;
    if (st.reserve <= 0) {
      st.msg = 'пружина спущена — заведите';
      flashWind();
      renderState();
      return;
    }
    hit(n, true);
    st.item = it;
    st.tier = tier;
    st.msg = '';
    const target = lugs(it);
    const ret = isAdv(it) ? 0 : (it.below ? st.mem.c : st.mem.b) + C.MARKREF;
    const bits = {};
    for (const b of ['r1', 'r2', 'r4', 'r8']) bits[b] = (k.c >> { r1: 0, r2: 1, r4: 2, r8: 3 }[b]) & 1;
    const code = C.ROW_CODE[k.r]; // shuttle row code of this keyboard row (by frequency)
    bits.l1 = code & 1;
    bits.l2 = (code >> 1) & 1;
    bits.l4 = tier;
    // 1. key down: codes, selector bits, the print unit retracts for a mark
    await tween(150, (t) => {
      const f = ease(t);
      st.f[n] = f;
      for (const b of Object.keys(st.frames))
        st.frames[b] = target[b] !== undefined ? Math.max(0, C.TP * f - (C.TP - target[b])) : 0;
      for (const b in bits) st.bits[b] = bits[b] * f;
      st.slide = ret * f;
    });
    // 2. one revolution of the cycle shaft, paid for by the spring
    const rowT = code + 4 * tier;
    let printed = false;
    await tween(1000 * MOTOR.t_avg, (t) => {
      st.phi = 360 * t;
      const o = camLift('out', st.phi);
      st.pos = HOMEP + (k.c - HOMEP) * o;
      st.row = C.REST_ROW + (rowT - C.REST_ROW) * o;
      st.detent = camLift('detent', st.phi);
      st.rib = camLift('ribbon', st.phi);
      st.hammer = camLift('strike', st.phi);
      st.cock = camLift('cock', st.phi);
      st.lock = lockAt(st.phi);
      if (!printed && st.phi >= C.CYCLE.strike) {
        printed = true;
        strike(it);
      }
    });
    st.phi = 0;
    st.ncyc++;
    st.reserve--;
    st.cock = 0;
    st.lock = 0;
    // 3. key up, memory, feed
    const fr0 = Object.assign({}, st.frames);
    await tween(140, (t) => {
      const f = 1 - ease(t);
      st.f[n] = f;
      for (const b of Object.keys(st.frames)) st.frames[b] = fr0[b] * f;
      for (const b in bits) st.bits[b] = bits[b] * f;
      st.slide = ret * f;
    });
    for (const b of Object.keys(st.frames)) st.frames[b] = 0;
    st.tier = 0;
    if (isAdv(it)) {
      st.mem = { b: it.b, c: it.c, w: it.w };
      await carriageTo(st.car - it.w * U, 110);
      if (C.CAR0 - st.car > C.LINE) await newLine();
    }
    hit(n, false);
  }
  let queue = [],
    busy = false;
  async function pump() {
    if (busy) return;
    busy = true;
    while (queue.length) {
      const job = queue.shift();
      await job();
    }
    busy = false;
  }
  function enqueue(fn) {
    queue.push(fn);
    pump();
  }
  function type(n, tier) {
    enqueue(() => press(n, tier));
  }

  // winding: the crank turns the arbor; the barrel stays put
  async function wind() {
    const need = 1 - st.reserve / MOTOR.chars;
    if (need <= 0.001) return;
    const r0 = st.reserve,
      w0 = st.wind,
      arbor = need * MOTOR.turns;
    await tween(
      Math.min(3000, 400 + 2600 * need),
      (t) => {
        const f = ease(t);
        st.wind = w0 + arbor * f;
        st.reserve = Math.round(r0 + (MOTOR.chars - r0) * f);
      },
      false,
    );
    st.reserve = MOTOR.chars;
    st.msg = '';
  }
  function flashWind() {
    const b = $('wind');
    b.animate([{ background: 'var(--accent-soft)' }, { background: 'var(--panel)' }], { duration: 900, iterations: 2 });
  }

  // ---------------------------------------------------------------- one entry point for every key
  function act(n) {
    const k = keyByN[n];
    if (!k) return;
    if (k.id === 'shift') {
      setShift(!st.shift);
      return;
    }
    if (k.id === 'bksp') {
      enqueue(backspace);
      return;
    }
    if (k.id === 'back') {
      enqueue(backLetter);
      return;
    }
    if (k.kind === 'space') {
      type(n, 0);
      return;
    }
    const tier = st.shift || st.shiftHeld ? 1 : 0;
    if (!(tier ? k.up : k.lo)) return; // reserve slot: the key does nothing
    type(n, tier);
    setShift(false);
  }

  // ---------------------------------------------------------------- on-screen keyboard
  const kb = $('kb');
  const keyEls = {};
  for (let r = 0; r < 4; r++) {
    const row = document.createElement('div');
    row.className = 'kb-row r' + r;
    for (let c = 0; c < 11; c++) {
      const k = D.keys.find((x) => x.kind === 'char' && x.r === r && x.c === c);
      const b = document.createElement('button');
      b.className = 'key' + (k.lo && !isAdv(k.lo) ? ' dead' : '');
      const lat = D.legends[r][c];
      b.innerHTML = legendSvg(k.lo) + (k.up ? legendSvg(k.up, 'up') : '') + `<span class="lat">${lat}</span>`;
      b.setAttribute('aria-label', keyLabel(k));
      b.title = keyLabel(k);
      b.addEventListener('click', () => act(k.n));
      keyEls[k.n] = b;
      row.appendChild(b);
    }
    kb.appendChild(row);
  }
  function keyLabel(k) {
    if (k.kind !== 'char') return k.label;
    const lat = D.legends[k.r][k.c].toUpperCase();
    return `${lat}: ${k.lo ? k.lo.label : 'резерв'}${k.up ? '; с регистром — ' + k.up.label : ''}`;
  }
  const svcEl = { '-5': 'k-shift', '-1': 'k-sp4', 44: 'k-sp6', 46: 'k-bk', 47: 'k-back' };
  const hits = new Set();
  function capLook(n) {
    const cap = caps[n];
    if (!cap) return;
    const m = cap.material;
    if (hits.has(n)) {
      m.emissive.set(0xb07a1c);
      m.emissiveIntensity = 0.8;
    } else if (hover === n) {
      m.emissive.set(0x3c6a96);
      m.emissiveIntensity = 0.55;
    } else {
      m.emissive.set(0x000000);
      m.emissiveIntensity = 0;
    }
    dirty = true;
  }
  function hit(n, on) {
    const el = keyEls[n] || (svcEl[n] && $(svcEl[n]));
    if (el && n !== -5) el.classList.toggle('hit', on);
    on ? hits.add(n) : hits.delete(n);
    capLook(n);
  }
  function setShift(v) {
    st.shift = v;
    $('k-shift').setAttribute('aria-pressed', v ? 'true' : 'false');
    applyState();
  }
  $('k-shift').addEventListener('click', () => act(-5));
  $('k-sp4').addEventListener('click', () => act(-1));
  $('k-sp6').addEventListener('click', () => act(44));
  $('k-bk').addEventListener('click', () => act(46));
  $('k-back').addEventListener('click', () => act(47));
  $('k-nl').addEventListener('click', () => enqueue(newLine));
  $('wind').addEventListener('click', () => enqueue(wind));
  $('speed').addEventListener('change', (e) => {
    slow = +e.target.value;
  });
  $('clear').addEventListener('click', () =>
    enqueue(async () => {
      lines = [[]];
      typed = '';
      drawSheet();
      await carriageTo(C.CAR0, 300);
    }),
  );
  const demoSel = $('demo');
  for (const name of Object.keys(D.demo)) {
    const o = document.createElement('option');
    o.value = name;
    o.textContent = name;
    demoSel.appendChild(o);
  }
  demoSel.addEventListener('change', () => {
    const seq = D.demo[demoSel.value];
    demoSel.value = '';
    if (!seq) return;
    enqueue(newLine);
    for (const [n, t] of seq) type(n, t);
  });
  // ---------------------------------------------------------------- rev. 0.9c: typing by transcription; pictures
  const itemOf = (k) => {
    const w = C.WHERE[String(k)];
    if (!w) return null;
    const kk = keyByN[w[0]];
    return kk ? (w[1] ? kk.up : kk.lo) : null;
  };
  // where the machine puts each sign: a dry run of press() -- an advancing letter is struck from the hammer axis and
  // moves the carriage by its width, a mark is struck with the unit retracted by the remembered b or c
  function compose(items) {
    let car = 0,
      mem = { b: 0, c: 0, w: 0 };
    const out = [[]];
    for (const x of items) {
      const ln = out[out.length - 1];
      if (x.k === '\n') {
        out.push([]);
        car = 0;
        mem = { b: 0, c: 0, w: 0 };
        continue;
      }
      if (x.k === ' ') {
        car -= 6 * U;
        mem = { b: 0, c: 0, w: 6 };
        continue;
      }
      const it = x.k === null ? null : itemOf(x.k);
      if (!it) continue;
      if (isAdv(it)) {
        ln.push({ g: it.glyph, x: it.a * U - it.ax * S_FONT - car });
        if (it.kind === 'C') ln.push({ g: it.mark, x: it.a * U - it.max * S_FONT - car });
        mem = { b: it.b, c: it.c, w: it.w };
        car -= it.w * U;
      } else {
        const slide = (it.below ? mem.c : mem.b) + C.MARKREF;
        ln.push({ g: it.glyph, x: -slide * U + C.MARKREF * U - it.ax * S_FONT - car });
      }
    }
    return out;
  }
  // a picture of lines of signs (first line on top), sizes in mm
  function glyphSvg(ls, opts) {
    opts = opts || {};
    let x0 = Infinity,
      x1 = -Infinity;
    for (const ln of ls) for (const g of ln) (x0 = Math.min(x0, g.x)), (x1 = Math.max(x1, g.x));
    if (!isFinite(x0)) (x0 = 0), (x1 = 0);
    const m = opts.margin === undefined ? 4 : opts.margin;
    const vx = x0 - m,
      vw = x1 - x0 + 2 * m + 16 * U,
      vy = -0.95 * C.EM - m,
      vh = (ls.length - 1) * LS + 1.45 * C.EM + 2 * m;
    let body = '';
    ls.forEach((ln, j) => {
      for (const g of ln)
        body += `<path transform="translate(${g.x.toFixed(3)} ${(j * LS).toFixed(3)}) scale(${S_FONT} ${-S_FONT})" d="${D.paths[g.g]}"/>`;
    });
    const bg = opts.bg ? `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="${opts.bg}"/>` : '';
    const size = opts.px ? '' : ` width="${vw.toFixed(2)}mm" height="${vh.toFixed(2)}mm"`;
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg"${size} viewBox="${vx.toFixed(3)} ${vy.toFixed(3)} ${vw.toFixed(3)} ${vh.toFixed(3)}">${bg}<g fill="${opts.ink || '#20232a'}">${body}</g></svg>`,
      w: vw,
      h: vh,
    };
  }
  function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
  }
  function exportSvg(ls, name) {
    const P = glyphSvg(ls, { bg: '#ffffff' });
    download(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + P.svg], { type: 'image/svg+xml' }), name + '.svg');
  }
  function exportPng(ls, name) {
    const P = glyphSvg(ls, { bg: '#ffffff' }),
      dpmm = 600 / 25.4;
    const img = new Image(),
      url = URL.createObjectURL(new Blob([P.svg], { type: 'image/svg+xml' }));
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = Math.ceil(P.w * dpmm);
      cv.height = Math.ceil(P.h * dpmm);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url);
      cv.toBlob((b) => download(b, name + '.png'), 'image/png');
    };
    img.src = url;
  }
  const sheetLines = () => lines.slice().reverse().filter((ln, i, a) => ln.length || i < a.length - 1);
  let trRes = { items: [], warnings: [] };
  function trUpdate() {
    trRes = TPM2_TR.transcribe($('tr-in').value, $('tr-mode').value);
    const ls = compose(trRes.items);
    $('tr-prev').innerHTML = trRes.items.length ? glyphSvg(ls, { margin: 1.5, px: true }).svg : '';
    const keys = $('tr-keys');
    keys.innerHTML = '';
    for (const x of trRes.items) {
      const d = document.createElement('span');
      if (x.k === ' ' || x.k === '\n') {
        d.className = 'gap';
        keys.appendChild(d);
        continue;
      }
      const w = x.k === null ? null : C.WHERE[String(x.k)];
      if (!w) {
        d.className = 'tk bad';
        d.textContent = x.src || '?';
        d.title = x.warn || 'знака нет на раскладке';
        keys.appendChild(d);
        continue;
      }
      const k = keyByN[w[0]],
        it = itemOf(x.k);
      d.className = 'tk' + (isAdv(it) ? '' : ' dead');
      d.innerHTML = legendSvg(it, '') + `<span>${(w[1] ? '⇧' : '') + D.legends[k.r][k.c].toUpperCase()}</span>`;
      d.title = (x.src ? x.src + ': ' : '') + (it.label || '') + (x.warn ? ' — ' + x.warn : '');
      keys.appendChild(d);
    }
    const ws = [...new Set(trRes.warnings)];
    $('tr-warn').textContent = ws.length ? 'Не напечатается: ' + ws.join('; ') + '.' : '';
  }
  $('tr-in').addEventListener('input', trUpdate);
  $('tr-mode').addEventListener('change', trUpdate);
  $('tr-print').addEventListener('click', () => {
    trUpdate();
    if (!trRes.items.length) return;
    if (lines[0].length) enqueue(newLine);
    for (const x of trRes.items) {
      if (x.k === ' ') type(44, 0);
      else if (x.k === '\n') enqueue(newLine);
      else if (x.k !== null && C.WHERE[String(x.k)]) type(...C.WHERE[String(x.k)]);
    }
  });
  $('tr-svg').addEventListener('click', () => trRes.items.length && exportSvg(compose(trRes.items), 'tengwar'));
  $('tr-png').addEventListener('click', () => trRes.items.length && exportPng(compose(trRes.items), 'tengwar'));
  $('sheet-svg').addEventListener('click', () => exportSvg(sheetLines(), 'tpm2-sheet'));
  $('sheet-png').addEventListener('click', () => exportPng(sheetLines(), 'tpm2-sheet'));
  $('tr-in').value = 'Elen síla lúmenn’ omentielvo';
  trUpdate();
  $('copy').addEventListener('click', async () => {
    const out = $('copied'),
      text = typed.replace(/^\n+/, '');
    if (!text) {
      out.textContent = 'лист пуст';
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      out.textContent = 'скопировано: ' + [...text].length + ' знаков';
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (e2) {}
      ta.remove();
      out.textContent = ok ? 'скопировано' : 'браузер не дал скопировать';
    }
  });

  // physical keyboard
  const charMap = {};
  D.legends.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) charMap[row[c].toLowerCase()] = { r, c };
  });
  function codeMap(code) {
    // physical position for non-latin layouts
    const rows = [
      'Digit1 Digit2 Digit3 Digit4 Digit5 Digit6 Digit7 Digit8 Digit9 Digit0 Minus',
      'KeyQ KeyW KeyE KeyR KeyT KeyY KeyU KeyI KeyO KeyP BracketLeft',
      'KeyA KeyS KeyD KeyF KeyG KeyH KeyJ KeyK KeyL Semicolon Quote',
      'KeyZ KeyX KeyC KeyV KeyB KeyN KeyM Comma Period Slash Backslash',
    ];
    for (let r = 0; r < 4; r++) {
      const c = rows[r].split(' ').indexOf(code);
      if (c >= 0) return { r, c };
    }
    return null;
  }
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'SELECT' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Shift') {
      st.shiftHeld = true;
      applyState();
      return;
    }
    if (e.key === ' ') {
      e.preventDefault();
      act(44);
      return;
    }
    if (e.key === 'Enter') {
      enqueue(newLine);
      return;
    }
    if (e.key === 'Backspace') {
      e.preventDefault();
      act(47);
      return;
    }
    const pos = codeMap(e.code) || charMap[e.key.toLowerCase()];
    if (!pos) return;
    const k = D.keys.find((x) => x.kind === 'char' && x.r === pos.r && x.c === pos.c);
    if (k) {
      e.preventDefault();
      st.shiftHeld = e.shiftKey;
      act(k.n);
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
      st.shiftHeld = false;
      applyState();
    }
  });
  window.addEventListener('blur', () => {
    st.shiftHeld = false;
    applyState();
  });

  // ---------------------------------------------------------------- clicking the model's keys
  const ray = new THREE.Raycaster(),
    ndc = new THREE.Vector2(),
    tip = $('tip');
  const capList = Object.values(caps);
  let hover = null,
    down = null;
  function pick(ev) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const vis = capList.filter((m) => m.visible);
    const hitp = ray.intersectObjects(vis, false)[0];
    return hitp ? hitp.object.userData.m.n : null;
  }
  function setHover(n, ev) {
    if (n !== hover) {
      const old = hover;
      hover = n;
      if (old !== null) capLook(old);
      if (n !== null) capLook(n);
      canvas.style.cursor = n !== null ? 'pointer' : '';
    }
    if (n !== null && ev) {
      const r = canvas.parentElement.getBoundingClientRect();
      tip.textContent = keyLabel(keyByN[n]);
      tip.style.display = 'block';
      tip.style.left = Math.min(ev.clientX - r.left + 14, r.width - tip.offsetWidth - 8) + 'px';
      tip.style.top = ev.clientY - r.top + 16 + 'px';
    } else tip.style.display = 'none';
  }
  canvas.addEventListener('pointerdown', (ev) => {
    down = { x: ev.clientX, y: ev.clientY, n: ev.button === 0 ? pick(ev) : null };
    try {
      canvas.setPointerCapture(ev.pointerId);
    } catch (e) {} // the release is seen even off the canvas
  });
  canvas.addEventListener('pointercancel', () => {
    down = null;
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (ev.pointerType === 'mouse' && !ev.buttons) setHover(pick(ev), ev);
    else if (ev.buttons) setHover(null);
  });
  canvas.addEventListener('pointerleave', () => setHover(null));
  canvas.addEventListener('pointerup', (ev) => {
    if (down && down.n !== null && Math.hypot(ev.clientX - down.x, ev.clientY - down.y) < 6) {
      const n = pick(ev);
      if (n === down.n) act(n);
    }
    down = null;
  });

  // ---------------------------------------------------------------- instruments
  const f1 = (x) => x.toFixed(1).replace('.', ',');
  let stateT = 0;
  function renderState() {
    const it = st.item;
    const phase =
      st.hammer > 0.95
        ? ' — удар'
        : st.detent > 0.5
          ? ' — фиксаторы'
          : st.phi > C.CYCLE.out[0] && st.phi < C.CYCLE.out[1]
            ? ' — вывод челнока'
            : st.phi > C.CYCLE.back[0] && st.phi < C.CYCLE.back[1]
              ? ' — возврат'
              : '';
    const rows = [
      ['литера', it ? it.label : '—'],
      [
        'код',
        it
          ? isAdv(it)
            ? `w ${it.w}  b ${it.b}  c ${it.c}`
            : it.below
              ? 'знак снизу (отвод c)'
              : 'знак сверху (отвод b)'
          : '—',
      ],
      ['память', `b ${st.mem.b}  c ${st.mem.c}  w ${st.mem.w}`],
      ['регистр', st.shift || st.shiftHeld ? 'верхний' : 'нижний'],
      ['отвод узла', `${f1(st.slide)} u (${f1(st.slide * U)} мм)`],
      ['челнок', `позиция ${f1(st.pos + 1)}, ряд ${f1(st.row + 1)}`],
      ['цикловой вал', `${Math.round(st.phi)}°${phase}`],
      ['каретка', `${f1((C.CAR0 - st.car) / U)} u от начала строки`],
      ['знаков набрано', String(st.ncyc)],
    ];
    if (st.msg) rows.push(['', st.msg]);
    $('state').innerHTML = rows
      .map(([a, b]) => `<dt>${a}</dt><dd${a === '' ? ' class="warn"' : ''}>${b}</dd>`)
      .join('');
    const pct = st.reserve / MOTOR.chars;
    const meter = $('meter');
    meter.firstElementChild.style.width = (100 * pct).toFixed(1) + '%';
    meter.classList.toggle('low', pct < 0.1);
    meter.setAttribute('aria-valuenow', Math.round(100 * pct));
    const left = (1 - pct) * MOTOR.crank;
    $('windlbl').textContent =
      `осталось ${st.reserve} знаков из ${MOTOR.chars}` +
      (st.reserve >= MOTOR.chars
        ? ' · заведена полностью'
        : ` · до полного завода ${left < 1 ? 'меньше оборота' : Math.round(left) + ' об.'} ручки`);
    drawCycle();
  }
  // timing diagram of the cycle cams
  const cv = $('cyc'),
    cx2 = cv.getContext('2d');
  function drawCycle() {
    const W = cv.width,
      H = cv.height,
      L = 128,
      R = W - 12,
      top = 12,
      bot = H - 34;
    const X = (a) => L + ((R - L) * a) / 360;
    const ink = css('--ink'),
      mut = css('--muted'),
      line = css('--line'),
      acc = css('--accent'),
      stl = css('--steel'),
      warn = css('--warn');
    cx2.clearRect(0, 0, W, H);
    cx2.font = '20px "IBM Plex Mono", monospace';
    cx2.textBaseline = 'middle';
    const c = C.CYCLE;
    cx2.fillStyle = line;
    cx2.globalAlpha = 0.5;
    cx2.fillRect(X(c.feed[0]), top, X(c.feed[1]) - X(c.feed[0]), bot - top);
    cx2.globalAlpha = 1;
    const lanes = [
      ['челнок', (a) => camLift('out', a), acc],
      ['фиксаторы', (a) => camLift('detent', a), stl],
      ['молоток', (a) => camLift('strike', a), warn],
    ];
    const lh = (bot - top) / lanes.length;
    lanes.forEach(([name, f, col], i) => {
      const y0 = top + lh * (i + 1) - 6,
        amp = lh - 14;
      cx2.strokeStyle = line;
      cx2.lineWidth = 1;
      cx2.beginPath();
      cx2.moveTo(L, y0);
      cx2.lineTo(R, y0);
      cx2.stroke();
      cx2.strokeStyle = col;
      cx2.lineWidth = 3;
      cx2.beginPath();
      for (let a = 0; a <= 360; a += 2) {
        const y = y0 - amp * f(a);
        a ? cx2.lineTo(X(a), y) : cx2.moveTo(X(a), y);
      }
      cx2.stroke();
      cx2.fillStyle = mut;
      cx2.textAlign = 'right';
      cx2.fillText(name, L - 10, y0 - amp / 2);
    });
    cx2.fillStyle = mut;
    cx2.textAlign = 'center';
    for (const a of [0, 90, 180, 270, 360]) cx2.fillText(a + '°', X(a), H - 16);
    cx2.save();
    cx2.translate((X(c.feed[0]) + X(c.feed[1])) / 2, (top + bot) / 2);
    cx2.rotate(-Math.PI / 2);
    cx2.fillText('подача', 0, 0);
    cx2.restore();
    cx2.strokeStyle = ink;
    cx2.lineWidth = 2;
    cx2.beginPath();
    cx2.moveTo(X(st.phi), top - 4);
    cx2.lineTo(X(st.phi), bot + 4);
    cx2.stroke();
  }

  // ---------------------------------------------------------------- views and toggles
  const VIEWS = {
    'v-all': [
      [-620, -820, 640],
      [0, -130, 150],
    ],
    'v-kb': [
      [0, -640, 470],
      [0, -285, 75],
    ],
    'v-unit': [
      [300, 260, 380],
      [10, -40, 170],
    ],
    'v-code': [
      [-300, -560, -260],
      [0, -280, 40],
    ],
    'v-drive': [
      [560, -520, 380],
      [150, -140, 40],
    ],
    'v-sheet': [
      [40, -360, 470],
      [0, 0, 270],
    ],
    'v-eye': [[0, -720, 460], [0, 0, C.ZP + 15], 20],
  };
  // camera moves smoothly between views (idea from the drafting-machine model); the eye view also narrows the lens
  let camTween = 0;
  function setView(id, instant) {
    const [e, t, fov] = VIEWS[id];
    for (const k of Object.keys(VIEWS)) $(k).setAttribute('aria-pressed', k === id ? 'true' : 'false');
    const p0 = camera.position.clone(),
      t0 = controls.target.clone(),
      f0 = camera.fov,
      f1 = fov || 32;
    const p1 = new THREE.Vector3(...e),
      t1 = new THREE.Vector3(...t);
    if (instant || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      camera.position.copy(p1);
      controls.target.copy(t1);
      camera.fov = f1;
      camera.updateProjectionMatrix();
      controls.update();
      dirty = true;
      return;
    }
    const my = ++camTween,
      T0 = performance.now(),
      dur = 650;
    (function step(now) {
      if (my !== camTween) return;
      const k = ease(Math.min(1, (now - T0) / dur));
      camera.position.lerpVectors(p0, p1, k);
      controls.target.lerpVectors(t0, t1, k);
      camera.fov = f0 + (f1 - f0) * k;
      camera.updateProjectionMatrix();
      controls.update();
      dirty = true;
      if (k < 1) requestAnimationFrame(step);
    })(T0);
  }
  for (const id of Object.keys(VIEWS)) $(id).addEventListener('click', () => setView(id));
  function toggle(id, test) {
    $(id).addEventListener('change', (e) => {
      for (const m of meshes) if (test(m.userData)) m.visible = !e.target.checked && m.userData.n !== 'paper';
      if (id === 't-car') sheetGroup.visible = !e.target.checked;
      if (id === 't-keys') setHover(null);
    });
  }
  toggle('t-car', (p) => p.g === 'carriage' || p.g === 'paper' || p.g === 'esc');
  toggle('t-keys', (p) => p.g === 'keys');
  // ghost frame: the frame, beams and posts become translucent glass
  const ghostMat = new THREE.MeshStandardMaterial({
    color: 0x9fb0c4,
    transparent: true,
    opacity: 0.13,
    depthWrite: false,
    roughness: 0.2,
    side: THREE.DoubleSide,
  });
  $('t-ghost').addEventListener('change', (e) => {
    for (const m of meshes)
      if (m.userData.g === 'frame') {
        if (!m.userData.mat0) m.userData.mat0 = m.material;
        m.material = e.target.checked ? ghostMat : m.userData.mat0;
        m.castShadow = !e.target.checked;
      }
    dirty = true;
  });
  $('t-expl').addEventListener('change', (e) => {
    const e0 = st.explode,
      e1 = e.target.checked ? 1 : 0;
    tween(
      700,
      (t) => {
        st.explode = e0 + (e1 - e0) * ease(t);
      },
      false,
    );
  });
  $('t-spin').addEventListener('change', (e) => {
    controls.autoRotate = e.target.checked;
  });
  controls.addEventListener('start', () => {
    camTween++; // a drag takes over from a running view transition
    if (controls.autoRotate) {
      controls.autoRotate = false;
      $('t-spin').checked = false;
    }
  });

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / Math.max(1, r.height);
    camera.updateProjectionMatrix();
    dirty = true;
  }
  window.addEventListener('resize', resize);
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);
  } catch (e) {}
  resize();
  setView('v-all', true);
  setTheme();
  drawSheet();
  applyState();
  renderState();
  controls.addEventListener('change', () => {
    dirty = true;
  });
  (function loop(now) {
    controls.update();
    if (dirty || controls.autoRotate) {
      renderer.render(scene, camera);
      dirty = false;
    }
    if (!stateT || now - stateT > 90) {
      renderState();
      stateT = now || 1;
    }
    requestAnimationFrame(loop);
  })();

  // hooks for automated checks
  window.__tpm = {
    st,
    act,
    keys: D.keys,
    caps,
    camera,
    pickAt: (x, y) => pick({ clientX: x, clientY: y }),
    compose: (items) => compose(items),
    tr: () => trRes,
    lines: () => lines,
    idle: () => !busy && !queue.length,
    typed: () => typed,
    setView,
    scene,
    apply: applyState,
  };
  window.__READY = true;
})();
