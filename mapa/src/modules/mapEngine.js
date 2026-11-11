/**
 * Motor Cartográfico con ArcGIS Maps SDK for JavaScript
 * Carga de capas vectoriales GeoJSON, capa ráster MINUSCA, navegación y control de eventos
 */

import { LAYERS_CONFIG, RASTER_CONFIG } from './layersConfig.js';
import { openMediaDrawer } from './mediaDrawer.js';
import { updateTableData } from './attributeTable.js';
import { matchesCurrentFilter } from './dateFilter.js';

// Módulos oficiales de Esri desde CDN
import Map from 'https://js.arcgis.com/4.31/@arcgis/core/Map.js';
import MapView from 'https://js.arcgis.com/4.31/@arcgis/core/views/MapView.js';
import GeoJSONLayer from 'https://js.arcgis.com/4.31/@arcgis/core/layers/GeoJSONLayer.js';
import MediaLayer from 'https://js.arcgis.com/4.31/@arcgis/core/layers/MediaLayer.js';
import ImageElement from 'https://js.arcgis.com/4.31/@arcgis/core/layers/support/ImageElement.js';
import ExtentAndRotationGeoreference from 'https://js.arcgis.com/4.31/@arcgis/core/layers/support/ExtentAndRotationGeoreference.js';
import Extent from 'https://js.arcgis.com/4.31/@arcgis/core/geometry/Extent.js';
import Point from 'https://js.arcgis.com/4.31/@arcgis/core/geometry/Point.js';
import Graphic from 'https://js.arcgis.com/4.31/@arcgis/core/Graphic.js';
import GraphicsLayer from 'https://js.arcgis.com/4.31/@arcgis/core/layers/GraphicsLayer.js';
import ScaleBar from 'https://js.arcgis.com/4.31/@arcgis/core/widgets/ScaleBar.js';
import Home from 'https://js.arcgis.com/4.31/@arcgis/core/widgets/Home.js';
import Fullscreen from 'https://js.arcgis.com/4.31/@arcgis/core/widgets/Fullscreen.js';

let map = null;
let view = null;
let rawGeojsonStore = {};
let layerInstances = {};
let minuscaLayerInstance = null;
let liveGraphicsLayer = null;
let highlightGraphic = null;

export async function initMap(containerId = 'viewDiv') {
  map = new Map({
    basemap: 'satellite' // Base satelital pura (imágenes aéreas de alta resolución)
  });

  // Vista centrada de forma óptima: cubre tanto la zona operativa Bouar-Kouki como la totalidad de RCA
  view = new MapView({
    container: containerId,
    map: map,
    center: [18.6, 6.6], // Centro geométrico balanceado
    zoom: 6.8, // Escala para visión de conjunto y detalle
    ui: {
      components: ['zoom', 'compass']
    }
  });

  await view.when();

  // 1. Widgets Esri de Navegación Básica
  const homeWidget = new Home({ view: view });
  view.ui.add(homeWidget, 'top-left');

  const fullscreen = new Fullscreen({ view: view });
  view.ui.add(fullscreen, 'top-left');

  const scaleBar = new ScaleBar({ view: view, unit: 'metric' });
  view.ui.add(scaleBar, 'bottom-left');

  // 2. Cargar Capas Vectoriales y Ráster en Orden Estratégico
  // Polígonos de Zonas -> Ráster MINUSCA -> Límites Administrativos -> Puntos Operativos
  await loadVectorLayers();

  // 3. Configurar Ráster MINUSCA
  setupMinuscaRaster();

  // 4. Capa para reportes de campo (Nivel superior / Topmost)
  liveGraphicsLayer = new GraphicsLayer({
    id: 'live_submissions',
    title: 'Reportes de Campo',
    visible: true
  });
  map.add(liveGraphicsLayer);
  layerInstances['live_submissions'] = liveGraphicsLayer;

  // 5. Capa para highlight de selección
  highlightGraphic = new GraphicsLayer({
    title: 'Highlight Selection',
    listMode: 'hide'
  });
  map.add(highlightGraphic);

  // 6. Configurar Eventos de Clic en el Mapa (Prioridad a puntos)
  setupMapEvents();

  return {
    map,
    view,
    layerInstances,
    minuscaLayer: minuscaLayerInstance,
    zoomToMinusca,
    zoomToFieldReports
  };
}

