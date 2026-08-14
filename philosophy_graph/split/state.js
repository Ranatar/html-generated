// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

let editMode = {
      active: false,
      type: null, // 'philosopher', 'concept', 'connection'
      data: null,
      isNew: false,
      pendingConceptSelection: [] // Для последовательного выбора двух концепций
    };

let selectedNodes = new Set();

let selectedEdges = new Set();

export { editMode, selectedEdges, selectedNodes };
