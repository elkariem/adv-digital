export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "ar";

export const direction = {
  ar: "rtl",
  en: "ltr",
} as const;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/**
 * Every leaf is an { ar, en } pair, so a missing translation is a type error
 * rather than a silent fallback. `t(locale).a.b` is always a string.
 */
export const t = {
  meta: {
    title: {
      ar: "دجيتال المتميز | مختبر أسنان رقمي",
      en: "Advanced Digital | Digital Dental Laboratory",
    },
    description: {
      ar: "مختبر أسنان رقمي في المملكة العربية السعودية يصنع تركيبات عالية الدقة للعيادات والأطباء، مع نظام متابعة لكل حالة.",
      en: "A Saudi digital dental laboratory manufacturing high-precision restorations for clinics and dentists, with case tracking for every order.",
    },
  },
  nav: {
    about: { ar: "عن المختبر", en: "About" },
    services: { ar: "الخدمات", en: "Services" },
    process: { ar: "مراحل التصنيع", en: "Process" },
    tracking: { ar: "متابعة الحالة", en: "Tracking" },
    reviews: { ar: "الآراء", en: "Reviews" },
    contact: { ar: "تواصل معنا", en: "Contact" },
    switchToArabic: { ar: "العربية", en: "العربية" },
    switchToEnglish: { ar: "English", en: "English" },
    menu: { ar: "القائمة", en: "Menu" },
    close: { ar: "إغلاق", en: "Close" },
    skipToContent: { ar: "تخطَّ إلى المحتوى", en: "Skip to content" },
    primaryLabel: { ar: "التنقل الرئيسي", en: "Primary navigation" },
    homeLabel: { ar: "الصفحة الرئيسية", en: "Home page" },
  },
  hero: {
    statement: {
      ar: "تركيبات تُصنع بعين الفنان، وتُتابَع بدقة المهندس",
      en: "Crafted with an artist’s eye, tracked with an engineer’s precision",
    },
    subtitle: {
      ar: "مختبر الأسنان الرقمي في المملكة العربية السعودية. نصمّم ونصنّع تركيبات للعيادات والأطباء، ونتابع كل حالة خطوة بخطوة حتى تصل إليك.",
      en: "A digital dental laboratory in Saudi Arabia. We design and manufacture restorations for clinics and dentists, and we follow every case step by step until it reaches you.",
    },
    primaryCta: { ar: "تابع حالة", en: "Track a case" },
    secondaryCta: { ar: "تواصل عبر واتساب", en: "Chat on WhatsApp" },
    tertiaryCta: { ar: "خدماتنا", en: "Our services" },
    badge: { ar: "مختبر رقمي معتمد للعيادات", en: "A digital lab for clinics" },
    portraitAlt: { ar: "صورة مالك المعمل", en: "Portrait of the laboratory owner" },
  },
  about: {
    eyebrow: { ar: "عن المختبر", en: "About the laboratory" },
    title: { ar: "دقة رقمية، ولمسة حرفية", en: "Digital precision, artisanal finish" },
    body1: {
      ar: "نعمل مع أطباء الأسنان والعيادات على تصنيع تركيبات دقيقة ومريحة، من الفينير والزيركون إلى الزراعات والأجهزة التقويمية. كل حالة تمر على مراحل واضحة، تعرف من أين بدأت وإلى أين وصلت.",
      en: "We work with dentists and clinics to manufacture restorations that are precise and comfortable — from veneers and zirconia to implants and orthodontic appliances. Every case moves through clearly defined stages, so you always know where it stands.",
    },
body2: {
      ar: "نبدأ من التصميم الرقمي، ونصنّع بدقة، ثم نفحص الملاءمة واللون والتشطيب قبل أي تغليف. ما يخرج من المختبر يطابق التصميم الذي اعتمده طبيبك.",
      en: "We start with the digital design, manufacture with precision, then check fit, shade, and finishing before anything is packaged. What leaves our lab matches the design your dentist approved.",
    },
    trackTitle: { ar: "تابع حالة مباشرة", en: "Track a case" },
    body3: {
      ar: "التواصل معنا مباشر عبر واتساب. وإذا تبغى صورة واضحة عن وضع حالة عندنا، أدخل رقم الحالة في صفحة متابعة الحالات في أي وقت.",
      en: "Communication stays direct over WhatsApp. Whenever you want a clear picture of where a case stands, enter its code on the case tracking page at any time.",
    },
  },
  services: {
    eyebrow: { ar: "الخدمات", en: "Services" },
    title: { ar: "ما الذي نصنعه", en: "What we manufacture" },
    intro: {
      ar: "هذه أكثر التركيبات طلباً من العيادات. كلها تُصنع رقمياً وتُراجع قبل التسليم.",
      en: "These are the restorations clinics ask for most. All are designed digitally and checked before they leave the lab.",
    },
    additionalTitle: { ar: "خدمات إضافية", en: "Also available" },
  },
  process: {
    eyebrow: { ar: "مسار التصنيع", en: "Manufacturing process" },
    title: { ar: "من الاستلام حتى التسليم", en: "From receipt to delivery" },
    intro: {
      ar: "سبع مراحل واضحة، تتابعها لحظة بلحظة في صفحة متابعة الحالات.",
      en: "Seven clearly defined stages, each one visible on the case tracking page as the case moves forward.",
    },
    flexibilityNote: {
      ar: "المراحل مرنة حسب الحالة. نبدأ من المرحلة اللي تناسب حالتك، ونرجع لأي مرحلة سابقة إذا احتاجت الحالة تعديلاً.",
      en: "Stages adapt to the case. We start at whichever stage is accurate, and move back to an earlier one if rework is needed.",
    },
  },
  tracking: {
    eyebrow: { ar: "متابعة الحالات", en: "Case tracking" },
    title: { ar: "تابع حالتك", en: "Track your case" },
    intro: {
      ar: "أدخل رقم الحالة — الرقم وحده أو بصيغة GD- — وتشوف مرحلتها الحالية وسجل مراحلها.",
      en: "Enter your case code — the number on its own or with the GD- prefix — to see its current stage and full stage history.",
    },
    inputLabel: { ar: "رقم الحالة", en: "Case Code" },
    inputPlaceholder: { ar: "مثال: GD-1024", en: "e.g. GD-1024" },
    inputHint: {
      ar: "أدخل رقم الحالة كما هو. يمكنك كتابته بدون البادئة GD- وسنضيفها تلقائياً.",
      en: "Enter the case number as you have it. You can type it without the GD- prefix and we will add it automatically.",
    },
    submit: { ar: "اعرض الحالة", en: "Track case" },
    searching: { ar: "جارٍ البحث…", en: "Searching…" },
    notFound: {
      ar: "الحالة غير موجودة. تأكد من رقم الحالة وحاول مرة ثانية.",
      en: "Case not found. Please check the case code and try again.",
    },
    invalidCode: { ar: "الرجاء إدخال رقم حالة صحيح.", en: "Please enter a valid case code." },
    rateLimited: {
      ar: "طلبات كثيرة في وقت قصير. انتظر قليلاً ثم حاول مرة ثانية.",
      en: "Too many requests. Please wait a moment and try again.",
    },
    genericError: { ar: "تعذّر إتمام الطلب. حاول مرة ثانية.", en: "Something went wrong. Please try again." },
    resultDoctor: { ar: "الطبيب", en: "Doctor" },
    resultDelivery: { ar: "موعد التسليم المتوقع", en: "Expected Delivery" },
    resultStage: { ar: "المرحلة الحالية", en: "Current Stage" },
    resultHistory: { ar: "سجل المراحل", en: "Stage History" },
    historyEmpty: { ar: "لا يوجد سجل مراحل بعد.", en: "No stage history yet." },
    resultHint: {
      ar: "هذي المعلومات تظهر لرقم حالة صحيح فقط، ولا تشمل أي بيانات مرضى.",
      en: "This information is shown for a valid case code only, and contains no patient data.",
    },
  },
  reviews: {
    eyebrow: { ar: "آراء الأطباء", en: "Doctors’ reviews" },
    title: { ar: "ماذا يقول أطباؤنا", en: "What our dentists say" },
    intro: {
      ar: "أطباء وعيادات تعاملوا معنا. شاركنا رأيك، ونرحّب به.",
      en: "Dentists and clinics who have worked with us. Share your experience — it is welcome.",
    },
    empty: { ar: "لا توجد آراء منشورة حتى الآن.", en: "No reviews have been published yet." },
    formTitle: { ar: "أضف رأيك", en: "Add your review" },
    formIntro: {
      ar: "يرجى كتابة رأيك بصراحة. ننشره مباشرة.",
      en: "Please write honestly. Reviews are published straight away.",
    },
    doctorName: { ar: "اسم الطبيب", en: "Doctor Name" },
    doctorNamePlaceholder: { ar: "مثال: د. أحمد محمد", en: "e.g. Dr. Ahmed Mohamed" },
    clinicName: { ar: "اسم العيادة", en: "Clinic Name" },
    clinicNamePlaceholder: { ar: "اختياري", en: "Optional" },
    text: { ar: "رأيك", en: "Your Review" },
    textPlaceholder: {
      ar: "اكتب تجربتك مع المختبر: الدقة، التوقيت، جودة التركيبة…",
      en: "Tell us about your experience: accuracy, turnaround, the quality of the restoration…",
    },
    submit: { ar: "إرسال", en: "Submit review" },
    submitting: { ar: "جارٍ الإرسال…", en: "Submitting…" },
    success: { ar: "شكراً لك. تم نشر رأيك.", en: "Thank you — your review is now published." },
    errorName: { ar: "الرجاء إدخال اسم الطبيب.", en: "Please enter the doctor’s name." },
    errorText: { ar: "الرجاء كتابة رأيك.", en: "Please write your review." },
    errorTextShort: {
      ar: "رأيك قصير جداً — 10 أحرف على الأقل.",
      en: "Your review is too short — at least 10 characters.",
    },
    errorRateLimited: {
      ar: "طلبات كثيرة في وقت قصير. انتظر قليلاً ثم حاول مرة ثانية.",
      en: "Too many requests. Please wait a moment and try again.",
    },
    errorGeneric: { ar: "تعذّر إرسال الرأي. حاول مرة ثانية.", en: "Could not submit your review. Please try again." },
  },
  contact: {
    eyebrow: { ar: "تواصل معنا", en: "Contact" },
    title: { ar: "نسعد بتواصلك", en: "Get in touch" },
    intro: {
      ar: "أسرع طريقة للتواصل هي واتساب. أرسل ملفات الحالة، أو استفسر عن حالة موجودة، أو اتفق على موعد تسليم.",
      en: "WhatsApp is the fastest way to reach us. Send your case files, ask about an existing case, or arrange a delivery time.",
    },
    phoneLabel: { ar: "الهاتف", en: "Phone" },
    whatsappLabel: { ar: "واتساب", en: "WhatsApp" },
    emailLabel: { ar: "البريد الإلكتروني", en: "Email" },
    whatsappCta: { ar: "افتح محادثة واتساب", en: "Open WhatsApp chat" },
  },
  footer: {
    contactTitle: { ar: "تواصل", en: "Contact" },
    tagline: {
      ar: "مختبر أسنان رقمي في المملكة العربية السعودية.",
      en: "A digital dental laboratory in Saudi Arabia.",
    },
    rights: { ar: "جميع الحقوق محفوظة.", en: "All rights reserved." },
    manageLink: { ar: "إدارة المختبر", en: "Laboratory Management" },
  },
  manage: {
    title: { ar: "إدارة المختبر", en: "Laboratory Management" },
    dashboardTitle: { ar: "لوحة تحكم المختبر", en: "Laboratory dashboard" },
    dashboardIntro: {
      ar: "أضف الحالات وحدّث مراحل التصنيع، وأدر الآراء المنشورة من العملاء. كل التغييرات تُحفظ مباشرة.",
      en: "Add cases, update manufacturing stages, and manage published customer reviews. Every change is saved immediately.",
    },
    signInTitle: { ar: "دخول المالك", en: "Owner access" },
    signInBody: {
      ar: "هذه المنطقة مخصصة لمالك المختبر. أدخل كلمة مرور الإدارة للمتابعة.",
      en: "This area is reserved for the laboratory owner. Enter the management password to continue.",
    },
    loginIntro: {
      ar: "هذه المنطقة مخصصة لصاحب المختبر. أدخل كلمة المرور للمتابعة.",
      en: "This area is for the laboratory owner. Enter the management password to continue.",
    },
    passwordLabel: { ar: "كلمة المرور", en: "Management Password" },
    passwordPlaceholder: { ar: "أدخل كلمة المرور", en: "Enter the management password" },
    signIn: { ar: "دخول", en: "Sign in" },
    signingIn: { ar: "جارٍ التحقق…", en: "Verifying…" },
    requiredPassword: { ar: "الرجاء إدخال كلمة المرور.", en: "Please enter the management password." },
    invalidPassword: { ar: "كلمة المرور غير صحيحة.", en: "Incorrect password." },
    signOut: { ar: "خروج", en: "Sign out" },
    casesTab: { ar: "الحالات", en: "Cases" },
    reviewsTab: { ar: "الآراء", en: "Reviews" },
    newCaseHeading: { ar: "حالة جديدة", en: "New case" },
    editCaseHeading: { ar: "تعديل الحالة", en: "Edit case" },
    caseCode: { ar: "رقم الحالة", en: "Case Code" },
    caseCodeHint: {
      ar: "اكتب الرقم وحده، وسيُضاف GD- تلقائياً.",
      en: "Enter the number on its own — GD- is added automatically.",
    },
    doctorName: { ar: "اسم الطبيب", en: "Doctor Name" },
    doctorNamePlaceholder: { ar: "مثال: د. أحمد محمد", en: "e.g. Dr. Ahmed Mohamed" },
    expectedDelivery: { ar: "موعد التسليم المتوقع", en: "Expected Delivery Date" },
    currentStage: { ar: "المرحلة الحالية", en: "Current Manufacturing Stage" },
    save: { ar: "حفظ", en: "Save" },
    saving: { ar: "جارٍ الحفظ…", en: "Saving…" },
    cancel: { ar: "إلغاء", en: "Cancel" },
    created: { ar: "تمت إضافة الحالة.", en: "Case created." },
    updated: { ar: "تم تحديث الحالة.", en: "Case updated." },
    errorCodeExists: {
      ar: "رقم الحالة مستخدم بالفعل في حالة أخرى.",
      en: "This case code is already used by another case.",
    },
    errorRequired: { ar: "الرجاء تعبئة جميع الحقول المطلوبة.", en: "Please complete all required fields." },
    errorInvalidDate: { ar: "تاريخ التسليم غير صحيح.", en: "The delivery date is not valid." },
    errorGeneric: { ar: "تعذّر حفظ الحالة. حاول مرة ثانية.", en: "Could not save the case. Please try again." },
    noCases: { ar: "لا توجد حالات بعد.", en: "No cases yet." },
    noCasesHint: {
      ar: "أضف أول حالة من النموذج بالأعلى.",
      en: "Add your first case using the form above.",
    },
    updatedAtLabel: { ar: "آخر تحديث", en: "Updated" },
    noReviews: { ar: "لا توجد آراء.", en: "No reviews." },
    deleteReview: { ar: "حذف الرأي", en: "Delete review" },
    deleteReviewTitle: { ar: "حذف هذا الرأي؟", en: "Delete this review?" },
    deleteReviewBody: {
      ar: "سيُحذف الرأي نهائياً ولا يمكن التراجع عن ذلك.",
      en: "This review will be permanently removed. This cannot be undone.",
    },
    confirmDelete: { ar: "تأكيد الحذف", en: "Delete review" },
    reviewDeleted: { ar: "تم حذف الرأي.", en: "Review deleted." },
    reviewNotFound: { ar: "الرأي غير موجود.", en: "Review not found." },
  },
  whatsappFab: {
    label: { ar: "تواصل عبر واتساب", en: "Chat on WhatsApp" },
  },
  system: {
    notFoundCode: { ar: "٤٠٤", en: "404" },
    notFoundTitle: { ar: "الصفحة غير موجودة", en: "Page not found" },
    notFoundBody: {
      ar: "الرابط الذي فتحته غير صحيح أو تم نقل الصفحة إلى مكان آخر.",
      en: "The link you opened is incorrect, or the page has moved somewhere else.",
    },
    notFoundTrackCta: { ar: "تابع حالة", en: "Track a case" },
    notFoundHomeCta: { ar: "العودة للرئيسية", en: "Back to home" },
    errorTitle: { ar: "حدث خطأ غير متوقع", en: "Something went wrong" },
    errorBody: {
      ar: "تعذّر تحميل هذه الصفحة. حاول مرة أخرى، وإذا تكرر الأمر تواصل معنا.",
      en: "This page could not be loaded. Please try again, and contact us if it keeps happening.",
    },
    errorRetry: { ar: "إعادة المحاولة", en: "Try again" },
    errorHomeCta: { ar: "العودة للرئيسية", en: "Back to home" },
    errorReference: { ar: "رقم مرجعي", en: "Reference" },
    loading: { ar: "جارٍ التحميل…", en: "Loading…" },
  },
} as const;

/** Picks the active language for a single { ar, en } pair. */
export function tx(locale: Locale, entry: { ar: string; en: string }): string {
  return entry[locale];
}

/**
 * Client-side read of the locale cookie, for client components that cannot call
 * `cookies()` — chiefly the error boundary. Falls back to the default language.
 */
export function localeFromCookie(): Locale {
  const match = typeof document === "undefined" ? null : document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : undefined;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
