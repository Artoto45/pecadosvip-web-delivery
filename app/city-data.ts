export type CityContent = {
  slug: 'madrid' | 'barcelona';
  city: string;
  regionLabel: string;
  kicker: string;
  headline: string;
  headlineAccent: string;
  lead: string;
  coordinates: [string, string];
  introEyebrow: string;
  introTitle: string;
  introBody: string[];
  areaEyebrow: string;
  areaTitle: string;
  areaIntro: string;
  highlights: Array<{ code: string; name: string; note: string }>;
  locations: string[];
  processTitle: string;
  processIntro: string;
  steps: Array<{ title: string; text: string }>;
  discretionTitle: string;
  discretionText: string;
  faqs: Array<{ question: string; answer: string }>;
  closingTitle: string;
  closingText: string;
};

export const cities: Record<'madrid' | 'barcelona', CityContent> = {
  madrid: {
    slug: 'madrid',
    city: 'Madrid',
    regionLabel: 'Madrid · Atención privada',
    kicker: 'La capital, a tu manera',
    headline: 'La ciudad cambia.',
    headlineAccent: 'Tu intimidad, no.',
    lead:
      'Compañía privada con desplazamiento a domicilios y hoteles. Una atención cuidada, puntual y discretamente extraordinaria.',
    coordinates: ['40.4168° N', '3.7038° W'],
    introEyebrow: 'Madrid, sin ruido',
    introTitle: 'Presencia cuando la quieres. Privacidad en cada detalle.',
    introBody: [
      'Madrid pide ritmo, criterio y una logística impecable. Coordinamos cada solicitud de forma individual para ofrecer una experiencia serena desde el primer contacto.',
      'El servicio se realiza exclusivamente con desplazamiento. No contamos con un local abierto al público: acudimos al domicilio u hotel indicado, siempre después de confirmar zona y disponibilidad.',
    ],
    areaEyebrow: 'Cobertura bajo confirmación',
    areaTitle: 'Madrid, distrito a distrito',
    areaIntro:
      'La atención se organiza por demanda, perfil hotelero y facilidad de desplazamiento. Estas son zonas de consulta prioritaria; la disponibilidad exacta se confirma de manera privada.',
    highlights: [
      {
        code: 'M·01',
        name: 'Centro',
        note: 'Hoteles, Gran Vía, Justicia y el corazón nocturno de la capital.',
      },
      {
        code: 'M·02',
        name: 'Barajas',
        note: 'Atención coordinada para hoteles y estancias próximas al aeropuerto.',
      },
      {
        code: 'M·03',
        name: 'Salamanca · Retiro',
        note: 'Entorno residencial y hotelero con especial cuidado por los tiempos.',
      },
      {
        code: 'M·04',
        name: 'Chamberí · Chamartín',
        note: 'Desplazamientos planificados para encuentros tranquilos y reservados.',
      },
    ],
    locations: [
      'Pozuelo de Alarcón',
      'Majadahonda',
      'Las Rozas',
      'Alcobendas',
      'San Sebastián de los Reyes',
      'Alcalá de Henares',
      'Getafe',
      'Leganés',
      'Móstoles',
      'Torrejón de Ardoz',
      'Rivas-Vaciamadrid',
      'Tres Cantos',
    ],
    processTitle: 'Una reserva clara, sin conversaciones de más',
    processIntro:
      'Solo pedimos lo necesario para confirmar el servicio. La información sensible no se publica ni se utiliza fuera de la coordinación.',
    steps: [
      {
        title: 'Indica zona y momento',
        text: 'Comparte el distrito o municipio, la fecha aproximada y si se trata de hotel o domicilio.',
      },
      {
        title: 'Recibe una confirmación privada',
        text: 'Validamos cobertura y disponibilidad antes de proponerte la opción adecuada.',
      },
      {
        title: 'Disfruta de una llegada puntual',
        text: 'Coordinamos el desplazamiento con discreción y sin exponer información innecesaria.',
      },
    ],
    discretionTitle: 'En Madrid, la verdadera exclusividad es no dejar rastro.',
    discretionText:
      'Diseñamos cada interacción para proteger tu tiempo, tu espacio y tu privacidad. Sin local público, sin exposición y sin promesas que no podamos confirmar.',
    faqs: [
      {
        question: '¿El servicio está disponible en todos los distritos de Madrid?',
        answer:
          'La cobertura depende de la zona, el horario y la disponibilidad del momento. Centro, Barajas, Salamanca, Retiro, Chamberí y Chamartín son áreas de consulta prioritaria, pero siempre confirmamos antes de cerrar la reserva.',
      },
      {
        question: '¿Podéis acudir a un hotel próximo al aeropuerto?',
        answer:
          'Sí, se pueden coordinar desplazamientos a hoteles de Barajas y su entorno cuando exista disponibilidad. Recomendamos indicar el hotel y la franja horaria con antelación.',
      },
      {
        question: '¿También atendéis municipios de la Comunidad?',
        answer:
          'Gestionamos solicitudes en municipios seleccionados, como Pozuelo, Majadahonda, Las Rozas, Alcobendas o Alcalá de Henares. La atención nunca se publica como disponible hasta validarla para esa fecha.',
      },
      {
        question: '¿Existe un local de PecadosVip en Madrid?',
        answer:
          'No. El servicio es exclusivamente con desplazamiento a domicilios y hoteles. No presentamos ninguna dirección como punto de atención al público.',
      },
    ],
    closingTitle: 'Madrid no espera. Tu reserva tampoco debería hacerlo.',
    closingText:
      'Cuéntanos únicamente dónde y cuándo. Confirmaremos el resto de forma privada.',
  },
  barcelona: {
    slug: 'barcelona',
    city: 'Barcelona',
    regionLabel: 'Barcelona · Atención privada',
    kicker: 'Del Eixample al Mediterráneo',
    headline: 'La noche fluye.',
    headlineAccent: 'Tu privacidad permanece.',
    lead:
      'Compañía privada con desplazamiento a domicilios y hoteles de Barcelona. Cercanía, elegancia y una coordinación hecha a tu medida.',
    coordinates: ['41.3874° N', '2.1686° E'],
    introEyebrow: 'Barcelona, en privado',
    introTitle: 'Natural en la forma. Impecable en la atención.',
    introBody: [
      'Barcelona combina estancias breves, vida local y escapadas junto al mar. Por eso cada solicitud se coordina según el ritmo real de la ciudad y la distancia de desplazamiento.',
      'Atendemos exclusivamente en domicilios y hoteles, sin local abierto al público. La cobertura se valida antes de confirmar para que la experiencia empiece con claridad.',
    ],
    areaEyebrow: 'Ciudad, litoral y municipios',
    areaTitle: 'De Barcelona al mar, sin perder la discreción',
    areaIntro:
      'Priorizamos áreas con actividad hotelera, turismo y demanda residencial. Las zonas siguientes orientan la consulta; cada desplazamiento queda sujeto a disponibilidad real.',
    highlights: [
      {
        code: 'B·01',
        name: 'Barcelona ciudad',
        note: 'Coordinación ágil para hoteles, apartamentos y domicilios de la ciudad.',
      },
      {
        code: 'B·02',
        name: 'Castelldefels · Sitges',
        note: 'Atención planificada para estancias de costa, ocio y escapadas privadas.',
      },
      {
        code: 'B·03',
        name: 'Sant Cugat · Vallès',
        note: 'Desplazamientos reservados hacia zonas residenciales y empresariales.',
      },
      {
        code: 'B·04',
        name: 'Baix Llobregat',
        note: 'Consultas para Gavà, Viladecans, El Prat, Esplugues y Sant Just.',
      },
    ],
    locations: [
      'Castelldefels',
      'Sitges',
      'Sant Cugat del Vallès',
      'Esplugues de Llobregat',
      'Sant Just Desvern',
      'Gavà',
      'Badalona',
      "L'Hospitalet de Llobregat",
      'Sabadell',
      'Terrassa',
      'Mataró',
      'Vilanova i la Geltrú',
    ],
    processTitle: 'La coordinación correcta hace que todo parezca sencillo',
    processIntro:
      'El mar, el tráfico y las distancias importan. Confirmamos cada detalle antes del desplazamiento para proteger la puntualidad y la privacidad.',
    steps: [
      {
        title: 'Cuéntanos tu ubicación',
        text: 'Indica ciudad o municipio, hotel o domicilio y una franja horaria aproximada.',
      },
      {
        title: 'Validamos el desplazamiento',
        text: 'Comprobamos cobertura real, tiempos de llegada y disponibilidad para tu zona.',
      },
      {
        title: 'Confirmamos de forma reservada',
        text: 'Recibes solo la información necesaria para una experiencia tranquila y puntual.',
      },
    ],
    discretionTitle: 'Barcelona se vive hacia fuera. Lo importante queda dentro.',
    discretionText:
      'La atención premium no necesita exceso: necesita criterio. Cuidamos la conversación, el desplazamiento y la llegada para mantener cada detalle en el ámbito privado.',
    faqs: [
      {
        question: '¿Atendéis tanto en Barcelona ciudad como en municipios cercanos?',
        answer:
          'Sí, se gestionan solicitudes en Barcelona y en municipios seleccionados de la demarcación. La disponibilidad depende de la fecha, el horario y la distancia, por lo que siempre se confirma previamente.',
      },
      {
        question: '¿Se puede solicitar atención en un hotel de Sitges o Castelldefels?',
        answer:
          'Podemos coordinar desplazamientos a hoteles de costa cuando exista cobertura para esa franja. Cuanto antes indiques ubicación y horario, mejor podremos validar el trayecto.',
      },
      {
        question: '¿Cómo se calcula el tiempo de llegada fuera de la ciudad?',
        answer:
          'Antes de confirmar revisamos el municipio, la movilidad del momento y la disponibilidad. No prometemos un tiempo hasta comprobar que el desplazamiento es viable.',
      },
      {
        question: '¿Puedo acudir a un local en Barcelona?',
        answer:
          'No. PecadosVip funciona únicamente con desplazamiento a domicilios y hoteles; no existe un punto de atención abierto al público.',
      },
    ],
    closingTitle: 'Tu Barcelona. Tu momento. Tus reglas.',
    closingText:
      'Comparte zona y horario. Nosotros confirmamos el desplazamiento con la discreción que esperas.',
  },
};
