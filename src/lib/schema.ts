import { SITE } from './../data/site';
export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
export const crumbs = (items: { name: string; href: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: new URL(c.href, SITE.url).href })),
});
export const serviceSchema = (name: string, description: string, path: string) => ({
  '@context': 'https://schema.org', '@type': 'Service', name, description, url: new URL(path, SITE.url).href,
  provider: { '@id': `${SITE.url}/#practice` }, areaServed: SITE.areas.map((a) => ({ '@type': 'City', name: a })),
});

export function practiceSchema(opts: { ratingVerified?: boolean; rating?: { value: string; count: number } } = {}) {
  const ratingVerified = opts.ratingVerified ?? SITE.RATING_VERIFIED;
  const rating = opts.rating ?? SITE.rating;
  return {
    '@context': 'https://schema.org', '@type': 'Optometrist', '@id': `${SITE.url}/#practice`,
    name: SITE.name, url: `${SITE.url}/`, telephone: '+1-817-831-6141', faxNumber: '+1-682-647-3909', email: SITE.email,
    foundingDate: '1951', priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: SITE.address.street, addressLocality: 'Fort Worth', addressRegion: 'TX', postalCode: SITE.address.zip, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 32.7789075, longitude: -97.2812537 },
    hasMap: SITE.mapsUrl,
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Thursday'], opens: '07:30', closes: '17:30' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '08:30', closes: '17:30' },
    ],
    sameAs: [SITE.facebook, SITE.instagram], areaServed: SITE.areas,
    ...(ratingVerified ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.value, reviewCount: String(rating.count) } } : {}),
  };
}
