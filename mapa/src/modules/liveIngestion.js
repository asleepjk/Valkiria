/**
 * Módulo de Ingesta y Simulación de Reportes de Campo
 * Lee reportes dinámicos de data/submissions/
 */

import { addSubmissionToMap } from './mapEngine.js';

export async function initLiveIngestion() {
  // 1. Cargar submissions iniciales
  try {
    const res = await fetch('data/submissions/sample_submission.json');
    if (res.ok) {
      const sample = await res.json();
      addSubmissionToMap(sample);
    }
  } catch (e) {
    console.log('No se encontraron reportes previos en data/submissions/', e);
  }

  // 2. Crear modal de simulación de envío para pruebas en localhost
  createSimulatorModalDOM();
}

function createSimulatorModalDOM() {
  if (document.getElementById('apk-simulator-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'apk-simulator-modal';
  modal.className = `
    fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4
  `;

  modal.innerHTML = `
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
  `;

  document.body.appendChild(modal);

  // Events
  document.getElementById('sim-close-btn').addEventListener('click', closeSimulatorModal);
  document.getElementById('sim-cancel-btn').addEventListener('click', closeSimulatorModal);

  document.getElementById('sim-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const lon = parseFloat(document.getElementById('sim-lon').value);
    const lat = parseFloat(document.getElementById('sim-lat').value);

    const submission = {
      id: `SIM-${Date.now()}`,
      codigo: document.getElementById('sim-codigo').value,
      lugar: document.getElementById('sim-lugar').value,
      nombre: document.getElementById('sim-nombre').value,
      seccion: 'CIA - Ingenieria (Reporte Móvil)',
      tipo_trab: document.getElementById('sim-tipo').value,
      responsable: document.getElementById('sim-resp').value,
      descripcion: document.getElementById('sim-desc').value,
      coordinates: [lon, lat],
      foto: document.getElementById('sim-foto').value || null,
      video: document.getElementById('sim-video').value || null,
      f_inicio: '10/11/2026',
      f_termino: '20/11/2026',
      origen: 'Aplicativo Android (Simulado)',
      fecha_envio: new Date().toISOString()
    };

    addSubmissionToMap(submission);
    closeSimulatorModal();

    // Notificación toast
    showToast(`✓ Reporte ${submission.codigo} recibido y posicionado en el mapa`);
  });
}

export function openSimulatorModal() {
  const modal = document.getElementById('apk-simulator-modal');
  if (modal) modal.classList.remove('hidden');
}

export function closeSimulatorModal() {
  const modal = document.getElementById('apk-simulator-modal');
  if (modal) modal.classList.add('hidden');
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = `
    fixed top-20 right-5 z-[80] bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl
    text-xs font-bold flex items-center space-x-2 animate-bounce
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
