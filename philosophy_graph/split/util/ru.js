// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

function pluralRu(count, one, few, many) {
      const d = count % 10, dd = count % 100;
      if (dd >= 11 && dd <= 14) return count + ' ' + many;
      if (d === 1) return count + ' ' + one;
      if (d >= 2 && d <= 4) return count + ' ' + few;
      return count + ' ' + many;
    }

function conjugateVerb(count, singularForm) {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;
      
      if (count === 1 || (lastDigit === 1 && lastTwoDigits !== 11)) {
        return singularForm;
      }
      return singularForm + 'и';
    }

function declinePhilosopher(count, grammaticalCase) {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;
      
      const endings = {
        nominative: ['', 'а', 'ов'],
        genitive: ['а', 'ов', 'ов'],
        dative: ['у', 'ам', 'ам'],
        accusative: ['а', 'ов', 'ов'],
        instrumental: ['ом', 'ами', 'ами'],
        prepositional: ['е', 'ах', 'ах']
      };
      
      let formIndex;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        formIndex = 2;
      } else if (lastDigit === 1) {
        formIndex = 0;
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        formIndex = 1;
      } else {
        formIndex = 2;
      }
      
      return `${count} философ${endings[grammaticalCase][formIndex]}`;
    }

export { conjugateVerb, declinePhilosopher, pluralRu };
