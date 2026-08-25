import Image from 'next/image';
import Link from 'next/link';
import type { CityContent } from '../city-data';

type CityLandingProps = {
  content: CityContent;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pecadosvip.com';

function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default function CityLanding({ content }: CityLandingProps) {
  const isMadrid = content.slug === 'madrid';
  const otherCity = isMadrid
    ? { label: 'Barcelona', href: '/barcelona' }
    : { label: 'Madrid', href: '/madrid' };
  const pageUrl = `${siteUrl}/${content.slug}`;
  const formAction = process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION;
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || '#solicitud';
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || '#solicitud';
  const phoneUrl = process.env.NEXT_PUBLIC_PHONE_URL || '#solicitud';

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PecadosVip',
      url: siteUrl,
      image: `${siteUrl}/og.png`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Compañía privada en ${content.city}`,
      provider: {
        '@type': 'Organization',
        name: 'PecadosVip',
        url: siteUrl,
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: content.city,
      },
      serviceType: 'Servicio de compañía privada con desplazamiento',
      url: pageUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'PecadosVip',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.city,
          item: pageUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <main className={`city-page city-${content.slug}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
      />

      <header className="site-header">
        <Link
          className="brand"
          href={`/${content.slug}`}
          aria-label={`PecadosVip ${content.city}`}
        >
          <span className="apple-mark" aria-hidden="true"><span /></span>
          <span>Pecados<span>Vip</span></span>
        </Link>

        <nav className="desktop-nav" aria-label="Ciudades principales">
          <Link
            className={isMadrid ? 'active' : undefined}
            href="/madrid"
            aria-current={isMadrid ? 'page' : undefined}
          >
            Madrid
          </Link>
          <Link
            className={!isMadrid ? 'active' : undefined}
            href="/barcelona"
            aria-current={!isMadrid ? 'page' : undefined}
          >
            Barcelona
          </Link>
        </nav>

        <a className="header-cta" href="#contacto">Consultar</a>
      </header>

      <div className="mobile-city-switch" aria-label="Cambiar de ciudad">
        <Link href={`/${content.slug}`} aria-current="page">
          {content.city}
        </Link>
        <Link href={otherCity.href}>{otherCity.label}</Link>
      </div>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> {content.regionLabel}</p>
          <p className="hero-kicker">{content.kicker}</p>
          <h1 id="page-title">
            {content.headline}<br />
            <em>{content.headlineAccent}</em>
          </h1>
          <p className="hero-lead">{content.lead}</p>
          <div className="hero-actions">
            <a className="primary-cta" href="#contacto">
              Consultar disponibilidad <span aria-hidden="true">→</span>
            </a>
            <a className="text-cta" href="#servicio">Cómo funciona</a>
          </div>
          <ul className="trust-row" aria-label="Características del servicio">
            <li><span>01</span> Atención personal</li>
            <li><span>02</span> Hoteles y domicilios</li>
            <li><span>03</span> Privacidad cuidada</li>
          </ul>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="city-word">{content.city.toUpperCase()}</div>
          <div className="orb">
            <div className="orb-shine" />
            <div className="orb-cut" />
          </div>
          <p>{content.coordinates[0]}<br />{content.coordinates[1]}</p>
          <span className="vertical-note">
            {content.city.toUpperCase()} · PECADOSVIP
          </span>
        </div>
      </section>

      <div className="age-ribbon">
        <span>Solo para mayores de 18 años</span>
        <span>Servicio con desplazamiento · Sin local abierto al público</span>
      </div>

      <section className="intro-section section-shell" id="servicio">
        <div className="section-index" aria-hidden="true">01</div>
        <div className="intro-heading">
          <p className="section-label">{content.introEyebrow}</p>
          <h2>{content.introTitle}</h2>
        </div>
        <div className="intro-copy">
          {content.introBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="service-principles">
          <article>
            <span>01</span>
            <h3>Desplazamiento</h3>
            <p>La atención se presta únicamente en el hotel o domicilio confirmado.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Confirmación real</h3>
            <p>Zona, horario y disponibilidad se validan antes de aceptar la solicitud.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Reserva privada</h3>
            <p>Pedimos solo la información imprescindible para coordinar la llegada.</p>
          </article>
        </div>
      </section>

      <section className="coverage-section" id="zonas">
        <div className="section-shell">
          <div className="coverage-heading">
            <div>
              <p className="section-label">{content.areaEyebrow}</p>
              <h2>{content.areaTitle}</h2>
            </div>
            <p>{content.areaIntro}</p>
          </div>

          <div className="coverage-grid">
            {content.highlights.map((highlight) => (
              <article className="coverage-card" key={highlight.code}>
                <span className="card-code">{highlight.code}</span>
                <h3>{highlight.name}</h3>
                <p>{highlight.note}</p>
                <span className="availability">Consulta prioritaria</span>
              </article>
            ))}
          </div>

          <div className="location-list">
            <div>
              <p className="section-label">Otras zonas de consulta</p>
              <p>
                La inclusión en esta lista no sustituye la confirmación de
                cobertura para una fecha concreta.
              </p>
            </div>
            <ul>
              {content.locations.map((location) => (
                <li key={location}>{location}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="process-section section-shell">
        <div className="process-heading">
          <p className="section-label">Así funciona</p>
          <h2>{content.processTitle}</h2>
          <p>{content.processIntro}</p>
        </div>
        <ol className="process-list">
          {content.steps.map((step, index) => (
            <li key={step.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="discretion-section">
        <div className="discretion-orbit" aria-hidden="true">
          <span className="apple-mark large"><span /></span>
        </div>
        <div>
          <p className="section-label">El lujo de la discreción</p>
          <h2>{content.discretionTitle}</h2>
          <p>{content.discretionText}</p>
        </div>
      </section>

      <figure className="visual-manifesto section-shell">
        <div className="visual-frame">
          <Image
            src="/og.png"
            width={1200}
            height={630}
            sizes="(max-width: 780px) 92vw, 86vw"
            alt="PecadosVip: Madrid y Barcelona, privacidad, presencia y distinción"
          />
        </div>
        <figcaption>
          <span>Manifiesto de marca</span>
          <p>Una identidad sobria, una presencia inolvidable.</p>
        </figcaption>
      </figure>

      <section className="faq-section section-shell">
        <div className="faq-heading">
          <p className="section-label">Información práctica</p>
          <h2>Preguntas frecuentes en {content.city}</h2>
          <p>Respuestas claras antes de compartir ningún dato sensible.</p>
        </div>
        <div className="faq-list">
          {content.faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>
                <span>0{index + 1}</span>
                {faq.question}
                <i aria-hidden="true">+</i>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contacto">
        <div className="contact-inner">
          <div className="contact-copy">
            <p className="section-label">Reserva privada · {content.city}</p>
            <h2>{content.closingTitle}</h2>
            <p>{content.closingText}</p>
            <div className="channel-grid" aria-label="Canales de contacto previstos">
              <a href={whatsappUrl}><span>WA</span> WhatsApp</a>
              <a href={telegramUrl}><span>TG</span> Telegram</a>
              <a href={phoneUrl}><span>TL</span> Teléfono</a>
              <a href="#solicitud"><span>FM</span> Formulario</a>
            </div>
          </div>

          <form
            className="contact-form"
            id="solicitud"
            action={formAction || undefined}
            method="post"
          >
            <input type="hidden" name="city" value={content.city} />
            <label>
              Zona o municipio
              <input
                name="zone"
                placeholder={isMadrid ? 'Ej. Centro o Pozuelo' : 'Ej. Eixample o Sitges'}
                autoComplete="address-level2"
                required
              />
            </label>
            <div className="field-row">
              <label>
                Fecha aproximada
                <input name="date" type="date" required />
              </label>
              <label>
                Lugar
                <select name="venue" defaultValue="" required>
                  <option value="" disabled>Selecciona</option>
                  <option value="hotel">Hotel</option>
                  <option value="domicilio">Domicilio</option>
                </select>
              </label>
            </div>
            <label>
              Canal preferido
              <select name="channel" defaultValue="" required>
                <option value="" disabled>Selecciona un canal</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
                <option value="telefono">Teléfono</option>
              </select>
            </label>
            <button type="submit" disabled={!formAction}>
              {formAction ? 'Enviar solicitud' : 'Canal seguro en preparación'}
              <span aria-hidden="true">→</span>
            </button>
            <p className="form-note">
              No incluyas información sensible. La solicitud solo se enviará
              cuando el canal seguro esté configurado.
            </p>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <Link className="brand" href={`/${content.slug}`}>
            <span className="apple-mark" aria-hidden="true"><span /></span>
            <span>Pecados<span>Vip</span></span>
          </Link>
          <p>Compañía privada con desplazamiento en Madrid y Barcelona.</p>
        </div>
        <div className="footer-city">
          <span>También en</span>
          <Link href={otherCity.href}>
            {otherCity.label} <b aria-hidden="true">↗</b>
          </Link>
        </div>
        <div className="footer-legal">
          <span>Exclusivo para mayores de 18 años</span>
          <span>Privacidad · Discreción · Respeto</span>
        </div>
      </footer>

      <a className="mobile-sticky-cta" href="#contacto">
        Consultar en {content.city} <span aria-hidden="true">→</span>
      </a>
    </main>
  );
}
