// =============================================================
  // 1. MÁQUINA DE IMPRENTA (Una sola reproducción por clic y para)
  // =============================================================
  const animacionImprenta = lottie.loadAnimation({
    container: document.getElementById('lottie-imprenta'),
    renderer: 'svg',
    loop: false,     /* Estrictamente SIN bucle */
    autoplay: false, /* Estrictamente pausada al inicio */
    path: 'Imprenta/Json/Maquina.json',
    assetsPath: 'Imprenta/Json/images/'
  });

  const contenedorImprenta = document.getElementById('lottie-imprenta');

  // Asegurar que inicie pausada en el fotograma 0
  animacionImprenta.addEventListener('DOMLoaded', () => {
    animacionImprenta.goToAndStop(0, true);
  });

  // Evento Clic: Reproduce UNA sola vez
  contenedorImprenta.addEventListener('click', () => {
    contenedorImprenta.classList.add('animando');
    animacionImprenta.loop = false; // Refuerza que NO se repita
    animacionImprenta.stop();
    animacionImprenta.play();
  });

  // Al terminar la animación: Se detiene y reestablece el hover
  animacionImprenta.addEventListener('complete', () => {
    contenedorImprenta.classList.remove('animando');
    animacionImprenta.goToAndStop(0, true); // Vuelve al estado inicial listo para otro clic
  });


  document.addEventListener('DOMContentLoaded', () => {

 
 // =============================================================
  // 2. PERSONAJES INTERACTIVOS (Gutenberg y León) - Bucle infinito forzado
  // =============================================================
  const animacionPersonajes = lottie.loadAnimation({
    container: document.getElementById('lottie-personajes'),
    renderer: 'svg',
    loop: false,        // Lo manejamos manualmente para evitar bloqueos
    autoplay: false,
    path: 'Imprenta/Json/Interaccion.json',
    assetsPath: 'Imprenta/Json/imagesc/'
  });

  const contenedorPersonajes = document.getElementById('lottie-personajes');
  let personajesActivos = false; // Bandera para saber si ya se hizo clic

  animacionPersonajes.addEventListener('DOMLoaded', () => {
    animacionPersonajes.goToAndStop(0, true);
  });

  // Al hacer clic: arranca la animación por primera vez
  contenedorPersonajes.addEventListener('click', () => {
    if (!personajesActivos) {
      personajesActivos = true;
      animacionPersonajes.play();
    }
  });

  // Cuando llega al final (fotograma 125), salta de inmediato al fotograma 0 y se repite
  animacionPersonajes.addEventListener('complete', () => {
    if (personajesActivos) {
      animacionPersonajes.goToAndPlay(0, true);
    }
  });

  // =============================================================
  // 3. SIRVIENTA (Inicia en bucle automático al cargar)
  // =============================================================
  // =============================================================
  // 3. SIRVIENTA (Inicia con cirvienta1 y cambia a Cirvientados al hacer clic)
  // =============================================================
  const contenedorSirvienta = document.getElementById('lottie-sirvienta');
  let animacionSirvienta = null;

  function cargarAnimacionSirvienta(archivoJson, esBucle) {
    if (animacionSirvienta) animacionSirvienta.destroy();

    animacionSirvienta = lottie.loadAnimation({
      container: contenedorSirvienta,
      renderer: 'svg',
      loop: esBucle,
      autoplay: true,
      path: archivoJson,
      assetsPath: 'Imprenta/Json/imagesuno/'
    });
  }

  // Iniciar al cargar la escena con cirvienta1 en bucle
  cargarAnimacionSirvienta('Imprenta/Json/Cirvientauno.json', true);

  // Al hacer clic: cambia a Cirvientados.json (puedes decidir si quieres loop: true o false)
  contenedorSirvienta.addEventListener('click', () => {
    contenedorSirvienta.classList.add('animando');
    
    // Cargamos la segunda animación al dar clic
    cargarAnimacionSirvienta('Imprenta/Json/Cirvientados.json', false); // Pon 'true' si quieres que se repita en bucle

    // Si pusiste loop: false, al terminar regresa a cirvienta1
    animacionSirvienta.addEventListener('complete', () => {
      contenedorSirvienta.classList.remove('animando');
      cargarAnimacionSirvienta('Imprenta/Json/Cirvientauno.json', true);
    });
  });

});