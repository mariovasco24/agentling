# Agentling

Una mascota de escritorio, siempre visible, que te dice qué está haciendo tu agente de IA para programar, aunque su ventana esté minimizada o en otro escritorio.

| Estado | Significado |
|---|---|
| 🟢 **Libre** | Claude terminó; no hay nada en ejecución |
| 🟡 **Pensando** | Enviaste un mensaje y Claude está razonando |
| 🔵 **Trabajando** | Claude está usando herramientas (editando, ejecutando comandos…) |
| 🔴 **Te necesita** | Claude espera un permiso o una respuesta (suena un aviso) |

Hoy funciona con [Claude Code](https://claude.com/claude-code); otros agentes se conectan con pequeños **adaptadores**. Con varias sesiones abiertas muestra la más urgente.

> Proyecto comunitario no oficial, sin relación con Anthropic.

## Instalación

Necesitas [Node.js](https://nodejs.org) 18+ y Claude Code.

```bash
git clone https://github.com/mariovasco24/agentling.git
cd agentling
npm run setup     # instala dependencias y conecta los agentes detectados
npm start         # abre la mascota
```

Después **reinicia las sesiones del agente** que tengas abiertas. Si algo falla: `npm run doctor`.

- **Arrastra** la mascota donde quieras; recuerda su posición.
- **Clic derecho** (o su icono en la barra de menú): ocultar, tamaño, tema, sonido, iniciar con la sesión, salir.
- Si un agente detectado no está conectado, el menú ofrece **«Conectar <agente>»**.
- Desinstalar: `npm run disconnect` y borrar la carpeta.
- Cualquier programa que ejecute comandos puede usar el adaptador genérico: `node bin/agentling-hook.js generic working`.

Más detalles (cómo funciona, temas, solución de problemas) en el [README en inglés](README.md) y en [THEMES.md](THEMES.md).
