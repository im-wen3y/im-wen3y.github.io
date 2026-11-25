import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortPublishedPosts, getTags, getPostsByTag, getPostNavigation, formatDate, tagSlug, postHref } from '../src/lib/posts.ts';
import type { Post } from '../src/lib/posts.ts';

function post(id: string, date: string, extra: Partial<Post['data']> = {}): Post {
  return { id, collection: 'blog', data: { title: id, description: id, publishedDate: new Date(date), tags: ['React'], draft: false, ...extra } };
}

test('최신순 정렬, 동률 순서, draft 제외 및 원본 보존', () => {
  const posts = [post('b', '2026-09-06'), post('hidden', '2026-10-01', { draft: true }), post('a', '2026-09-06'), post('latest', '2026-09-09')];
  assert.deepEqual(sortPublishedPosts(posts).map(post => post.id), ['latest', 'a', 'b']);
  assert.equal(posts[0]?.id, 'b');
  assert.deepEqual(sortPublishedPosts([]), []);
});

test('날짜는 한국 시간, URL은 파일 id와 태그 규칙 사용', () => {
  assert.equal(formatDate(new Date('2026-09-06T00:00:00+09:00')), '2026.09.06');
  assert.equal(tagSlug('Next.js'), 'next-js');
  assert.equal(tagSlug('TanStack Query'), 'tanstack-query');
  assert.equal(tagSlug('회고'), '회고');
  assert.equal(postHref({ id: 'react/state-queue' }), '/blog/react/state-queue');
});

test('태그 집계와 필터는 draft 제외, 한 글의 태그 중복은 한 번만 집계', () => {
  const posts = [post('a', '2026-09-06', { tags: ['React', 'React', 'Next.js'] }), post('b', '2026-09-09'), post('hidden', '2026-09-10', { draft: true, tags: ['Private'] })];
  assert.deepEqual(getTags(posts), [{ name: 'React', slug: 'react', count: 2 }, { name: 'Next.js', slug: 'next-js', count: 1 }]);
  assert.deepEqual(getPostsByTag(posts, 'next-js').map(post => post.id), ['a']);
  assert.deepEqual(getPostsByTag(posts, 'unknown'), []);
  assert.throws(() => getTags([post('a', '2026-09-06', { tags: ['Next.js', 'next-js'] })]), /겹칩니다/);
});

test('일반 글 이전은 오래된 글, 다음은 최신 글이며 끝은 비어 있음', () => {
  const posts = [post('old', '2026-09-06'), post('new', '2026-09-09'), post('hidden', '2026-09-07', { draft: true })];
  assert.equal(getPostNavigation(posts, 'old').next?.id, 'new');
  assert.equal(getPostNavigation(posts, 'new').prev?.id, 'old');
  assert.equal(getPostNavigation(posts, 'old').prev, undefined);
  assert.equal(getPostNavigation(posts, 'new').next, undefined);
  assert.deepEqual(getPostNavigation(posts, 'hidden'), { prev: undefined, next: undefined });
});

test('시리즈 글은 날짜 대신 공개된 시리즈 순서로 연결하고 시리즈 밖으로 나가지 않음', () => {
  const series = { collection: 'series', id: 'state' } as const;
  const posts = [post('first', '2026-09-09', { series, seriesOrder: 1 }), post('draft', '2026-09-08', { series, seriesOrder: 2, draft: true }), post('third', '2026-09-06', { series, seriesOrder: 3 }), post('outside', '2026-09-10')];
  assert.equal(getPostNavigation(posts, 'first').next?.id, 'third');
  assert.equal(getPostNavigation(posts, 'first').prev, undefined);
  assert.equal(getPostNavigation(posts, 'third').prev?.id, 'first');
  assert.equal(getPostNavigation(posts, 'third').next, undefined);
});
