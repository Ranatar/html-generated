// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

function getContrastColor(hexColor) {
      const hex = String(hexColor || '').trim().replace('#', '');
      const full = hex.length === 3
        ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
        : hex;
      if (!/^[0-9a-fA-F]{6}$/.test(full)) return '#ffffff';

      const chan = i => {
        const c = parseInt(full.substr(i, 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      // относительная яркость заливки
      const L = 0.2126 * chan(0) + 0.7152 * chan(2) + 0.0722 * chan(4);

      // контраст к чёрному есть (L+0.05)/0.05, к белому — 1.05/(L+0.05);
      // они равны при L = sqrt(1.05*0.05) - 0.05 ≈ 0.1791
      return L > 0.1791 ? '#000000' : '#ffffff';
    }

export { getContrastColor };
