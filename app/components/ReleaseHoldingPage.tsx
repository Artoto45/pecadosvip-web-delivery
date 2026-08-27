export default function ReleaseHoldingPage() {
  return (
    <main className="release-holding" id="main-content" tabIndex={-1}>
      <div className="release-holding-mark" aria-hidden="true">PV</div>
      <p className="public-eyebrow">Versión no publicada</p>
      <h1>Contenido en preparación</h1>
      <p>
        Esta versión no ofrece servicios, no publica perfiles y no recibe
        solicitudes. El contenido permanecerá cerrado hasta completar las
        aprobaciones del release.
      </p>
    </main>
  );
}
