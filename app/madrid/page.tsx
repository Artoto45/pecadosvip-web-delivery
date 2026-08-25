import type { Metadata } from 'next';
import CityLanding from '../components/CityLanding';
import { cities } from '../city-data';

export const metadata: Metadata = {
  title: 'Compañía privada en Madrid',
  description:
    'Servicio de compañía privada en Madrid, con desplazamiento a domicilios y hoteles. Atención discreta y cobertura bajo confirmación previa.',
  alternates: { canonical: '/madrid' },
  openGraph: {
    title: 'Compañía privada en Madrid | PecadosVip',
    description:
      'Atención privada en domicilios y hoteles de Madrid, siempre con discreción y confirmación previa.',
    url: '/madrid',
    locale: 'es_ES',
    type: 'website',
    images: [
      { url: '/og.png', width: 1200, height: 630, alt: 'PecadosVip Madrid' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compañía privada en Madrid | PecadosVip',
    description: 'Atención privada y discreta en Madrid.',
    images: ['/og.png'],
  },
};

export default function MadridPage() {
  return <CityLanding content={cities.madrid} />;
}
