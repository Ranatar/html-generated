// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from './ns.js';

const RELATION_HINTS = {
      'influence':        'X повлиял на Y: воздействие без прямого продолжения понятия',
      'develop':        'Y развивает X: понятие подхвачено под своим или почти своим именем',
      'critique':         'X критикует Y: разбор доводов, а не просто иная позиция',
      'oppose':         'X противостоит Y: противопоставление позиций без разбора',
      'dialogue':         'X обсуждает Y не в критическом ключе',
      'synthesize':       'X синтезирован в Y. Синтезом считается ПУЧОК: два и более источника у одной цели',
      'typological':      'X и Y сходны, сложившись независимо: прямого заимствования не было',
      'typological_opposition': 'X и Y противоположны, сложившись независимо: прямого заимствования не было',
      'consequence':      'Из X следует Y: источник — основание, цель — вывод',
      'presuppose':       'X предполагает Y: источник зависим, основание в цели',
      'condition':        'X есть условие Y',
      'emerge_from':      'X возникает из Y',
      'culminate':        'X достигает вершины в Y',
      'exemplify':        'X иллюстрирует Y: частное и общее',
      'apply':          'X применяет себя к себе: самоприменение метода. Между РАЗНЫМИ понятиями пользуйтесь instrument',
      'instrument':       'X служит орудием для Y',
      'limit':          'X ограничивает Y',
      'complement':       'X и Y дополняют друг друга: построены независимо и поддерживают друг друга',
      'correlative':      'X и Y определимы только друг через друга: соотносительная пара, обоснования тут нет ни в одну сторону',
      'mediate':        'X опосредует Y',
      'internal_contradiction': 'X и Y противоречат друг другу внутри одной системы'
    };

const LAYER_NAMES = {
      historical:  'исторический слой — связывает людей',
      logical:   'логический слой — связывает положения внутри системы',
      typological: 'типологический слой — связывает системы без линии передачи',
      both:    'оба слоя — и между философами, и внутри одной системы'
    };

function relationHint(typeId) {
      const t = DATA.relationTypesObj[typeId] || {};
      const parts = [];
      if (RELATION_HINTS[typeId]) parts.push(RELATION_HINTS[typeId]);
      if (LAYER_NAMES[t.layer]) parts.push(LAYER_NAMES[t.layer]);
      if (t.ground) parts.push('основание в ' + (t.ground === 'source' ? 'источнике' : 'цели'));
      if (t.symmetric) parts.push('симметричен: направления у отношения нет');
      const n = DATA.links.filter(l => l.type === typeId).length;
      if (n) parts.push('рёбер в базе: ' + n);
      return parts.join('\n');
    }

const WEIGHT_WORDS = { 1: 'слабая связь', 2: 'обычная связь', 3: 'сильная связь' };

const WEIGHT_OPTIONS = [
      [1, '1 — слабая связь'],
      [2, '2 — обычная связь'],
      [3, '3 — сильная связь']
    ];

const CONN_WEIGHT_WORDS = { 1: 'слабая', 2: 'обычная', 3: 'сильная' };

export { CONN_WEIGHT_WORDS, LAYER_NAMES, RELATION_HINTS, WEIGHT_OPTIONS, WEIGHT_WORDS, relationHint };
