/**
 * Ventana Emergente Táctica Compacta para ArcGIS Maps SDK
 * Diseño denso y optimizado (~320px) que se ancla directamente a las geometrías clicadas.
 * Los campos se presentan en el orden exacto del aplicativo móvil Valkiria.
 */

import { requireAuth, showAuthToast } from './authManager.js';
import { resolvePhotoUrl } from './assetResolver.js';
import { openLightbox } from './mediaDrawer.js';

const SYNC_API_URL = 'https://www.idep.gob.pe/seguimiento/api/sync.php';

export function createCompactPopupContent(featureData, { onPointUpdated, onPointDeleted } = {}) {
  const props = featureData.properties || {};
  const isValkiria = featureData.layerId === 'live_submissions' || Boolean(props.JEFE_TOB || props.jefe_tob);

  const container = document.createElement('div');
  container.className = 'valkiria-compact-popup font-sans text-slate-200 select-text';
  container.style.maxWidth = '320px';
  container.style.fontSize = '11px';
  container.style.lineHeight = '1.4';

  if (isValkiria) {
    renderValkiriaContent(container, featureData, { onPointUpdated, onPointDeleted });
  } else {
    renderGenericContent(container, featureData);
  }

  return container;
}

function renderValkiriaContent(container, featureData, { onPointUpdated, onPointDeleted }) {
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
    <div class="space-y-2.5">
      <!-- Barra Superior: ID y Botones de Acción -->
      <div class="flex items-center justify-between pb-1.5 border-b border-slate-700/80">
        <div class="flex items-center space-x-1.5">
          <span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            VALKIRIA
          </span>
          <span class="font-mono text-[11px] font-bold text-sky-400 truncate max-w-[130px]" title="${escapeHtml(reportId)}">
            ${escapeHtml(reportId)}
          </span>
        </div>

        <div class="flex items-center space-x-1">
          <button type="button" id="popup-btn-edit" class="p-1 px-1.5 rounded bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 transition text-[10px] flex items-center space-x-1 border border-slate-700" title="Editar punto (Requiere contraseña)">
            <svg class="w-3 h-3 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            <span>Editar</span>
          </button>
          <button type="button" id="popup-btn-delete" class="p-1 px-1.5 rounded bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 transition text-[10px] flex items-center space-x-1 border border-slate-700" title="Eliminar punto (Requiere contraseña)">
            <svg class="w-3 h-3 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <span>Quitar</span>
          </button>
        </div>
      </div>

      <!-- CAMPOS EN EL ORDEN EXACTO DEL APLICATIVO MÓVIL -->
      <div class="space-y-1.5 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
        <!-- 1. Jefe de TOB -->
        <div class="flex items-start justify-between">
          <span class="text-slate-400 text-[10px] uppercase font-semibold">1. Jefe TOB:</span>
          <span class="font-bold text-white text-right max-w-[180px] truncate">${escapeHtml(jefeTob)}</span>
        </div>

        <!-- 2. Teléfono -->
        <div class="flex items-start justify-between">
          <span class="text-slate-400 text-[10px] uppercase font-semibold">2. Teléfono:</span>
          <span class="font-mono text-emerald-400 text-right">${escapeHtml(telefono)}</span>
        </div>

        <!-- 3. Lugar de Misión -->
        <div class="flex items-start justify-between">
          <span class="text-slate-400 text-[10px] uppercase font-semibold">3. Lugar:</span>
          <span class="font-semibold text-sky-300 text-right max-w-[180px] truncate">${escapeHtml(lugarMision)}</span>
        </div>

        <!-- 4. Personal -->
        <div class="flex items-start justify-between">
          <span class="text-slate-400 text-[10px] uppercase font-semibold">4. Personal:</span>
          <span class="text-slate-200 text-right max-w-[180px] truncate">${escapeHtml(personal)}</span>
        </div>

        <!-- 5. Maquinaria -->
        <div class="flex items-start justify-between">
          <span class="text-slate-400 text-[10px] uppercase font-semibold">5. Maquinaria:</span>
          <span class="text-amber-300 text-right max-w-[180px] truncate">${escapeHtml(maquinaria)}</span>
        </div>

        <!-- 6. Ocurrencias -->
        <div class="pt-1 border-t border-slate-850">
          <span class="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">6. Ocurrencias:</span>
          <p class="text-slate-200 text-[10px] bg-slate-900/90 p-1.5 rounded-lg border border-slate-800 max-h-16 overflow-y-auto custom-scrollbar italic leading-tight">
            ${escapeHtml(ocurrencias)}
          </p>
        </div>
      </div>

      <!-- 7. Evidencia Fotográfica -->
      ${photoUrl ? `
        <div class="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-700 bg-black/60 h-28 flex items-center justify-center" id="popup-photo-card">
          <img src="${photoUrl}" alt="Evidencia de campo" class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            onerror="this.onerror=null; this.src='https://www.idep.gob.pe/seguimiento/api/foto.php?id=${encodeURIComponent(reportId)}';" />
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1">
            <span class="px-2 py-1 rounded bg-black/70 text-white text-[10px] font-bold">🔍 Ampliar Foto</span>
          </div>
        </div>
      ` : ''}

      <!-- Telemetría GPS -->
      <div class="bg-slate-950/90 p-2 rounded-lg border border-slate-800 font-mono text-[9px] text-slate-400 space-y-0.5">
        <div class="flex justify-between">
          <span>DMS:</span>
          <span class="text-slate-300">${escapeHtml(dms)}</span>
        </div>
        <div class="flex justify-between">
          <span>Altitud / Precisión:</span>
          <span class="text-slate-300">${escapeHtml(altitud)} | ${escapeHtml(precision)}</span>
        </div>
        <div class="flex justify-between">
          <span>Fecha:</span>
          <span class="text-slate-400">${escapeHtml(fecha)}</span>
        </div>
      </div>
    </div>
  `;

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

function renderGenericContent(container, featureData) {
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
        <div class="flex justify-between py-0.5 border-b border-slate-800/60 last:border-0">
          <span class="text-slate-400 text-[10px] truncate max-w-[110px]">${escapeHtml(k)}:</span>
          <span class="text-slate-200 text-right truncate max-w-[170px] font-medium">${escapeHtml(String(val))}</span>
        </div>
      `;
    }
  });

  container.innerHTML = `
    <div class="space-y-2">
      <div class="flex items-center justify-between pb-1 border-b border-slate-700">
        <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
          ${escapeHtml(cat)}
        </span>
        <h4 class="font-bold text-white text-xs truncate max-w-[200px]" title="${escapeHtml(title)}">
          ${escapeHtml(title)}
        </h4>
      </div>

      <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800 max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
        ${rowsHtml || '<span class="text-slate-500 text-[10px]">Sin atributos adicionales.</span>'}
      </div>
    </div>
  `;
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
    <div class="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
      <!-- Header -->
      <div class="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </span>
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-white">Editar Reporte ${escapeHtml(reportId)}</h3>
            <p class="text-[10px] text-slate-400">Modificación de datos operativos en producción</p>
          </div>
        </div>
        <button id="edit-modal-close" class="text-slate-400 hover:text-white p-1 text-sm">✕</button>
      </div>

      <!-- Form Body (6 Campos Operativos) -->
      <form id="edit-point-form" class="p-5 space-y-3 text-xs overflow-y-auto max-h-[70vh]">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 font-semibold mb-1">1. Jefe de TOB:</label>
            <input id="edit-jefe" type="text" value="${escapeHtml(p.JEFE_TOB || p.jefe_tob || '')}" required
              class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-sky-500 focus:outline-none"/>
          </div>
          <div>
            <label class="block text-slate-400 font-semibold mb-1">2. Teléfono:</label>
            <input id="edit-tel" type="text" value="${escapeHtml(p.TELEFONO || p.telefono || '')}" required
              class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-sky-500 focus:outline-none"/>
          </div>
        </div>

        <div>
          <label class="block text-slate-400 font-semibold mb-1">3. Lugar de Misión:</label>
          <input id="edit-lugar" type="text" value="${escapeHtml(p.LUGAR || p.lugar || '')}" required
            class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-sky-500 focus:outline-none"/>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 font-semibold mb-1">4. Personal:</label>
            <input id="edit-pers" type="text" value="${escapeHtml(p.PERSONAL || p.personal || '')}" required
              class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-sky-500 focus:outline-none"/>
          </div>
          <div>
            <label class="block text-slate-400 font-semibold mb-1">5. Maquinaria:</label>
            <input id="edit-maq" type="text" value="${escapeHtml(p.MAQUINARIA || p.maquinaria || '')}" required
              class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-sky-500 focus:outline-none"/>
          </div>
        </div>

        <div>
          <label class="block text-slate-400 font-semibold mb-1">6. Ocurrencias:</label>
          <textarea id="edit-ocurr" rows="3" required
            class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-sky-500 focus:outline-none">${escapeHtml(p.OCURRENCIAS || p.ocurrencias || '')}</textarea>
        </div>

        <!-- Botones -->
        <div class="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
          <button type="button" id="edit-btn-cancel" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition">
            Cancelar
          </button>
          <button type="submit" id="edit-btn-submit" class="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition flex items-center space-x-1 shadow-md shadow-sky-950">
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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

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
        <div class="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-sm font-bold text-white uppercase tracking-wider">¿Eliminar Reporte de Campo?</h3>
        <p class="text-xs text-slate-400">
          Se eliminará permanentemente el reporte <strong class="text-rose-400 font-mono">${escapeHtml(reportId)}</strong> de la base de datos de producción y del mapa.
        </p>

        <div class="pt-2 flex items-center justify-center space-x-3">
          <button type="button" id="delete-btn-cancel" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition">
            Cancelar
          </button>
          <button type="button" id="delete-btn-confirm" class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-950">
            Confirmar Eliminación
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector('#delete-btn-cancel').addEventListener('click', close);

  modal.querySelector('#delete-btn-confirm').addEventListener('click', async () => {
    const confirmBtn = modal.querySelector('#delete-btn-confirm');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Eliminando...';

    try {
      const res = await fetch(SYNC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: reportId })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showAuthToast(`✓ Reporte ${reportId} eliminado con éxito`, 'success');
      close();

      if (onPointDeleted) {
        onPointDeleted(reportId);
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
      showAuthToast(`Error al eliminar: ${err.message}`, 'danger');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirmar Eliminación';
    }
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
