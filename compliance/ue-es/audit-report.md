# Informe de auditoría web UE/España — A-PECADOSVIP-20260827

## Resumen ejecutivo

- Activo y propietario: repositorio `pecadosvip-web-delivery`; Luis Araujo es la autoridad de aceptación del producto, pero el prestador legal no está identificado.
- Snapshot y entorno: rama `codex/pagina-web-checkpoint`, base `485277e3236b6aa8f897b408f3f88ab4161b831f` más working tree auditado **no congelado**; build local, sin URL desplegada. `checkpoint_sha`, `tree_sha` y `effective_at` están pendientes del commit final.
- Fecha de auditoría y observación: 2026-08-27; última prueba integrada registrada 2026-08-27T15:40:03Z. Esto no sustituye el `effective_at` del futuro snapshot congelado.
- Objetivo y autorización: medir y mejorar la alineación técnica con controles candidatos de UE/España mediante revisión pasiva y cambios locales reversibles. No se autorizó desplegar, indexar, publicar perfiles, activar contacto ni probar terceros.
- Conclusión limitada: evaluación técnica de controles y riesgos; no es certificación, declaración de conformidad ni dictamen jurídico.
- Decisión de release: **NO-GO**. El incremento local puede continuar, pero publicación, indexación, perfiles reales, formularios y claims comerciales permanecen cerrados.
- Estado técnico por defecto: el build de producción muestra únicamente una pantalla neutral en todas las rutas públicas mientras el gate agregado esté bloqueado; una bandera de preview no lo puede abrir en `NODE_ENV=production`.
- Avance de ejecución ponderado estimado: **50–54/100 (punto medio 52)**. Es un proxy de paquetes de trabajo, no una tasa de controles ni aceptación: solo **2/20 requisitos (10 %)** están `VERIFIED`; 12 están `PARTIAL`, 5 `BLOCKED` y 1 `AT_RISK`.

Riesgos principales:

1. La actividad contractual y su publicidad no están definidas. Los insumos usan terminología `escort`, pero no prueban la naturaleza jurídica del servicio; se requiere revisión escrita de un abogado en España antes de publicar.
2. No se conocen identidad del prestador, responsable/encargados, bases, retención, derechos, proveedores ni textos de transparencia.
3. No se sabe si el contacto concluye un contrato B2C a distancia ni qué información, cancelación o desistimiento resultan aplicables.
4. La accesibilidad mejoró en teclado y responsive, pero no se completó una auditoría WCAG 2.2 A/AA ni prueba con lector de pantalla.
5. El contenido, inferencias, escala y proveedores del tratamiento adulto no están congelados; no puede concluirse todavía si existe tratamiento del art. 9 RGPD ni si el art. 35 exige EIPD.
6. El targeting Madrid/Barcelona-Cataluña está observado, pero no se resolvieron establecimiento, lugar de prestación ni inventario dirigido BOE/BOCM/DOGC o municipal.

## Alcance, muestra y cobertura

| Universo | Muestra | Controles ejecutados | NOT_TESTED | NOT_APPLICABLE snapshot | NOT_SELECTED | Incertidumbre |
|---:|---:|---:|---:|---:|---:|---|
| 46 | 20 | 14 | 6 | 16 | 10 | Alta para operador, actividad, formación contractual, tamaño empresarial, región, tecnologías desplegadas y cobertura de asistencia técnica. |

El ledger reproducible está en `coverage-ledger.json`: contiene los 46 IDs únicos del catálogo 2026.08.26, cada uno en una sola clase. La muestra es 14 `EXECUTED` + 6 `NOT_TESTED`; los 16 `NOT_APPLICABLE_CURRENT_SNAPSHOT` tienen trigger de reapertura y los 10 `NOT_SELECTED` no reciben conclusión.

Perfiles probados: revisión estática de escritorio/móvil, visitante anónimo y smoke de teclado. Chromium local en 360, 390, 768, 1024, 1440 y 1920 CSS px. No se probó lector de pantalla ni runtime desplegado.

## Matriz de aplicabilidad

