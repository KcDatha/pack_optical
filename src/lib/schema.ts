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
