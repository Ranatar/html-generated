/**
 * projections.js — исполняемый модуль картографических проекций
 * ─────────────────────────────────────────────────────────────────────────────
 * Part 0 — прелюдия: общие хелперы (§5), реестр (§3), индикатриса Тиссо (§6).
 *
 * Соответствует projection-engine-spec.md, версия 1.1.
 * Контракт (§1, §4):
 *   forward(lambda, phi, P) -> [x, y]   // радианы внутрь, мат. координаты Y↑
 *   inverse(x, y, P)        -> [lambda, phi] | null
 *   R по умолчанию 1; все углы внутри — радианы; ось Y вверх, север положителен.
 *   Точка вне области определения ⇒ [NaN, NaN]; не-сходимость итерации ⇒ NaN.
 *
 * Формат: ESM, один файл. Батчи 1–7 дописываются ниже, вызывая register(...).
 * Зависимостей нет.
 */

export const SPEC_VERSION = '1.1';

/* ═════════════════════════════ Константы ═════════════════════════════════ */

export const PI       = Math.PI;
export const TAU      = 2 * Math.PI;
export const HALF_PI  = Math.PI / 2;
export const QUARTER_PI = Math.PI / 4;
export const DEG      = Math.PI / 180;   // градусы → радианы
export const RAD      = 180 / Math.PI;   // радианы → градусы
export const SQRT2    = Math.SQRT2;
export const SQRT1_2  = Math.SQRT1_2;    // 1/√2 — модуль k конформного квадрата
export const EPS      = 1e-12;

/* ═══════════════════════ Базовые скалярные хелперы ═══════════════════════ */

export const sign = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);

export const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);

/** asin/acos с зажимом аргумента в [-1,1] — гасит численный шум на краях карты. */
export const asin_c = (x) => Math.asin(clamp(x, -1, 1));
export const acos_c = (x) => Math.acos(clamp(x, -1, 1));

/* Гиперболические — через Math.* (ES2015+); вынесены ради единой точки правки. */
export const sinh  = Math.sinh;
export const cosh  = Math.cosh;
export const tanh  = Math.tanh;
export const asinh = Math.asinh;
export const acosh = Math.acosh;
export const atanh = Math.atanh;

/**
 * Функция Гудермана и обратная (карточка Меркатора: φ = gd(y/R)).
 *   gd(x)     = 2·atan(eˣ) − π/2 = atan(sinh x)
 *   gd_inv(φ) = artanh(sin φ) = asinh(tan φ) = ln tan(π/4 + φ/2)
 */
export const gd     = (x)   => Math.atan(Math.sinh(x));
export const gd_inv = (phi) => Math.atanh(Math.sin(phi));

/** Приведение долготы к (−π, π]. */
export function normalizeLon(l) {
  l = (l + PI) % TAU;
  if (l < 0) l += TAU;
  return l - PI;
}

/* ═══════════════════════════ Поиск корней (§5) ═══════════════════════════ */

/**
 * Ньютон. При не-сходимости за maxit ⇒ NaN (§4.7), без вечного цикла.
 * @param {(x:number)=>number} f
 * @param {(x:number)=>number} fprime
 */
export function newton(f, fprime, x0, { tol = EPS, maxit = 100 } = {}) {
  let x = x0;
  for (let i = 0; i < maxit; i++) {
    const fx = f(x);
    if (Math.abs(fx) < tol) return x;
    const d = fprime(x);
    if (d === 0 || !isFinite(d)) break;
    const nx = x - fx / d;
    if (Math.abs(nx - x) < tol) return nx;
    x = nx;
  }
  return NaN;
}

/** Бисекция на [a,b] (требует смены знака). Возврат NaN, если знаки совпали. */
export function bisection(f, a, b, { tol = EPS, maxit = 200 } = {}) {
  let fa = f(a), fb = f(b);
  if (fa === 0) return a;
  if (fb === 0) return b;
  if (fa * fb > 0) return NaN;
  for (let i = 0; i < maxit; i++) {
    const m = 0.5 * (a + b), fm = f(m);
    if (fm === 0 || (b - a) / 2 < tol) return m;
    if (fa * fm < 0) { b = m; fb = fm; } else { a = m; fa = fm; }
  }
  return 0.5 * (a + b);
}

/**
 * Простая итерация неподвижной точки x = g(x) — для λ′-итераций (SOM и т.п.).
 * При не-сходимости ⇒ NaN.
 */
export function fixedPoint(g, x0, { tol = EPS, maxit = 100 } = {}) {
  let x = x0;
  for (let i = 0; i < maxit; i++) {
    const nx = g(x);
    if (!isFinite(nx)) break;
    if (Math.abs(nx - x) < tol) return nx;
    x = nx;
  }
  return NaN;
}

/* ════════════════════ Геодезические хелперы (сфера/эллипсоид) ════════════ */

/**
 * Длина дуги меридиана для единичной большой полуоси (a = 1), ряд по e²
 * (карточка «Поперечная Меркатора», PP 1395, ур. 3-21). На сфере (e=0) M = φ.
 * Множитель a (или R) применяет вызывающая сторона.
 */
export function M(phi, e = 0) {
  if (e === 0) return phi;
  const e2 = e * e, e4 = e2 * e2, e6 = e4 * e2;
  const c0 = 1 - e2 / 4 - 3 * e4 / 64 - 5 * e6 / 256;
  const c2 = 3 * e2 / 8 + 3 * e4 / 32 + 45 * e6 / 1024;
  const c4 = 15 * e4 / 256 + 45 * e6 / 1024;
  const c6 = 35 * e6 / 3072;
  return c0 * phi - c2 * Math.sin(2 * phi) + c4 * Math.sin(4 * phi) - c6 * Math.sin(6 * phi);
}

/**
 * Обратная к M: «опорная» (footpoint) широта по дуге меридиана при a = 1
 * (карточка ТМ, ур. 3-26). На сфере (e=0) ⇒ φ = Marc.
 */
export function M_inv(Marc, e = 0) {
  if (e === 0) return Marc;
  const e2 = e * e, e4 = e2 * e2, e6 = e4 * e2;
  const c0 = 1 - e2 / 4 - 3 * e4 / 64 - 5 * e6 / 256;
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  const e1_2 = e1 * e1, e1_3 = e1_2 * e1, e1_4 = e1_3 * e1;
  const mu = Marc / c0;
  return mu
    + (3 * e1 / 2 - 27 * e1_3 / 32) * Math.sin(2 * mu)
    + (21 * e1_2 / 16 - 55 * e1_4 / 32) * Math.sin(4 * mu)
    + (151 * e1_3 / 96) * Math.sin(6 * mu)
    + (1097 * e1_4 / 512) * Math.sin(8 * mu);
}

/**
 * Аутальная (равновеликая) широта β по геодезической φ (Snyder 3-11/3-12).
 * На сфере (e=0) ⇒ β = φ.
 */
export function authalic_lat(phi, e = 0) {
  if (e < EPS) return phi;
  const s = Math.sin(phi), es = e * s;
  const q = (1 - e * e) * (s / (1 - es * es) - (1 / (2 * e)) * Math.log((1 - es) / (1 + es)));
  const qp = (1 - e * e) * (1 / (1 - e * e) - (1 / (2 * e)) * Math.log((1 - e) / (1 + e)));
  return asin_c(q / qp);
}

/**
 * Конформная широта χ по геодезической φ (Snyder 3-1). На сфере (e=0) ⇒ χ = φ.
 * На полюсах возвращает ±π/2.
 */
export function conformal_lat(phi, e = 0) {
  if (Math.abs(phi) >= HALF_PI) return sign(phi) * HALF_PI;
  if (e < EPS) return phi;
  const es = e * Math.sin(phi);
  return 2 * Math.atan(
    Math.tan(QUARTER_PI + phi / 2) * Math.pow((1 - es) / (1 + es), e / 2)
  ) - HALF_PI;
}

/* ═══════════════════ Эллиптические интегралы 1-го рода (§7.1) ═══════════ */

/**
 * Симметричный интеграл Карлсона R_F(x,y,z) (Numerical Recipes, дублирование).
 * База движка конформного квадратного/эллиптического семейства.
 */
export function carlsonRF(x, y, z) {
  const ERRTOL = 0.0025; // ошибка ряда ~ ERRTOL⁶ ≈ 2·10⁻¹⁶
  let xt = x, yt = y, zt = z, ave, dx, dy, dz;
  do {
    const sx = Math.sqrt(xt), sy = Math.sqrt(yt), sz = Math.sqrt(zt);
    const lam = sx * (sy + sz) + sy * sz;
    xt = 0.25 * (xt + lam);
    yt = 0.25 * (yt + lam);
    zt = 0.25 * (zt + lam);
    ave = (xt + yt + zt) / 3;
    dx = (ave - xt) / ave;
    dy = (ave - yt) / ave;
    dz = (ave - zt) / ave;
  } while (Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) > ERRTOL);
  const e2 = dx * dy - dz * dz, e3 = dx * dy * dz;
  return (1 + (e2 / 24 - 0.1 - 3 * e3 / 44) * e2 + e3 / 14) / Math.sqrt(ave);
}

/** Полный эллиптический интеграл 1-го рода K(k) = F(π/2, k). */
export function ellipticK(k) {
  return carlsonRF(0, 1 - k * k, 1);
}

/**
 * Неполный эллиптический интеграл 1-го рода F(φ, k).
 *   F(φ,k) = sinφ · R_F(cos²φ, 1 − k²sin²φ, 1),  нечётна по φ.
 * Приведение по π-периодичности F(mπ + r) = 2mK + F(r) — корректно для любого φ.
 */
export function ellipticF(phi, k) {
  if (phi === 0) return 0;
  const m = Math.round(phi / PI);
  const r = phi - m * PI;            // r ∈ (−π/2, π/2]
  const s = Math.sin(r), c = Math.cos(r);
  const Fr = s * carlsonRF(c * c, 1 - k * k * s * s, 1);
  return m === 0 ? Fr : 2 * m * ellipticK(k) + Fr;
}

/* ── Комплексный движок для конформно-квадратного семейства (k=1/√2) ──
 * Параметр m = k². Портировано по A&S 17.4.11 / 16.x (как в d3-geo-projection):
 * ellipticFi — неполный F комплексного аргумента; ellipticJ/Ji — функции Якоби. */
const ellF_m = (phi, m) => ellipticF(phi, Math.sqrt(m));   // мост: F(φ, k=√m)
/** F(φ+iψ | m) → [Re, Im]. */
function ellipticFi(phi, psi, m) {
  const r = Math.abs(phi), i = Math.abs(psi), sinhPsi = Math.sinh(i);
  if (r) {
    const cscPhi = 1 / Math.sin(r), cotPhi2 = 1 / (Math.tan(r) * Math.tan(r));
    const b = -(cotPhi2 + m * (sinhPsi * sinhPsi * cscPhi * cscPhi) - 1 + m);
    const c = (m - 1) * cotPhi2;
    const cotLambda2 = (-b + Math.sqrt(b * b - 4 * c)) / 2;
    return [
      ellF_m(Math.atan(1 / Math.sqrt(cotLambda2)), m) * sign(phi),
      ellF_m(Math.atan(Math.sqrt((cotLambda2 / cotPhi2 - 1) / m)), 1 - m) * sign(psi),
    ];
  }
  return [0, ellF_m(Math.atan(sinhPsi), 1 - m) * sign(psi)];
}
/** [sn, cn, dn, ph](u | m) (AGM-нисхождение). */
function ellipticJ(u, m) {
  let ai, b, phi, t, twon;
  if (m < EPS) {
    t = Math.sin(u); b = Math.cos(u); ai = m * (u - t * b) / 4;
    return [t - ai * b, b + ai * t, 1 - m * t * t / 2, u - ai];
  }
  if (m >= 1 - EPS) {
    ai = (1 - m) / 4; b = Math.cosh(u); t = Math.tanh(u); phi = 1 / b; twon = b * Math.sinh(u);
    return [t + ai * (twon - u) / (b * b), phi - ai * t * phi * (twon - u),
      phi + ai * t * phi * (twon + u), 2 * Math.atan(Math.exp(u)) - HALF_PI + ai * (twon - u) / b];
  }
  const a = [1, 0, 0, 0, 0, 0, 0, 0, 0], c = [Math.sqrt(m), 0, 0, 0, 0, 0, 0, 0, 0];
  let i = 0; b = Math.sqrt(1 - m); twon = 1;
  while (Math.abs(c[i] / a[i]) > EPS && i < 8) {
    ai = a[i++]; c[i] = (ai - b) / 2; a[i] = (ai + b) / 2; b = Math.sqrt(ai * b); twon *= 2;
  }
  phi = twon * a[i] * u;
  do { t = c[i] * Math.sin(b = phi) / a[i]; phi = (Math.asin(t) + phi) / 2; } while (--i);
  return [Math.sin(phi), t = Math.cos(phi), t / Math.cos(phi - b), phi];
}
/** [sn, cn, dn](u+iv | m) → каждая как [Re,Im]. */
function ellipticJi(u, v, m) {
  let a, b, c;
  if (!u) {
    b = ellipticJ(v, 1 - m);
    return [[0, b[0] / b[1]], [1 / b[1], 0], [b[2] / b[1], 0]];
  }
  a = ellipticJ(u, m);
  if (!v) return [[a[0], 0], [a[1], 0], [a[2], 0]];
  b = ellipticJ(v, 1 - m);
  c = b[1] * b[1] + m * a[0] * a[0] * b[0] * b[0];
  return [
    [a[0] * b[2] / c, a[1] * a[2] * b[0] * b[1] / c],
    [a[1] * b[1] / c, -a[0] * a[2] * b[0] * b[2] / c],
    [a[2] * b[1] * b[2] / c, -m * a[0] * a[1] * b[0] / c],
  ];
}

/* ═════════════════════ Комплексная арифметика (GS50) ════════════════════ */
/* Комплексное число — пара [re, im]. */

export const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
export const cabs = (a) => Math.hypot(a[0], a[1]);
export function cdiv(a, b) {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
}
export function cpow(a, n) { // целая степень n ≥ 0 повторным умножением
  let r = [1, 0];
  for (let i = 0; i < n; i++) r = cmul(r, a);
  return r;
}
/**
 * Схема Горнера для Σ_{j=1..m} C_j · z^j  (нулевого члена нет — как в GS50).
 * coeffs: [[A1,B1], …, [Am,Bm]]. Возвращает [re, im].
 */
export function chorner(coeffs, z) {
  const m = coeffs.length;
  let acc = [0, 0];
  for (let j = m - 1; j >= 0; j--) acc = cmul(cadd(acc, coeffs[j]), z);
  return acc;
}
/** Производная Σ j·C_j·z^{j-1} — для k и Ньютона обратки GS50. */
export function chornerDeriv(coeffs, z) {
  const m = coeffs.length;
  let acc = [0, 0];
  for (let j = m; j >= 1; j--) {
    acc = cmul(acc, z);
    acc = cadd(acc, [j * coeffs[j - 1][0], j * coeffs[j - 1][1]]);
  }
  return acc;
}

/* ══════════════════════ Индикатриса Тиссо из forward (§6) ═══════════════ */

/**
 * Индикатриса Тиссо численным якобианом forward (центральные разности).
 * Не требует inverse. Возвращает множители и эллипс искажений, либо null у
 * полюсов (|φ| > 89.5°, где cosφ → 0).
 *   h — масштаб вдоль меридиана, k — вдоль параллели,
 *   a,b — полуоси эллипса, area = a·b, omega — макс. угловое искажение.
 * @returns {{h:number,k:number,theta:number,a:number,b:number,area:number,omega:number}|null}
 */
export function tissotFromForward(fwd, lambda, phi, P, h = 1e-5) {
  if (Math.abs(phi) > 89.5 * DEG) return null;
  const [xl1, yl1] = fwd(lambda + h, phi, P);
  const [xl0, yl0] = fwd(lambda - h, phi, P);
  const [xp1, yp1] = fwd(lambda, phi + h, P);
  const [xp0, yp0] = fwd(lambda, phi - h, P);

  const xL = (xl1 - xl0) / (2 * h), yL = (yl1 - yl0) / (2 * h); // ∂/∂λ
  const xP = (xp1 - xp0) / (2 * h), yP = (yp1 - yp0) / (2 * h); // ∂/∂φ

  const cphi = Math.cos(phi);
  const hScale = Math.hypot(xP, yP);            // вдоль меридиана
  const kScale = Math.hypot(xL, yL) / cphi;     // вдоль параллели
  let sinTheta = (xL * yP - xP * yL) / (hScale * kScale * cphi);
  sinTheta = clamp(sinTheta, -1, 1);

  const ab = hScale * kScale * Math.abs(sinTheta);          // a·b
  const sum2 = hScale * hScale + kScale * kScale;           // a² + b²
  const t1 = Math.sqrt(Math.max(sum2 + 2 * ab, 0));         // a + b
  const t2 = Math.sqrt(Math.max(sum2 - 2 * ab, 0));         // a − b
  const a = (t1 + t2) / 2, b = (t1 - t2) / 2;
  const omega = 2 * asin_c((a - b) / (a + b));

  return { h: hScale, k: kScale, theta: Math.asin(sinTheta), a, b, area: ab, omega };
}

/* ═══════════════════════════ Реестр (§3) ════════════════════════════════ */

/** Реестр проекций: id → определение. Единственная точка склейки батчей. */
export const PROJECTIONS = Object.create(null);

/**
 * Регистрация проекции. Батчи вызывают register(id, def).
 * def: { forward?, inverse?, params, defaults, domain, family?, static?, notes? }
 */
export function register(id, def) {
  if (id in PROJECTIONS) {
    console.warn(`[projections] повторная регистрация id="${id}" — перезапись`);
  }
  PROJECTIONS[id] = def;
  return def;
}

/* ─── удобные обёртки для рендерера/харнесса (контракт §8 не нарушают) ─── */

/** Базовые дефолты P (§2), поверх них — defaults проекции, затем пользователь. */
export function mergeParams(def, userP = {}) {
  return { R: 1, lon0: 0, phi0: 0, ...(def && def.defaults), ...userP };
}

export const hasForward = (id) =>
  !!PROJECTIONS[id] && !PROJECTIONS[id].static && typeof PROJECTIONS[id].forward === 'function';

/** project(id, λ, φ, P) → [x,y] | [NaN,NaN] (для static или отсутствующего id). */
export function project(id, lambda, phi, userP) {
  const def = PROJECTIONS[id];
  if (!def || def.static || typeof def.forward !== 'function') return [NaN, NaN];
  return def.forward(lambda, phi, mergeParams(def, userP));
}

