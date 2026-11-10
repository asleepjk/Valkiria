import e from"https://js.arcgis.com/4.31/@arcgis/core/Map.js";import t from"https://js.arcgis.com/4.31/@arcgis/core/views/MapView.js";import n from"https://js.arcgis.com/4.31/@arcgis/core/layers/GeoJSONLayer.js";import r from"https://js.arcgis.com/4.31/@arcgis/core/layers/MediaLayer.js";import i from"https://js.arcgis.com/4.31/@arcgis/core/layers/support/ImageElement.js";import a from"https://js.arcgis.com/4.31/@arcgis/core/layers/support/ExtentAndRotationGeoreference.js";import o from"https://js.arcgis.com/4.31/@arcgis/core/geometry/Extent.js";import s from"https://js.arcgis.com/4.31/@arcgis/core/geometry/Point.js";import c from"https://js.arcgis.com/4.31/@arcgis/core/Graphic.js";import l from"https://js.arcgis.com/4.31/@arcgis/core/layers/GraphicsLayer.js";import u from"https://js.arcgis.com/4.31/@arcgis/core/widgets/ScaleBar.js";import d from"https://js.arcgis.com/4.31/@arcgis/core/widgets/Home.js";import f from"https://js.arcgis.com/4.31/@arcgis/core/widgets/Fullscreen.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var p=[{id:`zonas`,title:`Zonas de Operación`,group:`ELEMENTOS DE INTERES`,file:`data/layers/zonas.geojson`,visible:!0,isFeature:!0,layerType:`polygon`,category:`ZONAS`,renderer:{type:`unique-value`,field:`ZONAS`,defaultSymbol:{type:`simple-fill`,color:[200,200,200,.3],outline:{color:[100,100,100,1],width:1.5}},uniqueValueInfos:[{value:`CENTER`,label:`CENTER`,symbol:{type:`simple-fill`,color:[255,235,190,.45],outline:{color:[40,40,40,.9],width:1.8}}},{value:`EAST`,label:`EAST`,symbol:{type:`simple-fill`,color:[190,210,255,.45],outline:{color:[40,40,40,.9],width:1.8}}},{value:`WEST`,label:`WEST`,symbol:{type:`simple-fill`,color:[232,190,255,.45],outline:{color:[40,40,40,.9],width:1.8}}}]},labelingInfo:[{labelExpressionInfo:{expression:`$feature.ZONAS`},symbol:{type:`text`,color:[241,245,249,.9],haloColor:[15,23,42,.9],haloSize:2,font:{family:`Arial, sans-serif`,size:11,weight:`bold`}},labelPlacement:`always-horizontal`,minScale:0,maxScale:0}]},{id:`rca`,title:`Límite República Centroafricana (RCA)`,group:`LIMITES ADMINISTRATIVOS`,file:`data/layers/rca.geojson`,visible:!0,isFeature:!0,layerType:`polygon`,category:`LIMITES`,renderer:{type:`simple`,symbol:{type:`simple-fill`,color:[0,0,0,0],outline:{color:[255,0,197,1],width:3}}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.adm0_name`},symbol:{type:`text`,color:[255,255,255,.95],haloColor:[15,23,42,.95],haloSize:2.5,font:{family:`Arial, sans-serif`,size:14,weight:`bold`}},labelPlacement:`always-horizontal`,minScale:0,maxScale:6288990}]},{id:`prefectura`,title:`Límite Prefecturas`,group:`LIMITES ADMINISTRATIVOS`,file:`data/layers/prefectura.geojson`,visible:!0,isFeature:!0,layerType:`polygon`,category:`LIMITES`,renderer:{type:`simple`,symbol:{type:`simple-fill`,color:[0,0,0,0],outline:{color:[255,255,0,.95],width:2}}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.adm1_name`},symbol:{type:`text`,color:[254,240,138,.95],haloColor:[15,23,42,.95],haloSize:2,font:{family:`Arial, sans-serif`,size:10,weight:`bold`}},labelPlacement:`always-horizontal`,minScale:4e6,maxScale:5e5}]},{id:`sub_prefectura`,title:`Límite Sub Prefecturas`,group:`LIMITES ADMINISTRATIVOS`,file:`data/layers/sub_prefectura.geojson`,visible:!0,isFeature:!0,layerType:`polygon`,category:`LIMITES`,renderer:{type:`simple`,symbol:{type:`simple-fill`,color:[0,0,0,0],outline:{color:[76,230,0,.85],width:1.2}}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.adm2_name`},symbol:{type:`text`,color:[134,239,172,.95],haloColor:[15,23,42,.95],haloSize:1.5,font:{family:`Arial, sans-serif`,size:8.5,weight:`normal`}},labelPlacement:`always-horizontal`,minScale:125e4,maxScale:0}]},{id:`bouar_aerodromo`,title:`Bouar Aeródromo`,group:`TRABAJOS REALIZADOS > INGENIERIA`,file:`data/layers/bouar_aerodromo.geojson`,visible:!0,isFeature:!0,layerType:`polygon`,category:`INGENIERIA`,renderer:{type:`simple`,symbol:{type:`simple-fill`,style:`diagonal-cross`,color:[255,0,0,.35],outline:{color:[255,0,0,1],width:2}}}},{id:`airport`,title:`Aeropuertos`,group:`ELEMENTOS DE INTERES`,file:`data/layers/airport.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`INTERES`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/airport_marker_halo.png`,width:`32px`,height:`32px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.Name`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[15,23,42,.95],haloSize:1.5,font:{family:`Arial Narrow, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-center`,minScale:3e6,maxScale:0}]},{id:`adminpoint`,title:`Puntos Administrativos`,group:`ELEMENTOS DE INTERES`,file:`data/layers/adminpoint.geojson`,visible:!1,isFeature:!0,layerType:`point`,category:`INTERES`,renderer:{type:`simple`,symbol:{type:`simple-marker`,style:`diamond`,color:[249,115,22,.9],size:7,outline:{color:[255,255,255,1],width:1}}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.Name`},symbol:{type:`text`,color:[251,146,60,.95],haloColor:[15,23,42,.95],haloSize:1.5,font:{family:`Arial Narrow, sans-serif`,size:8.5,weight:`normal`}},labelPlacement:`above-right`,minScale:2e6,maxScale:0}]},{id:`sabewa`,title:`EOD - Sabewa`,group:`TRABAJOS REALIZADOS > EOD`,file:`data/layers/sabewa.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`EOD`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/sabewa_marker.png`,width:`26px`,height:`26px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.Sector`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[124,45,18,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`bouar`,title:`EOD - Bouar`,group:`TRABAJOS REALIZADOS > EOD`,file:`data/layers/bouar.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`EOD`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/bouar_marker.png`,width:`26px`,height:`26px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.Sector`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[124,45,18,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`peouri_besson`,title:`EOD - Peouri Besson`,group:`TRABAJOS REALIZADOS > EOD`,file:`data/layers/peouri_besson.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`EOD`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/peouri_besson_marker.png`,width:`26px`,height:`26px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.Sector`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[124,45,18,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`benzambe`,title:`EOD - Benzambe`,group:`TRABAJOS REALIZADOS > EOD`,file:`data/layers/benzambe.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`EOD`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/benzambe_marker.png`,width:`26px`,height:`26px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.LUGAR`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[124,45,18,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`kouki`,title:`EOD - Kouki`,group:`TRABAJOS REALIZADOS > EOD`,file:`data/layers/kouki.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`EOD`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/kouki_marker.png`,width:`26px`,height:`26px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.LUGAR`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[124,45,18,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`ing`,title:`ING - Obras de Ingeniería`,group:`TRABAJOS REALIZADOS > INGENIERIA`,file:`data/layers/ing.geojson`,visible:!0,isFeature:!0,layerType:`point`,category:`INGENIERIA`,renderer:{type:`simple`,symbol:{type:`picture-marker`,url:`symbols/ing_marker.png`,width:`28px`,height:`28px`}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.NOMBRE`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[30,58,138,.95],haloSize:1.5,font:{family:`Tahoma, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]},{id:`live_submissions`,title:`Reportes de Campo`,group:`TRABAJOS REALIZADOS > REPORTES DE CAMPO`,isDynamic:!0,visible:!0,isFeature:!0,layerType:`point`,category:`REPORTE DE CAMPO`,renderer:{type:`simple`,symbol:{type:`simple-marker`,style:`circle`,color:[239,68,68,.95],size:14,outline:{color:[255,255,255,1],width:2.5}}},labelingInfo:[{labelExpressionInfo:{expression:`$feature.titulo`},symbol:{type:`text`,color:[255,255,255,1],haloColor:[153,27,27,.95],haloSize:1.5,font:{family:`Arial, sans-serif`,size:9,weight:`bold`}},labelPlacement:`above-right`,minScale:6288996,maxScale:0}]}],m={id:`minusca`,title:`Ortofoto / Ráster MINUSCA`,file:`data/rasters/minusca.png`,visible:!1,opacity:.9,extentWgs84:{xmin:12.0797893824399,ymin:-.0656952619086617,xmax:29.742398517321995,ymax:13.667457656027116},extent3857:{xmin:1344714.47,ymin:-7312.98,xmax:3310903.62,ymax:1535787.72}},h={bouar1:`assets/fotos/Bouar1.jpeg`,"bouar1.jpeg":`assets/fotos/Bouar1.jpeg`,"bouar1.jpg":`assets/fotos/Bouar1.jpeg`,bouar2:`assets/fotos/Bouar2.jpeg`,"bouar2.jpeg":`assets/fotos/Bouar2.jpeg`,"bouar2.jpg":`assets/fotos/Bouar2.jpeg`,kouki:`assets/fotos/Kouki.jpg`,"kouki.jpg":`assets/fotos/Kouki.jpg`,benzambe:`assets/fotos/Benzambe.jpg`,"benzambe.jpg":`assets/fotos/Benzambe.jpg`},g={bouar3:`assets/videos/Bouar3.mp4`,"bouar3.mp4":`assets/videos/Bouar3.mp4`};function ee(e){if(!e)return null;let t=String(e).trim();if(t.startsWith(`http://`)||t.startsWith(`https://`)||t.startsWith(`data:`))return t;let n=t.toLowerCase();return h[n]?h[n]:n.endsWith(`.jpg`)||n.endsWith(`.jpeg`)||n.endsWith(`.png`)||n.endsWith(`.webp`)?`assets/fotos/${t}`:`assets/fotos/${t}.jpg`}function te(e){if(!e)return null;let t=String(e).trim();if(t.startsWith(`http://`)||t.startsWith(`https://`))return t;let n=t.toLowerCase();return g[n]?g[n]:n.endsWith(`.mp4`)||n.endsWith(`.webm`)||n.endsWith(`.mov`)?`assets/videos/${t}`:`assets/videos/${t}.mp4`}var _=null,v=null,y=null,b=null;function ne({onCenterOnMap:e}={}){b=e,x(),re()}function x(){document.getElementById(`media-drawer`)||(_=document.createElement(`div`),_.id=`media-drawer`,_.className=`
    fixed top-0 right-0 h-full w-full sm:w-[440px] md:w-[480px] bg-slate-900/95 backdrop-blur-md
    text-slate-100 shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out
    flex flex-col border-l border-slate-700/60
  `,_.innerHTML=`
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
  `,document.body.appendChild(_),document.getElementById(`drawer-close-btn`).addEventListener(`click`,ae),document.getElementById(`drawer-center-btn`).addEventListener(`click`,()=>{y&&b&&b(y)}),document.getElementById(`drawer-copy-coords-btn`).addEventListener(`click`,()=>{let e=document.getElementById(`drawer-coords-val`).textContent;navigator.clipboard.writeText(e).then(()=>{let e=document.getElementById(`copy-text`);e.textContent=`¡Copiado!`,setTimeout(()=>e.textContent=`Copiar`,2e3)})}))}function re(){document.getElementById(`media-lightbox`)||(v=document.createElement(`div`),v.id=`media-lightbox`,v.className=`
    fixed inset-0 z-[100] bg-black/90 backdrop-blur-md hidden flex items-center justify-center p-4
  `,v.innerHTML=`
    <div class="relative max-w-5xl max-h-full flex flex-col items-center">
      <img id="lightbox-img" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" src="" alt="Vista ampliada" />
      <p id="lightbox-caption" class="mt-3 text-sm text-slate-300 font-medium"></p>
      <button id="lightbox-close" class="absolute -top-10 right-0 text-white/80 hover:text-white p-2 text-2xl font-bold transition">
        ✕
      </button>
    </div>
  `,document.body.appendChild(v),document.getElementById(`lightbox-close`).addEventListener(`click`,S),v.addEventListener(`click`,e=>{e.target===v&&S()}))}function ie(e,t=``){let n=document.getElementById(`lightbox-img`),r=document.getElementById(`lightbox-caption`);n.src=e,r.textContent=t,v.classList.remove(`hidden`)}function S(){v&&v.classList.add(`hidden`)}function C(e){_||x(),y=e;let t=e.properties||{},n=e.category||`INGENIERIA`,r=t.CODIGO?`${t.CODIGO} - ${t.NOMBRE||t.LUGAR||``}`:t.NOMBRE||t.LUGAR||t.adm1_name||`Detalle`,i=document.getElementById(`drawer-badge`);i.textContent=n,i.className=n===`INGENIERIA`?`px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30`:n===`EOD`?`px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30`:n===`REPORTE DE CAMPO`?`px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30`:`px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30`,document.getElementById(`drawer-title`).textContent=r;let a=document.getElementById(`drawer-video-container`),o=document.getElementById(`drawer-video`),s=te(t.VIDEO||t.video);s?(o.src=s,a.classList.remove(`hidden`)):(o.pause(),o.removeAttribute(`src`),a.classList.add(`hidden`));let c=document.getElementById(`drawer-photos-container`),l=document.getElementById(`drawer-photos-grid`),u=document.getElementById(`drawer-photos-count`);l.innerHTML=``;let d=[t.FOTO,t.foto,t.FOTO_2,t.foto_2].filter(Boolean).map(e=>ee(e)).filter(Boolean);d.length>0?(c.classList.remove(`hidden`),u.textContent=`${d.length} foto(s)`,d.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`relative group cursor-pointer overflow-hidden rounded-xl border border-slate-700 aspect-video bg-black/40`,n.innerHTML=`
        <img src="${e}" alt="Evidencia ${t+1}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📷</text></svg>';" />
        <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="p-1.5 rounded-full bg-black/60 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
            </svg>
          </span>
        </div>
      `,n.addEventListener(`click`,()=>ie(e,`${r} - Foto ${t+1}`)),l.appendChild(n)})):c.classList.add(`hidden`);let f=document.getElementById(`drawer-attributes`);f.innerHTML=``,[{label:`Código`,val:t.CODIGO||t.codigo},{label:`Lugar / Sector`,val:t.LUGAR||t.lugar||t.adm1_name||t.adm2_name},{label:`Nombre Operativo`,val:t.NOMBRE||t.nombre},{label:`Sección`,val:t.SECCION||t.seccion},{label:`Tipo de Trabajo`,val:t.TIPO_TRAB||t.tipo_trab},{label:`Task Order`,val:t.TASK_ORDER||t.task_order},{label:`Responsable`,val:t.RESPONSABLE||t.responsable},{label:`Fecha Inicio`,val:t.F_INICIO||t.f_inicio},{label:`Fecha Término`,val:t.F_TERMINO||t.f_termino},{label:`Recursos`,val:t.RECURSOS||t.recursos},{label:`Descripción`,val:t.DESCRIPCION||t.descripcion},{label:`Observaciones`,val:t.OBS||t.obs},{label:`Fecha de Registro`,val:t.fecha_envio}].filter(e=>e.val!==void 0&&e.val!==null&&String(e.val).trim()!==``).forEach(e=>{let t=document.createElement(`div`);t.className=`flex flex-col py-1.5 border-b border-slate-800/80 last:border-0`,t.innerHTML=`
      <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">${e.label}</span>
      <span class="text-sm text-slate-200 mt-0.5 whitespace-pre-wrap">${oe(String(e.val))}</span>
    `,f.appendChild(t)});let p=document.getElementById(`drawer-coords-val`);if(e.geometry){let t=null,n=null;e.geometry.type===`Point`&&e.geometry.coordinates?[n,t]=e.geometry.coordinates:e.geometry.latitude===void 0?e.geometry.extent&&(t=e.geometry.extent.center.latitude,n=e.geometry.extent.center.longitude):(t=e.geometry.latitude,n=e.geometry.longitude),p.textContent=t!==null&&n!==null?`Lat: ${t.toFixed(6)}°, Lon: ${n.toFixed(6)}°`:`Geometría poligonal / sin punto único`}else p.textContent=`No disponible`;_.classList.remove(`translate-x-full`)}function ae(){if(_){_.classList.add(`translate-x-full`);let e=document.getElementById(`drawer-video`);e&&e.pause()}}function oe(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}var w=null,T=!0,E=`ing`,D={},O=[],k=null;function se({onSelectFeature:e}={}){k=e,ce()}function A(e,t,n){D[e]={title:n||e,features:t||[]},ue(),j()}function ce(){document.getElementById(`bottom-attribute-table`)||(w=document.createElement(`div`),w.id=`bottom-attribute-table`,w.className=`
    fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/80
    text-slate-100 shadow-2xl transition-all duration-300 ease-in-out flex flex-col
  `,w.style.height=`42px`,w.innerHTML=`
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
  `,document.body.appendChild(w),document.getElementById(`table-handle`).addEventListener(`click`,e=>{e.target.closest(`input`)||e.target.closest(`#table-export-csv`)||le()}),document.getElementById(`table-search-input`).addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim(),n=document.getElementById(`table-search-clear`);t?n.classList.remove(`hidden`):n.classList.add(`hidden`),de(t)}),document.getElementById(`table-search-clear`).addEventListener(`click`,()=>{let e=document.getElementById(`table-search-input`);e.value=``,document.getElementById(`table-search-clear`).classList.add(`hidden`),de(``)}),document.getElementById(`table-export-csv`).addEventListener(`click`,fe))}function le(e){if(!w)return;T=e===void 0?!T:!e;let t=document.getElementById(`table-chevron`),n=document.getElementById(`table-body`);T?(w.style.height=`42px`,n.classList.add(`hidden`),t.classList.remove(`rotate-180`)):(w.style.height=`320px`,n.classList.remove(`hidden`),t.classList.add(`rotate-180`),j())}function ue(){let e=document.getElementById(`table-tabs`);if(!e)return;e.innerHTML=``;let t=Object.keys(D);t.length!==0&&(!D[E]&&t.length>0&&(E=t[0]),t.forEach(t=>{let n=D[t],r=document.createElement(`button`),i=t===E;r.className=`
      px-3 py-1.5 text-xs font-medium rounded-t-lg transition border-b-2
      ${i?`bg-slate-800 text-sky-400 border-sky-400 font-bold`:`text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900`}
    `,r.innerHTML=`${n.title} <span class="ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${i?`bg-sky-500/20 text-sky-300`:`bg-slate-800 text-slate-500`}">${n.features.length}</span>`,r.addEventListener(`click`,e=>{e.stopPropagation(),E=t,ue(),j()}),e.appendChild(r)}))}function j(){let e=document.getElementById(`table-content-rows`),t=document.getElementById(`table-record-count`);if(!e)return;let n=D[E];if(!n||!n.features){e.innerHTML=`<tr><td colspan="9" class="text-center py-6 text-slate-500">No hay datos disponibles para esta capa.</td></tr>`,t&&(t.textContent=`0 registros`);return}let r=document.getElementById(`table-search-input`),i=r?r.value.toLowerCase().trim():``,a=n.features;i&&(a=a.filter(e=>{let t=e.properties||{};return Object.values(t).some(e=>e&&String(e).toLowerCase().includes(i))})),O=a,t&&(t.textContent=`${a.length} de ${n.features.length} registros`),a.length===0?e.innerHTML=`<tr><td colspan="9" class="text-center py-6 text-slate-500">Ningún registro coincide con el filtro.</td></tr>`:(e.innerHTML=``,a.forEach((t,n)=>{let r=t.properties||{},i=document.createElement(`tr`);i.className=`hover:bg-slate-800/60 cursor-pointer transition`;let a=r.CODIGO||r.codigo||`#${n+1}`,o=r.NOMBRE||r.nombre||r.LUGAR||r.lugar||r.Name||r.name||r.adm1_name||r.adm2_name||`-`,s=r.SECCION||r.seccion||`-`,c=r.TIPO_TRAB||r.tipo_trab||r.ZONAS||`-`,l=r.RESPONSABLE||r.responsable||`-`,u=r.F_INICIO?`${r.F_INICIO} → ${r.F_TERMINO||`Actual`}`:r.fecha_envio||`-`,d=!!(r.FOTO||r.foto||r.FOTO_2||r.foto_2),f=!!(r.VIDEO||r.video);i.innerHTML=`
      <td class="py-2 px-3 text-slate-500">${n+1}</td>
      <td class="py-2 px-3 font-semibold text-sky-400">${a}</td>
      <td class="py-2 px-3 text-white font-medium">${o}</td>
      <td class="py-2 px-3 text-slate-300">${s}</td>
      <td class="py-2 px-3 text-slate-300 max-w-[200px] truncate" title="${c}">${c}</td>
      <td class="py-2 px-3 text-slate-400">${l}</td>
      <td class="py-2 px-3 text-slate-400">${u}</td>
      <td class="py-2 px-3 text-center">
        <div class="inline-flex items-center space-x-1.5">
          ${d?`<span title="Fotografía disponible" class="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">📷 Foto</span>`:``}
          ${f?`<span title="Video disponible" class="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30">🎬 Video</span>`:``}
          ${!d&&!f?`<span class="text-slate-600 text-[10px]">--</span>`:``}
        </div>
      </td>
      <td class="py-2 px-3 text-center">
        <button class="px-2 py-1 rounded bg-sky-600/30 hover:bg-sky-600 text-sky-300 hover:text-white text-xs font-semibold transition" title="Ver en el mapa">
          Ver
        </button>
      </td>
    `,i.addEventListener(`click`,()=>{k&&k(t)}),e.appendChild(i)}))}function de(){j()}function fe(){if(!O||O.length===0){alert(`No hay registros para exportar`);return}let e=O[0].properties||{},t=Object.keys(e),n=[];n.push(t.join(`,`)),O.forEach(e=>{let r=e.properties||{},i=t.map(e=>{let t=r[e];return t==null?`""`:`"${String(t).replace(/"/g,`""`)}"`});n.push(i.join(`,`))});let r=n.join(`\r
