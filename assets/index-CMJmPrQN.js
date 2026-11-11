import e from"https://js.arcgis.com/4.31/@arcgis/core/Map.js";import t from"https://js.arcgis.com/4.31/@arcgis/core/views/MapView.js";import n from"https://js.arcgis.com/4.31/@arcgis/core/layers/GeoJSONLayer.js";import r from"https://js.arcgis.com/4.31/@arcgis/core/layers/MediaLayer.js";import i from"https://js.arcgis.com/4.31/@arcgis/core/layers/support/ImageElement.js";import a from"https://js.arcgis.com/4.31/@arcgis/core/layers/support/ExtentAndRotationGeoreference.js";import o from"https://js.arcgis.com/4.31/@arcgis/core/geometry/Extent.js";import s from"https://js.arcgis.com/4.31/@arcgis/core/geometry/Point.js";import c from"https://js.arcgis.com/4.31/@arcgis/core/Graphic.js";import l from"https://js.arcgis.com/4.31/@arcgis/core/layers/GraphicsLayer.js";import u from"https://js.arcgis.com/4.31/@arcgis/core/widgets/ScaleBar.js";import d from"https://js.arcgis.com/4.31/@arcgis/core/widgets/Home.js";import ee from"https://js.arcgis.com/4.31/@arcgis/core/widgets/Fullscreen.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var f=[{id:`zonas`,title:`Zonas de Operación`,group:`ELEMENTOS DE INTERES`,file:`data/layers/zonas.geojson`,visible:!0,isFeature:!0,layerType:`polygon`,category:`ZONAS`,renderer:{type:`unique-value`,field:`ZONAS`,defaultSymbol:{type:`simple-fill`,color:[200,200,200,.3],outline:{color:[100,100,100,1],width:1.5}},uniqueValueInfos:[{value:`CENTER`,label:`CENTER`,symbol:{type:`simple-fill`,color:[255,235,190,.45],outline:{color:[40,40,40,.9],width:1.8}}},{value:`EAST`,label:`EAST`,symbol:{type:`simple-fill`,color:[190,210,255,.45],outline:{color:[40,40,40,.9],width:1.8}}},{value:`WEST`,label:`WEST`,symbol:{type:`simple-fill`,color:[232,190,255,.45],outline:{color:[40,40,40,.9],width:1.8}}}]},labelingInfo:[{labelExpressionInfo:{expression:`$feature.ZONAS`},symbol:{type:`text`,color:[241,245,249,.9],haloColor:[15,23,42,.9],haloSize:2,font:{family:`Arial, sans-serif`,size:11,weight:`bold`}},labelPlacement:`always-horizontal`,minScale:0,maxScale:0}]},{id:`rca`,title:`Límite República Centroafricana (RCA)`,group:`LIMITES ADMINISTRATIVOS`,file:`data/layers/rca.geojson`,visible:!0,isFeature:!0,layerType:`polygon`,category:`LIMITES`,renderer:{type:`simple`,symbol:{type:`simple-fill`,color:[0,0,0,0],outline:{color:[255,0,197,1],width:3}}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.adm0_name`},symbol:{type:`text`,color:[255,255,255,.95],haloColor:[15,23,42,.95],haloSize:2.5,font:{family:`Arial, sans-serif`,size:14,weight:`bold`}},labelPlacement:`always-horizontal`,minScale:0,maxScale:6288990}]},{id:`prefectura`,title:`Límite Prefecturas`,group:`LIMITES ADMINISTRATIVOS`,file:`data/layers/prefectura.geojson`,visible:!0,isFeature:!0,layerType:`polygon`,category:`LIMITES`,renderer:{type:`simple`,symbol:{type:`simple-fill`,color:[0,0,0,0],outline:{color:[255,255,0,.95],width:2}}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.adm1_name`},symbol:{type:`text`,color:[254,240,138,.95],haloColor:[15,23,42,.95],haloSize:2,font:{family:`Arial, sans-serif`,size:10,weight:`bold`}},labelPlacement:`always-horizontal`,minScale:4e6,maxScale:5e5}]},{id:`sub_prefectura`,title:`Límite Sub Prefecturas`,group:`LIMITES ADMINISTRATIVOS`,file:`data/layers/sub_prefectura.geojson`,visible:!0,isFeature:!0,layerType:`polygon`,category:`LIMITES`,renderer:{type:`simple`,symbol:{type:`simple-fill`,color:[0,0,0,0],outline:{color:[76,230,0,.85],width:1.2}}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.adm2_name`},symbol:{type:`text`,color:[134,239,172,.95],haloColor:[15,23,42,.95],haloSize:1.5,font:{family:`Arial, sans-serif`,size:8.5,weight:`normal`}},labelPlacement:`always-horizontal`,minScale:125e4,maxScale:0}]},{id:`bouar_aerodromo`,title:`Bouar Aeródromo`,group:`TRABAJOS REALIZADOS > INGENIERIA`,file:`data/layers/bouar_aerodromo.geojson`,visible:!0,isFeature:!0,layerType:`polygon`,category:`INGENIERIA`,renderer:{type:`simple`,symbol:{type:`simple-fill`,style:`diagonal-cross`,color:[255,0,0,.35],outline:{color:[255,0,0,1],width:2}}}},{id:`airport`,title:`Aeropuertos`,group:`ELEMENTOS DE INTERES`,file:`data/layers/airport.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`INTERES`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/airport_marker_halo.png`,width:`32px`,height:`32px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.Name`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[15,23,42,.95],haloSize:1.5,font:{family:`Arial Narrow, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-center`,minScale:3e6,maxScale:0}]},{id:`adminpoint`,title:`Puntos Administrativos`,group:`ELEMENTOS DE INTERES`,file:`data/layers/adminpoint.geojson`,visible:!1,isFeature:!0,layerType:`point`,category:`INTERES`,renderer:{type:`simple`,symbol:{type:`simple-marker`,style:`diamond`,color:[249,115,22,.9],size:7,outline:{color:[255,255,255,1],width:1}}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.Name`},symbol:{type:`text`,color:[251,146,60,.95],haloColor:[15,23,42,.95],haloSize:1.5,font:{family:`Arial Narrow, sans-serif`,size:8.5,weight:`normal`}},labelPlacement:`above-right`,minScale:2e6,maxScale:0}]},{id:`sabewa`,title:`EOD - Sabewa`,group:`TRABAJOS REALIZADOS > EOD`,file:`data/layers/sabewa.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`EOD`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/sabewa_marker.png`,width:`26px`,height:`26px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.Sector`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[124,45,18,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`bouar`,title:`EOD - Bouar`,group:`TRABAJOS REALIZADOS > EOD`,file:`data/layers/bouar.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`EOD`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/bouar_marker.png`,width:`26px`,height:`26px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.Sector`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[124,45,18,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`peouri_besson`,title:`EOD - Peouri Besson`,group:`TRABAJOS REALIZADOS > EOD`,file:`data/layers/peouri_besson.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`EOD`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/peouri_besson_marker.png`,width:`26px`,height:`26px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.Sector`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[124,45,18,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`benzambe`,title:`EOD - Benzambe`,group:`TRABAJOS REALIZADOS > EOD`,file:`data/layers/benzambe.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`EOD`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/benzambe_marker.png`,width:`26px`,height:`26px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.LUGAR`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[124,45,18,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`kouki`,title:`EOD - Kouki`,group:`TRABAJOS REALIZADOS > EOD`,file:`data/layers/kouki.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`EOD`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/kouki_marker.png`,width:`26px`,height:`26px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.LUGAR`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[124,45,18,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`ing`,title:`ING - Obras de Ingeniería`,group:`TRABAJOS REALIZADOS > INGENIERIA`,file:`data/layers/ing.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`INGENIERIA`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/ing_marker.png`,width:`28px`,height:`28px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.NOMBRE`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[30,58,138,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`live_submissions`,title:`Reportes de Campo`,group:`TRABAJOS REALIZADOS > REPORTES DE CAMPO`,isDynamic:!0,visible:!0,isFeature:!0,layerType:`point`,category:`REPORTE DE CAMPO`,renderer:{type:`simple`,symbol:{type:`simple-marker`,style:`circle`,color:[239,68,68,.95],size:14,outline:{color:[255,255,255,1],width:2.5}}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.titulo`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[153,27,27,.95],haloSize:1.5,font:{family:`Arial, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]}],p={id:`minusca`,title:`Ortofoto / Ráster MINUSCA`,file:`data/rasters/minusca.png`,visible:!1,opacity:.9,extentWgs84:{xmin:12.0797893824399,ymin:-.0656952619086617,xmax:29.742398517321995,ymax:13.667457656027116},extent3857:{xmin:1344714.47,ymin:-7312.98,xmax:3310903.62,ymax:1535787.72}},m={bouar1:`assets/fotos/Bouar1.jpeg`,"bouar1.jpeg":`assets/fotos/Bouar1.jpeg`,"bouar1.jpg":`assets/fotos/Bouar1.jpeg`,bouar2:`assets/fotos/Bouar2.jpeg`,"bouar2.jpeg":`assets/fotos/Bouar2.jpeg`,"bouar2.jpg":`assets/fotos/Bouar2.jpeg`,kouki:`assets/fotos/Kouki.jpg`,"kouki.jpg":`assets/fotos/Kouki.jpg`,benzambe:`assets/fotos/Benzambe.jpg`,"benzambe.jpg":`assets/fotos/Benzambe.jpg`};function te(e){if(!e)return null;let t=String(e).trim();if(t.startsWith(`http://`)||t.startsWith(`https://`)||t.startsWith(`data:`))return t;if(t.startsWith(`foto.php`)||t.startsWith(`fotos/`))return`https://www.idep.gob.pe/seguimiento/api/${t}`;if(t.startsWith(`VAL-`))return`https://www.idep.gob.pe/seguimiento/api/foto.php?id=${t.replace(/\.jpg$/i,``)}`;let n=t.toLowerCase();return m[n]?m[n]:n.endsWith(`.jpg`)||n.endsWith(`.jpeg`)||n.endsWith(`.png`)||n.endsWith(`.webp`)?`assets/fotos/${t}`:`assets/fotos/${t}.jpg`}var h=null,g=null;function _({onCenterOnMap:e}={}){v(),y()}function v(){document.getElementById(`media-drawer`)||(h=document.createElement(`div`),h.id=`media-drawer`,h.className=`
    fixed top-0 right-0 h-full w-full sm:w-[440px] md:w-[480px] bg-slate-900/95 backdrop-blur-md
    text-slate-100 shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out
    flex flex-col border-l border-slate-700/60
  `,h.innerHTML=`
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
  `,document.body.appendChild(h),document.getElementById(`drawer-close-btn`).addEventListener(`click`,re),document.getElementById(`drawer-center-btn`).addEventListener(`click`,()=>{}),document.getElementById(`drawer-copy-coords-btn`).addEventListener(`click`,()=>{let e=document.getElementById(`drawer-coords-val`).textContent;navigator.clipboard.writeText(e).then(()=>{let e=document.getElementById(`copy-text`);e.textContent=`¡Copiado!`,setTimeout(()=>e.textContent=`Copiar`,2e3)})}))}function y(){document.getElementById(`media-lightbox`)||(g=document.createElement(`div`),g.id=`media-lightbox`,g.className=`
    fixed inset-0 z-[100] bg-black/90 backdrop-blur-md hidden flex items-center justify-center p-4
  `,g.innerHTML=`
    <div class="relative max-w-5xl max-h-full flex flex-col items-center">
      <img id="lightbox-img" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" src="" alt="Vista ampliada" />
      <p id="lightbox-caption" class="mt-3 text-sm text-slate-300 font-medium"></p>
      <button id="lightbox-close" class="absolute -top-10 right-0 text-white/80 hover:text-white p-2 text-2xl font-bold transition">
        ✕
      </button>
    </div>
  `,document.body.appendChild(g),document.getElementById(`lightbox-close`).addEventListener(`click`,b),g.addEventListener(`click`,e=>{e.target===g&&b()}))}function ne(e,t=``){let n=document.getElementById(`lightbox-img`),r=document.getElementById(`lightbox-caption`);n.src=e,r.textContent=t,g.classList.remove(`hidden`)}function b(){g&&g.classList.add(`hidden`)}function re(){if(h){h.classList.add(`translate-x-full`);let e=document.getElementById(`drawer-video`);e&&e.pause()}}var x=null,S=!0,C=`ing`,w={},T=[],E=null;function ie({onSelectFeature:e}={}){E=e,ae()}function D(e,t,n){w[e]={title:n||e,features:t||[]},oe(),k()}function ae(){document.getElementById(`bottom-attribute-table`)||(x=document.createElement(`div`),x.id=`bottom-attribute-table`,x.className=`
    fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/80
    text-slate-100 shadow-2xl transition-all duration-300 ease-in-out flex flex-col
  `,x.style.height=`42px`,x.innerHTML=`
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
  `,document.body.appendChild(x),document.getElementById(`table-handle`).addEventListener(`click`,e=>{e.target.closest(`input`)||e.target.closest(`#table-export-csv`)||O()}),document.getElementById(`table-search-input`).addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim(),n=document.getElementById(`table-search-clear`);t?n.classList.remove(`hidden`):n.classList.add(`hidden`),se(t)}),document.getElementById(`table-search-clear`).addEventListener(`click`,()=>{let e=document.getElementById(`table-search-input`);e.value=``,document.getElementById(`table-search-clear`).classList.add(`hidden`),se(``)}),document.getElementById(`table-export-csv`).addEventListener(`click`,ce))}function O(e){if(!x)return;S=e===void 0?!S:!e;let t=document.getElementById(`table-chevron`),n=document.getElementById(`table-body`);S?(x.style.height=`42px`,n.classList.add(`hidden`),t.classList.remove(`rotate-180`)):(x.style.height=`320px`,n.classList.remove(`hidden`),t.classList.add(`rotate-180`),k())}function oe(){let e=document.getElementById(`table-tabs`);if(!e)return;e.innerHTML=``;let t=Object.keys(w);t.length!==0&&(!w[C]&&t.length>0&&(C=t[0]),t.forEach(t=>{let n=w[t],r=document.createElement(`button`),i=t===C;r.className=`
      px-3 py-1.5 text-xs font-medium rounded-t-lg transition border-b-2
      ${i?`bg-slate-800 text-sky-400 border-sky-400 font-bold`:`text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900`}
    `,r.innerHTML=`${n.title} <span class="ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${i?`bg-sky-500/20 text-sky-300`:`bg-slate-800 text-slate-500`}">${n.features.length}</span>`,r.addEventListener(`click`,e=>{e.stopPropagation(),C=t,oe(),k()}),e.appendChild(r)}))}function k(){let e=document.getElementById(`table-content-rows`),t=document.getElementById(`table-record-count`);if(!e)return;let n=w[C];if(!n||!n.features){e.innerHTML=`<tr><td colspan="10" class="text-center py-6 text-slate-500">No hay datos disponibles para esta capa.</td></tr>`,t&&(t.textContent=`0 registros`);return}let r=document.getElementById(`table-header-row`);r&&(r.innerHTML=C===`live_submissions`?`
        <th class="py-2.5 px-3">#</th>
        <th class="py-2.5 px-3">Código</th>
        <th class="py-2.5 px-3">1. Jefe TOB</th>
        <th class="py-2.5 px-3">2. Teléfono</th>
        <th class="py-2.5 px-3">3. Lugar de Misión</th>
        <th class="py-2.5 px-3">4. Personal</th>
        <th class="py-2.5 px-3">5. Maquinaria</th>
        <th class="py-2.5 px-3">6. Ocurrencias</th>
        <th class="py-2.5 px-3 text-center">Foto</th>
        <th class="py-2.5 px-3 text-center">Acción</th>
      `:`
        <th class="py-2.5 px-3">#</th>
        <th class="py-2.5 px-3">Código</th>
        <th class="py-2.5 px-3">Lugar / Nombre</th>
        <th class="py-2.5 px-3">Sección</th>
        <th class="py-2.5 px-3">Tipo de Trabajo</th>
        <th class="py-2.5 px-3">Responsable</th>
        <th class="py-2.5 px-3">Fechas</th>
        <th class="py-2.5 px-3 text-center">Multimedia</th>
        <th class="py-2.5 px-3 text-center">Acción</th>
      `);let i=document.getElementById(`table-search-input`),a=i?i.value.toLowerCase().trim():``,o=n.features;a&&(o=o.filter(e=>{let t=e.properties||{};return Object.values(t).some(e=>e&&String(e).toLowerCase().includes(a))})),T=o,t&&(t.textContent=`${o.length} de ${n.features.length} registros`),o.length===0?e.innerHTML=`<tr><td colspan="10" class="text-center py-6 text-slate-500">Ningún registro coincide con el filtro.</td></tr>`:(e.innerHTML=``,o.forEach((t,n)=>{let r=t.properties||{},i=document.createElement(`tr`);if(i.className=`hover:bg-slate-800/60 cursor-pointer transition`,C===`live_submissions`){let e=r.CODIGO||r.codigo||`#${n+1}`,t=r.JEFE_TOB||r.jefe_tob||`-`,a=r.TELEFONO||r.telefono||`-`,o=r.LUGAR||r.lugar||`-`,s=r.PERSONAL||r.personal||r.persona||`-`,c=r.MAQUINARIA||r.maquinaria||`-`,l=r.OCURRENCIAS||r.ocurrencias||`-`,u=!!(r.FOTO||r.foto||r.foto_path||r.foto_base64);i.innerHTML=`
        <td class="py-2 px-3 text-slate-500">${n+1}</td>
        <td class="py-2 px-3 font-semibold text-rose-400 font-mono">${e}</td>
        <td class="py-2 px-3 text-white font-medium">${t}</td>
        <td class="py-2 px-3 text-emerald-400 font-mono">${a}</td>
        <td class="py-2 px-3 text-sky-300 font-semibold">${o}</td>
        <td class="py-2 px-3 text-slate-300">${s}</td>
        <td class="py-2 px-3 text-amber-300">${c}</td>
        <td class="py-2 px-3 text-slate-300 max-w-[200px] truncate" title="${l}">${l}</td>
        <td class="py-2 px-3 text-center">
          ${u?`<span class="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">📷 Foto</span>`:`<span class="text-slate-600 text-[10px]">--</span>`}
        </td>
        <td class="py-2 px-3 text-center">
          <button class="px-2 py-1 rounded bg-sky-600/30 hover:bg-sky-600 text-sky-300 hover:text-white text-xs font-semibold transition" title="Ver en el mapa">
            Ver
          </button>
        </td>
      `}else{let e=r.CODIGO||r.codigo||`#${n+1}`,t=r.NOMBRE||r.nombre||r.LUGAR||r.lugar||r.Name||r.name||r.adm1_name||r.adm2_name||`-`,a=r.SECCION||r.seccion||`-`,o=r.TIPO_TRAB||r.tipo_trab||r.ZONAS||`-`,s=r.RESPONSABLE||r.responsable||`-`,c=r.F_INICIO?`${r.F_INICIO} → ${r.F_TERMINO||`Actual`}`:r.fecha_envio||`-`,l=!!(r.FOTO||r.foto||r.FOTO_2||r.foto_2),u=!!(r.VIDEO||r.video);i.innerHTML=`
        <td class="py-2 px-3 text-slate-500">${n+1}</td>
        <td class="py-2 px-3 font-semibold text-sky-400">${e}</td>
        <td class="py-2 px-3 text-white font-medium">${t}</td>
        <td class="py-2 px-3 text-slate-300">${a}</td>
        <td class="py-2 px-3 text-slate-300 max-w-[200px] truncate" title="${o}">${o}</td>
        <td class="py-2 px-3 text-slate-400">${s}</td>
        <td class="py-2 px-3 text-slate-400">${c}</td>
        <td class="py-2 px-3 text-center">
          <div class="inline-flex items-center space-x-1.5">
            ${l?`<span title="Fotografía disponible" class="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">📷 Foto</span>`:``}
            ${u?`<span title="Video disponible" class="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30">🎬 Video</span>`:``}
            ${!l&&!u?`<span class="text-slate-600 text-[10px]">--</span>`:``}
          </div>
        </td>
        <td class="py-2 px-3 text-center">
          <button class="px-2 py-1 rounded bg-sky-600/30 hover:bg-sky-600 text-sky-300 hover:text-white text-xs font-semibold transition" title="Ver en el mapa">
            Ver
          </button>
        </td>
      `}i.addEventListener(`click`,()=>{E&&E(t)}),e.appendChild(i)}))}function se(){k()}function ce(){if(!T||T.length===0){alert(`No hay registros para exportar`);return}let e=T[0].properties||{},t=Object.keys(e),n=[];n.push(t.join(`,`)),T.forEach(e=>{let r=e.properties||{},i=t.map(e=>{let t=r[e];return t==null?`""`:`"${String(t).replace(/"/g,`""`)}"`});n.push(i.join(`,`))});let r=n.join(`\r