/** unproject(id, x, y, P) → [λ,φ] | null (если inverse не задан). */
export function unproject(id, x, y, userP) {
  const def = PROJECTIONS[id];
  if (!def || typeof def.inverse !== 'function') return null;
  return def.inverse(x, y, mergeParams(def, userP));
}

/** tissotOf(id, λ, φ, P) → индикатриса через forward проекции. */
export function tissotOf(id, lambda, phi, userP, h) {
  const def = PROJECTIONS[id];
  if (!def || def.static || typeof def.forward !== 'function') return null;
  const P = mergeParams(def, userP);
  return tissotFromForward(def.forward, lambda, phi, P, h);
}

/* Сгруппированный экспорт хелперов — для верификационного харнесса батчей. */
export const helpers = {
  sign, clamp, asin_c, acos_c, sinh, cosh, tanh, asinh, acosh, atanh,
  gd, gd_inv, normalizeLon, newton, bisection, fixedPoint,
  M, M_inv, authalic_lat, conformal_lat,
  carlsonRF, ellipticK, ellipticF,
  cadd, csub, cmul, cdiv, cabs, cpow, chorner, chornerDeriv,
  tissotFromForward,
};

/* ════════════════════════ Самопроверка Part 0 (§9) ══════════════════════ */
/* ═════════════════════════════════════════════════════════════════════════
 * БАТЧ 1 — ЦИЛИНДРИЧЕСКИЕ (Класс I)
 * Формулы — буквально из карточек атласа; всё на сфере (e=0), R = P.R.
 * Прим.: шаблон карточек arctan[N/cos(λ−λ0)] реализован как atan2(N, cos…) —
 * квадрантно-корректно (Снайдер) и полюсо-безопасно (без tanφ → ∞).
 * ═══════════════════════════════════════════════════════════════════════ */

/* 1. Равнопромежуточная цилиндрическая — Equirectangular / Plate Carrée */
register('equirect', {
  forward(lambda, phi, P) {
    return [P.R * (lambda - P.lon0) * Math.cos(P.phi1), P.R * phi];
  },
  inverse(x, y, P) {
    return [P.lon0 + x / (P.R * Math.cos(P.phi1)), y / P.R];
  },
  params: ['lon0', 'phi1'],
  defaults: { lon0: 0, phi1: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI },
  family: 'cyl',
  notes: 'φ1 — стандартная параллель; φ1=0 — plate carrée, φ1=±45° — Галла равнопром.',
});

/* 2. Меркатора — Mercator (равноугольная) */
register('mercator', {
  forward(lambda, phi, P) {
    return [P.R * (lambda - P.lon0), P.R * gd_inv(phi)]; // y = R·artanh(sinφ)
  },
  inverse(x, y, P) {
    return [P.lon0 + x / P.R, gd(y / P.R)];               // φ = gd(y/R)
  },
  params: ['lon0'],
  defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: 85 * DEG },               // полюса уходят в ∞
  family: 'cyl',
  notes: 'Конформна; локсодромы — прямые. Не для тематических карт мира.',
});

/* 3. Поперечная Меркатора — Transverse Mercator (сфера; эллипсоид/ГК — поздняя фаза) */
register('tmerc', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    const B = Math.cos(phi) * Math.sin(dl);
    if (Math.abs(B) >= 1) return [NaN, NaN];               // точка в 90° от ос. меридиана на экваторе
    const x = P.R * P.k0 * Math.atanh(B);
    const y = P.R * P.k0 * (Math.atan2(Math.sin(phi), Math.cos(phi) * Math.cos(dl)) - P.phi0);
    return [x, y];
  },
  inverse(x, y, P) {
    const Rk = P.R * P.k0;
    const D = y / Rk + P.phi0;
    const phi = asin_c(Math.sin(D) / Math.cosh(x / Rk));
    const lambda = P.lon0 + Math.atan2(Math.sinh(x / Rk), Math.cos(D));
    return [lambda, phi];
  },
  params: ['lon0', 'phi0', 'k0'],
  defaults: { lon0: 0, phi0: 0, k0: 1 },
  domain: { lamMax: 80 * DEG, phiMax: HALF_PI },           // годна в полосе вокруг ос. меридиана
  family: 'cyl',
  notes: 'UTM/ГК — k0=0.9996, зоны 6°. Здесь сфера; эллипсоидальные ряды — поздняя фаза.',
});

/* 4. Кассини — Cassini–Soldner (поперечная равнопромежуточная) */
register('cassini', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    const x = P.R * asin_c(Math.cos(phi) * Math.sin(dl));
    const y = P.R * (Math.atan2(Math.sin(phi), Math.cos(phi) * Math.cos(dl)) - P.phi0);
    return [x, y];
  },
  inverse(x, y, P) {
    const D = y / P.R + P.phi0;
    const phi = asin_c(Math.sin(D) * Math.cos(x / P.R));
    const lambda = P.lon0 + Math.atan2(Math.sin(x / P.R), Math.cos(x / P.R) * Math.cos(D));
    return [lambda, phi];
  },
  params: ['lon0', 'phi0'],
  defaults: { lon0: 0, phi0: 0 },
  domain: { lamMax: 80 * DEG, phiMax: HALF_PI },
  family: 'cyl',
  notes: 'Истинные расстояния вдоль ос. меридиана и перпендикуляров к нему.',
});

/* 5. Ламберта равновеликая цилиндрическая — Cylindrical Equal-Area (семейство) */
register('lambert-cea', {
  forward(lambda, phi, P) {
    const cs = Math.cos(P.phi1);                           // φ1 = φ_s, стандартная параллель
    return [P.R * (lambda - P.lon0) * cs, P.R * Math.sin(phi) / cs];
  },
  inverse(x, y, P) {
    const cs = Math.cos(P.phi1);
    return [P.lon0 + x / (P.R * cs), asin_c(y * cs / P.R)];
  },
  params: ['lon0', 'phi1'],
  defaults: { lon0: 0, phi1: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI },
  family: 'cyl',
  notes: 'φ_s: 0 Ламберт, 30° Берман, 45° Галла–Петерса, 50° Балтазара.',
});

/* 6. Галла стереографическая — Gall stereographic (компромиссная) */
register('gall-stereo', {
  forward(lambda, phi, P) {
    return [P.R * (lambda - P.lon0) / SQRT2, P.R * (1 + SQRT2 / 2) * Math.tan(phi / 2)];
  },
  inverse(x, y, P) {
    return [P.lon0 + SQRT2 * x / P.R, 2 * Math.atan(y / (P.R * (1 + SQRT2 / 2)))];
  },
  params: ['lon0'],
  defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI },
  family: 'cyl',
  notes: 'Точка обзора на экваторе, секущий цилиндр по ±45°.',
});

/* 7. Миллера цилиндрическая — Miller cylindrical (компромиссная) */
register('miller', {
  forward(lambda, phi, P) {
    // y = (5/4)R·arsinh(tan(4φ/5)) = (5/4)R·ln tan(π/4 + 2φ/5)
    return [P.R * (lambda - P.lon0), 1.25 * P.R * Math.asinh(Math.tan(0.8 * phi))];
  },
  inverse(x, y, P) {
    return [P.lon0 + x / P.R, 1.25 * Math.atan(Math.sinh(0.8 * y / P.R))];
  },
  params: ['lon0'],
  defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI },
  family: 'cyl',
  notes: '«Меркатор от 4/5·φ, растянутый на 5/4»: полюса конечны, но не конформна.',
});

/* 8. Центральная цилиндрическая — Central cylindrical (перспективная) */
register('central-cyl', {
  forward(lambda, phi, P) {
    return [P.R * (lambda - P.lon0), P.R * Math.tan(phi)];
  },
  inverse(x, y, P) {
    return [P.lon0 + x / P.R, Math.atan(y / P.R)];
  },
  params: ['lon0'],
  defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: 80 * DEG },                // tanφ → ∞
  family: 'cyl',
  notes: 'Сильнейшее искажение площадей; включена ради полноты.',
});

/* 9. Косая Меркатора (Хотина) — Oblique Mercator (сфера; центр+азимут) */
register('oblique-mercator', {
  forward(lambda, phi, P) {
    const { R, k0 } = P, phic = P.phic, lonc = P.lonc, beta = P.azi;
    const phip = asin_c(Math.cos(phic) * Math.sin(beta));
    const lonp = Math.atan2(-Math.cos(beta), -Math.sin(phic) * Math.sin(beta)) + lonc;
    const lon0 = lonp + HALF_PI;
    const dl = lambda - lon0;
    const A = Math.sin(phip) * Math.sin(phi) - Math.cos(phip) * Math.cos(phi) * Math.sin(dl);
    if (Math.abs(A) >= 1) return [NaN, NaN];
    const x = R * k0 * Math.atan2(
      Math.sin(phi) * Math.cos(phip) + Math.sin(phip) * Math.cos(phi) * Math.sin(dl),
      Math.cos(phi) * Math.cos(dl)
    );
    const y = R * k0 * Math.atanh(A);
    return [x, y];
  },
  inverse(x, y, P) {
    const { R, k0 } = P, phic = P.phic, lonc = P.lonc, beta = P.azi;
    const phip = asin_c(Math.cos(phic) * Math.sin(beta));
    const lonp = Math.atan2(-Math.cos(beta), -Math.sin(phic) * Math.sin(beta)) + lonc;
    const lon0 = lonp + HALF_PI;
    const u = x / (R * k0), v = y / (R * k0);
    const phi = asin_c(Math.sin(phip) * Math.tanh(v) + Math.cos(phip) * Math.sin(u) / Math.cosh(v));
    const lambda = lon0 + Math.atan2(
      Math.sin(phip) * Math.sin(u) - Math.cos(phip) * Math.sinh(v),
      Math.cos(u)
    );
    return [lambda, phi];
  },
  params: ['phic', 'lonc', 'azi', 'k0'],
  defaults: { phic: 40 * DEG, lonc: 0, azi: 30 * DEG, k0: 1 },
  domain: { lamMax: PI, phiMax: 89 * DEG },
  family: 'cyl',
  notes: 'Сфера, параметризация центр (φc,λc)+азимут β. Эллипсоид (Хотин) — поздняя фаза.',
});

/* 10. Космическая косая Меркатора — Space Oblique Mercator (Landsat 1–3) */
register('space-oblique-mercator', {
  forward(lambda, phi, P) {
    const i = P.inc, n = P.ratio;                          // n = P2/P1
    const dl0 = lambda - P.lon0;                           // λ − λ0
    // итерация трансформированной долготы λ′ (квадрантно-корректная форма atan2)
    const lamP = fixedPoint((lp) => {
      const lt = dl0 + n * lp;
      return Math.atan2(
        Math.cos(phi) * Math.cos(i) * Math.sin(lt) + Math.sin(i) * Math.sin(phi),
        Math.cos(phi) * Math.cos(lt)
      );
    }, dl0, { tol: 1e-11, maxit: 100 });
    if (!isFinite(lamP)) return [NaN, NaN];
    const lt = dl0 + n * lamP;
    const phiP = asin_c(Math.cos(i) * Math.sin(phi) - Math.sin(i) * Math.cos(phi) * Math.sin(lt));
    const S = n * Math.sin(i) * Math.cos(lamP);            // (P2/P1) sin i cos λ′
    const root = Math.sqrt(1 + S * S);
    const lnt = gd_inv(phiP);                              // ln tan(π/4 + φ′/2)
    const xR = P.B * lamP + P.A2 * Math.sin(2 * lamP) + P.A4 * Math.sin(4 * lamP)
             - (S / root) * lnt;
    const yR = P.C1 * Math.sin(lamP) + P.C3 * Math.sin(3 * lamP)
             + (1 / root) * lnt;
    return [P.R * xR, P.R * yR];
  },
  inverse: null,                                           // итеративная; поздняя фаза
  params: ['lon0'],
  defaults: {
    lon0: 0,
    inc: 99.092 * DEG, ratio: 18 / 251,                    // Landsat 1–3
    B: 1.0075654142, A2: -0.0018820, A4: 0.0000007,
    C1: 0.1421597, C3: -0.0000296,
  },
  domain: { lamMax: PI, phiMax: 80 * DEG },
  family: 'cyl',
  static: false,
  notes: 'Коэффициенты Landsat 1–3 (PP 1395). Общие орбитальные константы (Симпсон) и обратка — поздняя фаза.',
});

/* ═════════════════════════════════════════════════════════════════════════
 * БАТЧ 2a — ПСЕВДОЦИЛИНДРИЧЕСКИЕ I (Класс II)
 * Параллели — прямые; центральный меридиан — прямая; остальные изогнуты.
 * Формулы — буквально из карточек; сфера, R = P.R.
 * ═══════════════════════════════════════════════════════════════════════ */

/* ── внутренние решатели вспомогательного угла θ (общие для нескольких карт) ── */

/** Молльвейде: θ из 2θ + sin2θ = π·sinφ (Ньютон, старт θ=φ). На полюсах ±π/2. */
function mollweideTheta(phi) {
  if (Math.abs(phi) >= HALF_PI - 1e-12) return sign(phi) * HALF_PI;
  const c = PI * Math.sin(phi);
  const t = newton(
    (x) => 2 * x + Math.sin(2 * x) - c,
    (x) => 2 + 2 * Math.cos(2 * x),
    phi, { tol: 1e-12, maxit: 60 }
  );
  return isFinite(t) ? t : sign(phi) * HALF_PI;
}

/** Эккерт IV: θ из θ + sinθcosθ + 2sinθ = (2+π/2)·sinφ (Ньютон, старт θ=φ/2). */
function eckert4Theta(phi) {
  if (Math.abs(phi) >= HALF_PI - 1e-12) return sign(phi) * HALF_PI;
  const C = (2 + HALF_PI) * Math.sin(phi);
  const t = newton(
    (x) => x + Math.sin(x) * Math.cos(x) + 2 * Math.sin(x) - C,
    (x) => 2 * Math.cos(x) * (Math.cos(x) + 1),
    phi / 2, { tol: 1e-12, maxit: 60 }
  );
  return isFinite(t) ? t : sign(phi) * HALF_PI;
}

/** Эккерт VI: θ из θ + sinθ = (1+π/2)·sinφ (Ньютон, старт θ=φ). */
function eckert6Theta(phi) {
  const C = (1 + HALF_PI) * Math.sin(phi);
  const t = newton(
    (x) => x + Math.sin(x) - C,
    (x) => 1 + Math.cos(x),
    phi, { tol: 1e-12, maxit: 60 }
  );
  return isFinite(t) ? t : sign(phi) * HALF_PI;
}

