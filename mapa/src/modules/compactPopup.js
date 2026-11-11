/**
 * Ventana Emergente Táctica Compacta para ArcGIS Maps SDK
 * Diseño denso y optimizado con tipografía de alto contraste y tamaño aumentado (13px - 14px).
 * Los campos se presentan en el orden exacto del aplicativo móvil Valkiria.
 */

import { requireAuth, showAuthToast } from './authManager.js';
import { resolvePhotoUrl } from './assetResolver.js';
import { openLightbox } from './mediaDrawer.js';

const SYNC_API_URL = 'https://www.idep.gob.pe/seguimiento/api/sync.php';

export function createCompactPopupContent(featureData, { onPointUpdated, onPointDeleted, onClose } = {}) {
  const props = featureData.properties || {};
  const isValkiria = featureData.layerId === 'live_submissions' || Boolean(props.JEFE_TOB || props.jefe_tob);

  const container = document.createElement('div');
  container.className = 'valkiria-compact-popup font-sans text-slate-100 select-text';
  container.style.maxWidth = '360px';
  container.style.minWidth = '320px';
  container.style.fontSize = '13px';
  container.style.lineHeight = '1.45';

  if (isValkiria) {
    renderValkiriaContent(container, featureData, { onPointUpdated, onPointDeleted, onClose });
  } else {
    renderGenericContent(container, featureData, { onClose });
  }

  return container;
}

