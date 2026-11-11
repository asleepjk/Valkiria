/**
 * Paneles Tácticos del Visor Valkiria
 * Gestiona: Lista de Capas (con MINUSCA), Galería de Mapas Base, Leyenda y Filtro de Fechas
 * Disposición inteligente a la izquierda para evitar solapamiento con el Drawer de detalles a la derecha.
 * Los paneles permanecen abiertos durante la navegación y solo se cierran explícitamente.
 */

import { LAYERS_CONFIG } from './layersConfig.js';

let activePanelId = null;
let mapInstance = null;
let viewInstance = null;
let layerInstancesRef = {};
let minuscaLayerRef = null;
let currentBasemapId = 'satellite';

const BASEMAP_OPTIONS = [
  {
    id: 'satellite',
    name: 'Satelital (Imágenes Puras)',
    desc: 'Imágenes aéreas puras de alta resolución sin etiquetas superpuestas',
    thumb: 'https://www.arcgis.com/sharing/rest/content/items/86de95d4e0244cba80f0fa28b1cc2463/info/thumbnail/thumbnail1591224931210.jpeg'
  },
  {
    id: 'hybrid',
    name: 'Satelital Híbrido',
    desc: 'Imágenes satelitales globales con nombres de lugares y red vial',
    thumb: 'https://www.arcgis.com/sharing/rest/content/items/10df2279f9684e4a9f6a7f08febac2a9/info/thumbnail/thumbnail1584118328636.jpeg'
  },
  {
    id: 'topo-vector',
    name: 'Topográfico Esri',
    desc: 'Curvas de nivel, relieve sombreado y referencias geográficas',
    thumb: 'https://www.arcgis.com/sharing/rest/content/items/7dc6cea0b7a34a1996b9e6ff22625ec0/info/thumbnail/topo_thumb_b2.jpg'
  },
  {
    id: 'streets-vector',
    name: 'Calles & Vías',
    desc: 'Red vial completa, carreteras y asentamientos urbanos',
    thumb: 'https://www.arcgis.com/sharing/rest/content/items/4f3582e9e1444747ba6b8b09ff8e869f/info/thumbnail/world_street_map.jpg'
  },
  {
    id: 'osm',
    name: 'OpenStreetMap',
    desc: 'Cartografía comunitaria abierta y detallada',
    thumb: 'https://www.arcgis.com/sharing/rest/content/items/5d2bfa736f8448b3a114380585b9e823/info/thumbnail/tem_osm.jpg'
  },
  {
    id: 'dark-gray-vector',
    name: 'Modo Táctico Oscuro',
    desc: 'Contraste óptimo para operaciones nocturnas',
    thumb: 'https://www.arcgis.com/sharing/rest/content/items/4e43282276554e198bfa49c3de2f0672/info/thumbnail/thumbnail1562947137837.jpeg'
  }
];

export function initTacticalPanels({ map, view, layerInstances, minuscaLayer, onMinuscaZoom, onFieldReportsZoom }) {
  mapInstance = map;
  viewInstance = view;
  layerInstancesRef = layerInstances;
  minuscaLayerRef = minuscaLayer;

  setupTopBarButtons(onMinuscaZoom);
  renderBasemapCards();
  renderLayersList(onMinuscaZoom, onFieldReportsZoom);
  renderLegendItems();
  // NOTA: Se eliminó el cierre automático al hacer clic o navegar en el mapa para permitir trabajo continuo
}

function setupTopBarButtons(onMinuscaZoom) {
  const buttons = [
    { btnId: 'nav-layers-btn', panelId: 'panel-layers' },
    { btnId: 'nav-basemap-btn', panelId: 'panel-basemap' },
    { btnId: 'nav-legend-btn', panelId: 'panel-legend' },
    { btnId: 'nav-date-btn', panelId: 'panel-date-filter' }
  ];

  buttons.forEach(({ btnId, panelId }) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel(panelId, btnId);
    });
  });
}

