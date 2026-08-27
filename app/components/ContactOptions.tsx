import type { ContactSettings } from '../../lib/content/types';
import { getRuntimeContactState } from '../../lib/content/runtime-publication';

type ContactOption = {
  key: keyof Pick<
    ContactSettings,
    'whatsappUrl' | 'telegramUrl' | 'phoneUrl' | 'emailUrl'
  >;
  shortLabel: string;
  label: string;
};

const options: ContactOption[] = [
  { key: 'whatsappUrl', shortLabel: 'WA', label: 'WhatsApp' },
  { key: 'telegramUrl', shortLabel: 'TG', label: 'Telegram' },
  { key: 'phoneUrl', shortLabel: 'TL', label: 'Teléfono' },
  { key: 'emailUrl', shortLabel: 'EM', label: 'Correo' },
];

export default function ContactOptions() {
  const contactState = getRuntimeContactState();
  const hasEnabledChannel =
    contactState.enabled &&
    options.some((option) => contactState.contact[option.key]);

  return (
    <div className="public-contact-options">
      <div className="public-channel-grid" aria-label="Canales de contacto">
        {options.map((option) => {
          const href = contactState.enabled
            ? contactState.contact[option.key]
            : undefined;
          const contents = (
            <>
              <span aria-hidden="true">{option.shortLabel}</span>
              {option.label}
            </>
          );

          return href ? (
            <a href={href} key={option.key} rel="noreferrer">
              {contents}
            </a>
          ) : (
            <span className="public-channel-disabled" aria-disabled="true" key={option.key}>
              {contents}
            </span>
          );
        })}
      </div>
      <p className="public-contact-state" role="status">
        {hasEnabledChannel
          ? 'Usa únicamente uno de los canales aprobados que aparecen activos.'
          : 'Los canales están deshabilitados hasta completar las aprobaciones de release, contacto y privacidad.'}
      </p>
    </div>
  );
}