function renderValkiriaContent(container, featureData, { onPointUpdated, onPointDeleted, onClose }) {
  const p = featureData.properties || {};
  const reportId = p.CODIGO || p.codigo || p.id || 'VAL-CAMPO';

  const jefeTob     = p.JEFE_TOB || p.jefe_tob || '-';
  const telefono    = p.TELEFONO || p.telefono || '-';
  const lugarMision = p.LUGAR || p.lugar || p.lugar_mision || 'Punto de Misión';
  const personal    = p.PERSONAL || p.personal || p.persona || '-';
  const maquinaria  = p.MAQUINARIA || p.maquinaria || '-';
  const ocurrencias = p.OCURRENCIAS || p.ocurrencias || '-';
  const rawPhoto    = p.FOTO || p.foto || p.foto_path || p.foto_base64 || reportId;
  const photoUrl    = resolvePhotoUrl(rawPhoto);

  const dms         = p.DMS || p.dms || '-';
  const altitud     = p.ALTITUD !== undefined && p.ALTITUD !== null ? `${Math.round(p.ALTITUD)} m` : '-';
  const precision   = p.PRECISION_M !== undefined && p.PRECISION_M !== null ? `±${Number(p.PRECISION_M).toFixed(1)}m` : '-';
  const fecha       = p.FECHA || p.fecha || p.fecha_envio || '-';

  container.innerHTML = `
    <div class="space-y-3">
      <!-- Barra Superior: ID, Botones de Acción y Botón Cerrar -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-700">
        <div class="flex items-center space-x-2">
          <span class="px-2 py-0.5 rounded text-xs font-black bg-rose-600 text-white tracking-wider shadow-sm">
            VALKIRIA
          </span>
          <span class="font-mono text-sm font-bold text-sky-300 truncate max-w-[130px]" title="${escapeHtml(reportId)}">
            ${escapeHtml(reportId)}
          </span>
        </div>

        <div class="flex items-center space-x-1.5">
          <button type="button" id="popup-btn-edit" class="p-1 px-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-bold transition text-xs flex items-center space-x-1 shadow-sm" title="Editar punto (Requiere credenciales)">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            <span>Editar</span>
          </button>
          <button type="button" id="popup-btn-delete" class="p-1 px-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold transition text-xs flex items-center space-x-1 shadow-sm" title="Eliminar punto (Requiere credenciales)">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <span>Quitar</span>
          </button>
          <button type="button" id="popup-btn-close" class="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center transition border border-slate-600 ml-1" title="Cerrar ventana">
            ✕
          </button>
        </div>
      </div>

      <!-- CAMPOS EN EL ORDEN EXACTO DEL APLICATIVO MÓVIL (Alto contraste y mayor tamaño) -->
      <div class="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-700">
        <!-- 1. Jefe de TOB -->
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider shrink-0">1. Jefe TOB:</span>
          <span class="font-extrabold text-white text-sm text-right leading-tight max-w-[200px] truncate" title="${escapeHtml(jefeTob)}">
            ${escapeHtml(jefeTob)}
          </span>
        </div>

        <!-- 2. Teléfono -->
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider shrink-0">2. Teléfono:</span>
          <span class="font-mono font-bold text-emerald-300 text-sm text-right">${escapeHtml(telefono)}</span>
        </div>

        <!-- 3. Lugar de Misión -->
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider shrink-0">3. Lugar:</span>
          <span class="font-bold text-sky-300 text-sm text-right leading-tight max-w-[200px] truncate" title="${escapeHtml(lugarMision)}">
            ${escapeHtml(lugarMision)}
          </span>
        </div>

        <!-- 4. Personal -->
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider shrink-0">4. Personal:</span>
          <span class="font-semibold text-white text-sm text-right leading-tight max-w-[200px] truncate" title="${escapeHtml(personal)}">
            ${escapeHtml(personal)}
          </span>
        </div>

        <!-- 5. Maquinaria -->
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider shrink-0">5. Maquinaria:</span>
          <span class="font-bold text-amber-300 text-sm text-right leading-tight max-w-[200px] truncate" title="${escapeHtml(maquinaria)}">
            ${escapeHtml(maquinaria)}
          </span>
        </div>

        <!-- 6. Ocurrencias -->
        <div class="pt-1">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider block mb-1">6. Ocurrencias:</span>
          <div class="text-white text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-700/80 max-h-24 overflow-y-auto custom-scrollbar leading-relaxed select-text">
            ${escapeHtml(ocurrencias)}
          </div>
        </div>
      </div>

      <!-- 7. Evidencia Fotográfica -->
      ${photoUrl ? `
        <div class="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-600 bg-black h-36 flex items-center justify-center shadow-inner" id="popup-photo-card">
          <img src="${photoUrl}" alt="Evidencia de campo" class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            onerror="this.onerror=null; this.src='https://www.idep.gob.pe/seguimiento/api/foto.php?id=${encodeURIComponent(reportId)}';" />
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="px-2.5 py-1 rounded bg-black/80 text-white text-xs font-bold border border-slate-600 shadow">🔍 Ampliar Foto</span>
          </div>
        </div>
      ` : ''}

      <!-- Telemetría GPS -->
      <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-700 font-mono text-xs text-slate-200 space-y-1">
        <div class="flex justify-between">
          <span class="text-slate-400">DMS:</span>
          <span class="text-sky-300 font-semibold">${escapeHtml(dms)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Altitud / Precisión:</span>
          <span class="text-emerald-300 font-semibold">${escapeHtml(altitud)} | ${escapeHtml(precision)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Fecha:</span>
          <span class="text-slate-300">${escapeHtml(fecha)}</span>
        </div>
      </div>
    </div>
  `;

  // Evento Cerrar
  const btnClose = container.querySelector('#popup-btn-close');
  if (btnClose && onClose) {
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      onClose();
    });
  }

  // Evento Ampliar Foto
  const photoCard = container.querySelector('#popup-photo-card');
  if (photoCard && photoUrl) {
    photoCard.addEventListener('click', () => {
      openLightbox(photoUrl, `Reporte ${reportId} - ${lugarMision}`);
    });
  }

  // Evento Editar
  const btnEdit = container.querySelector('#popup-btn-edit');
  if (btnEdit) {
    btnEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      requireAuth(() => {
        openEditPointModal(featureData, onPointUpdated);
      });
    });
  }

  // Evento Eliminar
  const btnDelete = container.querySelector('#popup-btn-delete');
  if (btnDelete) {
    btnDelete.addEventListener('click', (e) => {
      e.stopPropagation();
      requireAuth(() => {
        confirmDeletePoint(reportId, featureData, onPointDeleted);
      });
    });
  }
}

