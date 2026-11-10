# 🛰️ Proyecto Valkiria - Visor Cartográfico Web

Visor geoespacial táctico desarrollado con **ArcGIS Maps SDK for JavaScript** y alojado de forma 100% serverless en **GitHub Pages**.

El proyecto replica la cartografía y simbología de ingeniería y operaciones EOD en la República Centroafricana (RCA), con soporte multimedia para fotografías y videos de alta resolución, tabla de atributos interactiva y filtro temporal.

---

## 🗺️ Características del Visor

- **Cartografía Fiel**: Exportación precisa de capas vectoriales desde ArcGIS Pro conservando los marcadores originales (`ING`, `Kouki`, `Benzambe`, `Sabewa`, `Bouar`, `Peouri Besson`), achurados de aeródromos y límites administrativos.
- **Ortofoto Ráster MINUSCA**: Georreferenciada con `MediaLayer` en coordenadas Web Mercator (`EPSG:3857`) con control de visibilidad y opacidad.
- **Evidencias Multimedia**: Drawer lateral con visor lightbox para fotografías y reproductor HTML5 integrado para video operativo (`Bouar3.mp4`).
- **Tabla de Atributos Inferior Colapsable**: Selector por capas, búsqueda en tiempo real, click-to-zoom con halo de selección y exportación a CSV.
- **Filtro Temporal / Fechas**: Filtrado por rangos y presets rápidos con actualización dinámica en el mapa y la tabla.
- **Galería de Mapas Base**: Conmutación instantánea entre satelital híbrido, satelital puro, topográfico, OpenStreetMap, calles y modo oscuro.

---

## 📂 Estructura del Repositorio

```text
/
├── .github/workflows/
│   └── deploy.yml            # CI/CD: Compilación y despliegue automático a GitHub Pages
├── assets/
│   ├── fotos/                # Fotografías operativas
│   └── videos/               # Videos operativos
├── mapa/
│   ├── public/
│   │   ├── assets/           # Multimedia servida al visor
│   │   ├── data/
│   │   │   ├── layers/       # GeoJSON vectoriales (WGS84)
│   │   │   ├── rasters/      # Ráster optimizado MINUSCA
│   │   │   └── submissions/  # Ingesta de reportes
│   │   └── symbols/          # Marcadores visuales PNG
│   ├── src/
│   │   ├── modules/          # Arquitectura modular JS
│   │   ├── main.js
│   │   └── style.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Despliegue en GitHub Pages

El proyecto se compila y publica automáticamente mediante GitHub Actions ante cualquier push a la rama `main`.
