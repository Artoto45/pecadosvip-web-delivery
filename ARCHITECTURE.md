# Arquitectura — PecadosVip Web

Estado: trabajo en curso, local, no operacional y no autorizado para despliegue.

## Límites del sistema

PecadosVip se plantea como un único sitio responsive, bajo un único origen, con rutas para Madrid, Barcelona y cobertura local confirmada. El servicio público informa y facilita contacto privado para domicilios y hoteles. Esta fase no incluye local físico, checkout, pago ni reserva transaccional.

El sistema se separa en cinco responsabilidades:

1. Sitio público Next/Vinext: renderizado, navegación, metadata, `robots.txt` y `sitemap.xml`.
2. Dominio de contenido: ciudades, perfiles, servicios, medios, aprobaciones, legales y configuración.
3. Control de publicación: validación agregada, proyección pública y exclusión de contenido no aprobado.
4. Repositorio CMS: actualmente una implementación en memoria, solo para desarrollo y pruebas.
5. Adaptadores externos futuros: autenticación, persistencia, almacenamiento, contacto, analítica y despliegue. No hay proveedor seleccionado.

Restricciones verificadas:

- Ciudades admitidas: Madrid, Barcelona, Girona, Tarragona, Toledo, Guadalajara y Segovia.
- Estados: `draft`, `hidden`, `published` y `archived`.
- Roles de contrato: `admin` y `editor`; los roles desconocidos se rechazan en runtime.
- Ocho perfiles son carga inicial, no límite de arquitectura.
- Archivar es la eliminación normal; el repositorio local no expone borrado físico.
- La publicación exige referencias vigentes, aprobación, mayoría de edad, consentimiento y derechos.
- La indexación queda cerrada hasta confirmar un origen real y dos aprobaciones explícitas.

## Mapa URL

| Ruta | Propósito | Estado actual |
|---|---|---|
| `/` | Portada general | Parcial; redirige a Madrid |
| `/madrid` | Landing Madrid | Implementada, noindex por defecto |
| `/barcelona` | Landing Barcelona | Implementada, noindex por defecto |
| `/girona` | Landing local | Bloqueada por contenido y cobertura |
| `/tarragona` | Landing local | Bloqueada por contenido y cobertura |
| `/toledo` | Landing local | Bloqueada por contenido y cobertura |
| `/guadalajara` | Landing local | Bloqueada por contenido y cobertura |
| `/segovia` | Landing local | Bloqueada por contenido y cobertura |
| `/perfiles` | Listado, filtros y paginación | Consulta de dominio implementada; UI no implementada |
| `/perfiles/{slug}` | Detalle de perfil | Proyección pública implementada; UI no implementada |
| `/contacto` | Contacto o reserva privada | No implementada como ruta |
| `/legal/aviso-legal` | Aviso legal | Bloqueada por texto y aprobación |
| `/legal/privacidad` | Privacidad | Bloqueada por texto y aprobación |
| `/legal/cookies` | Cookies | Bloqueada por texto y aprobación |
| `/legal/terminos-del-servicio` | Condiciones | Bloqueada por texto y aprobación |
| `/robots.txt` | Política para crawlers | Implementada; bloquea todo por defecto |
| `/sitemap.xml` | URLs indexables | Implementada; vacía por defecto |
| `/admin/*` | CMS administrativo | Puerto futuro; UI y auth no implementados |
| `/preview/*` | Vista previa no pública | Puerto futuro; no implementado |
| `/api/*` | Adaptadores del CMS | Puerto futuro; no implementado |

El manifiesto contractual contiene home, ciudades, perfiles, contacto y legales. Todas las rutas quedan no indexables si falla el gate agregado. El build real todavía solo expone `/`, `/madrid` y `/barcelona`.

## Puertos y adaptadores

| Puerto lógico | Dirección | Implementación actual | Integración pendiente |
|---|---|---|---|
| `PublicProfileQuery` | Sitio → contenido publicado | Parser URL estricto, filtros, paginación y detalle seguro en memoria | Route handler, repositorio persistente y UI |
| `ProfileRepository` | CMS → perfiles y bitácora | `InMemoryProfileRepository` | Base de datos transaccional |
| `IdentityContext` | Operador → rol | El llamador entrega actor opaco | Sesión autenticada y rol server-side |
| `Clock` | Repositorio → tiempo | Función inyectable | Reloj de infraestructura |
| `MediaStorage` | CMS → fotos y videos | Modelo, derechos y orden | Upload, storage, variantes y CDN |
| `ContactDestination` | Navegador → canal | Variables vacías y validación de esquema | URLs y endpoint aprobados |
| `AnalyticsConsent` | Navegador → analítica | Gate y allowlist runtime de eventos/propiedades | CMP, proveedor y configuración aprobados |
| `SearchPublication` | Sitio → crawlers | SEO fail-closed | Dominio, contenido e indexación aprobados |
| `ReleaseDeployment` | Build → hosting | Build local y PR borrador | Hosting y despliegue autorizados |

