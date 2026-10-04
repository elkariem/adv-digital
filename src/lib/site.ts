export const brand = {
  ar: "دجيتال المتميز",
  en: "Advanced Digital",
} as const;

/** Digits only, for wa.me links. */
const WHATSAPP_DIGITS = "966550773997";

export const contact = {
  phoneDisplay: "+966 55 077 3997",
  phoneHref: "tel:+966550773997",
  whatsappDisplay: "+966 55 077 3997",
  whatsappHref: `https://wa.me/${WHATSAPP_DIGITS}`,
  emailDisplay: "info@advanceddigital.com",
  emailHref: "mailto:info@advanceddigital.com",
} as const;
