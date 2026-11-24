import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { validateSeries } from './content/validate-series';

const requiredText = z.string().trim().min(1);
const date = z.union([z.string().trim().min(1), z.date()]).pipe(z.coerce.date());
const blogFiles = glob({ base: './src/content/blog', pattern: '**/*.md' });

const blog = defineCollection({
  loader: {
    name: 'validated-blog',
    async load(context) {
      await blogFiles.load(context);
      await validateSeries(context.store.values(), context.config.root);
    },
  },
  schema: z.object({
    title: requiredText,
    description: requiredText,
    publishedDate: date,
    updatedDate: date.optional(),
    tags: z.array(requiredText).min(1),
    series: reference('series').optional(),
    seriesOrder: z.number().int().positive().optional(),
    draft: z.boolean().default(false),
  }).superRefine((post, context) => {
    if (post.series && post.seriesOrder === undefined) {
      context.addIssue({ code: 'custom', path: ['seriesOrder'], message: '시리즈 글에는 seriesOrder가 필요합니다.' });
    }
    if (!post.series && post.seriesOrder !== undefined) {
      context.addIssue({ code: 'custom', path: ['series'], message: 'seriesOrder를 사용하려면 series가 필요합니다.' });
    }
  }),
});

const series = defineCollection({
  loader: glob({ base: './src/content/series', pattern: '*.json' }),
  schema: z.object({ title: requiredText, description: requiredText }),
});

export const collections = { blog, series };
