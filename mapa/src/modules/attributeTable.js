/**
 * Tabla de Atributos Inferior Colapsable
 * Permite examinar los registros por capa, buscar en tiempo real, filtrar y hacer zoom/click hacia el mapa.
 */

let tableContainer = null;
let isCollapsed = true;
let currentTab = 'ing';
let allLayerData = {};
let filteredData = [];
let onSelectFeatureCallback = null;

export function initAttributeTable({ onSelectFeature } = {}) {
  onSelectFeatureCallback = onSelectFeature;
  createTableDOM();
}

export function updateTableData(layerId, features, categoryTitle) {
  allLayerData[layerId] = {
    title: categoryTitle || layerId,
    features: features || []
  };
  renderTabs();
  renderCurrentTable();
}

function createTableDOM() {
  if (document.getElementById('bottom-attribute-table')) return;

  tableContainer = document.createElement('div');
  tableContainer.id = 'bottom-attribute-table';
  tableContainer.className = `
    fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/80
    text-slate-100 shadow-2xl transition-all duration-300 ease-in-out flex flex-col
  `;
  tableContainer.style.height = '42px'; // In collapsed state

  tableContainer.innerHTML = `
    <!-- Top Bar / Handle -->
    <div id="table-handle" class="h-[42px] px-4 flex items-center justify-between cursor-pointer bg-slate-950/80 hover:bg-slate-900 border-b border-slate-800 select-none">
      <div class="flex items-center space-x-3">
        <button id="table-toggle-btn" class="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300">
          <svg id="table-chevron" class="w-4 h-4 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
          </svg>
          <span>Tabla de Atributos</span>
        </button>
        <span id="table-record-count" class="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          0 registros
        </span>
      </div>

      <!-- Quick Search inside table -->
      <div class="flex items-center space-x-3">
        <div id="table-search-box" class="relative hidden sm:block">
          <input
            id="table-search-input"
            type="text"
            placeholder="Buscar en tabla..."
            class="w-48 md:w-64 px-3 py-1 text-xs rounded-lg bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition"
          />
          <button id="table-search-clear" class="absolute right-2 top-1.5 text-slate-400 hover:text-white hidden">✕</button>
        </div>

        <button id="table-export-csv" title="Exportar vista a CSV" class="p-1 px-2.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center space-x-1">
          <svg class="w-3.5 h-3.5 mr-1 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span>CSV</span>
        </button>

        <button id="table-collapse-trigger" class="text-slate-400 hover:text-white p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Body Section (visible when expanded) -->
    <div id="table-body" class="flex-1 flex flex-col overflow-hidden hidden">
      <!-- Tabs for active layers -->
      <div id="table-tabs" class="flex items-center px-4 pt-2 space-x-2 border-b border-slate-800 overflow-x-auto no-scrollbar bg-slate-950/40">
        <!-- Dynamically rendered tabs -->
      </div>

      <!-- Table Viewport -->
      <div class="flex-1 overflow-auto custom-scrollbar">
        <table class="w-full text-left text-xs whitespace-nowrap">
          <thead class="bg-slate-950/90 text-slate-400 uppercase tracking-wider sticky top-0 z-10 border-b border-slate-800">
            <tr id="table-header-row">
              <th class="py-2.5 px-3">#</th>
              <th class="py-2.5 px-3">Código</th>
              <th class="py-2.5 px-3">Lugar / Nombre</th>
              <th class="py-2.5 px-3">Sección</th>
              <th class="py-2.5 px-3">Tipo de Trabajo</th>
              <th class="py-2.5 px-3">Responsable</th>
              <th class="py-2.5 px-3">Fechas</th>
              <th class="py-2.5 px-3 text-center">Multimedia</th>
              <th class="py-2.5 px-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody id="table-content-rows" class="divide-y divide-slate-800/60 font-sans">
            <!-- Dynamically rendered rows -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.body.appendChild(tableContainer);

  // Events
  document.getElementById('table-handle').addEventListener('click', (e) => {
    // Avoid triggering when clicking input or buttons
    if (e.target.closest('input') || e.target.closest('#table-export-csv')) return;
    toggleTable();
  });

  document.getElementById('table-search-input').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    const clearBtn = document.getElementById('table-search-clear');
    if (val) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
    filterTable(val);
  });

  document.getElementById('table-search-clear').addEventListener('click', () => {
    const inp = document.getElementById('table-search-input');
    inp.value = '';
    document.getElementById('table-search-clear').classList.add('hidden');
    filterTable('');
  });

  document.getElementById('table-export-csv').addEventListener('click', exportToCSV);
}

export function toggleTable(forceState) {
  if (!tableContainer) return;
  if (forceState !== undefined) {
    isCollapsed = !forceState;
  } else {
    isCollapsed = !isCollapsed;
  }

  const chevron = document.getElementById('table-chevron');
  const body = document.getElementById('table-body');

  if (isCollapsed) {
    tableContainer.style.height = '42px';
    body.classList.add('hidden');
    chevron.classList.remove('rotate-180');
  } else {
    tableContainer.style.height = '320px';
    body.classList.remove('hidden');
    chevron.classList.add('rotate-180');
    renderCurrentTable();
  }
}

function renderTabs() {
  const tabsContainer = document.getElementById('table-tabs');
  if (!tabsContainer) return;
  tabsContainer.innerHTML = '';

  const layerKeys = Object.keys(allLayerData);
  if (layerKeys.length === 0) return;

  if (!allLayerData[currentTab] && layerKeys.length > 0) {
    currentTab = layerKeys[0];
  }

  layerKeys.forEach(key => {
    const item = allLayerData[key];
    const btn = document.createElement('button');
    const isActive = key === currentTab;
    btn.className = `
      px-3 py-1.5 text-xs font-medium rounded-t-lg transition border-b-2
      ${isActive
        ? 'bg-slate-800 text-sky-400 border-sky-400 font-bold'
        : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'}
    `;
    btn.innerHTML = `${item.title} <span class="ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-500'}">${item.features.length}</span>`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentTab = key;
      renderTabs();
      renderCurrentTable();
    });
    tabsContainer.appendChild(btn);
  });
}

function renderCurrentTable() {
  const tbody = document.getElementById('table-content-rows');
  const recordCount = document.getElementById('table-record-count');
  if (!tbody) return;

  const currentLayer = allLayerData[currentTab];
  if (!currentLayer || !currentLayer.features) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-slate-500">No hay datos disponibles para esta capa.</td></tr>`;
    if (recordCount) recordCount.textContent = '0 registros';
    return;
  }

  const searchInput = document.getElementById('table-search-input');
  const filterQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let list = currentLayer.features;
  if (filterQuery) {
    list = list.filter(feat => {
      const p = feat.properties || {};
      return Object.values(p).some(val => val && String(val).toLowerCase().includes(filterQuery));
    });
  }

  filteredData = list;
  if (recordCount) recordCount.textContent = `${list.length} de ${currentLayer.features.length} registros`;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-slate-500">Ningún registro coincide con el filtro.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  list.forEach((feat, index) => {
    const p = feat.properties || {};
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-800/60 cursor-pointer transition';

    const codigo = p.CODIGO || p.codigo || `#${index + 1}`;
    const nombre = p.NOMBRE || p.nombre || p.LUGAR || p.lugar || p.adm1_name || p.adm2_name || '-';
    const seccion = p.SECCION || p.seccion || '-';
    const tipo = p.TIPO_TRAB || p.tipo_trab || p.ZONAS || '-';
    const resp = p.RESPONSABLE || p.responsable || '-';
    const fechas = p.F_INICIO ? `${p.F_INICIO} → ${p.F_TERMINO || 'Actual'}` : (p.fecha_envio || '-');

    // Multimedia flags
    const hasPhoto = Boolean(p.FOTO || p.foto || p.FOTO_2 || p.foto_2);
    const hasVideo = Boolean(p.VIDEO || p.video);

    tr.innerHTML = `
      <td class="py-2 px-3 text-slate-500">${index + 1}</td>
      <td class="py-2 px-3 font-semibold text-sky-400">${codigo}</td>
      <td class="py-2 px-3 text-white font-medium">${nombre}</td>
      <td class="py-2 px-3 text-slate-300">${seccion}</td>
      <td class="py-2 px-3 text-slate-300 max-w-[200px] truncate" title="${tipo}">${tipo}</td>
      <td class="py-2 px-3 text-slate-400">${resp}</td>
      <td class="py-2 px-3 text-slate-400">${fechas}</td>
      <td class="py-2 px-3 text-center">
        <div class="inline-flex items-center space-x-1.5">
          ${hasPhoto ? `<span title="Fotografía disponible" class="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">📷 Foto</span>` : ''}
          ${hasVideo ? `<span title="Video disponible" class="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30">🎬 Video</span>` : ''}
          ${!hasPhoto && !hasVideo ? `<span class="text-slate-600 text-[10px]">--</span>` : ''}
        </div>
      </td>
      <td class="py-2 px-3 text-center">
        <button class="px-2 py-1 rounded bg-sky-600/30 hover:bg-sky-600 text-sky-300 hover:text-white text-xs font-semibold transition" title="Ver en el mapa">
          Ver
        </button>
      </td>
    `;

    tr.addEventListener('click', () => {
      if (onSelectFeatureCallback) {
        onSelectFeatureCallback(feat);
      }
    });

    tbody.appendChild(tr);
  });
}

function filterTable() {
  renderCurrentTable();
}

function exportToCSV() {
  if (!filteredData || filteredData.length === 0) {
    alert('No hay registros para exportar');
    return;
  }

  const sampleProps = filteredData[0].properties || {};
  const headers = Object.keys(sampleProps);
  
  const csvRows = [];
  csvRows.push(headers.join(','));

  filteredData.forEach(feat => {
    const p = feat.properties || {};
    const values = headers.map(header => {
      const val = p[header];
      if (val === null || val === undefined) return '""';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `valkiria_${currentTab}_${Date.now()}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
