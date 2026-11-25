import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export function sortPublishedPosts(posts: Post[]): Post[] {
  return posts.filter(post => !post.data.draft).sort((a, b) =>
    b.data.publishedDate.getTime() - a.data.publishedDate.getTime() || a.id.localeCompare(b.id, 'en'),
  );
}

export async function getPublishedPosts(): Promise<Post[]> {
  const { getCollection } = await import('astro:content');
  return sortPublishedPosts(await getCollection('blog'));
}

export function postHref(post: Pick<Post, 'id'>): string {
  return `/blog/${post.id.split('/').map(encodeURIComponent).join('/')}`;
}

export function formatDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const value = (type: string) => parts.find(part => part.type === type)?.value;
  return `${value('year')}.${value('month')}.${value('day')}`;
}

export function tagSlug(tag: string): string {
  // 한글 태그는 I-10의 제안대로 보존합니다.
  return tag.trim().normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
}

export function getTags(posts: Post[]) {
  const tags = new Map<string, { name: string; slug: string; count: number }>();
  for (const post of sortPublishedPosts(posts)) {
    for (const name of new Set(post.data.tags)) {
      const slug = tagSlug(name);
      if (!slug) throw new Error(`태그 "${name}"의 URL을 만들 수 없습니다.`);
      const existing = tags.get(slug);
      if (existing && existing.name !== name) throw new Error(`태그 "${existing.name}"과 "${name}"의 URL이 겹칩니다.`);
      tags.set(slug, { name, slug, count: (existing?.count ?? 0) + 1 });
    }
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug, 'en'));
}

export function getPostsByTag(posts: Post[], slug: string): Post[] {
  return sortPublishedPosts(posts).filter(post => post.data.tags.some(tag => tagSlug(tag) === slug));
}

export function getPostNavigation(posts: Post[], id: string) {
  const published = sortPublishedPosts(posts);
  const current = published.find(post => post.id === id);
  if (!current) return { prev: undefined, next: undefined };
  if (current.data.series) {
    const seriesId = current.data.series.id;
    const seriesPosts = published.filter(post => post.data.series?.id === seriesId)
      .sort((a, b) => a.data.seriesOrder! - b.data.seriesOrder!);
    const index = seriesPosts.findIndex(post => post.id === id);
    return { prev: seriesPosts[index - 1], next: seriesPosts[index + 1] };
  }
  const index = published.findIndex(post => post.id === id);
  return { prev: published[index + 1], next: published[index - 1] };
}
