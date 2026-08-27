import Image from 'next/image';
import { notFound } from 'next/navigation';

import { getPublicProfileDetail } from '../../../lib/content/public-profiles';
import { getRuntimeContentSnapshot } from '../../../lib/content/runtime-snapshot';
import { buildPublicMetadata } from '../../../lib/seo';
import ContactOptions from '../../components/ContactOptions';
import ProvisionalNotice from '../../components/ProvisionalNotice';
import PublicFooter from '../../components/PublicFooter';
import PublicHeader from '../../components/PublicHeader';
import ReleaseHoldingPage from '../../components/ReleaseHoldingPage';
import { getRuntimeVisibilityState } from '../../../lib/content/runtime-publication';

type ProfileDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProfileDetailPageProps) {
  const { slug } = await params;
  const profile = getPublicProfileDetail(getRuntimeContentSnapshot(), slug);
  if (!profile) {
    return buildPublicMetadata({
      path: `/perfiles/${slug}`,
      title: 'Perfil no disponible',
      description: 'El perfil solicitado no está publicado.',
      forceNoIndex: true,
    });
  }

  return buildPublicMetadata({
    path: `/perfiles/${profile.slug}`,
    title: profile.displayName,
    description: profile.biography,
    imageAlt: profile.cover.alt,
  });
}

export default async function ProfileDetailPage({ params }: ProfileDetailPageProps) {
  if (!getRuntimeVisibilityState().renderPublicExperience) {
    return <ReleaseHoldingPage />;
  }

  const { slug } = await params;
  const profile = getPublicProfileDetail(getRuntimeContentSnapshot(), slug);
  if (!profile) notFound();

  const measurements = Object.entries(profile.measurements).filter(
    ([, value]) => value !== undefined,
  );

  return (
    <main className="public-page" id="main-content" tabIndex={-1}>
      <PublicHeader currentPath={`/perfiles/${profile.slug}`} />
      <ProvisionalNotice />
      <article className="profile-detail">
        <div className="profile-detail-media">
          {profile.media.map((media) => (
            <div className="profile-detail-image" key={`${media.desktopUrl}-${media.order}`}>
              <Image
                src={media.desktopUrl}
                alt={media.alt}
                fill
                sizes="(max-width: 820px) 92vw, 48vw"
                unoptimized
              />
            </div>
          ))}
        </div>
        <div className="profile-detail-copy">
          <p className="public-eyebrow">Perfil publicado</p>
          <h1>{profile.displayName}</h1>
          <p>{profile.age} años · {profile.citySlugs.join(' · ')}</p>
          <p>{profile.biography}</p>
          {measurements.length > 0 ? (
            <dl>
              {measurements.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <h2>Servicios</h2>
          <ul>
            {profile.services.map((service) => (
              <li key={service.slug}>{service.name}</li>
            ))}
          </ul>
          <ContactOptions />
        </div>
      </article>
      <PublicFooter />
    </main>
  );
}
