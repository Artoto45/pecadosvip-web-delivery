import type { Metadata } from 'next';
import CityLanding from '../components/CityLanding';
import { cities } from '../city-data';

export const metadata: Metadata = {
  title: 'Compañía privada en Barcelona',
  description:
    'Servicio de compañía privada en Barcelona, con desplazamiento a domicilios y hoteles. Atención cuidada y disponibilidad bajo confirmación.',
  alternates: { canonical: '/barcelona' },
  openGraph: {
    title: 'Compañía privada en Barcelona | PecadosVip',
    description:
      'Atención privada en domicilios y hoteles de Barcelona, con presencia discreta en ciudad y municipios seleccionados.',
    url: '/barcelona',
    locale: 'es_ES',
    type: 'website',
    images: [
      { url: '/og.png', width: 1200, height: 630, alt: 'PecadosVip Barcelona' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compañía privada en Barcelona | PecadosVip',
    description: 'Atención privada y discreta en Barcelona.',
    images: ['/og.png'],
  },
};

export default function BarcelonaPage() {
  return <CityLanding content={cities.barcelona} />;
}
