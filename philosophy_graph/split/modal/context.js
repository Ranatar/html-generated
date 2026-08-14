// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

const ModalContext = {
      currentEntity: null,    // 'philosopher' | 'concept' | 'connection'
      currentMode: 'view',    // 'view' | 'edit'
      currentData: null,    // строка (имя философа) либо объект
      editState: {}       // состояние форм: selectedSource и прочее
    };

const modalStack = [];

const MODAL_STACK_MAX = 20;

export { MODAL_STACK_MAX, ModalContext, modalStack };
