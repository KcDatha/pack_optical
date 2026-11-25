import demo from '../data/demo-data.json';
export interface Post { title: string; date: Date; dateLabel: string; category: string; slug: string; excerpt: string; book: string }
export const posts: Post[] = demo.POSTS.map((p) => ({
  title: p.t, dateLabel: p.d, date: new Date(p.d + ' 12:00:00'), category: p.c, slug: p.u, excerpt: p.s, book: p.b,
})).sort((a, b) => b.date.getTime() - a.date.getTime());
