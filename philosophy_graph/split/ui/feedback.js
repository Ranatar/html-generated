// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

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

export { showTemporaryMessage };