function setupMinuscaRaster() {
  try {
    const ext3857 = RASTER_CONFIG.extent3857;
    const imageUrl = new URL(RASTER_CONFIG.file, window.location.href).href;

    const imageElement = new ImageElement({
      image: imageUrl,
      georeference: new ExtentAndRotationGeoreference({
        extent: new Extent({
          xmin: ext3857.xmin,
          ymin: ext3857.ymin,
          xmax: ext3857.xmax,
          ymax: ext3857.ymax,
          spatialReference: { wkid: 3857 }
        })
      })
    });

    minuscaLayerInstance = new MediaLayer({
      id: RASTER_CONFIG.id,
      title: RASTER_CONFIG.title,
      source: [imageElement], // Corrección crítica: la propiedad oficial de ArcGIS SDK es source, no elements
      visible: RASTER_CONFIG.visible,
      opacity: RASTER_CONFIG.opacity
    });

    // Se agrega por encima de las zonas de fondo para que no quede tapada
    // pero debajo de los límites y puntos
    const zonasIndex = map.layers.findIndex(l => l.id === 'zonas');
    if (zonasIndex >= 0) {
      map.add(minuscaLayerInstance, zonasIndex + 1);
    } else {
      map.add(minuscaLayerInstance, 0);
    }

    minuscaLayerInstance.load().then(() => {
      console.log('✓ Ortofoto Ráster MINUSCA cargada y lista en MediaLayer.');
    }).catch(err => {
      console.warn('Aviso cargando MediaLayer MINUSCA:', err);
    });
  } catch (err) {
    console.error('Error al inicializar la capa ráster MINUSCA:', err);
  }
}

export function zoomToMinusca() {
  if (!view) return;
  const ext = RASTER_CONFIG.extent3857;

  // Si está apagada, la encendemos automáticamente para que el usuario la vea de inmediato
  if (minuscaLayerInstance && !minuscaLayerInstance.visible) {
    minuscaLayerInstance.visible = true;
    const chk = document.getElementById('layer-chk-minusca');
    if (chk) chk.checked = true;
  }

  view.goTo({
    target: new Extent({
      xmin: ext.xmin,
      ymin: ext.ymin,
      xmax: ext.xmax,
      ymax: ext.ymax,
      spatialReference: { wkid: 3857 }
    })
  }, { duration: 1000 });
}

async function loadVectorLayers() {
  // Recorrer en orden estricto de LAYERS_CONFIG: Polígonos primero, Puntos después
  for (const cfg of LAYERS_CONFIG) {
    if (!cfg.file) continue;

    try {
      const res = await fetch(cfg.file);
      const geojson = await res.json();
      rawGeojsonStore[cfg.id] = geojson;

      const blob = new Blob([JSON.stringify(geojson)], { type: 'application/json' });
      const blobUrl = URL.createObjectURL(blob);

      const layerProps = {
        id: cfg.id,
        title: cfg.title,
        url: blobUrl,
        visible: cfg.visible,
        renderer: cfg.renderer,
        outFields: ['*']
      };

      if (cfg.labelingInfo) {
        layerProps.labelingInfo = cfg.labelingInfo;
      }

      const layer = new GeoJSONLayer(layerProps);

      map.add(layer);
      layerInstances[cfg.id] = layer;

      // Alimentar tabla de atributos inicial
      if (geojson.features && geojson.features.length > 0) {
        updateTableData(cfg.id, geojson.features, cfg.title);
      }
    } catch (e) {
      console.warn(`Error al cargar capa ${cfg.id}:`, e);
    }
  }
}