| Instrumento | Estado | Fundamento observado | Pregunta abierta |
|---|---|---|---|
| RGPD 2016/679 + LO 3/2018 | `APPLICABLE` al tratamiento planificado; art. 9/EIPD art. 35 `UNCERTAIN` | El modelo contempla datos personales, medios, disponibilidad, evidencias y contacto; el contexto adulto por sí solo no permite concluir categorías especiales ni EIPD obligatoria. | ¿Quién trata qué dato, qué inferencias permite el diseño, con qué base, retención, destinatarios y qué arroja el screening de arts. 9 y 35? |
| LOPDGDD art. 7 / política de edad | `UNCERTAIN` / asesoría requerida | La validación excluye perfiles menores de 18, pero no existe política final de visitante ni age assurance. El art. 7 no se presenta como gate 18+ universal. | ¿Qué control proporcional exige el servicio finalmente clasificado y qué datos recogería? |
| LO 1/1982 + RGPD para imagen | `APPLICABLE` a la publicación planificada | El diseño prevé personas y media identificables; no hay activos reales ni paquete de derechos que validar. | ¿Qué identidad, consentimiento/licencia, alcance, duración, retirada y takedown existen por persona y activo? |
| LSSI 34/2002 | `UNCERTAIN` | El sitio parece dirigido a España, pero faltan prestador, establecimiento, modelo contractual e inventario tecnológico desplegado. | ¿Qué identidad debe publicarse y qué tecnologías no esenciales se instalan? |
| TRLGDCU 1/2007 | `UNCERTAIN` | No hay checkout ni pago web, pero el contrato podría formarse mediante mensajería o teléfono. | ¿Cuándo se forma el contrato, qué se ofrece, quién cobra y qué régimen de cancelación aplica? |
| Ley 11/2023 + RD 193/2023 | `UNCERTAIN` | El alcance depende del servicio cubierto, tamaño/excepción, categoría y calendario. | ¿Es un servicio cubierto y es el operador una microempresa? |
| WCAG 2.2 AA | `APPLICABLE` como baseline voluntario | El proyecto lo adopta como criterio de calidad, sin presentarlo como ley universal. | ¿Qué muestra y tecnologías de apoyo integrarán la aceptación? |
| Ley 34/1988 General de Publicidad | `UNCERTAIN` / asesoría requerida | Las páginas y el SEO promoverían contratación; las notas usan `escort`, pero no permiten clasificar por sí solas la actividad. | ¿Puede asesoría española aprobar la actividad exacta, imágenes, copy, SEO y contacto? |
| DSA 2022/2065 | `UNCERTAIN` | El código no implementa marketplace, intermediación ni UGC, pero no se confirmó si los perfiles son contenido propio o terceros independientes. | ¿Qué rol jurídico y contractual tiene cada perfil? |
| Alcance regional Madrid/Cataluña | `UNCERTAIN` / `PENDING_VERIFICATION` | El targeting está observado; faltan prestador, establecimiento, destinatarios, lugar de prestación y actividad clasificada. | ¿Qué búsqueda dirigida en BOE, BOCM, DOGC y, si procede, fuentes municipales corresponde a los hechos finales? |
| NIS2, DORA, CRA y AI Act | `NOT_APPLICABLE` al snapshot observado | No se observó entidad regulada, producto digital comercializado ni sistema de IA operativo. | Reabrir cuando aparezca un rol, producto o componente no visible hoy. |

La justificación completa, supuestos y fuentes está en `applicability-matrix.md`; la salida determinista del resolver está en `resolver-output.json`.

## Selección material no exhaustiva de autoridades, normas y estándares

