# Decisiones e insumos que bloquean el siguiente gate

Estado: **acción humana requerida**. Estas decisiones cambian materialmente el producto; Codex no las inferirá ni las sustituirá con contenido ficticio.

## P0 — necesarias para construir y validar el flujo público

1. **Objetivo visual.** Confirmar una referencia final. Recomendación técnica actual: `WhatsApp Image 2026-08-26 at 5.38.50 PM.jpeg` para portada responsive y `WhatsApp Image 2026-08-26 at 5.19.36 PM.jpeg` para listado/ficha. Indicar también qué elementos de la tercera propuesta deben conservarse.
2. **Activos de marca.** Entregar logo/símbolo original en formato autorizado, tipografías/licencias y reglas de uso. Las imágenes de mockup no prueban derechos ni son activos de producción.
3. **Perfiles y medios reales.** Proporcionar el paquete versionado con los campos de `lib/content/types.ts` y las evidencias enumeradas en `LEGAL_INPUTS_REQUIRED.md`; no enviar documentos sensibles por chat.
4. **Cobertura y propuesta.** Aprobar ciudades/zonas realmente atendidas, servicio exclusivamente en domicilio/hotel, disponibilidad, horarios y restricciones.
5. **Contacto.** Aprobar URLs/números/correo/endpoints reales para Telegram, WhatsApp, teléfono y formulario, junto con responsable y SLA operativo.
6. **Legal.** Asignar responsable y aprobar identidad del prestador, privacidad, cookies, términos, edad y derechos de imagen.

## P0 — necesarias para un CMS operacional

7. **Identidad y roles.** Proveedor de autenticación, usuarios iniciales, MFA, alta/baja y autoridad admin/editor.
8. **Persistencia.** Base de datos, región, backups, retención, restauración, cifrado y responsable.
9. **Medios.** Almacenamiento/CDN, límites, formatos, variantes, moderación, borrado y evidencias de derechos.
10. **Preview y auditoría.** Quién puede previsualizar, caducidad de enlaces, retención de logs y acceso a auditoría.

## P1 — necesarias para SEO, medición y release

11. **Dominio canónico.** Origen HTTPS final, propiedad y autorización separada para indexar.
12. **Prioridad SEO.** Fuente de demanda aprobada, periodo/mercado y cohorte inicial de rutas. Sin esto no se crean páginas locales masivas.
13. **Analítica/CMP.** Proveedor, finalidades, consentimiento, DPA, región y retención; hasta entonces sigue deshabilitada.
14. **Navegador de QA.** Elegir el navegador autorizado para comparación visual, responsive, accesibilidad y E2E.
15. **Infraestructura y operación.** Hosting, ambientes, secretos, observabilidad, responsables y rollback.
16. **Aceptación y acciones externas.** Aceptación formal, merge, hosting, despliegue e indexación son decisiones separadas.

## Formato mínimo de respuesta

Puede responder con un documento versionado que use los números anteriores. Cada punto debe indicar: `APROBADO`, `RECHAZADO`, `PENDIENTE` o `NO APLICA`; decisión concreta; responsable; fecha; y ruta segura de la evidencia cuando corresponda.

Si una decisión permanece pendiente, el requisito asociado seguirá `BLOCKED` o `PARTIAL`; no se degradará silenciosamente.