function setupMapEvents() {
  view.on('click', async (event) => {
    const response = await view.hitTest(event);
    if (!response.results || response.results.length === 0) return;

    const validResults = response.results.filter(
      r => r.graphic && r.graphic.layer && r.graphic.layer !== highlightGraphic
    );
    if (validResults.length === 0) return;

    // Priorizar puntos estrictamente sobre polígonos
    validResults.sort((a, b) => {
      const aGeom = a.graphic.geometry ? a.graphic.geometry.type : '';
      const bGeom = b.graphic.geometry ? b.graphic.geometry.type : '';

      if (aGeom === 'point' && bGeom !== 'point') return -1;
      if (bGeom === 'point' && aGeom !== 'point') return 1;

      const aId = a.graphic.layer.id || '';
      const bId = b.graphic.layer.id || '';
      const isPriorityA = aId === 'ing' || aId === 'kouki' || aId === 'benzambe' || aId === 'live_submissions';
      const isPriorityB = bId === 'ing' || bId === 'kouki' || bId === 'benzambe' || bId === 'live_submissions';
      if (isPriorityA && !isPriorityB) return -1;
      if (!isPriorityA && isPriorityB) return 1;

      return 0;
    });

    const topHit = validResults[0];
    const graphic = topHit.graphic;
    const layer = graphic.layer;
    const cfg = LAYERS_CONFIG.find(c => c.id === layer.id) || {};

    // Manejo específico para la capa de Aeropuertos: Popup táctico flotante
    if (layer.id === 'airport') {
      highlightFeature(graphic.geometry);
      const geom = graphic.geometry;
      const lon = geom.longitude !== undefined ? geom.longitude : (geom.x !== undefined ? geom.x : 0);
      const lat = geom.latitude !== undefined ? geom.latitude : (geom.y !== undefined ? geom.y : 0);
      const name = graphic.attributes?.Name || 'PISTA NO ESPECIFICADA';
      const oid = graphic.attributes?.OID || graphic.attributes?.OBJECTID || '-';

      const dmsLon = toDMS(lon, false);
      const dmsLat = toDMS(lat, true);

      view.openPopup({
        title: `✈️ AERÓDROMO: ${name}`,
        location: geom,
        content: `
          <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #f1f5f9; background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155; line-height: 1.5;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px;">
              <span style="color: #38bdf8; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">Identificador</span>
              <span style="background: rgba(56, 189, 248, 0.2); color: #7dd3fc; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid rgba(56, 189, 248, 0.4);">ID #${oid}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 600;">Nombre de Pista / Aeródromo:</div>
              <div style="color: #ffffff; font-weight: 700; font-size: 14px;">${name}</div>
            </div>
            <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid #1e293b; border-radius: 6px; padding: 8px;">
              <div style="color: #94a3b8; font-size: 10px; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Coordenadas WGS84:</div>
              <div style="color: #4ade80; font-weight: 600; font-size: 11px;">DD: ${lat.toFixed(5)}°, ${lon.toFixed(5)}°</div>
              <div style="color: #cbd5e1; font-size: 11px; margin-top: 2px;">DMS: ${dmsLat}, ${dmsLon}</div>
            </div>
          </div>
        `
      });
      return;
    }

    const featureData = {
      properties: graphic.attributes,
      geometry: graphic.geometry,
      category: cfg.category || (graphic.geometry.type === 'point' ? 'PUNTO OPERATIVO' : 'POLÍGONO'),
      layerId: layer.id
    };

    highlightFeature(graphic.geometry);
    openMediaDrawer(featureData);
  });
}

function toDMS(deg, isLat) {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  const direction = deg >= 0 ? (isLat ? 'N' : 'E') : (isLat ? 'S' : 'W');
  return `${degrees}°${minutes}'${seconds}" ${direction}`;
}

