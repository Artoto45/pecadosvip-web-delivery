# PecadosVip Web

> Estado actual: **trabajo en curso, no operacional y no autorizado para despliegue**.

Este repositorio conserva la base pública existente de Madrid y Barcelona y añade el control de proyecto, los contratos de contenido y las puertas de publicación necesarias para continuar el producto de forma segura. Un build correcto no significa que el alcance, el contenido, la conformidad legal o la aceptación del cliente estén completos.

## Alcance implementado

- Páginas heredadas: `/`, `/madrid` y `/barcelona`.
- Contratos tipados para ciudades, perfiles, servicios, medios, aprobaciones, contacto y documentos legales.
- Estados `draft`, `hidden`, `published` y `archived`.
- Roles de contrato `admin` y `editor`, duplicado seguro, archivo y restauración.
- Repositorio CMS local en memoria con revisión optimista, protección contra repetición, disponibilidad, orden multimedia y bitácora sin contenido personal de perfiles.
- Validación de mayoría de edad, consentimiento, derechos de uso, contenido local, cobertura y requisitos de release.
- Manifiesto de rutas que excluye registros no publicables.
- Consulta pública de perfiles con parser URL estricto, filtros, paginación y detalle proyectado sin IDs internos ni referencias de evidencia.
- Contrato de analítica fail-closed con consentimiento obligatorio y allowlist runtime que rechaza PII y propiedades desconocidas.
- SEO cerrado por defecto hasta confirmar dominio, indexación y contenido.
- Artefactos de gobierno, trazabilidad, riesgos, QA y handoff provisional.

Todavía no están implementadas las rutas y la interfaz del flujo público de perfiles, el CMS operativo, autenticación, persistencia, almacenamiento multimedia, legales aprobados, canales reales, proveedor/CMP de analítica, ciudades restantes ni QA visual/E2E.

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
```

Conserva esos valores hasta recibir el origen definitivo y las dos aprobaciones. Después, `NEXT_PUBLIC_SITE_URL` debe contener un origen HTTPS real, sin ruta, usuario, contraseña, query ni fragmento. Los dominios locales o reservados son rechazados. Las dos banderas no sustituyen la validación de contenido ni la aceptación formal.

Los canales permanecen vacíos hasta recibir destinos aprobados:

```dotenv
NEXT_PUBLIC_CONTACT_FORM_ACTION=
NEXT_PUBLIC_WHATSAPP_URL=
NEXT_PUBLIC_TELEGRAM_URL=
NEXT_PUBLIC_PHONE_URL=
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

El build de producción queda en `dist/`. Antes de afirmar que existe un release deben ejecutarse además la revisión de navegador, accesibilidad, seguridad compatible, rendimiento y smoke desde la carpeta versionada de entrega.

## Comportamiento seguro por defecto

Sin configuración aprobada:

- `robots.txt` responde `Disallow: /`.
- `sitemap.xml` no contiene URLs.
- Madrid y Barcelona emiten `noindex, nofollow`.
- No se emiten canonicales ni JSON-LD con un dominio supuesto.
- Formularios y canales externos permanecen deshabilitados.
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

## GitHub y recuperación

El trabajo continúa en `codex/pagina-web-checkpoint` mediante un PR en borrador. `main` conserva el baseline heredado `013307a`.

Para recuperar el baseline sin destruir este checkout, crea un clon nuevo del repositorio y selecciona `main`. No uses `reset --hard`, `clean` ni restauraciones destructivas sobre una copia con trabajo no confirmado.

## Publicación y operación

No hay autorización para merge, hosting ni despliegue. Antes de producción se necesitan, como mínimo, aprobación visual, contenido real, evidencia legal y de derechos, dominio, canales, proveedor de autenticación/base de datos/almacenamiento, analítica con consentimiento y aceptación formal de Luis Araujo.
