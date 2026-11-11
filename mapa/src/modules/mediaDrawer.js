/**
 * Panel Lateral (Drawer) Interactivo y Modal Lightbox Multimedia
 * Soporta fotos en alta resolución, reproductor de video HTML5 nativo y ficha técnica.
 */
import { resolvePhotoUrl, resolveVideoUrl } from './assetResolver.js';

let drawerElement = null;
let lightboxElement = null;
let currentFeature = null;
let onCenterCallback = null;

export function initMediaDrawer({ onCenterOnMap } = {}) {
  onCenterCallback = onCenterOnMap;
  createDrawerDOM();
  createLightboxDOM();
}

function createDrawerDOM() {
  if (document.getElementById('media-drawer')) return;

  drawerElement = document.createElement('div');
  drawerElement.id = 'media-drawer';
  drawerElement.className = `
    fixed top-0 right-0 h-full w-full sm:w-[440px] md:w-[480px] bg-slate-900/95 backdrop-blur-md
    text-slate-100 shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out
    flex flex-col border-l border-slate-700/60
  `;

  drawerElement.innerHTML = `
    <!-- Header -->
    <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
      <div class="flex items-center space-x-2">
        <span id="drawer-badge" class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          DETALLE
        </span>
        <h2 id="drawer-title" class="text-base font-bold text-white truncate max-w-[260px]">Detalle del Elemento</h2>
      </div>
      <div class="flex items-center space-x-2">
        <button id="drawer-center-btn" title="Centrar en el mapa" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
        <button id="drawer-close-btn" title="Cerrar panel" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Content (Scrollable) -->
    <div class="flex-1 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar">
      <!-- Media Section -->
      <div id="drawer-media-section" class="space-y-4">
        <!-- Video Player -->
        <div id="drawer-video-container" class="hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold tracking-wider text-rose-400 uppercase flex items-center space-x-1">
              <svg class="w-4 h-4 mr-1 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
              Video Operativo Adjunto
            </span>
          </div>
          <div class="relative rounded-xl overflow-hidden bg-black/80 border border-slate-700/80 aspect-video shadow-lg">
            <video id="drawer-video" class="w-full h-full object-contain" controls preload="metadata">
              Tu navegador no soporta reproducción de video HTML5.
            </video>
          </div>
        </div>

        <!-- Photos Gallery -->
        <div id="drawer-photos-container" class="hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold tracking-wider text-amber-400 uppercase flex items-center space-x-1">
              <svg class="w-4 h-4 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Evidencias Fotográficas
            </span>
            <span id="drawer-photos-count" class="text-xs text-slate-400"></span>
          </div>
          <div id="drawer-photos-grid" class="grid grid-cols-2 gap-2.5">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>

      <!-- Attributes Information -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
          Información Técnica
        </h3>
        <div id="drawer-attributes" class="space-y-2 text-sm">
          <!-- Dynamically populated -->
        </div>
      </div>

      <!-- Coordinates & Location -->
      <div id="drawer-coords-box" class="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-slate-400 font-medium">Coordenadas WGS84:</span>
          <button id="drawer-copy-coords-btn" class="text-sky-400 hover:text-sky-300 font-semibold transition flex items-center space-x-1">
            <svg class="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span id="copy-text">Copiar</span>
          </button>
        </div>
        <div id="drawer-coords-val" class="font-mono text-slate-200">--</div>
      </div>
    </div>
  `;

  document.body.appendChild(drawerElement);

  // Events
  document.getElementById('drawer-close-btn').addEventListener('click', closeMediaDrawer);
  document.getElementById('drawer-center-btn').addEventListener('click', () => {
    if (currentFeature && onCenterCallback) {
      onCenterCallback(currentFeature);
    }
  });

  const copyBtn = document.getElementById('drawer-copy-coords-btn');
  copyBtn.addEventListener('click', () => {
    const coordsText = document.getElementById('drawer-coords-val').textContent;
    navigator.clipboard.writeText(coordsText).then(() => {
      const label = document.getElementById('copy-text');
      label.textContent = '¡Copiado!';
      setTimeout(() => label.textContent = 'Copiar', 2000);
    });
  });
}

