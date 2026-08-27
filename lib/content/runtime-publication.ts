import { buildRouteManifest, sitemapRoutes } from './route-manifest.ts';
import { evaluateRelease } from './release-gates.ts';
import { getRuntimeContentSnapshot } from './runtime-snapshot.ts';
import { contactConfig } from '../contact-config.ts';
import type { ResolvedContactConfig } from '../contact-config.ts';
import type { ContentSnapshot, ContactSettings } from './types.ts';

export type RuntimeContactState = {
  enabled: boolean;
  releaseGateSatisfied: boolean;
  approvalGateSatisfied: boolean;
  privacyGateSatisfied: boolean;
  contact: ContactSettings;
};

export type RuntimeVisibilityState = {
  releaseReady: boolean;
  renderPublicExperience: boolean;
};

export function evaluateRuntimeVisibility(
  snapshot: ContentSnapshot,
): RuntimeVisibilityState {
  const releaseReady = evaluateRelease(snapshot).ok;

  return {
    releaseReady,
    renderPublicExperience: releaseReady,
  };
}

export function evaluateRuntimeContact(
  snapshot: ContentSnapshot,
  config: ResolvedContactConfig,
): RuntimeContactState {
  const releaseGateSatisfied = evaluateRelease(snapshot).ok;
  const enabled = releaseGateSatisfied && config.enabled;

  return {
    enabled,
    releaseGateSatisfied,
    approvalGateSatisfied: config.approvalGateSatisfied,
    privacyGateSatisfied: config.privacyGateSatisfied,
    contact: enabled ? structuredClone(config.contact) : {},
  };
}

export function getRuntimePublicationState() {
  const snapshot = getRuntimeContentSnapshot();
  const release = evaluateRelease(snapshot);
  const manifest = buildRouteManifest(snapshot);

  return { snapshot, release, manifest };
}

export function getRuntimeContactState(): RuntimeContactState {
  return evaluateRuntimeContact(getRuntimeContentSnapshot(), contactConfig);
}

export function getRuntimeVisibilityState(): RuntimeVisibilityState {
  return evaluateRuntimeVisibility(getRuntimeContentSnapshot());
}

export function isRuntimeRouteIndexable(path: string): boolean {
  const { manifest } = getRuntimePublicationState();
  return Boolean(
    manifest.find((route) => route.path === path && route.indexable),
  );
}

export function getRuntimeSitemapRoutes() {
  const snapshot = getRuntimeContentSnapshot();
  return sitemapRoutes(snapshot);
}