/* 1. Синусоидальная — Sinusoidal / Sanson–Flamsteed (равновеликая) */
register('sinusoidal', {
  forward(lambda, phi, P) {
    return [P.R * (lambda - P.lon0) * Math.cos(phi), P.R * phi];
  },
  inverse(x, y, P) {
    const phi = y / P.R;
    return [P.lon0 + x / (P.R * Math.cos(phi)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Равновелика; параллели истинной длины. Часто прерванная.',
});

/* 2. Молльвейде — Mollweide / Homolographic (равновеликая) */
register('mollweide', {
  forward(lambda, phi, P) {
    const th = mollweideTheta(phi);
    return [(2 * SQRT2 / PI) * P.R * (lambda - P.lon0) * Math.cos(th), SQRT2 * P.R * Math.sin(th)];
  },
  inverse(x, y, P) {
    const th = asin_c(y / (SQRT2 * P.R));
    const phi = asin_c((2 * th + Math.sin(2 * th)) / PI);
    return [P.lon0 + PI * x / (2 * SQRT2 * P.R * Math.cos(th)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Эллипс 2:1, равновеликий. Прямая — один шаг Ньютона по θ; обратная замкнута.',
});

/* 3. Эккерта I — Eckert I (компромиссная; прямые меридианы с изломом на экваторе) */
register('eckert1', {
  forward(lambda, phi, P) {
    const k = 2 * Math.sqrt(2 / (3 * PI));
    return [k * P.R * (lambda - P.lon0) * (1 - Math.abs(phi) / PI), k * P.R * phi];
  },
  inverse(x, y, P) {
    const k = 2 * Math.sqrt(2 / (3 * PI));
    const phi = y / (k * P.R);
    return [P.lon0 + x / (k * P.R * (1 - Math.abs(phi) / PI)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Прямолинейные меридианы. Пара к равновеликой Эккерт II.',
});

/* 4. Эккерта II — Eckert II (равновеликая) */
register('eckert2', {
  forward(lambda, phi, P) {
    const c1 = 2 / Math.sqrt(6 * PI), c2 = Math.sqrt(2 * PI / 3);
    const w = Math.sqrt(4 - 3 * Math.sin(Math.abs(phi)));
    return [c1 * P.R * (lambda - P.lon0) * w, c2 * P.R * (2 - w) * sign(phi)];
  },
  inverse(x, y, P) {
    const c1 = 2 / Math.sqrt(6 * PI), c2 = Math.sqrt(2 * PI / 3);
    const w = 2 - Math.abs(y) / (c2 * P.R);
    const phi = sign(y) * asin_c((4 - w * w) / 3);
    return [P.lon0 + x / (c1 * P.R * w), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Равновеликий двойник Эккерт I.',
});

/* 5. Эккерта III — Eckert III (компромиссная; полуэллиптические меридианы) */
register('eckert3', {
  forward(lambda, phi, P) {
    const d = Math.sqrt(4 * PI + PI * PI);
    const g = 1 + Math.sqrt(1 - (2 * phi / PI) ** 2);
    return [2 * g * P.R * (lambda - P.lon0) / d, 4 * P.R * phi / d];
  },
  inverse(x, y, P) {
    const d = Math.sqrt(4 * PI + PI * PI);
    const phi = y * d / (4 * P.R);
    const g = 1 + Math.sqrt(1 - (2 * phi / PI) ** 2);
    return [P.lon0 + x * d / (2 * P.R * g), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Не равновелика (в отличие от IV/VI). Полюсная линия в половину экватора.',
});

/* 6. Эккерта IV — Eckert IV (равновеликая, с полюсной линией) */
register('eckert4', {
  forward(lambda, phi, P) {
    const th = eckert4Theta(phi);
    const cx = 2 / Math.sqrt(PI * (4 + PI)), cy = 2 * Math.sqrt(PI / (4 + PI));
    return [cx * P.R * (lambda - P.lon0) * (1 + Math.cos(th)), cy * P.R * Math.sin(th)];
  },
  inverse(x, y, P) {
    const th = asin_c(y / (2 * P.R) * Math.sqrt((4 + PI) / PI));
    const phi = asin_c((th + Math.sin(th) * Math.cos(th) + 2 * Math.sin(th)) / (2 + HALF_PI));
    return [P.lon0 + Math.sqrt(PI * (4 + PI)) * x / (2 * P.R * (1 + Math.cos(th))), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Мягче синусоидальной у краёв; среди исходных проекций подбора Equal Earth.',
});

/* 7. Эккерта V — Eckert V (компромиссная; синусоидальные меридианы) */
register('eckert5', {
  forward(lambda, phi, P) {
    const e = Math.sqrt(2 + PI);
    return [P.R * (1 + Math.cos(phi)) * (lambda - P.lon0) / e, 2 * P.R * phi / e];
  },
  inverse(x, y, P) {
    const e = Math.sqrt(2 + PI);
    const phi = y * e / (2 * P.R);
    return [P.lon0 + x * e / (P.R * (1 + Math.cos(phi))), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Компромиссный аналог равновеликого Эккерт VI (без итерации).',
});

/* 8. Эккерта VI — Eckert VI (равновеликая) */
register('eckert6', {
  forward(lambda, phi, P) {
    const th = eckert6Theta(phi);
    const e = Math.sqrt(2 + PI);
    return [P.R * (lambda - P.lon0) * (1 + Math.cos(th)) / e, 2 * P.R * th / e];
  },
  inverse(x, y, P) {
    const e = Math.sqrt(2 + PI);
    const th = y * e / (2 * P.R);
    const phi = asin_c((th + Math.sin(th)) / (1 + HALF_PI));
    return [P.lon0 + x * e / (P.R * (1 + Math.cos(th))), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Полюсная линия в половину экватора; часто прерванная.',
});

/* 9. Робинсона — Robinson (компромиссная, табличная: интерполяция по 5°) */
const ROB_PHI = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];
const ROB_X = [1.0000, 0.9986, 0.9954, 0.9900, 0.9822, 0.9730, 0.9600, 0.9427, 0.9216,
  0.8962, 0.8679, 0.8350, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322];
const ROB_Y = [0.0000, 0.0620, 0.1240, 0.1860, 0.2480, 0.3100, 0.3720, 0.4340, 0.4958,
  0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1.0000];
/** Кубическая интерполяция Эйткена–Невилла по 4 узлам вокруг d (градусы). */
function robSeg(d) {
  let k = Math.floor(d / 5) - 1;
  if (k < 0) k = 0;
  if (k > ROB_X.length - 4) k = ROB_X.length - 4;
  return k;
}
function neville(xs, ys, k, x) {
  const X = [xs[k], xs[k + 1], xs[k + 2], xs[k + 3]];
  const c = [ys[k], ys[k + 1], ys[k + 2], ys[k + 3]];
  for (let m = 1; m < 4; m++)
    for (let i = 0; i < 4 - m; i++)
      c[i] = ((x - X[i + m]) * c[i] + (X[i] - x) * c[i + 1]) / (X[i] - X[i + m]);
  return c[0];
}
register('robinson', {
  forward(lambda, phi, P) {
    const d = Math.abs(phi) * RAD, k = robSeg(d);
    const X = neville(ROB_PHI, ROB_X, k, d), Y = neville(ROB_PHI, ROB_Y, k, d);
    return [0.8487 * P.R * X * (lambda - P.lon0), 1.3523 * P.R * Y * sign(phi)];
  },
  inverse(x, y, P) {
    const T = clamp(Math.abs(y) / (1.3523 * P.R), 0, 1);
    let lo = 0, hi = 90, d = 45;                       // Y(|φ|) монотонна — бисекция
    for (let i = 0; i < 48; i++) {
      d = 0.5 * (lo + hi);
      const Yd = neville(ROB_PHI, ROB_Y, robSeg(d), d);
      if (Yd < T) lo = d; else hi = d;
    }
    const phi = sign(y) * d * DEG;
    const X = neville(ROB_PHI, ROB_X, robSeg(d), d);
    return [P.lon0 + x / (0.8487 * P.R * X), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Аналитической формулы нет: таблица X,Y через 5° + интерполяция Эйткена. Стандарт Rand McNally.',
});

/* 10. Natural Earth (Patterson) — STATIC: коэффициенты полинома в карточке отсутствуют */
/* Natural Earth ≡ Natural Earth I (Паттерсон 2007; исходно задана таблицей через 5°).
 * Стандартная исполняемая форма — полиномиальная подгонка Šavrič 2011, уже
 * реализованная как 'natural-earth-1'. Делегируем туда (вычисляется в рантайме,
 * когда 'natural-earth-1' уже зарегистрирована). */
register('natural-earth', {
  forward(lambda, phi, P) { return PROJECTIONS['natural-earth-1'].forward(lambda, phi, P); },
  inverse(x, y, P) { return PROJECTIONS['natural-earth-1'].inverse(x, y, P); },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Natural Earth = Natural Earth I (полином Šavrič 2011, подгонка к таблице Паттерсона). Делегирует в natural-earth-1.',
});

/* 11. Каврайского VII — Kavrayskiy VII (компромиссная; обратима в строку) */
register('kavrayskiy7', {
  forward(lambda, phi, P) {
    return [1.5 * (lambda - P.lon0) * Math.sqrt(1 / 3 - (phi / PI) ** 2) * P.R, P.R * phi];
  },
  inverse(x, y, P) {
    const phi = y / P.R;
    return [P.lon0 + 2 * x / (3 * P.R * Math.sqrt(1 / 3 - (y / (PI * P.R)) ** 2)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Почти неотличима от Винкеля-Трипель, но обратима в одну строку.',
});

/* 12. Вагнера VI — Wagner VI (компромиссная; обратима в строку) */
register('wagner6', {
  forward(lambda, phi, P) {
    return [P.R * (lambda - P.lon0) * Math.sqrt(1 - 3 * (phi / PI) ** 2), P.R * phi];
  },
  inverse(x, y, P) {
    const phi = y / P.R;
    return [P.lon0 + x / (P.R * Math.sqrt(1 - 3 * (y / (PI * P.R)) ** 2)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Псевдо-Винкель с замкнутой обратной; полюсная линия в половину экватора.',
});

/* 13. Коллиньона — Collignon (равновеликая; мир-треугольник, блок HEALPix) */
register('collignon', {
  forward(lambda, phi, P) {
    const r = Math.sqrt(1 - Math.sin(phi)), sp = Math.sqrt(PI);
    return [2 * P.R * (lambda - P.lon0) / sp * r, sp * P.R * (1 - r)];
  },
  inverse(x, y, P) {
    const sp = Math.sqrt(PI);
    const s = 1 - y / (sp * P.R);
    return [P.lon0 + sp * x / (2 * P.R * s), asin_c(1 - s * s)];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Множитель √(1−sinφ) даёт треугольник и равновеликость. Полярный блок HEALPix.',
});

/* 14. Крастера параболическая — Craster parabolic / Putniņš P4 (равновеликая) */
register('craster', {
  forward(lambda, phi, P) {
    const a = Math.sqrt(3 / PI), b = Math.sqrt(3 * PI);
    return [a * P.R * (lambda - P.lon0) * (2 * Math.cos(2 * phi / 3) - 1), b * P.R * Math.sin(phi / 3)];
  },
  inverse(x, y, P) {
    const a = Math.sqrt(3 / PI), b = Math.sqrt(3 * PI);
    const phi = 3 * asin_c(y / (b * P.R));
    return [P.lon0 + x / (a * P.R * (2 * Math.cos(2 * phi / 3) - 1)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Параболические меридианы, «острый» силуэт; = Putniņš P4.',
});

/* 15. Боггса эвморфная — Boggs eumorphic (равновеликая; среднее sinusoidal/Mollweide) */
register('boggs', {
  forward(lambda, phi, P) {
    if (Math.abs(phi) >= HALF_PI - 1e-9) {
      return [0, 0.49931 * P.R * (phi + SQRT2 * sign(phi))]; // θ=±π/2, x=0
    }
    const th = mollweideTheta(phi);
    const x = 2.00276 * P.R * (lambda - P.lon0) / (1 / Math.cos(phi) + 1.11072 / Math.cos(th));
    const y = 0.49931 * P.R * (phi + SQRT2 * Math.sin(th));
    return [x, y];
  },
  inverse: null,                                       // эвморфная — обратка итеративная (поздняя фаза)
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Усредняет sinusoidal и Молльвейде. Обычно прерванная.',
});

/* 16. Гуда гомолосинусоидальная — Goode homolosine (равновеликая, составная) */
export const GOODE_PHISTAR = 40.7437 * DEG;
const GOODE_THETASTAR = mollweideTheta(GOODE_PHISTAR);
const GOODE_OFFSET = GOODE_PHISTAR - SQRT2 * Math.sin(GOODE_THETASTAR); // сдвиг ветви Молльвейде (R=1)
register('goode', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    if (Math.abs(phi) <= GOODE_PHISTAR) {              // ветвь синусоидальной
      return [P.R * dl * Math.cos(phi), P.R * phi];
    }
    const th = mollweideTheta(phi);                    // ветвь Молльвейде со сшивкой
    return [
      (2 * SQRT2 / PI) * P.R * dl * Math.cos(th),
      P.R * (SQRT2 * Math.sin(th) + sign(phi) * GOODE_OFFSET),
    ];
  },
  inverse(x, y, P) {
    if (Math.abs(y) <= P.R * GOODE_PHISTAR) {          // граница: y синусоидальной на φ*
      const phi = y / P.R;
      return [P.lon0 + x / (P.R * Math.cos(phi)), phi];
    }
    const s = sign(y);
    const th = asin_c((y / P.R - s * GOODE_OFFSET) / SQRT2);
    const phi = asin_c((2 * th + Math.sin(2 * th)) / PI);
    return [P.lon0 + PI * x / (2 * SQRT2 * P.R * Math.cos(th)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Синусоидальная (|φ|≤40.7437°) ⊕ Молльвейде. Прерывание по лопастям — задача рендерера.',
});

/* 17. Квартатно-равновеликая — Quartic authalic (равновеликая) */
register('quartic', {
  forward(lambda, phi, P) {
    return [P.R * (lambda - P.lon0) * Math.cos(phi) / Math.cos(phi / 2), 2 * P.R * Math.sin(phi / 2)];
  },
  inverse(x, y, P) {
    const phi = 2 * asin_c(y / (2 * P.R));
    return [P.lon0 + x * Math.cos(phi / 2) / (P.R * Math.cos(phi)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'База семейства McBryde–Thomas flat-polar quartic; обратная замкнута.',
});

/* ═════════════════════════════════════════════════════════════════════════
 * БАТЧ 2b — ПСЕВДОЦИЛИНДРИЧЕСКИЕ II (Класс II, продолжение)
 * Включает современные (post-Snyder) полиномиальные и составные/семейства.
 * Формулы — буквально из карточек; сфера, R = P.R.
 * ═══════════════════════════════════════════════════════════════════════ */

/* ── общие решатели вспомогательного угла θ ── */
/** 2θ + sin2θ = rhs (Ньютон). Для wagner4/hatano (rhs_max < π, без особенности). */
function solveTwoThetaSin(rhs, start) {
  return newton((t) => 2 * t + Math.sin(2 * t) - rhs, (t) => 2 + 2 * Math.cos(2 * t),
    start, { tol: 1e-12, maxit: 60 });
}
/** Плоскополюсная синусоидальная: θ/2 + sinθ = (1+π/4)·sinφ. */
function fpsTheta(phi) {
  const C = (1 + PI / 4) * Math.sin(phi);
  return newton((t) => t / 2 + Math.sin(t) - C, (t) => 0.5 + Math.cos(t),
    phi, { tol: 1e-12, maxit: 60 });
}
/** Плоскополюсная квартатная: sin(θ/2) + sinθ = (1+√2/2)·sinφ. */
function fpqTheta(phi) {
  const C = (1 + SQRT2 / 2) * Math.sin(phi);
  return newton((t) => Math.sin(t / 2) + Math.sin(t) - C, (t) => 0.5 * Math.cos(t / 2) + Math.cos(t),
    phi, { tol: 1e-12, maxit: 60 });
}
const FPS_K = Math.sqrt(6 / (4 + PI));   // общий множитель flat-polar sinusoidal

/* 1. Цилиндрическая Паттерсона — Patterson cylindrical (компромиссная) */
register('patterson', {
  forward(lambda, phi, P) {
    const f = phi;
    const y = 1.0148 * f + 0.23185 * f ** 5 - 0.14499 * f ** 7 + 0.02406 * f ** 9;
    return [P.R * (lambda - P.lon0), P.R * y];
  },
  inverse(x, y, P) {
    const yt = y / P.R;
    const f = newton(
      (p) => 1.0148 * p + 0.23185 * p ** 5 - 0.14499 * p ** 7 + 0.02406 * p ** 9 - yt,
      (p) => 1.0148 + 1.15925 * p ** 4 - 1.01493 * p ** 6 + 0.21654 * p ** 8,
      clamp(yt / 1.0148, -HALF_PI, HALF_PI), { tol: 1e-12, maxit: 60 });
    return [P.lon0 + x / P.R, f];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'cyl',
  notes: 'Равноотстоящие вертикальные меридианы; вертикальное растяжение к полюсам ограничено.',
});

/* 2. Вагнера IV — Wagner IV / Putniņš P2′ (равновеликая) */
const W4_C = (4 * PI + 3 * Math.sqrt(3)) / 6;
register('wagner4', {
  forward(lambda, phi, P) {
    const th = solveTwoThetaSin(W4_C * Math.sin(phi), phi / 2);
    return [0.86310 * P.R * (lambda - P.lon0) * Math.cos(th), 1.56548 * P.R * Math.sin(th)];
  },
  inverse(x, y, P) {
    const th = asin_c(y / (1.56548 * P.R));
    const phi = asin_c((2 * th + Math.sin(2 * th)) / W4_C);
    return [P.lon0 + x / (0.86310 * P.R * Math.cos(th)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Равновеликая с полюсной линией; тождественна Putniņš P2′.',
});

/* 3. Хатано асимметричная — Hatano asymmetrical equal-area (равновеликая) */
register('hatano', {
  forward(lambda, phi, P) {
    const n = phi >= 0;
    const C = n ? 2.67595 : 2.43763, cy = n ? 1.75859 : 1.93052;
    const th = solveTwoThetaSin(C * Math.sin(phi), phi / 2);
    return [0.85 * P.R * (lambda - P.lon0) * Math.cos(th), cy * P.R * Math.sin(th)];
  },
  inverse(x, y, P) {
    const n = y >= 0;
    const C = n ? 2.67595 : 2.43763, cy = n ? 1.75859 : 1.93052;
    const th = asin_c(y / (cy * P.R));
    const phi = asin_c((2 * th + Math.sin(2 * th)) / C);
    return [P.lon0 + x / (0.85 * P.R * Math.cos(th)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Нарочито асимметрична по экватору (разные коэф. для полушарий). Равновелика.',
});

/* 4. Макбрайда–Томаса плоскополюсная синусоидальная — MT flat-polar sinusoidal (равновеликая) */
register('mt-fps', {
  forward(lambda, phi, P) {
    const th = fpsTheta(phi);
    return [P.R * FPS_K * (0.5 + Math.cos(th)) * (lambda - P.lon0) / 1.5, P.R * FPS_K * th];
  },
  inverse(x, y, P) {
    const th = y / (P.R * FPS_K);
    const phi = asin_c((th / 2 + Math.sin(th)) / (1 + PI / 4));
    return [P.lon0 + 1.5 * x / (P.R * FPS_K * (0.5 + Math.cos(th))), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Плоскополюсная синусоидальная: полюс — линия.',
});

/* 5. Макбрайда–Томаса плоскополюсная параболическая — MT flat-polar parabolic (равновеликая) */
register('mt-fpp', {
  forward(lambda, phi, P) {
    const th = asin_c((7 / 3) * Math.sin(phi) / Math.sqrt(6)); // прямой arcsin, без итерации
    return [Math.sqrt(6) * P.R * (lambda - P.lon0) * (2 * Math.cos(2 * th / 3) - 1) / Math.sqrt(7),
            9 * P.R * Math.sin(th / 3) / Math.sqrt(7)];
  },
  inverse(x, y, P) {
    const th = 3 * asin_c(y * Math.sqrt(7) / (9 * P.R));
    const phi = asin_c(3 * Math.sqrt(6) * Math.sin(th) / 7);
    return [P.lon0 + x * Math.sqrt(7) / (Math.sqrt(6) * P.R * (2 * Math.cos(2 * th / 3) - 1)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Параболические меридианы + полюсная линия; θ — прямой arcsin.',
});

/* 6. Макбрайда–Томаса плоскополюсная квартатная — MT flat-polar quartic (равновеликая) */
const FPQ_KX = Math.sqrt(3 * Math.sqrt(2) + 6), FPQ_KY = Math.sqrt(2 + Math.sqrt(2));
register('mt-fpq', {
  forward(lambda, phi, P) {
    const th = fpqTheta(phi);
    return [P.R * (lambda - P.lon0) * (1 + 2 * Math.cos(th) / Math.cos(th / 2)) / FPQ_KX,
            2 * Math.sqrt(3) * P.R * Math.sin(th / 2) / FPQ_KY];
  },
  inverse(x, y, P) {
    const th = 2 * asin_c(y * FPQ_KY / (2 * Math.sqrt(3) * P.R));
    const phi = asin_c((Math.sin(th / 2) + Math.sin(th)) / (1 + SQRT2 / 2));
    return [P.lon0 + x * FPQ_KX / (P.R * (1 + 2 * Math.cos(th) / Math.cos(th / 2))), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Меридианы 4-го порядка + полюсная линия. База McBryde–Thomas flat-polar.',
});

/* 7. Макбрайда S3 — McBryde S3 (равновеликая, составная) */
export const MS3_PHIB = (55 + 51 / 60) * DEG;                // граница сшивки 55°51′
register('mcbryde-s3', {
  forward(lambda, phi, P) {
    if (Math.abs(phi) <= MS3_PHIB) {                  // синусоидальная в тропиках
      return [P.R * (lambda - P.lon0) * Math.cos(phi), P.R * phi];
    }
    const th = fpsTheta(phi);                         // плоскополюсная синусоидальная со сдвигом
    return [P.R * FPS_K * (0.5 + Math.cos(th)) * (lambda - P.lon0) / 1.5,
            P.R * (FPS_K * th - 0.069065 * sign(phi))];
  },
  inverse(x, y, P) {
    if (Math.abs(y) <= P.R * MS3_PHIB) {
      const phi = y / P.R;
      return [P.lon0 + x / (P.R * Math.cos(phi)), phi];
    }
    const th = (y / P.R + 0.069065 * sign(y)) / FPS_K;
    const phi = asin_c((th / 2 + Math.sin(th)) / (1 + PI / 4));
    return [P.lon0 + 1.5 * x / (P.R * FPS_K * (0.5 + Math.cos(th))), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Синусоидальная ⊕ плоскополюсная синусоидальная, сшивка на 55°51′. Обычно прерванная.',
});

/* 8. Путниньша P5 — Putniņš P5 (компромиссная) */
register('putnins-p5', {
  forward(lambda, phi, P) {
    return [1.01346 * P.R * (lambda - P.lon0) * (2 - Math.sqrt(1 + 12 * phi * phi / (PI * PI))),
            1.01346 * P.R * phi];
  },
  inverse(x, y, P) {
    const phi = y / (1.01346 * P.R);
    return [P.lon0 + x / (1.01346 * P.R * (2 - Math.sqrt(1 + 12 * phi * phi / (PI * PI)))), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Гиперболические меридианы, полюс — точка. Латвийское семейство P1–P6.',
});

/* 9. Деноера полуэллиптическая — Denoyer semi-elliptical (компромиссная, эмпирическая) */
register('denoyer', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, L = Math.abs(dl);
    const arg = (0.95 - L / 12 + L ** 3 / 600) * (0.9 * phi + 0.03 * phi ** 5);
    return [P.R * dl * Math.cos(arg), P.R * phi];
  },
  inverse: null,                                       // x нелинейно зависит от λ через L=|λ−λ0|
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Эмпирическая аппроксимация графической проекции Деноера. Замкнутой обратной нет.',
});

/* 10. Локсимутальная — Loximuthal (компромиссная) */
register('loximuthal', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, y = P.R * (phi - P.phi1);
    const x = (Math.abs(phi - P.phi1) < 1e-9)
      ? P.R * dl * Math.cos(P.phi1)                    // особый случай φ=φ1
      : P.R * dl * (phi - P.phi1) / (gd_inv(phi) - gd_inv(P.phi1)); // знаменатель = ln tan-разность
    return [x, y];
  },
  inverse(x, y, P) {
    const phi = P.phi1 + y / P.R;
    const lambda = (Math.abs(phi - P.phi1) < 1e-9)
      ? P.lon0 + x / (P.R * Math.cos(P.phi1))
      : P.lon0 + x * (gd_inv(phi) - gd_inv(P.phi1)) / (P.R * (phi - P.phi1));
    return [lambda, phi];
  },
  params: ['lon0', 'phi1'], defaults: { lon0: 0, phi1: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Локсодромы из центральной точки — прямые истинной длины и азимута. φ1 — центр. широта.',
});

/* 11. Равная Земля — Equal Earth (равновеликая, post-Snyder) */
const EE = [1.340264, -0.081106, 0.000893, 0.003796];  // A1..A4
export const eePoly  = (t) => EE[3] * t ** 9 + EE[2] * t ** 7 + EE[1] * t ** 3 + EE[0] * t;
const eeDpoly = (t) => 9 * EE[3] * t ** 8 + 7 * EE[2] * t ** 6 + 3 * EE[1] * t ** 2 + EE[0];
register('equal-earth', {
  forward(lambda, phi, P) {
    const th = asin_c(Math.sqrt(3) / 2 * Math.sin(phi));
    return [P.R * 2 * Math.sqrt(3) * (lambda - P.lon0) * Math.cos(th) / (3 * eeDpoly(th)),
            P.R * eePoly(th)];
  },
  inverse(x, y, P) {
    const yt = y / P.R;
    const th = newton((t) => eePoly(t) - yt, (t) => eeDpoly(t), yt, { tol: 1e-12, maxit: 30 });
    const phi = asin_c(2 * Math.sin(th) / Math.sqrt(3));
    return [P.lon0 + 3 * eeDpoly(th) * (x / P.R) / (2 * Math.sqrt(3) * Math.cos(th)), phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Строго равновелика; знаменатель x = dy/dθ. Šavrič, Patterson, Jenny (2018).',
});

/* 12. Естественная Земля I — Natural Earth I (компромиссная, полином Šavrič 2011) */
const ne1L  = (f) => 0.8707 - 0.131979 * f ** 2 - 0.013791 * f ** 4 + 0.003971 * f ** 10 - 0.001529 * f ** 12;
const ne1Y  = (f) => 1.007226 * f + 0.015085 * f ** 3 - 0.044475 * f ** 7 + 0.028874 * f ** 9 - 0.005916 * f ** 11;
const ne1Yp = (f) => 1.007226 + 0.045255 * f ** 2 - 0.311325 * f ** 6 + 0.259866 * f ** 8 - 0.065076 * f ** 10;
register('natural-earth-1', {
  forward(lambda, phi, P) { return [P.R * (lambda - P.lon0) * ne1L(phi), P.R * ne1Y(phi)]; },
  inverse(x, y, P) {
    const yt = y / P.R;
    const f = newton((p) => ne1Y(p) - yt, ne1Yp, clamp(yt, -HALF_PI, HALF_PI), { tol: 1e-12, maxit: 40 });
    return [P.lon0 + x / (P.R * ne1L(f)), f];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Полином Šavrič, Jenny, Patterson, Hurni (2011) к табличной Natural Earth.',
});

/* 13. Естественная Земля II — Natural Earth II (компромиссная, полином Šavrič 2014) */
const ne2L  = (f) => 0.84719 - 0.13063 * f ** 2 - 0.04515 * f ** 12 + 0.05494 * f ** 14 - 0.02326 * f ** 16 + 0.00331 * f ** 18;
const ne2Y  = (f) => 1.01183 * f - 0.02625 * f ** 9 + 0.01926 * f ** 11 - 0.00396 * f ** 13;
const ne2Yp = (f) => 1.01183 - 0.23625 * f ** 8 + 0.21186 * f ** 10 - 0.05148 * f ** 12;
register('natural-earth-2', {
  forward(lambda, phi, P) { return [P.R * (lambda - P.lon0) * ne2L(phi), P.R * ne2Y(phi)]; },
  inverse(x, y, P) {
    const yt = y / P.R;
    const f = newton((p) => ne2Y(p) - yt, ne2Yp, clamp(yt, -HALF_PI, HALF_PI), { tol: 1e-12, maxit: 40 });
    return [P.lon0 + x / (P.R * ne2L(f)), f];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Полюса заострены сильнее, контур округлее, чем у NE I. Šavrič & Jenny (2014).',
});

/* 14. Гиперэллиптическая Тоблера — Tobler hyperelliptical (равновеликое семейство) */
const tobS = (t, al, k) => al + (1 - al) * Math.pow(1 - Math.pow(Math.abs(t), k), 1 / k);
function tobIntegral(t, al, k, n = 32) {              // Симпсон ∫₀ᵗ s(τ)dτ
  if (t <= 0) return 0;
  const h = t / n; let s = tobS(0, al, k) + tobS(t, al, k);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * tobS(i * h, al, k);
  return s * h / 3;
}
/* Кэш обращения площади t↔A(t)=∫₀ᵗs/I1 для (α,k): строится один раз тем же
 * tobIntegral, поэтому forward (поиск t по A) и inverse (A по t) взаимно точны.
 * Сводит forward с ~1.5k вызовов tobS на точку к O(log N) поиску по таблице. */
const _tobTab = new Map();
function tobTable(al, k) {
  const key = al + '|' + k; let e = _tobTab.get(key); if (e) return e;
  const N = 2048, A = new Float64Array(N + 1), I1 = tobIntegral(1, al, k);
  for (let i = 0; i <= N; i++) A[i] = tobIntegral(i / N, al, k) / I1;
  e = { N, A, I1 }; _tobTab.set(key, e); return e;
}
/** t по нормированной площади A∈[0,1] — бинарный поиск + лин. интерполяция. */
function tobTfromArea(area, al, k) {
  const { N, A } = tobTable(al, k); area = clamp(area, 0, 1);
  let lo = 0, hi = N; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (A[m] < area) lo = m; else hi = m; }
  const a0 = A[lo], a1 = A[hi]; return (lo + (a1 > a0 ? (area - a0) / (a1 - a0) : 0)) / N;
}
/** Нормированная площадь A(t)=∫₀ᵗs/I1 по таблице — лин. интерполяция. */
function tobAreaAtT(t, al, k) {
  const { N, A } = tobTable(al, k); t = clamp(t, 0, 1);
  const x = t * N, i = Math.floor(x); if (i >= N) return A[N];
  return A[i] + (A[i + 1] - A[i]) * (x - i);
}
register('tobler-hyperelliptical', {
  forward(lambda, phi, P) {
    const al = P.alpha, k = P.k, { I1 } = tobTable(al, k);
    const a = Math.sqrt(P.gamma / (PI * I1)), b = 1 / (a * I1); // равновеликость: a·b·I1 = 1
    const t = tobTfromArea(Math.abs(Math.sin(phi)), al, k);     // t(φ) — обращением площади по кэшу
    return [P.R * a * (lambda - P.lon0) * tobS(t, al, k), P.R * b * t * sign(phi)];
  },
  inverse(x, y, P) {
    const al = P.alpha, k = P.k, { I1 } = tobTable(al, k);
    const a = Math.sqrt(P.gamma / (PI * I1)), b = 1 / (a * I1);
    const t = clamp(Math.abs(y) / (P.R * b), 0, 1);
    const phi = sign(y) * asin_c(tobAreaAtT(t, al, k));         // та же таблица ⇒ точное обращение forward
    return [P.lon0 + x / (P.R * a * tobS(t, al, k)), phi];
  },
  params: ['lon0', 'alpha', 'k', 'gamma'],
  defaults: { lon0: 0, alpha: 0, k: 2.5, gamma: 2 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Равновеликое семейство; контур-гиперэллипс |x/a|ᵏ+|y/b|ᵏ=1. Дефолты α=0, k=2.5, γ=2.',
});

/* 15. HEALPix (равновеликая, гибридная; масштаб 3π/8 постоянен) */
register('healpix', {
  forward(lambda, phi, P) {
    const dl = normalizeLon(lambda - P.lon0), H = P.H, sp = Math.sin(phi);
    if (Math.abs(sp) <= 2 / 3) {                       // экв. пояс: цилиндр. равновеликая Ламберта
      return [P.R * dl, P.R * (3 * PI / 8) * sp];
    }
    const i = Math.floor((dl + PI) * H / (2 * PI));    // полярные доли: треугольники Коллиньона
    const lc = -PI + (2 * i + 1) * PI / H;
    const sigma = Math.sqrt(3 * (1 - Math.abs(sp)));
    return [P.R * (lc + (dl - lc) * sigma), P.R * sign(phi) * (PI / 4) * (2 - sigma)];
  },
  inverse(x, y, P) {
    const H = P.H, yt = y / P.R, xt = x / P.R;
    if (Math.abs(yt) <= PI / 4) {
      return [P.lon0 + xt, asin_c(8 * yt / (3 * PI))];
    }
    const sigma = 2 - 4 * Math.abs(yt) / PI;
    const i = Math.floor((xt + PI) * H / (2 * PI));
    const lc = -PI + (2 * i + 1) * PI / H;
    return [P.lon0 + lc + (xt - lc) / sigma, sign(yt) * asin_c(1 - sigma * sigma / 3)];
  },
  params: ['lon0'], defaults: { lon0: 0, H: 4 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Цилиндр. пояс ⊕ треугольники Коллиньона; шов непрерывен (σ=1). H=4. Равновелика (масштаб 3π/8).',
});

/* 16. Таймс — Times (компромиссная) */
register('times', {
  forward(lambda, phi, P) {
    const t = Math.tan(phi / 2), s = Math.sin(PI / 4 * t);
    return [P.R * (lambda - P.lon0) * (0.74482 - 0.34588 * s * s), 1.70711 * P.R * t];
  },
  inverse(x, y, P) {
    const t = y / (1.70711 * P.R), s = Math.sin(PI / 4 * t);
    return [P.lon0 + x / (P.R * (0.74482 - 0.34588 * s * s)), 2 * Math.atan(t)];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Модификация Галла-стереографической с изогнутыми меридианами (Бартоломью, 1965).',
});

/* 17. Хуфнагеля (семейство) — Hufnagel (равновеликое 4-параметрическое) */
const hufM  = (p, a, b) => 2 * p + (1 + a - b / 2) * Math.sin(2 * p) + (a + b) / 2 * Math.sin(4 * p) + b / 2 * Math.sin(6 * p);
const hufMp = (p, a, b) => 2 + 2 * (1 + a - b / 2) * Math.cos(2 * p) + 2 * (a + b) * Math.cos(4 * p) + 3 * b * Math.cos(6 * p);
const hufR  = (p, a, b) => Math.sqrt(1 + a * Math.cos(2 * p) + b * Math.cos(4 * p));
function hufConsts(P) {
  const Mm = hufM(P.psiMax, P.a, P.b);
  const k = Math.sqrt(4 * PI / Mm);
  const c = Math.sqrt(P.ratio * Math.sin(P.psiMax)
    * Math.sqrt((1 + P.a * Math.cos(2 * P.psiMax) + P.b * Math.cos(4 * P.psiMax)) / (1 + P.a + P.b)));
  return { Mm, k, c };
}
register('hufnagel', {
  forward(lambda, phi, P) {
    const { a, b } = P, { Mm, k, c } = hufConsts(P);
    const psi = newton((p) => hufM(p, a, b) - Mm * Math.sin(phi), (p) => hufMp(p, a, b),
      P.psiMax * (2 / PI) * phi, { tol: 1e-12, maxit: 60 });
    const r = hufR(psi, a, b);
    return [P.R * k * c * (lambda - P.lon0) / PI * r * Math.cos(psi), P.R * (k / c) * r * Math.sin(psi)];
  },
  inverse(x, y, P) {
    const { a, b } = P, { Mm, k, c } = hufConsts(P);
    const rhs = y * c / (P.R * k);                     // r(ψ)·sinψ
    const psi = newton(
      (p) => hufR(p, a, b) * Math.sin(p) - rhs,
      (p) => { const r = hufR(p, a, b); return (-a * Math.sin(2 * p) - 2 * b * Math.sin(4 * p)) / r * Math.sin(p) + r * Math.cos(p); },
      P.psiMax * (2 / PI) * asin_c(clamp(rhs / Math.max(hufR(P.psiMax, a, b) * Math.sin(P.psiMax), 1e-9), -1, 1)),
      { tol: 1e-12, maxit: 60 });
    const r = hufR(psi, a, b);
    const phi = asin_c(hufM(psi, a, b) / Mm);
    return [P.lon0 + PI * x / (P.R * k * c * r * Math.cos(psi)), phi];
  },
  params: ['lon0', 'a', 'b', 'psiMax', 'ratio'],
  defaults: { lon0: 0, a: 1, b: 0, psiMax: 45 * DEG, ratio: 2 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudocyl',
  notes: 'Равновеликое семейство: M(ψ)=M(ψm)sinφ. Дефолты a=1,b=0,ψm=45°,ratio=2.',
});

/* ═════════════════════════════════════════════════════════════════════════
 * БАТЧ 3 — ЛИНЗОВИДНЫЕ / МОДИФ. АЗИМУТАЛЬНЫЕ (Класс III)
 * Карты мира в овале/круге; искривлены и параллели, и меридианы.
 * Формулы — буквально из карточек; сфера, R = P.R.
 * ═══════════════════════════════════════════════════════════════════════ */

/** α/sinα (= 1/sinc α) с пределом 1 при α→0 — несущая конструкция Айтова/Винкеля. */
const sincRatio = (a) => (Math.abs(a) < 1e-10 ? 1 : a / Math.sin(a));
export const WINKEL_PHI1 = Math.acos(2 / PI);   // стандартная параллель Винкеля ≈ 50.467°

/** Общий 2D-Ньютон обратки по (λ,φ) через численный якобиан forward (Айтов, Винкель-Трипель). */
function invertNewton2D(fwd, x, y, P, guess, { tol = 1e-10, maxit = 40, h = 1e-6 } = {}) {
  let lam = guess[0], phi = guess[1];
  for (let it = 0; it < maxit; it++) {
    const f = fwd(lam, phi, P);
    const ex = f[0] - x, ey = f[1] - y;
    if (Math.abs(ex) < tol && Math.abs(ey) < tol) return [lam, phi];
    const fl1 = fwd(lam + h, phi, P), fl0 = fwd(lam - h, phi, P);
    const fp1 = fwd(lam, phi + h, P), fp0 = fwd(lam, phi - h, P);
    const J11 = (fl1[0] - fl0[0]) / (2 * h), J12 = (fp1[0] - fp0[0]) / (2 * h);
    const J21 = (fl1[1] - fl0[1]) / (2 * h), J22 = (fp1[1] - fp0[1]) / (2 * h);
    const det = J11 * J22 - J12 * J21;
    if (Math.abs(det) < 1e-30) break;
    lam -= (J22 * ex - J12 * ey) / det;
    phi -= (-J21 * ex + J11 * ey) / det;
    phi = clamp(phi, -HALF_PI, HALF_PI);
  }
  return [lam, phi];
}

/* 1. Айтова — Aitoff (компромиссная) */
register('aitoff', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    const a = acos_c(Math.cos(phi) * Math.cos(dl / 2)), r = sincRatio(a);
    return [2 * P.R * Math.cos(phi) * Math.sin(dl / 2) * r, P.R * Math.sin(phi) * r];
  },
  inverse(x, y, P) {
    return invertNewton2D(PROJECTIONS['aitoff'].forward, x, y, P,
      [P.lon0 + x / (2 * P.R), clamp(y / P.R, -HALF_PI, HALF_PI)], { tol: 1e-9 });
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Азимутальная равнопромежуточная полусфера, растянутая вдвое по x. Несущая для Хаммера/Винкеля.',
});

/* 2. Хаммера — Hammer / Hammer–Aitoff (равновеликая) */
register('hammer', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, D = Math.sqrt(1 + Math.cos(phi) * Math.cos(dl / 2));
    return [2 * SQRT2 * P.R * Math.cos(phi) * Math.sin(dl / 2) / D, SQRT2 * P.R * Math.sin(phi) / D];
  },
  inverse(x, y, P) {                                   // замкнутая через вспомогательное z
    const X = x / P.R, Y = y / P.R;
    const z = Math.sqrt(1 - (X / 4) ** 2 - (Y / 2) ** 2);
    const phi = asin_c(z * Y);
    const lambda = P.lon0 + 2 * Math.atan2(z * X, 2 * (2 * z * z - 1));
    return [lambda, phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Равновеликая модификация Айтова (через азимутальную равновеликую Ламберта).',
});

/* 3. Винкеля-Трипель — Winkel tripel (компромиссная) */
register('winkel3', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    const a = acos_c(Math.cos(phi) * Math.cos(dl / 2)), r = sincRatio(a);
    return [0.5 * P.R * (dl * Math.cos(P.phi1) + 2 * Math.cos(phi) * Math.sin(dl / 2) * r),
            0.5 * P.R * (phi + Math.sin(phi) * r)];
  },
  inverse(x, y, P) {
    return invertNewton2D(PROJECTIONS['winkel3'].forward, x, y, P,
      [P.lon0 + 2 * x / (P.R * (1 + Math.cos(P.phi1))), clamp(2 * y / P.R, -HALF_PI, HALF_PI)],
      { tol: 1e-9 });
  },
  params: ['lon0', 'phi1'], defaults: { lon0: 0, phi1: WINKEL_PHI1 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Среднее равнопромежуточной цилиндрической и Айтова. φ1=arccos(2/π). Стандарт NatGeo с 1998.',
});

/* 4. Винкеля I — Winkel I (компромиссная) */
register('winkel1', {
  forward(lambda, phi, P) {
    return [0.5 * P.R * (lambda - P.lon0) * (Math.cos(phi) + Math.cos(P.phi1)), P.R * phi];
  },
  inverse(x, y, P) {
    const phi = y / P.R;
    return [P.lon0 + 2 * x / (P.R * (Math.cos(phi) + Math.cos(P.phi1))), phi];
  },
  params: ['lon0', 'phi1'], defaults: { lon0: 0, phi1: WINKEL_PHI1 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Среднее синусоидальной и равнопромежуточной цилиндрической; полностью обратим.',
});

/* 5. Ван дер Гринтена I — Van der Grinten I (компромиссная) */
register('vandergrinten', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, piR = PI * P.R;
    if (Math.abs(phi) < 1e-12) return [P.R * dl, 0];
    const th = asin_c(Math.abs(2 * phi / PI));
    if (Math.abs(dl) < 1e-12) return [0, sign(phi) * piR * Math.tan(th / 2)];
    if (Math.abs(Math.abs(phi) - HALF_PI) < 1e-12) return [0, sign(phi) * piR];
    const A = 0.5 * Math.abs(PI / dl - dl / PI);
    const G = Math.cos(th) / (Math.sin(th) + Math.cos(th) - 1);
    const Pp = G * (2 / Math.sin(th) - 1);
    const Q = A * A + G, P2 = Pp * Pp, A2 = A * A, den = P2 + A2;
    const xn = A * (G - P2) + Math.sqrt(Math.max(A2 * (G - P2) ** 2 - (P2 + A2) * (G * G - P2), 0));
    const yn = Pp * Q - A * Math.sqrt(Math.max((A2 + 1) * (P2 + A2) - Q * Q, 0));
    return [sign(dl) * piR * xn / den, sign(phi) * piR * yn / den];
  },
  inverse(x, y, P) {                                   // Rubincam 1981, неитеративно (кубика)
    const X = x / (PI * P.R), Y = y / (PI * P.R);
    if (Math.abs(Y) < 1e-12) return [P.lon0 + x / P.R, 0];
    const c1 = -Math.abs(Y) * (1 + X * X + Y * Y);
    const c2 = c1 - 2 * Y * Y + X * X;
    const c3 = -2 * c1 + 1 + 2 * Y * Y + (X * X + Y * Y) ** 2;
    const d = Y * Y / c3 + (1 / 27) * (2 * c2 ** 3 / c3 ** 3 - 9 * c1 * c2 / c3 ** 2);
    const a1 = (c1 - c2 * c2 / (3 * c3)) / c3;
    const m1 = 2 * Math.sqrt(-a1 / 3);
    const th1 = (1 / 3) * acos_c(3 * d / (a1 * m1));
    const phi = sign(y) * PI * (-m1 * Math.cos(th1 + PI / 3) - c2 / (3 * c3));
    const lambda = (Math.abs(X) < 1e-12) ? P.lon0
      : P.lon0 + PI * (X * X + Y * Y - 1 + Math.sqrt(1 + 2 * (X * X - Y * Y) + (X * X + Y * Y) ** 2)) / (2 * X);
    return [lambda, clamp(phi, -HALF_PI, HALF_PI)];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Весь мир в круге; меридианы/параллели — дуги окружностей. Обратная замкнута (Рубинкам). NatGeo 1922–1988.',
});

/* 6. Эккерта–Грейфендорфа — Eckert–Greifendorff (равновеликая, обобщённый Хаммер) */
register('eckert-greifendorff', {
  forward(lambda, phi, P) {
    const u = P.W * (lambda - P.lon0);
    const D = 2 / (1 + Math.cos(phi) * Math.cos(u));
    return [(P.R / P.W) * Math.sqrt(D) * Math.cos(phi) * Math.sin(u), P.R * Math.sqrt(D) * Math.sin(phi)];
  },
  inverse(x, y, P) {                                   // обратка азимутальной равновеликой → /W
    const Xl = P.W * x / P.R, Yl = y / P.R, rho = Math.hypot(Xl, Yl);
    if (rho < 1e-12) return [P.lon0, 0];
    const c = 2 * asin_c(rho / 2);
    const phi = asin_c(Yl * Math.sin(c) / rho);
    const u = Math.atan2(Xl * Math.sin(c), rho * Math.cos(c));
    return [P.lon0 + u / P.W, phi];
  },
  params: ['lon0', 'W'], defaults: { lon0: 0, W: 0.25 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Обобщённый Хаммер: W=½ → Хаммер, W=¼ → Эккерт–Грейфендорф.',
});

/* 7. Вагнера VII — Wagner VII / Hammer–Wagner (равновеликая) */
register('wagner7', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, S = 0.90631 * Math.sin(phi), C0 = Math.sqrt(1 - S * S);
    const C1 = Math.sqrt(2 / (1 + C0 * Math.cos(dl / 3)));
    return [2.66723 * P.R * C0 * C1 * Math.sin(dl / 3), 1.24104 * P.R * S * C1];
  },
  inverse(x, y, P) {
    const t1 = x / (2.66723 * P.R), t2 = y / (1.24104 * P.R), p = Math.hypot(t1, t2);
    if (p < 1e-12) return [P.lon0, 0];
    const c = 2 * asin_c(p / 2);
    const lambda = P.lon0 + 3 * Math.atan2(x * Math.tan(c), 2.66723 * P.R * p);
    const phi = asin_c(y * Math.sin(c) / (1.24104 * P.R * 0.90631 * p));
    return [lambda, phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Линзовидная равновеликая с полюсной линией (частный случай Вагнера обобщённой, I=0).',
});

/* 8. Бризмайстера — Briesemeister (равновеликая, косой Хаммер; центр 45°N) */
register('briesemeister', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lonc;                        // косой центр на φ=45° (зашит через √2), λ=lonc
    const sp = Math.sin(phi), cp = Math.cos(phi), cd = Math.cos(dl);
    const phip = asin_c((sp - cp * cd) / SQRT2);
    const lp = (Math.sin(dl) < 0 ? -1 : 1) * acos_c((sp + cp * cd) / (SQRT2 * Math.cos(phip)));
    const D = 2 / (1 + Math.cos(phip) * Math.cos(lp / 2));
    return [P.R * Math.sqrt(3.5 * D) * Math.cos(phip) * Math.sin(lp / 2),
            P.R * Math.sqrt(2 * D) * Math.sin(phip) / Math.sqrt(1.75)];
  },
  inverse: null,                                       // косая обратка в карточке не приведена
  params: ['lonc'], defaults: { lonc: 10 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Косой Хаммер, центр 45°N/10°E; x растянут, y сжат на √(1.75/2). Равновелика.',
});

/* 9. Ван дер Гринтена IV — Van der Grinten IV (компромиссная, поликонический) */
register('vandergrinten4', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    if (Math.abs(phi) < 1e-12) return [P.R * dl, 0];
    if (Math.abs(dl) < 1e-12 || Math.abs(Math.abs(phi) - HALF_PI) < 1e-12) return [0, P.R * phi];
    const B = Math.abs(2 * phi / PI);
    const C = (8 * B - B ** 4 - 2 * B * B - 5) / (2 * B ** 3 - 2 * B * B);
    const D = Math.sqrt(Math.max((2 * dl / PI + PI / (2 * dl)) ** 2 - 4, 0)) * sign(Math.abs(dl) - HALF_PI);
    const BC = (B + C) ** 2;
    const F = BC * (B * B + C * C * D * D - 1)
      + (1 - B * B) * (B * B * ((B + 3 * C) ** 2 + 4 * C * C) + 12 * B * C ** 3 + 4 * C ** 4);
    const x1 = (D * (BC + C * C - 1) + 2 * Math.sqrt(Math.max(F, 0))) / (4 * BC + D * D);
    return [sign(dl) * (PI * P.R / 2) * x1,
            sign(phi) * (PI * P.R / 2) * Math.sqrt(Math.max(1 + D * Math.abs(x1) - x1 * x1, 0))];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Поликонический ВдГ: мир в выпуклой фигуре. Замкнутый forward.',
});

/* 10. Броненосец (Райса) — Armadillo (компромиссная, псевдо-3D) */
const ARM = 20 * DEG;
register('armadillo', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    const x = P.R * (1 + Math.cos(phi)) * Math.sin(dl / 2);
    const y = P.R * ((1 + Math.sin(ARM) - Math.cos(ARM)) / 2 + Math.sin(phi) * Math.cos(ARM)
      - (1 + Math.cos(phi)) * Math.sin(ARM) * Math.cos(dl / 2));
    return [x, y];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Псевдо-3D «броненосец» (взгляд на наклонённый глобус, 20°). Антарктида обычно отбрасывается.',
});

/* 11. Ван дер Гринтена II — Van der Grinten II (компромиссная) */
register('vandergrinten2', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, piR = PI * P.R;
    if (Math.abs(phi) < 1e-12) return [P.R * dl, 0];
    const B = Math.abs(2 * phi / PI), C = Math.sqrt(1 - B * B);
    if (Math.abs(dl) < 1e-12) return [0, sign(phi) * piR * B / (1 + C)];
    if (Math.abs(Math.abs(phi) - HALF_PI) < 1e-12) return [0, sign(phi) * piR];
    const A = 0.5 * Math.abs(PI / dl - dl / PI);
    const x1 = (C * Math.sqrt(1 + A * A) - A * C * C) / (1 + A * A * B * B);
    return [sign(dl) * piR * x1, sign(phi) * piR * Math.sqrt(Math.max(1 - x1 * x1 - 2 * A * x1, 0))];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Параллели — прямые горизонтали, меридианы — дуги окружностей.',
});

/* 12. Ван дер Гринтена III — Van der Grinten III (компромиссная) */
register('vandergrinten3', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, piR = PI * P.R;
    if (Math.abs(phi) < 1e-12) return [P.R * dl, 0];
    const B = Math.abs(2 * phi / PI), C = Math.sqrt(1 - B * B), y1 = B / (1 + C);
    if (Math.abs(dl) < 1e-12) return [0, sign(phi) * piR * y1];
    const A = 0.5 * Math.abs(PI / dl - dl / PI);
    return [sign(dl) * piR * (Math.sqrt(Math.max(A * A + 1 - y1 * y1, 0)) - A), sign(phi) * piR * y1];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Параллели — прямые, меридианы — дуги; проще ВдГ I (нет вложенных радикалов в x).',
});

/* 13. Вагнера обобщённая — Generalized Wagner / Umbeziffern (4-параметрическая) */
const WAG_PHI1 = 60 * DEG;
function wagGenConsts(P) {
  const vI = P.infl / 100 + 1, vR = P.axis / 100;
  const m2 = acos_c(vI * Math.cos(WAG_PHI1)) / WAG_PHI1;
  const m1 = Math.sin(P.psi) / Math.sin(m2 * PI / 2);
  const n = P.curv / PI;
  const k = Math.sqrt(vR * Math.sin(P.psi / 2) / Math.sin(P.curv / 2));
  const g = Math.sqrt(n * m1 * m2);
  return { m1, m2, n, cx: k / g, cy: 1 / (k * g) };
}
register('wagner-generalized', {
  forward(lambda, phi, P) {
    const { m1, m2, n, cx, cy } = wagGenConsts(P);
    const dl = lambda - P.lon0, s = m1 * Math.sin(m2 * phi), c0 = Math.sqrt(1 - s * s);
    const c1 = Math.sqrt(2 / (1 + c0 * Math.cos(n * dl)));
    return [P.R * cx * c0 * c1 * Math.sin(n * dl), P.R * cy * s * c1];
  },
  inverse(x, y, P) {
    const { m1, m2, n, cx, cy } = wagGenConsts(P);
    const t1 = x / (P.R * cx), t2 = y / (P.R * cy), p = Math.hypot(t1, t2);
    if (p < 1e-12) return [P.lon0, 0];
    const c = 2 * asin_c(p / 2);
    const lambda = P.lon0 + (1 / n) * Math.atan2(x * Math.tan(c), P.R * cx * p);
    const phi = (1 / m2) * asin_c(y * Math.sin(c) / (P.R * cy * m1 * p));
    return [lambda, phi];
  },
  params: ['lon0', 'psi', 'curv', 'infl', 'axis'],
  defaults: { lon0: 0, psi: 65 * DEG, curv: 60 * DEG, infl: 20, axis: 200 }, // I=20 → Вагнер VIII
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Нотация Бёма (ψ,P,I,R). I=0 → Вагнер VII (равновел.), I=20 → Вагнер VIII (компромисс).',
});

/* 14. Боттомли — Bottomley (равновеликая, псевдоконическая) */
register('bottomley', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, spsi = Math.sin(P.psi);
    const rho = HALF_PI - phi, sr = (Math.abs(rho) < 1e-12 ? 1 : Math.sin(rho) / rho);
    const eta = dl * spsi * sr;
    return [P.R * rho * Math.sin(eta) / spsi, P.R * (HALF_PI - rho * Math.cos(eta))];
  },
  inverse(x, y, P) {
    const spsi = Math.sin(P.psi);
    const x1 = (x / P.R) * spsi, y1 = HALF_PI - y / P.R;
    const rho = Math.hypot(x1, y1), eta = Math.atan2(x1, y1);
    const lambda = P.lon0 + (Math.abs(rho) < 1e-12 ? 0 : rho / Math.sin(rho)) * eta / spsi;
    return [lambda, HALF_PI - rho];
  },
  params: ['lon0', 'psi'], defaults: { lon0: 0, psi: 30 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Якобиан = cosφ ⇒ строго равновелика. ψ=30° по умолч.; ψ=90° → Вернер (кордиформная).',
});

/* 15. Хилла («eucyclic») — Hill eucyclic (равновеликая) */
register('hill', {
  forward(lambda, phi, P) {
    const K = P.K, L = 1 + K, be = 1 / L, B = PI + 4, A = 2 * Math.sqrt(PI / B);
    const rho0 = 0.5 * A * (L + Math.sqrt(K * (2 + K)));
    const sphi = Math.sin(phi);
    const th = newton(
      (t) => t - K * K * be - L * Math.sin(t)
        + (1 + L * L - 2 * L * Math.cos(t)) * (be + Math.atan2(Math.sin(t), L - Math.cos(t)))
        - 0.5 * (1 - sphi) * B,
      (t) => 2 * L * Math.sin(t) * (be + Math.atan2(Math.sin(t), L - Math.cos(t))),
      HALF_PI * (1 - sphi), { tol: 1e-12, maxit: 60 });
    const b1 = be + Math.atan2(Math.sin(th), L - Math.cos(th));
    const C = 1 + L * L - 2 * L * Math.cos(th), rho = A * Math.sqrt(C);
    const om = (lambda - P.lon0) * b1 / PI;
    return [P.R * rho * Math.sin(om), P.R * (rho0 - rho * Math.cos(om))];
  },
  inverse(x, y, P) {
    const K = P.K, L = 1 + K, be = 1 / L, B = PI + 4, A = 2 * Math.sqrt(PI / B);
    const rho0 = 0.5 * A * (L + Math.sqrt(K * (2 + K)));
    const X = x / P.R, Y = y / P.R, rho = Math.hypot(X, Y - rho0);
    if (rho < 1e-12) return [P.lon0, HALF_PI];
    const th = acos_c((1 + L * L - rho * rho / (A * A)) / (2 * L));
    const b1 = be + Math.atan2(Math.sin(th), L - Math.cos(th));
    const C = 1 + L * L - 2 * L * Math.cos(th);
    const lambda = P.lon0 + (PI / b1) * asin_c(X / rho);
    const phi = asin_c(1 - 2 * (th - K * K * be - L * Math.sin(th) + C * b1) / B);
    return [lambda, phi];
  },
  params: ['lon0', 'K'], defaults: { lon0: 0, K: 1 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'lenticular',
  notes: 'Яйцевидный контур; K — заострение полюса. Прямое — Ньютон по θ, обратное замкнуто. Равновелика.',
});

/* ═════════════════════════════════════════════════════════════════════════
 * БАТЧ 4 — КОНИЧЕСКИЕ + ПСЕВДОКОНИЧЕСКИЕ (Класс IV)
 * Конический каркас: θ=n(λ−λ0), x=ρsinθ, y=ρ0−ρcosθ. Сфера, R = P.R.
 * ═══════════════════════════════════════════════════════════════════════ */

/* 1. Равнопромежуточная коническая — Equidistant / Simple conic (равнопромежуточная) */
register('equidist-conic', {
  forward(lambda, phi, P) {
    const n = (Math.abs(P.phi2 - P.phi1) < 1e-12)
      ? Math.sin(P.phi1)
      : (Math.cos(P.phi1) - Math.cos(P.phi2)) / (P.phi2 - P.phi1);
    const G = Math.cos(P.phi1) / n + P.phi1;
    const rho = P.R * (G - phi), rho0 = P.R * (G - P.phi0), th = n * (lambda - P.lon0);
    return [rho * Math.sin(th), rho0 - rho * Math.cos(th)];
  },
  inverse(x, y, P) {
    const n = (Math.abs(P.phi2 - P.phi1) < 1e-12)
      ? Math.sin(P.phi1)
      : (Math.cos(P.phi1) - Math.cos(P.phi2)) / (P.phi2 - P.phi1);
    const G = Math.cos(P.phi1) / n + P.phi1, rho0 = P.R * (G - P.phi0);
    const rho = sign(n) * Math.hypot(x, rho0 - y);
    return [P.lon0 + Math.atan2(x, rho0 - y) / n, G - rho / P.R];
  },
  params: ['lon0', 'phi0', 'phi1', 'phi2'],
  defaults: { lon0: 0, phi0: 0, phi1: 30 * DEG, phi2: 60 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conic',
  notes: 'Расстояния истинны вдоль меридианов. Одна параллель ⇒ n=sinφ1.',
});

/* 2. Ламберта равноугольная коническая — Lambert conformal conic (равноугольная) */
register('lambert-cc', {
  forward(lambda, phi, P) {
    const t = (p) => Math.tan(QUARTER_PI + p / 2);
    const n = (Math.abs(P.phi2 - P.phi1) < 1e-12)
      ? Math.sin(P.phi1)
      : Math.log(Math.cos(P.phi1) / Math.cos(P.phi2)) / Math.log(t(P.phi2) / t(P.phi1));
    const F = Math.cos(P.phi1) * Math.pow(t(P.phi1), n) / n;
    const rho = P.R * F / Math.pow(t(phi), n), rho0 = P.R * F / Math.pow(t(P.phi0), n);
    const th = n * (lambda - P.lon0);
    return [rho * Math.sin(th), rho0 - rho * Math.cos(th)];
  },
  inverse(x, y, P) {
    const t = (p) => Math.tan(QUARTER_PI + p / 2);
    const n = (Math.abs(P.phi2 - P.phi1) < 1e-12)
      ? Math.sin(P.phi1)
      : Math.log(Math.cos(P.phi1) / Math.cos(P.phi2)) / Math.log(t(P.phi2) / t(P.phi1));
    const F = Math.cos(P.phi1) * Math.pow(t(P.phi1), n) / n, rho0 = P.R * F / Math.pow(t(P.phi0), n);
    const rho = sign(n) * Math.hypot(x, rho0 - y);
    const phi = 2 * Math.atan(Math.pow(P.R * F / rho, 1 / n)) - HALF_PI;
    return [P.lon0 + Math.atan2(x, rho0 - y) / n, phi];
  },
  params: ['lon0', 'phi0', 'phi1', 'phi2'],
  defaults: { lon0: 0, phi0: 0, phi1: 30 * DEG, phi2: 60 * DEG },
  domain: { lamMax: PI, phiMax: 88 * DEG }, family: 'conic',
  notes: 'Рабочая лошадка авиакарт и SPCS. Конформна; прямые ≈ ортодромии в зоне.',
});

/* 3. Альберса равновеликая коническая — Albers equal-area conic (равновеликая) */
register('albers', {
  forward(lambda, phi, P) {
    const n = 0.5 * (Math.sin(P.phi1) + Math.sin(P.phi2));
    const C = Math.cos(P.phi1) ** 2 + 2 * n * Math.sin(P.phi1);
    const rho = (P.R / n) * Math.sqrt(C - 2 * n * Math.sin(phi));
    const rho0 = (P.R / n) * Math.sqrt(C - 2 * n * Math.sin(P.phi0));
    const th = n * (lambda - P.lon0);
    return [rho * Math.sin(th), rho0 - rho * Math.cos(th)];
  },
  inverse(x, y, P) {
    const n = 0.5 * (Math.sin(P.phi1) + Math.sin(P.phi2));
    const C = Math.cos(P.phi1) ** 2 + 2 * n * Math.sin(P.phi1);
    const rho0 = (P.R / n) * Math.sqrt(C - 2 * n * Math.sin(P.phi0));
    const rho = sign(n) * Math.hypot(x, rho0 - y);
    const phi = asin_c((C - (rho * n / P.R) ** 2) / (2 * n));
    return [P.lon0 + Math.atan2(x, rho0 - y) / n, phi];
  },
  params: ['lon0', 'phi0', 'phi1', 'phi2'],
  defaults: { lon0: 0, phi0: 0, phi1: 20 * DEG, phi2: 60 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conic',
  notes: 'Стандарт равновеликих карт США/средних широт.',
});

/* 4. Бонна — Bonne (равновеликая, псевдоконическая; E как угол — каноническая форма) */
register('bonne', {
  forward(lambda, phi, P) {
    const cot1 = 1 / Math.tan(P.phi1), rho = cot1 + P.phi1 - phi;  // R-единицы
    const E = (Math.abs(rho) < 1e-12) ? 0 : (lambda - P.lon0) * Math.cos(phi) / rho;
    return [P.R * rho * Math.sin(E), P.R * (cot1 - rho * Math.cos(E))];
  },
  inverse(x, y, P) {
    const cot1 = 1 / Math.tan(P.phi1), X = x / P.R, Y = y / P.R;
    const rho = sign(P.phi1) * Math.hypot(X, cot1 - Y);
    const phi = cot1 + P.phi1 - rho, cphi = Math.cos(phi);
    const lambda = P.lon0 + (Math.abs(cphi) < 1e-12 ? 0 : rho / cphi * Math.atan2(X, cot1 - Y));
    return [lambda, phi];
  },
  params: ['lon0', 'phi1'], defaults: { lon0: 0, phi1: 45 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudoconic',
  notes: 'Кардиоидная равновеликая; φ1 — стандартная параллель. φ1=90° ⇒ Вернер.',
});

/* 5. Вернера — Werner / cordiform (равновеликая; Бонн при φ1=π/2) */
register('werner', {
  forward(lambda, phi, P) {
    const rho = HALF_PI - phi;
    const E = (Math.abs(rho) < 1e-12) ? 0 : (lambda - P.lon0) * Math.cos(phi) / rho;
    return [P.R * rho * Math.sin(E), -P.R * rho * Math.cos(E)];
  },
  inverse(x, y, P) {
    const X = x / P.R, Y = y / P.R, rho = Math.hypot(X, Y);
    const phi = HALF_PI - rho, cphi = Math.cos(phi);
    const lambda = P.lon0 + (Math.abs(cphi) < 1e-12 ? 0 : rho / cphi * Math.atan2(X, -Y));
    return [lambda, phi];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudoconic',
  notes: 'Идеально сердцевидная равновеликая (Возрождение). Бонн с вершиной в полюсе.',
});

/* 6. Поликоническая (американская) — American polyconic (равнопром. по параллелям) */
register('polyconic', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    if (Math.abs(phi) < 1e-12) return [P.R * dl, -P.R * P.phi0];
    const E = dl * Math.sin(phi), cot = 1 / Math.tan(phi);
    return [P.R * cot * Math.sin(E), P.R * (phi - P.phi0 + cot * (1 - Math.cos(E)))];
  },
  inverse(x, y, P) {                                   // карточка: итеративно — 2D-Ньютон
    return invertNewton2D(PROJECTIONS['polyconic'].forward, x, y, P,
      [P.lon0 + x / P.R, clamp(P.phi0 + y / P.R, -HALF_PI, HALF_PI)], { tol: 1e-9 });
  },
  params: ['lon0', 'phi0'], defaults: { lon0: 0, phi0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'pseudoconic',
  notes: 'Параллели истинной длины, осевой меридиан истинного масштаба. Базис старых USGS.',
});

/* 7. Ламберта равновеликая коническая (1 параллель) — Lambert equal-area conic */
register('lambert-eac', {
  forward(lambda, phi, P) {
    const n = (1 + Math.sin(P.phi1)) / 2;
    const rho = P.R * Math.sqrt(2 * (1 - Math.sin(phi)) / n);
    const rho0 = P.R * Math.sqrt(2 * (1 - Math.sin(P.phi0)) / n);
    const th = n * (lambda - P.lon0);
    return [rho * Math.sin(th), rho0 - rho * Math.cos(th)];
  },
  inverse(x, y, P) {
    const n = (1 + Math.sin(P.phi1)) / 2;
    const rho0 = P.R * Math.sqrt(2 * (1 - Math.sin(P.phi0)) / n);
    const rho = sign(n) * Math.hypot(x, rho0 - y);
    const phi = asin_c(1 - rho * rho * n / (2 * P.R * P.R));
    return [P.lon0 + Math.atan2(x, rho0 - y) / n, phi];
  },
  params: ['lon0', 'phi0', 'phi1'],
  defaults: { lon0: 0, phi0: 0, phi1: 45 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conic',
  notes: 'Равновеликая коническая с одной стандартной параллелью; двухпараллельный аналог — Альберс.',
});

/* 8. Биполярная косая коническая конформная — Bipolar oblique conic conformal */
/* Именованная карта обеих Америк (Миллер–Бризмайстер, 1941). Константы фиксированы. */
const BIP = {
  n: 0.63056, F: 1.89725, rhoc: 1.20709, T: 1.27247,
  lamB: -(19 + 59 / 60 + 36 / 3600) * DEG,
  AzAB: 46.78203 * DEG, AzBA: 104.42834 * DEG, Azc: 45.81997 * DEG,
  ang104: 104 * DEG, s45: Math.sin(45 * DEG), c45: Math.cos(45 * DEG),
  s20: Math.sin(-20 * DEG), c20: Math.cos(-20 * DEG),
};
register('bipolar', {
  forward(lambda, phi, P) {
    const lam = lambda - P.lon0, sp = Math.sin(phi), cp = Math.cos(phi);
    const dB = BIP.lamB - lam;
    const zB = acos_c(BIP.s45 * sp + BIP.c45 * cp * Math.cos(dB));
    const AzB = Math.atan2(Math.sin(dB) * cp, BIP.c45 * sp - BIP.s45 * cp * Math.cos(dB));
    let xp, yp;
    if (AzB <= BIP.AzBA) {                             // конус B
      const tn = Math.pow(Math.tan(zB / 2), BIP.n);
      const rhoB = BIP.F * tn;
      const alpha = acos_c((tn + Math.pow(Math.tan((BIP.ang104 - zB) / 2), BIP.n)) / BIP.T);
      const g = BIP.n * (BIP.AzBA - AzB);
      const rhoBp = (Math.abs(g) < alpha) ? rhoB / Math.cos(alpha - g) : rhoB;
      xp = rhoBp * Math.sin(g);
      yp = rhoBp * Math.cos(g) - BIP.rhoc;
    } else {                                           // конус A
      const dA = lam + 110 * DEG;
      const zA = acos_c(BIP.s20 * sp + BIP.c20 * cp * Math.cos(dA));
      const AzA = Math.atan2(Math.sin(dA) * cp, BIP.c20 * sp - BIP.s20 * cp * Math.cos(dA));
      const tn = Math.pow(Math.tan(zA / 2), BIP.n);
      const rhoA = BIP.F * tn;
      const alpha = acos_c((tn + Math.pow(Math.tan((BIP.ang104 - zA) / 2), BIP.n)) / BIP.T);
      const g = BIP.n * (BIP.AzAB - AzA);
      const rhoAp = (Math.abs(g) < alpha) ? rhoA / Math.cos(alpha + g) : rhoA;
      xp = rhoAp * Math.sin(g);
      yp = -rhoAp * Math.cos(g) + BIP.rhoc;
    }
    const x = -xp * Math.cos(BIP.Azc) - yp * Math.sin(BIP.Azc);
    const y = -yp * Math.cos(BIP.Azc) + xp * Math.sin(BIP.Azc);
    return [P.R * x, P.R * y];
  },
  inverse: null,                                       // итеративная (PP 1395, ур. 17-28)
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conic',
  notes: 'Конформная карта обеих Америк: две косые конические со швом. Константы фиксированы.',
});

/* ═════════════════════════════════════════════════════════════════════════
 * БАТЧ 5 — АЗИМУТАЛЬНЫЕ + ПЕРСПЕКТИВНЫЕ (Класс V)
 * Косой каркас: cos c = sinφ1 sinφ + cosφ1 cosφ cos(λ−λ0);
 *   x = R k′ cosφ sin(λ−λ0),  y = R k′[cosφ1 sinφ − sinφ1 cosφ cos(λ−λ0)].
 * Сфера, R = P.R. Различие пяти базовых — только в k′(c) и c(ρ).
 * ═══════════════════════════════════════════════════════════════════════ */

/** Фабрика косой азимутальной по k′(cos c) и c(ρ). */
function azimuthal(kprime, cFromRho) {
  return {
    forward(lambda, phi, P) {
      const dl = lambda - P.lon0;
      const cosc = Math.sin(P.phi1) * Math.sin(phi) + Math.cos(P.phi1) * Math.cos(phi) * Math.cos(dl);
      const kp = kprime(cosc);
      if (!isFinite(kp) || kp < 0) return [NaN, NaN];
      return [P.R * kp * Math.cos(phi) * Math.sin(dl),
              P.R * kp * (Math.cos(P.phi1) * Math.sin(phi) - Math.sin(P.phi1) * Math.cos(phi) * Math.cos(dl))];
    },
    inverse(x, y, P) {
      const rho = Math.hypot(x, y);
      if (rho < 1e-12) return [P.lon0, P.phi1];
      const c = cFromRho(rho, P.R), sc = Math.sin(c), cc = Math.cos(c);
      const phi = asin_c(cc * Math.sin(P.phi1) + y * sc * Math.cos(P.phi1) / rho);
      const lambda = P.lon0 + Math.atan2(x * sc, rho * Math.cos(P.phi1) * cc - y * Math.sin(P.phi1) * sc);
      return [lambda, phi];
    },
  };
}
const AZ_PARAMS = { params: ['lon0', 'phi1'], defaults: { lon0: 0, phi1: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'azimuthal' };

/* 1. Общий каркас — General azimuthal (STATIC: шаблон, k′ не задан) */
register('azim-general', {
  static: true, ...AZ_PARAMS,
  notes: 'Каркас всех азимутальных; k′(c) задаёт конкретную проекцию (ortho/stereo/gnomonic/laea/aeqd). Не самостоятельная проекция.',
});

/* 2. Ортографическая — Orthographic (перспективная ∞, видна полусфера) */
register('orthographic', Object.assign(
  azimuthal((cosc) => (cosc >= 0 ? 1 : NaN), (rho, R) => asin_c(rho / R)),
  AZ_PARAMS, { notes: 'k′=1, c≤90°. «Вид из космоса»; ни равновелика, ни конформна.' }));

/* 3. Стереографическая — Stereographic (равноугольная) */
register('stereographic', Object.assign(
  azimuthal((cosc) => 2 / (1 + cosc), (rho, R) => 2 * Math.atan(rho / (2 * R))),
  AZ_PARAMS, { notes: 'Единственная конформная азимутальная; окружности→окружности.' }));

/* 4. Гномоническая — Gnomonic (перспективная; ортодромии→прямые) */
register('gnomonic', Object.assign(
  azimuthal((cosc) => (cosc > 0 ? 1 / cosc : NaN), (rho, R) => Math.atan(rho / R)),
  AZ_PARAMS, { notes: 'Всякий большой круг — прямая. Менее полусферы; огромное краевое искажение.' }));

/* 5. Ламберта азимутальная равновеликая — LAEA (равновеликая) */
register('laea', Object.assign(
  azimuthal((cosc) => Math.sqrt(2 / (1 + cosc)), (rho, R) => 2 * asin_c(rho / (2 * R))),
  AZ_PARAMS, { notes: 'Стандарт ЕС (ETRS89-LAEA); хороша для полушарий и материков.' }));

/* 6. Азимутальная равнопромежуточная — AEQD (равнопромежуточная) */
register('aeqd', Object.assign(
  azimuthal((cosc) => { const c = acos_c(cosc); return c < 1e-9 ? 1 : c / Math.sin(c); },
            (rho, R) => rho / R),
  AZ_PARAMS, { notes: 'Истинные расстояния и азимуты из центра ко всему миру (флаг ООН).' }));

/* 7. Эйри — Airy minimum-error azimuthal (северный полярный аспект) */
function airyRhoUnit(z, beta) {
  if (z < 1e-9) return 0;
  const tz = Math.tan(z / 2), cb2 = (Math.cos(beta / 2) / Math.sin(beta / 2)) ** 2;
  return 2 * ((1 / tz) * (-Math.log(Math.cos(z / 2))) + tz * cb2 * (-Math.log(Math.cos(beta / 2))));
}
register('airy', {
  forward(lambda, phi, P) {
    const z = HALF_PI - phi, rho = P.R * airyRhoUnit(z, P.beta), dl = lambda - P.lon0;
    return [rho * Math.sin(dl), -rho * Math.cos(dl)];
  },
  inverse(x, y, P) {
    const rt = Math.hypot(x, y) / P.R;
    if (rt < 1e-12) return [P.lon0, HALF_PI];
    let lo = 1e-9, hi = PI - 1e-6, z = 0.5 * (lo + hi);   // ρ(z) монотонна — бисекция
    for (let i = 0; i < 60; i++) { z = 0.5 * (lo + hi); if (airyRhoUnit(z, P.beta) < rt) lo = z; else hi = z; }
    return [P.lon0 + Math.atan2(x, -y), HALF_PI - z];
  },
  params: ['lon0', 'beta'], defaults: { lon0: 0, beta: HALF_PI },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'azimuthal',
  notes: 'Минимизирует средневзвешенное искажение масштаба в круге радиуса β. Северный полярный аспект.',
});

/* 8. Двухточечная равнопромежуточная — Two-point equidistant (равнопромежуточная) */
register('two-point-equidistant', {
  forward(lambda, phi, P) {
    const { phiA, lonA, phiB, lonB } = P;
    const z0 = acos_c(Math.sin(phiA) * Math.sin(phiB) + Math.cos(phiA) * Math.cos(phiB) * Math.cos(lonB - lonA));
    const zA = acos_c(Math.sin(phiA) * Math.sin(phi) + Math.cos(phiA) * Math.cos(phi) * Math.cos(lambda - lonA));
    const zB = acos_c(Math.sin(phiB) * Math.sin(phi) + Math.cos(phiB) * Math.cos(phi) * Math.cos(lambda - lonB));
    const x = P.R * (zA * zA - zB * zB) / (2 * z0);
    const rad = 4 * z0 * z0 * zB * zB - (z0 * z0 - zA * zA + zB * zB) ** 2;
    const s = sign(Math.cos(phiA) * Math.cos(phiB) * Math.sin(phi) * Math.sin(lonB - lonA)
      - Math.cos(phiA) * Math.sin(phiB) * Math.cos(phi) * Math.sin(lambda - lonA)
      + Math.sin(phiA) * Math.cos(phiB) * Math.cos(phi) * Math.sin(lambda - lonB)) || 1;
    return [x, s * P.R * Math.sqrt(Math.max(rad, 0)) / (2 * z0)];
  },
  inverse: null,
  params: ['phiA', 'lonA', 'phiB', 'lonB'],
  defaults: { phiA: 0, lonA: -45 * DEG, phiB: 0, lonB: 45 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'azimuthal',
  notes: 'Расстояния от двух заданных точек истинны одновременно (радиомаяки, эпицентры).',
});

/* 9. Двухточечная азимутальная — Two-point azimuthal (повёрнутая гномоническая) */
register('two-point-azimuthal', {
  forward(lambda, phi, P) {
    const { phiA, lonA, phiB, lonB } = P;
    const Az1 = Math.atan2(Math.cos(phiB) * Math.sin(lonB - lonA),
      Math.cos(phiA) * Math.sin(phiB) - Math.sin(phiA) * Math.cos(phiB) * Math.cos(lonB - lonA));
    const d = 0.5 * acos_c(Math.sin(phiA) * Math.sin(phiB) + Math.cos(phiA) * Math.cos(phiB) * Math.cos(lonB - lonA));
    const phi1 = asin_c(Math.sin(phiA) * Math.cos(d) + Math.cos(phiA) * Math.sin(d) * Math.cos(Az1));
    const lon0 = lonA + Math.atan2(Math.sin(d) * Math.sin(Az1), Math.cos(phiA) * Math.cos(d) - Math.sin(phiA) * Math.sin(d) * Math.cos(Az1));
    const Az2 = Math.atan2(-Math.cos(phiA) * Math.sin(lonA - lon0),
      Math.sin(phi1) * Math.cos(phiA) * Math.cos(lonA - lon0) - Math.cos(phi1) * Math.sin(phiA));
    const dl = lambda - lon0;
    const cosc = Math.sin(phi1) * Math.sin(phi) + Math.cos(phi1) * Math.cos(phi) * Math.cos(dl);
    if (cosc <= 0) return [NaN, NaN];
    const xf = Math.cos(phi) * Math.sin(dl) / cosc;
    const yf = (Math.cos(phi1) * Math.sin(phi) - Math.sin(phi1) * Math.cos(phi) * Math.cos(dl)) / cosc;
    return [P.R * Math.cos(d) * (xf * Math.sin(Az2) + yf * Math.cos(Az2)),
            P.R * (yf * Math.sin(Az2) - xf * Math.cos(Az2))];
  },
  inverse: null,
  params: ['phiA', 'lonA', 'phiB', 'lonB'],
  defaults: { phiA: 0, lonA: -45 * DEG, phiB: 0, lonB: 45 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'azimuthal',
  notes: 'Азимуты из двух заданных точек верны; большие круги — прямые (повёрнутая гномоника).',
});

/* 10. Миллера облатно-стереографическая — Miller oblated stereographic (компромиссная) */
register('miller-oblated', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    const cosc = Math.sin(P.phi1) * Math.sin(phi) + Math.cos(P.phi1) * Math.cos(phi) * Math.cos(dl);
    const kp = 2 / (1 + cosc);                          // косая стереографическая при R=k0=1
    const xt = kp * Math.cos(phi) * Math.sin(dl);
    const yt = kp * (Math.cos(P.phi1) * Math.sin(phi) - Math.sin(P.phi1) * Math.cos(phi) * Math.cos(dl));
    return [P.R * P.K * xt * (1 - (P.Q / 12) * (3 * yt * yt - xt * xt)),
            P.R * P.K * yt * (1 + (P.Q / 12) * (3 * xt * xt - yt * yt))];
  },
  inverse: null,
  params: ['lon0', 'phi1', 'K', 'Q'],
  defaults: { lon0: 18 * DEG, phi1: 18 * DEG, K: 0.9245, Q: 0.2522 }, // Европа–Африка
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'azimuthal',
  notes: 'Стереографическая + кубический член (= z+Q/12·z³); почти конформна в центре. Карта «Atlantis».',
});

/* 11. Общая вертикальная перспективная — General vertical perspective (компромиссная) */
register('vertical-perspective', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    const cosc = Math.sin(P.phi1) * Math.sin(phi) + Math.cos(P.phi1) * Math.cos(phi) * Math.cos(dl);
    if (cosc < 1 / P.P) return [NaN, NaN];              // точка за горизонтом
    const kp = (P.P - 1) / (P.P - cosc);
    return [P.R * kp * Math.cos(phi) * Math.sin(dl),
            P.R * kp * (Math.cos(P.phi1) * Math.sin(phi) - Math.sin(P.phi1) * Math.cos(phi) * Math.cos(dl))];
  },
  inverse(x, y, P) {
    const rho = Math.hypot(x, y), Pp = P.P, R = P.R;
    if (rho < 1e-12) return [P.lon0, P.phi1];
    const c = asin_c((Pp - Math.sqrt(1 - rho * rho * (Pp + 1) / (R * R * (Pp - 1))))
      / (R * (Pp - 1) / rho + rho / (R * (Pp - 1))));
    const sc = Math.sin(c), cc = Math.cos(c);
    const phi = asin_c(cc * Math.sin(P.phi1) + y * sc * Math.cos(P.phi1) / rho);
    const lambda = P.lon0 + Math.atan2(x * sc, rho * Math.cos(P.phi1) * cc - y * Math.sin(P.phi1) * sc);
    return [lambda, phi];
  },
  params: ['lon0', 'phi1', 'P'], defaults: { lon0: 0, phi1: 0, P: 2 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'azimuthal',
  notes: 'Вид из космоса с высоты H: P=H/R+1. P→∞ ортографическая, P=−1 стереографическая, P=0 гномоническая.',
});

/* 12. Наклонная перспективная — Tilted perspective (компромиссная) */
register('tilted-perspective', {
  forward(lambda, phi, P) {
    const vp = PROJECTIONS['vertical-perspective'].forward(lambda, phi, P);
    if (!isFinite(vp[0])) return [NaN, NaN];
    const x1 = vp[0], y1 = vp[1], g = P.gamma, w = P.omega;
    const u = y1 * Math.cos(g) + x1 * Math.sin(g);
    const A = u * Math.sin(w) / (P.R * (P.P - 1)) + Math.cos(w);
    return [(x1 * Math.cos(g) - y1 * Math.sin(g)) * Math.cos(w) / A, u / A];
  },
  inverse: null,
  params: ['lon0', 'phi1', 'P', 'gamma', 'omega'],
  defaults: { lon0: 0, phi1: 0, P: 2, gamma: 0, omega: 30 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'azimuthal',
  notes: 'Наклонённая «камера» с высоты: γ — азимут оси наклона, ω — угол наклона. Граница — конич. сечение.',
});

/* ═════════════════════════════════════════════════════════════════════════
 * БАТЧ 6 — КОНФОРМНЫЕ СПЕЦ. + МНОГОГРАННЫЕ (Класс VI, «тяжёлый хвост»)
 * Конформно-квадратное семейство (Пирс/Гийу/Адамс) — комплексный эллиптический
 * движок F(·,1/√2): ellipticFi / Якоби (см. выше). Сфера, R = P.R.
 * ═══════════════════════════════════════════════════════════════════════ */

/* ── ядро Гийу (полусфера-в-квадрат, единичный глобус) ── */
const GUYOU_k_ = (SQRT2 - 1) / (SQRT2 + 1);
const GUYOU_k = Math.sqrt(1 - GUYOU_k_ * GUYOU_k_);
const GUYOU_K = ellipticF(HALF_PI, GUYOU_k);
function guyouComplexAtan(x, y) {
  const x2 = x * x, y1 = y + 1, t = 1 - x2 - y * y;
  return [0.5 * ((x >= 0 ? HALF_PI : -HALF_PI) - Math.atan2(t, 2 * x)),
    -0.25 * Math.log(t * t + 4 * x2) + 0.5 * Math.log(y1 * y1 + x2)];
}
function guyouCore(lambda, phi) {
  const f = -1, psi = Math.log(Math.tan(QUARTER_PI + Math.abs(phi) / 2));
  const r = Math.exp(f * psi) / Math.sqrt(GUYOU_k_);
  const at = guyouComplexAtan(r * Math.cos(f * lambda), r * Math.sin(f * lambda));
  const t = ellipticFi(at[0], at[1], GUYOU_k * GUYOU_k);
  return [-t[1], (phi >= 0 ? 1 : -1) * (0.5 * GUYOU_K - t[0])];
}
function guyouCoreInvert(x, y) {
  const f = -1, j = ellipticJi(0.5 * GUYOU_K - y, -x, GUYOU_k * GUYOU_k);
  const den = j[1][0] * j[1][0] + j[1][1] * j[1][1];
  const tn = [(j[0][0] * j[1][0] + j[0][1] * j[1][1]) / den, (j[0][1] * j[1][0] - j[0][0] * j[1][1]) / den];
  return [Math.atan2(tn[1], tn[0]) / f,
    2 * Math.atan(Math.exp(0.5 / f * Math.log(GUYOU_k_ * tn[0] * tn[0] + GUYOU_k_ * tn[1] * tn[1]))) - HALF_PI];
}
/** d3-поворот сферы [δλ,δφ,δγ] (рад) перед проекцией. */
function rotateForward(dLam, dPhi, dGam) {
  const cdp = Math.cos(dPhi), sdp = Math.sin(dPhi), cdg = Math.cos(dGam), sdg = Math.sin(dGam);
  return (lambda, phi) => {
    let l = lambda + dLam; if (l > PI) l -= TAU; else if (l < -PI) l += TAU;
    const cp = Math.cos(phi), x = Math.cos(l) * cp, y = Math.sin(l) * cp, z = Math.sin(phi);
    const k = z * cdp + x * sdp;
    return [Math.atan2(y * cdg - k * sdg, x * cdp - z * sdp), asin_c(k * cdg + y * sdg)];
  };
}
/** Обёртка «мир в квадрат» (склейка двух полусфер). */
function squareWrap(core) {
  const dx = core(HALF_PI, 0)[0] - core(-HALF_PI, 0)[0];
  return (lambda, phi) => { const s = lambda > 0 ? -0.5 : 0.5; const p = core(lambda + s * PI, phi); return [p[0] - s * dx, p[1]]; };
}
/** Обёртка квинкунциального замощения (ромб). */
function quincuncialWrap(core) {
  const dx = core(HALF_PI, 0)[0] - core(-HALF_PI, 0)[0];
  return (lambda, phi) => {
    const t = Math.abs(lambda) < HALF_PI;
    const p = core(t ? lambda : (lambda > 0 ? lambda - PI : lambda + PI), phi);
    const x = (p[0] - p[1]) * SQRT1_2, y = (p[0] + p[1]) * SQRT1_2;
    if (t) return [x, y];
    const d = dx * SQRT1_2, s = ((x > 0) !== (y > 0)) ? -1 : 1;
    return [s * x - sign(y) * d, s * y - sign(x) * d];
  };
}
const peirceCore = quincuncialWrap(guyouCore);
const PEIRCE_ROT = rotateForward(-HALF_PI, -HALF_PI, QUARTER_PI);
const adamsCore = squareWrap(guyouCore);

/* 1. Гийу полусфера-в-квадрат — Guyou (равноугольная) */
register('guyou', {
  forward(lambda, phi, P) { const v = guyouCore(lambda - P.lon0, phi); return [P.R * v[0], P.R * v[1]]; },
  inverse(x, y, P) { const v = guyouCoreInvert(x / P.R, y / P.R); return [v[0] + P.lon0, v[1]]; },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: HALF_PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Полушарие конформно в квадрат; движок F(·,1/√2). Полюса в серединах сторон, экватор по диагоналям.',
});

/* 2. Пирса квинкунциальная — Peirce quincuncial (равноугольная) */
register('peirce', {
  forward(lambda, phi, P) { const rp = PEIRCE_ROT(lambda - P.lon0, phi); const v = peirceCore(rp[0], rp[1]); return [P.R * v[0], P.R * v[1]]; },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Конформна везде, кроме 4 точек экватора. Квадраты замощают плоскость без швов (тор).',
});

/* 3. Адамса: мир в квадрате — Adams world in a square (равноугольная) */
register('adams', {
  forward(lambda, phi, P) { const v = adamsCore(lambda - P.lon0, phi); return [P.R * v[0], P.R * v[1]]; },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Весь мир конформно в квадрат (склейка двух полусфер Гийу). Часть семейства квадрат→Пирс/Адамс.',
});

/* 4. Адамса: полушарие в квадрате — Adams hemisphere in a square (равноугольная) */
/* Оси наклонены на 45° относительно Гийу: применяем поворот выхода на 45°. */
register('adams-hemisphere', {
  forward(lambda, phi, P) {
    const v = guyouCore(lambda - P.lon0, phi);
    return [P.R * (v[0] - v[1]) * SQRT1_2, P.R * (v[0] + v[1]) * SQRT1_2];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: HALF_PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Полушарие конформно в квадрат, оси на 45° (та же машинерия Гийу/Пирса).',
});

/* 4b. Адамса: мир в эллипсе — Adams world in an ellipse (равноугольная)
   Снайдер (1987) ур. 240–254. θ=23.8958° даёт граничный эллипс, в котором
   экватор вдвое длиннее центрального меридиана. K′=K(k_c), F(·,k)=ellipticF. */
const ADAMS_ELL_TH = 23.8958 * DEG;
const ADAMS_ELL_KS = Math.sin(ADAMS_ELL_TH);          // k_s = sin θ
const ADAMS_ELL_KC = Math.cos(ADAMS_ELL_TH);          // k_c = cos θ
const ADAMS_ELL_KP = ellipticK(ADAMS_ELL_KC);         // K′ ≈ 2.34767
register('conformal-ellipse', {
  forward(lambda, phi, P) {
    const lam = lambda - P.lon0;
    const ks = ADAMS_ELL_KS, kc = ADAMS_ELL_KC, Kp = ADAMS_ELL_KP;
    const cphi = Math.cos(phi), cl = Math.cos(lam);
    const u1 = 2 * (1 - kc) * cphi;                    // (241)
    const v1 = (1 + kc) * (1 + cphi * cl);             // (242)
    const A = ks * ks * (1 - cphi * cl);               // (243)
    const B = u1 - v1, C = u1 + v1;                    // (244),(245)
    let disc = A * A - 4 * kc * B * C; if (disc < 0) disc = 0;
    const R1 = A - Math.sqrt(disc);                    // (246)
    let sL = C !== 0 ? R1 / (2 * C * kc) : 0;
    sL = Math.max(-1, Math.min(1, sL));
    const lamP = -Math.asin(sL);                       // (247) λ'
    let inner = B !== 0 ? 1 - Math.pow(R1 / (2 * B), 2) : 0; if (inner < 0) inner = 0;
    let sF = Math.sqrt(inner) / ks;
    sF = Math.max(-1, Math.min(1, sF));
    const phiP = Math.asin(sF);                        // (248) φ'
    const u2 = ellipticF(phiP, ks);                    // (249) модуль k_s
    const v2 = Kp - ellipticF(lamP, kc);               // (250) модуль k_c
    const u3 = Math.exp(Math.PI * u2 / (4 * Kp));      // (251)
    const v3 = Math.PI * v2 / (4 * Kp);                // (252)
    const x = 0.5 * (u3 + 1 / u3) * Math.sin(v3);      // (253)
    const y = 0.5 * (u3 - 1 / u3) * Math.cos(v3);      // (254)
    return [
      P.R * Math.sign(lam) * Math.abs(x),              // x по знаку λ
      P.R * Math.sign(phi) * Math.abs(y),              // y по знаку φ
    ];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Весь мир конформно в эллипс (Адамс, 1925); θ=23.8958° — экватор вдвое длиннее центрального меридиана. Самая «эллиптически-тяжёлая» формула Альбома.',
});

/* 5. Шпилхауса (океанская) — Spilhaus (косой аспект Адамса II) */
const SPILHAUS_ROT = rotateForward(66.94 * DEG, -(49.56 * DEG) + 0, 40.17 * DEG); // публикуемая ориентация
register('spilhaus', {
  forward(lambda, phi, P) {
    // косой поворот (центр Южный океан), затем Адамс «мир в квадрате»
    const lc = P.lon0c, pc = P.phi0c, g = P.gamma;
    const dl = lambda - lc;
    const sphip = Math.sin(pc) * Math.sin(phi) + Math.cos(pc) * Math.cos(phi) * Math.cos(dl);
    const phip = asin_c(sphip);
    const lamp = g + Math.atan2(Math.cos(phi) * Math.sin(dl), Math.cos(pc) * Math.sin(phi) - Math.sin(pc) * Math.cos(phi) * Math.cos(dl));
    const lw = ((lamp + PI) % TAU + TAU) % TAU - PI;   // нормировка в [−π,π]
    const v = adamsCore(lw, phip);
    return [P.R * v[0], P.R * v[1]];
  },
  inverse: null,
  params: ['lon0c', 'phi0c', 'gamma'],
  defaults: { lon0c: 66.94 * DEG, phi0c: -49.56 * DEG, gamma: 40.17 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Косой аспект «Адамс: мир в квадрате II»; ориентация выбрана так, что Мировой океан непрерывен.',
});

/* 6. Лагранжа — Lagrange (равноугольная, мир в круге) */
register('lagrange', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, W = P.W;
    if (Math.abs(Math.abs(phi) - HALF_PI) < 1e-12) return [0, sign(phi) * 2 * P.R];
    const V = Math.exp((gd_inv(phi) - gd_inv(P.phi1)) / W);  // = (A/A1), A=((1+sinφ)/(1−sinφ))^{1/2W}
    const C = 0.5 * (V + 1 / V) + Math.cos(dl / W);
    return [2 * P.R * Math.sin(dl / W) / C, P.R * (V - 1 / V) / C];
  },
  inverse: null,
  params: ['lon0', 'W', 'phi1'], defaults: { lon0: 0, W: 2, phi1: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Конформный мир в круге (1779). W=2,φ1=0 — весь мир; W=1,φ1=0 — экв. стереографическая.',
});

/* 7. Айзенлора — Eisenlohr (равноугольная, постоянный масштаб по границе) */
const EISEN = 3 + Math.sqrt(8);
register('eisenlohr', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, S1 = Math.sin(dl / 2), C1 = Math.cos(dl / 2);
    const T = Math.sin(phi / 2) / (Math.cos(phi / 2) + Math.sqrt(2 * Math.cos(phi)) * C1);
    const C = Math.sqrt(2 / (1 + T * T));
    const num = Math.cos(phi / 2) + Math.sqrt(Math.cos(phi) / 2) * (C1 + S1);
    const den = Math.cos(phi / 2) + Math.sqrt(Math.cos(phi) / 2) * (C1 - S1);
    const V = Math.sqrt(num / den);
    return [EISEN * P.R * (-2 * Math.log(V) + C * (V - 1 / V)),
            EISEN * P.R * (-2 * Math.atan(T) + C * T * (V + 1 / V))];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Постоянный масштаб вдоль всей границы — «оптимальная» конформная; особые точки только в полюсах.',
});

/* 8. Августа эпициклоидальная — August epicycloidal (равноугольная) */
register('august', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, tp = Math.tan(phi / 2);
    const C1 = Math.sqrt(1 - tp * tp), C = 1 + C1 * Math.cos(dl / 2);
    const x1 = C1 * Math.sin(dl / 2) / C, y1 = tp / C;
    return [(4 / 3) * P.R * x1 * (3 + x1 * x1 - 3 * y1 * y1),
            (4 / 3) * P.R * y1 * (3 + 3 * x1 * x1 - y1 * y1)];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Весь мир (кроме полюсов) в двукаспной эпициклоиде. Кубическое продолжение Лагранжа.',
});

/* 9. Адамса: конформный мир в эллипсе — Conformal world in an ellipse (STATIC) */
/* Цепочка карточки (R1/λ′/φ′ → u2,v2 → эллипс) не воспроизвела конформность при
 * проверке Тиссо (ω≈97°): вероятна неоднозначность транскрипции извлечения
 * промежуточных (λ′,φ′). Эталона в d3 нет — по принципу «JS = проверенный двойник
 * TeX» не регистрируем как исполняемую, пока не сверено с первоисточником (Адамс 1925). */
const CE_kc = Math.cos(23.8958 * DEG);
export const CE_Kp = ellipticK(CE_kc);             // = 2.34767 (валидирует движок)
/* 10. Модифицированно-стереографическая / GS50 — Modified-stereographic conformal */
const GS50 = [                              // [Aj, Bj], j=1..10 (сфера)
  [0.9842990, 0], [0.0211642, 0.0037608], [-0.1036018, -0.0575102], [-0.0329095, -0.0320119],
  [0.0499471, 0.1223335], [0.0260460, 0.0899805], [0.0007388, -0.1435792], [0.0075848, -0.1334108],
  [-0.0216473, 0.0776645], [-0.0225161, 0.0853673]];
register('modified-stereographic', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    const kp = 2 / (1 + Math.sin(P.phi1) * Math.sin(phi) + Math.cos(P.phi1) * Math.cos(phi) * Math.cos(dl));
    const zx = kp * Math.cos(phi) * Math.sin(dl);
    const zy = kp * (Math.cos(P.phi1) * Math.sin(phi) - Math.sin(P.phi1) * Math.cos(phi) * Math.cos(dl));
    let wx = 0, wy = 0, px = 1, py = 0;       // Σ (Aj+iBj) z^j, схема Хорнера по степеням
    for (const [A, B] of P.coeffs) {
      const npx = px * zx - py * zy, npy = px * zy + py * zx; px = npx; py = npy; // z^j
      wx += A * px - B * py; wy += A * py + B * px;
    }
    return [P.R * wx, P.R * wy];
  },
  inverse(x, y, P) {
    const tx = x / P.R, ty = y / P.R;
    let zx = tx, zy = ty;                      // старт z′=(x+iy)/R, Ньютон
    for (let it = 0; it < 30; it++) {
      let fx = 0, fy = 0, dfx = 0, dfy = 0, px = 1, py = 0;
      for (let j = 0; j < P.coeffs.length; j++) {
        const [A, B] = P.coeffs[j];
        if (j > 0) { const dpx = j * px, dpy = j * py; dfx += A * dpx - B * dpy; dfy += A * dpy + B * dpx; }
        else { dfx += A; dfy += B; }
        const npx = px * zx - py * zy, npy = px * zy + py * zx; px = npx; py = npy; // z^{j+1}
        fx += A * px - B * py; fy += A * py + B * px;
      }
      fx -= tx; fy -= ty;
      const den = dfx * dfx + dfy * dfy;
      const dzx = (fx * dfx + fy * dfy) / den, dzy = (fy * dfx - fx * dfy) / den;
      zx -= dzx; zy -= dzy;
      if (Math.hypot(dzx, dzy) < 1e-12) break;
    }
    const rho = Math.hypot(zx, zy);
    if (rho < 1e-12) return [P.lon0, P.phi1];
    const c = 2 * Math.atan(rho / 2), sc = Math.sin(c), cc = Math.cos(c);
    const phi = asin_c(cc * Math.sin(P.phi1) + zy * sc * Math.cos(P.phi1) / rho);
    const lambda = P.lon0 + Math.atan2(zx * sc, rho * Math.cos(P.phi1) * cc - zy * Math.sin(P.phi1) * sc);
    return [lambda, phi];
  },
  params: ['lon0', 'phi1', 'coeffs'],
  defaults: { lon0: -120 * DEG, phi1: 45 * DEG, coeffs: GS50 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Косая стереографическая × комплексный многочлен (Хорнер). GS50: все 50 штатов, масштаб 0.98–1.02.',
});

/* 11–14. Многогранные/спец. без единой замкнутой формулы (STATIC) */
/* Ли: мир в равностороннем треугольнике — Lee conformal world in a triangle.
   Lee (1976, «Conformal Projections Based on Dixon Elliptic Functions»), §33:
   z = tanh(¼ζ) — Лагранж в единичный круг (ζ = ψ + iλ), затем sm w = z, т.е.
   w = sm⁻¹ z. Это интеграл Шварца–Кристоффеля диск→треугольник
   ∫(1−t³)^{−2/3}dt = z·₂F₁(⅔,⅓;4/3;z³); коэффициенты генерируем рекуррентно
   (чем больше порядок, тем ближе к границе/острее вершины без заломов).
   Сев. полюс → вершина, юж. → середина противоположной стороны. */
const DIXON_SMINV = (() => {
  const N = 64, c = new Array(N); c[0] = 1;
  for (let k = 0; k < N - 1; k++)        // c_{k+1}=c_k·(k+⅔)(k+⅓)/((k+4/3)(k+1))
    c[k + 1] = c[k] * ((k + 2 / 3) * (k + 1 / 3)) / ((k + 4 / 3) * (k + 1));
  return c;
})();
function dixonSmInv(z) {                  // z=[re,im] → w=sm⁻¹ z=[re,im]
  const p = cpow(z, 3);
  let acc = [DIXON_SMINV[DIXON_SMINV.length - 1], 0]; // Горнер по p=z³
  for (let k = DIXON_SMINV.length - 2; k >= 0; k--)
    acc = cadd(cmul(acc, p), [DIXON_SMINV[k], 0]);
  return cmul(z, acc);
}
register('lee', {
  forward(lambda, phi, P) {
    const lam = lambda - P.lon0;
    const a = gd_inv(phi) / 4, b = lam / 4;      // ζ/4 = ψ/4 + iλ/4
    const c2b = Math.cos(2 * b), s2b = Math.sin(2 * b);
    const den = Math.cosh(2 * a) + c2b;          // tanh(a+ib)
    let z = [Math.sinh(2 * a) / den, s2b / den]; // = Лагранж в единичном круге
    // «острота вершин» s∈[0,1]: радиус обрезки у особых точек (вершины/антимеридиан).
    // s=1 — острый треугольник (cap≈0.985), s=0 — скруглённый/точный (cap≈0.82).
    const s = Math.max(0, Math.min(1, P.sharp == null ? 1 : P.sharp));
    const cap = 0.82 + s * (0.985 - 0.82);
    const r = cabs(z);
    if (r > cap) z = [z[0] * cap / r, z[1] * cap / r];
    const w = dixonSmInv(z);
    // поворот +90° (×i): сев. полюс (вершина на +Re) → наверх, как на рис. 10
    return [-P.R * w[1], P.R * w[0]];
  },
  inverse: null,
  params: ['lon0', 'sharp'], defaults: { lon0: 0, sharp: 1 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'conformal',
  notes: 'Весь мир конформно в равносторонний треугольник (Ли, через функции Диксона sm/cm). Сев. полюс в вершине, юж. — в середине противоположной стороны. «Острота вершин» регулирует обрезку у особых точек. Третий член семейства: квадрат→Пирс/Адамс, треугольник→Ли.',
});
register('dymaxion', {
  static: true, params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'polyhedral',
  notes: 'Гномоника по 20 граням икосаэдра + развёртка; единой замкнутой формулы нет (нужна таблица граней).',
});
register('authagraph', {
  static: true, params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'polyhedral',
  notes: 'Сфера→тетраэдр (выравнивание площадей)→прямоугольник. Проприетарный алгоритм Нарукавы.',
});
register('waterman', {
  static: true, params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'polyhedral',
  notes: 'Гномоника по граням усечённого октаэдра «W5», раскладка бабочкой; единой замкнутой формулы нет (нужна таблица граней).',
});

/* ═════════════════════════════════════════════════════════════════════════
 * БАТЧ 7 (ПОСЛЕДНИЙ) — ШАРОВЫЕ (Класс VII) + РЕТРОАЗИМУТАЛЬНЫЕ/ЗВЁЗДЧАТЫЕ (VIII)
 * Сфера, R = P.R. Оси глобулярных: X — экватор, Y — центр. меридиан.
 * ═══════════════════════════════════════════════════════════════════════ */

/* 1. Бэкона — Bacon globular (полушарие в круге; параллели — прямые) */
register('bacon', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, y = P.R * HALF_PI * Math.sin(phi);
    if (Math.abs(dl) < 1e-12) return [0, y];
    const F = 0.5 * (HALF_PI * HALF_PI / Math.abs(dl) + Math.abs(dl));
    const x = sign(dl) * P.R * (Math.abs(dl) - F + Math.sqrt(Math.max(F * F - (y / P.R) ** 2, 0)));
    return [x, y];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: HALF_PI, phiMax: HALF_PI }, family: 'globular',
  notes: 'Полушарие в круге: меридианы — дуги, параллели — прямые (y=R·(π/2)·sinφ). Одна из древнейших.',
});

/* 2. Апиана I — Apian globular I (как Бэкон, но параллели равноотстоящие) */
register('apian1', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, y = P.R * phi;
    if (Math.abs(dl) < 1e-12) return [0, y];
    const F = 0.5 * (HALF_PI * HALF_PI / Math.abs(dl) + Math.abs(dl));
    const x = sign(dl) * P.R * (Math.abs(dl) - F + Math.sqrt(Math.max(F * F - phi * phi, 0)));
    return [x, y];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: HALF_PI, phiMax: HALF_PI }, family: 'globular',
  notes: 'Как Бэкон, но параллели равноотстоящие (y=Rφ). Полушарие в круге.',
});

/* 3. Фурнье I — Fournier globular I (меридианы и параллели — дуги) */
register('fournier1', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, R = P.R, C = PI * PI / 4;
    if (Math.abs(dl) < 1e-12 || Math.abs(Math.abs(phi) - HALF_PI) < 1e-12) return [0, R * phi];
    if (Math.abs(phi) < 1e-12) return [R * dl, 0];
    if (Math.abs(Math.abs(dl) - HALF_PI) < 1e-12) return [R * dl * Math.cos(phi), R * HALF_PI * Math.sin(phi)];
    const Pp = Math.abs(PI * Math.sin(phi)), S = (C - phi * phi) / (Pp - 2 * Math.abs(phi));
    const A = dl * dl / C - 1;
    const y = sign(phi) * R * (Math.sqrt(Math.max(S * S - A * (C - Pp * S - dl * dl), 0)) - S) / A;
    const x = sign(dl) * R * Math.abs(dl) * Math.sqrt(Math.max(1 - y * y / (R * R * C), 0));
    return [x, y];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: HALF_PI, phiMax: HALF_PI }, family: 'globular',
  notes: 'Полушарие в круге; и меридианы, и параллели — дуги окружностей.',
});

/* 4. Николоси — Nicolosi globular (классическая, по аль-Бируни) */
register('nicolosi', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, R = P.R, sphi = Math.sin(phi), q = Math.cos(phi), s = sign(dl) || 1;
    if (Math.abs(dl) < 1e-12 || Math.abs(Math.abs(phi) - HALF_PI) < 1e-12) return [0, R * phi];
    if (Math.abs(phi) < 1e-12) return [R * dl, 0];
    if (Math.abs(Math.abs(dl) - HALF_PI) < 1e-12) return [R * dl * q, R * HALF_PI * sphi];
    const b = PI / (2 * dl) - 2 * dl / PI, c = 2 * phi / PI, d = (1 - c * c) / (sphi - c);
    const b2 = b * b, d2 = d * d, b2d2 = 1 + b2 / d2, d2b2 = 1 + d2 / b2;
    const M = (b * sphi / d - b / 2) / b2d2, N = (d2 * sphi / b2 + d / 2) / d2b2;
    const m = M * M + q * q / b2d2;
    const n = N * N - (d2 * sphi * sphi / b2 + d * sphi - 1) / d2b2;
    return [R * HALF_PI * (M + Math.sqrt(Math.max(m, 0)) * s),
            R * HALF_PI * (N + Math.sqrt(Math.max(n, 0)) * sign(-phi * b) * s)];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: HALF_PI, phiMax: HALF_PI }, family: 'globular',
  notes: 'Классическая глобулярная (1660, по аль-Бируни): полушарие в круге, меридианы и параллели — дуги.',
});

/* 5. Овал Ортелия — Ortelius oval (внутри ±90° — Апиан, снаружи — полуокружности) */
register('ortelius', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, R = P.R;
    if (Math.abs(dl) <= HALF_PI + 1e-12) return PROJECTIONS['apian1'].forward(lambda, phi, P);
    const y = R * phi;
    const x = sign(dl) * R * (Math.sqrt(Math.max(HALF_PI * HALF_PI - phi * phi, 0)) + Math.abs(dl) - HALF_PI);
    return [x, y];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'globular',
  notes: 'Овальная карта мира Ортелия (1570): внутри ±90° — Апиан I, снаружи меридианы — полуокружности.',
});

/* 6. Гилберта «два мира» — Gilbert two-world (весь мир в круге, орто. основа) */
register('gilbert', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, y = P.R * Math.tan(phi / 2);
    return [Math.sin(dl / 2) * Math.sqrt(Math.max(P.R * P.R - y * y, 0)), y];
  },
  inverse(x, y, P) {
    const root = Math.sqrt(Math.max(P.R * P.R - y * y, 0));
    return [P.lon0 + (root < 1e-12 ? 0 : 2 * asin_c(x / root)), 2 * Math.atan(y / P.R)];
  },
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'globular',
  notes: 'Gilbert (1974): весь мир в круге радиуса R. Орто-проекция переразмеченной сферы (λ/2, arcsin tan(φ/2)).',
});

/* 7. Крейга (ретроазимутальная, Мекка) — Craig retroazimuthal */
register('craig', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, R = P.R;
    if (Math.abs(dl) < 1e-10) return [0, R * (Math.sin(phi) - Math.cos(phi) * Math.tan(P.phi1))];
    return [R * dl, R * dl * (Math.sin(phi) * Math.cos(dl) - Math.cos(phi) * Math.tan(P.phi1)) / Math.sin(dl)];
  },
  inverse: null,
  params: ['lon0', 'phi1'], defaults: { lon0: 0, phi1: 21.4 * DEG }, // широта Мекки
  domain: { lamMax: HALF_PI, phiMax: HALF_PI }, family: 'retroazimuthal',
  notes: 'Верное направление на (φ1,λ0) из любой точки (кибла). Сильно растянута по краям.',
});

/* 8. Хаммера (ретроазимутальная) — Hammer retroazimuthal */
register('hammer-retro', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, R = P.R;
    const cosz = Math.sin(P.phi1) * Math.sin(phi) + Math.cos(P.phi1) * Math.cos(phi) * Math.cos(dl);
    const z = acos_c(cosz), K = z < 1e-9 ? 1 : z / Math.sin(z);
    return [R * K * Math.cos(P.phi1) * Math.sin(dl),
            -R * K * (Math.sin(P.phi1) * Math.cos(phi) - Math.cos(P.phi1) * Math.sin(phi) * Math.cos(dl))];
  },
  inverse: null,
  params: ['lon0', 'phi1'], defaults: { lon0: 0, phi1: 21.4 * DEG },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'retroazimuthal',
  notes: 'Верный азимут на (φ1,λ0) из любой точки. Карта обычно двулистная (накладывается сама на себя).',
});

/* 9. Литтрова — Littrow (единственная конформная ретроазимутальная) */
register('littrow', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0;
    return [P.R * Math.sin(dl) / Math.cos(phi), P.R * Math.tan(phi) * Math.cos(dl)];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: HALF_PI, phiMax: 80 * DEG }, family: 'retroazimuthal',
  notes: 'Единственная конформная ретроазимутальная; верны азимуты на точки центр. меридиана. Морская навигация.',
});

/* 10. Вихеля — Wiechel (псевдоазимутальная равновеликая, сев. полярный аспект) */
register('wiechel', {
  forward(lambda, phi, P) {
    const dl = lambda - P.lon0, R = P.R, cp = Math.cos(phi), sp = Math.sin(phi);
    return [R * (Math.sin(dl) * cp - Math.cos(dl) * (1 - sp)),
            -R * (Math.cos(dl) * cp + Math.sin(dl) * (1 - sp))];
  },
  inverse: null,
  params: ['lon0'], defaults: { lon0: 0 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'azimuthal',
  notes: 'Равновеликая «вертушка»: параллели — концентрические окружности, меридианы — спирали. Сев. полярный аспект.',
});

/* 11. Звезда Бергхауса — Berghaus star (север — круг AEQD, юг — лучи) */
register('berghaus', {
  forward(lambda, phi, P) {
    const dl = ((lambda - P.lon0 + PI) % TAU + TAU) % TAU - PI, R = P.R, lobes = P.lobes;
    const r = R * (HALF_PI - phi);                 // полярная AEQD: r = R·колатитуда (от сев. полюса)
    const theta = Math.atan2(-r * Math.cos(dl), r * Math.sin(dl)); // = atan2(y,x), карточный север
    if (phi >= 0) return [r * Math.cos(theta), r * Math.sin(theta)];
    // юг: складка в lobes остроконечных лучей (конструкция Альбома)
    const k = TAU / lobes;
    const theta0 = k * Math.round((theta - HALF_PI) / k) + HALF_PI;
    const dth = theta - theta0;
    const alpha = Math.atan2(Math.sin(dth), 2 - Math.cos(dth));
    const th = theta0 + asin_c(PI * R / r * Math.sin(alpha)) - alpha;
    return [r * Math.cos(th), r * Math.sin(th)];
  },
  inverse: null,
  params: ['lon0', 'lobes'], defaults: { lon0: 0, lobes: 5 },
  domain: { lamMax: PI, phiMax: HALF_PI }, family: 'star',
  notes: 'Север — полярная азимутальная равнопромежуточная (круг), юг — 5 остроконечных лучей. Логотип AAG.',
});
