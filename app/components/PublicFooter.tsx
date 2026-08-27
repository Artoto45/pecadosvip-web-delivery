/* eslint-disable @next/next/no-html-link-for-pages -- Vinext 1.0.0-beta.3 client navigation throws at runtime; native links are the verified fallback. */
import { getPublicLegalLinks } from '../../lib/content/public-legal';
import { getRuntimeContentSnapshot } from '../../lib/content/runtime-snapshot';

export default function PublicFooter() {
  const legalLinks = getPublicLegalLinks(getRuntimeContentSnapshot());

  return (
    <footer className="public-footer">
      <div>
        <a className="public-brand" href="/" aria-label="PecadosVip, inicio">
          <span className="public-apple" aria-hidden="true"><span /></span>
          <span>Pecados<span>Vip</span></span>
        </a>
        <p>Proyecto web para Madrid y Barcelona en fase de validación.</p>
      </div>
      <nav aria-label="Enlaces del pie">
        <a href="/madrid">Madrid</a>
        <a href="/barcelona">Barcelona</a>
        <a href="/perfiles">Perfiles</a>
        <a href="/contacto">Contacto</a>
        {legalLinks.map((link) => (
          <a href={link.href} key={link.href}>{link.title}</a>
        ))}
      </nav>
      <div className="public-footer-status">
        <span>Solo para mayores de 18 años</span>
        <span>
          {legalLinks.length > 0
            ? 'Información legal aprobada y accesible'
            : 'Información legal pendiente de aprobación'}
        </span>
      </div>
    </footer>
  );
}
