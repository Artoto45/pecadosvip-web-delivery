import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  evaluateRuntimeContact,
  evaluateRuntimeVisibility,
  getRuntimePublicationState,
  getRuntimeSitemapRoutes,
  isRuntimeRouteIndexable,
} from '../lib/content/runtime-publication.ts';
import { resolveContactConfig } from '../lib/contact-config.ts';
import { getRuntimeContentSnapshot } from '../lib/content/runtime-snapshot.ts';
import { validateContentSnapshot } from '../lib/content/validation.ts';
import { makeSnapshot } from './helpers.ts';

test('runtime snapshot contains only unapproved draft cities and no profiles or services', () => {
  const snapshot = getRuntimeContentSnapshot();

  assert.deepEqual(
    snapshot.cities.map((city) => city.slug).sort(),
    ['barcelona', 'madrid'],
  );
  assert.equal(snapshot.cities.every((city) => city.status === 'draft'), true);
  assert.equal(snapshot.cities.every((city) => city.approval.state === 'pending'), true);
  assert.equal(snapshot.cities.every((city) => city.serviceConfirmed === false), true);
  assert.deepEqual(snapshot.profiles, []);
  assert.deepEqual(snapshot.services, []);
  assert.equal(snapshot.settings.publicationEnabled, false);
  assert.equal(snapshot.settings.analyticsConsentConfigured, false);
  assert.equal(snapshot.settings.legal.legalNotice.body, '');
  assert.equal(snapshot.settings.legal.privacy.body, '');
  assert.equal(snapshot.settings.legal.cookies.body, '');
  assert.equal(snapshot.settings.legal.serviceTerms.body, '');
  assert.deepEqual(validateContentSnapshot(snapshot, 'draft'), []);
});

test('runtime publication, route indexability and sitemap fail closed', () => {
  const state = getRuntimePublicationState();

  assert.equal(state.release.ok, false);
  assert.equal(state.release.blockerCodes.includes('PUBLICATION_DISABLED'), true);
  assert.equal(state.release.blockerCodes.includes('LEGAL_CONTENT_MISSING'), true);
  assert.equal(state.release.blockerCodes.includes('INITIAL_PROFILE_LOAD_INCOMPLETE'), true);
  assert.equal(state.manifest.length, 3);
  assert.equal(state.manifest.every((route) => route.indexable === false), true);
  assert.equal(isRuntimeRouteIndexable('/'), false);
  assert.equal(isRuntimeRouteIndexable('/madrid'), false);
  assert.deepEqual(getRuntimeSitemapRoutes(), []);
});

test('blocked release suppresses approved contact destinations', () => {
  const approvedConfig = resolveContactConfig({
    NEXT_PUBLIC_CONTACT_APPROVED: 'true',
    NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED: 'true',
    NEXT_PUBLIC_WHATSAPP_URL: 'https://wa.me/34123456789',
  });
  const blocked = evaluateRuntimeContact(
    getRuntimeContentSnapshot(),
    approvedConfig,
  );

  assert.equal(approvedConfig.enabled, true);
  assert.equal(blocked.releaseGateSatisfied, false);
  assert.equal(blocked.enabled, false);
  assert.deepEqual(blocked.contact, {});
});

test('approved destinations remain available only after the aggregate release gate', () => {
  const approvedConfig = resolveContactConfig({
    NEXT_PUBLIC_CONTACT_APPROVED: 'true',
    NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED: 'true',
    NEXT_PUBLIC_WHATSAPP_URL: 'https://wa.me/34123456789',
  });
  const ready = evaluateRuntimeContact(makeSnapshot(), approvedConfig);

  assert.equal(ready.releaseGateSatisfied, true);
  assert.equal(ready.enabled, true);
  assert.deepEqual(ready.contact, {
    whatsappUrl: 'https://wa.me/34123456789',
  });
});

test('blocked release renders only the holding state in production', () => {
  const snapshot = getRuntimeContentSnapshot();
  const state = evaluateRuntimeVisibility(snapshot);

  assert.equal(state.releaseReady, false);
  assert.equal(state.renderPublicExperience, false);
});

test('blocked release cannot be bypassed by process environment flags', () => {
  const previous = process.env.PECADOSVIP_ENABLE_DRAFT_PREVIEW;
  process.env.PECADOSVIP_ENABLE_DRAFT_PREVIEW = 'true';
  try {
    const state = evaluateRuntimeVisibility(getRuntimeContentSnapshot());
    assert.equal(state.releaseReady, false);
    assert.equal(state.renderPublicExperience, false);
  } finally {
    if (previous === undefined) {
      delete process.env.PECADOSVIP_ENABLE_DRAFT_PREVIEW;
    } else {
      process.env.PECADOSVIP_ENABLE_DRAFT_PREVIEW = previous;
    }
  }
});

test('complete release renders the public experience in production', () => {
  const state = evaluateRuntimeVisibility(makeSnapshot());

  assert.equal(state.releaseReady, true);
  assert.equal(state.renderPublicExperience, true);
});

test('every implemented public content route wires the runtime visibility boundary', () => {
  const routes = [
    '../app/page.tsx',
    '../app/madrid/page.tsx',
    '../app/barcelona/page.tsx',
    '../app/perfiles/page.tsx',
    '../app/perfiles/[slug]/page.tsx',
    '../app/contacto/page.tsx',
  ];

  for (const route of routes) {
    const source = readFileSync(new URL(route, import.meta.url), 'utf8');
    if (route.endsWith('/madrid/page.tsx') || route.endsWith('/barcelona/page.tsx')) {
      assert.match(source, /<CityLanding/);
    } else {
      assert.match(source, /getRuntimeVisibilityState/);
      assert.match(source, /<ReleaseHoldingPage/);
    }
  }

  const sharedCitySource = readFileSync(
    new URL('../app/components/CityLanding.tsx', import.meta.url),
    'utf8',
  );
  assert.match(sharedCitySource, /getRuntimeVisibilityState/);
  assert.match(sharedCitySource, /<ReleaseHoldingPage/);
});

test('callers receive isolated runtime snapshots', () => {
  const first = getRuntimeContentSnapshot();
  first.cities[0].headline = 'outside mutation';
  first.settings.legal.privacy.body = 'outside mutation';

  const second = getRuntimeContentSnapshot();
  assert.notEqual(second.cities[0].headline, 'outside mutation');
  assert.equal(second.settings.legal.privacy.body, '');
});
