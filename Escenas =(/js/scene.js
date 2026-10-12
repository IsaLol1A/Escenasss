// 1. Cargar la animación de los personajes
const animacionPersonajes = lottie.loadAnimation({
  container: document.getElementById('lottie-personajes'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'pasillo-real/Json/interaccion.json',
  assetsPath: 'pasillo-real/Json/images/'
});

const contenedorPersonajes = document.getElementById('lottie-personajes');

// Quedarse en el fotograma 0 al cargar
animacionPersonajes.addEventListener('DOMLoaded', () => {
  animacionPersonajes.goToAndStop(0, true);
});

// 2. Al dar clic: iniciar animación y desactivar el hover/brillo
contenedorPersonajes.addEventListener('click', () => {
  // Desactivar el hover removiendo las interacciones del ratón
  contenedorPersonajes.classList.add('animando');
  
  animacionPersonajes.stop();
  animacionPersonajes.play();
});

// 3. Al terminar la animación: restaurar el hover
animacionPersonajes.addEventListener('complete', () => {
  contenedorPersonajes.classList.remove('animando');
});



const Scene = {
    flames: [],

    init() {
        this.initTorches();
        console.log("Escena y antorchas inicializadas.");
    },

    initTorches() {
        const torchIds = ['torch-left', 'torch-center', 'torch-right'];
        
        // Desfases y velocidades para darle variedad a cada llama
        const torchConfigs = [
            { speed: 1.0, offsetFrame: 0 },
            { speed: 1.15, offsetFrame: 120 },
            { speed: 0.9, offsetFrame: 250 }
        ];

        torchIds.forEach((id, index) => {
            const container = document.getElementById(id);
            if (!container) return;

            const animation = lottie.loadAnimation({
                container: container,
                renderer: 'canvas',
                loop: true,
                autoplay: true,
                path: 'pasillo-real/Json/data.json', // Ajusta esta ruta a donde tengas el archivo json
                assetsPath: 'pasillo-real/Json/imagesx/' // Ruta exacta a la carpeta con las imágenes img_0.png a img_6.png[cite: 2]
            });

            animation.addEventListener('DOMLoaded', () => {
                animation.setSpeed(torchConfigs[index].speed);
                animation.goToAndPlay(torchConfigs[index].offsetFrame, true);
            });

            this.flames.push(animation);
        });




    }
};