// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

const AUTH_ADMIN = { login: 'admin', password: 'admin' };

const authAccounts = new Map();

let authSession = { user: null };

function canEdit() {
      return !!(authSession.user && authSession.user.role === 'admin');
    }

export { AUTH_ADMIN, authAccounts, authSession, canEdit };
