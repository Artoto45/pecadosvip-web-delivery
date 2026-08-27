import { cities } from '../../app/city-data.ts';
import { contactConfig } from '../contact-config.ts';
import type {
  ApprovalRecord,
  CityPage,
  ContentSnapshot,
  LegalDocument,
} from './types.ts';

const runtimeTimestamp = '2026-08-27T00:00:00-05:00';

const pendingApproval: ApprovalRecord = { state: 'pending' };

function emptyLegalDocument(title: string): LegalDocument {
  return {
    title,
    body: '',
    approval: pendingApproval,
    updatedAt: runtimeTimestamp,
  };
}

const draftCities: CityPage[] = Object.values(cities).map((city) => ({
  id: `city-${city.slug}`,
  slug: city.slug,
  name: city.city,
  cluster: city.slug,
  status: 'draft',
  serviceConfirmed: false,
  approval: pendingApproval,
  headline: `${city.headline} ${city.headlineAccent}`,
  introduction: city.introBody.join('\n\n'),
  differentiators: [
    'Desplazamiento a hoteles y domicilios',
    'Cobertura bajo confirmación',
    'Coordinación privada',
  ],
  coverageAreas: [
    ...city.highlights.map((area) => ({
      name: area.name,
      confirmed: false,
    })),
    ...city.locations.map((name) => ({ name, confirmed: false })),
  ],
  profileSlugs: [],
  faqs: structuredClone(city.faqs),
  nearbyCitySlugs: [city.slug === 'madrid' ? 'barcelona' : 'madrid'],
  seo: {
    title: `Compañía privada en ${city.city}`,
    description: city.lead,
    canonicalPath: `/${city.slug}`,
    indexable: false,
    lastModified: runtimeTimestamp,
  },
  updatedAt: runtimeTimestamp,
}));

const runtimeDraftSnapshot: ContentSnapshot = {
  cities: draftCities,
  profiles: [],
  services: [],
  settings: {
    brandName: 'PecadosVip',
    publicationEnabled: false,
    analyticsConsentConfigured: false,
    contact: contactConfig.contact,
    legal: {
      legalNotice: emptyLegalDocument('Aviso legal'),
      privacy: emptyLegalDocument('Privacidad'),
      cookies: emptyLegalDocument('Cookies'),
      serviceTerms: emptyLegalDocument('Términos del servicio'),
    },
  },
};

export function getRuntimeContentSnapshot(): ContentSnapshot {
  return structuredClone(runtimeDraftSnapshot);
}
