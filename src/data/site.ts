// Business facts: exactly as in BUILD_PLAN.md Facts section. Change here only.
export const SITE = {
  name: 'Pack Optical + Med Spa',
  url: 'https://packoptical.com',
  address: { street: '1217 Oak Knoll Drive', city: 'Fort Worth', region: 'TX', zip: '76117', country: 'US' },
  addressLine: '1217 Oak Knoll Drive, Fort Worth, TX 76117',
  phone: '817-831-6141',
  phoneTel: '+18178316141',
  fax: '682-647-3909',
  email: 'office@packoptical.com',
  rating: { value: '4.8', count: 441 },
  founded: 1951,
  hoursShort: 'Mon/Tue/Thu 7:30 AM–5:30 PM · Wed 8:30 AM–5:30 PM · Fri–Sun Closed',
  contactsOrderUrl: 'https://packoptical.myclstore.com/Order/Welcome?aN=135061',
  frameSelectorUrl: 'https://www.myframeboard.com/9398-8ALH',
  weaveUrl: 'https://book2.getweave.com/a333a485-8706-412a-b7c2-d467515b9221/request-appointment?source=WEBSITE',
  moxieUrl: 'http://app.joinmoxie.com/booking/pack-medspa',
  mapsUrl:
    'https://www.google.com/maps/place/Pack+Optical/@32.7784497,-97.2812538,15z/data=!4m6!3m5!1s0x864e774c9e08ca43:0x7e5d2d85b47ecb1d!8m2!3d32.7789075!4d-97.2812537!16s%2Fg%2F1tj21z0m?entry=ttu',
  facebook: 'https://www.facebook.com/PackOpticalmedspa',
  instagram: 'https://www.instagram.com/packopticalmedspa/',
  areas: ['Fort Worth', 'Haltom City', 'Saginaw', 'North Richland Hills', 'Keller', 'Watauga', 'Bedford', 'Euless', 'Hurst', 'Richland Hills'],
} as const;

// Opening hours in minutes since midnight, indexed by JS getDay() (0 = Sunday).
export const HOURS: Record<number, [number, number] | null> = {
  0: null, 1: [450, 1050], 2: [450, 1050], 3: [510, 1050], 4: [450, 1050], 5: null, 6: null,
};
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Demo service key -> production slug (BUILD_PLAN page map).
export const SERVICE_SLUGS: Record<string, string> = {
  'adult-senior': 'comprehensive-eye-exams',
  childrens: 'childrens-eye-exams',
  diabetic: 'diabetic-eye-exams',
  contacts: 'contact-lens-fittings',
  'dry-eye': 'dry-eye-treatment',
  ipl: 'ipl-treatment',
  emergency: 'emergency-eye-care',
  'digital-strain': 'digital-eye-strain',
  'eye-disease': 'eye-disease-management',
  laser: 'laser-surgery-consultation',
  aesthetics: 'aesthetics-med-spa',
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Our Practice', href: '/our-practice/' },
  { label: 'Services', href: '/services/' },
  { label: 'Dry Eye', href: '/services/dry-eye-treatment/' },
  { label: 'Aesthetics', href: '/services/aesthetics-med-spa/' },
  { label: 'Eyewear', href: '/eyewear/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Visit', href: '/visit/' },
] as const;
