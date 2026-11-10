/**
 * Mapeo y resolución de archivos multimedia (fotos y videos) desde los atributos de ArcGIS
 */

const KNOWN_PHOTOS = {
  'bouar1': 'assets/fotos/Bouar1.jpeg',
  'bouar1.jpeg': 'assets/fotos/Bouar1.jpeg',
  'bouar1.jpg': 'assets/fotos/Bouar1.jpeg',
  'bouar2': 'assets/fotos/Bouar2.jpeg',
  'bouar2.jpeg': 'assets/fotos/Bouar2.jpeg',
  'bouar2.jpg': 'assets/fotos/Bouar2.jpeg',
  'kouki': 'assets/fotos/Kouki.jpg',
  'kouki.jpg': 'assets/fotos/Kouki.jpg',
  'benzambe': 'assets/fotos/Benzambe.jpg',
  'benzambe.jpg': 'assets/fotos/Benzambe.jpg'
};

const KNOWN_VIDEOS = {
  'bouar3': 'assets/videos/Bouar3.mp4',
  'bouar3.mp4': 'assets/videos/Bouar3.mp4'
};

export function resolvePhotoUrl(filename) {
  if (!filename) return null;
  const trimmed = String(filename).trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  const key = trimmed.toLowerCase();
  if (KNOWN_PHOTOS[key]) {
    return KNOWN_PHOTOS[key];
  }
  if (key.endsWith('.jpg') || key.endsWith('.jpeg') || key.endsWith('.png') || key.endsWith('.webp')) {
    return `assets/fotos/${trimmed}`;
  }
  // Intentar con jpg por defecto
  return `assets/fotos/${trimmed}.jpg`;
}

export function resolveVideoUrl(filename) {
  if (!filename) return null;
  const trimmed = String(filename).trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const key = trimmed.toLowerCase();
  if (KNOWN_VIDEOS[key]) {
    return KNOWN_VIDEOS[key];
  }
  if (key.endsWith('.mp4') || key.endsWith('.webm') || key.endsWith('.mov')) {
    return `assets/videos/${trimmed}`;
  }
  return `assets/videos/${trimmed}.mp4`;
}
