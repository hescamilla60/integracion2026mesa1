# ¿Quién Sabe Más? — El Reto del Millón

Juego de preguntas y respuestas al estilo de "¿Quién quiere ser millonario?", listo para publicarse gratis con **GitHub Pages**.

- 20 preguntas por intento, elegidas al azar de tu banco de preguntas, **sin repetir ninguna dentro de la misma partida**.
- Escalera de premios con 2 niveles de seguridad (pregunta 5 y pregunta 10).
- Comodines: **50 / 50** y **Retirarse**.
- Paleta de colores: azul oscuro, amarillo (dorado), blanco y negro.

## Estructura del proyecto

```
millonario/
├── index.html          → Página principal (no necesitas tocarla para jugar)
├── css/
│   └── style.css        → Todos los estilos y colores
├── js/
│   ├── script.js         → Lógica del juego
│   └── questions.json     → BANCO DE PREGUNTAS (aquí lo alimentas)
├── assets/
│   └── logo/
│       └── logo.png       → AQUÍ VA TU LOGO
└── README.md
```

## 1. Dónde subir el logo

Coloca tu imagen dentro de la carpeta `assets/logo/` y nómbrala exactamente:

```
assets/logo/logo.png
```

- Formato recomendado: PNG con fondo transparente.
- Tamaño recomendado: 400×400 px (cuadrado) para que se vea nítido en pantallas grandes y pequeñas.
- Si no subes ningún logo, la página funciona igual: simplemente no se mostrará ninguna imagen arriba del título (el código ya contempla que el archivo pueda no existir).
- Ese mismo archivo también se usa como ícono de pestaña del navegador (favicon).

Si prefieres otro nombre de archivo (por ejemplo `mi-logo.svg`), debes actualizar las dos líneas que lo referencian en `index.html`:

```html
<link rel="icon" href="assets/logo/logo.png" ...>
<img id="logo-inicio" ... src="assets/logo/logo.png" ...>
```

## 2. Cómo alimentar y hacer crecer el banco de preguntas

Todas las preguntas viven en un único archivo, fácil de editar y de ampliar sin tocar código:

```
js/questions.json
```

Cada pregunta sigue esta estructura:

```json
{
  "id": 66,
  "categoria": "Geografía",
  "dificultad": "media",
  "pregunta": "¿Cuál es la capital de Portugal?",
  "opciones": ["Oporto", "Lisboa", "Faro", "Braga"],
  "respuesta": 1
}
```

- **id**: número único, no repetido con ninguna otra pregunta del archivo.
- **categoria**: texto libre (Geografía, Historia, Ciencia, Deporte, Arte, Literatura, Cine, Música, Mitología, etc.). Se muestra como etiqueta sobre la pregunta.
- **dificultad**: `facil`, `media`, `dificil` o `extrema`. El juego ordena las 20 preguntas de cada partida de más fácil a más difícil usando este campo, para imitar la tensión creciente del concurso original.
- **opciones**: exactamente 4 textos de respuesta.
- **respuesta**: la posición (empezando en 0) de la opción correcta dentro del arreglo `opciones`. En el ejemplo, `1` significa que "Lisboa" es la correcta.

### Para agregar preguntas nuevas

1. Abre `js/questions.json`.
2. Copia un bloque `{ ... }` existente dentro del arreglo `"preguntas"`.
3. Pégalo antes del corchete final `]`, sepáralo con una coma del bloque anterior.
4. Cambia el `id` (usa el siguiente número disponible), el texto, las opciones y la respuesta correcta.
5. Guarda el archivo. No necesitas tocar `script.js` ni `index.html`: el juego lee automáticamente cuántas preguntas hay y las usa todas como banco disponible.

No hay límite de preguntas: puedes tener 65, 200 o 2.000. Cuantas más agregues, menos se repetirán las partidas entre jugadores. El juego solo exige que haya **al menos 20** preguntas en total para poder armar una partida completa; si hay menos de 20, usará las que existan.

### Cómo crecer el banco por categorías en el futuro

Por ahora todo el banco es de **cultura general**. Si más adelante quieres separar por temas (por ejemplo, un modo "Solo Historia" o "Solo Ciencia"), la forma más simple sin rehacer el juego es:

- Mantener todas las preguntas en el mismo `questions.json`, usando bien el campo `categoria`.
- Cuando quieras ese modo, se puede filtrar el arreglo por categoría antes de llamar a `elegirPreguntasAlAzar()` en `script.js` (una sola línea de cambio). Si llegas a ese punto, puedo ayudarte a implementarlo.

## 3. Cómo publicar la página en GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede llamarse, por ejemplo, `quien-sabe-mas`).
2. Sube todo el contenido de esta carpeta `millonario/` a la raíz del repositorio (o dentro de una carpeta `docs/`, como prefieras).
3. En GitHub, entra a **Settings → Pages**.
4. En "Build and deployment", selecciona **Deploy from a branch**.
5. Elige la rama `main` y la carpeta `/ (root)` (o `/docs` si subiste ahí los archivos).
6. Guarda. GitHub te dará una URL parecida a `https://tu-usuario.github.io/quien-sabe-mas/`.
7. Espera uno o dos minutos y abre esa URL: tu juego ya estará en línea.

No necesitas servidor, base de datos ni backend: todo funciona en el navegador del jugador.

## 4. Personalizar los premios

Los montos de la escalera de premios están en `js/script.js`, al inicio del archivo, en la constante `ESCALERA`. Puedes cambiar los 20 valores por lo que quieras (pesos, puntos, dólares ficticios, etc.). Los índices marcados en `NIVELES_SEGUROS` (por defecto, posiciones 5 y 10) son los "niveles de seguridad" del juego.

## 5. Ideas para seguir creciendo el proyecto

- Agregar más comodines (por ejemplo, "Pregunta al público" simulada con porcentajes aleatorios).
- Guardar el mejor puntaje del jugador en el navegador (`localStorage`) para mostrar un "récord".
- Añadir un temporizador por pregunta.
- Separar el banco de preguntas por categorías o dificultad seleccionable desde el menú de inicio.
