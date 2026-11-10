/**
 * Configuración de simbología, capas y popups para el Visor Valkiria
 * Réplica fiel de la simbología original (PROYECTO VALKIRIA)
 */

export const LAYERS_CONFIG = [
  // ==========================================
  // CAPAS POLIGONALES (CAPA BASE / INFERIOR)
  // ==========================================
  {
    id: "zonas",
    title: "Zonas de Operación",
    group: "ELEMENTOS DE INTERES",
    file: "data/layers/zonas.geojson",
    visible: true,
    isFeature: true,
    layerType: "polygon",
    category: "ZONAS",
    renderer: {
      type: "unique-value",
      field: "ZONAS",
      defaultSymbol: {
        type: "simple-fill",
        color: [200, 200, 200, 0.3],
        outline: { color: [100, 100, 100, 1], width: 1.5 }
      },
      uniqueValueInfos: [
        {
          value: "CENTER",
          label: "CENTER",
          symbol: {
            type: "simple-fill",
            color: [255, 235, 190, 0.45],
            outline: { color: [40, 40, 40, 0.9], width: 1.8 }
          }
        },
        {
          value: "EAST",
          label: "EAST",
          symbol: {
            type: "simple-fill",
            color: [190, 210, 255, 0.45],
            outline: { color: [40, 40, 40, 0.9], width: 1.8 }
          }
        },
        {
          value: "WEST",
          label: "WEST",
          symbol: {
            type: "simple-fill",
            color: [232, 190, 255, 0.45],
            outline: { color: [40, 40, 40, 0.9], width: 1.8 }
          }
        }
      ]
    }
  },
  {
    id: "rca",
    title: "Límite República Centroafricana (RCA)",
    group: "LIMITES ADMINISTRATIVOS",
    file: "data/layers/rca.geojson",
    visible: true,
    isFeature: true,
    layerType: "polygon",
    category: "LIMITES",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
          color: [255, 0, 197, 1.0],
          width: 3.0
        }
      }
    }
  },
  {
    id: "prefectura",
    title: "Límite Prefecturas",
    group: "LIMITES ADMINISTRATIVOS",
    file: "data/layers/prefectura.geojson",
    visible: true,
    isFeature: true,
    layerType: "polygon",
    category: "LIMITES",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
          color: [255, 255, 0, 0.95],
          width: 2.0
        }
      }
    }
  },
  {
    id: "sub_prefectura",
    title: "Límite Sub Prefecturas",
    group: "LIMITES ADMINISTRATIVOS",
    file: "data/layers/sub_prefectura.geojson",
    visible: true,
    isFeature: true,
    layerType: "polygon",
    category: "LIMITES",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
          color: [76, 230, 0, 0.85],
          width: 1.2
        }
      }
    }
  },
  {
    id: "bouar_aerodromo",
    title: "Bouar Aeródromo",
    group: "TRABAJOS REALIZADOS > INGENIERIA",
    file: "data/layers/bouar_aerodromo.geojson",
    visible: true,
    isFeature: true,
    layerType: "polygon",
    category: "INGENIERIA",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        style: "diagonal-cross",
        color: [255, 0, 0, 0.35],
        outline: {
          color: [255, 0, 0, 1],
          width: 2
        }
      }
    }
  },

  // ==========================================
  // CAPAS PUNTUALES (CAPA SUPERIOR / FRONT)
  // ==========================================
  {
    id: "airport",
    title: "Aeropuertos",
    group: "ELEMENTOS DE INTERES",
    file: "data/layers/airport.geojson",
    visible: false,
    isFeature: true,
    layerType: "point",
    category: "INTERES",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: [59, 130, 246, 0.9],
        size: 7,
        outline: { color: [255, 255, 255, 1], width: 1.5 }
      }
    }
  },
  {
    id: "adminpoint",
    title: "Puntos Administrativos",
    group: "ELEMENTOS DE INTERES",
    file: "data/layers/adminpoint.geojson",
    visible: false,
    isFeature: true,
    layerType: "point",
    category: "INTERES",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        style: "diamond",
        color: [249, 115, 22, 0.9],
        size: 7,
        outline: { color: [255, 255, 255, 1], width: 1 }
      }
    }
  },
  {
    id: "sabewa",
    title: "EOD - Sabewa",
    group: "TRABAJOS REALIZADOS > EOD",
    file: "data/layers/sabewa.geojson",
    visible: true,
    isFeature: true,
    layerType: "point",
    category: "EOD",
    renderer: {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: "symbols/sabewa_marker.png",
        width: "26px",
        height: "26px"
      }
    }
  },
  {
    id: "bouar",
    title: "EOD - Bouar",
    group: "TRABAJOS REALIZADOS > EOD",
    file: "data/layers/bouar.geojson",
    visible: true,
    isFeature: true,
    layerType: "point",
    category: "EOD",
    renderer: {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: "symbols/bouar_marker.png",
        width: "26px",
        height: "26px"
      }
    }
  },
  {
    id: "peouri_besson",
    title: "EOD - Peouri Besson",
    group: "TRABAJOS REALIZADOS > EOD",
    file: "data/layers/peouri_besson.geojson",
    visible: true,
    isFeature: true,
    layerType: "point",
    category: "EOD",
    renderer: {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: "symbols/peouri_besson_marker.png",
        width: "26px",
        height: "26px"
      }
    }
  },
  {
    id: "benzambe",
    title: "EOD - Benzambe",
    group: "TRABAJOS REALIZADOS > EOD",
    file: "data/layers/benzambe.geojson",
    visible: true,
    isFeature: true,
    layerType: "point",
    category: "EOD",
    renderer: {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: "symbols/benzambe_marker.png",
        width: "26px",
        height: "26px"
      }
    }
  },
  {
    id: "kouki",
    title: "EOD - Kouki",
    group: "TRABAJOS REALIZADOS > EOD",
    file: "data/layers/kouki.geojson",
    visible: true,
    isFeature: true,
    layerType: "point",
    category: "EOD",
    renderer: {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: "symbols/kouki_marker.png",
        width: "26px",
        height: "26px"
      }
    }
  },
  {
    id: "ing",
    title: "ING - Obras de Ingeniería",
    group: "TRABAJOS REALIZADOS > INGENIERIA",
    file: "data/layers/ing.geojson",
    visible: true,
    isFeature: true,
    layerType: "point",
    category: "INGENIERIA",
    renderer: {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: "symbols/ing_marker.png",
        width: "28px",
        height: "28px"
      }
    }
  },
  {
    id: "live_submissions",
    title: "Reportes de Campo",
    group: "TRABAJOS REALIZADOS > REPORTES DE CAMPO",
    isDynamic: true,
    visible: true,
    isFeature: true,
    layerType: "point",
    category: "REPORTE DE CAMPO",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: [239, 68, 68, 0.95],
        size: 14,
        outline: {
          color: [255, 255, 255, 1],
          width: 2.5
        }
      }
    }
  }
];

export const RASTER_CONFIG = {
  id: "minusca",
  title: "Ortofoto / Ráster MINUSCA",
  file: "data/rasters/minusca.png",
  visible: false,
  opacity: 0.9,
  extentWgs84: {
    xmin: 12.0797893824399,
    ymin: -0.0656952619086617,
    xmax: 29.742398517321995,
    ymax: 13.667457656027116
  },
  extent3857: {
    xmin: 1344714.47,
    ymin: -7312.98,
    xmax: 3310903.62,
    ymax: 1535787.72
  }
};
