/**
 * Herramienta de Filtro Temporal / Fechas
 * Integrada en el panel desplegable del botón [📅 Filtro de Fechas] de la barra superior
 */

let onFilterChangeCallback = null;
let currentFilter = {
  startDate: null,
  endDate: null,
  onlyMedia: false,
  preset: 'all'
};

export function initDateFilter({ onFilterChange } = {}) {
  onFilterChangeCallback = onFilterChange;
  renderDateFilterContent();
}

function renderDateFilterContent() {
  const container = document.getElementById('panel-date-filter-content');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-3.5 text-xs text-slate-100">
      <!-- Header info -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-800">
        <span class="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>Filtro de Puntos por Fecha</span>
        </span>
        <span id="filter-status-badge" class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
          Sin filtros
        </span>
      </div>

      <!-- Quick Presets -->
      <div>
        <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Accesos Rápidos:</label>
        <div class="grid grid-cols-2 gap-1.5 text-xs">
          <button data-preset="all" class="preset-btn px-2.5 py-1.5 rounded-lg bg-sky-500 text-white font-bold transition flex items-center justify-center space-x-1">
            <span>Mostrar Todos</span>
          </button>
          <button data-preset="2026" class="preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center space-x-1">
            <span>Año 2026</span>
          </button>
          <button data-preset="month" class="preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center space-x-1">
            <span>Mes Actual</span>
          </button>
          <button data-preset="media" class="preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center space-x-1">
            <span>📷/🎬 Con Multimedia</span>
          </button>
        </div>
      </div>

      <!-- Custom Date Range -->
      <div class="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
        <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Rango Personalizado:</label>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <span class="block text-[10px] text-slate-500 mb-0.5">Desde:</span>
            <input
              id="filter-start-date"
              type="date"
              class="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-sky-500 transition"
            />
          </div>
          <div>
            <span class="block text-[10px] text-slate-500 mb-0.5">Hasta:</span>
            <input
              id="filter-end-date"
              type="date"
              class="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-sky-500 transition"
            />
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-between pt-1">
        <span class="text-[10px] text-slate-400">Actualiza mapa y tabla en vivo</span>
        <button id="filter-reset-btn" class="px-3 py-1 rounded-lg text-xs bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 font-medium transition flex items-center space-x-1">
          <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>Limpiar Filtro</span>
        </button>
      </div>
    </div>
  `;

  // Events
  const startInput = container.querySelector('#filter-start-date');
  const endInput = container.querySelector('#filter-end-date');
  const resetBtn = container.querySelector('#filter-reset-btn');

  startInput.addEventListener('change', () => {
    currentFilter.startDate = startInput.value ? new Date(startInput.value) : null;
    currentFilter.preset = 'custom';
    updatePresetButtonsUI('custom');
    emitFilterChange();
  });

  endInput.addEventListener('change', () => {
    currentFilter.endDate = endInput.value ? new Date(endInput.value + 'T23:59:59') : null;
    currentFilter.preset = 'custom';
    updatePresetButtonsUI('custom');
    emitFilterChange();
  });

  resetBtn.addEventListener('click', () => {
    resetFilters();
  });

  container.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      applyPreset(preset);
    });
  });
}

function updatePresetButtonsUI(activePreset) {
  const container = document.getElementById('panel-date-filter-content');
  if (!container) return;

  container.querySelectorAll('.preset-btn').forEach(btn => {
    const p = btn.getAttribute('data-preset');
    if (p === activePreset) {
      btn.className = 'preset-btn px-2.5 py-1.5 rounded-lg bg-sky-500 text-white font-bold transition flex items-center justify-center space-x-1';
    } else {
      btn.className = 'preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center space-x-1';
    }
  });
}

function applyPreset(preset) {
  const startInput = document.getElementById('filter-start-date');
  const endInput = document.getElementById('filter-end-date');
  currentFilter.preset = preset;
  updatePresetButtonsUI(preset);

  if (preset === 'all') {
    currentFilter.startDate = null;
    currentFilter.endDate = null;
    currentFilter.onlyMedia = false;
    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
  } else if (preset === '2026') {
    currentFilter.startDate = new Date('2026-01-01T00:00:00');
    currentFilter.endDate = new Date('2026-12-31T23:59:59');
    currentFilter.onlyMedia = false;
    if (startInput) startInput.value = '2026-01-01';
    if (endInput) endInput.value = '2026-12-31';
  } else if (preset === 'month') {
    const now = new Date('2026-11-10T10:00:00');
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    currentFilter.startDate = firstDay;
    currentFilter.endDate = lastDay;
    currentFilter.onlyMedia = false;
    if (startInput) startInput.value = firstDay.toISOString().split('T')[0];
    if (endInput) endInput.value = lastDay.toISOString().split('T')[0];
  } else if (preset === 'media') {
    currentFilter.startDate = null;
    currentFilter.endDate = null;
    currentFilter.onlyMedia = true;
    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
  }

  emitFilterChange();
}

function resetFilters() {
  applyPreset('all');
}

function emitFilterChange() {
  updateStatusBadge();
  if (onFilterChangeCallback) {
    onFilterChangeCallback(currentFilter);
  }
}

function updateStatusBadge() {
  const badge = document.getElementById('filter-status-badge');
  const navBadge = document.getElementById('nav-date-badge');
  const hasActive = currentFilter.preset !== 'all' || currentFilter.onlyMedia || currentFilter.startDate || currentFilter.endDate;

  if (badge) {
    if (!hasActive) {
      badge.textContent = 'Sin filtros';
      badge.className = 'text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400';
    } else {
      badge.textContent = 'Activo';
      badge.className = 'text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold';
    }
  }

  if (navBadge) {
    if (hasActive) {
      navBadge.classList.remove('hidden');
    } else {
      navBadge.classList.add('hidden');
    }
  }
}

export function parseDateString(dateStr) {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split('/').map(Number);
    return new Date(y, m - 1, d);
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export function matchesCurrentFilter(feature) {
  const p = feature.properties || {};

  if (currentFilter.onlyMedia) {
    const hasPhoto = Boolean(p.FOTO || p.foto || p.FOTO_2 || p.foto_2);
    const hasVideo = Boolean(p.VIDEO || p.video);
    if (!hasPhoto && !hasVideo) return false;
  }

  if (!currentFilter.startDate && !currentFilter.endDate) {
    return true;
  }

  const rawDate = p.F_INICIO || p.f_inicio || p.fecha_envio || p.timestamp || p.F_TERMINO || p.f_termino;
  if (!rawDate) {
    return false;
  }

  const featDate = parseDateString(rawDate);
  if (!featDate) return false;

  if (currentFilter.startDate && featDate < currentFilter.startDate) {
    return false;
  }
  if (currentFilter.endDate && featDate > currentFilter.endDate) {
    return false;
  }

  return true;
}
