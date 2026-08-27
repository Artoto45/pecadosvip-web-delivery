# PecadosVip Web

> Estado actual: **trabajo en curso, no operacional y no autorizado para despliegue**.

Este repositorio conserva la base pública existente de Madrid y Barcelona y añade el control de proyecto, los contratos de contenido y las puertas de publicación necesarias para continuar el producto de forma segura. Un build correcto no significa que el alcance, el contenido, la conformidad legal o la aceptación del cliente estén completos.

## Alcance implementado

- Flujo público integrado detrás de un boundary de release: portada `/`, ciudades `/madrid` y `/barcelona`, listado con filtros GET `/perfiles`, detalle seguro `/perfiles/{slug}`, contacto `/contacto` y documentos `/legal/{documento}`.
- Contratos tipados para ciudades, perfiles, servicios, medios, aprobaciones, contacto y documentos legales.
- Estados `draft`, `hidden`, `published` y `archived`.
- Roles de contrato `admin` y `editor`, duplicado seguro, archivo y restauración.
- Repositorio CMS local en memoria con revisión optimista, protección contra repetición, disponibilidad, orden multimedia y bitácora sin contenido personal de perfiles.
- Validación de mayoría de edad, consentimiento, derechos de uso, contenido local, cobertura y requisitos de release.
- Manifiesto de rutas que excluye registros no publicables.
- Consulta pública de perfiles con parser URL estricto, filtros, paginación y detalle proyectado sin IDs internos ni referencias de evidencia.
- Contrato de analítica fail-closed con consentimiento obligatorio y allowlist runtime que rechaza PII y propiedades desconocidas.
- SEO cerrado por defecto hasta confirmar dominio, indexación y contenido.
- Canales externos cerrados salvo que pasen conjuntamente el release agregado, la aprobación de contacto, la aprobación de privacidad y la validación del destino.
- Auditoría técnica UE/España con matriz de aplicabilidad, hallazgos trazables y decisión de release `NO-GO` en `compliance/ue-es/`.
- Artefactos de gobierno, trazabilidad, riesgos, QA y handoff provisional.

Todavía no están implementados el CMS operativo, autenticación, persistencia, almacenamiento multimedia, legales aprobados, perfiles/medios reales, canales reales, proveedor/CMP de analítica ni ciudades restantes. La evidencia de navegador del UI es pre-boundary y tiene límites; faltan un preview real operativo, fidelidad visual contra una referencia aprobada, auditoría WCAG completa, seguridad/rendimiento del release y E2E desplegado.

## Requisitos locales

- Node.js `>=22.13.0`.
- pnpm `11.19.0`.

## Instalación reproducible

```powershell
pnpm install --frozen-lockfile
```

No se requieren servicios externos para lint, tipos, pruebas de contratos o build.

## Configuración

Copia `.env.example` a `.env.local` únicamente en tu entorno. No confirmes `.env.local` ni valores sensibles en Git.

La publicación SEO permanece deshabilitada salvo que se cumplan simultáneamente estas condiciones:

```dotenv
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_ALLOW_INDEXING=false
NEXT_PUBLIC_CONTENT_APPROVED=false
NEXT_PUBLIC_CONTACT_APPROVED=false
NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED=false
```

Conserva esos valores hasta recibir el origen definitivo y las dos aprobaciones. Después, `NEXT_PUBLIC_SITE_URL` debe contener un origen HTTPS real, sin ruta, usuario, contraseña, query ni fragmento. Los dominios locales o reservados son rechazados. Las dos banderas no sustituyen la validación de contenido ni la aceptación formal.

Los canales permanecen vacíos hasta recibir destinos aprobados y superar el release agregado:

```dotenv
NEXT_PUBLIC_CONTACT_FORM_ACTION=
NEXT_PUBLIC_WHATSAPP_URL=
NEXT_PUBLIC_TELEGRAM_URL=
NEXT_PUBLIC_PHONE_URL=
NEXT_PUBLIC_EMAIL_URL=
```

## Desarrollo y validación

```powershell
pnpm run dev
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run start
```

Puerta local completa:

```powershell
pnpm run validate
```

El build de producción queda en `dist/`. La puerta final de este checkpoint pasó 65 pruebas además de lint, tipos y build; debe repetirse si el árbol cambia. Antes de afirmar que existe un release deben completarse accesibilidad, seguridad compatible, rendimiento y smoke desde la carpeta versionada de entrega.