`),i=new Blob([r],{type:`text/csv;charset=utf-8;`}),a=URL.createObjectURL(i),o=document.createElement(`a`);o.setAttribute(`href`,a),o.setAttribute(`download`,`valkiria_${E}_${Date.now()}.csv`),document.body.appendChild(o),o.click(),document.body.removeChild(o)}var M=null,N={startDate:null,endDate:null,onlyMedia:!1,preset:`all`};function pe({onFilterChange:e}={}){M=e,me()}function me(){let e=document.getElementById(`panel-date-filter-content`);if(!e)return;e.innerHTML=`
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
  `;let t=e.querySelector(`#filter-start-date`),n=e.querySelector(`#filter-end-date`),r=e.querySelector(`#filter-reset-btn`);t.addEventListener(`change`,()=>{N.startDate=t.value?new Date(t.value):null,N.preset=`custom`,P(`custom`),I()}),n.addEventListener(`change`,()=>{N.endDate=n.value?new Date(n.value+`T23:59:59`):null,N.preset=`custom`,P(`custom`),I()}),r.addEventListener(`click`,()=>{he()}),e.querySelectorAll(`.preset-btn`).forEach(e=>{e.addEventListener(`click`,()=>{F(e.getAttribute(`data-preset`))})})}function P(e){let t=document.getElementById(`panel-date-filter-content`);t&&t.querySelectorAll(`.preset-btn`).forEach(t=>{t.className=t.getAttribute(`data-preset`)===e?`preset-btn px-2.5 py-1.5 rounded-lg bg-sky-500 text-white font-bold transition flex items-center justify-center space-x-1`:`preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center space-x-1`})}function F(e){let t=document.getElementById(`filter-start-date`),n=document.getElementById(`filter-end-date`);if(N.preset=e,P(e),e===`all`)N.startDate=null,N.endDate=null,N.onlyMedia=!1,t&&(t.value=``),n&&(n.value=``);else if(e===`2026`)N.startDate=new Date(`2026-01-01T00:00:00`),N.endDate=new Date(`2026-12-31T23:59:59`),N.onlyMedia=!1,t&&(t.value=`2026-01-01`),n&&(n.value=`2026-12-31`);else if(e===`month`){let e=new Date(`2026-11-10T10:00:00`),r=new Date(e.getFullYear(),e.getMonth(),1),i=new Date(e.getFullYear(),e.getMonth()+1,0,23,59,59);N.startDate=r,N.endDate=i,N.onlyMedia=!1,t&&(t.value=r.toISOString().split(`T`)[0]),n&&(n.value=i.toISOString().split(`T`)[0])}else e===`media`&&(N.startDate=null,N.endDate=null,N.onlyMedia=!0,t&&(t.value=``),n&&(n.value=``));I()}function he(){F(`all`)}function I(){ge(),M&&M(N)}function ge(){let e=document.getElementById(`filter-status-badge`),t=document.getElementById(`nav-date-badge`),n=N.preset!==`all`||N.onlyMedia||N.startDate||N.endDate;e&&(n?(e.textContent=`Activo`,e.className=`text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold`):(e.textContent=`Sin filtros`,e.className=`text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400`)),t&&(n?t.classList.remove(`hidden`):t.classList.add(`hidden`))}function _e(e){if(!e)return null;let t=String(e).trim();if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t)){let[e,n,r]=t.split(`/`).map(Number);return new Date(r,n-1,e)}let n=new Date(t);return isNaN(n.getTime())?null:n}function ve(e){let t=e.properties||{};if(N.onlyMedia){let e=!!(t.FOTO||t.foto||t.FOTO_2||t.foto_2),n=!!(t.VIDEO||t.video);if(!e&&!n)return!1}if(!N.startDate&&!N.endDate)return!0;let n=t.F_INICIO||t.f_inicio||t.fecha_envio||t.timestamp||t.F_TERMINO||t.f_termino;if(!n)return!1;let r=_e(n);return!(!r||N.startDate&&r<N.startDate||N.endDate&&r>N.endDate)}var L=null,R=null,z={},B={},V=null,H=null,U=null;async function ye(n=`viewDiv`){L=new e({basemap:`satellite`}),R=new t({container:n,map:L,center:[18.6,6.6],zoom:6.8,ui:{components:[`zoom`,`compass`]}}),await R.when();let r=new d({view:R});R.ui.add(r,`top-left`);let i=new f({view:R});R.ui.add(i,`top-left`);let a=new u({view:R,unit:`metric`});return R.ui.add(a,`bottom-left`),await xe(),be(),H=new l({id:`live_submissions`,title:`Reportes de Campo`,visible:!0}),L.add(H),U=new l({title:`Highlight Selection`,listMode:`hide`}),L.add(U),Se(),{map:L,view:R,layerInstances:B,minuscaLayer:V,zoomToMinusca:W}}function be(){try{let e=m.extent3857,t=new URL(m.file,window.location.href).href,n=new i({image:t,georeference:new a({extent:new o({xmin:e.xmin,ymin:e.ymin,xmax:e.xmax,ymax:e.ymax,spatialReference:{wkid:3857}})})});V=new r({id:m.id,title:m.title,source:[n],visible:m.visible,opacity:m.opacity});let s=L.layers.findIndex(e=>e.id===`zonas`);s>=0?L.add(V,s+1):L.add(V,0),V.load().then(()=>{console.log(`✓ Ortofoto Ráster MINUSCA cargada y lista en MediaLayer.`)}).catch(e=>{console.warn(`Aviso cargando MediaLayer MINUSCA:`,e)})}catch(e){console.error(`Error al inicializar la capa ráster MINUSCA:`,e)}}function W(){if(!R)return;let e=m.extent3857;if(V&&!V.visible){V.visible=!0;let e=document.getElementById(`layer-chk-minusca`);e&&(e.checked=!0)}R.goTo({target:new o({xmin:e.xmin,ymin:e.ymin,xmax:e.xmax,ymax:e.ymax,spatialReference:{wkid:3857}})},{duration:1e3})}async function xe(){for(let e of p)if(e.file)try{let t=await(await fetch(e.file)).json();z[e.id]=t;let r=new Blob([JSON.stringify(t)],{type:`application/json`}),i=URL.createObjectURL(r),a={id:e.id,title:e.title,url:i,visible:e.visible,renderer:e.renderer,outFields:[`*`]};e.labelingInfo&&(a.labelingInfo=e.labelingInfo);let o=new n(a);L.add(o),B[e.id]=o,t.features&&t.features.length>0&&A(e.id,t.features,e.title)}catch(t){console.warn(`Error al cargar capa ${e.id}:`,t)}}function Se(){R.on(`click`,async e=>{let t=await R.hitTest(e);if(!t.results||t.results.length===0)return;let n=t.results.filter(e=>e.graphic&&e.graphic.layer&&e.graphic.layer!==U);if(n.length===0)return;n.sort((e,t)=>{let n=e.graphic.geometry?e.graphic.geometry.type:``,r=t.graphic.geometry?t.graphic.geometry.type:``;if(n===`point`&&r!==`point`)return-1;if(r===`point`&&n!==`point`)return 1;let i=e.graphic.layer.id||``,a=t.graphic.layer.id||``,o=i===`ing`||i===`kouki`||i===`benzambe`||i===`live_submissions`,s=a===`ing`||a===`kouki`||a===`benzambe`||a===`live_submissions`;return o&&!s?-1:!o&&s?1:0});let r=n[0].graphic,i=r.layer,a=p.find(e=>e.id===i.id)||{};if(i.id===`airport`){K(r.geometry);let e=r.geometry,t=e.longitude===void 0?e.x===void 0?0:e.x:e.longitude,n=e.latitude===void 0?e.y===void 0?0:e.y:e.latitude,i=r.attributes?.Name||`PISTA NO ESPECIFICADA`,a=r.attributes?.OID||r.attributes?.OBJECTID||`-`,o=G(t,!1),s=G(n,!0);R.openPopup({title:`✈️ AERÓDROMO: ${i}`,location:e,content:`
          <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #f1f5f9; background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155; line-height: 1.5;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px;">
              <span style="color: #38bdf8; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">Identificador</span>
              <span style="background: rgba(56, 189, 248, 0.2); color: #7dd3fc; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid rgba(56, 189, 248, 0.4);">ID #${a}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 600;">Nombre de Pista / Aeródromo:</div>
              <div style="color: #ffffff; font-weight: 700; font-size: 14px;">${i}</div>
            </div>
            <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid #1e293b; border-radius: 6px; padding: 8px;">
              <div style="color: #94a3b8; font-size: 10px; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Coordenadas WGS84:</div>
              <div style="color: #4ade80; font-weight: 600; font-size: 11px;">DD: ${n.toFixed(5)}°, ${t.toFixed(5)}°</div>
              <div style="color: #cbd5e1; font-size: 11px; margin-top: 2px;">DMS: ${s}, ${o}</div>
            </div>
          </div>
        `});return}let o={properties:r.attributes,geometry:r.geometry,category:a.category||(r.geometry.type===`point`?`PUNTO OPERATIVO`:`POLÍGONO`),layerId:i.id};K(r.geometry),C(o)})}function G(e,t){let n=Math.abs(e),r=Math.floor(n),i=(n-r)*60,a=Math.floor(i);return`${r}°${a}'${Math.floor((i-a)*60)}" ${e>=0?t?`N`:`E`:t?`S`:`W`}`}function K(e){if(!U||(U.removeAll(),!e))return;let t=null;t=e.type===`point`?{type:`simple-marker`,style:`circle`,color:[0,255,255,0],size:32,outline:{color:[0,255,255,1],width:3}}:{type:`simple-fill`,color:[0,255,255,.25],outline:{color:[0,255,255,1],width:3}},U.add(new c({geometry:e,symbol:t}))}function q(e){if(!R||!e)return;let t=null;if(e.geometry&&e.geometry.type===`Point`&&e.geometry.coordinates){let[n,r]=e.geometry.coordinates;t=new s({longitude:n,latitude:r}),R.goTo({target:t,zoom:14},{duration:800})}else if(e.geometry&&e.geometry.latitude)t=e.geometry,R.goTo({target:t,zoom:14},{duration:800});else if(e.geometry&&e.geometry.coordinates){let t=e.geometry.coordinates[0];if(t&&t.length>0){let[e,n]=t[0];R.goTo({target:new s({longitude:e,latitude:n}),zoom:13},{duration:800})}}t&&K(t),C(e)}function Ce(){Object.keys(z).forEach(e=>{let t=z[e];if(!t||!t.features)return;let n=t.features.filter(e=>ve(e)),r=p.find(t=>t.id===e);A(e,n,r?r.title:e);let i=B[e];if(i){let e=new Blob([JSON.stringify({type:`FeatureCollection`,features:n})],{type:`application/json`});i.url=URL.createObjectURL(e),i.refresh()}})}function J(e){if(!H||!e.coordinates)return;let[t,n]=e.coordinates,r=new s({longitude:t,latitude:n}),i=new c({geometry:r,symbol:{type:`simple-marker`,style:`circle`,color:[239,68,68,.95],size:16,outline:{color:[255,255,255,1],width:2.5}},attributes:{CODIGO:e.codigo||e.id,NOMBRE:e.nombre,LUGAR:e.lugar,SECCION:e.seccion||`Reporte de Campo`,TIPO_TRAB:e.tipo_trab,TASK_ORDER:e.task_order,RESPONSABLE:e.responsable,DESCRIPCION:e.descripcion,RECURSOS:e.recursos,F_INICIO:e.f_inicio,F_TERMINO:e.f_termino,FOTO:e.foto,FOTO_2:e.foto_2,VIDEO:e.video,fecha_envio:e.fecha_envio||new Date().toISOString()}});H.add(i);let a={type:`Feature`,geometry:{type:`Point`,coordinates:[t,n]},properties:i.attributes,category:`REPORTE DE CAMPO`},o=z.live_submissions||{features:[]};return o.features.push(a),z.live_submissions=o,A(`live_submissions`,o.features,`Reportes de Campo`),i}var Y=null,X={},Z=null,we=`satellite`,Te=[{id:`satellite`,name:`Satelital (Imágenes Puras)`,desc:`Imágenes aéreas puras de alta resolución sin etiquetas superpuestas`,thumb:`https://www.arcgis.com/sharing/rest/content/items/86de95d4e0244cba80f0fa28b1cc2463/info/thumbnail/thumbnail1591224931210.jpeg`},{id:`hybrid`,name:`Satelital Híbrido`,desc:`Imágenes satelitales globales con nombres de lugares y red vial`,thumb:`https://www.arcgis.com/sharing/rest/content/items/10df2279f9684e4a9f6a7f08febac2a9/info/thumbnail/thumbnail1584118328636.jpeg`},{id:`topo-vector`,name:`Topográfico Esri`,desc:`Curvas de nivel, relieve sombreado y referencias geográficas`,thumb:`https://www.arcgis.com/sharing/rest/content/items/7dc6cea0b7a34a1996b9e6ff22625ec0/info/thumbnail/topo_thumb_b2.jpg`},{id:`streets-vector`,name:`Calles & Vías`,desc:`Red vial completa, carreteras y asentamientos urbanos`,thumb:`https://www.arcgis.com/sharing/rest/content/items/4f3582e9e1444747ba6b8b09ff8e869f/info/thumbnail/world_street_map.jpg`},{id:`osm`,name:`OpenStreetMap`,desc:`Cartografía comunitaria abierta y detallada`,thumb:`https://www.arcgis.com/sharing/rest/content/items/5d2bfa736f8448b3a114380585b9e823/info/thumbnail/tem_osm.jpg`},{id:`dark-gray-vector`,name:`Modo Táctico Oscuro`,desc:`Contraste óptimo para operaciones nocturnas`,thumb:`https://www.arcgis.com/sharing/rest/content/items/4e43282276554e198bfa49c3de2f0672/info/thumbnail/thumbnail1562947137837.jpeg`}];function Ee({map:e,view:t,layerInstances:n,minuscaLayer:r,onMinuscaZoom:i}){Y=e,X=n,Z=r,De(i),ke(),Ae(i),je()}function De(e){[{btnId:`nav-layers-btn`,panelId:`panel-layers`},{btnId:`nav-basemap-btn`,panelId:`panel-basemap`},{btnId:`nav-legend-btn`,panelId:`panel-legend`},{btnId:`nav-date-btn`,panelId:`panel-date-filter`}].forEach(({btnId:e,panelId:t})=>{let n=document.getElementById(e);n&&n.addEventListener(`click`,n=>{n.stopPropagation(),Oe(t,e)})})}function Oe(e,t){let n=document.getElementById(e);if(n){if(!n.classList.contains(`hidden`))Q();else if(Q(),n.classList.remove(`hidden`),t){let e=document.getElementById(t);e&&(e.classList.add(`bg-sky-600`,`text-white`,`border-sky-400`,`shadow-sky-500/30`),e.classList.remove(`bg-slate-800`,`text-slate-200`,`border-slate-700`))}}}function Q(){document.querySelectorAll(`.tactical-panel`).forEach(e=>e.classList.add(`hidden`)),document.querySelectorAll(`.nav-tool-btn`).forEach(e=>{e.id!==`nav-toggle-table`&&(e.classList.remove(`bg-sky-600`,`text-white`,`border-sky-400`,`shadow-sky-500/30`),e.classList.add(`bg-slate-800`,`text-slate-200`,`border-slate-700`))})}function ke(){let e=document.getElementById(`basemap-grid`);e&&(e.innerHTML=``,Te.forEach(t=>{let n=document.createElement(`div`),r=t.id===we;n.className=`
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
    `,n.addEventListener(`click`,()=>{Y&&(Y.basemap=t.id,we=t.id,ke())}),e.appendChild(n)}))}function Ae(e){let t=document.getElementById(`layers-tree`);if(!t)return;t.innerHTML=``;let n=document.createElement(`div`);n.className=`p-3 bg-slate-950/70 border border-emerald-500/40 rounded-xl space-y-2 mb-3 shadow-inner`,n.innerHTML=`
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
  `,t.appendChild(n);let r=n.querySelector(`#layer-chk-minusca`);Z&&(r.checked=Z.visible),r.addEventListener(`change`,()=>{Z&&(Z.visible=r.checked)}),n.querySelector(`#minusca-zoom-btn`).addEventListener(`click`,()=>{e&&e()});let i=n.querySelector(`#minusca-opacity`),a=n.querySelector(`#minusca-opacity-val`);i.addEventListener(`input`,()=>{let e=parseFloat(i.value);a.textContent=`${Math.round(e*100)}%`,Z&&(Z.opacity=e)}),[{name:`TRABAJOS REALIZADOS`,layers:p.filter(e=>e.group.includes(`TRABAJOS REALIZADOS`))},{name:`ELEMENTOS DE INTERES`,layers:p.filter(e=>e.group===`ELEMENTOS DE INTERES`)},{name:`LIMITES ADMINISTRATIVOS`,layers:p.filter(e=>e.group===`LIMITES ADMINISTRATIVOS`)}].forEach(e=>{let n=document.createElement(`div`);n.className=`space-y-1 mb-2.5`,n.innerHTML=`
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800 flex items-center justify-between">
        <span>${e.name}</span>
        <span class="text-slate-500 font-normal">(${e.layers.length})</span>
      </div>
      <div class="space-y-1 pt-1"></div>
    `;let r=n.querySelector(`.space-y-1`);e.layers.forEach(e=>{let t=document.createElement(`div`);t.className=`flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-800/60 transition text-xs`;let n=X[e.id],i=n?n.visible:e.visible,a=``;if(e.renderer&&e.renderer.symbol&&e.renderer.symbol.url)a=`<img src="${e.renderer.symbol.url}" class="w-4 h-4 object-contain inline-block mr-1.5" />`;else if(e.renderer&&e.renderer.symbol&&e.renderer.symbol.color){let t=e.renderer.symbol.color;a=`<span class="w-3.5 h-3.5 rounded border border-white/50 inline-block mr-1.5" style="background-color: ${`rgba(${t[0]}, ${t[1]}, ${t[2]}, 0.8)`}"></span>`}else a=`<span class="w-3 h-3 rounded-full bg-sky-400 inline-block mr-1.5"></span>`;t.innerHTML=`
        <label class="flex items-center space-x-2 cursor-pointer flex-1 truncate select-none">
          <input type="checkbox" data-layer-id="${e.id}" ${i?`checked`:``} class="w-3.5 h-3.5 text-sky-500 rounded bg-slate-800 border-slate-600 focus:ring-sky-500 cursor-pointer" />
          <div class="flex items-center truncate">
            ${a}
            <span class="text-slate-200 truncate">${e.title}</span>
          </div>
        </label>
      `;let o=t.querySelector(`input`);o.addEventListener(`change`,()=>{let t=X[e.id];t&&(t.visible=o.checked),je()}),r.appendChild(t)}),t.appendChild(n)})}function je(){let e=document.getElementById(`legend-items`);if(e){if(e.innerHTML=``,Z&&Z.visible){let t=document.createElement(`div`);t.className=`flex items-center space-x-2.5 py-1 text-xs border-b border-slate-800/80 pb-2`,t.innerHTML=`
      <span class="w-5 h-5 rounded border border-emerald-500 bg-emerald-500/30 flex items-center justify-center text-[10px]">🗺️</span>
      <div>
        <div class="text-slate-200 font-bold">Ortofoto / Ráster MINUSCA</div>
        <div class="text-[10px] text-slate-400">Imagen de referencia operativa RCA</div>
      </div>
    `,e.appendChild(t)}p.forEach(t=>{let n=X[t.id];if(n&&!n.visible)return;let r=document.createElement(`div`);r.className=`flex items-start space-x-2.5 py-1.5 text-xs border-b border-slate-800/60 last:border-0`;let i=``;if(t.renderer&&t.renderer.symbol&&t.renderer.symbol.url)i=`<img src="${t.renderer.symbol.url}" class="w-6 h-6 object-contain flex-shrink-0" />`;else if(t.renderer&&t.renderer.type===`unique-value`)i=`
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
    `,e.appendChild(r)}),e.children.length===0&&(e.innerHTML=`<p class="text-xs text-slate-500 py-4 text-center">No hay capas visibles actualmente.</p>`)}}async function Me(){try{let e=await fetch(`data/submissions/sample_submission.json`);e.ok&&J(await e.json())}catch(e){console.log(`No se encontraron reportes previos en data/submissions/`,e)}Ne()}function Ne(){if(document.getElementById(`apk-simulator-modal`))return;let e=document.createElement(`div`);e.id=`apk-simulator-modal`,e.className=`
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
  `,document.body.appendChild(e),document.getElementById(`sim-close-btn`).addEventListener(`click`,$),document.getElementById(`sim-cancel-btn`).addEventListener(`click`,$),document.getElementById(`sim-form`).addEventListener(`submit`,e=>{e.preventDefault();let t=parseFloat(document.getElementById(`sim-lon`).value),n=parseFloat(document.getElementById(`sim-lat`).value),r={id:`SIM-${Date.now()}`,codigo:document.getElementById(`sim-codigo`).value,lugar:document.getElementById(`sim-lugar`).value,nombre:document.getElementById(`sim-nombre`).value,seccion:`CIA - Ingenieria (Reporte Móvil)`,tipo_trab:document.getElementById(`sim-tipo`).value,responsable:document.getElementById(`sim-resp`).value,descripcion:document.getElementById(`sim-desc`).value,coordinates:[t,n],foto:document.getElementById(`sim-foto`).value||null,video:document.getElementById(`sim-video`).value||null,f_inicio:`10/11/2026`,f_termino:`20/11/2026`,origen:`Aplicativo Android (Simulado)`,fecha_envio:new Date().toISOString()};J(r),$(),Pe(`✓ Reporte ${r.codigo} recibido y posicionado en el mapa`)})}function $(){let e=document.getElementById(`apk-simulator-modal`);e&&e.classList.add(`hidden`)}function Pe(e){let t=document.createElement(`div`);t.className=`
    fixed top-20 right-5 z-[80] bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl
    text-xs font-bold flex items-center space-x-2 animate-bounce
  `,t.textContent=e,document.body.appendChild(t),setTimeout(()=>t.remove(),4e3)}document.addEventListener(`DOMContentLoaded`,async()=>{console.log(`Inicializando Visor Cartográfico Proyecto Valkiria...`),ne({onCenterOnMap:e=>q(e)}),se({onSelectFeature:e=>q(e)}),pe({onFilterChange:e=>{console.log(`Filtro de fechas aplicado:`,e),Ce()}});let{map:e,view:t,layerInstances:n,minuscaLayer:r}=await ye(`viewDiv`);Ee({map:e,view:t,layerInstances:n,minuscaLayer:r,onMinuscaZoom:()=>W()}),await Me();let i=document.getElementById(`nav-toggle-table`);i&&i.addEventListener(`click`,()=>{le()}),console.log(`✓ Visor Valkiria listo y operativo.`)});
//# sourceMappingURL=index-7z-NMBCq.js.map