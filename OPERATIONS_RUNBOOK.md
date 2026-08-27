# Runbook local y de transición — PecadosVip Web

Estado: entorno de desarrollo validado, no operación productiva. Este runbook no autoriza merge, despliegue, indexación ni activación de servicios externos.

## Recuperación reproducible

1. Clonar el repositorio privado en una carpeta nueva.
2. Seleccionar `codex/pagina-web-checkpoint` para el trabajo actual o `main` para el baseline heredado.
3. Verificar Node.js `>=22.13.0` y pnpm `11.19.0`.
4. Ejecutar `pnpm install --frozen-lockfile`.
5. Ejecutar `pnpm run validate`.
6. Comparar el SHA local con el remoto antes de afirmar que la copia está actualizada.

No usar `reset --hard`, `clean` ni restauraciones destructivas en una copia con trabajo local. Para recuperar un baseline, usar otro clon o worktree.

## Comandos locales

```powershell
pnpm run dev
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run start
pnpm run validate
```

`pnpm run validate` es la puerta técnica local: lint, tipos, pruebas y build. No incluye navegador, accesibilidad, seguridad completa, proveedor, contenido real ni UAT.

## Configuración segura

Crear `.env.local` solo en el entorno autorizado. Nunca confirmarlo en Git. Mantener:

```dotenv
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_ALLOW_INDEXING=false
NEXT_PUBLIC_CONTENT_APPROVED=false
NEXT_PUBLIC_CONTACT_FORM_ACTION=
NEXT_PUBLIC_WHATSAPP_URL=
NEXT_PUBLIC_TELEGRAM_URL=
NEXT_PUBLIC_PHONE_URL=
```

No cambiar las dos banderas a `true` hasta superar el gate agregado y contar con autorización explícita. Un dominio real no implica aprobación de contenido; las aprobaciones tampoco autorizan despliegue.

## Contenido y CMS actual

`InMemoryProfileRepository` es una prueba local de dominio:

- No persiste al reiniciar.
- No autentica personas.
- No sube ni transforma archivos.
- No ofrece UI administrativa ni preview.
- Rechaza roles desconocidos, revisiones obsoletas y replay de solicitudes.
- Archivar es la eliminación normal; restaurar vuelve a borrador e invalida aprobación/evidencia.

No ingresar perfiles reales ni documentos sensibles en esta implementación. El adaptador productivo debe completar los criterios de `ARCHITECTURE.md`.

## Estado público esperado sin configuración

- Solo existen `/`, `/madrid` y `/barcelona` en el build.
- `/` redirige a Madrid.
- `robots.txt` bloquea crawling.
- `sitemap.xml` no publica URLs.
- Madrid y Barcelona emiten `noindex, nofollow`.
- No se emiten canonicales ni JSON-LD con un origen supuesto.
- Contacto y analítica permanecen deshabilitados.

Una desviación de este comportamiento antes del release es un incidente de publicación y debe corregirse antes de continuar.

## Diagnóstico

1. Registrar SHA, rama, comando, hora y salida exacta.
2. Confirmar si el problema es local, build, staging o producción; no mezclar estados.
3. Ejecutar primero la prueba más estrecha y luego `pnpm run validate`.
4. Revisar `QA_EVIDENCE.md` y `CONTROL_LOG.csv` antes de declarar una regresión nueva.
5. No imprimir `.env`, tokens, evidencias de identidad ni datos personales.
6. Si existe riesgo de exposición, mantener noindex/contacto/analítica cerrados y escalar al responsable.

## Transición a infraestructura

Antes de conectar autenticación, DB, objetos, CMP o hosting:

- Registrar la decisión y propietario.
- Definir ambientes y secretos fuera del repositorio.
- Implementar adaptadores sin debilitar los contratos runtime.
- Añadir pruebas de integración y migración/rollback.
- Ejecutar staging autenticado, navegador, accesibilidad, red, seguridad y UAT.
- Documentar backup, restauración, rotación, observabilidad y soporte.

Las decisiones e insumos pendientes están consolidados en `DECISIONS_REQUIRED.md`.
