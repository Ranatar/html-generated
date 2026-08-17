// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { MET, S } from '../core/ns.js';
import { applyMetricMode } from './format.js';
import { philosopherProfile } from './philosopher.js';

S.generateRankingsCache = null;

function generateRankings() {
      // C1: рейтинги подчиняются тому же переключателю ÷/×, что и карточки
      // отдельных метрик. Кеш зависит от режима, иначе переключение
      // не доходит до уже посчитанного рейтинга.
      if (S.generateRankingsCache && S.generateRankingsMode === S.metricValueMode)
        return S.generateRankingsCache;
      S.generateRankingsMode = S.metricValueMode;


      const _m = (id, v) => applyMetricMode(id, v);
      const allConcepts = S._concepts.map(c => ({
      id: c.id,
      label: c.label,
      philosopher: c.philosopher,
      influence: _m(c.id, MET.influenceIndex(c.id).total),
      revolutionary: _m(c.id, MET.revolutionaryIndex(c.id).total),
      problematic: _m(c.id, MET.problemGenerationIndex(c.id).total),
      synthetic: _m(c.id, MET.syntheticIndex(c.id).total),
      foundational: _m(c.id, MET.foundationalIndex(c.id).total),
      critical: _m(c.id, MET.criticalPowerIndex(c.id).total)
      }));

      return {
      mostInfluential: [...allConcepts].sort((a, b) => b.influence - a.influence).slice(0, 20),
      mostRevolutionary: [...allConcepts].sort((a, b) => b.revolutionary - a.revolutionary).slice(0, 20),
      mostProblematic: [...allConcepts].sort((a, b) => b.problematic - a.problematic).slice(0, 20),
      mostSynthetic: [...allConcepts].sort((a, b) => b.synthetic - a.synthetic).slice(0, 20),
      mostFoundational: [...allConcepts].sort((a, b) => b.foundational - a.foundational).slice(0, 20),
      mostCritical: [...allConcepts].sort((a, b) => b.critical - a.critical).slice(0, 20)
      };
    }

function invalidateGenerateRankingsCache() {
      S.generateRankingsCache = null;
    }

let generatePhilosopherRankingsCache = null;

function generatePhilosopherRankings() {
      if (generatePhilosopherRankingsCache) return generatePhilosopherRankingsCache;
      
      // Получаем уникальный список философов
      const philosophers = Array.from(new Set(S._concepts.map(c => c.philosopher)));
      
      console.log(`📊 Вычисление рейтингов для ${philosophers.length} философов...`);
      
      // Вспомогательная функция для безопасного получения числового значения
      const getSafeValue = (value, defaultValue = 0) => {
        if (value === null || value === undefined || isNaN(value)) {
          return defaultValue;
        }
        return Number(value);
      };
      
      // Вычисляем метрики для каждого философа
      const philosopherStats = philosophers.map(philosopherId => {
        try {
          const profile = philosopherProfile(philosopherId);
          const systematic = MET.philosopherSystematicIndex(philosopherId);
          const reach = MET.philosopherHistoricalReachIndex(philosopherId);
          const interdisciplinary = MET.philosopherInterdisciplinaryIndex(philosopherId);
          
          // Безопасное извлечение значений с проверками
          const influence = getSafeValue(profile?.averages?.influence, 0);          
          const revolutionary = getSafeValue(profile?.averages?.revolutionary, 0);          
          const systematicValue = getSafeValue(systematic?.total, 0);          
          const historicalReachValue = getSafeValue(reach?.total, 0);          
          const interdisciplinaryValue = getSafeValue(interdisciplinary?.total, 0);
          
          // Логирование для отладки (можно убрать после проверки)
          if (influence === 0 && revolutionary === 0 && systematicValue === 0) {
            console.warn(`⚠️ Философ "${philosopherId}" имеет нулевые значения всех метрик`);
          }
          
          return {
            philosopher: philosopherId,
            name: philosopherId,
            influence: influence,
            revolutionary: revolutionary,
            systematic: systematicValue,
            historicalReach: historicalReachValue,
            interdisciplinary: interdisciplinaryValue
          };
        } catch (error) {
          console.error(`❌ Ошибка при вычислении метрик для философа "${philosopherId}":`, error);
          
          // Возвращаем объект с нулевыми значениями в случае ошибки
          return {
            philosopher: philosopherId,
            name: philosopherId,
            influence: 0,
            revolutionary: 0,
            systematic: 0,
            historicalReach: 0,
            interdisciplinary: 0
          };
        }
      });
      
      console.log(`✅ Метрики вычислены для ${philosopherStats.length} философов`);
      
      // Создаем рейтинги
      const result = {
        mostInfluential: [...philosopherStats]
          .sort((a, b) => b.influence - a.influence)
          .slice(0, 20),
        mostRevolutionary: [...philosopherStats]
          .sort((a, b) => b.revolutionary - a.revolutionary)
          .slice(0, 20),
        mostSystematic: [...philosopherStats]
          .sort((a, b) => b.systematic - a.systematic)
          .slice(0, 20),
        greatestHistoricalReach: [...philosopherStats]
          .sort((a, b) => b.historicalReach - a.historicalReach)
          .slice(0, 20),
        mostInterdisciplinary: [...philosopherStats]
          .sort((a, b) => b.interdisciplinary - a.interdisciplinary)
          .slice(0, 20)
      };
      
      // Логирование топ-3 для проверки
      console.log('🏆 Топ-3 самых влиятельных:', 
        result.mostInfluential.slice(0, 3).map(p => `${p.name} (${p.influence.toFixed(2)})`));
      
      generatePhilosopherRankingsCache = result;
      return result;
    }

function invalidateGeneratePhilosopherRankingsCache() {
      generatePhilosopherRankingsCache = null;
    }

export { generatePhilosopherRankings, generatePhilosopherRankingsCache, generateRankings, invalidateGeneratePhilosopherRankingsCache, invalidateGenerateRankingsCache };