export function togglePanel(panelId, btnId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const isCurrentlyOpen = !panel.classList.contains('hidden');

  // Si ya estaba abierto este mismo panel, lo cerramos
  if (isCurrentlyOpen) {
    closeAllPanels();
    return;
  }

  // Cerrar cualquier otro panel abierto antes de mostrar el nuevo
  closeAllPanels();

  // Abrir panel seleccionado
  panel.classList.remove('hidden');
  activePanelId = panelId;

  // Resaltar botón activo en la barra superior
  if (btnId) {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.classList.add('bg-sky-600', 'text-white', 'border-sky-400', 'shadow-sky-500/30');
      btn.classList.remove('bg-slate-800', 'text-slate-200', 'border-slate-700');
    }
  }
}

export function closeAllPanels() {
  document.querySelectorAll('.tactical-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.nav-tool-btn').forEach(b => {
    if (b.id !== 'nav-toggle-table') {
      b.classList.remove('bg-sky-600', 'text-white', 'border-sky-400', 'shadow-sky-500/30');
      b.classList.add('bg-slate-800', 'text-slate-200', 'border-slate-700');
    }
  });
  activePanelId = null;
}

// ==========================================
// 1. RENDERIZADO DE MAPAS BASE
// ==========================================
function renderBasemapCards() {
  const container = document.getElementById('basemap-grid');
  if (!container) return;
  container.innerHTML = '';

  BASEMAP_OPTIONS.forEach(bm => {
    const card = document.createElement('div');
    const isActive = bm.id === currentBasemapId;
    card.className = `
      cursor-pointer rounded-xl p-2.5 border transition flex items-center space-x-3
      ${isActive
        ? 'bg-sky-950/80 border-sky-400 shadow-md shadow-sky-950 ring-1 ring-sky-400/50'
        : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}
    `;

    card.innerHTML = `
      <img src="${bm.thumb}" alt="${bm.name}" class="w-14 h-14 object-cover rounded-lg border border-slate-700 shadow flex-shrink-0" onerror="this.src='https://via.placeholder.com/60?text=MAP';"/>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold text-white truncate">${bm.name}</h4>
          ${isActive ? '<span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>' : ''}
        </div>
        <p class="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">${bm.desc}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      if (mapInstance) {
        mapInstance.basemap = bm.id;
        currentBasemapId = bm.id;
        renderBasemapCards();
      }
    });

    container.appendChild(card);
  });
}

// ==========================================
// 2. RENDERIZADO DE LISTA DE CAPAS (CON MINUSCA)
// ==========================================
function renderLayersList(onMinuscaZoom, onFieldReportsZoom) {
  const container = document.getElementById('layers-tree');
  if (!container) return;
  container.innerHTML = '';

  // --- SECCIÓN RÁSTER MINUSCA (DESTACADA) ---
  const minuscaBox = document.createElement('div');
  minuscaBox.className = 'p-3 bg-slate-950/70 border border-emerald-500/40 rounded-xl space-y-2 mb-3 shadow-inner';
  minuscaBox.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <input id="layer-chk-minusca" type="checkbox" class="w-4 h-4 text-emerald-500 rounded bg-slate-800 border-slate-600 cursor-pointer focus:ring-emerald-500" />
        <label for="layer-chk-minusca" class="text-xs font-bold text-emerald-300 cursor-pointer flex items-center space-x-1.5 select-none">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>Ortofoto / Ráster MINUSCA</span>
        </label>
      </div>
      <button id="minusca-zoom-btn" title="Centrar en Ortofoto" class="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900 transition">
        Ver Extensión
      </button>
    </div>
    <div class="flex items-center space-x-2 text-[10px] text-slate-400 pt-1">
      <span>Opacidad:</span>
      <input id="minusca-opacity" type="range" min="0.1" max="1" step="0.05" value="0.9" class="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"/>
      <span id="minusca-opacity-val" class="font-mono text-slate-300">90%</span>
    </div>
  `;
  container.appendChild(minuscaBox);

  // Eventos MINUSCA
  const minuscaChk = minuscaBox.querySelector('#layer-chk-minusca');
  if (minuscaLayerRef) {
    minuscaChk.checked = minuscaLayerRef.visible;
  }
  minuscaChk.addEventListener('change', () => {
    if (minuscaLayerRef) {
      minuscaLayerRef.visible = minuscaChk.checked;
    }
  });

  const zoomBtn = minuscaBox.querySelector('#minusca-zoom-btn');
  zoomBtn.addEventListener('click', () => {
    if (onMinuscaZoom) onMinuscaZoom();
  });

  const opacityRange = minuscaBox.querySelector('#minusca-opacity');
  const opacityVal = minuscaBox.querySelector('#minusca-opacity-val');
  opacityRange.addEventListener('input', () => {
    const val = parseFloat(opacityRange.value);
    opacityVal.textContent = `${Math.round(val * 100)}%`;
    if (minuscaLayerRef) minuscaLayerRef.opacity = val;
  });

  // --- SECCIÓN CAPAS VECTORIALES AGRUPADAS ---
  const groups = [
    {
      name: 'TRABAJOS REALIZADOS',
      layers: LAYERS_CONFIG.filter(l => l.group.includes('TRABAJOS REALIZADOS'))
    },
    {
      name: 'ELEMENTOS DE INTERES',
      layers: LAYERS_CONFIG.filter(l => l.group === 'ELEMENTOS DE INTERES')
    },
    {
      name: 'LIMITES ADMINISTRATIVOS',
      layers: LAYERS_CONFIG.filter(l => l.group === 'LIMITES ADMINISTRATIVOS')
    }
  ];

  groups.forEach(grp => {
    const grpDiv = document.createElement('div');
    grpDiv.className = 'space-y-1 mb-2.5';
    grpDiv.innerHTML = `
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800 flex items-center justify-between">
        <span>${grp.name}</span>
        <span class="text-slate-500 font-normal">(${grp.layers.length})</span>
      </div>
      <div class="space-y-1 pt-1"></div>
    `;

    const layersCont = grpDiv.querySelector('.space-y-1');

    grp.layers.forEach(cfg => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-800/60 transition text-xs';
      
      const layerInstance = layerInstancesRef[cfg.id];
      const isVisible = layerInstance ? layerInstance.visible : cfg.visible;

      let previewIcon = '';
      if (cfg.renderer && cfg.renderer.symbol && cfg.renderer.symbol.url) {
        previewIcon = `<img src="${cfg.renderer.symbol.url}" class="w-4 h-4 object-contain inline-block mr-1.5" />`;
      } else if (cfg.renderer && cfg.renderer.symbol && cfg.renderer.symbol.color) {
        const col = cfg.renderer.symbol.color;
        const colorStr = `rgba(${col[0]}, ${col[1]}, ${col[2]}, 0.8)`;
        previewIcon = `<span class="w-3.5 h-3.5 rounded border border-white/50 inline-block mr-1.5" style="background-color: ${colorStr}"></span>`;
      } else {
        previewIcon = `<span class="w-3 h-3 rounded-full bg-sky-400 inline-block mr-1.5"></span>`;
      }

      let actionBtnHtml = '';
      if (cfg.id === 'live_submissions') {
        actionBtnHtml = `
          <button type="button" class="field-reports-zoom-btn text-[10px] px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 hover:bg-rose-900 transition flex items-center space-x-1 flex-shrink-0 ml-1" title="Centrar mapa en los puntos de campo de Valkiria">
            <svg class="w-3 h-3 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <span>Ver Puntos</span>
          </button>
        `;
      }

      row.innerHTML = `
        <label class="flex items-center space-x-2 cursor-pointer flex-1 truncate select-none">
          <input type="checkbox" data-layer-id="${cfg.id}" ${isVisible ? 'checked' : ''} class="w-3.5 h-3.5 text-sky-500 rounded bg-slate-800 border-slate-600 focus:ring-sky-500 cursor-pointer" />
          <div class="flex items-center truncate">
            ${previewIcon}
            <span class="text-slate-200 truncate">${cfg.title}</span>
          </div>
        </label>
        ${actionBtnHtml}
      `;

      if (cfg.id === 'live_submissions') {
        const zoomBtn = row.querySelector('.field-reports-zoom-btn');
        if (zoomBtn) {
          zoomBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onFieldReportsZoom) onFieldReportsZoom();
          });
        }
      }

      const chk = row.querySelector('input');
      chk.addEventListener('change', () => {
        const lyr = layerInstancesRef[cfg.id];
        if (lyr) {
          lyr.visible = chk.checked;
        }
        renderLegendItems();
      });

      layersCont.appendChild(row);
    });

    container.appendChild(grpDiv);
  });
}