function createLightboxDOM() {
  if (document.getElementById('media-lightbox')) return;

  lightboxElement = document.createElement('div');
  lightboxElement.id = 'media-lightbox';
  lightboxElement.className = `
    fixed inset-0 z-[100] bg-black/90 backdrop-blur-md hidden flex items-center justify-center p-4
  `;
  lightboxElement.innerHTML = `
    <div class="relative max-w-5xl max-h-full flex flex-col items-center">
      <img id="lightbox-img" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" src="" alt="Vista ampliada" />
      <p id="lightbox-caption" class="mt-3 text-sm text-slate-300 font-medium"></p>
      <button id="lightbox-close" class="absolute -top-10 right-0 text-white/80 hover:text-white p-2 text-2xl font-bold transition">
        ✕
      </button>
    </div>
  `;
  document.body.appendChild(lightboxElement);

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightboxElement.addEventListener('click', (e) => {
    if (e.target === lightboxElement) closeLightbox();
  });
}

export function openLightbox(url, caption = '') {
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  img.src = url;
  cap.textContent = caption;
  lightboxElement.classList.remove('hidden');
}

export function closeLightbox() {
  if (lightboxElement) lightboxElement.classList.add('hidden');
}

export function openMediaDrawer(featureData) {
  if (!drawerElement) createDrawerDOM();
  currentFeature = featureData;

  const props = featureData.properties || {};
  const category = featureData.category || 'INGENIERIA';
  const title = props.CODIGO ? `${props.CODIGO} - ${props.NOMBRE || props.LUGAR || ''}` : (props.NOMBRE || props.LUGAR || props.adm1_name || 'Detalle');

  // Badge
  const badge = document.getElementById('drawer-badge');
  badge.textContent = category;
  if (category === 'INGENIERIA') {
    badge.className = 'px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30';
  } else if (category === 'EOD') {
    badge.className = 'px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30';
  } else if (category === 'REPORTE DE CAMPO') {
    badge.className = 'px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30';
  } else {
    badge.className = 'px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30';
  }

  document.getElementById('drawer-title').textContent = title;

  // Video
  const videoCont = document.getElementById('drawer-video-container');
  const videoEl = document.getElementById('drawer-video');
  const rawVideo = props.VIDEO || props.video;
  const videoUrl = resolveVideoUrl(rawVideo);

  if (videoUrl) {
    videoEl.src = videoUrl;
    videoCont.classList.remove('hidden');
  } else {
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoCont.classList.add('hidden');
  }

  // Photos
  const photosCont = document.getElementById('drawer-photos-container');
  const photosGrid = document.getElementById('drawer-photos-grid');
  const photosCount = document.getElementById('drawer-photos-count');
  photosGrid.innerHTML = '';

  const photoFields = [props.FOTO, props.foto, props.FOTO_2, props.foto_2].filter(Boolean);
  const resolvedPhotos = photoFields.map(p => resolvePhotoUrl(p)).filter(Boolean);

  if (resolvedPhotos.length > 0) {
    photosCont.classList.remove('hidden');
    photosCount.textContent = `${resolvedPhotos.length} foto(s)`;

    resolvedPhotos.forEach((photoUrl, idx) => {
      const card = document.createElement('div');
      card.className = 'relative group cursor-pointer overflow-hidden rounded-xl border border-slate-700 aspect-video bg-black/40';
      card.innerHTML = `
        <img src="${photoUrl}" alt="Evidencia ${idx + 1}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📷</text></svg>';" />
        <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="p-1.5 rounded-full bg-black/60 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
            </svg>
          </span>
        </div>
      `;
      card.addEventListener('click', () => openLightbox(photoUrl, `${title} - Foto ${idx + 1}`));
      photosGrid.appendChild(card);
    });
  } else {
    photosCont.classList.add('hidden');
  }

  // Attributes Table
  const attrCont = document.getElementById('drawer-attributes');
  attrCont.innerHTML = '';

  const isValkiria = category === 'REPORTE DE CAMPO' || Boolean(props.JEFE_TOB || props.jefe_tob);

  let displayFields = [];
  if (isValkiria) {
    // Orden idéntico y exclusivo al aplicativo móvil Valkiria
    displayFields = [
      { label: '1. Jefe de TOB', val: props.JEFE_TOB || props.jefe_tob },
      { label: '2. Teléfono', val: props.TELEFONO || props.telefono },
      { label: '3. Lugar de Misión', val: props.LUGAR || props.lugar },
      { label: '4. Personal', val: props.PERSONAL || props.personal || props.persona },
      { label: '5. Maquinaria', val: props.MAQUINARIA || props.maquinaria },
      { label: '6. Ocurrencias', val: props.OCURRENCIAS || props.ocurrencias },
      { label: 'Coordenadas DMS', val: props.DMS || props.dms },
      { label: 'Altitud', val: props.ALTITUD ? `${Math.round(props.ALTITUD)} m s.n.m.` : null },
      { label: 'Precisión GPS', val: props.PRECISION_M ? `±${Number(props.PRECISION_M).toFixed(1)} m` : null },
      { label: 'Fecha de Registro', val: props.FECHA || props.fecha_envio },
      { label: 'Código / ID', val: props.CODIGO || props.codigo }
    ];
  } else {
    displayFields = [
      { label: 'Código', val: props.CODIGO || props.codigo },
      { label: 'Lugar / Sector', val: props.LUGAR || props.lugar || props.adm1_name || props.adm2_name },
      { label: 'Nombre Operativo', val: props.NOMBRE || props.nombre },
      { label: 'Sección', val: props.SECCION || props.seccion },
      { label: 'Tipo de Trabajo', val: props.TIPO_TRAB || props.tipo_trab },
      { label: 'Task Order', val: props.TASK_ORDER || props.task_order },
      { label: 'Responsable', val: props.RESPONSABLE || props.responsable },
      { label: 'Altitud', val: props.ALTITUD ? `${Math.round(props.ALTITUD)} m s.n.m.` : null },
      { label: 'Precisión GPS', val: props.PRECISION_M ? `±${Number(props.PRECISION_M).toFixed(1)} m` : null },
      { label: 'Coordenadas DMS', val: props.DMS || props.dms },
      { label: 'Fecha de Registro', val: props.FECHA || props.fecha_envio },
      { label: 'Descripción', val: props.DESCRIPCION || props.descripcion },
      { label: 'Observaciones', val: props.OBS || props.obs }
    ];
  }

  displayFields.filter(f => f.val !== undefined && f.val !== null && String(f.val).trim() !== '').forEach(item => {
    const row = document.createElement('div');
    row.className = 'flex flex-col py-1.5 border-b border-slate-800/80 last:border-0';
    row.innerHTML = `
      <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">${item.label}</span>
      <span class="text-sm text-slate-200 mt-0.5 whitespace-pre-wrap">${escapeHtml(String(item.val))}</span>
    `;
    attrCont.appendChild(row);
  });

  // Coordinates
  const coordsBox = document.getElementById('drawer-coords-val');
  if (featureData.geometry) {
    let lat = null, lon = null;
    if (featureData.geometry.type === 'Point' && featureData.geometry.coordinates) {
      [lon, lat] = featureData.geometry.coordinates;
    } else if (featureData.geometry.latitude !== undefined) {
      lat = featureData.geometry.latitude;
      lon = featureData.geometry.longitude;
    } else if (featureData.geometry.extent) {
      lat = featureData.geometry.extent.center.latitude;
      lon = featureData.geometry.extent.center.longitude;
    }
    if (lat !== null && lon !== null) {
      coordsBox.textContent = `Lat: ${lat.toFixed(6)}°, Lon: ${lon.toFixed(6)}°`;
    } else {
      coordsBox.textContent = 'Geometría poligonal / sin punto único';
    }
  } else {
    coordsBox.textContent = 'No disponible';
  }

  // Open drawer
  drawerElement.classList.remove('translate-x-full');
}

export function closeMediaDrawer() {
  if (drawerElement) {
    drawerElement.classList.add('translate-x-full');
    const videoEl = document.getElementById('drawer-video');
    if (videoEl) videoEl.pause();
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
