import { readdir } from 'node:fs/promises';

interface Entry {
  id: string;
  data: Record<string, unknown>;
}

export async function validateSeries(entries: Entry[], root: URL) {
  const files = await readdir(new URL('src/content/series/', root));
  const seriesIds = new Set(files.filter(file => file.endsWith('.json')).map(file => file.slice(0, -5)));
  const orders = new Map<string, Map<number, string>>();

  // draft도 검사해 공개로 전환하는 시점에 숨은 데이터 오류가 드러나지 않게 합니다.
  for (const { id, data } of entries) {
    if (!data.series) continue;
    const series = data.series as { id: string };
    if (!seriesIds.has(series.id)) {
      throw new Error(`${id}: 시리즈 "${series.id}"에 해당하는 JSON 파일이 없습니다.`);
    }
    const order = data.seriesOrder as number;
    const seriesOrders = orders.get(series.id) ?? new Map<number, string>();
    const existing = seriesOrders.get(order);
    if (existing !== undefined) {
      throw new Error(`${id}: 시리즈 "${series.id}"의 ${order}번이 "${existing}"과 중복됩니다.`);
    }
    seriesOrders.set(order, id);
    orders.set(series.id, seriesOrders);
  }
}
