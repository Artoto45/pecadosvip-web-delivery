import type { ContactSettings } from './content/types.ts';

export type ContactEnvironment = {
  NEXT_PUBLIC_CONTACT_APPROVED?: string;
  NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED?: string;
  NEXT_PUBLIC_CONTACT_FORM_ACTION?: string;
  NEXT_PUBLIC_WHATSAPP_URL?: string;
  NEXT_PUBLIC_TELEGRAM_URL?: string;
  NEXT_PUBLIC_PHONE_URL?: string;
  NEXT_PUBLIC_EMAIL_URL?: string;
};

export type ResolvedContactConfig = {
  enabled: boolean;
  approvalGateSatisfied: boolean;
  privacyGateSatisfied: boolean;
  contact: ContactSettings;
};

function normalizeHttpsUrl(value: string | undefined): string | undefined {
  const candidate = value?.trim();
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.hash
    ) {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

function normalizePhoneUrl(value: string | undefined): string | undefined {
  const candidate = value?.trim();
  if (!candidate || !/^tel:\+?[0-9][0-9(). -]{5,24}$/.test(candidate)) {
    return undefined;
  }
  return candidate;
}

function normalizeEmailUrl(value: string | undefined): string | undefined {
  const candidate = value?.trim();
  if (!candidate || !/^mailto:[^\s@?]+@[^\s@?]+\.[^\s@?]+$/.test(candidate)) {
    return undefined;
  }
  return candidate;
}

export function resolveContactConfig(
  environment: ContactEnvironment,
): ResolvedContactConfig {
  const approvalGateSatisfied =
    environment.NEXT_PUBLIC_CONTACT_APPROVED === 'true';
  const privacyGateSatisfied =
    environment.NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED === 'true';
  const enabled = approvalGateSatisfied && privacyGateSatisfied;

  if (!enabled) {
    return {
      enabled: false,
      approvalGateSatisfied,
      privacyGateSatisfied,
      contact: {},
    };
  }

  const contact: ContactSettings = {
    whatsappUrl: normalizeHttpsUrl(environment.NEXT_PUBLIC_WHATSAPP_URL),
    telegramUrl: normalizeHttpsUrl(environment.NEXT_PUBLIC_TELEGRAM_URL),
    phoneUrl: normalizePhoneUrl(environment.NEXT_PUBLIC_PHONE_URL),
    emailUrl: normalizeEmailUrl(environment.NEXT_PUBLIC_EMAIL_URL),
    formActionUrl: normalizeHttpsUrl(
      environment.NEXT_PUBLIC_CONTACT_FORM_ACTION,
    ),
  };

  return {
    enabled: true,
    approvalGateSatisfied,
    privacyGateSatisfied,
    contact: Object.fromEntries(
      Object.entries(contact).filter(([, value]) => value !== undefined),
    ),
  };
}

export const contactConfig = resolveContactConfig({
  NEXT_PUBLIC_CONTACT_APPROVED: process.env.NEXT_PUBLIC_CONTACT_APPROVED,
  NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED:
    process.env.NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED,
  NEXT_PUBLIC_CONTACT_FORM_ACTION:
    process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION,
  NEXT_PUBLIC_WHATSAPP_URL: process.env.NEXT_PUBLIC_WHATSAPP_URL,
  NEXT_PUBLIC_TELEGRAM_URL: process.env.NEXT_PUBLIC_TELEGRAM_URL,
  NEXT_PUBLIC_PHONE_URL: process.env.NEXT_PUBLIC_PHONE_URL,
  NEXT_PUBLIC_EMAIL_URL: process.env.NEXT_PUBLIC_EMAIL_URL,
});
