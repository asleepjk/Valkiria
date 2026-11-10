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
    basemap: 'hybrid' // Base satelital con vías y nombres
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
    zoomToMinusca
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

      const layer = new GeoJSONLayer({
        id: cfg.id,
        title: cfg.title,
        url: blobUrl,
        visible: cfg.visible,
        renderer: cfg.renderer,
        outFields: ['*']
      });

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
    if (layer) {
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
    size: 16,
    outline: {
      color: [255, 255, 255, 1],
      width: 2.5
    }
  };

  const graphic = new Graphic({
    geometry: geom,
    symbol: symbol,
    attributes: {
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
      fecha_envio: submission.fecha_envio || new Date().toISOString()
    }
  });

  liveGraphicsLayer.add(graphic);

  const liveFeature = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lon, lat] },
    properties: graphic.attributes,
    category: 'REPORTE DE CAMPO'
  };

  const currentLive = rawGeojsonStore['live_submissions'] || { features: [] };
  currentLive.features.push(liveFeature);
  rawGeojsonStore['live_submissions'] = currentLive;
  updateTableData('live_submissions', currentLive.features, 'Reportes de Campo');

  return graphic;
}
