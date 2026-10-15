document.addEventListener('DOMContentLoaded', () => {
  const areaEnemigos = document.getElementById('area-enemigos');
  const espada = document.getElementById('espada-jugador');
  const txtVidas = document.getElementById('vidas');
  const txtMarcador = document.getElementById('marcador');
  const pantallaInicio = document.getElementById('pantalla-inicio');
  const btnIniciarJuego = document.getElementById('btn-iniciar-juego');
  const pantallaFin = document.getElementById('pantalla-fin');
  const tituloFin = document.getElementById('titulo-fin');
  const btnReiniciar = document.getElementById('btn-reiniciar');
  const btnSiguiente = document.getElementById('btn-siguiente');

  let vidas = 3;
  let derrotados = 0;
  let juegoActivo = false;
  let intervaloEnemigos;

  // Animación de ataque de la espada
  function darTajo() {
    espada.classList.remove('atacando');
    void espada.offsetWidth;
    espada.classList.add('atacando');
    setTimeout(() => {
      espada.classList.remove('atacando');
    }, 100);
  }

  // Clic general en la pantalla
  window.addEventListener('click', () => {
    if (!juegoActivo) return;
    darTajo();
  });

  function actualizarHUD() {
    let corazones = '❤️'.repeat(vidas);
    txtVidas.textContent = `Vidas: ${corazones}`;
    txtMarcador.textContent = `Derrotados: ${derrotados} / 5`;
  }

  function crearEnemigo() {
    if (!juegoActivo) return;

    const enemigo = document.createElement('img');
    enemigo.src = 'Pelea/Imagenez/enemigo.png';
    enemigo.classList.add('enemigo');

    // DIFICULTAD: 35% de probabilidad de que sea un enemigo RÁPIDO
    const esRapido = Math.random() < 0.35;
    if (esRapido) {
      enemigo.classList.add('enemigo-rapido');
    }

    const carril = Math.floor(Math.random() * 2);
    const alturaAleatoria = 45 + Math.floor(Math.random() * 15);
    enemigo.style.top = `${alturaAleatoria}%`;

    if (carril === 0) {
      const posX = 15 + Math.random() * 20;
      enemigo.style.left = `${posX}%`;
    } else {
      const posX = 45 + Math.random() * 20;
      enemigo.style.left = `${posX}%`;
    }

    // Al hacer clic sobre el enemigo (recibimos el evento 'e')
    enemigo.addEventListener('click', (e) => {
      if (!juegoActivo) return;

      // Crear el efecto de sangrado dinámicamente en JS
      const impacto = document.createElement('div');
      impacto.classList.add('efecto-impacto');

      const rectArea = areaEnemigos.getBoundingClientRect();
      const x = e.clientX - rectArea.left;
      const y = e.clientY - rectArea.top;

      impacto.style.left = `${x}px`;
      impacto.style.top = `${y}px`;

      areaEnemigos.appendChild(impacto);

      setTimeout(() => {
        impacto.remove();
      }, 300);

      derrotados++;
      actualizarHUD();
      enemigo.remove();

      if (derrotados >= 5) {
        terminarJuego(true);
      }
    });

    enemigo.addEventListener('animationend', () => {
      if (!juegoActivo) return;
      vidas--;
      actualizarHUD();
      enemigo.remove();

      if (vidas <= 0) {
        terminarJuego(false);
      }
    });

    areaEnemigos.appendChild(enemigo);
  }

  function iniciarJuego() {
    vidas = 3;
    derrotados = 0;
    juegoActivo = true;
    areaEnemigos.innerHTML = '';
    pantallaInicio.classList.add('oculto');
    pantallaFin.classList.add('oculto');
    btnReiniciar.classList.add('oculto');
    btnSiguiente.classList.add('oculto');
    actualizarHUD();

    clearInterval(intervaloEnemigos);
    intervaloEnemigos = setInterval(crearEnemigo, 1800);
  }

  function terminarJuego(ganado) {
    juegoActivo = false;
    clearInterval(intervaloEnemigos);
    areaEnemigos.innerHTML = '';

    if (ganado) {
      tituloFin.textContent = "¡VICTORIA!";
      tituloFin.style.color = "#5cb85c";
      btnSiguiente.classList.remove('oculto');
      btnReiniciar.classList.add('oculto');
    } else {
      tituloFin.textContent = "¡DERROTA!";
      tituloFin.style.color = "#d9534f";
      btnReiniciar.classList.remove('oculto');
      btnSiguiente.classList.add('oculto');
    }

    pantallaFin.classList.remove('oculto');
  }

  btnIniciarJuego.addEventListener('click', iniciarJuego);
  btnReiniciar.addEventListener('click', iniciarJuego);

  btnSiguiente.addEventListener('click', () => {
    alert("¡Avanzando a la siguiente escena del cómic!");
  });
});