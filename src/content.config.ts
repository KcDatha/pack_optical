import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Field shape mirrors the Sanity Post schema (BUILD_PLAN Phase 4) so the later CMS move changes nothing visible.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    category: z.string(),
    author: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    targetKeyword: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    relatedService: z.string(),
    source: z.string().optional(),
  }),
});
export const collections = { blog };
