// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

function generateId(prefix = 'item') {
      return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    }

export { debounce, generateId };
