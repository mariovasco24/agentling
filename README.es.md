<div align="center">

# 🟢🟡🔵🔴 Agentling

**Una mascota de escritorio, siempre visible, que te dice qué está haciendo tu agente de IA.**<br>
Libre, pensando, trabajando o esperándote — aunque su ventana esté minimizada o en otro escritorio.

[![CI](https://github.com/mariovasco24/agentling/actions/workflows/ci.yml/badge.svg)](https://github.com/mariovasco24/agentling/actions/workflows/ci.yml)
[![Última versión](https://img.shields.io/github/v/release/mariovasco24/agentling)](https://github.com/mariovasco24/agentling/releases/latest)
[![Licencia: MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)

![Estados de Agentling: libre, pensando, trabajando, te necesita — temas Spark y Semáforo](docs/preview.png)

[English](README.md)

</div>

---

## ⚡ Inicio rápido

Abre una terminal y ejecuta:

```bash
git clone https://github.com/mariovasco24/agentling.git && cd agentling && npm run setup && npm start
```

Listo. La mascota aparece en la esquina inferior derecha de tu pantalla. Reinicia las sesiones de Claude Code que tengas abiertas para que empiecen a reportar su estado.

> **¿No tienes Git o Node.js?** Mira los [Requisitos](#-requisitos): es un comando por sistema.

---

## 📖 Contenido

1. [Qué hace](#-qué-hace)
2. [Requisitos](#-requisitos)
3. [Compatibilidad](#-compatibilidad)
4. [Instalación paso a paso](#-instalación-paso-a-paso)
5. [Cómo usarlo](#-cómo-usarlo)
6. [Agentes soportados](#-agentes-soportados)
7. [Actualizar y desinstalar](#-actualizar-y-desinstalar)
8. [Referencia de comandos](#-referencia-de-comandos)
9. [Temas](#-temas)
10. [Configuración](#-configuración)
11. [Cómo funciona, privacidad y seguridad](#-cómo-funciona-privacidad-y-seguridad)
12. [Solución de problemas](#-solución-de-problemas)
13. [Preguntas frecuentes](#-preguntas-frecuentes)
14. [Desarrollo y contribuciones](#-desarrollo-y-contribuciones)
15. [Versiones y licencia](#-versiones-y-licencia)

---

## 🎯 Qué hace

Agentling es un pequeño personaje flotante que funciona como un semáforo para tu agente de IA:

| Luz | Estado | Significado | Extra |
|:---:|---|---|---|
| 🟢 | **Libre** | El agente terminó; no hay nada en ejecución | |
| 🟡 | **Pensando** | Enviaste un mensaje y el agente está razonando | burbuja "…" animada |
| 🔵 | **Trabajando** | El agente usa herramientas (edita archivos, ejecuta comandos…) | |
| 🔴 | **Te necesita** | El agente espera un permiso o una respuesta | burbuja "!" y un sonido |

- Se queda **encima de todas las ventanas**, en todos los escritorios y sobre apps a pantalla completa.
- **Arrástrala donde quieras**; recuerda su posición.
- Con varias sesiones abiertas (incluso de agentes distintos) muestra **la más urgente**: te necesita › trabajando › pensando › libre.
- Un punto de color en la barra de menú / bandeja del sistema refleja el estado, así que lo ves aunque ocultes la mascota.

---

## 🧰 Requisitos

| Necesitas | Para qué | Compruébalo | Instálalo |
|---|---|---|---|
| **Git** | descargar el proyecto | `git --version` | macOS: `brew install git` · Windows: `winget install Git.Git` · Ubuntu/Debian: `sudo apt install git` |
| **Node.js 18 o superior** (incluye `npm`) | instalarlo y ejecutarlo | `node --version` | macOS: `brew install node` · Windows: `winget install OpenJS.NodeJS.LTS` · Ubuntu/Debian: `sudo apt install nodejs npm` (o descárgalo de [nodejs.org](https://nodejs.org)) |
| **Un agente soportado**, p. ej. [Claude Code](https://claude.com/claude-code) | lo que se monitoriza | `claude --version` | ver la [documentación de Claude Code](https://docs.claude.com/en/docs/claude-code) |
| ~**300 MB** de disco y conexión a internet | Electron se descarga en la primera instalación | | |

> ¿Sin Homebrew en macOS? Instálalo desde [brew.sh](https://brew.sh) o usa los instaladores de [git-scm.com](https://git-scm.com) y [nodejs.org](https://nodejs.org). Después de instalar, abre una **terminal nueva**.

Agentling **no tiene dependencias en ejecución** salvo [Electron](https://www.electronjs.org/) (se instala solo).

---

## 🖥️ Compatibilidad

| | Estado |
|---|---|
| **Última versión** | **1.0.0** — ver [Releases](https://github.com/mariovasco24/agentling/releases) y el [CHANGELOG](CHANGELOG.md) |
| **macOS** (Apple Silicon) | ✅ Probado de extremo a extremo (macOS 26, Electron 44) |
| **macOS** (Intel) | 🟡 Lo soporta Electron; el autor no lo ha probado |
| **Windows 10/11** | 🟡 Los tests unitarios corren en CI; la app de escritorio aún no está verificada — se agradecen reportes |
| **Linux** | 🟡 Los tests unitarios corren en CI; la app de escritorio aún no está verificada. GNOME necesita la extensión AppIndicator para el icono de bandeja y "siempre visible" puede no funcionar en Wayland |
| **Node.js** | 18, 20 y 22 (probados en CI en Linux, macOS y Windows) |
| **Electron** | 44 |
| **Agentes** | Claude Code ✅ · cualquier herramienta de línea de comandos con el [adaptador genérico](#-agentes-soportados) ✅ |
| **Idioma** | Inglés y español (según el idioma de tu sistema) |

---

## 🛠️ Instalación paso a paso

### 1. Abre una terminal

- **macOS:** pulsa <kbd>⌘</kbd> + <kbd>Espacio</kbd>, escribe `Terminal` y pulsa <kbd>Enter</kbd>.
- **Windows:** pulsa <kbd>Win</kbd>, escribe `PowerShell` y pulsa <kbd>Enter</kbd>.
- **Linux:** abre tu aplicación de terminal.

### 2. Instala Git y Node.js (omítelo si ya los tienes)

Usa los comandos de la tabla de [Requisitos](#-requisitos), abre una **terminal nueva** y comprueba:

```bash
git --version
node --version
```

### 3. Descarga y prepara Agentling

```bash
git clone https://github.com/mariovasco24/agentling.git
cd agentling
npm run setup
```

`npm run setup` hace tres cosas:

1. Instala las dependencias (Electron, ~250 MB).
2. Revisa la descarga de Electron y la repara si quedó a medias.
3. **Conecta todos los agentes que detecta** — para Claude Code añade seis hooks a `~/.claude/settings.json` (guarda una copia de tu archivo original como `settings.json.bak-agentling` y no toca tus propios hooks).

### 4. Ábrelo

```bash
npm start
```

La mascota aparece abajo a la derecha y un punto de color en tu barra de menú / bandeja.

### 5. Reinicia las sesiones de tu agente

Cierra y vuelve a abrir las sesiones de Claude Code que tengas (o inicia una nueva) para que carguen los hooks. Envíale un mensaje: la mascota debe pasar de 🟡 a 🔵 y luego a 🟢.

### 6. (Opcional) Que arranque con tu computadora

Clic derecho sobre la mascota (o en el icono de la bandeja) → **Iniciar con la sesión** (macOS y Windows).

### Comprueba que todo está bien

```bash
npm run doctor
```

Muestra una lista ✓/✗ (Node, Electron, script del hook, agente conectado) e indica el comando para arreglar lo que falte.

---

## 🕹️ Cómo usarlo

**Clic derecho sobre la mascota** — o clic en su **icono de la bandeja / barra de menú** — abre el menú:

| Opción | Qué hace |
|---|---|
| **Conectar &lt;agente&gt;** | Aparece solo si un agente detectado aún no está conectado; un clic lo conecta |
| **Mostrar / ocultar** | Oculta o muestra la mascota (el icono de la bandeja permanece) |
| **Tamaño** | Pequeño · Mediano · Grande |
| **Tema** | Cambia el personaje (Spark, Semáforo o uno tuyo) |
| **Sonido al necesitarte** | Activa o desactiva el aviso sonoro |
| **Iniciar con la sesión** | Abre Agentling al iniciar sesión (macOS / Windows) |
| **Abrir carpeta de temas** | Abre la carpeta donde puedes soltar tus propios temas |
| **Salir** | Cierra Agentling |

Además:

- **Moverla:** haz clic y arrastra el personaje.
- **¿La ocultaste por error?** Clic en el punto de color de la barra de menú / bandeja → *Mostrar / ocultar*.
- **¿La cerraste?** Ejecuta `npm start` otra vez desde la carpeta `agentling`.

---

## 🤖 Agentes soportados

| Agente | Estado | Cómo se conecta |
|---|---|---|
| **[Claude Code](https://claude.com/claude-code)** | ✅ Soportado (verificado en la pestaña Code de la app de escritorio de Claude) | Automático: `npm run setup` registra [hooks](https://docs.claude.com/en/docs/claude-code/hooks) en `~/.claude/settings.json` |
| **Cualquier herramienta de línea de comandos** | ✅ Adaptador genérico | Tú ejecutas un comando (abajo) |
| Otros agentes | 🧩 Abierto a contribuciones | Escribe un [adaptador](src/adapters/README.md): normalmente un solo archivo pequeño |

> Claude Code no tiene un evento de "pensando", así que *pensando* se mide como el tiempo entre tu mensaje y la primera herramienta (y entre herramientas). Si interrumpes con <kbd>Esc</kbd> no se envía ningún evento, así que *pensando* / *trabajando* vuelven a *libre* tras 5 minutos sin señales.

### Úsalo con cualquier otra herramienta

Todo lo que pueda ejecutar un comando puede controlar la mascota:

```bash
node bin/agentling-hook.js generic working     # idle | thinking | working | attention | end
echo '{"session_id":"build-42"}' | node bin/agentling-hook.js generic attention
```

Por ejemplo, añade `node /ruta/a/agentling/bin/agentling-hook.js generic attention` al final de un script largo de compilación para que la mascota se ponga roja al terminar.

---

## 🔄 Actualizar y desinstalar

### Actualizar a la última versión

```bash
cd agentling
npm run update
```

Luego cierra la mascota y vuelve a abrirla (`npm start`). Las versiones nuevas aparecen en [Releases](https://github.com/mariovasco24/agentling/releases).

### Desconectar los agentes (conservando la app)

```bash
npm run disconnect
```

Quita **solo** los hooks de Agentling de los ajustes de los agentes. Tus hooks y ajustes quedan como estaban.

### Desinstalar por completo

```bash
cd agentling
npm run disconnect
cd .. && rm -rf agentling          # Windows PowerShell: Remove-Item -Recurse -Force agentling
```

Opcionalmente borra también sus pequeñas carpetas de datos: `~/.agentling` y la carpeta de datos indicada en [Configuración](#-configuración). Si activaste *Iniciar con la sesión*, desactívalo antes desde el menú.

---

## 📋 Referencia de comandos

Ejecútalos desde la carpeta `agentling`.

| Comando | Qué hace |
|---|---|
| `npm run setup` | Primera instalación: dependencias + revisión de Electron + conectar agentes detectados |
| `npm start` | Abre la mascota |
| `npm run doctor` | Diagnostica la instalación (código de salida ≠ 0 si algo falla) |
| `npm run connect` | Conecta todos los agentes detectados (añade un nombre para elegir uno: `npm run connect -- claude-code`) |
| `npm run disconnect` | Desconecta los agentes |
| `npm run update` | `git pull` + `npm install` + revisión de Electron |
| `npm run theme:new -- <nombre>` | Crea la plantilla de un tema nuevo |
| `npm test` | Ejecuta los tests |

---

## 🎨 Temas

Elige uno desde el menú. Incluidos:

| Tema | Descripción |
|---|---|
| **Spark** (por defecto) | Un destello naranja con cara que reacciona a cada estado |
| **Semáforo** | Un semáforo clásico: verde = libre, amarillo pulsante = pensando, luces que se persiguen = trabajando, rojo intermitente = te necesita |

Los temas son carpetas de **HTML + CSS** renderizadas en un Shadow DOM aislado, así que añadir uno nunca requiere tocar la app:

```bash
npm run theme:new -- mi-tema          # crea themes/mi-tema con una plantilla funcional
```

Edita los `theme.html` / `theme.css` generados, reinicia y elígelo en el menú **Tema**. Para mantener un tema privado, pon su carpeta en la que abre **Abrir carpeta de temas**. Guía completa: [THEMES.md](THEMES.md).

---

## ⚙️ Configuración

Todo está disponible desde el menú; los ajustes se guardan solos en `config.json`:

| Sistema | Carpeta de ajustes |
|---|---|
| macOS | `~/Library/Application Support/agentling/` |
| Windows | `%APPDATA%\agentling\` |
| Linux | `~/.config/agentling/` |

Tus temas propios van en la subcarpeta `themes/`. Los archivos de estado de las sesiones están en `~/.agentling/state` (en Windows: `C:\Users\<tú>\.agentling\state`).

**Variables de entorno** (avanzado):

| Variable | Para qué sirve | Por defecto |
|---|---|---|
| `AGENTLING_STATE_DIR` | Dónde escriben el estado los hooks | `~/.agentling/state` |
| `CLAUDE_CONFIG_DIR` | Carpeta de configuración de Claude Code, usada por su adaptador | `~/.claude` |

---

## 🔒 Cómo funciona, privacidad y seguridad

```
 Agente ──evento──▶ bin/agentling-hook.js <adaptador> <evento> ──▶ ~/.agentling/state/<adaptador>__<sesión>
                           │ adapter.translate()                              │ se lee cada 400 ms
                           ▼                                      App Electron ◀┘ → agrega → ventana / bandeja / sonido
```

1. Un **adaptador** (`src/adapters/<agente>`) sabe cómo engancharse a un agente y traducir sus eventos a los cuatro estados.
2. Cada evento del agente ejecuta un pequeño script de Node que escribe el estado de la sesión en un archivo.
3. La app Electron vigila esa carpeta y muestra el estado más urgente.

**Privacidad y seguridad**

- **Sin acceso a la red:** ni el hook ni la app envían nada a ningún sitio. La única descarga es Electron durante la instalación.
- El hook solo lee el id de sesión y el nombre de la herramienta del mensaje del agente — nunca tus prompts ni tu código.
- Conectar edita la configuración de tu agente de forma **idempotente y reversible**, tras guardar una copia de seguridad única.
- El hook siempre termina limpiamente y deja de esperar datos tras 1 segundo, así que nunca puede bloquear ni ralentizar a tu agente.
- Los temas se ejecutan con una Content-Security-Policy estricta: sin scripts, solo HTML + CSS.

Reporta vulnerabilidades en privado: ver [SECURITY.md](SECURITY.md).

---

## 🩺 Solución de problemas

Empieza por `npm run doctor`: indica el comando exacto para arreglar lo que falla.

| Síntoma | Solución |
|---|---|
| **No veo la mascota** | Mira el punto de color de la barra de menú / bandeja → *Mostrar / ocultar*. Si no hay punto, no está corriendo: `npm start` |
| **La mascota nunca cambia de estado** | Reinicia tu sesión del agente tras `npm run setup`, ejecuta `npm run doctor` y confirma "Claude Code connected" |
| **`npm: command not found` / `git: command not found`** | Instálalos ([Requisitos](#-requisitos)) y abre una terminal **nueva** |
| **"Electron failed to install correctly"** | Ejecuta `node scripts/ensure-electron.js`. ¿Sigue fallando? `rm -rf node_modules` y vuelve a `npm run setup` |
| **Deja de actualizarse tras cambiar de versión de Node** | El hook guarda la ruta absoluta del `node` que ejecutó el setup: ejecuta `npm run connect` otra vez |
| **Se queda en 🔵 / 🟡** | Probablemente interrumpiste al agente con <kbd>Esc</kbd>; vuelve a libre sola a los 5 minutos o con tu siguiente mensaje |
| **macOS: "no se puede abrir porque Apple no puede comprobarlo"** | Agentling corre con el Electron del propio proyecto (`npm start`), no es una app descargada, así que Gatekeeper no debería aparecer. Si aparece: Ajustes del Sistema → Privacidad y seguridad → *Abrir de todos modos* |
| **Linux: no hay icono de bandeja** | GNOME necesita la extensión *AppIndicator* |
| **Un tema propio no aparece** | Necesita `theme.html` y `theme.css`; revisa `apiVersion` en `theme.json` (ver [THEMES.md](THEMES.md)) |

¿Sigues atascado? [Abre un issue](https://github.com/mariovasco24/agentling/issues/new/choose) y pega la salida de `npm run doctor`.

---

## ❓ Preguntas frecuentes

**¿Ralentiza a Claude Code?** No. Cada evento ejecuta un script que escribe un archivo diminuto y termina en pocos milisegundos.

**¿Funciona con la app de escritorio de Claude Code, la CLI y las extensiones de IDE?** Usa los hooks de Claude Code de `settings.json`. Está verificado en la pestaña Code de la app de escritorio de Claude; la CLI y las integraciones de IDE leen los mismos ajustes.

**¿Puede mostrar varios agentes a la vez?** Sí: se combinan todas las sesiones y gana el estado más urgente.

**¿Puedo usar mi propio personaje o imagen?** Sí, como [tema](#-temas) (pon las imágenes en la carpeta del tema). Por favor, no subas a este repositorio arte de terceros con derechos de autor.

**¿Tiene relación con Anthropic?** No. Es un proyecto comunitario independiente; los nombres de producto pertenecen a sus dueños.

---

## 🤝 Desarrollo y contribuciones

```bash
git clone https://github.com/mariovasco24/agentling.git && cd agentling
npm run setup
npm test            # 35 tests unitarios, sin dependencias extra
npm start
```

| Carpeta | Contenido |
|---|---|
| `src/main` | Proceso principal de Electron (ventana, bandeja, menú, vigilante de estado, configuración) |
| `src/renderer` | Interfaz común (burbuja, etiqueta, halo) que aloja los temas |
| `src/adapters` | Un adaptador por agente — [cómo escribir uno](src/adapters/README.md) |
| `src/shared` | Lógica pura compartida por la app, el hook y los scripts |
| `bin/` | El ejecutable del hook que llaman los agentes |
| `themes/` | Temas incluidos — [cómo escribir uno](THEMES.md) |
| `scripts/` | `connect`, `doctor`, `ensure-electron`, `new-theme` |

`main` está protegida: abre un pull request desde una rama corta; el CI (Linux, macOS, Windows × Node 18/20/22) debe pasar. Lee [CONTRIBUTING.md](CONTRIBUTING.md) y el [Código de Conducta](CODE_OF_CONDUCT.md). Buenas primeras contribuciones: un **tema** nuevo, un **adaptador** nuevo o **probar en Windows/Linux**.

---

## 🏷️ Versiones y licencia

Agentling sigue [Versionado Semántico](https://semver.org/lang/es/). La versión actual es **1.0.0**; los cambios están en el [CHANGELOG](CHANGELOG.md).

Publicado bajo la [Licencia MIT](LICENSE).