Cuando el release agregado está bloqueado, `vinext start` muestra únicamente una pantalla neutral en todas las rutas públicas, aunque se configuren banderas de contacto. **El preview Vinext real no está operativo**: el intento de mostrar el UI de borrador en desarrollo siguió entregando el holding. Las capturas y smokes del UI conservados en `output/playwright/` son evidencia pre-boundary, no E2E del artefacto final ni mecanismo de staging.

Vinext `1.0.0-beta.3` produjo errores reales en la navegación cliente de `next/link` durante el smoke pre-boundary. Las rutas públicas usan temporalmente enlaces HTML nativos; la navegación se verificó en aquel UI sin errores de consola. Esta excepción y el preview deben revisarse al actualizar o estabilizar Vinext.

## Comportamiento seguro por defecto

Sin configuración aprobada:

- `robots.txt` responde `Disallow: /`.
- `sitemap.xml` no contiene URLs.
- Todas las rutas públicas actuales emiten `noindex, nofollow`.
- No se emiten canonicales ni JSON-LD con un dominio supuesto.
- Formularios y canales externos permanecen deshabilitados.
- Dos banderas de entorno no pueden activar contacto por sí solas: el release agregado también debe estar aprobado.
- Las rutas públicas muestran únicamente el holding neutral; el borrador no se renderiza en producción hasta que el agregado sea válido.
- Las rutas legales devuelven 404 y no aparecen en el pie hasta que el documento y el release estén aprobados.
- Registros `draft`, `hidden`, `archived` o sin evidencia no entran al manifiesto público.

## Datos y contenidos

Los registros sintéticos viven únicamente en `tests/` y no son importados por la aplicación. No hay perfiles reales ni medios personales en este repositorio. La carga pública exige evidencia trazable de mayoría de edad, consentimiento, derechos de uso y aprobación de contenido.

### Límite del repositorio CMS local

`InMemoryProfileRepository` es una prueba de dominio y seguridad para desarrollo y tests. No es un CMS operacional: no persiste al reiniciar, no autentica usuarios, no almacena archivos y no sustituye una base de datos transaccional. Su API omite borrado físico; archivar es la eliminación normal y restaurar invalida aprobación y evidencias anteriores.

La bitácora conserva identificadores operativos opacos de actor y solicitud, no biografías ni valores de perfil. El adaptador productivo deberá definir acceso, retención y seudonimización. Una solicitud repetida se rechaza; no se devuelve automáticamente el resultado anterior, por lo que esto es protección contra replay y no idempotencia completa.

## Gobierno y evidencia

- `ARCHITECTURE.md`: límites, mapa URL, puertos, fronteras de confianza y criterios de integración.
- `REFERENCE_RESEARCH.md`: observación de referencias, clasificación SEO y límites de uso.
- `MEASUREMENT_SPEC.md`: taxonomía de analítica, minimización, consentimiento y aceptación.
- `LEGAL_INPUTS_REQUIRED.md`: intake legal/privacidad y gate de publicación, sin inventar textos.
- `DECISIONS_REQUIRED.md`: decisiones humanas P0/P1 que bloquean el siguiente gate.
- `OPERATIONS_RUNBOOK.md`: recuperación, validación, diagnóstico y transición segura.
- `RELEASE_CHECKLIST.md`: gates separados de QA, aceptación, merge, despliegue e indexación.
- `PROJECT_CONTROL.md`: estado, gobierno, alcance, cronograma y pronóstico.
- `INPUT_MANIFEST.csv`: inventario y hashes de las fuentes analizadas.
- `REQUIREMENTS_TRACEABILITY.csv`: requisito → implementación → prueba → evidencia.
- `CONTROL_LOG.csv`: riesgos, issues, decisiones, contradicciones y cambios.
- `QA_EVIDENCE.md`: resultados observados y controles pendientes.
- `HANDOFF_CLOSEOUT.md`: handoff provisional; no representa cierre.
- `compliance/ue-es/audit-report.md`: evaluación técnica UE/España, aplicabilidad, hallazgos y límites; no es dictamen jurídico.

## GitHub y recuperación

El trabajo continúa en `codex/pagina-web-checkpoint` mediante un PR en borrador. `main` conserva el baseline heredado `013307a`.

Para recuperar el baseline sin destruir este checkout, crea un clon nuevo del repositorio y selecciona `main`. No uses `reset --hard`, `clean` ni restauraciones destructivas sobre una copia con trabajo no confirmado.

## Publicación y operación

No hay autorización para merge, hosting ni despliegue. Antes de producción se necesitan, como mínimo, aprobación visual, contenido real, evidencia legal y de derechos, dominio, canales, proveedor de autenticación/base de datos/almacenamiento, analítica con consentimiento y aceptación formal de Luis Araujo.
