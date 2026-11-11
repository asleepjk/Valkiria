/**
 * Entrada Principal - Visor Web Proyecto Valkiria
 * Arquitectura modular con ArcGIS Maps SDK for JavaScript
 */

import { initMap, zoomToFeature, applyDateFilter, zoomToMinusca } from './modules/mapEngine.js';
import { initMediaDrawer } from './modules/mediaDrawer.js';
import { initAttributeTable, toggleTable } from './modules/attributeTable.js';
import { initDateFilter } from './modules/dateFilter.js';
import { initTacticalPanels } from './modules/tacticalPanels.js';
import { initLiveIngestion } from './modules/liveIngestion.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Inicializando Visor Cartográfico Proyecto Valkiria...');

  // 1. Inicializar Drawer Multimedia
  initMediaDrawer({
    onCenterOnMap: (feature) => zoomToFeature(feature)
  });

  // 2. Inicializar Tabla de Atributos Inferior
  initAttributeTable({
    onSelectFeature: (feature) => zoomToFeature(feature)
  });

  // 3. Inicializar Filtro de Fechas (dentro de su panel superior)
  initDateFilter({
    onFilterChange: (filters) => {
      console.log('Filtro de fechas aplicado:', filters);
      applyDateFilter();
    }
  });

  // 4. Inicializar Motor Cartográfico con ArcGIS Maps SDK
  const { map, view, layerInstances, minuscaLayer, zoomToFieldReports } = await initMap('viewDiv');

  // 5. Inicializar Paneles Tácticos Superiores (Capas, Mapas Base, Leyenda, Fechas)
  initTacticalPanels({
    map,
    view,
    layerInstances,
    minuscaLayer,
    onMinuscaZoom: () => zoomToMinusca(),
    onFieldReportsZoom: () => zoomToFieldReports()
  });

  // 6. Inicializar Ingesta de Reportes
  await initLiveIngestion();

  // 7. Conectar botón de la barra superior para Tabla de Atributos
  const tableBtn = document.getElementById('nav-toggle-table');
  if (tableBtn) {
    tableBtn.addEventListener('click', () => {
      toggleTable();
    });
  }

  console.log('✓ Visor Valkiria listo y operativo.');
});
