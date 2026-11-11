/**
 * Módulo de Autenticación Multiusuario y Gestión de Reportes Valkiria
 * Controla el acceso privilegiado para edición y eliminación de puntos en el visor web.
 *
 * Credenciales por defecto:
 * User: hpichat
 * Pass: scooby2026
 */

// Repositorio de usuarios autorizados (extensible para soporte multiusuario)
const AUTHORIZED_USERS = [
  {
    username: 'hpichat',
    passwordHash: 'scooby2026', // Hardcoded simple según requerimiento
    role: 'admin',
    displayName: 'H. Pichat',
    email: 'hpichat@idep.gob.pe'
  }
];

const AUTH_STORAGE_KEY = 'valkiria_auth_session';

export function getAuthenticatedUser() {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function isAuthenticated() {
  return getAuthenticatedUser() !== null;
}

export function logout() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  showAuthToast('Sesión de administración finalizada', 'info');
}

/**
 * Solicita autenticación solo si no existe sesión activa.
 * Si ya está autenticado, ejecuta el callback inmediatamente.
 */
export function requireAuth(onSuccess) {
  const currentUser = getAuthenticatedUser();
  if (currentUser) {
    if (onSuccess) onSuccess(currentUser);
    return;
  }

  showLoginModal(onSuccess);
}

function showLoginModal(onSuccess) {
  const existing = document.getElementById('tactical-auth-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'tactical-auth-modal';
  modal.className = 'fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in';
  modal.innerHTML = `
    <div class="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
      <!-- Header -->
      <div class="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </span>
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-white">Autenticación Táctica</h3>
            <p class="text-[10px] text-slate-400">Acceso a edición y eliminación de datos</p>
          </div>
        </div>
        <button id="auth-modal-close" class="text-slate-400 hover:text-white p-1 text-sm">✕</button>
      </div>

      <!-- Form -->
      <form id="auth-login-form" class="p-5 space-y-3.5 text-xs">
        <div id="auth-error-msg" class="hidden p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px]"></div>

        <div>
          <label class="block text-slate-400 font-semibold mb-1">Usuario:</label>
          <input id="auth-user" type="text" autocomplete="username" placeholder="Ingrese usuario" required
            class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition"/>
        </div>

        <div>
          <label class="block text-slate-400 font-semibold mb-1">Contraseña:</label>
          <input id="auth-pass" type="password" autocomplete="current-password" placeholder="••••••••" required
            class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition"/>
        </div>

        <div class="pt-2 flex items-center justify-end space-x-2">
          <button type="button" id="auth-btn-cancel" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition flex items-center space-x-1.5 shadow-md shadow-sky-950">
            <span>Iniciar Sesión</span>
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector('#auth-modal-close').addEventListener('click', close);
  modal.querySelector('#auth-btn-cancel').addEventListener('click', close);

  const form = modal.querySelector('#auth-login-form');
  const userInp = modal.querySelector('#auth-user');
  const passInp = modal.querySelector('#auth-pass');
  const errBox = modal.querySelector('#auth-error-msg');

  setTimeout(() => userInp.focus(), 100);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = userInp.value.trim();
    const p = passInp.value.trim();

    const matched = AUTHORIZED_USERS.find(
      acc => acc.username.toLowerCase() === u.toLowerCase() && acc.passwordHash === p
    );

    if (matched) {
      const sessionData = {
        username: matched.username,
        displayName: matched.displayName,
        role: matched.role,
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
      showAuthToast(`✓ Autenticado como ${matched.displayName}`, 'success');
      close();
      if (onSuccess) onSuccess(sessionData);
    } else {
      errBox.textContent = 'Usuario o contraseña incorrectos.';
      errBox.classList.remove('hidden');
      passInp.value = '';
      passInp.focus();
    }
  });
}

export function showAuthToast(msg, type = 'info') {
  const toast = document.createElement('div');
  const color = type === 'success' ? 'bg-emerald-600 border-emerald-500' : (type === 'danger' ? 'bg-rose-600 border-rose-500' : 'bg-slate-800 border-slate-700');
  toast.className = `fixed bottom-6 right-6 z-[120] ${color} text-white px-4 py-2.5 rounded-xl shadow-2xl border text-xs font-bold flex items-center space-x-2 transition-all duration-300`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