function renderGenericContent(container, featureData, { onClose } = {}) {
  const p = featureData.properties || {};
  const cat = featureData.category || 'ELEMENTO';
  const title = p.NOMBRE || p.nombre || p.LUGAR || p.Name || p.adm1_name || p.adm2_name || 'Geometría';

  let rowsHtml = '';
  const ignoredKeys = ['OBJECTID', 'FID', 'Shape__Area', 'Shape__Length', 'CODIGO', 'NOMBRE', 'LUGAR', 'category', 'layerId'];

  Object.keys(p).forEach(k => {
    if (ignoredKeys.includes(k)) return;
    const val = p[k];
    if (val !== null && val !== undefined && String(val).trim() !== '') {
      rowsHtml += `
        <div class="flex justify-between py-1 border-b border-slate-800 last:border-0 gap-2">
          <span class="text-slate-300 text-xs font-semibold truncate max-w-[130px]">${escapeHtml(k)}:</span>
          <span class="text-white text-xs font-bold text-right truncate max-w-[190px]">${escapeHtml(String(val))}</span>
        </div>
      `;
    }
  });

  container.innerHTML = `
    <div class="space-y-3">
      <div class="flex items-center justify-between pb-2 border-b border-slate-700">
        <span class="px-2 py-0.5 rounded text-xs font-extrabold bg-sky-600 text-white shadow-sm">
          ${escapeHtml(cat)}
        </span>
        <h4 class="font-bold text-white text-sm truncate max-w-[200px]" title="${escapeHtml(title)}">
          ${escapeHtml(title)}
        </h4>
        <button type="button" id="popup-btn-close-gen" class="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center transition border border-slate-600 ml-1" title="Cerrar ventana">
          ✕
        </button>
      </div>

      <div class="bg-slate-950 p-3 rounded-xl border border-slate-700 max-h-56 overflow-y-auto custom-scrollbar space-y-1">
        ${rowsHtml || '<span class="text-slate-400 text-xs">Sin atributos adicionales.</span>'}
      </div>
    </div>
  `;

  const btnClose = container.querySelector('#popup-btn-close-gen');
  if (btnClose && onClose) {
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      onClose();
    });
  }
}

