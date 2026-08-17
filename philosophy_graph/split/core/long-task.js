// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

const LoadingIndicator = {
      create(title, subtitle, color = '#3498db') {
        const indicator = document.createElement('div');
        const id = 'loadingIndicator_' + Date.now();
        indicator.id = id;
        indicator.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(52, 73, 94, 0.95);
          color: white;
          padding: 25px 35px;
          border-radius: 12px;
          z-index: 10000;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          min-width: 320px;
        `;
        indicator.innerHTML = `
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; text-align: center;">
            ${title}
          </div>
          <div style="font-size: 11px; opacity: 0.8; margin-bottom: 15px; text-align: center;">
            ${subtitle}
          </div>
          <div style="background: rgba(255,255,255,0.2); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
            <div class="progress-bar" style="background: ${color}; height: 100%; width: 0%; transition: width 0.3s ease-out;"></div>
          </div>
          <div class="progress-text" style="font-size: 12px; text-align: center; opacity: 0.9;">0%</div>
          <div style="text-align: center; margin-top: 12px;">
            <button class="cancel-btn" style="background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; padding: 5px 14px; font-size: 11px; cursor: pointer;">Прервать</button>
          </div>
        `;
        document.body.appendChild(indicator);
        // F2: прерывание расчёта
        const cancelBtn = indicator.querySelector('.cancel-btn');
        if (cancelBtn) cancelBtn.addEventListener('click', () => {
          if (typeof CHAIN_SEARCH !== 'undefined') CHAIN_SEARCH.cancel();
          cancelBtn.textContent = 'Прерывается…';
          cancelBtn.disabled = true;
        });
        
        return {
          id: id,
          updateProgress(percent) {
            const progressBar = indicator.querySelector('.progress-bar');
            const progressText = indicator.querySelector('.progress-text');
            if (progressBar) progressBar.style.width = percent + '%';
            if (progressText) progressText.textContent = Math.round(percent) + '%';
          },
          remove() {
            const elem = document.getElementById(id);
            if (elem) document.body.removeChild(elem);
          }
        };
      }
    };

function showTemporaryMessage(message, duration = 3000) {
      const msgBox = document.createElement('div');
      msgBox.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(52, 73, 94, 0.95);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10001;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        font-size: 13px;
        animation: slideDown 0.3s ease-out;
      `;
      msgBox.textContent = message;
      document.body.appendChild(msgBox);
      
      setTimeout(() => {
        msgBox.style.opacity = '0';
        msgBox.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => {
          if (msgBox.parentNode) {
            document.body.removeChild(msgBox);
          }
        }, 300);
      }, duration);
    }

const CHAIN_SEARCH = {
      // Бюджет зависит от режима: уникальному хватает восьми секунд
      // (33 системы исчерпываются за 5.3 с), «Связанным сетям» нужно
      // около двадцати пяти (194 узла при 57 философах).
      budgetUniqueMs: 8000,
      budgetChainsMs: 30000,
      timeBudgetMs: 8000,
      strategy: 'exact',
      deadline: 0,
      expanded: 0,
      aborted: false,
      cancelled: false,
      reset(uniqueMode) {
        this.timeBudgetMs = uniqueMode ? this.budgetUniqueMs : this.budgetChainsMs;
        this.strategy = uniqueMode ? 'exact' : 'fast';
        this.expanded = 0;
        this.aborted = false;
        this.cancelled = false;
        this.deadline = Date.now() + this.timeBudgetMs;
      },
      outOfTime() {
        // Date.now() дорог в горячем цикле — проверяем раз в 4096 раскрытий
        if ((++this.expanded & 4095) !== 0) return false;
        return Date.now() > this.deadline;
      },
      cancel() { this.cancelled = true; }
    };

export { CHAIN_SEARCH, LoadingIndicator, showTemporaryMessage };