| Clase | Instrumento/versión | Efecto usado en esta auditoría | URL oficial | Verificado |
|---|---|---|---|---|
| `BINDING_LAW` | RGPD consolidado, arts. 2–9, 12–25, 32 y 35 + LO 3/2018, arts. 6–11 | Deberes de protección de datos dentro de su alcance; art. 9 y EIPD art. 35 quedan como preguntas, no conclusiones. | [EUR-Lex](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:02016R0679-20160504) / [BOE](https://www.boe.es/eli/es/lo/2018/12/05/3/con) | 2026-08-26/27 |
| `BINDING_LAW` | Ley 34/2002 LSSI | Identidad, comunicaciones, contratación y tecnologías terminales dentro del alcance aplicable. | [BOE](https://www.boe.es/eli/es/l/2002/07/11/34/con) | 2026-08-27 |
| `BINDING_LAW` | RDL 1/2007 TRLGDCU | Información y contratación con consumidores solo si los hechos activan su ámbito. | [BOE](https://www.boe.es/eli/es/rdlg/2007/11/16/1/con) | 2026-08-27 |
| `BINDING_LAW` | Ley 34/1988 General de Publicidad, arts. 2–3 | Riesgo de publicidad; la auditoría no resuelve la clasificación de la actividad. | [BOE](https://www.boe.es/buscar/act.php?id=BOE-A-1988-26156) | 2026-08-27 |
| `BINDING_LAW` | Ley 11/2023, título I + RD 193/2023, arts. 14–15 y disposición final sexta | Posibles deberes privados de accesibilidad, sujetos a servicio, empresa, excepciones y calendario. | [BOE Ley 11/2023](https://www.boe.es/eli/es/l/2023/05/08/11/con) / [BOE RD 193/2023](https://www.boe.es/eli/es/rd/2023/03/21/193/con) | 2026-08-26/27 |
| `BINDING_LAW` | LO 1/1982, arts. 2, 7 y 8 | Protección civil del honor, intimidad y propia imagen dentro de su alcance; no prueba por sí sola la suficiencia de un consentimiento futuro. | [BOE](https://www.boe.es/eli/es/lo/1982/05/05/1/con) | 2026-08-27 |
| `BINDING_LAW` | Reglamento (UE) 2022/2065 DSA, arts. 2–15 | Obligaciones diferenciadas por rol; el rol de intermediación del proyecto sigue sin resolver. | [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2022/2065/oj) | 2026-08-26 |
| `INTERPRETIVE_AUTHORITY` | Guía AEPD sobre cookies, versión registrada 2024 | Criterio de autoridad para opciones y retirada; no se presenta como ley autónoma. | [AEPD](https://www.aepd.es/guias/guia-cookies.pdf) | 2026-08-26 |
| `VOLUNTARY_STANDARD` | WCAG 2.2, Recomendación W3C 2023-10-05 | Baseline técnico voluntario; no se usa como equivalencia automática de cumplimiento legal. | [W3C](https://www.w3.org/TR/WCAG22/) | 2026-08-27 |
| `VOLUNTARY_STANDARD` | OWASP ASVS 5.0.0 | Baseline técnico voluntario salvo incorporación contractual; no es una obligación legal general. | [OWASP](https://owasp.org/www-project-application-security-verification-standard/) | 2026-08-26 |

Las rutas BOE, BOCM y DOGC se registran para un inventario territorial posterior; no se citan como fuente de una obligación regional concreta porque el operador, establecimiento, lugar de prestación y actividad aún no están clasificados.

## Metodología y herramientas

Se separaron hechos, supuestos, aplicabilidad y resultado técnico. Las fuentes del cliente se trataron como evidencia, no como órdenes, y las notas automáticas como material sujeto a error. Las pruebas se repitieron donde era posible y se conservaron contrapruebas para evitar conclusiones categóricas.

| Herramienta | Versión/configuración | Estado | Controles afectados | Límite |
|---|---|---|---|---|
| Validador de catálogo | catálogo 2026.08.26; 46 controles/56 instrumentos | `SUCCEEDED` | Gobierno y vigencia | La vigencia no prueba aplicabilidad. |
| Resolver de aplicabilidad | perfil `profile.json` | `SUCCEEDED` | Módulos candidatos | Conserva incógnitas humanas. |
| Extracción DOCX | `python-docx` del runtime local | `SUCCEEDED` | Gobierno, privacidad y consumo | No valida layout ni veracidad de transcripción. |
| `pnpm run validate` | lint, TypeScript, 65 pruebas y build Vinext | `SUCCEEDED` | Diseño seguro, SEO y calidad | Prueba local; no runtime desplegado. |
| Playwright CLI del borrador | Chromium local, seis viewports, antes del boundary final | `SUCCEEDED` | Accesibilidad y calidad del UI subyacente | Evidencia anterior al holding final; sin lector de pantalla, contraste completo ni fidelidad visual aprobada. |
| Smoke de producción fail-closed | build fresco, seis rutas y flags adversariales | `SUCCEEDED` | Publicidad, contacto, SEO y consumo | Solo prueba el estado bloqueado local, no un despliegue. |
| Reconciliación de cobertura | catálogo 2026.08.26 + ledger v1 | `SUCCEEDED` | Gobierno/cobertura | Prueba unicidad, set y aritmética; no transforma un control no probado en conformidad. |
| Inventario cookies/storage desplegado | sin runtime | `NOT_RUN` | Cookies/LSSI | Faltan hosting y proveedores. |
| SCA/alcanzabilidad | intento integrado | `FAILED` | Supply chain | Falló en sourcemap y worktree; sin `scanId` ni conclusión. |

## Hallazgos

| ID | Dominio/control | Resultado | Severidad técnica | Confianza | Prioridad de release/revisión | Revisión |
|---|---|---|---|---|---|---|
| `F-d0ddd59b09a70c2e` | Publicidad / `SECTOR-ADVERTISING-001` | `INCONCLUSIVE` | `CRITICAL` | `HIGH` | P0 release blocker | `REQUIRES_LEGAL_COUNSEL` |
| `F-3f2f2e51be65edb1` | Gobierno / `GOV-APPLICABILITY-001` | `INCONCLUSIVE` | `HIGH` | `HIGH` | P0 release blocker | `REQUIRES_LEGAL_COUNSEL` |
| `F-1b1707ba34e2e4e1` | Privacidad / `PRIV-RGPD-BASES-001` | `PARTIAL` | `HIGH` | `HIGH` | P0 release blocker | `REQUIRES_HUMAN_REVIEW` |
| `F-2f8825c8118094bd` | Consumo / `CONS-PRECONTRACT-001` | `INCONCLUSIVE` | `MEDIUM` | `HIGH` | P0 antes de contacto | `REQUIRES_LEGAL_COUNSEL` |
| `F-7e8fcbac30938098` | Accesibilidad / `A11Y-WCAG22-BASELINE-001` | `PARTIAL` | `MEDIUM` | `HIGH` | P1 antes de release | `REQUIRES_HUMAN_REVIEW` |
| `F-0470ade21d915c0c` | Edad / `AGE-ACCESS-001` | `PARTIAL` | `HIGH` | `HIGH` | P0 release blocker | `REQUIRES_LEGAL_COUNSEL` |
| `F-ab00508cfb2f4f30` | Imagen / `PRIV-IMAGE-RIGHTS-001` | `PARTIAL` | `HIGH` | `HIGH` | P0 por perfil/activo | `REQUIRES_LEGAL_COUNSEL` |
| `F-6890fb5a6df63213` | Cookies / `COOKIE-LSSI-CONSENT-001` | `NOT_TESTED` | `MEDIUM` | `HIGH` | P0 antes de proveedores | `REQUIRES_HUMAN_REVIEW` |
| `F-30b719d32a855cfb` | Seguridad / `SEC-SCA-REACHABILITY-001` | `NOT_TESTED` | `MEDIUM` | `HIGH` | P1 antes de release | `REQUIRES_HUMAN_REVIEW` |

### Síntesis de remediación

- `F-d0ddd59b09a70c2e`: obtener revisión escrita, específica del alcance, por un abogado en España que identifique operador y servicio y apruebe o rechace actividad, imágenes, copy, SEO, edad y contacto.
- `F-3f2f2e51be65edb1`: identificar prestador, establecimiento, datos registrales, autoridad sectorial y modelo de contratación; producir aviso legal original.
- `F-1b1707ba34e2e4e1`: aprobar mapa responsable/encargados, inventario, finalidades, bases, transparencia, minimización, retención, derechos, contratos y seguridad; documentar clasificación art. 9 y screening/EIPD art. 35 antes de tratar datos reales.
- `F-2f8825c8118094bd`: documentar cuándo y cómo se forma el contrato, qué se ofrece, precio, cancelación/desistimiento y servicio al cliente antes de activar canales.
- `F-7e8fcbac30938098`: auditar el release congelado contra criterios WCAG 2.2 A/AA, incluyendo lector de pantalla, contraste, zoom/reflow, errores y tamaño de objetivos.
- `F-0470ade21d915c0c`: aprobar jurídicamente la política de edad e implementar el control accesible y proporcional que corresponda, sin recogida excesiva.
- `F-ab00508cfb2f4f30`: verificar y vincular al release evidencia restringida de edad, consentimiento, derechos de imagen/licencia, alcance y retirada por persona y activo.
- `F-6890fb5a6df63213`: inventariar cookies, storage y requests en los estados sin elección, rechazo, aceptación y retirada sobre el runtime real.
- `F-30b719d32a855cfb`: completar SCA/SBOM y análisis de alcanzabilidad compatible, con `scanId`, configuración y triaje.

Los JSON individuales conservan método, evidencia/hash, contraprueba, responsable, retest y riesgo residual.

## Matriz de trazabilidad

| Requisito | Control | Prueba | Evidencia | Hallazgo | Corrección / retest |
|---|---|---|---|---|---|
| Identidad y legal | `GOV-APPLICABILITY-001` | Revisión de repositorio e intake | `LEGAL_INPUTS_REQUIRED.md` | `F-3f2f2e51be65edb1` | Identificar prestador; revisión jurídica del texto final. |
| Perfiles/contacto | `PRIV-RGPD-BASES-001` | Tipos, gates y flujo | `lib/content/types.ts` | `F-1b1707ba34e2e4e1` | Trazar cada dato/proveedor hasta borrado; clasificar art. 9 y screening/EIPD art. 35; probar derechos en staging. |
| Contacto/contrato | `CONS-PRECONTRACT-001` | Documentos y página sin POST | `app/contacto/page.tsx` | `F-2f8825c8118094bd` | Aprobar flujo y verificar información antes de obligación. |
| Publicidad/SEO | `SECTOR-ADVERTISING-001` | Brief + notas automáticas + BOE | evidencia restringida del cliente | `F-d0ddd59b09a70c2e` | Dictamen escrito y revisión del release exacto. |
| Accesibilidad | `A11Y-WCAG22-BASELINE-001` | Playwright + teclado | `output/playwright/qa-results.json`, SHA-256 `0b8073…188d2` | `F-7e8fcbac30938098` | Auditoría A/AA y AT sobre artefacto versionado. |
| Mayoría de edad | `AGE-ACCESS-001` | Validación + boundary | `lib/content/validation.ts` | `F-0470ade21d915c0c` | Política aprobada, implementación accesible y prueba en staging. |
| Derechos de imagen | `PRIV-IMAGE-RIGHTS-001` | Modelo/gates + intake | `lib/content/types.ts` | `F-ab00508cfb2f4f30` | Trazar evidencia real por perfil/activo y probar retirada. |
| Alcance regional | `GOV-SOURCE-FRESHNESS-001` | Perfil territorial + revisión de incógnitas | `profile.json`, `applicability-matrix.md` | — (`PENDING_VERIFICATION`) | Con hechos finales, ejecutar inventario dirigido BOE/BOCM/DOGC y fuentes municipales materiales; asesoría documenta inclusión/exclusión. |
| Cookies/runtime | `COOKIE-LSSI-CONSENT-001` | Inventario desplegado | `NOT_TESTED` | `F-6890fb5a6df63213` | Captura por cuatro estados después de elegir infraestructura. |
| Dependencias | `SEC-SCA-REACHABILITY-001` | SCA/alcanzabilidad | `pnpm-lock.yaml` | `F-30b719d32a855cfb` | Ejecutar herramienta compatible y triaje antes de release. |

## Custodia de evidencia

El manifiesto técnico está en `audit.json` e incluye documentos restringidos, smoke de producción, UI de borrador, retest de contacto, lockfile y `coverage-ledger.json`. Los documentos fuente permanecen fuera del repositorio y se referencian por hash con acceso `RESTRICTED`; no se copiaron datos personales ni documentos sensibles al repositorio. Las capturas locales no contienen perfiles reales y tienen acceso `INTERNAL`. Retención, cifrado y borrado final requieren decisión del responsable.

## Roadmap

- Inmediato: conservar `noindex`, sitemap vacío, perfiles/contacto cerrados; resolver identidad, actividad/publicidad y formación contractual; clasificar U-07 (art. 9/EIPD art. 35) y U-08 (BOE/BOCM/DOGC/municipal); seleccionar visual y aportar derechos.
- 30 días: cerrar privacidad, edad, derechos de imagen, cookies/tecnologías, textos legales, contenido y proveedores; auditar accesibilidad y completar SCA/alcanzabilidad del release congelado. Solo entonces registrar `checkpoint_sha`, `tree_sha` y `effective_at`.
- 60–90 días: validar runtime desplegado, cabeceras, cookies, terceros, rendimiento, derechos y operación; retestar por cada cambio material.
- Escalaciones humanas: abogado en España para actividad/publicidad/contratación; responsable de privacidad; revisión independiente de accesibilidad; aceptación visual y comercial del cliente.
