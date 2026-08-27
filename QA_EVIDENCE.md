# QA EVIDENCE — PecadosVip Web

Última actualización documental: 2026-08-27 10:40 America/Bogota.

La validación final de este checkpoint pasó **65/65** pruebas. Si la suite cambia después del commit, este resultado deja de representar el nuevo árbol y debe repetirse.

## Resultado del incremento integrado

| Control | Resultado | Evidencia observada |
|---|---|---|
| Lint | PASS | `pnpm run lint`; cero errores y cero advertencias. `output/` y `.playwright-cli/` se excluyen como evidencia/herramienta generada. |
| Typecheck | PASS | `pnpm run typecheck`; TypeScript sin errores. |
| Suite | PASS | Resultado final de `pnpm run test`: 65/65 pruebas, incluidas consulta pública, filtros GET, publicación, SEO, contacto, favicon y regresión del gate agregado. |
| Build | PASS | `pnpm run build` dentro de `pnpm run validate`; rutas `/`, `/madrid`, `/barcelona`, `/perfiles`, `/contacto`, `/favicon.ico`, `/legal/:document` y `/perfiles/:slug`. |
| Puerta local completa | PASS | `pnpm run validate`: lint → tipos → 65 pruebas → build, exit code 0 sobre el árbol final previo al commit. |
| Schemas de auditoría UE/España | PASS | `audit.json` y los nueve hallazgos registrados cumplen los schemas de `auditar-web-ue-espana`; IDs deterministas válidos. |
| Diff | PASS | `git diff --check`; sin errores de whitespace. |

## Smoke HTTP de producción local

Build final servido únicamente en loopback y detenido tras la prueba. Se definieron de forma adversarial la antigua bandera de preview, ambas aprobaciones parciales de contacto y un destino HTTPS sintético:

- `/`, `/madrid`, `/barcelona`, `/perfiles`, `/perfiles/no-existe` y `/contacto`: HTTP 200 con el mismo holding neutral; el slug no se resuelve mientras el gate agregado esté cerrado.
- `/legal/privacidad`: HTTP 404.
- `robots.txt`: `Disallow: /`.
- `sitemap.xml`: cero URLs.
- Todas las rutas públicas probadas: `noindex`, sin claims de servicio ni el destino sintético.
- Las regresiones unitarias confirman además que no se emiten canonicales ni JSON-LD mientras el release esté bloqueado.

La revisión adversarial había encontrado inicialmente que dos aprobaciones parciales y una URL HTTPS podían mostrar un canal aunque el release global siguiera bloqueado. Se corrigió conectando el contacto al gate agregado. El smoke final se repitió sobre el build vigente en el puerto 4210 y el servidor se detuvo.

Evidencia final: `output/playwright/production-holding-smoke.json`, SHA-256 `3be2f432204b3a59432d38dcdfbe05609e30655d93e2c228eabd9b06730a5ff0`. Evidencia intermedia conservada: `output/playwright/contact-gate-retest.json`, SHA-256 `f4cfb53e266a9beee5e954a12da839430017105ca868d3c4191293787c5ed641`.

## Navegador y responsive — evidencia pre-boundary

Chromium mediante Playwright CLI sobre el UI de borrador antes de integrar el boundary final de visibilidad:

| Escenario | Resultado |
|---|---|
| Clic real portada → perfiles | PASS; navegación completada, cero errores y cero advertencias de consola. |
| Filtros GET con ciudad y controles opcionales vacíos | PASS; estado vacío seguro, sin falso error de filtros y consola limpia. |
| Skip link | PASS; primer Tab enfoca “Saltar al contenido principal” y Enter transfiere foco al elemento `MAIN#main-content`. |
| Seis viewports | PASS WITH LIMITS; 360, 390, 768, 1024, 1440 y 1920 px sin overflow horizontal, un H1, cero POST y cero recursos externos en la portada. |
| Estado vacío | PASS; no expone borradores ni inventa perfiles. |
| Detalle inexistente | PASS; 404. La solicitud fallida del propio 404 es esperada y no se contabiliza como consola limpia del flujo exitoso. |

