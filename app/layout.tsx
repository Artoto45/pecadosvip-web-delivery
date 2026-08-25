import type { Metadata } from 'next';
import './globals.css';
import './theme.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pecadosvip.com',
  ),
  title: {
    default: 'PecadosVip | Compañía privada en Madrid y Barcelona',
    template: '%s | PecadosVip',
  },
  description:
    'Servicio de compañía privada con desplazamiento a domicilios y hoteles en Madrid y Barcelona. Atención discreta y personalizada.',
  keywords: [
    'compañía privada Madrid',
    'compañía privada Barcelona',
    'servicio a hoteles',
    'atención a domicilio',
    'PecadosVip',
  ],
  openGraph: {
    title: 'PecadosVip | Madrid · Barcelona',
    description:
      'Privacidad, presencia y distinción con desplazamiento a domicilios y hoteles.',
    siteName: 'PecadosVip',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'PecadosVip Madrid y Barcelona',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PecadosVip | Madrid · Barcelona',
    description: 'Privacidad. Presencia. Distinción.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
