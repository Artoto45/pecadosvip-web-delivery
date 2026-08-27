# QA EVIDENCE — PecadosVip Web

Última actualización: 2026-08-27 02:38 America/Bogota.

## Baseline del repositorio reutilizado

| Control | Resultado | Evidencia |
|---|---|---|
| Git limpio | PASS | rama `main`, commit `013307a`, sin cambios al clonar |
| Dependencias versionadas | PASS | `pnpm-lock.yaml`; instalación limpia completada en clon aislado |
| Lint | PASS | `pnpm run lint`; salida sin errores |
| Typecheck | PASS | `pnpm run typecheck`; TypeScript sin errores |
| Contratos de contenido, repositorio local, consulta pública, release y SEO seguro | PASS | `pnpm run test`; 36/36 pruebas pasan: perfiles, estados, roles runtime, referencias agregadas, evidencia, concurrencia optimista, auditoría, medios, parser URL, filtros/paginación, proyección pública y configuración SEO |
| Consulta pública de perfiles | PASS WITH LIMITS | Parser URL rechaza claves desconocidas, duplicados y enteros ambiguos; la consulta falla cerrada si el release no está listo, excluye ocultos y omite IDs, aprobaciones, evidencia y metadatos de derechos. Faltan route handler, UI y E2E |
| Revisión independiente de consulta pública | PASS WITH LIMITS | Auditor focal corrigió un P1 antes del commit y revalidó parser, consulta, proyección, release gate y arquitectura sin P0/P1 restantes; revisión estática más suite, sin `scanId` durable por limitación ya registrada del escáner integrado |
| CMS local de dominio | PASS WITH LIMITS | CRUD lógico de perfiles, duplicado seguro, archivo/restauración, disponibilidad, orden de medios y bitácora validados en memoria; sin UI, autenticación, persistencia ni almacenamiento |
| Build de producción | PASS | `pnpm run build`; `dist/client`, `dist/server/index.js` y `dist/.openai/hosting.json` presentes |
| Smoke HTTP SEO cerrado | PASS | build servido en `127.0.0.1:4174`: `robots.txt` disallow-all, sitemap con 0 URLs, Madrid/Barcelona 200 con noindex y sin canonical/JSON-LD; servidor detenido después |
| Checkpoint GitHub | PASS | remoto privado `Artoto45/pecadosvip-web-delivery`; PR borrador #1; SHA local/remoto `152f81a` en el checkpoint inicial |
| Cobertura de requisitos fuente | FAIL | el baseline solo ofrece `/madrid` y `/barcelona`; faltan inicio, perfiles, CMS, legales y hubs restantes |
| QA visual contra mockup | NOT RUN | bloqueada por falta de selección/aprobación visual |
| Pruebas E2E y navegador | NOT RUN | se ejecutarán tras el primer incremento integrado y autorización de navegador |
| Accesibilidad | NOT RUN | pendiente del incremento integrado |
| Búsqueda de secretos de alta confianza | PASS | sin secretos observados; la única coincidencia es la URL deliberadamente insegura y sintética `user:password` de una prueba negativa en `tests/seo-safety.test.ts`; no sustituye auditoría completa |
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
