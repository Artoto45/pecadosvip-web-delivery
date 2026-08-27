/* eslint-disable @next/next/no-html-link-for-pages -- Vinext 1.0.0-beta.3 client navigation throws at runtime; native links are the verified fallback. */
type PublicHeaderProps = {
  currentPath: string;
};

const navigation = [
  { href: '/', label: 'Inicio' },
  { href: '/madrid', label: 'Madrid' },
  { href: '/barcelona', label: 'Barcelona' },
  { href: '/perfiles', label: 'Perfiles' },
] as const;

function isCurrentPath(currentPath: string, href: string): boolean {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function PublicHeader({ currentPath }: PublicHeaderProps) {
  return (
    <>
      <header className="public-header">
        <a className="public-brand" href="/" aria-label="PecadosVip, inicio">
          <span className="public-apple" aria-hidden="true"><span /></span>
          <span>Pecados<span>Vip</span></span>
        </a>

        <nav className="public-nav" aria-label="Navegación principal">
          {navigation.map((item) => {
            const current = isCurrentPath(currentPath, item.href);
            return (
              <a
                href={item.href}
                key={item.href}
                aria-current={current ? 'page' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          className="public-header-cta"
          href="/contacto"
          aria-current={currentPath === '/contacto' ? 'page' : undefined}
        >
          Contacto privado
        </a>
      </header>

      <nav className="public-mobile-nav" aria-label="Navegación móvil">
        {[...navigation, { href: '/contacto', label: 'Contacto' }].map((item) => {
          const current = isCurrentPath(currentPath, item.href);
          return (
            <a
              href={item.href}
              key={item.href}
              aria-current={current ? 'page' : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </>
  );
}