// ==========================================
// 3. RENDERIZADO DE LEYENDA SIMBÓLICA
// ==========================================
function renderLegendItems() {
  const container = document.getElementById('legend-items');
  if (!container) return;
  container.innerHTML = '';

  if (minuscaLayerRef && minuscaLayerRef.visible) {
    const item = document.createElement('div');
    item.className = 'flex items-center space-x-2.5 py-1 text-xs border-b border-slate-800/80 pb-2';
    item.innerHTML = `
      <span class="w-5 h-5 rounded border border-emerald-500 bg-emerald-500/30 flex items-center justify-center text-[10px]">🗺️</span>
      <div>
        <div class="text-slate-200 font-bold">Ortofoto / Ráster MINUSCA</div>
        <div class="text-[10px] text-slate-400">Imagen de referencia operativa RCA</div>
      </div>
    `;
    container.appendChild(item);
  }

  LAYERS_CONFIG.forEach(cfg => {
    const lyr = layerInstancesRef[cfg.id];
    if (lyr && !lyr.visible) return;

    const item = document.createElement('div');
    item.className = 'flex items-start space-x-2.5 py-1.5 text-xs border-b border-slate-800/60 last:border-0';

    let iconHtml = '';
    if (cfg.renderer && cfg.renderer.symbol && cfg.renderer.symbol.url) {
      iconHtml = `<img src="${cfg.renderer.symbol.url}" class="w-6 h-6 object-contain flex-shrink-0" />`;
    } else if (cfg.renderer && cfg.renderer.type === 'unique-value') {
      iconHtml = `
        <div class="flex flex-col space-y-1">
          <div class="flex items-center space-x-1"><span class="w-3.5 h-3 rounded" style="background:#ffebbe; border:1px solid #333;"></span><span class="text-[10px] text-slate-300">CENTER</span></div>
          <div class="flex items-center space-x-1"><span class="w-3.5 h-3 rounded" style="background:#bed2ff; border:1px solid #333;"></span><span class="text-[10px] text-slate-300">EAST</span></div>
          <div class="flex items-center space-x-1"><span class="w-3.5 h-3 rounded" style="background:#e8beff; border:1px solid #333;"></span><span class="text-[10px] text-slate-300">WEST</span></div>
        </div>
      `;
    } else if (cfg.renderer && cfg.renderer.symbol && cfg.renderer.symbol.style === 'diagonal-cross') {
      iconHtml = `<div class="w-5 h-5 border-2 border-red-600 bg-red-600/30 flex-shrink-0" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,0,0,0.5) 2px, rgba(255,0,0,0.5) 4px);"></div>`;
    } else if (cfg.renderer && cfg.renderer.symbol && cfg.renderer.symbol.outline) {
      const outCol = cfg.renderer.symbol.outline.color;
      const w = cfg.renderer.symbol.outline.width || 2;
      iconHtml = `<div class="w-5 h-5 flex-shrink-0 border-${w} rounded" style="border-color: rgba(${outCol[0]}, ${outCol[1]}, ${outCol[2]}, 1); border-width: ${w}px;"></div>`;
    } else {
      iconHtml = `<span class="w-4 h-4 rounded-full bg-sky-400 flex-shrink-0"></span>`;
    }

    item.innerHTML = `
      <div class="pt-0.5">${iconHtml}</div>
      <div class="flex-1">
        <div class="text-slate-200 font-semibold">${cfg.title}</div>
        <div class="text-[10px] text-slate-400">${cfg.group}</div>
      </div>
    `;

    container.appendChild(item);
  });

  if (container.children.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500 py-4 text-center">No hay capas visibles actualmente.</p>`;
  }
}
