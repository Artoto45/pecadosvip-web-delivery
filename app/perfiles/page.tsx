/* eslint-disable @next/next/no-html-link-for-pages -- Vinext 1.0.0-beta.3 client navigation throws at runtime; native links are the verified fallback. */
import { parsePublicProfileSearchParams } from '../../lib/content/public-query-params';
import { queryPublicProfiles } from '../../lib/content/public-profiles';
import { getRuntimeContentSnapshot } from '../../lib/content/runtime-snapshot';
import { buildPublicMetadata } from '../../lib/seo';
import ProfileCard from '../components/ProfileCard';
import ProvisionalNotice from '../components/ProvisionalNotice';
import PublicFooter from '../components/PublicFooter';
import PublicHeader from '../components/PublicHeader';
import ReleaseHoldingPage from '../components/ReleaseHoldingPage';
import { getRuntimeVisibilityState } from '../../lib/content/runtime-publication';

type RawSearchParams = Record<string, string | string[] | undefined>;
type ProfileListPageProps = {
  searchParams: Promise<RawSearchParams>;
};

function toUrlSearchParams(raw: RawSearchParams): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined) {
      params.append(key, value);
    }
  }
  return params;
}

export async function generateMetadata({ searchParams }: ProfileListPageProps) {
  const raw = await searchParams;
  return buildPublicMetadata({
    path: '/perfiles',
    title: 'Perfiles',
    description: 'Catálogo de perfiles publicados y aprobados de PecadosVip.',
    forceNoIndex: Object.keys(raw).length > 0,
  });
}

export default async function ProfilesPage({ searchParams }: ProfileListPageProps) {
  if (!getRuntimeVisibilityState().renderPublicExperience) {
    return <ReleaseHoldingPage />;
  }

  const parsed = parsePublicProfileSearchParams(
    toUrlSearchParams(await searchParams),
  );
  const result = parsed.ok
    ? queryPublicProfiles(getRuntimeContentSnapshot(), parsed.query)
    : undefined;
  const query = parsed.ok ? parsed.query : {};

  return (
    <main className="public-page" id="main-content" tabIndex={-1}>
      <PublicHeader currentPath="/perfiles" />
      <ProvisionalNotice />

      <section className="catalog-hero" aria-labelledby="catalog-title">
        <p className="public-eyebrow">Catálogo protegido</p>
        <h1 id="catalog-title">Perfiles</h1>
        <p>
          Los filtros operan sobre contenido publicable. Los borradores y registros
          sin evidencia nunca aparecen en esta ruta.
        </p>
      </section>

      <form className="profile-filters" action="/perfiles" method="get">
        <label>
          Ciudad
          <select name="city" defaultValue={query.city ?? ''}>
            <option value="">Todas</option>
            <option value="madrid">Madrid</option>
            <option value="barcelona">Barcelona</option>
          </select>
        </label>
        <label>
          Disponibilidad
          <select name="availability" defaultValue={query.availability ?? ''}>
            <option value="">Todas</option>
            <option value="available">Disponible</option>
            <option value="limited">Limitada</option>
            <option value="on-request">Bajo consulta</option>
            <option value="unavailable">No disponible</option>
          </select>
        </label>
        <label>
          Edad mínima
          <input name="minAge" type="number" min="18" defaultValue={query.minAge} />
        </label>
        <label>
          Edad máxima
          <input name="maxAge" type="number" min="18" defaultValue={query.maxAge} />
        </label>
        <button type="submit">Aplicar filtros</button>
      </form>

      <section className="catalog-results" aria-live="polite" aria-labelledby="results-title">
        <div className="catalog-results-heading">
          <h2 id="results-title">Resultados</h2>
          {result?.ok ? <span>{result.total}</span> : null}
        </div>

        {!parsed.ok ? (
          <div className="public-empty-state public-empty-state-error" role="alert">
            <strong>Los filtros no son válidos.</strong>
            <p>No se consultó ni expuso contenido. Restablece los filtros para continuar.</p>
            <a href="/perfiles">Restablecer filtros</a>
          </div>
        ) : result?.ok && result.items.length > 0 ? (
          <div className="profile-grid">
            {result.items.map((profile) => (
              <ProfileCard profile={profile} key={profile.slug} />
            ))}
          </div>
        ) : (
          <div className="public-empty-state" role="status">
            <strong>El catálogo aún no está publicado.</strong>
            <p>
              No existen perfiles que hayan superado conjuntamente los controles de
              contenido, edad, consentimiento, derechos y release.
            </p>
          </div>
        )}
      </section>

      <PublicFooter />
    </main>
  );
}
