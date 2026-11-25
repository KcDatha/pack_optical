import { getCollection, type CollectionEntry } from 'astro:content';
export type Post = CollectionEntry<'blog'>;
export async function allPosts(): Promise<Post[]> {
  return (await getCollection('blog')).sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}
export const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
export function relatedPosts(all: Post[], p: Post, n = 3): Post[] {
  const score = (x: Post) => (x.data.category === p.data.category ? 2 : 0) + (x.data.relatedService === p.data.relatedService ? 1 : 0);
  return all.filter((x) => x.id !== p.id).map((x) => ({ x, s: score(x) })).sort((a, b) => b.s - a.s || b.x.data.publishedAt.getTime() - a.x.data.publishedAt.getTime()).slice(0, n).map((r) => r.x);
}
