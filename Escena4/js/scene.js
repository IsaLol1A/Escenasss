document.addEventListener('DOMContentLoaded', () => {
  const areaEnemigos = document.getElementById('area-enemigos');
  const espada = document.getElementById('espada-jugador');
  const txtVidas = document.getElementById('vidas');
  const txtMarcador = document.getElementById('marcador');
  const pantallaFin = document.getElementById('pantalla-fin');
  const tituloFin = document.getElementById('titulo-fin');
  const btnReiniciar = document.getElementById('btn-reiniciar');
  const btnSiguiente = document.getElementById('btn-siguiente');

  let vidas = 3;
  let derrotados = 0;
  let juegoActivo = true;
  let intervaloEnemigos;

  // Función para ejecutar la animación de la espada
  function darTajo() {
    espada.classList.remove('atacando');
    void espada.offsetWidth; // Truco para reiniciar la animación CSS al instante
    espada.classList.add('atacando');
    setTimeout(() => {
      espada.classList.remove('atacando');
    }, 100);
  }

  // Clic general en la pantalla: la espada SIEMPRE ataca pase lo que pase
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

    // Elegir aleatoriamente entre 2 carriles: 0 = Izquierda, 1 = Centro
    const carril = Math.floor(Math.random() * 2);
    
    // Variación aleatoria de altura para que no salgan exactamente en el mismo pixel vertical
    const alturaAleatoria = 45 + Math.floor(Math.random() * 15); // Entre 45% y 60%
    enemigo.style.top = `${alturaAleatoria}%`;

    if (carril === 0) {
      // Lado Izquierdo (con un rango aleatorio de posición horizontal)
      const posX = 15 + Math.random() * 20; // Entre 15% y 35%
      enemigo.style.left = `${posX}%`;
    } else {
      // Centro (con un rango aleatorio alrededor del medio)
      const posX = 45 + Math.random() * 20; // Entre 45% y 65%
      enemigo.style.left = `${posX}%`;
    }

    // Al hacer clic DIRECTAMENTE en el enemigo
    enemigo.addEventListener('click', () => {
      if (!juegoActivo) return;

      derrotados++;
      actualizarHUD();
      enemigo.remove();

      if (derrotados >= 5) {
        terminarJuego(true);
      }
    });

    // Si el enemigo termina su animación sin ser derrotado, quita una vida
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
    pantallaFin.classList.add('oculto');
    btnReiniciar.classList.add('oculto');
    btnSiguiente.classList.add('oculto');
    actualizarHUD();

    // Generar enemigos cada 1.8 segundos
    intervaloEnemigos = setInterval(crearEnemigo, 1800);
  }

  function terminarJuego(ganado) {
    juegoActivo = false;
    clearInterval(intervaloEnemigos);
    areaEnemigos.innerHTML = '';

    if (ganado) {
      tituloFin.textContent = "¡VICTORIA!";
      tituloFin.style.color = "#5cb85c";
      btnSiguiente.classList.remove('oculto'); // Muestra el botón de avanzar
      btnReiniciar.classList.add('oculto');
    } else {
      tituloFin.textContent = "¡DERROTA!";
      tituloFin.style.color = "#d9534f";
      btnReiniciar.classList.remove('oculto'); // Muestra el botón de reintentar
      btnSiguiente.classList.add('oculto');
    }

    pantallaFin.classList.remove('oculto');
  }

  // Evento para el botón de reintentar (reinicia el minijuego)
  btnReiniciar.addEventListener('click', iniciarJuego);

  // Evento para el botón de siguiente escena (aquí puedes cambiar la ruta o la función cuando pases a la siguiente parte de tu cómic)
  btnSiguiente.addEventListener('click', () => {
    alert("¡Aquí puedes programar el enlace o la función para ir a la siguiente escena de tu cómic!");
    // Ejemplo: window.location.href = "siguiente_escena.html";
  });

  // Iniciar por primera vez
  iniciarJuego();
});