export function highlightFeature(geometry) {
  if (!highlightGraphic) return;
  highlightGraphic.removeAll();
  if (!geometry) return;

  let sym = null;
  if (geometry.type === 'point') {
    sym = {
      type: 'simple-marker',
      style: 'circle',
      color: [0, 255, 255, 0],
      size: 32,
      outline: {
        color: [0, 255, 255, 1],
        width: 3
      }
    };
  } else {
    sym = {
      type: 'simple-fill',
      color: [0, 255, 255, 0.25],
      outline: {
        color: [0, 255, 255, 1],
        width: 3
      }
    };
  }

  highlightGraphic.add(new Graphic({ geometry, symbol: sym }));
}

export function zoomToFeature(feature) {
  if (!view || !feature) return;

  let geom = null;
  if (feature.geometry && feature.geometry.type === 'Point' && feature.geometry.coordinates) {
    const [lon, lat] = feature.geometry.coordinates;
    geom = new Point({ longitude: lon, latitude: lat });
    view.goTo({ target: geom, zoom: 14 }, { duration: 800 });
  } else if (feature.geometry && feature.geometry.latitude) {
    geom = feature.geometry;
    view.goTo({ target: geom, zoom: 14 }, { duration: 800 });
  } else if (feature.geometry && feature.geometry.coordinates) {
    const coords = feature.geometry.coordinates[0];
    if (coords && coords.length > 0) {
      const [lon, lat] = coords[0];
      view.goTo({ target: new Point({ longitude: lon, latitude: lat }), zoom: 13 }, { duration: 800 });
    }
  }

  if (geom) highlightFeature(geom);
  openMediaDrawer(feature);
}

export function applyDateFilter() {
  Object.keys(rawGeojsonStore).forEach(layerId => {
    const raw = rawGeojsonStore[layerId];
    if (!raw || !raw.features) return;

    const filtered = raw.features.filter(feat => matchesCurrentFilter(feat));
    const cfg = LAYERS_CONFIG.find(c => c.id === layerId);
    updateTableData(layerId, filtered, cfg ? cfg.title : layerId);

    const layer = layerInstances[layerId];
    if (layerId === 'live_submissions' && liveGraphicsLayer) {
      liveGraphicsLayer.removeAll();
      filtered.forEach(feat => {
        const p = feat.properties || {};
        const coords = feat.geometry && feat.geometry.coordinates ? feat.geometry.coordinates : null;
        if (!coords) return;
        const [lon, lat] = coords;
        const geom = new Point({ longitude: lon, latitude: lat });
        const marker = new Graphic({
          geometry: geom,
          symbol: {
            type: 'simple-marker',
            style: 'circle',
            color: [239, 68, 68, 0.95],
            size: 18,
            outline: { color: [255, 255, 255, 1], width: 2.5 }
          },
          attributes: p
        });
        const label = new Graphic({
          geometry: geom,
          symbol: {
            type: 'text',
            color: [255, 255, 255, 1],
            haloColor: [153, 27, 27, 0.95],
            haloSize: 2,
            text: p.LUGAR || p.CODIGO || 'Punto Valkiria',
            font: { size: 10, weight: 'bold', family: 'Arial, sans-serif' },
            yoffset: 15
          },
          attributes: p
        });
        liveGraphicsLayer.addMany([marker, label]);
      });
    } else if (layer && typeof layer.refresh === 'function') {
      const blob = new Blob([JSON.stringify({ type: 'FeatureCollection', features: filtered })], { type: 'application/json' });
      layer.url = URL.createObjectURL(blob);
      layer.refresh();
    }
  });
}

