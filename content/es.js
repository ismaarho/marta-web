// Todos los textos generales de la web en castellano.
// Los de cada sector están en content/sectores/<slug>.js.
// Para añadir otro idioma: copia este archivo y la carpeta de sectores con la misma estructura.
// Las plantillas de src/plantilla/ no cambian.

// Único enlace de contacto. Todos los botones usan exactamente esta URL.
export const WHATSAPP =
  "https://wa.me/34722460735?text=Hola%20Ismael%2C%20quiero%20ver%20una%20demo%20de%20Marta";

export default {
  idioma: "es",
  locale: "es_ES",

  meta: {
    titulo: "Marta: atiende las llamadas que no puedes coger",
    descripcion:
      "Si no coges el teléfono, la llamada pasa a Marta. Apunta nombre, teléfono, dirección, motivo del aviso y urgencia, y te manda el parte por WhatsApp. Para empresas de servicios de toda España.",
    ogAlt:
      "Tú trabaja. Marta atiende el teléfono. Un técnico monta un aire acondicionado mientras su móvil suena sobre la mesa.",
  },

  saltar: "Saltar al contenido",
  marca: "Marta",
  inicio: "Marta, ir al inicio",
  lema: "Tú trabaja. Marta atiende el teléfono.",

  nav: {
    etiqueta: "Secciones",
    abrir: "Abrir menú",
    cerrar: "Cerrar menú",
    comoFunciona: {
      texto: "Cómo funciona",
      enlaces: [
        { href: "/como-funciona/", texto: "Visión general" },
        { href: "/como-funciona/#desvio", texto: "El desvío" },
        { href: "/como-funciona/#conversacion", texto: "La conversación" },
        { href: "/como-funciona/#clasificacion", texto: "La clasificación" },
        { href: "/como-funciona/#parte", texto: "El parte por WhatsApp" },
      ],
    },
    sectores: { texto: "Sectores", todos: "Todos los sectores" },
    enlaces: [
      { href: "/clientes/", texto: "Clientes" },
      { href: "/#precio", texto: "Precio" },
      { href: "/#preguntas", texto: "Preguntas" },
    ],
    cta: "Pedir demo",
  },

  // Texto que se añade a los enlaces de WhatsApp para lectores de pantalla
  abreWhatsapp: "(se abre WhatsApp)",

  hero: {
    titulo: "Tú trabaja. Marta atiende el teléfono.",
    // Parte del titular que va en el color de acento
    tituloAcento: "Marta atiende",
    flujo:
      "Si no lo coges en unos segundos, la llamada pasa a Marta. Ella apunta los datos del cliente y te manda el parte por WhatsApp.",
    linea: "No es dejadez. Es el oficio.",
    cta: "Pedir una demo por WhatsApp",
    secundario: "Ver cómo funciona",
    // Tarjetas flotantes sobre la foto del hero (en móvil, fila deslizable bajo la foto)
    tarjetasEtiqueta: "Lo que hace Marta",
    tarjetas: [
      { icono: "atiende", titulo: "Atendida en 9\u00A0s", texto: "Si no lo coges" },
      { icono: "avisa", titulo: "Parte por WhatsApp", texto: "Urgente, normal o presupuesto" },
      { icono: "check", titulo: "Ya en Aquaproc", texto: "Tratamiento de agua" },
    ],
    // Foto del hero de la home, recortada a 4:3
    foto: { src: "/img/hero-movil.jpg", ancho: 900, alto: 1125 },
    imagen: {
      escritorio: { src: "/img/hero.jpg", ancho: 1600, alto: 900 },
      movil: { src: "/img/hero-movil.jpg", ancho: 900, alto: 1125 },
      alt: "Un técnico monta un aire acondicionado subido a una escalera mientras su móvil suena sobre la mesa.",
    },
  },

  // Cinta de sectores bajo el hero (en movimiento; uno resaltado cada 2 s)
  cinta: { etiqueta: "Sectores" },

  carrusel: {
    etiqueta: "Carrusel de sectores",
    anterior: "Sector anterior",
    siguiente: "Sector siguiente",
    pausar: "Pausar el carrusel",
    reanudar: "Reanudar el carrusel",
  },

  primeraEmpresa: {
    titulo: "Primera empresa con Marta",
    nombre: "Aquaproc",
    // Ruta del logo cuando esté disponible (p. ej. "/img/aquaproc.svg"); vacío = nombre en texto.
    // Si existe public/img/aquaproc.(svg|png|webp|jpg), la home lo usa sola.
    logo: "",
    archivoLogo: "aquaproc",
    sector: "Tratamiento de agua",
    // Rótulo encima de la fila de logos (hasta 6), cuando hay logo
    tituloConLogos: "Ya atiende llamadas en",
  },

  // Datos del parte de ejemplo: ficticios a propósito. Cada sector cambia el motivo y la prioridad.
  ejemplo: {
    sello: "Ejemplo",
    remitente: "Marta",
    cabecera: "Nueva llamada atendida por Marta",
    prioridad: "Urgente",
    motivo: "Fuga de agua debajo de la caldera",
    campos: [
      { etiqueta: "Cliente", valor: "Laura Martín" },
      { etiqueta: "Teléfono", valor: "600 000 000" },
      { etiqueta: "Dirección", valor: "Calle Inexistente, 12, 2.º B" },
    ],
  },

  comoFunciona: {
    id: "como-funciona",
    titulo: "Así funciona cada llamada.",
    subtitulo: "Tu número no cambia. Solo cambia quién contesta cuando tú no puedes.",
    tarjetas: {
      atiende: {
        titulo: "Atiende",
        texto: "Tu cliente llama a tu número de siempre. Si no lo coges, la llamada pasa a Marta.",
        // Línea de tiempo de ejemplo de una llamada
        cifra: { valor: "9\u00A0s", leyenda: "hasta que Marta atiende" },
        hitos: [
          { tiempo: "0:00", texto: "Llamada a tu número", etiqueta: "Entrante" },
          { tiempo: "0:08", texto: "Sin respuesta", etiqueta: "Desvío" },
          { tiempo: "0:09", texto: "Pasa a Marta", etiqueta: "Atendida" },
        ],
      },
      pregunta: {
        titulo: "Pregunta",
        texto: "Marta es una recepcionista de voz con inteligencia artificial. Pregunta lo que necesitas para devolver la llamada.",
        datos: ["Nombre", "Teléfono", "Dirección", "Aviso", "Urgencia"],
        cifra: { valor: "5 datos", leyenda: "en cada llamada" },
      },
      avisa: {
        titulo: "Avisa",
        texto:
          "Te llega el parte por WhatsApp, clasificado como urgente, normal o presupuesto. Tú decides cuándo y cómo devuelves la llamada.",
        cifra: { valor: "3 prioridades", leyenda: "urgente, normal, presupuesto" },
      },
    },
  },

  // Cita de un cliente. Si el texto está vacío, la sección no se muestra.
  testimonio: {
    texto: "",
    nombre: "",
    cargo: "",
    empresa: "",
  },

  // Grabación de ejemplo de Marta atendiendo. Si src está vacío, no se muestra.
  audio: {
    marta: {
      titulo: "Escucha a Marta",
      src: "",
      duracion: "",
      transcripcion: "",
    },
  },

  limites: {
    titulo: "Lo que Marta no hace",
    texto:
      "Marta no hace los trabajos, no da citas, no confirma disponibilidad y no da precios ni horas en tu nombre. Tampoco resuelve emergencias. Toma nota y te avisa. El resto lo decides tú.",
  },

  ismael: {
    id: "quien",
    titulo: "Detrás de Marta está Ismael.",
    texto: [
      "Ismael construye el servicio y habla en persona con cada empresa antes de empezar.",
      "Si le escribes por WhatsApp, te contesta él.",
    ],
  },

  precio: {
    id: "precio",
    titulo: "Un precio fijo al mes.",
    cifra: "149",
    unidad: "€/mes",
    piloto: {
      titulo: "Piloto",
      texto: "99 €/mes los tres primeros meses. Solo para cinco empresas.",
    },
    condiciones: "Las condiciones completas se confirman antes de empezar.",
    cta: "Pedir una demo por WhatsApp",
  },

  faq: {
    id: "preguntas",
    titulo: "Preguntas",
    lista: [
      {
        p: "¿Cómo se desvía la llamada a Marta?",
        r: "Con un desvío cuando no contestas. Según tu línea, se activa desde el propio móvil o hay que pedírselo a tu operadora.",
      },
      {
        p: "¿Funciona en mi provincia?",
        r: "Sí. Marta funciona en toda España.",
      },
      {
        p: "¿Qué datos recoge Marta?",
        r: "El nombre del cliente, su teléfono, la dirección, el motivo del aviso y si es urgente.",
      },
      {
        p: "¿Cómo me entero de cada llamada?",
        r: "Te llega un parte por WhatsApp, marcado como urgente, normal o presupuesto. Tú decides cómo y cuándo respondes.",
      },
      {
        p: "¿Marta da citas o precios?",
        r: "No. Marta no da citas, no confirma disponibilidad y no da precios ni horas en tu nombre. Toma nota y te avisa.",
      },
      {
        p: "¿Cuánto cuesta?",
        r: "149 €/mes. Para el piloto, 99 €/mes los tres primeros meses, solo para cinco empresas. Las condiciones completas se confirman antes de empezar.",
      },
      {
        p: "¿Y la privacidad de los datos?",
        r: "La política de privacidad está pendiente de publicar. Si tienes dudas, pregúntaselas a Ismael antes de empezar.",
      },
    ],
  },

  final: {
    titulo: "Cada llamada, atendida.",
    texto: "Un mensaje por WhatsApp a Ismael. Sin formularios.",
    cta: "Pedir una demo por WhatsApp",
  },

  pie: {
    producto: "Producto",
    sectores: "Sectores",
    empresa: "Empresa",
    whatsapp: "WhatsApp +34 722 460 735",
    imagenIA: "Imagen generada con IA.",
  },

  // ---------- Páginas ----------

  paginaComoFunciona: {
    meta: {
      titulo: "Cómo funciona Marta: desvío, conversación, clasificación y parte",
      descripcion:
        "Cuando no coges, la llamada pasa a Marta. Pregunta una cosa cada vez, clasifica el aviso y te manda el parte por WhatsApp. Para empresas de servicios de toda España.",
      ogTitulo: "Así funciona Marta.",
      ogAcento: "Marta",
    },
    titulo: "Así funciona Marta.",
    tituloAcento: "Marta",
    subtitulo:
      "Si no coges el teléfono, la llamada pasa a Marta. Ella pregunta lo necesario, clasifica el aviso y te manda el parte por WhatsApp.",
    secundario: "Ver los sectores",
    bloques: {
      desvio: {
        id: "desvio",
        etiqueta: "El desvío",
        titulo: "Tu número de siempre, con desvío cuando no contestas.",
        texto:
          "Según tu línea, el desvío se activa desde el propio móvil o hay que pedírselo a tu operadora. Si coges tú, todo sigue igual.",
        filas: [
          { a: "Si contestas", b: "Hablas tú" },
          { a: "Si no contestas", b: "Pasa a Marta" },
          { a: "Cómo se activa", b: "Desde el móvil o con la operadora" },
        ],
      },
      conversacion: {
        id: "conversacion",
        etiqueta: "La conversación",
        titulo: "Una pregunta cada vez.",
        texto:
          "Marta pregunta una cosa por turno: nombre, teléfono, dirección, motivo del aviso y si corre prisa. No da precios ni citas.",
        turnos: [
          { quien: "Marta", texto: "Buenos días, le atiende Marta. ¿Me dice su nombre?" },
          { quien: "Cliente", texto: "Laura Martín." },
          { quien: "Marta", texto: "Gracias, Laura. ¿A qué teléfono le podemos llamar?" },
          { quien: "Cliente", texto: "Al 600 000 000." },
          { quien: "Marta", texto: "¿Y cuál es la dirección?" },
        ],
      },
      clasificacion: {
        id: "clasificacion",
        etiqueta: "La clasificación",
        titulo: "Cada aviso, con su prioridad.",
        texto: "Así sabes qué va primero sin abrir nada más.",
        prioridades: [
          { clave: "urgente", nombre: "Urgente", texto: "No puede esperar." },
          { clave: "normal", nombre: "Normal", texto: "Sin prisa." },
          { clave: "presupuesto", nombre: "Presupuesto", texto: "Pide precio o un trabajo nuevo." },
        ],
      },
      parte: {
        id: "parte",
        etiqueta: "El parte por WhatsApp",
        titulo: "Te llega el parte, listo para devolver la llamada.",
        texto:
          "Con el nombre, el teléfono, la dirección, el motivo y la prioridad. Tú decides cuándo y cómo respondes.",
      },
    },
  },

  paginaSectores: {
    meta: {
      titulo: "Sectores: Marta para empresas de servicios de toda España",
      descripcion:
        "Climatización, fontanería, electricidad, tejados, cerrajería y más. Marta atiende las llamadas que no puedes coger y te manda el parte por WhatsApp.",
      ogTitulo: "Sectores",
    },
    titulo: "Sectores",
    subtitulo: "Marta atiende llamadas para empresas de servicios de toda España. Elige tu sector para ver cómo te llegan los avisos.",
    rejillaTitulo: "Todos los sectores",
  },

  paginaSector: {
    otros: "Otros sectores",
  },

  paginaClientes: {
    meta: {
      titulo: "Clientes: empresas que ya usan Marta",
      descripcion: "Aquaproc, empresa de tratamiento de agua, es la primera empresa con Marta.",
      ogTitulo: "Clientes",
    },
    titulo: "Clientes",
    subtitulo: "La primera empresa que ya usa Marta.",
    // Si no hay testimonio, se muestra esta frase en su lugar
    sinCita: "Marta atiende las llamadas de Aquaproc desde octubre de 2026.",
    queHaceTitulo: "Qué hace Marta ahí",
    queHace:
      "Cuando nadie del equipo puede coger el teléfono, Marta atiende la llamada, pregunta lo necesario y envía el parte por WhatsApp.",
  },
};
