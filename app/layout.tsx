import type { Metadata } from 'next';
import { siteConfig } from '../lib/site-config';
import './globals.css';
import './theme.css';

const socialImageUrl = siteConfig.origin
  ? new URL('/og.png', siteConfig.origin).toString()
  : undefined;

export const metadata: Metadata = {
  ...(siteConfig.origin ? { metadataBase: new URL(siteConfig.origin) } : {}),
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
    ...(socialImageUrl
      ? {
          images: [
            {
              url: socialImageUrl,
              width: 1200,
              height: 630,
              alt: 'PecadosVip Madrid y Barcelona',
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PecadosVip | Madrid · Barcelona',
    description: 'Privacidad. Presencia. Distinción.',
    ...(socialImageUrl ? { images: [socialImageUrl] } : {}),
  },
  robots: siteConfig.indexingEnabled
    ? { index: true, follow: true }
    : { index: false, follow: false },
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