export function addSubmissionToMap(submission) {
  if (!liveGraphicsLayer || !submission.coordinates) return;

  const [lon, lat] = submission.coordinates;
  const geom = new Point({ longitude: lon, latitude: lat });

  const symbol = {
    type: 'simple-marker',
    style: 'circle',
    color: [239, 68, 68, 0.95],
    size: 18,
    outline: {
      color: [255, 255, 255, 1],
      width: 2.5
    }
  };

  const attributes = {
    CODIGO: submission.codigo || submission.id,
    NOMBRE: submission.nombre,
    LUGAR: submission.lugar,
    SECCION: submission.seccion || 'Reporte de Campo',
    TIPO_TRAB: submission.tipo_trab,
    TASK_ORDER: submission.task_order,
    RESPONSABLE: submission.responsable,
    DESCRIPCION: submission.descripcion,
    RECURSOS: submission.recursos,
    F_INICIO: submission.f_inicio,
    F_TERMINO: submission.f_termino,
    FOTO: submission.foto,
    FOTO_2: submission.foto_2,
    VIDEO: submission.video,
    JEFE_TOB: submission.jefe_tob,
    TELEFONO: submission.telefono,
    PERSONAL: submission.personal,
    MAQUINARIA: submission.maquinaria,
    OCURRENCIAS: submission.ocurrencias,
    ALTITUD: submission.altitud,
    PRECISION_M: submission.precision_m,
    DMS: submission.dms,
    FECHA: submission.fecha_envio,
    fecha_envio: submission.fecha_envio || new Date().toISOString()
  };

  const markerGraphic = new Graphic({
    geometry: geom,
    symbol: symbol,
    attributes: attributes
  });

  const labelGraphic = new Graphic({
    geometry: geom,
    symbol: {
      type: 'text',
      color: [255, 255, 255, 1],
      haloColor: [153, 27, 27, 0.95],
      haloSize: 2,
      text: submission.lugar || submission.codigo || 'Punto Valkiria',
      font: { size: 10, weight: 'bold', family: 'Arial, sans-serif' },
      yoffset: 15
    },
    attributes: attributes
  });

  liveGraphicsLayer.addMany([markerGraphic, labelGraphic]);

  const liveFeature = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lon, lat] },
    properties: attributes,
    category: 'REPORTE DE CAMPO'
  };

  const currentLive = rawGeojsonStore['live_submissions'] || { features: [] };
  currentLive.features.push(liveFeature);
  rawGeojsonStore['live_submissions'] = currentLive;
  updateTableData('live_submissions', currentLive.features, 'Reportes de Campo');

  return markerGraphic;
}

export function zoomToFieldReports() {
  if (!view || !liveGraphicsLayer || liveGraphicsLayer.graphics.length === 0) return false;

  const pointGraphics = liveGraphicsLayer.graphics.filter(g => g.geometry && g.geometry.type === 'point');
  if (pointGraphics.length === 0) return false;

  const markers = pointGraphics.filter(g => g.symbol && g.symbol.type === 'simple-marker');
  const targets = markers.length > 0 ? markers : pointGraphics;

  if (targets.length === 1) {
    view.goTo({ target: targets.getItemAt(0).geometry, zoom: 16 }, { duration: 1000 });
    return true;
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  targets.forEach(g => {
    const lon = g.geometry.longitude !== undefined ? g.geometry.longitude : g.geometry.x;
    const lat = g.geometry.latitude !== undefined ? g.geometry.latitude : g.geometry.y;
    if (lon < minX) minX = lon;
    if (lon > maxX) maxX = lon;
    if (lat < minY) minY = lat;
    if (lat > maxY) maxY = lat;
  });

  if (Math.abs(maxX - minX) < 0.0002 && Math.abs(maxY - minY) < 0.0002) {
    view.goTo({ target: targets.getItemAt(0).geometry, zoom: 16 }, { duration: 1000 });
    return true;
  }

  const ext = new Extent({
    xmin: minX,
    ymin: minY,
    xmax: maxX,
    ymax: maxY,
    spatialReference: { wkid: 4326 }
  });

  view.goTo(ext.expand(1.6), { duration: 1000 });
  return true;
}
