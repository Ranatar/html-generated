// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { AUTH_ADMIN, authAccounts, authSession } from '../core/session.js';
import { ModalContext } from './context.js';
import { toggleModalMode } from './core.js';
import { refreshEditHints, refreshOpenModalToolbar, renderAuthControls } from './edit-rights.js';

let authModalKind = 'login';

function authModalEl() { return document.getElementById('authModal'); }

function openAuthModal(kind) {
      authModalKind = kind;
      const el = authModalEl();
      if (!el) return;
      const title = kind === 'register' ? '📝 Регистрация' : '🔑 Вход';
      const act   = kind === 'register' ? 'Зарегистрироваться' : 'Войти';
      el.innerHTML =
        '<h3>' + title + '</h3>'
      + '<div class="auth-field"><label for="authLogin">Логин</label>'
      + '<input type="text" id="authLogin" autocomplete="off"></div>'
      + '<div class="auth-field"><label for="authPassword">Пароль</label>'
      + '<input type="password" id="authPassword" autocomplete="off"></div>'
      + '<div class="auth-error" id="authError"></div>'
      + '<div class="auth-actions">'
      + '<button data-act-click="close-auth-modal">Отмена</button>'
      + '<button class="primary" data-act-click="submit-auth">' + act + '</button>'
      + '</div>';
      el.classList.add('show');
      const overlay = document.getElementById('modalOverlay');
      if (overlay) overlay.classList.add('show');
      const inp = document.getElementById('authLogin');
      if (inp) {
        inp.focus();
        // Enter в любом поле равносилен нажатию главной кнопки.
        el.querySelectorAll('input').forEach(f => f.addEventListener('keydown', e => {
          if (e.key === 'Enter') { e.preventDefault(); submitAuth(); }
        }));
      }
    }

function closeAuthModal() {
      const el = authModalEl();
      if (el) { el.classList.remove('show'); el.innerHTML = ''; }
      const overlay = document.getElementById('modalOverlay');
      const universal = document.getElementById('universalModal');
      const stats = document.getElementById('statsModal');
      const otherOpen = (universal && universal.classList.contains('show'))
                     || (stats && stats.classList.contains('show'));
      if (overlay && !otherOpen) overlay.classList.remove('show');
    }

function authError(text) {
      const el = document.getElementById('authError');
      if (el) el.textContent = text;
    }

function showAuthNotice(title, bodyHtml) {
      authModalKind = 'notice';
      const el = authModalEl();
      if (!el) return;
      el.innerHTML =
        '<h3>' + title + '</h3>'
      + '<div class="auth-notice">' + bodyHtml + '</div>'
      + '<div class="auth-actions" style="margin-top:16px;">'
      + '<button class="primary" data-act-click="close-auth-modal">Понятно</button>'
      + '</div>';
      el.classList.add('show');
      const overlay = document.getElementById('modalOverlay');
      if (overlay) overlay.classList.add('show');
    }

function authNoticeMember(login) {
      showAuthNotice('Здравствуйте, ' + login,
        'Теперь можно составлять и отправлять предложения по правке графа.'
      + '<p><em>Оговорка: сам ход отправки ещё не сделан — он появится '
      + 'вместе с серверной частью. Пока это только устройство прав.</em></p>');
    }

function authNoticeAdmin() {
      showAuthNotice('Правка открыта',
        'Теперь граф можно править. Порядок такой:'
      + '<ul>'
      + '<li>Shift + клик по концепции — правка концепции;</li>'
      + '<li>Shift + клик по двум концепциям подряд — правка связи между ними;</li>'
      + '<li>Shift + клик по связи — правка этой связи;</li>'
      + '<li>Shift + клик по пустому месту полотна — новая концепция;</li>'
      + '<li>Shift + клик по заголовку «Философы:» — новый философ;</li>'
      + '<li>Shift + клик по философу в легенде — правка философа;</li>'
      + '<li>кнопка «✏️ Редактировать» в окне философа, концепции и связи.</li>'
      + '</ul>');
    }

function submitAuth() {
      const login = (document.getElementById('authLogin') || {}).value || '';
      const pass  = (document.getElementById('authPassword') || {}).value || '';
      if (!login.trim() || !pass) { authError('Заполните логин и пароль'); return; }
      const l = login.trim();

      if (authModalKind === 'register') {
        // Логин admin занят: он сверяется отдельно и регистрации не требует.
        if (l === AUTH_ADMIN.login || authAccounts.has(l)) {
          authError('Такой логин уже зарегистрирован'); return;
        }
        authAccounts.set(l, pass);
        authSession.user = { login: l, role: 'member' };
        renderAuthControls();
        refreshEditHints();
        authNoticeMember(l);
        return;
      }

      // Вход. Требований к паролю нет — это решено сознательно; когда
      // появится сервер, требования станут его заботой.
      //
      // Сообщения РАЗДЕЛЬНЫЕ. На сервере так делать нельзя: раздельный
      // ответ выдаёт, какие логины существуют. Здесь список учётных
      // записей и так виден в коде страницы, скрывать нечего, а
      // раздельное сообщение вдвое понятнее.
      if (l === AUTH_ADMIN.login) {
        if (pass !== AUTH_ADMIN.password) { authError('Неверный пароль'); return; }
        authSession.user = { login: l, role: 'admin' };
        renderAuthControls();
        refreshEditHints();
        refreshOpenModalToolbar();
        authNoticeAdmin();
        return;
      }
      if (!authAccounts.has(l)) { authError('Такой логин не зарегистрирован'); return; }
      if (authAccounts.get(l) !== pass) { authError('Неверный пароль'); return; }
      authSession.user = { login: l, role: 'member' };
      renderAuthControls();
      refreshEditHints();
      authNoticeMember(l);
    }

function authLogout() {
      const modal = document.getElementById('universalModal');
      const open = modal && modal.classList.contains('show');
      const wasEdit = open && ModalContext.currentMode === 'edit';

      // Право уходит ПЕРВЫМ делом: что бы дальше ни случилось с открытой
      // формой, кнопка правки в перерисованном окне уже не появится.
      authSession.user = null;
      renderAuthControls();
      refreshEditHints();

      if (wasEdit) {
        // Через тот же ход, что и кнопка «👁️ Просмотр»: он спросит про
        // несохранённое. Если правщик откажется, окно останется в правке —
        // тогда снимаем с глаз только кнопку, не трогая набранного.
        toggleModalMode();
        if (ModalContext.currentMode === 'edit') {
          const btn = document.querySelector('.modal-toolbar-left .mode-switch-btn');
          if (btn) btn.remove();
        }
      } else if (open) {
        refreshOpenModalToolbar();
      }
    }

export { authError, authLogout, authModalEl, authModalKind, authNoticeAdmin, authNoticeMember, closeAuthModal, openAuthModal, showAuthNotice, submitAuth };
