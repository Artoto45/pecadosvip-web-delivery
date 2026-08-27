# PROJECT CONTROL — PecadosVip Web

Última actualización: 2026-08-27 03:08 America/Bogota
Fecha límite dirigida por el usuario: 2026-08-29 22:00 America/Bogota
Patrocinador y autoridad de aceptación: Luis Araujo
Estado actual: **ALERTA ROJA / EJECUCIÓN CON BLOQUEOS EXTERNOS**

## Propósito, valor y éxito

Entregar un único sitio público de PecadosVip para Madrid, Barcelona y cobertura local escalable, con imagen premium y discreta, descubrimiento de perfiles, contacto privado y administración de contenidos sin tocar código.

El éxito técnico requiere trazabilidad completa de requisitos P0/P1, build reproducible, funcionamiento responsive, SEO técnico, accesibilidad, ausencia de defectos críticos y handoff reproducible. La aceptación comercial y visual pertenece a Luis y no se infiere de un build aprobado técnicamente.

## Enfoque y tailoring PMBOK 8

Enfoque híbrido de nivel 2:

- Predictivo para fecha límite, gates, seguridad, alcance obligatorio, trazabilidad, release y aceptación.
- Adaptativo para interfaz, contenido provisional, iteraciones visuales y correcciones.
- Elaboración progresiva para SEO local, CMS e infraestructura aún no confirmados.

Las Focus Areas de Initiating, Planning, Executing, Monitoring and Controlling y Closing se superponen. Se usan solo los artefactos que mejoran decisión, coordinación, control o aprendizaje.

## Alcance

### Incluido

- Arquitectura pública escalable por ciudad, localidad y perfil.
- Inicio, hubs geográficos, listado de perfiles, ficha de perfil, contacto/reserva sin checkout e información legal.
- SEO técnico, metadata, canonical, sitemap, robots, breadcrumbs y schema aplicable.
- Experiencia responsive y accesible.
- Modelo de CMS con estados, disponibilidad, roles, auditoría, preview y borrado lógico.
- Gestión de fotos y vídeo con contrato de almacenamiento/optimización documentado.
- Pruebas, evidencia, release y guía de operación.

### Excluido o condicionado

- Pago y reserva online en esta fase.
- Promesas de posición SEO o permanencia en rankings.
- Publicación externa, compra de dominio, hosting, cuentas de analítica o servicios pagados sin autorización.
- Carga pública de perfiles o multimedia sin contenido, consentimiento, prueba de mayoría de edad y derechos de uso.
- Textos legales copiados de terceros.

## Gobernanza

- Luis Araujo: aprueba diseño, contenido, cobertura, legal, presupuesto y aceptación final.
- Codex principal: integra requisitos, código, pruebas, release y control de cambios.
- Subagentes: análisis documental, auditoría de archivos y análisis visual en solo lectura; no cierran el proyecto.
- Cambios P0/P1, publicación, gasto, credenciales o decisiones irreversibles se escalan a Luis.
- Gates: evidencia base → arquitectura → incremento vertical → integración → QA independiente → release → aceptación.

## Stakeholders

- Luis Araujo: patrocinador, propietario del producto y aceptación.
- Carlos/equipo de desarrollo: entrega técnica, según las reuniones.
- Nelson: infraestructura/costos mencionados, autoridad concreta pendiente.
- Asistente/secretario: usuario operativo previsto del CMS.
- Personas mostradas en perfiles: consentimiento, mayoría de edad, privacidad y derechos de imagen pendientes.
- Proveedores de dominio, hosting, almacenamiento, analítica y mensajería: no seleccionados.

## Recursos

- Base reutilizable: Next.js 16.2.6, React 19.2.6, Vinext 1.0.0-beta.3, Vite 8.0.13 y pnpm 11.19.0.
- Repositorio original preservado: `pecadosvip-web`, commit `013307a`.
- Repositorio de integración aislado: `pecadosvip-web-delivery`.
- Checkpoint remoto privado: `Artoto45/pecadosvip-web-delivery`, PR borrador #1, rama `codex/pagina-web-checkpoint`.
- Copia fuera de OneDrive: `C:\Users\artot\AppData\Local\CodexWork\Pagina_Web-20260826-2111`.
- Faltan: proveedor CMS/DB/objetos, credenciales, dominio confirmado, contenido real, activos licenciados y aprobación visual.

