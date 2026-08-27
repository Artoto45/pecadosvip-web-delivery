# QA EVIDENCE — PecadosVip Web

Última actualización: 2026-08-26 22:00 America/Bogota.

## Baseline del repositorio reutilizado

| Control | Resultado | Evidencia |
|---|---|---|
| Git limpio | PASS | rama `main`, commit `013307a`, sin cambios al clonar |
| Dependencias versionadas | PASS | `pnpm-lock.yaml`; instalación limpia completada en clon aislado |
| Lint | PASS | `pnpm run lint`; salida sin errores |
| Typecheck | PASS | `pnpm run typecheck`; TypeScript sin errores |
| Contratos de contenido y release | PASS | `pnpm run test`; 11/11 pruebas pasan, incluidos nueve perfiles, estados, permisos y fail-closed |
| Build de producción | PASS | `pnpm run build`; `dist/client`, `dist/server/index.js` y `dist/.openai/hosting.json` presentes |
| Checkpoint GitHub | PASS | remoto privado `Artoto45/pecadosvip-web-delivery`; PR borrador #1; SHA local/remoto `152f81a` en el checkpoint inicial |
| Cobertura de requisitos fuente | FAIL | el baseline solo ofrece `/madrid` y `/barcelona`; faltan inicio, perfiles, CMS, legales y hubs restantes |
| QA visual contra mockup | NOT RUN | bloqueada por falta de selección/aprobación visual |
| Pruebas E2E y navegador | NOT RUN | se ejecutarán tras el primer incremento integrado y autorización de navegador |
| Accesibilidad | NOT RUN | pendiente del incremento integrado |
| Búsqueda de secretos de alta confianza | PASS | cero coincidencias en archivos candidatos al commit; no sustituye auditoría completa |
| Escáner de seguridad integrado | BLOCKED | el escaneo estándar falló en un sourcemap de `node_modules` y el escaneo diff no resolvió el worktree; repetir antes de release |
| Dependencias vulnerables | NOT RUN | pendiente de análisis compatible y evaluación de explotabilidad |
| Smoke desde release final | NOT RUN | aún no existe release congelado |

Un build correcto confirma compilación, no conformidad de alcance, despliegue ni aceptación.

## Matriz de estados de prueba

- PASS: evidencia observada y repetible.
- FAIL: el resultado observado incumple el criterio.
- BLOCKED: una dependencia externa impide ejecutar o validar.
- NOT RUN: aún no ejecutado; se documenta el motivo.

## Evidencia pendiente obligatoria

- Rutas y enlaces desde 360, 390, 768, 1024, 1440 y 1920 px.
- Navegación por teclado, foco, semántica, contraste, alt y formularios.
- Listado, filtros, vacío, no disponible, error y ficha de perfil.
- CRUD/duplicado/estados/preview/roles/auditoría y orden multimedia.
- Consola y red sin errores atribuibles al proyecto.
- Metadata/canonical/schema/sitemap/robots/breadcrumbs.
- Rendimiento sobre build de producción.
- Comparación visual en el mismo viewport y estado.
- Instalación y smoke desde la carpeta de entrega definitiva.
