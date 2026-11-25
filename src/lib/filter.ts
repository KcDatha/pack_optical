export function filterPosts<T extends { title: string; excerpt: string; category: string }>(posts: T[], query: string, category: string): T[] {
  const q = query.trim().toLowerCase();
  return posts.filter((p) => (category === 'All' || p.category === category) && (!q || (p.title + ' ' + p.excerpt).toLowerCase().includes(q)));
}