// ==========================================
// MODAL DE EDICIÓN DE PUNTO VALKIRIA
// ==========================================
function openEditPointModal(featureData, onPointUpdated) {
  const existing = document.getElementById('tactical-edit-modal');
  if (existing) existing.remove();

  const p = featureData.properties || {};
  const reportId = p.CODIGO || p.codigo || p.id;

  const modal = document.createElement('div');
  modal.id = 'tactical-edit-modal';
  modal.className = 'fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in';
  modal.innerHTML = `
    <div class="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
      <!-- Header -->
      <div class="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <span class="p-2 rounded-lg bg-sky-500/20 text-sky-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </span>
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-white">Editar Reporte ${escapeHtml(reportId)}</h3>
            <p class="text-xs text-slate-400">Modificación de datos operativos en producción</p>
          </div>
        </div>
        <button id="edit-modal-close" class="text-slate-400 hover:text-white p-1 text-base font-bold">✕</button>
      </div>

      <!-- Form Body (6 Campos Operativos con tipografía de alto contraste) -->
      <form id="edit-point-form" class="p-5 space-y-3.5 text-xs overflow-y-auto max-h-[70vh]">
        <div class="grid grid-cols-2 gap-3.5">
          <div>
            <label class="block text-slate-200 font-bold mb-1">1. Jefe de TOB:</label>
            <input id="edit-jefe" type="text" value="${escapeHtml(p.JEFE_TOB || p.jefe_tob || '')}" required
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-semibold text-sm focus:border-sky-400 focus:outline-none"/>
          </div>
          <div>
            <label class="block text-slate-200 font-bold mb-1">2. Teléfono:</label>
            <input id="edit-tel" type="text" value="${escapeHtml(p.TELEFONO || p.telefono || '')}" required
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono text-sm focus:border-sky-400 focus:outline-none"/>
          </div>
        </div>

        <div>
          <label class="block text-slate-200 font-bold mb-1">3. Lugar de Misión:</label>
          <input id="edit-lugar" type="text" value="${escapeHtml(p.LUGAR || p.lugar || '')}" required
            class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-semibold text-sm focus:border-sky-400 focus:outline-none"/>
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          <div>
            <label class="block text-slate-200 font-bold mb-1">4. Personal:</label>
            <input id="edit-pers" type="text" value="${escapeHtml(p.PERSONAL || p.personal || '')}" required
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-semibold text-sm focus:border-sky-400 focus:outline-none"/>
          </div>
          <div>
            <label class="block text-slate-200 font-bold mb-1">5. Maquinaria:</label>
            <input id="edit-maq" type="text" value="${escapeHtml(p.MAQUINARIA || p.maquinaria || '')}" required
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-semibold text-sm focus:border-sky-400 focus:outline-none"/>
          </div>
        </div>

        <div>
          <label class="block text-slate-200 font-bold mb-1">6. Ocurrencias:</label>
          <textarea id="edit-ocurr" rows="3" required
            class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:border-sky-400 focus:outline-none leading-relaxed">${escapeHtml(p.OCURRENCIAS || p.ocurrencias || '')}</textarea>
        </div>

        <!-- Botones de Acción -->
        <div class="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button type="button" id="edit-btn-cancel" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition">
            Cancelar
          </button>
          <button type="submit" id="edit-btn-submit" class="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-md shadow-sky-950">
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector('#edit-modal-close').addEventListener('click', close);
  modal.querySelector('#edit-btn-cancel').addEventListener('click', close);

  const form = modal.querySelector('#edit-point-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = modal.querySelector('#edit-btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    const updatedProps = {
      action: 'update',
      id: reportId,
      jefe_tob: modal.querySelector('#edit-jefe').value.trim(),
      telefono: modal.querySelector('#edit-tel').value.trim(),
      lugar_mision: modal.querySelector('#edit-lugar').value.trim(),
      personal: modal.querySelector('#edit-pers').value.trim(),
      maquinaria: modal.querySelector('#edit-maq').value.trim(),
      ocurrencias: modal.querySelector('#edit-ocurr').value.trim()
    };

    try {
      const res = await fetch(SYNC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProps)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      showAuthToast(`✓ Reporte ${reportId} actualizado en producción`, 'success');
      close();

      if (onPointUpdated) {
        onPointUpdated(reportId, updatedProps);
      }
    } catch (err) {
      console.error('Error al actualizar:', err);
      showAuthToast(`Error al guardar: ${err.message}`, 'danger');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Guardar Cambios';
    }
  });
}

// ==========================================
// ELIMINACIÓN DE PUNTO CON CONFIRMACIÓN
// ==========================================
function confirmDeletePoint(reportId, featureData, onPointDeleted) {
  const existing = document.getElementById('tactical-delete-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'tactical-delete-modal';
  modal.className = 'fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in';
  modal.innerHTML = `
    <div class="bg-slate-900 border border-rose-500/50 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
      <div class="p-5 text-center space-y-3">
        <div class="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/40">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-base font-bold text-white">¿Eliminar punto de misión?</h3>
        <p class="text-xs text-slate-300">
          Esta acción eliminará de forma irreversible el reporte <strong class="text-rose-400 font-mono">${escapeHtml(reportId)}</strong> de la base de datos de producción y del mapa.
        </p>
      </div>

      <div class="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-end space-x-3">
        <button type="button" id="delete-btn-cancel" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition">
          Cancelar
        </button>
        <button type="button" id="delete-btn-confirm" class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center space-x-1 shadow-md shadow-rose-950">
          <span>Sí, Eliminar</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector('#delete-btn-cancel').addEventListener('click', close);

  const confirmBtn = modal.querySelector('#delete-btn-confirm');
  confirmBtn.addEventListener('click', async () => {
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Eliminando...';

    try {
      const res = await fetch(SYNC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id: reportId
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      showAuthToast(`✓ Reporte ${reportId} eliminado del servidor`, 'success');
      close();

      if (onPointDeleted) {
        onPointDeleted(reportId);
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
      showAuthToast(`Error al eliminar: ${err.message}`, 'danger');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Sí, Eliminar';
    }
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