Playwright reveló dos defectos corregidos antes del cierre:

1. `next/link` bajo Vinext `1.0.0-beta.3` generaba errores de prefetch/clic y no navegaba. Se aplicó un fallback acotado a enlaces HTML nativos y el retest quedó limpio.
2. El formulario GET enviaba controles opcionales vacíos que el parser interpretaba como inválidos. Ahora un único valor vacío admitido se trata como ausente, sin relajar rechazo de duplicados, claves desconocidas o enteros ambiguos.

Esta evidencia prueba comportamiento histórico del UI y ayudó a corregir navegación, filtros y responsive. **No prueba que el preview Vinext actual sea operativo ni constituye E2E del artefacto final**: en la comprobación real posterior, el servidor de desarrollo continuó mostrando el holding.

Evidencia versionable pre-boundary:

- `output/playwright/qa-results.json`, SHA-256 `0b80738672124dc50ce2d524a74b5635f3a48a5585b5ee4e6573362b8db188d2`.
- `output/playwright/responsive-smoke.js`, SHA-256 `9d7081308eace02b72bf4b34ae88182f5dc6b1cb1e9e7fc7f731acba9909c39b`.
- `output/playwright/home-390.png`, SHA-256 `d709aa0102fb5cbc485d9d9f2164b41714675bdaf7407d73c6e49059ce7fce47`.
- `output/playwright/home-1440.png`, SHA-256 `aff631d3e92b6abc21f02a51f029bfd7c029f9f62e1406670403ce85c6e34427`.

## Cobertura y límites

| Área | Estado | Límite restante |
|---|---|---|
| Flujo público fail-closed | PASS WITH LIMITS | No hay contenido real aprobado; el detalle real no puede probarse. |
| Contacto | PASS WITH LIMITS | Gate negativo probado; faltan destinos, privacidad y flujo real aprobados. |
| SEO seguro | PASS WITH LIMITS | Bloqueo verificado; faltan dominio, contenido, breadcrumbs y crawl del release indexable. |
| Accesibilidad | PARTIAL | Teclado, foco, semántica básica y anchos probados; sin lector de pantalla, contraste completo, zoom/reflow 400 %, target size ni auditoría criterio por criterio. |
| QA visual contra mockup | BLOCKED | Existen tres propuestas incompatibles y el usuario no ha seleccionado la referencia controladora. Las capturas prueban layout, no fidelidad ni aceptación. |
| Preview Vinext real | NOT WORKING | El intento de habilitar el UI de borrador en el runtime real de desarrollo siguió mostrando el holding; no hay preview operativo ni E2E visual del artefacto final. |
| CMS | PASS WITH LIMITS | Contrato en memoria probado; sin UI, autenticación, persistencia ni storage. |
| Seguridad integrada | BLOCKED | El escáner anterior falló en un sourcemap de dependencia y no dejó `scanId` durable; repetir con herramienta compatible antes de release. |
| Dependencias vulnerables | NOT RUN | Falta análisis de alcanzabilidad/explotabilidad compatible. |
| Performance/CWV | NOT RUN | No existe runtime desplegado ni release visual/contenido congelado. |
| UAT y despliegue | NOT RUN | No autorizados y faltan decisiones externas. |

## Separación de estados

La medición independiente sitúa el **avance de ejecución ponderado en 52/100 (±2)**. Es un proxy de trabajo ejecutado, no aceptación de requisitos. La verificación estricta permanece en **2/20 requisitos (10 %)**.

Un build local correcto, 65 pruebas o la evidencia de navegador pre-boundary no prueban cumplimiento legal, conformidad WCAG completa, fidelidad visual, despliegue, operación, aceptación comercial ni autorización de indexación. La publicación externa sigue en **`NO-GO`**.
