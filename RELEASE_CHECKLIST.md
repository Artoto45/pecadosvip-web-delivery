# Checklist de release — PecadosVip Web

Estado actual: **NO GO**. Este checklist separa preparación, aceptación, merge, despliegue e indexación.

## 1. Evidencia y alcance

- [ ] Requisitos P0/P1 implementados o excepción aprobada por escrito.
- [ ] `REQUIREMENTS_TRACEABILITY.csv` sin estados `OPEN`, `BLOCKED` o `AT_RISK` obligatorios.
- [ ] Diseño, contenido, cobertura y legal con versión y aprobación.
- [ ] Perfiles/medios con mayoría de edad, consentimiento y derechos vigentes.
- [ ] Dominio, contacto, infraestructura, analítica y responsables confirmados.

## 2. Artefacto

- [ ] Commit y tag inmutables; árbol Git limpio.
- [ ] Lockfile congelado e instalación limpia reproducible.
- [ ] `pnpm run validate` PASS.
- [ ] Inventario y hashes de la carpeta versionada de entrega.
- [ ] Configuración de ejemplo sin secretos.
- [ ] Backup y rollback ensayados.

## 3. Calidad

- [ ] Navegación y E2E de portada → ciudad → listado → ficha → contacto.
- [ ] Vacío, no disponible, filtros inválidos, 404, error de red y fallback.
- [ ] 360, 390, 768, 1024, 1440 y 1920 px.
- [ ] Teclado, foco, semántica, contraste, alt y formularios.
- [ ] Comparación visual con referencia aprobada en mismo viewport/estado.
- [ ] Consola/red sin errores atribuibles; performance medido sobre build.
- [ ] Auditoría de seguridad compatible y dependencias evaluadas.
- [ ] CMS autenticado: roles, estados, preview, auditoría, replay, concurrencia, medios y recuperación.

## 4. SEO, privacidad y datos

- [ ] Origen canónico HTTPS verificado.
- [ ] Metadata, headings, breadcrumbs, schema, enlaces, robots y sitemap auditados.
- [ ] Solo rutas aprobadas, canónicas y útiles son indexables.
- [ ] Formularios minimizan datos y muestran información de privacidad.
- [ ] CMP acepta, rechaza, configura y revoca; cero tracking antes del consentimiento.
- [ ] Analítica usa solo allowlist y no contiene PII/perfiles/contacto.
- [ ] Legal, cookies, edad y procedimientos de derechos aprobados.

## 5. Gates externos separados

- [ ] Aceptación formal del release por Luis Araujo.
- [ ] Autorización de merge.
- [ ] Autorización de despliegue y ventana operativa.
- [ ] Smoke postdespliegue y observabilidad PASS.
- [ ] Autorización de indexación.
- [ ] Search Console/analítica configuradas y verificadas, si aplican.

No marcar un gate por evidencia de otro: un build no es UAT; un merge no es despliegue; un health check no es E2E; un despliegue no autoriza indexación.
