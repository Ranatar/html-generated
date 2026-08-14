// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { MET, S } from '../core/ns.js';
import { calculateBetweennessAsync } from '../metrics/network.js';
import { openStatsModal, switchStatsView, updateActiveNavItem } from './modal.js';

async function calculateMetricFromModal(metricKey) {
      try {
        // closeStatsModal(); // ЗАКОММЕНТИРОВАНО
        
        // Используем существующие функции расчёта
        await runSingleMetric(metricKey);
        
        // После расчёта - переключаемся на вкладку с этой метрикой
        setTimeout(() => {
          // Если окно было закрыто - открываем
          if (!S.isStatsModalOpen) {
            openStatsModal();
          }
          
          // Переключаемся на нужную метрику
          switchStatsView(metricKey);
          updateActiveNavItem(metricKey);
        }, 600);
        
      } catch (error) {
        console.error('❌ Ошибка при расчёте метрики:', error);
        alert('Произошла ошибка при расчёте метрики: ' + error.message);
        
        // Если окно было закрыто - открываем обратно
        if (!S.isStatsModalOpen) {
          openStatsModal();
        }
      }
    }

function showProgress(label, percent) {
      const progressDiv = document.getElementById('analysisProgress');
      const progressBar = document.getElementById('progressBar');
      const progressPercent = document.getElementById('progressPercent');
      const progressLabel = document.getElementById('progressLabel');
      
      progressDiv.style.display = 'block';
      progressBar.style.width = percent + '%';
      progressPercent.textContent = percent + '%';
      progressLabel.textContent = label;
    }

function hideProgress() {
      const progressDiv = document.getElementById('analysisProgress');
      progressDiv.style.display = 'none';
    }

async function runSingleMetric(metricName) {
      try {
        showProgress(`Расчёт ${metricName}...`, 0);
        
        switch(metricName) {
          case 'pagerank':
            await MET.calculatePageRank(20, 0.85, (current, total) => {
              const percent = Math.round((current / total) * 100);
              showProgress('Расчёт PageRank...', percent);
            });
            break;
            
          case 'betweenness':
            await calculateBetweennessAsync((current, total) => {
              const percent = Math.round((current / total) * 100);
              showProgress('Расчёт Betweenness...', percent);
            });
            break;
            
          case 'closeness':
            await MET.calculateClosenessCentrality((current, total) => {
              const percent = Math.round((current / total) * 100);
              showProgress('Расчёт Closeness...', percent);
            });
            break;
            
          case 'eigenvector':
            await MET.calculateEigenvectorCentrality(100, (current, total) => {
              const percent = Math.round((current / total) * 100);
              showProgress('Расчёт Eigenvector...', percent);
            });
            break;
          
          // ========== НОВЫЕ МЕТРИКИ ==========
          
          case 'weighted-clustering':
            showProgress('Расчёт Weighted Clustering...', 50);
            await new Promise(resolve => setTimeout(resolve, 100));
            MET.calculateWeightedClustering();
            showProgress('Расчёт Weighted Clustering...', 100);
            break;
          
          case 'local-cohesion':
            showProgress('Расчёт Local Cohesion...', 50);
            await new Promise(resolve => setTimeout(resolve, 100));
            MET.calculateLocalCohesion();
            showProgress('Расчёт Local Cohesion...', 100);
            break;
          
          case 'rich-club':
            showProgress('Расчёт Rich-Club...', 50);
            await new Promise(resolve => setTimeout(resolve, 100));
            MET.calculateRichClubCoefficient();
            showProgress('Расчёт Rich-Club...', 100);
            break;
            
          default:
            console.warn(`⚠️ Неизвестная метрика: ${metricName}`);
            break;
        }
        
        showProgress('Готово!', 100);
        setTimeout(() => {
          hideProgress();
          console.log(`✅ Метрика ${metricName} успешно рассчитана`);
        }, 500);
        
      } catch (error) {
        console.error('❌ Ошибка при расчёте метрики:', error);
        hideProgress();
        alert('Произошла ошибка при расчёте: ' + error.message);
      }
    }

export { calculateMetricFromModal, hideProgress, runSingleMetric, showProgress };
