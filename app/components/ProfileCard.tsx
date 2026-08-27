import Image from 'next/image';

import type { PublicProfileCard } from '../../lib/content/public-profiles';

const availabilityLabels: Record<PublicProfileCard['availability'], string> = {
  available: 'Disponible',
  limited: 'Disponibilidad limitada',
  unavailable: 'No disponible',
  'on-request': 'Bajo consulta',
};

export default function ProfileCard({ profile }: { profile: PublicProfileCard }) {
  return (
    <article className="profile-card">
      <div className="profile-card-media">
        <Image
          src={profile.cover.desktopUrl}
          alt={profile.cover.alt}
          fill
          sizes="(max-width: 720px) 88vw, (max-width: 1100px) 44vw, 280px"
          unoptimized
        />
      </div>
      <div className="profile-card-copy">
        <h2>{profile.displayName}</h2>
        <p>{profile.citySlugs.join(' · ')} · {profile.age} años</p>
        <span data-availability={profile.availability}>
          {availabilityLabels[profile.availability]}
        </span>
        <a href={`/perfiles/${profile.slug}`}>Ver perfil</a>
      </div>
    </article>
  );
}