## Finanzas

- Presupuesto mencionado: 600 EUR, aceptación condicionada en la evidencia.
- Supuesto de control: cero gasto externo nuevo sin autorización.
- Desarrollo, hosting, almacenamiento multimedia, dominio, analítica y SEO mensual se controlan por separado.
- La preparación SEO inicial no incluye garantía ni mantenimiento recurrente.

## Pronóstico y alerta roja

Estimación para una entrega de producción completa con la evidencia disponible:

- Frontend público y responsive: 30–45 h.
- Perfiles, filtros, detalle y contenido provisional: 18–28 h.
- CMS seguro, roles, auditoría, media y persistencia: 60–100 h.
- SEO local, legal, contenido y configuración externa: 20–40 h más dependencias humanas.
- QA, correcciones, release y handoff: 20–30 h.

Total de línea base: 130–215 h. A las 02:13 del 27/08 quedan 67,78 h calendario; la reserva final del 20 % equivale a 13,56 h y deja 54,22 h antes del gate final. La alerta roja permanece: contratos y pruebas reducen riesgo, pero las dependencias humanas y el trabajo de frontend, CMS operacional, contenido, legal y QA todavía exceden la capacidad disponible sin aumentar recursos, ampliar fecha o aceptar excepciones explícitas.

## Cronograma hacia atrás

| Hito | Fecha objetivo | Gate de salida |
|---|---|---|
| Línea base de evidencia y arquitectura | 27/08 02:00 | 100 % de archivos inventariados; requisitos y bloqueos trazados |
| Incremento vertical público | 27/08 18:00 | Inicio → listado → perfil → contacto ejecutable |
| CMS local y rutas SEO prioritarias | 28/08 14:00 | CRUD/estados/preview local; rutas y metadata verificadas |
| Integración y congelamiento de alcance | 29/08 07:00 | P0/P1 implementados o excepción explícita |
| Reserva QA/release/handoff | 29/08 07:00–22:00 | regresión, correcciones, paquete, hashes y smoke final |

Ruta crítica: selección visual → activos/contenido → incremento público → contrato CMS/persistencia → integración → QA visual/navegador → release. La selección visual, contenido real, legal e infraestructura son dependencias externas activas.

## EDT / backlog de valor

1. Gobierno y evidencia
   1.1 Inventario y hashes
   1.2 Matriz de requisitos
   1.3 Riesgos, decisiones y cambios
2. Arquitectura pública
   2.1 Sistema visual y navegación
   2.2 Inicio, hubs y cobertura
   2.3 Listado/filtros y ficha de perfil
   2.4 Contacto y legales
3. Administración
   3.1 Modelo de datos y estados
   3.2 Roles, permisos, auditoría y preview
   3.3 Multimedia, orden, optimización y almacenamiento
4. SEO y medición
   4.1 Metadata/canonical/schema/breadcrumbs
   4.2 Sitemap/robots/enlazado
   4.3 Analítica/Search Console condicionadas a cuentas
5. Calidad y transición
   5.1 Lint/typecheck/build
   5.2 Responsive/accesibilidad/navegador/seguridad
   5.3 Release, hashes, rollback y guía

## Estado por dominio

- Governance: autoridad y gates definidos; aprobación visual/comercial pendiente.
- Scope: 20 requisitos normalizados; REQ-010 y REQ-011 están verificados en contrato; REQ-008 y REQ-020 están parciales; CMS e infraestructura conservan decisiones abiertas.
- Schedule: alerta roja activa; reserva final protegida.
- Finance: cero gasto nuevo; 600 EUR no confirmado como alcance cerrado.
- Stakeholders: roles principales identificados; datos de responsables externos pendientes.
- Resources: stack, clon, remoto privado y 46 pruebas de contrato verificadas; contenido, activos y servicios externos faltantes.
- Risk: exposición global alta por alcance/tiempo, legal, contenido y diseño no aprobado.

## Próximo hito

La arquitectura, la investigación acotada, la especificación de medición, el contrato CMS local, las puertas SEO seguras, la consulta pública y la analítica fail-closed están integrados. El siguiente incremento técnico requeriría un route handler, fuente persistente, CMP o proveedor; el incremento visual sigue pendiente de la decisión material: propuesta 5:38:50 como portada y 5:19:36 como referencia de listado y perfil.
