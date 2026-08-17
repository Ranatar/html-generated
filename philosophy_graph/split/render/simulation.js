// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { showTemporaryMessage } from '../core/long-task.js';
import { ensureAnimLoop, needsContinuousAnimation } from './scene.js';
import { resetHighlight } from './selection.js';

const maxTicks = 300;

function resetSimulation() {
      DATA.nodes.forEach(n => {
        n.fx = null;
        n.fy = null;
      });
      resetHighlight();
      S.tickCount = 0;
      S.simulation.alpha(1).restart();
    }

function toggleSimulationFreeze() {
      if (simLockedByHand) {
        simLockedByHand = false;
        const улеглась = !S.simulation || S.tickCount >= maxTicks;
        unfreezeSimulation('рука');
        if (улеглась) showTemporaryMessage('Раскладка уже улеглась — двигаться нечему', 2000);
      } else {
        freezeSimulation('рука');
      }
      updateFreezeButton();
    }

function updateFreezeButton() {
      const b = document.getElementById('freezeBtn');
      if (!b) return;
      // Только значок: панель держится на значках, а слово живёт в
      // подсказке. Прежде кнопка переписывала себе подпись при нажатии, и
      // панель на глазах раздувалась.
      b.textContent = simLockedByHand ? '▶️' : '❄️';
      b.setAttribute('data-tip', simLockedByHand
        ? 'Раскладка остановлена вручную и не оттаивает при закрытии окон'
        : 'Остановить раскладку насовсем — окна её больше не запустят');
      b.classList.toggle('frozen-by-hand', !!simLockedByHand);
    }

function centerGraph() {
      const transform = d3.zoomIdentity
        .translate(window.innerWidth / 2, window.innerHeight / 2)
        .scale(1);
      S.gfxSvg.transition().duration(750).call(S.gfxZoom.transform, transform);
      S.simulation.force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));
      S.tickCount = 0;
      S.simulation.alpha(0.3).restart();
    }

let simLockedByHand = false;

function freezeSimulation(источник) {
      if (источник === 'рука') simLockedByHand = true;
      if (S.simulation) S.simulation.stop();
    }

function unfreezeSimulation(источник) {
      // Замок сильнее окон: пока он стоит, закрытие окна раскладку не будит.
      if (simLockedByHand && источник !== 'рука') return;
      // Окно закрылось — граф снова виден, возобновляем непрерывную
      // отрисовку. Сам цикл не проснётся: он завершился, и
      // animLoopRunning уже false.
      if (typeof ensureAnimLoop === 'function'
        && typeof needsContinuousAnimation === 'function'
        && needsContinuousAnimation()) {
        ensureAnimLoop();
      }
      if (S.simulation && S.tickCount < maxTicks) {
        // Возобновляем симуляцию с небольшой энергией
        S.simulation.alpha(0.3).restart();
        // console.log("Симуляция разморожена");
      }
    }

export { centerGraph, freezeSimulation, maxTicks, resetSimulation, simLockedByHand, toggleSimulationFreeze, unfreezeSimulation, updateFreezeButton };