Los canales previstos son Telegram o WhatsApp por HTTPS, teléfono `tel:`, correo `mailto:` y formulario HTTPS. Permanecen vacíos hasta recibir destinos aprobados.

## Límites de confianza

1. **Internet → sitio público.** El navegador y sus entradas son no confiables. No pueden seleccionar estado, aprobación, actor ni rol CMS.
2. **Sitio público → contenido.** Solo los perfiles y ciudades que superan validación agregada entran al manifiesto y a las proyecciones públicas. Las respuestas públicas omiten IDs internos, aprobaciones, referencias de evidencia y metadatos de derechos.
3. **Operador → adaptador CMS.** La librería valida roles, revisión esperada y replay, pero no autentica personas. El adaptador productivo debe derivar actor y rol de una sesión validada, nunca del payload cliente.
4. **CMS → persistencia y auditoría.** Perfil, revisión, índice de slug, protección contra replay y evento deben confirmarse en una transacción. La bitácora conserva identificadores operativos opacos y nombres de campos, no valores de perfil.
5. **CMS → medios.** Los binarios y evidencias no entran en la bitácora. El adaptador debe separar archivo, metadatos, evidencia de derechos y variantes públicas.
6. **Sitio → canales y analítica.** Solo se activan destinos aprobados. La analítica no se carga antes de resolver consentimiento y configuración.
7. **Build → producción.** Build, pruebas, PR o smoke local no equivalen a despliegue ni aceptación. Producción es una frontera independiente con autorización separada.

## Estado de implementación

Implementado y verificado localmente:

- Madrid, Barcelona y redirección inicial.
- Contratos tipados de contenido y evidencia.
- Estados, roles runtime, duplicado seguro, archivo/restauración y disponibilidad.
- Revisión optimista, protección contra replay y auditoría local.
- Validación agregada y publicación fail-closed.
- Consulta pública de perfiles con parser URL fail-closed, filtros, paginación, detalle y proyección sin metadatos internos.
- Contrato de eventos de analítica deshabilitado sin consentimiento y sin propiedades personales.
- SEO cerrado por defecto.
- Pruebas de contrato y build local.

Parcial o bloqueado:

- Portada definitiva, ciudades restantes, UI de perfiles, contacto y legales.
- CMS sin código, preview y administración.
- Autenticación, base de datos, almacenamiento, upload y optimización multimedia.
- Contenido real y evidencia de edad, consentimiento y derechos.
- Cobertura y keywords, dominio, canales, analítica y textos legales.
- Diseño aprobado, QA visual/E2E, accesibilidad y UAT.
- Merge, hosting y despliegue.

La clasificación de rutas y los límites de la referencia competitiva se detallan en `REFERENCE_RESEARCH.md`; la medición condicionada a consentimiento se define en `MEASUREMENT_SPEC.md`.

## Criterios de integración

Una integración productiva solo es aceptable cuando:

1. Identidad y rol se resuelven server-side.
2. El adaptador persistente conserva unicidad, revisión esperada, archivo recuperable, replay y auditoría.
3. Cada mutación y evento se confirma atómicamente.
4. Publicar valida el agregado contra ciudades y servicios vigentes.
5. Preview, borradores y archivados requieren autorización y nunca son indexables.
6. Los medios usan upload validado, almacenamiento autorizado, variantes responsive y evidencia de derechos.
7. El manifiesto de rutas alimenta navegación, sitemap, canonicales y datos estructurados.
8. Contacto y analítica siguen deshabilitados hasta tener destinos, finalidad y consentimiento aprobados.
9. Checkout o pago requieren un cambio de alcance aprobado.
10. Instalación limpia, tests, build, crawl, navegador, accesibilidad, seguridad, rendimiento y UAT pasan sobre el artefacto versionado.
11. Luis Araujo acepta el release y autoriza separadamente merge o despliegue.

## Decisiones pendientes de Luis

- Diseño visual definitivo.
- Cobertura real y prioridades SEO por ciudad.
- Perfiles, medios y evidencias de edad, consentimiento y derechos.
- Dominio canónico y autorización de indexación.
- Canales reales y endpoint de formulario.
- Textos legales, política de cookies, analítica y edad.
- Hosting y proveedores de autenticación, base de datos, almacenamiento/CDN y analítica.
- Usuarios y roles administrativos, retención, backups y recuperación.
- Aceptación del incremento, merge y despliegue.
