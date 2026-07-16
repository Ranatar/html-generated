/**
 * projections.test.js — регрессионные харнессы движка проекций.
 * Подключаются ОТДЕЛЬНО от рендерера: атлас грузит только projections.js.
 * Запуск:  node projections.test.js
 * Каждая функция __test_batchN / __selftest возвращает { pass, checks }.
 */

import {
  CE_Kp,
  eePoly,
  DEG,
  GOODE_PHISTAR,
  HALF_PI,
  M,
  MS3_PHIB,
  M_inv,
  PI,
  PROJECTIONS,
  SQRT1_2,
  SQRT2,
  TAU,
  acos_c,
  authalic_lat,
  chorner,
  conformal_lat,
  ellipticF,
  ellipticK,
  gd,
  gd_inv,
  hasForward,
  mergeParams,
  tissotFromForward,
  tissotOf,
} from './projections.js';

/**
 * Проверяет тождества хелперов и сверяет константу K′ с карточкой эллипса.
 * Не вызывается при импорте. @returns {{pass:boolean, checks:Array}}
 */
export function __selftest() {
  const checks = [];
  const near = (name, got, exp, tol = 1e-6) => {
    const ok = Math.abs(got - exp) <= tol;
    checks.push({ name, got, exp, ok });
    return ok;
  };

  // gd / gd_inv взаимно обратны
  near('gd(gd_inv(0.7))', gd(gd_inv(0.7)), 0.7);
  // сфера: вспомогательные широты и дуга меридиана сводятся к φ
  near('M(1.0, e=0)', M(1.0, 0), 1.0);
  near('M_inv(M(0.9))', M_inv(M(0.9, 0), 0), 0.9);
  near('conformal_lat(0.6, e=0)', conformal_lat(0.6, 0), 0.6);
  near('authalic_lat(0.6, e=0)', authalic_lat(0.6, 0), 0.6);
  // эллипсоидальная сверка: e=0.0822 (WGS84) — широты должны слегка отличаться
  checks.push({ name: 'conformal_lat(0.6, WGS84) ≠ 0.6',
    ok: Math.abs(conformal_lat(0.6, 0.0818191908) - 0.6) > 1e-4 });

  // K(1/√2) — лемнискатическая константа 1.8540746773…
  near('ellipticK(1/√2)', ellipticK(SQRT1_2), 1.8540746773, 1e-7);
  // K′ из карточки «Адамса: мир в эллипсе»: F(π/2, cos 23.8958°) = 2.34767
  near("ellipticK(cos 23.8958°) = K′ карточки",
    ellipticK(Math.cos(23.8958 * DEG)), 2.34767, 1e-4);
  // F нечётна и аддитивна по π
  near('ellipticF(−0.5) = −F(0.5)', ellipticF(-0.5, SQRT1_2), -ellipticF(0.5, SQRT1_2));
  near('ellipticF(π/2) = K', ellipticF(HALF_PI, SQRT1_2), ellipticK(SQRT1_2));

  // комплексный Горнер: Σ z^j, j=1..3 при z=1 → 3
  const h3 = chorner([[1, 0], [1, 0], [1, 0]], [1, 0]);
  near('chorner Σz^j|z=1', h3[0], 3); near('chorner im', h3[1], 0);

  // Тиссо на равнопромежуточной (R=1, φ1=0): экватор ⇒ a=b=1 (неискажённо)
  const equirectRaw = (lam, phi) => [lam, phi];
  const t = tissotFromForward(equirectRaw, 0, 0, { R: 1 });
  near('equirect tissot a@eq', t.a, 1, 1e-4);
  near('equirect tissot b@eq', t.b, 1, 1e-4);
  near('equirect tissot ω@eq', t.omega, 0, 1e-4);

  const pass = checks.every((c) => c.ok);
  return { pass, checks };
}
/* ───────────────── Самопроверка батча 1 (§9) ───────────────── */
export function __test_batch1() {
  const checks = [];
  const ok = (name, cond) => { checks.push({ name, ok: !!cond }); return cond; };
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const close2 = (p, q, t = 1e-9) => close(p[0], q[0], t) && close(p[1], q[1], t);

  const ids = ['equirect', 'mercator', 'tmerc', 'cassini', 'lambert-cea',
    'gall-stereo', 'miller', 'central-cyl', 'oblique-mercator', 'space-oblique-mercator'];

  // (а) все зарегистрированы, forward — функция
  for (const id of ids) ok(`${id}: registered+forward`, hasForward(id));

  // (б) центр (λ0, 0) → [0,0] (кроме косой Меркатора — у неё своя ос. линия)
  for (const id of ids) {
    if (id === 'oblique-mercator') continue;
    const P = mergeParams(PROJECTIONS[id]);
    ok(`${id}: центр→[0,0]`, close2(PROJECTIONS[id].forward(P.lon0, 0, P), [0, 0], 1e-9));
  }

  // (в) round-trip forward∘inverse в безопасной зоне
  const pts = [[10 * DEG, 20 * DEG], [-30 * DEG, -15 * DEG], [45 * DEG, 35 * DEG], [-60 * DEG, 5 * DEG]];
  for (const id of ids) {
    const def = PROJECTIONS[id];
    if (typeof def.inverse !== 'function') continue;
    const P = mergeParams(def);
    const local = (id === 'tmerc' || id === 'cassini')   // поперечные — узкая по λ полоса
      ? [[8 * DEG, 20 * DEG], [-12 * DEG, -25 * DEG], [15 * DEG, 40 * DEG]]
      : (id === 'oblique-mercator')
        ? [[5 * DEG, 38 * DEG], [-8 * DEG, 30 * DEG], [12 * DEG, 45 * DEG]]
        : pts;
    let good = true;
    for (const [l, f] of local) {
      const xy = def.forward(l, f, P);
      const lf = def.inverse(xy[0], xy[1], P);
      if (!close2([l, f], lf, 1e-7)) { good = false; break; }
    }
    ok(`${id}: round-trip`, good);
  }

  // (г) сверка независимо вычисленных значений (R=1, λ0=0)
  const P0 = { R: 1, lon0: 0, phi1: 0, phi0: 0, k0: 1 };
  ok('mercator y(45°)=0.8813735870',
    close(PROJECTIONS['mercator'].forward(0, 45 * DEG, P0)[1], 0.8813735870, 1e-9));
  ok('gall y(45°)=√2/2',
    close(PROJECTIONS['gall-stereo'].forward(0, 45 * DEG, P0)[1], SQRT2 / 2, 1e-9));
  ok('lambert-cea равновеликость y(90°)=1/cosφs|φs=0 → 1',
    close(PROJECTIONS['lambert-cea'].forward(0, HALF_PI, P0)[1], 1, 1e-12));
  // SOM: центр→[0,0] и конечность в произвольной точке
  ok('SOM центр→[0,0]',
    close2(PROJECTIONS['space-oblique-mercator'].forward(0, 0,
      mergeParams(PROJECTIONS['space-oblique-mercator'])), [0, 0], 1e-9));
  {
    const Psom = mergeParams(PROJECTIONS['space-oblique-mercator']);
    const xy = PROJECTIONS['space-oblique-mercator'].forward(10 * DEG, 20 * DEG, Psom);
    ok('SOM конечен в (10°,20°)', isFinite(xy[0]) && isFinite(xy[1]));
  }

  // (д) Тиссо: Меркатор конформен (a≈b), Ламберт-ЦЭА равновелик (area≈1)
  const tM = tissotOf('mercator', 0, 40 * DEG);
  ok('mercator: a≈b (конформна)', close(tM.a, tM.b, 1e-4));
  const tL = tissotOf('lambert-cea', 0, 40 * DEG);
  ok('lambert-cea: area≈1 (равновелика)', close(tL.area, 1, 1e-4));

  const pass = checks.every((c) => c.ok);
  return { pass, checks };
}
/* ───────────────── Самопроверка батча 2a (§9) ───────────────── */
export function __test_batch2a() {
  const checks = [];
  const ok = (name, cond) => { checks.push({ name, ok: !!cond }); return cond; };
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const close2 = (p, q, t = 1e-9) => close(p[0], q[0], t) && close(p[1], q[1], t);

  const withFwd = ['sinusoidal', 'mollweide', 'eckert1', 'eckert2', 'eckert3', 'eckert4',
    'eckert5', 'eckert6', 'robinson', 'kavrayskiy7', 'wagner6', 'collignon', 'craster',
    'boggs', 'goode', 'quartic'];

  // (а) регистрация
  for (const id of withFwd) ok(`${id}: registered+forward`, hasForward(id));
  // natural-earth оживлён: делегирует в natural-earth-1 (Natural Earth ≡ Natural Earth I)
  ok('natural-earth: forward (≡ natural-earth-1)', hasForward('natural-earth'));
  {
    const P = { R: 1, lon0: 0 }; let same = true;
    for (const [l, f] of [[40 * DEG, 30 * DEG], [-120 * DEG, -50 * DEG], [150 * DEG, 20 * DEG]]) {
      const a = PROJECTIONS['natural-earth'].forward(l, f, P);
      const b = PROJECTIONS['natural-earth-1'].forward(l, f, P);
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 1e-15) same = false;
    }
    ok('natural-earth = natural-earth-1 (побитово)', same);
  }

  // (б) центр (λ0,0) → [0,0]
  for (const id of withFwd) {
    const P = mergeParams(PROJECTIONS[id]);
    ok(`${id}: центр→[0,0]`, close2(PROJECTIONS[id].forward(P.lon0, 0, P), [0, 0], 1e-9));
  }

  // (в) round-trip forward∘inverse в безопасной зоне (без полюсов)
  const pts = [[10 * DEG, 20 * DEG], [-30 * DEG, -15 * DEG], [55 * DEG, 35 * DEG], [-50 * DEG, 50 * DEG]];
  for (const id of withFwd) {
    const def = PROJECTIONS[id];
    if (typeof def.inverse !== 'function') continue;   // boggs — обратки нет
    const P = mergeParams(def);
    let good = true;
    for (const [l, f] of pts) {
      const xy = def.forward(l, f, P);
      const lf = def.inverse(xy[0], xy[1], P);
      if (!close2([l, f], lf, 1e-6)) { good = false; break; }
    }
    ok(`${id}: round-trip`, good);
  }

  // (г) равновеликость через Тиссо: area≈1 у равновеликих членов (φ=30°)
  for (const id of ['sinusoidal', 'mollweide', 'eckert2', 'eckert4', 'eckert6',
    'collignon', 'craster', 'quartic', 'goode']) {
    const t = tissotOf(id, 0, 30 * DEG);
    ok(`${id}: area≈1 (равновелика)`, t && close(t.area, 1, 2e-4));
  }
  // boggs равновелика, но без inverse — Тиссо всё равно из forward
  ok('boggs: area≈1', (() => { const t = tissotOf('boggs', 0, 30 * DEG); return t && close(t.area, 1, 2e-4); })());

  // (д) независимые числовые ориентиры (R=1, λ0=0)
  const P0 = { R: 1, lon0: 0 };
  ok('mollweide y(90°)=√2', close(PROJECTIONS['mollweide'].forward(0, HALF_PI, P0)[1], SQRT2, 1e-9));
  ok('collignon вершина y(90°)=√π', close(PROJECTIONS['collignon'].forward(0, HALF_PI, P0)[1], Math.sqrt(PI), 1e-9));
  ok('quartic y(90°)=√2', close(PROJECTIONS['quartic'].forward(0, HALF_PI, P0)[1], SQRT2, 1e-9));
  ok('robinson X(0)=1 → x=0.8487·Δλ', close(PROJECTIONS['robinson'].forward(1, 0, P0)[0], 0.8487, 1e-9));
  ok('goode сшивка непрерывна на φ*',
    close(PROJECTIONS['goode'].forward(0, GOODE_PHISTAR, P0)[1],
          PROJECTIONS['goode'].forward(0, GOODE_PHISTAR + 1e-7, P0)[1], 1e-5));

  const pass = checks.every((c) => c.ok);
  return { pass, checks };
}
/* ───────────────── Самопроверка батча 2b (§9) ───────────────── */
export function __test_batch2b() {
  const checks = [];
  const ok = (name, cond) => { checks.push({ name, ok: !!cond }); return cond; };
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const close2 = (p, q, t = 1e-9) => close(p[0], q[0], t) && close(p[1], q[1], t);

  const ids = ['patterson', 'wagner4', 'hatano', 'mt-fps', 'mt-fpp', 'mt-fpq', 'mcbryde-s3',
    'putnins-p5', 'denoyer', 'loximuthal', 'equal-earth', 'natural-earth-1', 'natural-earth-2',
    'tobler-hyperelliptical', 'healpix', 'times', 'hufnagel'];

  // (а) регистрация
  for (const id of ids) ok(`${id}: registered+forward`, hasForward(id));

  // (б) центр (λ0,0) → [0,0]
  for (const id of ids) {
    const P = mergeParams(PROJECTIONS[id]);
    ok(`${id}: центр→[0,0]`, close2(PROJECTIONS[id].forward(P.lon0, 0, P), [0, 0], 1e-9));
  }

  // (в) round-trip forward∘inverse в безопасной зоне (без полюсов/швов)
  const pts = [[10 * DEG, 20 * DEG], [-30 * DEG, -15 * DEG], [55 * DEG, 35 * DEG], [-50 * DEG, 48 * DEG]];
  for (const id of ids) {
    const def = PROJECTIONS[id];
    if (typeof def.inverse !== 'function') continue;   // denoyer — обратки нет
    const P = mergeParams(def);
    const tol = (id === 'tobler-hyperelliptical') ? 1e-4 : 1e-6; // tobler — бисекция
    const local = (id === 'healpix' || id === 'mcbryde-s3')
      ? [[10 * DEG, 25 * DEG], [-30 * DEG, -20 * DEG], [40 * DEG, 65 * DEG], [-20 * DEG, 70 * DEG]]
      : pts;
    let good = true;
    for (const [l, f] of local) {
      const xy = def.forward(l, f, P);
      const lf = def.inverse(xy[0], xy[1], P);
      if (!close2([l, f], lf, tol)) { good = false; break; }
    }
    ok(`${id}: round-trip`, good);
  }

  // (г) равновеликость через Тиссо: масштаб площади ПОСТОЯНЕН (area@20° ≈ area@55°)
  const equalArea = ['wagner4', 'hatano', 'mt-fps', 'mt-fpp', 'mt-fpq', 'mcbryde-s3',
    'equal-earth', 'tobler-hyperelliptical', 'hufnagel', 'healpix'];
  for (const id of equalArea) {
    const a1 = tissotOf(id, 0, 20 * DEG);
    const a2 = tissotOf(id, 30 * DEG, 55 * DEG);       // λ=30° — внутри доли HEALPix (шов на λ=0)
    ok(`${id}: area постоянна`, a1 && a2 && close(a1.area, a2.area, Math.max(2e-3, a1.area * 2e-3)));
  }
  // строго единичные (площадь = 1) — equal-earth и tobler
  ok('equal-earth: area≈1', close(tissotOf('equal-earth', 0, 30 * DEG).area, 1, 2e-3));
  ok('tobler: area≈1', close(tissotOf('tobler-hyperelliptical', 0, 30 * DEG).area, 1, 2e-3));
  // healpix: масштаб = 3π/8
  ok('healpix: area≈3π/8', close(tissotOf('healpix', 0, 20 * DEG).area, 3 * PI / 8, 2e-3));

  // (д) независимые числовые ориентиры (R=1, λ0=0)
  const P0 = { R: 1, lon0: 0 };
  ok('times y(90°)=1.70711', close(PROJECTIONS['times'].forward(0, HALF_PI, P0)[1], 1.70711, 1e-9));
  ok('healpix шов: y(arcsin⅔)=π/4',
    close(PROJECTIONS['healpix'].forward(0, Math.asin(2 / 3), P0)[1], PI / 4, 1e-9));
  ok('healpix непрерывность шва',
    close(PROJECTIONS['healpix'].forward(0.3, Math.asin(2 / 3) - 1e-7, P0)[1],
          PROJECTIONS['healpix'].forward(0.3, Math.asin(2 / 3) + 1e-7, P0)[1], 1e-4));
  ok('equal-earth θ(90°)=π/3 → y=poly(π/3)',
    close(PROJECTIONS['equal-earth'].forward(0, HALF_PI, P0)[1], eePoly(PI / 3), 1e-9));
  ok('mcbryde-s3 сшивка непрерывна на φ_b',
    close(PROJECTIONS['mcbryde-s3'].forward(0.5, MS3_PHIB - 1e-7, P0)[1],
          PROJECTIONS['mcbryde-s3'].forward(0.5, MS3_PHIB + 1e-7, P0)[1], 1e-4));

  const pass = checks.every((c) => c.ok);
  return { pass, checks };
}
/* ───────────────── Самопроверка батча 3 (§9) ───────────────── */
export function __test_batch3() {
  const checks = [];
  const ok = (name, cond) => { checks.push({ name, ok: !!cond }); return cond; };
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const close2 = (p, q, t = 1e-9) => close(p[0], q[0], t) && close(p[1], q[1], t);

  const ids = ['aitoff', 'hammer', 'winkel3', 'winkel1', 'vandergrinten', 'eckert-greifendorff',
    'wagner7', 'briesemeister', 'vandergrinten4', 'armadillo', 'vandergrinten2', 'vandergrinten3',
    'wagner-generalized', 'bottomley', 'hill'];

  for (const id of ids) ok(`${id}: registered+forward`, hasForward(id));

  // центр → [0,0] (где это естественно)
  const centerZero = ['aitoff', 'hammer', 'winkel3', 'winkel1', 'vandergrinten', 'eckert-greifendorff',
    'wagner7', 'vandergrinten4', 'vandergrinten2', 'vandergrinten3', 'wagner-generalized', 'bottomley'];
  for (const id of centerZero) {
    const P = mergeParams(PROJECTIONS[id]);
    ok(`${id}: центр→[0,0]`, close2(PROJECTIONS[id].forward(P.lon0, 0, P), [0, 0], 1e-9));
  }
  // briesemeister: косой центр (lonc, 45°) → [0,0]; armadillo/hill: x=0 на центр. меридиане
  // briesemeister: косой центр (lonc, 45°) — полюс косой системы (arccos чувствителен у арг.=1)
  ok('briesemeister: центр(10°,45°)≈[0,0]',
    close2(PROJECTIONS['briesemeister'].forward(10 * DEG, 45 * DEG, mergeParams(PROJECTIONS['briesemeister'])), [0, 0], 1e-6));
  ok('armadillo: x=0 на центр.меридиане',
    close(PROJECTIONS['armadillo'].forward(0, 30 * DEG, { R: 1, lon0: 0 })[0], 0, 1e-12));
  ok('hill: x=0 на центр.меридиане',
    close(PROJECTIONS['hill'].forward(0, 30 * DEG, mergeParams(PROJECTIONS['hill']))[0], 0, 1e-9));

  // round-trip (где есть inverse)
  const pts = [[10 * DEG, 20 * DEG], [-30 * DEG, -15 * DEG], [55 * DEG, 35 * DEG], [-50 * DEG, 48 * DEG]];
  for (const id of ids) {
    const def = PROJECTIONS[id];
    if (typeof def.inverse !== 'function') continue;
    const P = mergeParams(def);
    const tol = (id === 'aitoff' || id === 'winkel3') ? 1e-6 : 1e-7;
    let good = true;
    for (const [l, f] of pts) {
      const xy = def.forward(l, f, P);
      const lf = def.inverse(xy[0], xy[1], P);
      if (!close2([l, f], lf, tol)) { good = false; break; }
    }
    ok(`${id}: round-trip`, good);
  }

  // равновеликость через Тиссо: масштаб площади постоянен по двум точкам
  const eqArea = ['hammer', 'eckert-greifendorff', 'wagner7', 'briesemeister', 'bottomley', 'hill'];
  for (const id of eqArea) {
    const a1 = tissotOf(id, 10 * DEG, 15 * DEG), a2 = tissotOf(id, -25 * DEG, -40 * DEG);
    ok(`${id}: area постоянна`, a1 && a2 && close(a1.area, a2.area, Math.max(2e-3, a1.area * 3e-3)));
  }
  // wagner-generalized при I=0 равновелик
  {
    const P0 = mergeParams(PROJECTIONS['wagner-generalized'], { infl: 0 });
    const t1 = tissotFromForward(PROJECTIONS['wagner-generalized'].forward, 10 * DEG, 15 * DEG, P0);
    const t2 = tissotFromForward(PROJECTIONS['wagner-generalized'].forward, -25 * DEG, -40 * DEG, P0);
    ok('wagner-generalized(I=0): area постоянна', close(t1.area, t2.area, 3e-3));
  }

  // тождества: E-G(W=½)=Hammer ; wagner-generalized(I=0,defaults)=wagner7
  {
    const P0 = { R: 1, lon0: 0 };
    const eg = PROJECTIONS['eckert-greifendorff'].forward(40 * DEG, 30 * DEG, { R: 1, lon0: 0, W: 0.5 });
    const hm = PROJECTIONS['hammer'].forward(40 * DEG, 30 * DEG, P0);
    ok('E-G(W=½) ≡ Hammer', close2(eg, hm, 1e-9));
    const wg = PROJECTIONS['wagner-generalized'].forward(40 * DEG, 30 * DEG,
      mergeParams(PROJECTIONS['wagner-generalized'], { infl: 0 }));
    const w7 = PROJECTIONS['wagner7'].forward(40 * DEG, 30 * DEG, P0);
    ok('wagner-generalized(I=0) ≈ wagner7', close2(wg, w7, 5e-4)); // константы карточки округлены
  }

  const pass = checks.every((c) => c.ok);
  return { pass, checks };
}
/* ───────────────── Самопроверка батча 4 (§9) ───────────────── */
export function __test_batch4() {
  const checks = [];
  const ok = (name, cond) => { checks.push({ name, ok: !!cond }); return cond; };
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const close2 = (p, q, t = 1e-9) => close(p[0], q[0], t) && close(p[1], q[1], t);

  const ids = ['equidist-conic', 'lambert-cc', 'albers', 'bonne', 'werner',
    'polyconic', 'lambert-eac', 'bipolar'];
  for (const id of ids) ok(`${id}: registered+forward`, hasForward(id));

  // центр → [0,0]
  for (const id of ['equidist-conic', 'lambert-cc', 'albers', 'lambert-eac', 'polyconic']) {
    const P = mergeParams(PROJECTIONS[id]);
    ok(`${id}: центр(λ0,φ0)→[0,0]`, close2(PROJECTIONS[id].forward(P.lon0, P.phi0, P), [0, 0], 1e-9));
  }
  ok('bonne: (λ0,φ1)→[0,0]', close2(
    PROJECTIONS['bonne'].forward(0, 45 * DEG, mergeParams(PROJECTIONS['bonne'])), [0, 0], 1e-9));
  ok('werner: (λ0,90°)→[0,0]', close2(
    PROJECTIONS['werner'].forward(0, HALF_PI, { R: 1, lon0: 0 }), [0, 0], 1e-9));

  // round-trip (мид-широты, умеренная Δλ — рабочая зона конусов)
  const pts = [[10 * DEG, 30 * DEG], [-20 * DEG, 45 * DEG], [15 * DEG, 55 * DEG], [-12 * DEG, 22 * DEG]];
  for (const id of ['equidist-conic', 'lambert-cc', 'albers', 'bonne', 'werner', 'polyconic', 'lambert-eac']) {
    const P = mergeParams(PROJECTIONS[id]);
    let good = true;
    for (const [l, f] of pts) {
      const xy = PROJECTIONS[id].forward(l, f, P);
      const lf = PROJECTIONS[id].inverse(xy[0], xy[1], P);
      if (!close2([l, f], lf, 1e-7)) { good = false; break; }
    }
    ok(`${id}: round-trip`, good);
  }

  // равновеликость / конформность через Тиссо
  for (const id of ['albers', 'bonne', 'werner', 'lambert-eac']) {
    const a1 = tissotOf(id, 10 * DEG, 30 * DEG), a2 = tissotOf(id, -15 * DEG, 50 * DEG);
    ok(`${id}: area постоянна`, a1 && a2 && close(a1.area, a2.area, Math.max(2e-3, a1.area * 3e-3)));
  }
  const tL = tissotOf('lambert-cc', 10 * DEG, 40 * DEG);
  ok('lambert-cc: a≈b (конформна)', tL && close(tL.a, tL.b, 1e-4));

  // тождество werner ≡ bonne(φ1=90°)
  {
    const w = PROJECTIONS['werner'].forward(20 * DEG, 35 * DEG, { R: 1, lon0: 0 });
    const b = PROJECTIONS['bonne'].forward(20 * DEG, 35 * DEG, { R: 1, lon0: 0, phi1: HALF_PI });
    ok('werner ≡ bonne(90°)', close2(w, b, 1e-9));
  }
  // bipolar: forward конечен (Северная и Южная Америка)
  {
    const P = { R: 1, lon0: 0 };
    const v1 = PROJECTIONS['bipolar'].forward(-100 * DEG, 40 * DEG, P);  // США
    const v2 = PROJECTIONS['bipolar'].forward(-60 * DEG, -20 * DEG, P);  // Бразилия
    ok('bipolar: конечен на Сев.Америке', isFinite(v1[0]) && isFinite(v1[1]));
    ok('bipolar: конечен на Юж.Америке', isFinite(v2[0]) && isFinite(v2[1]));
    ok('bipolar: конформна (a≈b) в США',
      (() => { const t = tissotOf('bipolar', -100 * DEG, 40 * DEG); return t && close(t.a, t.b, 1e-3); })());
  }

  const pass = checks.every((c) => c.ok);
  return { pass, checks };
}
/* ───────────────── Самопроверка батча 5 (§9) ───────────────── */
export function __test_batch5() {
  const checks = [];
  const ok = (name, cond) => { checks.push({ name, ok: !!cond }); return cond; };
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const close2 = (p, q, t = 1e-9) => close(p[0], q[0], t) && close(p[1], q[1], t);

  const withFwd = ['orthographic', 'stereographic', 'gnomonic', 'laea', 'aeqd', 'airy',
    'two-point-equidistant', 'two-point-azimuthal', 'miller-oblated', 'vertical-perspective', 'tilted-perspective'];
  for (const id of withFwd) ok(`${id}: registered+forward`, hasForward(id));
  ok('azim-general: static', PROJECTIONS['azim-general'].static === true && !hasForward('azim-general'));

  // центр → [0,0]
  for (const id of ['orthographic', 'stereographic', 'gnomonic', 'laea', 'aeqd', 'miller-oblated', 'vertical-perspective', 'tilted-perspective']) {
    const P = mergeParams(PROJECTIONS[id]);
    ok(`${id}: центр→[0,0]`, close2(PROJECTIONS[id].forward(P.lon0, P.phi1, P), [0, 0], 1e-9));
  }
  ok('airy: полюс→[0,0]', close2(PROJECTIONS['airy'].forward(0, HALF_PI, mergeParams(PROJECTIONS['airy'])), [0, 0], 1e-9));
  ok('two-point-equidist: середина→[0,0]', close2(PROJECTIONS['two-point-equidistant'].forward(0, 0, mergeParams(PROJECTIONS['two-point-equidistant'])), [0, 0], 1e-9));

  // round-trip (с inverse), в зоне видимости
  const pts = [[10 * DEG, 20 * DEG], [-25 * DEG, -15 * DEG], [30 * DEG, 35 * DEG], [-15 * DEG, 28 * DEG]];
  for (const id of ['orthographic', 'stereographic', 'gnomonic', 'laea', 'aeqd', 'airy', 'vertical-perspective']) {
    const P = mergeParams(PROJECTIONS[id]);
    const tol = (id === 'airy') ? 1e-5 : 1e-7;
    const lpts = (id === 'airy')
      ? [[10 * DEG, 70 * DEG], [-25 * DEG, 60 * DEG], [40 * DEG, 50 * DEG]]  // полярный аспект
      : pts;
    let good = true;
    for (const [l, f] of lpts) {
      const xy = PROJECTIONS[id].forward(l, f, P);
      const lf = PROJECTIONS[id].inverse(xy[0], xy[1], P);
      if (!close2([l, f], lf, tol)) { good = false; break; }
    }
    ok(`${id}: round-trip`, good);
  }

  // свойства через Тиссо: LAEA равновелика, стерео конформна, miller-oblated ≈конформна в центре
  ok('laea: area≈1', close(tissotOf('laea', 10 * DEG, 20 * DEG).area, 1, 1e-3));
  { const t = tissotOf('stereographic', 10 * DEG, 20 * DEG); ok('stereographic: a≈b', close(t.a, t.b, 1e-4)); }
  { const t = tissotOf('miller-oblated', 18 * DEG, 18 * DEG); ok('miller-oblated: a≈b в центре', close(t.a, t.b, 1e-3)); }

  // two-point-equidistant: расстояния до образов A,B истинны (= R·zA, R·zB)
  {
    const P = mergeParams(PROJECTIONS['two-point-equidistant']);
    const A = PROJECTIONS['two-point-equidistant'].forward(P.lonA, P.phiA, P);
    const B = PROJECTIONS['two-point-equidistant'].forward(P.lonB, P.phiB, P);
    const lam = 20 * DEG, ph = 30 * DEG;
    const zA = acos_c(Math.sin(P.phiA) * Math.sin(ph) + Math.cos(P.phiA) * Math.cos(ph) * Math.cos(lam - P.lonA));
    const zB = acos_c(Math.sin(P.phiB) * Math.sin(ph) + Math.cos(P.phiB) * Math.cos(ph) * Math.cos(lam - P.lonB));
    const xy = PROJECTIONS['two-point-equidistant'].forward(lam, ph, P);
    ok('two-point-equidist: dist→A = R·zA', close(Math.hypot(xy[0] - A[0], xy[1] - A[1]), zA, 1e-9));
    ok('two-point-equidist: dist→B = R·zB', close(Math.hypot(xy[0] - B[0], xy[1] - B[1]), zB, 1e-9));
  }

  // two-point-azimuthal: 3 точки на большом круге (экватор) коллинеарны (гномоника)
  {
    const P = mergeParams(PROJECTIONS['two-point-azimuthal']);
    const f = (lo) => PROJECTIONS['two-point-azimuthal'].forward(lo * DEG, 0, P);
    const p1 = f(-30), p2 = f(0), p3 = f(30);
    const cross = (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
    ok('two-point-azimuthal: большой круг → прямая', Math.abs(cross) < 1e-9);
  }

  // предельные случаи вертикальной перспективной: P→∞ ≈ ортографическая
  {
    const vp = PROJECTIONS['vertical-perspective'].forward(20 * DEG, 30 * DEG, { R: 1, lon0: 0, phi1: 0, P: 1e7 });
    const orth = PROJECTIONS['orthographic'].forward(20 * DEG, 30 * DEG, { R: 1, lon0: 0, phi1: 0 });
    ok('vertical-persp(P→∞) ≈ ortho', close2(vp, orth, 1e-5));
  }

  const pass = checks.every((c) => c.ok);
  return { pass, checks };
}
/* ───────────────── Самопроверка батча 6 (§9) ───────────────── */
export function __test_batch6() {
  const checks = [];
  const ok = (name, cond) => { checks.push({ name, ok: !!cond }); return cond; };
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const close2 = (p, q, t = 1e-9) => close(p[0], q[0], t) && close(p[1], q[1], t);

  const fwdIds = ['guyou', 'peirce', 'adams', 'adams-hemisphere', 'spilhaus',
    'lagrange', 'eisenlohr', 'august', 'modified-stereographic'];
  const statics = ['lee', 'dymaxion', 'authagraph', 'waterman', 'conformal-ellipse'];
  for (const id of fwdIds) ok(`${id}: registered+forward`, hasForward(id));
  for (const id of statics) ok(`${id}: static`, PROJECTIONS[id].static === true && !hasForward(id));

  // конформность (a≈b, ω≈0) — определяющее свойство всего семейства (кроме компромиссных)
  const conf = ['guyou', 'peirce', 'adams', 'adams-hemisphere', 'spilhaus',
    'lagrange', 'eisenlohr', 'august', 'modified-stereographic'];
  for (const id of conf) {
    const t1 = tissotOf(id, 12 * DEG, 18 * DEG), t2 = tissotOf(id, -20 * DEG, 33 * DEG);
    const good = t1 && t2 && t1.omega < 1e-4 && t2.omega < 1e-4;
    ok(`${id}: конформна (ω≈0)`, good);
  }

  // якоря: полюса Пирса — N в центр (0,0), S в угол (±K,±K)≠0
  {
    const P = { R: 1, lon0: 0 };
    const npole = PROJECTIONS['peirce'].forward(0.3, HALF_PI - 1e-6, P);
    const spole = PROJECTIONS['peirce'].forward(0.3, -HALF_PI + 1e-6, P);
    ok('peirce: сев.полюс → центр', Math.hypot(npole[0], npole[1]) < 1e-3);
    ok('peirce: юж.полюс → угол (≠центр)', Math.hypot(spole[0], spole[1]) > 1);
  }

  // guyou round-trip
  {
    const P = mergeParams(PROJECTIONS['guyou']);
    let good = true;
    for (const [l, f] of [[10 * DEG, 20 * DEG], [-30 * DEG, -15 * DEG], [40 * DEG, 35 * DEG]]) {
      const xy = PROJECTIONS['guyou'].forward(l, f, P);
      const lf = PROJECTIONS['guyou'].inverse(xy[0], xy[1], P);
      if (!close2([l, f], lf, 1e-7)) { good = false; break; }
    }
    ok('guyou: round-trip', good);
  }
  // modified-stereographic round-trip
  {
    const P = mergeParams(PROJECTIONS['modified-stereographic']);
    let good = true;
    for (const [l, f] of [[-115 * DEG, 47 * DEG], [-125 * DEG, 40 * DEG], [-100 * DEG, 50 * DEG]]) {
      const xy = PROJECTIONS['modified-stereographic'].forward(l, f, P);
      const lf = PROJECTIONS['modified-stereographic'].inverse(xy[0], xy[1], P);
      if (!close2([l, f], lf, 1e-6)) { good = false; break; }
    }
    ok('modified-stereographic: round-trip', good);
  }
  // lagrange: |φ|=π/2 → (0, ±2R); центр → [0,0]
  {
    const P = { R: 1, lon0: 0, W: 2, phi1: 0 };
    ok('lagrange: полюс→(0,2R)', close2(PROJECTIONS['lagrange'].forward(0.5, HALF_PI, P), [0, 2], 1e-9));
    ok('lagrange: центр→[0,0]', close2(PROJECTIONS['lagrange'].forward(0, 0, P), [0, 0], 1e-9));
  }
  // conformal-ellipse: K′ = ellipticK(cos23.8958°) ≈ 2.34767
  ok('conformal-ellipse: K′≈2.34767', close(CE_Kp, 2.34767, 1e-5));

  const pass = checks.every((c) => c.ok);
  return { pass, checks };
}
/* ───────────────── Самопроверка батча 7 (§9) ───────────────── */
export function __test_batch7() {
  const checks = [];
  const ok = (name, cond) => { checks.push({ name, ok: !!cond }); return cond; };
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const close2 = (p, q, t = 1e-9) => close(p[0], q[0], t) && close(p[1], q[1], t);

  const ids = ['bacon', 'apian1', 'fournier1', 'nicolosi', 'ortelius', 'gilbert',
    'craig', 'hammer-retro', 'littrow', 'wiechel', 'berghaus'];
  for (const id of ids) ok(`${id}: registered+forward`, hasForward(id));

  // центр → [0,0] (для глобулярных и Литтрова/Вихеля)
  for (const id of ['bacon', 'apian1', 'fournier1', 'nicolosi', 'ortelius', 'gilbert', 'littrow', 'craig']) {
    const P = mergeParams(PROJECTIONS[id]);
    const c = PROJECTIONS[id].forward(P.lon0, 0, P);
    ok(`${id}: центр(λ0,0)→[0,*0]`, close(c[0], 0, 1e-9));
  }

  // глобулярные: dl=0 ⇒ x=0; полюс ⇒ x=0
  for (const id of ['bacon', 'apian1', 'fournier1', 'nicolosi']) {
    const P = mergeParams(PROJECTIONS[id]);
    ok(`${id}: меридиан λ0 ⇒ x=0`, close(PROJECTIONS[id].forward(P.lon0, 0.5, P)[0], 0, 1e-9));
    ok(`${id}: полюс ⇒ x=0`, close(PROJECTIONS[id].forward(P.lon0 + 0.4, HALF_PI, P)[0], 0, 1e-9));
  }

  // Фурнье I особые случаи
  {
    const P = { R: 1, lon0: 0 };
    ok('fournier1: φ=0 ⇒ (Rλ,0)', close2(PROJECTIONS['fournier1'].forward(0.6, 0, P), [0.6, 0], 1e-9));
    ok('fournier1: |λ|=π/2 ⇒ (Rλcosφ, R(π/2)sinφ)',
      close2(PROJECTIONS['fournier1'].forward(HALF_PI, 0.5, P), [HALF_PI * Math.cos(0.5), HALF_PI * Math.sin(0.5)], 1e-9));
  }

  // gilbert round-trip + весь мир в круге радиуса R
  {
    const P = mergeParams(PROJECTIONS['gilbert']);
    let good = true, inside = true;
    for (const [l, f] of [[60 * DEG, 30 * DEG], [-120 * DEG, -45 * DEG], [150 * DEG, 20 * DEG], [-30 * DEG, 70 * DEG]]) {
      const xy = PROJECTIONS['gilbert'].forward(l, f, P);
      const lf = PROJECTIONS['gilbert'].inverse(xy[0], xy[1], P);
      if (!close2([l, f], lf, 1e-7)) good = false;
      if (Math.hypot(xy[0], xy[1]) > P.R + 1e-9) inside = false;
    }
    ok('gilbert: round-trip', good);
    ok('gilbert: весь мир в круге R', inside);
  }

  // wiechel: равновелика (area≈const)
  {
    const a1 = tissotOf('wiechel', 20 * DEG, 30 * DEG).area, a2 = tissotOf('wiechel', -40 * DEG, 55 * DEG).area;
    ok('wiechel: равновелика', close(a1, 1, 2e-3) && close(a2, 1, 2e-3));
    ok('wiechel: сев.полюс→origin', close2(PROJECTIONS['wiechel'].forward(0.3, HALF_PI, { R: 1, lon0: 0 }), [0, 0], 1e-9));
  }

  // littrow: конформна (a≈b)
  { const t = tissotOf('littrow', 20 * DEG, 30 * DEG); ok('littrow: a≈b (конформна)', close(t.a, t.b, 1e-4)); }

  // craig: λ=λ0 ⇒ x=0, y=R(sinφ−cosφ tanφ1)
  {
    const P = mergeParams(PROJECTIONS['craig']);
    const y0 = Math.sin(0.5) - Math.cos(0.5) * Math.tan(P.phi1);
    ok('craig: λ0 ⇒ (0, R(sinφ−cosφ tanφ1))', close2(PROJECTIONS['craig'].forward(P.lon0, 0.5, P), [0, y0], 1e-9));
  }

  // berghaus: сев.полюс→origin; север — полярная AEQD (r=π/2−φ); юг — 5-лучевая симметрия
  {
    const P = mergeParams(PROJECTIONS['berghaus']);
    ok('berghaus: сев.полюс→origin', close2(PROJECTIONS['berghaus'].forward(0.3, HALF_PI, P), [0, 0], 1e-9));
    const n = PROJECTIONS['berghaus'].forward(30 * DEG, 20 * DEG, P); // север: |r|=π/2−φ
    ok('berghaus: север = полярная AEQD', close(Math.hypot(n[0], n[1]), HALF_PI - 20 * DEG, 1e-9));
    // 5-лучевая симметрия юга: поворот λ на 72° ⇒ та же фигура (поворот точки на 72°)
    const s1 = PROJECTIONS['berghaus'].forward(10 * DEG, -40 * DEG, P);
    const s2 = PROJECTIONS['berghaus'].forward(10 * DEG + TAU / 5, -40 * DEG, P);
    const rot = [s1[0] * Math.cos(TAU / 5) - s1[1] * Math.sin(TAU / 5), s1[0] * Math.sin(TAU / 5) + s1[1] * Math.cos(TAU / 5)];
    ok('berghaus: 5-лучевая симметрия', close2(s2, rot, 1e-9));
  }

  const pass = checks.every((c) => c.ok);
  return { pass, checks };
}

/* ─────────────────────────── запуск всех батчей ─────────────────────────── */
const SUITES = [
  ['Part 0 (пролог)', __selftest],
  ['Батч 1 — цилиндрические', __test_batch1],
  ['Батч 2a — псевдоцилиндр. I', __test_batch2a],
  ['Батч 2b — псевдоцилиндр. II', __test_batch2b],
  ['Батч 3 — линзовидные/мод.-азим.', __test_batch3],
  ['Батч 4 — конические/псевдокон.', __test_batch4],
  ['Батч 5 — азимутальные/перспект.', __test_batch5],
  ['Батч 6 — конформные спец./многогр.', __test_batch6],
  ['Батч 7 — глобулярные/ретроазим./звёзд.', __test_batch7],
];

export function runAll() {
  let total = 0, passed = 0, allOk = true;
  for (const [title, fn] of SUITES) {
    const r = fn();
    const okN = r.checks.filter((c) => c.ok).length;
    total += r.checks.length; passed += okN;
    if (!r.pass) allOk = false;
    console.log(`${r.pass ? 'OK  ' : 'FAIL'} ${title} — ${okN}/${r.checks.length}`);
    for (const c of r.checks) if (!c.ok) console.log('       ✗ ' + c.name);
  }
  console.log(`\n${allOk ? '✓ ВСЁ ЗЕЛЁНОЕ' : '✗ ЕСТЬ ПАДЕНИЯ'}: ${passed}/${total} проверок`);
  return allOk;
}

// автозапуск при `node projections.test.js`
if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runAll() ? 0 : 1);
}
