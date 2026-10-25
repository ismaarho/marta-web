// Todos los textos de la web en castellano.
// Para añadir otro idioma: copia este archivo (p. ej. content/ca.js) con la misma estructura.
// Los componentes de src/pagina.js no cambian.

// Único enlace de contacto. Todos los botones usan exactamente esta URL.
export const WHATSAPP =
  "https://wa.me/34722460735?text=Hola%20Ismael%2C%20quiero%20ver%20una%20demo%20de%20Marta";

export default {
  idioma: "es",
  locale: "es_ES",

  meta: {
    titulo: "Marta: atiende las llamadas que no puedes coger",
    descripcion:
      "Si no coges el teléfono, la llamada pasa a Marta. Apunta nombre, teléfono, dirección, avería y urgencia, y te manda el parte por WhatsApp. Para instaladores de toda España.",
    ogAlt:
      "Marta. Tú trabaja, Marta atiende el teléfono. Parte de ejemplo de una llamada urgente por una fuga de agua.",
  },

  saltar: "Saltar al contenido",
  marca: "Marta",
  inicio: "Marta, ir al inicio",

  nav: {
    etiqueta: "Secciones",
    abrir: "Abrir menú",
    cerrar: "Cerrar menú",
    enlaces: [
      { href: "#como-funciona", texto: "Cómo funciona" },
      { href: "#parte", texto: "El parte" },
      { href: "#precio", texto: "Precio" },
      { href: "#preguntas", texto: "Preguntas" },
    ],
    cta: "Demo por WhatsApp",
  },

  // Texto que se añade a los enlaces de WhatsApp para lectores de pantalla
  abreWhatsapp: "(se abre WhatsApp)",

  hero: {
    titulo: "Tú trabaja. Marta atiende el teléfono.",
    flujo:
      "Si no lo coges en unos segundos, la llamada pasa a Marta. Ella apunta los datos del cliente y te manda el parte por WhatsApp.",
    cta: "Pedir una demo por WhatsApp",
    nota: "Te contesta Ismael en persona.",
    secundario: "Ver cómo funciona",
  },

  // Visual principal: la llamada que se convierte en parte
  visual: {
    resumen:
      "Esquema: un cliente llama a tu número, no lo coges, la llamada pasa a Marta y te llega un parte por WhatsApp marcado como urgente.",
    llamada: "Llamada a tu número",
    sinRespuesta: "No lo coges",
    desvio: "Pasa a Marta",
    marta: "Marta atiende y pregunta",
    llega: "Te llega el parte por WhatsApp",
  },

  // Datos del parte de ejemplo: ficticios a propósito
  ejemplo: {
    sello: "Ejemplo",
    cabecera: "Nueva llamada atendida por Marta",
    prioridad: "Urgente",
    campos: [
      { etiqueta: "Motivo", valor: "Fuga de agua debajo de la caldera" },
      { etiqueta: "Cliente", valor: "Laura Martín" },
      { etiqueta: "Teléfono", valor: "600\u00A0000\u00A0000" },
      { etiqueta: "Dirección", valor: "Calle Inexistente, 12, 2.º B" },
      { etiqueta: "Vivienda", valor: "Piso" },
      {
        etiqueta: "Notas",
        valor: "Caldera de gas mural. Está en casa toda la tarde. El portero no funciona: llamar al móvil al llegar.",
      },
    ],
    pie: "Llamó desde el 600\u00A0000\u00A0000. Duración: 1\u00A0min 34\u00A0s",
  },

  problema: {
    id: "problema",
    titulo: "El teléfono suena justo cuando no puedes cogerlo.",
    intro: "No es dejadez. Es el oficio.",
    situaciones: [
      "Estás debajo de un fregadero con las manos mojadas.",
      "Estás en lo alto de la escalera colgando un split.",
      "Vas conduciendo de un aviso al siguiente.",
    ],
    cierre:
      "Y quien llama con una avería no suele esperar. Si nadie contesta, prueba con el siguiente.",
  },

  comoFunciona: {
    id: "como-funciona",
    titulo: "Tu número no cambia. Solo cambia quién contesta cuando tú no puedes.",
    // Cada paso es un nodo del diagrama (llamada → Marta → parte); etiqueta = texto del nodo
    espera: "Unos segundos sin respuesta",
    pasos: [
      {
        nodo: "llamada",
        etiqueta: "Llamada",
        titulo: "Tu cliente llama a tu número de siempre.",
        texto: "No tiene que apuntar otro número. Si lo coges tú, todo sigue igual.",
      },
      {
        nodo: "marta",
        etiqueta: "Marta",
        titulo: "Si no lo coges, la llamada pasa a Marta.",
        texto:
          "Marta es una recepcionista de voz con inteligencia artificial. Pregunta nombre, teléfono, dirección, qué avería tiene y si corre prisa.",
      },
      {
        nodo: "parte",
        etiqueta: "Parte",
        titulo: "Te llega el parte por WhatsApp.",
        texto:
          "Clasificado como urgente, normal o presupuesto. Tú decides cuándo y cómo devuelves la llamada.",
      },
    ],
    limites: {
      titulo: "Lo que Marta no hace",
      texto:
        "Marta no repara averías, no da citas, no confirma disponibilidad y no da precios ni horas en tu nombre. Tampoco resuelve emergencias. Toma nota y te avisa. El resto lo decides tú.",
    },
  },

  parte: {
    id: "parte",
    titulo: "Así te llega cada llamada.",
    intro: "Un parte ordenado que lees de un vistazo entre aviso y aviso.",
    notas: [
      { titulo: "La prioridad arriba", texto: "Sabes qué va primero sin abrir nada más." },
      { titulo: "Dirección y vivienda", texto: "Para llegar sin tener que volver a preguntar." },
      { titulo: "Notas para el técnico", texto: "Equipo, horario en que está en casa y cómo entrar." },
    ],
    prioridades: {
      titulo: "Tres prioridades",
      lista: [
        { clave: "urgente", nombre: "Urgente", texto: "Avería que no puede esperar: una fuga, sin agua, sin luz." },
        { clave: "normal", nombre: "Normal", texto: "Avería o revisión sin prisa." },
        { clave: "presupuesto", nombre: "Presupuesto", texto: "Pide precio o una obra nueva." },
      ],
    },
  },

  oficios: {
    id: "para-quien",
    titulo: "Marta trabaja para instaladores de toda España.",
    lista: [
      { nombre: "Climatización", texto: "El aire no enfría o la máquina gotea." },
      { nombre: "Fontanería", texto: "Una fuga o un calentador que no va." },
      { nombre: "Electricidad", texto: "Salta el diferencial o se va la luz." },
      { nombre: "Tratamiento de agua", texto: "El descalcificador no regenera." },
    ],
    real: "Marta ya atiende llamadas en una empresa de tratamiento de agua.",
  },

  precio: {
    id: "precio",
    titulo: "Un precio fijo al mes.",
    cifra: "149",
    unidad: "€/mes",
    piloto: {
      titulo: "Piloto",
      texto: "99\u00A0€/mes los tres primeros meses. Solo para cinco instaladores.",
    },
    condiciones: "Las condiciones completas se confirman antes de empezar.",
    cta: "Pedir una demo por WhatsApp",
  },

  ismael: {
    id: "quien",
    titulo: "Detrás de Marta está Ismael.",
    texto: [
      "Ismael construye el servicio y habla en persona con cada instalador antes de empezar.",
      "Si le escribes por WhatsApp, te contesta él.",
    ],
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
        r: "El nombre del cliente, su teléfono, la dirección, la avería y si es urgente.",
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
        r: "149\u00A0€/mes. Para el piloto, 99\u00A0€/mes los tres primeros meses, solo para cinco instaladores. Las condiciones completas se confirman antes de empezar.",
      },
      {
        p: "¿Y la privacidad de los datos?",
        r: "La política de privacidad está pendiente de publicar. Si tienes dudas, pregúntaselas a Ismael antes de empezar.",
      },
    ],
  },

  final: {
    titulo: "Pide una demo y oye cómo atiende Marta.",
    texto: "Un mensaje por WhatsApp a Ismael. Sin formularios.",
    cta: "Pedir una demo por WhatsApp",
  },

  pie: {
    whatsapp: "WhatsApp +34\u00A0722\u00A0460\u00A0735",
  },
};
