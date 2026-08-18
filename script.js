/* =====================================================
   ¿QUIÉN SABE MÁS? — EL RETO DEL MILLÓN
   Lógica del juego
   ===================================================== */

// Escalera de premios (20 niveles). Los índices 4 y 9 (preguntas 5 y 10)
// son "niveles de seguridad": si el jugador falla después de alcanzarlos,
// se lleva ese premio en vez de irse con $0.
const ESCALERA = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000,
  2000000, 4000000, 8000000, 16000000, 32000000
];
const NIVELES_SEGUROS = [4, 9]; // índices 0-based (pregunta 5 y pregunta 10)
const TOTAL_PREGUNTAS = 20;

const formatoMoneda = n => '$' + n.toLocaleString('es-CO');

// Estado del juego
let bancoPreguntas = [];
let preguntasPartida = [];
let indiceActual = 0;
let respondiendo = false;
let comodinesUsados = { cincuenta: false, retirar: false };

// ---------- Elementos ----------
const pantallas = {
  inicio: document.getElementById('pantalla-inicio'),
  reglas: document.getElementById('pantalla-reglas'),
  juego: document.getElementById('pantalla-juego'),
  final: document.getElementById('pantalla-final'),
};

function mostrarPantalla(nombre){
  Object.values(pantallas).forEach(p => p.classList.remove('activa'));
  pantallas[nombre].classList.add('activa');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- Carga del banco de preguntas ----------
async function cargarBanco(){
  const res = await fetch('js/questions.json');
  const data = await res.json();
  bancoPreguntas = data.preguntas;
  document.getElementById('conteo-preguntas').textContent = bancoPreguntas.length;
  if (bancoPreguntas.length < TOTAL_PREGUNTAS) {
    console.warn('El banco de preguntas tiene menos de 20 preguntas. Agrega más en js/questions.json.');
  }
}

// Baraja un arreglo (Fisher-Yates) y toma N elementos únicos sin repetir
function elegirPreguntasAlAzar(banco, cantidad){
  const copia = [...banco];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  // Ordena aproximadamente por dificultad ascendente si hay suficiente variedad,
  // conservando la aleatoriedad dentro de cada grupo.
  const orden = { facil: 0, media: 1, dificil: 2, extrema: 3 };
  copia.sort((a, b) => (orden[a.dificultad] ?? 1) - (orden[b.dificultad] ?? 1));
  return copia.slice(0, cantidad);
}

// ---------- Iniciar partida ----------
function iniciarPartida(){
  if (bancoPreguntas.length === 0) return;
  const cantidad = Math.min(TOTAL_PREGUNTAS, bancoPreguntas.length);
  preguntasPartida = elegirPreguntasAlAzar(bancoPreguntas, cantidad);
  indiceActual = 0;
  comodinesUsados = { cincuenta: false, retirar: false };
  document.getElementById('comodin-5050').disabled = false;
  document.getElementById('comodin-retirar').disabled = false;
  construirEscalera();
  mostrarPantalla('juego');
  mostrarPregunta();
}

// ---------- Escalera ----------
function construirEscalera(){
  const lista = document.getElementById('lista-escalera');
  lista.innerHTML = '';
  ESCALERA.forEach((premio, i) => {
    const li = document.createElement('li');
    li.id = 'nivel-' + i;
    li.innerHTML = `<span class="n">${i + 1}</span><span>${formatoMoneda(premio)}</span>`;
    if (NIVELES_SEGUROS.includes(i)) li.classList.add('seguro');
    lista.appendChild(li);
  });
}

function actualizarEscalera(){
  ESCALERA.forEach((_, i) => {
    const li = document.getElementById('nivel-' + i);
    li.classList.remove('actual', 'superada');
    if (i === indiceActual) li.classList.add('actual');
    else if (i < indiceActual) li.classList.add('superada');
  });
}

// ---------- Mostrar pregunta ----------
function mostrarPregunta(){
  respondiendo = true;
  const p = preguntasPartida[indiceActual];
  document.getElementById('num-actual').textContent = indiceActual + 1;
  document.getElementById('categoria-actual').textContent = p.categoria || 'General';
  document.getElementById('texto-pregunta').textContent = p.pregunta;
  actualizarEscalera();

  const contenedor = document.getElementById('contenedor-opciones');
  contenedor.innerHTML = '';
  const letras = ['A', 'B', 'C', 'D'];

  p.opciones.forEach((texto, i) => {
    const btn = document.createElement('button');
    btn.className = 'opcion';
    btn.dataset.indice = i;
    btn.innerHTML = `<span class="letra">${letras[i]}</span><span>${texto}</span>`;
    btn.addEventListener('click', () => seleccionarRespuesta(i));
    contenedor.appendChild(btn);
  });
}

// ---------- Responder ----------
function seleccionarRespuesta(indiceElegido){
  if (!respondiendo) return;
  respondiendo = false;
  const p = preguntasPartida[indiceActual];
  const botones = document.querySelectorAll('.opcion');
  botones.forEach(b => b.disabled = true);

  const correcta = p.respuesta;
  botones[indiceElegido].classList.add(indiceElegido === correcta ? 'correcta' : 'incorrecta');
  if (indiceElegido !== correcta) {
    botones[correcta].classList.add('correcta');
  }

  setTimeout(() => {
    if (indiceElegido === correcta) {
      if (indiceActual === ESCALERA.length - 1) {
        finalizarJuego(true, ESCALERA[indiceActual]);
      } else {
        indiceActual++;
        mostrarPregunta();
      }
    } else {
      const premioAsegurado = premioDeSeguridad(indiceActual);
      finalizarJuego(false, premioAsegurado);
    }
  }, 1400);
}

function premioDeSeguridad(indiceFallo){
  let premio = 0;
  NIVELES_SEGUROS.forEach(nivel => {
    if (indiceFallo > nivel) premio = ESCALERA[nivel];
  });
  return premio;
}

// ---------- Comodines ----------
document.getElementById('comodin-5050').addEventListener('click', () => {
  if (comodinesUsados.cincuenta || !respondiendo) return;
  comodinesUsados.cincuenta = true;
  document.getElementById('comodin-5050').disabled = true;

  const p = preguntasPartida[indiceActual];
  const incorrectas = [0, 1, 2, 3].filter(i => i !== p.respuesta);
  // Elimina 2 de las 3 incorrectas al azar
  for (let i = incorrectas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [incorrectas[i], incorrectas[j]] = [incorrectas[j], incorrectas[i]];
  }
  const aEliminar = incorrectas.slice(0, 2);
  const botones = document.querySelectorAll('.opcion');
  aEliminar.forEach(i => {
    botones[i].classList.add('eliminada');
    botones[i].disabled = true;
  });
});

document.getElementById('comodin-retirar').addEventListener('click', () => {
  if (comodinesUsados.retirar || !respondiendo) return;
  comodinesUsados.retirar = true;
  respondiendo = false;
  const premioActual = indiceActual === 0 ? 0 : ESCALERA[indiceActual - 1];
  finalizarJuego(null, premioActual, true);
});

// ---------- Fin del juego ----------
function finalizarJuego(gano, premio, retirado = false){
  const titulo = document.getElementById('titulo-final');
  const mensaje = document.getElementById('mensaje-final');
  const premioEl = document.getElementById('premio-final');

  if (retirado) {
    titulo.textContent = 'Te retiraste a tiempo';
    mensaje.textContent = 'Te llevas a casa:';
  } else if (gano) {
    titulo.textContent = '¡Eres el nuevo millonario!';
    mensaje.textContent = 'Respondiste las 20 preguntas correctamente. Ganaste:';
  } else {
    titulo.textContent = 'Respuesta incorrecta';
    mensaje.textContent = premio > 0
      ? 'Gracias a tu nivel de seguridad alcanzado, te llevas:'
      : 'No alcanzaste ningún nivel de seguridad. Te llevas:';
  }
  premioEl.textContent = formatoMoneda(premio);
  mostrarPantalla('final');
}

// ---------- Navegación ----------
document.getElementById('btn-jugar').addEventListener('click', iniciarPartida);
document.getElementById('btn-jugar-de-nuevo').addEventListener('click', iniciarPartida);
document.getElementById('btn-como-jugar').addEventListener('click', () => mostrarPantalla('reglas'));
document.getElementById('btn-volver-inicio').addEventListener('click', () => mostrarPantalla('inicio'));
document.getElementById('btn-final-inicio').addEventListener('click', () => mostrarPantalla('inicio'));

// ---------- Inicialización ----------
cargarBanco();
