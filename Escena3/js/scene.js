document.addEventListener('DOMContentLoaded', () => {

  const animacionAmog = lottie.loadAnimation({
    container: document.getElementById('lottie-amog'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'Guerra/Json/amog.json', // Ajusta la ruta si está dentro de una carpeta
    assetsPath: 'Guerra/Json/images/'
  });

  const contenedorAmog = document.getElementById('lottie-amog');
  let amogActivo = false;

  // Define aquí el rango de fotogramas que quieres que se repitan en bucle
  // (Por ejemplo, del fotograma 30 al 90, o los que correspondan al movimiento de la capa)
  const inicioBucle = 60; 
  const finBucle = 90;

  // Iniciar pausado en el fotograma 0
  animacionAmog.addEventListener('DOMLoaded', () => {
    animacionAmog.goToAndStop(0, true);
  });

  // Al hacer clic: reproduce la animación desde el principio por primera vez
  contenedorAmog.addEventListener('click', () => {
    if (!amogActivo) {
      amogActivo = true;
      contenedorAmog.classList.add('animando');
      animacionAmog.play();
    }
  });

  // Controlar el bucle por segmentos al avanzar los fotogramas
  animacionAmog.addEventListener('enterFrame', (e) => {
    if (amogActivo) {
      // Si pasa del fotograma donde termina el bucle deseado, lo devolvemos al inicio del bucle
      if (animacionAmog.currentFrame >= finBucle) {
        animacionAmog.goToAndPlay(inicioBucle, true);
      }
    }
  });


// =============================================================
  // CARGA AUTOMÁTICA DE LAS 6 LLAMAS CON DESFASE INDEPENDIENTE
  // =============================================================
  const idsFuegos = [
    'lottie-llamas-1', 
    'lottie-llamas-2', 
    'lottie-llamas-3', 
    'lottie-llamas-4', 
    'lottie-llamas-5', 
    'lottie-llamas-6'
  ];

  idsFuegos.forEach((idContenedor) => {
    const elemento = document.getElementById(idContenedor);
    if (!elemento) return;

    const animLlama = lottie.loadAnimation({
      container: elemento,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'Guerra/Json/llama.json',      // Asegúrate de la ruta de tu JSON
      assetsPath: 'Guerra/Json/imagesx/'    // Ruta de la carpeta de imágenes del Lottie
    });

    // Desfasar el fotograma de inicio aleatoriamente para que comiencen diferente
    animLlama.addEventListener('config_ready', () => {
      const fotogramaAleatorio = Math.floor(Math.random() * 300);
      animLlama.goToAndPlay(fotogramaAleatorio, true);
    });
  });


  // =============================================================
  // SISTEMA DE PARTÍCULAS MULTI-ZONA (Castillo + Esquina Inf-Der + Esquina Sup-Izq)
  // =============================================================
  const canvas = document.getElementById('canvas-cenizas');
  const ctx = canvas.getContext('2d');

  function ajustarTamanoCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  ajustarTamanoCanvas();
  window.addEventListener('resize', ajustarTamanoCanvas);

  const numeroParticulas = 60; // Total de partículas repartidas en las zonas
  const particulas = [];

  class ParticulaCeniza {
    constructor() {
      this.reset();
    }

    reset() {
      // Definimos 3 zonas de origen diferentes
      const zona = Math.floor(Math.random() * 3);

      if (zona === 0) {
        // ZONA 1: Alrededor del Castillo (Superior Derecha) -> right: 20%, top: 3%, width: 440px
        const anchoCastillo = 440;
        const xCastillo = canvas.width * (1 - 0.20) - anchoCastillo;
        const yCastillo = canvas.height * 0.03;

        this.x = xCastillo + Math.random() * anchoCastillo;
        this.y = yCastillo + 350 + (Math.random() * 40 - 20); // Nace en la base del castillo
        this.velocidadY = Math.random() * 1.0 + 0.4;
        this.velocidadX = (Math.random() - 0.5) * 0.6;

      } else if (zona === 1) {
        // ZONA 2: Esquina Inferior Derecha
        this.x = canvas.width - (Math.random() * 400); // Cerca del borde derecho
        this.y = canvas.height + Math.random() * 20;   // Nace abajo
        this.velocidadY = Math.random() * 1.2 + 0.5;   // Sube hacia arriba
        this.velocidadX = -Math.random() * 0.8 - 0.2;  // Se desvía hacia la izquierda por el viento

      } else {
        // ZONA 3: Esquina Superior Izquierda
        this.x = Math.random() * 400;                  // Cerca del borde izquierdo
        this.y = canvas.height * 0.1 + Math.random() * 100; // Zona alta izquierda
        this.velocidadY = Math.random() * 0.8 + 0.3;   // Movimiento más flotante
        this.velocidadX = Math.random() * 0.8;         // Se desvía hacia la derecha
      }

      this.tamano = Math.random() * 2.5 + 1; 
      this.opacidad = Math.random() * 0.8 + 0.2;
      this.parpadeo = Math.random() * 0.02 + 0.005; 
      
      const colores = [
        '255, 120, 30',  // Naranja fuego
        '255, 60, 20',   // Rojo chispa
        '255, 180, 50',  // Amarillo incandescente
        '180, 180, 180'  // Ceniza gris
      ];
      this.color = colores[Math.floor(Math.random() * colores.length)];
    }

    actualizar() {
      this.y -= this.velocidadY;
      this.x += this.velocidadX + Math.sin(this.y * 0.03) * 0.3; 
      this.opacidad -= this.parpadeo;

      // Si suben demasiado o se apagan, se reciclan en su zona de origen
      if (this.y < -20 || this.opacidad <= 0 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }

    dibujar() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.tamano, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacidad})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.fill();
    }
  }

  // Inicializar partículas
  for (let i = 0; i < numeroParticulas; i++) {
    const p = new ParticulaCeniza();
    p.y = Math.random() * canvas.height; // Distribuir por la pantalla al inicio
    particulas.push(p);
  }

  function animarCenizas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particulas.forEach(p => {
      p.actualizar();
      p.dibujar();
    });
    requestAnimationFrame(animarCenizas);
  }

  animarCenizas();


});