`),i=new Blob([r],{type:`text/csv;charset=utf-8;`}),a=URL.createObjectURL(i),o=document.createElement(`a`);o.setAttribute(`href`,a),o.setAttribute(`download`,`valkiria_${C}_${Date.now()}.csv`),document.body.appendChild(o),o.click(),document.body.removeChild(o)}var A=null,j={startDate:null,endDate:null,onlyMedia:!1,preset:`all`};function le({onFilterChange:e}={}){A=e,ue()}function ue(){let e=document.getElementById(`panel-date-filter-content`);if(!e)return;e.innerHTML=`
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
  `;let t=e.querySelector(`#filter-start-date`),n=e.querySelector(`#filter-end-date`),r=e.querySelector(`#filter-reset-btn`);t.addEventListener(`change`,()=>{j.startDate=t.value?new Date(t.value):null,j.preset=`custom`,M(`custom`),N()}),n.addEventListener(`change`,()=>{j.endDate=n.value?new Date(n.value+`T23:59:59`):null,j.preset=`custom`,M(`custom`),N()}),r.addEventListener(`click`,()=>{fe()}),e.querySelectorAll(`.preset-btn`).forEach(e=>{e.addEventListener(`click`,()=>{de(e.getAttribute(`data-preset`))})})}function M(e){let t=document.getElementById(`panel-date-filter-content`);t&&t.querySelectorAll(`.preset-btn`).forEach(t=>{t.className=t.getAttribute(`data-preset`)===e?`preset-btn px-2.5 py-1.5 rounded-lg bg-sky-500 text-white font-bold transition flex items-center justify-center space-x-1`:`preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center space-x-1`})}function de(e){let t=document.getElementById(`filter-start-date`),n=document.getElementById(`filter-end-date`);if(j.preset=e,M(e),e===`all`)j.startDate=null,j.endDate=null,j.onlyMedia=!1,t&&(t.value=``),n&&(n.value=``);else if(e===`2026`)j.startDate=new Date(`2026-01-01T00:00:00`),j.endDate=new Date(`2026-12-31T23:59:59`),j.onlyMedia=!1,t&&(t.value=`2026-01-01`),n&&(n.value=`2026-12-31`);else if(e===`month`){let e=new Date(`2026-11-10T10:00:00`),r=new Date(e.getFullYear(),e.getMonth(),1),i=new Date(e.getFullYear(),e.getMonth()+1,0,23,59,59);j.startDate=r,j.endDate=i,j.onlyMedia=!1,t&&(t.value=r.toISOString().split(`T`)[0]),n&&(n.value=i.toISOString().split(`T`)[0])}else e===`media`&&(j.startDate=null,j.endDate=null,j.onlyMedia=!0,t&&(t.value=``),n&&(n.value=``));N()}function fe(){de(`all`)}function N(){pe(),A&&A(j)}function pe(){let e=document.getElementById(`filter-status-badge`),t=document.getElementById(`nav-date-badge`),n=j.preset!==`all`||j.onlyMedia||j.startDate||j.endDate;e&&(n?(e.textContent=`Activo`,e.className=`text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold`):(e.textContent=`Sin filtros`,e.className=`text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400`)),t&&(n?t.classList.remove(`hidden`):t.classList.add(`hidden`))}function me(e){if(!e)return null;let t=String(e).trim();if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t)){let[e,n,r]=t.split(`/`).map(Number);return new Date(r,n-1,e)}let n=new Date(t);return isNaN(n.getTime())?null:n}function he(e){let t=e.properties||{};if(j.onlyMedia){let e=!!(t.FOTO||t.foto||t.FOTO_2||t.foto_2),n=!!(t.VIDEO||t.video);if(!e&&!n)return!1}if(!j.startDate&&!j.endDate)return!0;let n=t.F_INICIO||t.f_inicio||t.fecha_envio||t.timestamp||t.F_TERMINO||t.f_termino;if(!n)return!1;let r=me(n);return!(!r||j.startDate&&r<j.startDate||j.endDate&&r>j.endDate)}var ge=[{username:`hpichat`,passwordHash:`scooby2026`,role:`admin`,displayName:`H. Pichat`,email:`hpichat@idep.gob.pe`}],P=`valkiria_auth_session`;function _e(){try{let e=sessionStorage.getItem(P);return e?JSON.parse(e):null}catch{return null}}function F(e){let t=_e();t?e&&e(t):ve(e)}function ve(e){let t=document.getElementById(`tactical-auth-modal`);t&&t.remove();let n=document.createElement(`div`);n.id=`tactical-auth-modal`,n.className=`fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in`,n.innerHTML=`
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
  `,document.body.appendChild(n);let r=()=>n.remove();n.querySelector(`#auth-modal-close`).addEventListener(`click`,r),n.querySelector(`#auth-btn-cancel`).addEventListener(`click`,r);let i=n.querySelector(`#auth-login-form`),a=n.querySelector(`#auth-user`),o=n.querySelector(`#auth-pass`),s=n.querySelector(`#auth-error-msg`);setTimeout(()=>a.focus(),100),i.addEventListener(`submit`,t=>{t.preventDefault();let n=a.value.trim(),i=o.value.trim(),c=ge.find(e=>e.username.toLowerCase()===n.toLowerCase()&&e.passwordHash===i);if(c){let t={username:c.username,displayName:c.displayName,role:c.role,loginTime:new Date().toISOString()};sessionStorage.setItem(P,JSON.stringify(t)),I(`✓ Autenticado como ${c.displayName}`,`success`),r(),e&&e(t)}else s.textContent=`Usuario o contraseña incorrectos.`,s.classList.remove(`hidden`),o.value=``,o.focus()})}function I(e,t=`info`){let n=document.createElement(`div`);n.className=`fixed bottom-6 right-6 z-[120] ${t===`success`?`bg-emerald-600 border-emerald-500`:t===`danger`?`bg-rose-600 border-rose-500`:`bg-slate-800 border-slate-700`} text-white px-4 py-2.5 rounded-xl shadow-2xl border text-xs font-bold flex items-center space-x-2 transition-all duration-300`,n.textContent=e,document.body.appendChild(n),setTimeout(()=>{n.style.opacity=`0`,setTimeout(()=>n.remove(),300)},4e3)}var L=`https://www.idep.gob.pe/seguimiento/api/sync.php`;function R(e,{onPointUpdated:t,onPointDeleted:n,onClose:r}={}){let i=e.properties||{},a=e.layerId===`live_submissions`||!!(i.JEFE_TOB||i.jefe_tob),o=document.createElement(`div`);return o.className=`valkiria-compact-popup font-sans text-slate-100 select-text`,o.style.maxWidth=`360px`,o.style.minWidth=`320px`,o.style.fontSize=`13px`,o.style.lineHeight=`1.45`,a?ye(o,e,{onPointUpdated:t,onPointDeleted:n,onClose:r}):be(o,e,{onClose:r}),o}function ye(e,t,{onPointUpdated:n,onPointDeleted:r,onClose:i}){let a=t.properties||{},o=a.CODIGO||a.codigo||a.id||`VAL-CAMPO`,s=a.JEFE_TOB||a.jefe_tob||`-`,c=a.TELEFONO||a.telefono||`-`,l=a.LUGAR||a.lugar||a.lugar_mision||`Punto de Misión`,u=a.PERSONAL||a.personal||a.persona||`-`,d=a.MAQUINARIA||a.maquinaria||`-`,ee=a.OCURRENCIAS||a.ocurrencias||`-`,f=te(a.FOTO||a.foto||a.foto_path||a.foto_base64||o),p=a.DMS||a.dms||`-`,m=a.ALTITUD!==void 0&&a.ALTITUD!==null?`${Math.round(a.ALTITUD)} m`:`-`,h=a.PRECISION_M!==void 0&&a.PRECISION_M!==null?`±${Number(a.PRECISION_M).toFixed(1)}m`:`-`,g=a.FECHA||a.fecha||a.fecha_envio||`-`;e.innerHTML=`
    <div class="space-y-3">
      <!-- Barra Superior: ID, Botones de Acción y Botón Cerrar -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-700">
        <div class="flex items-center space-x-2">
          <span class="px-2 py-0.5 rounded text-xs font-black bg-rose-600 text-white tracking-wider shadow-sm">
            VALKIRIA
          </span>
          <span class="font-mono text-sm font-bold text-sky-300 truncate max-w-[130px]" title="${z(o)}">
            ${z(o)}
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
          <span class="font-extrabold text-white text-sm text-right leading-tight max-w-[200px] truncate" title="${z(s)}">
            ${z(s)}
          </span>
        </div>

        <!-- 2. Teléfono -->
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider shrink-0">2. Teléfono:</span>
          <span class="font-mono font-bold text-emerald-300 text-sm text-right">${z(c)}</span>
        </div>

        <!-- 3. Lugar de Misión -->
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider shrink-0">3. Lugar:</span>
          <span class="font-bold text-sky-300 text-sm text-right leading-tight max-w-[200px] truncate" title="${z(l)}">
            ${z(l)}
          </span>
        </div>

        <!-- 4. Personal -->
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider shrink-0">4. Personal:</span>
          <span class="font-semibold text-white text-sm text-right leading-tight max-w-[200px] truncate" title="${z(u)}">
            ${z(u)}
          </span>
        </div>

        <!-- 5. Maquinaria -->
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider shrink-0">5. Maquinaria:</span>
          <span class="font-bold text-amber-300 text-sm text-right leading-tight max-w-[200px] truncate" title="${z(d)}">
            ${z(d)}
          </span>
        </div>

        <!-- 6. Ocurrencias -->
        <div class="pt-1">
          <span class="text-slate-300 text-xs uppercase font-bold tracking-wider block mb-1">6. Ocurrencias:</span>
          <div class="text-white text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-700/80 max-h-24 overflow-y-auto custom-scrollbar leading-relaxed select-text">
            ${z(ee)}
          </div>
        </div>
      </div>

      <!-- 7. Evidencia Fotográfica -->
      ${f?`
        <div class="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-600 bg-black h-36 flex items-center justify-center shadow-inner" id="popup-photo-card">
          <img src="${f}" alt="Evidencia de campo" class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            onerror="this.onerror=null; this.src='https://www.idep.gob.pe/seguimiento/api/foto.php?id=${encodeURIComponent(o)}';" />
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="px-2.5 py-1 rounded bg-black/80 text-white text-xs font-bold border border-slate-600 shadow">🔍 Ampliar Foto</span>
          </div>
        </div>
      `:``}

      <!-- Telemetría GPS -->
      <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-700 font-mono text-xs text-slate-200 space-y-1">
        <div class="flex justify-between">
          <span class="text-slate-400">DMS:</span>
          <span class="text-sky-300 font-semibold">${z(p)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Altitud / Precisión:</span>
          <span class="text-emerald-300 font-semibold">${z(m)} | ${z(h)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Fecha:</span>
          <span class="text-slate-300">${z(g)}</span>
        </div>
      </div>
    </div>
  `;let _=e.querySelector(`#popup-btn-close`);_&&i&&_.addEventListener(`click`,e=>{e.stopPropagation(),i()});let v=e.querySelector(`#popup-photo-card`);v&&f&&v.addEventListener(`click`,()=>{ne(f,`Reporte ${o} - ${l}`)});let y=e.querySelector(`#popup-btn-edit`);y&&y.addEventListener(`click`,e=>{e.stopPropagation(),F(()=>{xe(t,n)})});let b=e.querySelector(`#popup-btn-delete`);b&&b.addEventListener(`click`,e=>{e.stopPropagation(),F(()=>{Se(o,t,r)})})}function be(e,t,{onClose:n}={}){let r=t.properties||{},i=t.category||`ELEMENTO`,a=r.NOMBRE||r.nombre||r.LUGAR||r.Name||r.adm1_name||r.adm2_name||`Geometría`,o=``,s=[`OBJECTID`,`FID`,`Shape__Area`,`Shape__Length`,`CODIGO`,`NOMBRE`,`LUGAR`,`category`,`layerId`];Object.keys(r).forEach(e=>{if(s.includes(e))return;let t=r[e];t!=null&&String(t).trim()!==``&&(o+=`
        <div class="flex justify-between py-1 border-b border-slate-800 last:border-0 gap-2">
          <span class="text-slate-300 text-xs font-semibold truncate max-w-[130px]">${z(e)}:</span>
          <span class="text-white text-xs font-bold text-right truncate max-w-[190px]">${z(String(t))}</span>
        </div>
      `)}),e.innerHTML=`
    <div class="space-y-3">
      <div class="flex items-center justify-between pb-2 border-b border-slate-700">
        <span class="px-2 py-0.5 rounded text-xs font-extrabold bg-sky-600 text-white shadow-sm">
          ${z(i)}
        </span>
        <h4 class="font-bold text-white text-sm truncate max-w-[200px]" title="${z(a)}">
          ${z(a)}
        </h4>
        <button type="button" id="popup-btn-close-gen" class="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center transition border border-slate-600 ml-1" title="Cerrar ventana">
          ✕
        </button>
      </div>

      <div class="bg-slate-950 p-3 rounded-xl border border-slate-700 max-h-56 overflow-y-auto custom-scrollbar space-y-1">
        ${o||`<span class="text-slate-400 text-xs">Sin atributos adicionales.</span>`}
      </div>
    </div>
  `;let c=e.querySelector(`#popup-btn-close-gen`);c&&n&&c.addEventListener(`click`,e=>{e.stopPropagation(),n()})}function xe(e,t){let n=document.getElementById(`tactical-edit-modal`);n&&n.remove();let r=e.properties||{},i=r.CODIGO||r.codigo||r.id,a=document.createElement(`div`);a.id=`tactical-edit-modal`,a.className=`fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in`,a.innerHTML=`
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
            <h3 class="text-sm font-bold uppercase tracking-wider text-white">Editar Reporte ${z(i)}</h3>
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
            <input id="edit-jefe" type="text" value="${z(r.JEFE_TOB||r.jefe_tob||``)}" required
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-semibold text-sm focus:border-sky-400 focus:outline-none"/>
          </div>
          <div>
            <label class="block text-slate-200 font-bold mb-1">2. Teléfono:</label>
            <input id="edit-tel" type="text" value="${z(r.TELEFONO||r.telefono||``)}" required
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono text-sm focus:border-sky-400 focus:outline-none"/>
          </div>
        </div>

        <div>
          <label class="block text-slate-200 font-bold mb-1">3. Lugar de Misión:</label>
          <input id="edit-lugar" type="text" value="${z(r.LUGAR||r.lugar||``)}" required
            class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-semibold text-sm focus:border-sky-400 focus:outline-none"/>
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          <div>
            <label class="block text-slate-200 font-bold mb-1">4. Personal:</label>
            <input id="edit-pers" type="text" value="${z(r.PERSONAL||r.personal||``)}" required
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-semibold text-sm focus:border-sky-400 focus:outline-none"/>
          </div>
          <div>
            <label class="block text-slate-200 font-bold mb-1">5. Maquinaria:</label>
            <input id="edit-maq" type="text" value="${z(r.MAQUINARIA||r.maquinaria||``)}" required
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-semibold text-sm focus:border-sky-400 focus:outline-none"/>
          </div>
        </div>

        <div>
          <label class="block text-slate-200 font-bold mb-1">6. Ocurrencias:</label>
          <textarea id="edit-ocurr" rows="3" required
            class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:border-sky-400 focus:outline-none leading-relaxed">${z(r.OCURRENCIAS||r.ocurrencias||``)}</textarea>
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
  `,document.body.appendChild(a);let o=()=>a.remove();a.querySelector(`#edit-modal-close`).addEventListener(`click`,o),a.querySelector(`#edit-btn-cancel`).addEventListener(`click`,o),a.querySelector(`#edit-point-form`).addEventListener(`submit`,async e=>{e.preventDefault();let n=a.querySelector(`#edit-btn-submit`);n.disabled=!0,n.textContent=`Guardando...`;let r={action:`update`,id:i,jefe_tob:a.querySelector(`#edit-jefe`).value.trim(),telefono:a.querySelector(`#edit-tel`).value.trim(),lugar_mision:a.querySelector(`#edit-lugar`).value.trim(),personal:a.querySelector(`#edit-pers`).value.trim(),maquinaria:a.querySelector(`#edit-maq`).value.trim(),ocurrencias:a.querySelector(`#edit-ocurr`).value.trim()};try{let e=await fetch(L,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(r)}),n=await e.json().catch(()=>({}));if(!e.ok||n.success===!1)throw Error(n.message||`HTTP ${e.status}`);I(`✓ Reporte ${i} actualizado en producción`,`success`),o(),t&&t(i,r)}catch(e){console.error(`Error al actualizar:`,e),I(`Error al guardar: ${e.message}`,`danger`),n.disabled=!1,n.textContent=`Guardar Cambios`}})}function Se(e,t,n){let r=document.getElementById(`tactical-delete-modal`);r&&r.remove();let i=document.createElement(`div`);i.id=`tactical-delete-modal`,i.className=`fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in`,i.innerHTML=`
    <div class="bg-slate-900 border border-rose-500/50 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
      <div class="p-5 text-center space-y-3">
        <div class="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/40">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-base font-bold text-white">¿Eliminar punto de misión?</h3>
        <p class="text-xs text-slate-300">
          Esta acción eliminará de forma irreversible el reporte <strong class="text-rose-400 font-mono">${z(e)}</strong> de la base de datos de producción y del mapa.
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
  `,document.body.appendChild(i);let a=()=>i.remove();i.querySelector(`#delete-btn-cancel`).addEventListener(`click`,a);let o=i.querySelector(`#delete-btn-confirm`);o.addEventListener(`click`,async()=>{o.disabled=!0,o.textContent=`Eliminando...`;try{let t=await fetch(L,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`delete`,id:e})}),r=await t.json().catch(()=>({}));if(!t.ok||r.success===!1)throw Error(r.message||`HTTP ${t.status}`);I(`✓ Reporte ${e} eliminado del servidor`,`success`),a(),n&&n(e)}catch(e){console.error(`Error al eliminar:`,e),I(`Error al eliminar: ${e.message}`,`danger`),o.disabled=!1,o.textContent=`Sí, Eliminar`}})}function z(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var B=null,V=null,H={},U={},W=null,G=null,K=null;async function Ce(n=`viewDiv`){B=new e({basemap:`satellite`}),V=new t({container:n,map:B,center:[18.6,6.6],zoom:6.8,popupEnabled:!1,ui:{components:[`zoom`,`compass`]}}),await V.when(),V.popup&&(V.popup.dockOptions={buttonEnabled:!1,breakpoint:!1},V.popup.visibleElements={closeButton:!1});let r=new d({view:V});V.ui.add(r,`top-left`);let i=new ee({view:V});V.ui.add(i,`top-left`);let a=new u({view:V,unit:`metric`});return V.ui.add(a,`bottom-left`),await Ee(),we(),G=new l({id:`live_submissions`,title:`Reportes de Campo`,visible:!0}),B.add(G),U.live_submissions=G,K=new l({title:`Highlight Selection`,listMode:`hide`}),B.add(K),De(),{map:B,view:V,layerInstances:U,minuscaLayer:W,zoomToMinusca:Te,zoomToFieldReports:Me}}function we(){try{let e=p.extent3857,t=new URL(p.file,window.location.href).href,n=new i({image:t,georeference:new a({extent:new o({xmin:e.xmin,ymin:e.ymin,xmax:e.xmax,ymax:e.ymax,spatialReference:{wkid:3857}})})});W=new r({id:p.id,title:p.title,source:[n],visible:p.visible,opacity:p.opacity});let s=B.layers.findIndex(e=>e.id===`zonas`);s>=0?B.add(W,s+1):B.add(W,0),W.load().then(()=>{console.log(`✓ Ortofoto Ráster MINUSCA cargada y lista en MediaLayer.`)}).catch(e=>{console.warn(`Aviso cargando MediaLayer MINUSCA:`,e)})}catch(e){console.error(`Error al inicializar la capa ráster MINUSCA:`,e)}}function Te(){if(!V)return;let e=p.extent3857;if(W&&!W.visible){W.visible=!0;let e=document.getElementById(`layer-chk-minusca`);e&&(e.checked=!0)}V.goTo({target:new o({xmin:e.xmin,ymin:e.ymin,xmax:e.xmax,ymax:e.ymax,spatialReference:{wkid:3857}})},{duration:1e3})}async function Ee(){for(let e of f)if(e.file)try{let t=await(await fetch(e.file)).json();H[e.id]=t;let r=new Blob([JSON.stringify(t)],{type:`application/json`}),i=URL.createObjectURL(r),a={id:e.id,title:e.title,url:i,visible:e.visible,renderer:e.renderer,outFields:[`*`]};e.labelingInfo&&(a.labelingInfo=e.labelingInfo);let o=new n(a);B.add(o),U[e.id]=o,t.features&&t.features.length>0&&D(e.id,t.features,e.title)}catch(t){console.warn(`Error al cargar capa ${e.id}:`,t)}}function De(){V.on(`click`,async e=>{try{let t=await V.hitTest(e);if(!t||!t.results||t.results.length===0){V.popup&&V.popup.close(),K&&K.removeAll();return}let n=t.results.filter(e=>{let t=e.layer||e.graphic&&e.graphic.layer;return t&&t!==K});if(n.length===0){V.popup&&V.popup.close(),K&&K.removeAll();return}n.sort((e,t)=>{let n=e.graphic&&e.graphic.geometry?e.graphic.geometry.type:``,r=t.graphic&&t.graphic.geometry?t.graphic.geometry.type:``;if(n===`point`&&r!==`point`)return-1;if(r===`point`&&n!==`point`)return 1;let i=e.layer||e.graphic&&e.graphic.layer,a=t.layer||t.graphic&&t.graphic.layer,o=i&&i.id||``,s=a&&a.id||``,c=o===`live_submissions`||o===`ing`||o===`kouki`||o===`benzambe`,l=s===`live_submissions`||s===`ing`||s===`kouki`||s===`benzambe`;return c&&!l?-1:!c&&l?1:0});let r=n[0],i=r.graphic,a=r.layer||i&&i.layer,o=a?a.id:``,s=f.find(e=>e.id===o)||{},c={properties:i.attributes||{},geometry:i.geometry,category:s.category||(i.geometry&&i.geometry.type===`point`?`PUNTO OPERATIVO`:`POLÍGONO`),layerId:o};Oe(i.geometry);let l=R(c,{onPointUpdated:q,onPointDeleted:J,onClose:()=>{V.popup&&V.popup.close(),K&&K.removeAll()}});V.popup.open({location:e.mapPoint||i.geometry,content:l})}catch(e){console.error(`Error al procesar clic en el mapa:`,e)}})}function Oe(e){if(!K||(K.removeAll(),!e))return;let t=null;t=e.type===`point`?{type:`simple-marker`,style:`circle`,color:[0,255,255,0],size:32,outline:{color:[0,255,255,1],width:3}}:{type:`simple-fill`,color:[0,255,255,.25],outline:{color:[0,255,255,1],width:3}},K.add(new c({geometry:e,symbol:t}))}function ke(e){if(!V||!e)return;let t=null;if(e.geometry&&e.geometry.type===`Point`&&e.geometry.coordinates){let[n,r]=e.geometry.coordinates;t=new s({longitude:n,latitude:r}),V.goTo({target:t,zoom:15},{duration:800})}else if(e.geometry&&e.geometry.latitude)t=e.geometry,V.goTo({target:t,zoom:15},{duration:800});else if(e.geometry&&e.geometry.coordinates){let n=e.geometry.coordinates[0];if(n&&n.length>0){let[e,r]=n[0];t=new s({longitude:e,latitude:r}),V.goTo({target:t,zoom:13},{duration:800})}}if(t){Oe(t);let n=R(e,{onPointUpdated:q,onPointDeleted:J,onClose:()=>{V.popup&&V.popup.close(),K&&K.removeAll()}});V.popup.open({location:t,content:n})}}function q(e,t){if(!G)return;G.graphics.forEach(n=>{n.attributes&&(n.attributes.CODIGO===e||n.attributes.id===e)&&(t.jefe_tob&&(n.attributes.JEFE_TOB=t.jefe_tob),t.telefono&&(n.attributes.TELEFONO=t.telefono),t.lugar_mision&&(n.attributes.LUGAR=t.lugar_mision,n.symbol&&n.symbol.type===`text`&&(n.symbol.text=t.lugar_mision)),t.personal&&(n.attributes.PERSONAL=t.personal),t.maquinaria&&(n.attributes.MAQUINARIA=t.maquinaria),t.ocurrencias&&(n.attributes.OCURRENCIAS=t.ocurrencias))});let n=H.live_submissions;if(n&&n.features){let r=n.features.find(t=>t.properties&&(t.properties.CODIGO===e||t.properties.id===e));r&&r.properties&&(t.jefe_tob&&(r.properties.JEFE_TOB=t.jefe_tob),t.telefono&&(r.properties.TELEFONO=t.telefono),t.lugar_mision&&(r.properties.LUGAR=t.lugar_mision),t.personal&&(r.properties.PERSONAL=t.personal),t.maquinaria&&(r.properties.MAQUINARIA=t.maquinaria),t.ocurrencias&&(r.properties.OCURRENCIAS=t.ocurrencias)),D(`live_submissions`,n.features,`Reportes de Campo`)}if(V&&V.popup&&V.popup.visible){let t=G.graphics.find(t=>t.attributes&&(t.attributes.CODIGO===e||t.attributes.id===e));if(t){let e=R({properties:t.attributes,geometry:t.geometry,category:`REPORTE DE CAMPO`,layerId:`live_submissions`},{onPointUpdated:q,onPointDeleted:J,onClose:()=>{V.popup&&V.popup.close(),K&&K.removeAll()}});V.popup.content=e}}}function J(e){if(!G)return;let t=[];G.graphics.forEach(n=>{n.attributes&&(n.attributes.CODIGO===e||n.attributes.id===e)&&t.push(n)}),t.forEach(e=>G.remove(e)),V&&V.popup&&V.popup.visible&&V.popup.close(),K&&K.removeAll();let n=H.live_submissions;n&&n.features&&(n.features=n.features.filter(t=>t.properties&&t.properties.CODIGO!==e&&t.properties.id!==e),H.live_submissions=n,D(`live_submissions`,n.features,`Reportes de Campo`)),V&&V.popup&&V.closePopup()}function Ae(){Object.keys(H).forEach(e=>{let t=H[e];if(!t||!t.features)return;let n=t.features.filter(e=>he(e)),r=f.find(t=>t.id===e);D(e,n,r?r.title:e);let i=U[e];if(e===`live_submissions`&&G)G.removeAll(),n.forEach(e=>{let t=e.properties||{},n=e.geometry&&e.geometry.coordinates?e.geometry.coordinates:null;if(!n)return;let[r,i]=n,a=new s({longitude:r,latitude:i}),o=new c({geometry:a,symbol:{type:`simple-marker`,style:`circle`,color:[239,68,68,.95],size:18,outline:{color:[255,255,255,1],width:2.5}},attributes:t}),l=new c({geometry:a,symbol:{type:`text`,color:[255,255,255,1],haloColor:[153,27,27,.95],haloSize:2,text:t.LUGAR||t.CODIGO||`Punto Valkiria`,font:{size:10,weight:`bold`,family:`Arial, sans-serif`},yoffset:15},attributes:t});G.addMany([o,l])});else if(i&&typeof i.refresh==`function`){let e=new Blob([JSON.stringify({type:`FeatureCollection`,features:n})],{type:`application/json`});i.url=URL.createObjectURL(e),i.refresh()}})}function je(e){if(!G||!e.coordinates)return;let[t,n]=e.coordinates,r=new s({longitude:t,latitude:n}),i={type:`simple-marker`,style:`circle`,color:[239,68,68,.95],size:18,outline:{color:[255,255,255,1],width:2.5}},a={CODIGO:e.codigo||e.id,NOMBRE:e.nombre,LUGAR:e.lugar,SECCION:e.seccion||`Reporte de Campo`,TIPO_TRAB:e.tipo_trab,TASK_ORDER:e.task_order,RESPONSABLE:e.responsable,DESCRIPCION:e.descripcion,RECURSOS:e.recursos,F_INICIO:e.f_inicio,F_TERMINO:e.f_termino,FOTO:e.foto,FOTO_2:e.foto_2,VIDEO:e.video,JEFE_TOB:e.jefe_tob,TELEFONO:e.telefono,PERSONAL:e.personal,MAQUINARIA:e.maquinaria,OCURRENCIAS:e.ocurrencias,ALTITUD:e.altitud,PRECISION_M:e.precision_m,DMS:e.dms,FECHA:e.fecha_envio,fecha_envio:e.fecha_envio||new Date().toISOString()},o=new c({geometry:r,symbol:i,attributes:a}),l=new c({geometry:r,symbol:{type:`text`,color:[255,255,255,1],haloColor:[153,27,27,.95],haloSize:2,text:e.lugar||e.codigo||`Punto Valkiria`,font:{size:10,weight:`bold`,family:`Arial, sans-serif`},yoffset:15},attributes:a});G.addMany([o,l]);let u={type:`Feature`,geometry:{type:`Point`,coordinates:[t,n]},properties:a,category:`REPORTE DE CAMPO`},d=H.live_submissions||{features:[]};return d.features.push(u),H.live_submissions=d,D(`live_submissions`,d.features,`Reportes de Campo`),o}function Me(){if(!V||!G||G.graphics.length===0)return!1;let e=G.graphics.filter(e=>e.geometry&&e.geometry.type===`point`);if(e.length===0)return!1;let t=e.filter(e=>e.symbol&&e.symbol.type===`simple-marker`),n=t.length>0?t:e;if(n.length===1)return V.goTo({target:n.getItemAt(0).geometry,zoom:16},{duration:1e3}),!0;let r=1/0,i=1/0,a=-1/0,s=-1/0;if(n.forEach(e=>{let t=e.geometry.longitude===void 0?e.geometry.x:e.geometry.longitude,n=e.geometry.latitude===void 0?e.geometry.y:e.geometry.latitude;t<r&&(r=t),t>a&&(a=t),n<i&&(i=n),n>s&&(s=n)}),Math.abs(a-r)<2e-4&&Math.abs(s-i)<2e-4)return V.goTo({target:n.getItemAt(0).geometry,zoom:16},{duration:1e3}),!0;let c=new o({xmin:r,ymin:i,xmax:a,ymax:s,spatialReference:{wkid:4326}});return V.goTo(c.expand(1.6),{duration:1e3}),!0}var Y=null,X={},Z=null,Ne=`satellite`,Pe=[{id:`satellite`,name:`Satelital (Imágenes Puras)`,desc:`Imágenes aéreas puras de alta resolución sin etiquetas superpuestas`,thumb:`https://www.arcgis.com/sharing/rest/content/items/86de95d4e0244cba80f0fa28b1cc2463/info/thumbnail/thumbnail1591224931210.jpeg`},{id:`hybrid`,name:`Satelital Híbrido`,desc:`Imágenes satelitales globales con nombres de lugares y red vial`,thumb:`https://www.arcgis.com/sharing/rest/content/items/10df2279f9684e4a9f6a7f08febac2a9/info/thumbnail/thumbnail1584118328636.jpeg`},{id:`topo-vector`,name:`Topográfico Esri`,desc:`Curvas de nivel, relieve sombreado y referencias geográficas`,thumb:`https://www.arcgis.com/sharing/rest/content/items/7dc6cea0b7a34a1996b9e6ff22625ec0/info/thumbnail/topo_thumb_b2.jpg`},{id:`streets-vector`,name:`Calles & Vías`,desc:`Red vial completa, carreteras y asentamientos urbanos`,thumb:`https://www.arcgis.com/sharing/rest/content/items/4f3582e9e1444747ba6b8b09ff8e869f/info/thumbnail/world_street_map.jpg`},{id:`osm`,name:`OpenStreetMap`,desc:`Cartografía comunitaria abierta y detallada`,thumb:`https://www.arcgis.com/sharing/rest/content/items/5d2bfa736f8448b3a114380585b9e823/info/thumbnail/tem_osm.jpg`},{id:`dark-gray-vector`,name:`Modo Táctico Oscuro`,desc:`Contraste óptimo para operaciones nocturnas`,thumb:`https://www.arcgis.com/sharing/rest/content/items/4e43282276554e198bfa49c3de2f0672/info/thumbnail/thumbnail1562947137837.jpeg`}];function Fe({map:e,view:t,layerInstances:n,minuscaLayer:r,onMinuscaZoom:i,onFieldReportsZoom:a}){Y=e,X=n,Z=r,Ie(i),Q(),ze(i,a),Be()}function Ie(e){[{btnId:`nav-layers-btn`,panelId:`panel-layers`},{btnId:`nav-basemap-btn`,panelId:`panel-basemap`},{btnId:`nav-legend-btn`,panelId:`panel-legend`},{btnId:`nav-date-btn`,panelId:`panel-date-filter`}].forEach(({btnId:e,panelId:t})=>{let n=document.getElementById(e);n&&n.addEventListener(`click`,n=>{n.stopPropagation(),Le(t,e)})})}function Le(e,t){let n=document.getElementById(e);if(n){if(!n.classList.contains(`hidden`))Re();else if(Re(),n.classList.remove(`hidden`),t){let e=document.getElementById(t);e&&(e.classList.add(`bg-sky-600`,`text-white`,`border-sky-400`,`shadow-sky-500/30`),e.classList.remove(`bg-slate-800`,`text-slate-200`,`border-slate-700`))}}}function Re(){document.querySelectorAll(`.tactical-panel`).forEach(e=>e.classList.add(`hidden`)),document.querySelectorAll(`.nav-tool-btn`).forEach(e=>{e.id!==`nav-toggle-table`&&(e.classList.remove(`bg-sky-600`,`text-white`,`border-sky-400`,`shadow-sky-500/30`),e.classList.add(`bg-slate-800`,`text-slate-200`,`border-slate-700`))})}function Q(){let e=document.getElementById(`basemap-grid`);e&&(e.innerHTML=``,Pe.forEach(t=>{let n=document.createElement(`div`),r=t.id===Ne;n.className=`
      cursor-pointer rounded-xl p-2.5 border transition flex items-center space-x-3
      ${r?`bg-sky-950/80 border-sky-400 shadow-md shadow-sky-950 ring-1 ring-sky-400/50`:`bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800`}
    `,n.innerHTML=`
      <img src="${t.thumb}" alt="${t.name}" class="w-14 h-14 object-cover rounded-lg border border-slate-700 shadow flex-shrink-0" onerror="this.src='https://via.placeholder.com/60?text=MAP';"/>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold text-white truncate">${t.name}</h4>
          ${r?`<span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>`:``}
        </div>
        <p class="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">${t.desc}</p>
      </div>
    `,n.addEventListener(`click`,()=>{Y&&(Y.basemap=t.id,Ne=t.id,Q())}),e.appendChild(n)}))}function ze(e,t){let n=document.getElementById(`layers-tree`);if(!n)return;n.innerHTML=``;let r=document.createElement(`div`);r.className=`p-3 bg-slate-950/70 border border-emerald-500/40 rounded-xl space-y-2 mb-3 shadow-inner`,r.innerHTML=`
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
  `,n.appendChild(r);let i=r.querySelector(`#layer-chk-minusca`);Z&&(i.checked=Z.visible),i.addEventListener(`change`,()=>{Z&&(Z.visible=i.checked)}),r.querySelector(`#minusca-zoom-btn`).addEventListener(`click`,()=>{e&&e()});let a=r.querySelector(`#minusca-opacity`),o=r.querySelector(`#minusca-opacity-val`);a.addEventListener(`input`,()=>{let e=parseFloat(a.value);o.textContent=`${Math.round(e*100)}%`,Z&&(Z.opacity=e)}),[{name:`TRABAJOS REALIZADOS`,layers:f.filter(e=>e.group.includes(`TRABAJOS REALIZADOS`))},{name:`ELEMENTOS DE INTERES`,layers:f.filter(e=>e.group===`ELEMENTOS DE INTERES`)},{name:`LIMITES ADMINISTRATIVOS`,layers:f.filter(e=>e.group===`LIMITES ADMINISTRATIVOS`)}].forEach(e=>{let r=document.createElement(`div`);r.className=`space-y-1 mb-2.5`,r.innerHTML=`
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800 flex items-center justify-between">
        <span>${e.name}</span>
        <span class="text-slate-500 font-normal">(${e.layers.length})</span>
      </div>
      <div class="space-y-1 pt-1"></div>
    `;let i=r.querySelector(`.space-y-1`);e.layers.forEach(e=>{let n=document.createElement(`div`);n.className=`flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-800/60 transition text-xs`;let r=X[e.id],a=r?r.visible:e.visible,o=``;if(e.renderer&&e.renderer.symbol&&e.renderer.symbol.url)o=`<img src="${e.renderer.symbol.url}" class="w-4 h-4 object-contain inline-block mr-1.5" />`;else if(e.renderer&&e.renderer.symbol&&e.renderer.symbol.color){let t=e.renderer.symbol.color;o=`<span class="w-3.5 h-3.5 rounded border border-white/50 inline-block mr-1.5" style="background-color: ${`rgba(${t[0]}, ${t[1]}, ${t[2]}, 0.8)`}"></span>`}else o=`<span class="w-3 h-3 rounded-full bg-sky-400 inline-block mr-1.5"></span>`;let s=``;if(e.id===`live_submissions`&&(s=`
          <button type="button" class="field-reports-zoom-btn text-[10px] px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 hover:bg-rose-900 transition flex items-center space-x-1 flex-shrink-0 ml-1" title="Centrar mapa en los puntos de campo de Valkiria">
            <svg class="w-3 h-3 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <span>Ver Puntos</span>
          </button>
        `),n.innerHTML=`
        <label class="flex items-center space-x-2 cursor-pointer flex-1 truncate select-none">
          <input type="checkbox" data-layer-id="${e.id}" ${a?`checked`:``} class="w-3.5 h-3.5 text-sky-500 rounded bg-slate-800 border-slate-600 focus:ring-sky-500 cursor-pointer" />
          <div class="flex items-center truncate">
            ${o}
            <span class="text-slate-200 truncate">${e.title}</span>
          </div>
        </label>
        ${s}
      `,e.id===`live_submissions`){let e=n.querySelector(`.field-reports-zoom-btn`);e&&e.addEventListener(`click`,e=>{e.stopPropagation(),t&&t()})}let c=n.querySelector(`input`);c.addEventListener(`change`,()=>{let t=X[e.id];t&&(t.visible=c.checked),Be()}),i.appendChild(n)}),n.appendChild(r)})}function Be(){let e=document.getElementById(`legend-items`);if(e){if(e.innerHTML=``,Z&&Z.visible){let t=document.createElement(`div`);t.className=`flex items-center space-x-2.5 py-1 text-xs border-b border-slate-800/80 pb-2`,t.innerHTML=`
      <span class="w-5 h-5 rounded border border-emerald-500 bg-emerald-500/30 flex items-center justify-center text-[10px]">🗺️</span>
      <div>
        <div class="text-slate-200 font-bold">Ortofoto / Ráster MINUSCA</div>
        <div class="text-[10px] text-slate-400">Imagen de referencia operativa RCA</div>
      </div>
    `,e.appendChild(t)}f.forEach(t=>{let n=X[t.id];if(n&&!n.visible)return;let r=document.createElement(`div`);r.className=`flex items-start space-x-2.5 py-1.5 text-xs border-b border-slate-800/60 last:border-0`;let i=``;if(t.renderer&&t.renderer.symbol&&t.renderer.symbol.url)i=`<img src="${t.renderer.symbol.url}" class="w-6 h-6 object-contain flex-shrink-0" />`;else if(t.renderer&&t.renderer.type===`unique-value`)i=`
        <div class="flex flex-col space-y-1">
          <div class="flex items-center space-x-1"><span class="w-3.5 h-3 rounded" style="background:#ffebbe; border:1px solid #333;"></span><span class="text-[10px] text-slate-300">CENTER</span></div>
          <div class="flex items-center space-x-1"><span class="w-3.5 h-3 rounded" style="background:#bed2ff; border:1px solid #333;"></span><span class="text-[10px] text-slate-300">EAST</span></div>
          <div class="flex items-center space-x-1"><span class="w-3.5 h-3 rounded" style="background:#e8beff; border:1px solid #333;"></span><span class="text-[10px] text-slate-300">WEST</span></div>
        </div>
      `;else if(t.renderer&&t.renderer.symbol&&t.renderer.symbol.style===`diagonal-cross`)i=`<div class="w-5 h-5 border-2 border-red-600 bg-red-600/30 flex-shrink-0" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,0,0,0.5) 2px, rgba(255,0,0,0.5) 4px);"></div>`;else if(t.renderer&&t.renderer.symbol&&t.renderer.symbol.outline){let e=t.renderer.symbol.outline.color,n=t.renderer.symbol.outline.width||2;i=`<div class="w-5 h-5 flex-shrink-0 border-${n} rounded" style="border-color: rgba(${e[0]}, ${e[1]}, ${e[2]}, 1); border-width: ${n}px;"></div>`}else i=`<span class="w-4 h-4 rounded-full bg-sky-400 flex-shrink-0"></span>`;r.innerHTML=`
      <div class="pt-0.5">${i}</div>
      <div class="flex-1">
        <div class="text-slate-200 font-semibold">${t.title}</div>
        <div class="text-[10px] text-slate-400">${t.group}</div>
      </div>
    `,e.appendChild(r)}),e.children.length===0&&(e.innerHTML=`<p class="text-xs text-slate-500 py-4 text-center">No hay capas visibles actualmente.</p>`)}}async function Ve(){let e=!1,t=0;try{let n=await fetch(`https://www.idep.gob.pe/seguimiento/api/puntos.php?t=`+Date.now());if(n.ok){let r=await n.json();r.features&&r.features.length>0&&(He(r.features,`Valkiria Móvil (Producción)`),e=!0,t=r.features.length)}}catch(e){console.log(`No se pudo conectar al endpoint en vivo de IDEP`,e)}if(!e)try{let e=await fetch(`data/layers/valkiria_campo.geojson?t=`+Date.now());if(e.ok){let n=await e.json();n.features&&n.features.length>0&&(He(n.features,`Valkiria APK (Local)`),t=n.features.length)}}catch(e){console.log(`No se encontraron puntos previos en valkiria_campo.geojson`,e)}t>0&&Ge(`✓ ${t} reporte(s) de Valkiria sincronizados`,`Ver en Mapa`,()=>Me()),Ue()}function He(e,t){e.forEach(e=>{let n=e.properties||{};je({id:n.CODIGO,codigo:n.CODIGO,lugar:n.LUGAR||`Punto de Misión`,nombre:`${n.JEFE_TOB||`TOB`} - ${n.PERSONAL||`Personal`}`,seccion:`TOB: ${n.JEFE_TOB||`Sin asignar`} | Tel: ${n.TELEFONO||`S/N`}`,tipo_trab:n.MAQUINARIA||`Operativo`,responsable:n.JEFE_TOB,descripcion:n.OCURRENCIAS||``,coordinates:e.geometry.coordinates,foto:n.FOTO||null,f_inicio:n.FECHA?n.FECHA.split(` `)[0]:``,origen:t,fecha_envio:n.FECHA,jefe_tob:n.JEFE_TOB,telefono:n.TELEFONO,personal:n.PERSONAL,maquinaria:n.MAQUINARIA,ocurrencias:n.OCURRENCIAS,altitud:n.ALTITUD,precision_m:n.PRECISION_M,dms:n.DMS})})}function Ue(){if(document.getElementById(`apk-simulator-modal`))return;let e=document.createElement(`div`);e.id=`apk-simulator-modal`,e.className=`
    fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4
  `,e.innerHTML=`
    <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-100">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div class="flex items-center space-x-2">
          <span class="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </span>
          <div>
            <h3 class="text-sm font-bold text-white">Simulador de Envío desde APK Android</h3>
            <p class="text-[11px] text-slate-400">Prueba el flujo de ingesta de coordenadas, fotos y videos</p>
          </div>
        </div>
        <button id="sim-close-btn" class="text-slate-400 hover:text-white p-1 text-lg">✕</button>
      </div>

      <!-- Form Body -->
      <form id="sim-form" class="p-5 space-y-3.5 text-xs overflow-y-auto max-h-[75vh]">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 font-semibold mb-1">Código de Obra:</label>
            <input id="sim-codigo" type="text" value="ING-04" required class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none"/>
          </div>
          <div>
            <label class="block text-slate-400 font-semibold mb-1">Lugar / Localidad:</label>
            <input id="sim-lugar" type="text" value="Bocaranga" required class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none"/>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 font-semibold mb-1">Nombre Operativo:</label>
            <input id="sim-nombre" type="text" value="Puesto de Control Avanzado" required class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none"/>
          </div>
          <div>
            <label class="block text-slate-400 font-semibold mb-1">Responsable en Campo:</label>
            <input id="sim-resp" type="text" value="Tte. Quispe (Patrulla Alfa)" class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none"/>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 font-semibold mb-1">Longitud (Lon / X):</label>
            <input id="sim-lon" type="number" step="0.0001" value="15.6150" required class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none"/>
          </div>
          <div>
            <label class="block text-slate-400 font-semibold mb-1">Latitud (Lat / Y):</label>
            <input id="sim-lat" type="number" step="0.0001" value="6.9800" required class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none"/>
          </div>
        </div>

        <div>
          <label class="block text-slate-400 font-semibold mb-1">Tipo de Trabajo / Misión:</label>
          <input id="sim-tipo" type="text" value="Instalación de base perimétrica y remoción EOD" class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none"/>
        </div>

        <div>
          <label class="block text-slate-400 font-semibold mb-1">Descripción Detallada:</label>
          <textarea id="sim-desc" rows="2" class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none">Punto geo-referenciado transmitido mediante reporte de patrulla táctica de ingeniería.</textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 font-semibold mb-1">Foto Adjunta (Asset):</label>
            <select id="sim-foto" class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none">
              <option value="Bouar1.jpeg">Bouar1.jpeg</option>
              <option value="Bouar2.jpeg">Bouar2.jpeg</option>
              <option value="Kouki.jpg">Kouki.jpg</option>
              <option value="Benzambe.jpg">Benzambe.jpg</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-400 font-semibold mb-1">Video Adjunto (Asset):</label>
            <select id="sim-video" class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none">
              <option value="Bouar3.mp4">Bouar3.mp4</option>
              <option value="">Sin video</option>
            </select>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button type="button" id="sim-cancel-btn" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center space-x-1 shadow-lg shadow-rose-900/30">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            Transmitir Reporte
          </button>
        </div>
      </form>
    </div>
  `,document.body.appendChild(e),document.getElementById(`sim-close-btn`).addEventListener(`click`,$),document.getElementById(`sim-cancel-btn`).addEventListener(`click`,$),document.getElementById(`sim-form`).addEventListener(`submit`,e=>{e.preventDefault();let t=parseFloat(document.getElementById(`sim-lon`).value),n=parseFloat(document.getElementById(`sim-lat`).value),r={id:`SIM-${Date.now()}`,codigo:document.getElementById(`sim-codigo`).value,lugar:document.getElementById(`sim-lugar`).value,nombre:document.getElementById(`sim-nombre`).value,seccion:`CIA - Ingenieria (Reporte Móvil)`,tipo_trab:document.getElementById(`sim-tipo`).value,responsable:document.getElementById(`sim-resp`).value,descripcion:document.getElementById(`sim-desc`).value,coordinates:[t,n],foto:document.getElementById(`sim-foto`).value||null,video:document.getElementById(`sim-video`).value||null,f_inicio:`10/11/2026`,f_termino:`20/11/2026`,origen:`Aplicativo Android (Simulado)`,fecha_envio:new Date().toISOString()};je(r),$(),We(`✓ Reporte ${r.codigo} recibido y posicionado en el mapa`)})}function $(){let e=document.getElementById(`apk-simulator-modal`);e&&e.classList.add(`hidden`)}function We(e){let t=document.createElement(`div`);t.className=`
    fixed top-20 right-5 z-[80] bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl
    text-xs font-bold flex items-center space-x-2 animate-bounce
  `,t.textContent=e,document.body.appendChild(t),setTimeout(()=>t.remove(),4e3)}function Ge(e,t,n){let r=document.createElement(`div`);r.className=`
    fixed top-20 right-5 z-[80] bg-slate-900 border border-emerald-500/60 text-white px-4 py-2.5 rounded-xl shadow-2xl
    text-xs font-semibold flex items-center space-x-3 shadow-emerald-950/50 backdrop-blur-md
  `,r.innerHTML=`
    <span class="flex items-center space-x-1.5 text-emerald-400">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>${e}</span>
    </span>
    <button class="toast-action-btn px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition shadow-sm">
      ${t}
    </button>
    <button class="toast-close-btn text-slate-400 hover:text-white text-xs pl-1">✕</button>
  `,r.querySelector(`.toast-action-btn`).addEventListener(`click`,()=>{n&&n(),r.remove()}),r.querySelector(`.toast-close-btn`).addEventListener(`click`,()=>r.remove()),document.body.appendChild(r),setTimeout(()=>{document.body.contains(r)&&r.remove()},1e4)}document.addEventListener(`DOMContentLoaded`,async()=>{console.log(`Inicializando Visor Cartográfico Proyecto Valkiria...`),_({onCenterOnMap:e=>ke(e)}),ie({onSelectFeature:e=>ke(e)}),le({onFilterChange:e=>{console.log(`Filtro de fechas aplicado:`,e),Ae()}});let{map:e,view:t,layerInstances:n,minuscaLayer:r,zoomToFieldReports:i}=await Ce(`viewDiv`);Fe({map:e,view:t,layerInstances:n,minuscaLayer:r,onMinuscaZoom:()=>Te(),onFieldReportsZoom:()=>i()}),await Ve();let a=document.getElementById(`nav-toggle-table`);a&&a.addEventListener(`click`,()=>{O()}),console.log(`✓ Visor Valkiria listo y operativo.`)});
//# sourceMappingURL=index-CMJmPrQN.js.map