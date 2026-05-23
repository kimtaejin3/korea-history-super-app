#!/usr/bin/env tsx
/**
 * 기존 데이터를 위키미디어 썸네일로 보강.
 *
 * - 새 항목은 추가하지 않음. 이미 있는 record에 photo 필드만 추가.
 * - 위키 페이지가 없거나 thumbnail이 없으면 photo 필드 추가 안 함 (그대로 둠).
 * - 이미 photo가 있는 record는 건너뜀 (재호출 방지).
 *
 * 실행:
 *   npm run enrich:photos
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const UA = 'footsteps-app-curator/0.1 (educational use)';

type WikiSummary = {
  title?: string;
  extract?: string;
  type?: string;
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
  content_urls?: { desktop?: { page?: string } };
};

type Photo = {
  url: string;
  width?: number;
  height?: number;
  credit: string;
  sourceUrl?: string;
  license: 'cc-by-sa' | 'public-domain' | 'kogl-1' | 'kogl-4' | 'unknown';
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWikipedia(slug: string): Promise<WikiSummary | null> {
  const url = `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    return (await res.json()) as WikiSummary;
  } catch {
    return null;
  }
}

async function searchWikipedia(query: string): Promise<string | null> {
  const url = `https://ko.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=3&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const data = (await res.json()) as [string, string[], string[], string[]];
    return data[1]?.[0] ?? null;
  } catch {
    return null;
  }
}

async function findThumbnail(name: string): Promise<{ photo: Photo; wikipediaUrl: string } | null> {
  // 1차: 이름 그대로 직접 lookup
  const slug = name.replace(/\s+/g, '_');
  let summary = await fetchWikipedia(slug);

  // 2차: 검색 fallback
  if (!summary || !summary.thumbnail) {
    const foundTitle = await searchWikipedia(name);
    if (foundTitle) {
      summary = await fetchWikipedia(foundTitle.replace(/\s+/g, '_'));
    }
  }

  if (!summary || !summary.thumbnail) return null;
  // disambiguation 페이지 제외
  if (summary.type === 'disambiguation') return null;

  const thumb = summary.thumbnail;
  const original = summary.originalimage;
  const wikipediaUrl = summary.content_urls?.desktop?.page ?? '';

  return {
    photo: {
      url: thumb.source,
      width: original?.width ?? thumb.width,
      height: original?.height ?? thumb.height,
      credit: 'Wikimedia Commons',
      sourceUrl: wikipediaUrl,
      license: 'cc-by-sa', // 일반적인 가정; 정확한 라이선스는 추후 Commons API로 보강
    },
    wikipediaUrl,
  };
}

// ─── 메인 ─────────────────────────────────────────────────
type RecordWithPhoto = Record<string, unknown> & {
  name: string;
  photo?: Photo;
  wikipediaUrl?: string | null;
};

type EnrichOptions = {
  /** 이 키워드 중 하나가 location/region에 포함된 항목만 처리 */
  regionKeywords?: string[];
  /** 처리할 최대 건수 (이미 photo 있는 건 제외) */
  maxCount?: number;
};

function matchesRegion(r: RecordWithPhoto, keywords: string[]): boolean {
  if (!keywords.length) return true;
  const loc =
    (r as { location?: string | null }).location ??
    (r as { region?: string | null }).region ??
    '';
  return keywords.some((k) => loc.includes(k));
}

async function enrichFile(filePath: string, opts: EnrichOptions = {}) {
  console.log(`\n▶ ${filePath}`);
  if (opts.regionKeywords?.length) {
    console.log(`  지역 필터: ${opts.regionKeywords.join(', ')}`);
  }
  if (opts.maxCount) console.log(`  최대 ${opts.maxCount}건`);

  const raw = await fs.readFile(filePath, 'utf-8');
  const data: RecordWithPhoto[] = JSON.parse(raw);

  let added = 0;
  let skipped = 0;
  let notFound = 0;
  let processed = 0;

  for (let i = 0; i < data.length; i++) {
    const r = data[i]!;
    if (r.photo) {
      skipped++;
      continue;
    }
    if (opts.regionKeywords?.length && !matchesRegion(r, opts.regionKeywords)) continue;
    if (opts.maxCount && processed >= opts.maxCount) break;

    processed++;
    process.stdout.write(
      `  [${processed}${opts.maxCount ? '/' + opts.maxCount : ''}] ${r.name.slice(0, 32).padEnd(34)} ... `
    );
    await sleep(400);
    const found = await findThumbnail(r.name);
    if (!found) {
      console.log('-');
      notFound++;
      continue;
    }
    r.photo = found.photo;
    if (!r.wikipediaUrl) r.wikipediaUrl = found.wikipediaUrl;
    added++;
    console.log('OK');

    // 중간 저장 (긴 작업이라 안전망)
    if (processed % 20 === 0) {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }
  }

  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`▶ 추가 ${added}건 / 스킵 ${skipped}건 / 없음 ${notFound}건`);
}

async function main() {
  const target = process.argv[2] || 'curated';

  if (target === 'curated') {
    await enrichFile(path.join(ROOT, 'data', 'heritage-curated.json'));
  } else if (target === 'openapi-nearby') {
    // 사용자 인근 (충남/대전/세종/경기) 만 보강
    await enrichFile(path.join(ROOT, 'data', 'heritage.json'), {
      regionKeywords: ['충청남도', '대전', '세종', '경기도'],
    });
  } else if (target === 'openapi-all') {
    // 전체 OpenAPI 보강 (오래 걸림)
    await enrichFile(path.join(ROOT, 'data', 'heritage.json'));
  } else {
    console.error(`알 수 없는 타겟: ${target}`);
    console.error('사용: tsx scripts/enrich-photos.ts [curated|openapi-nearby|openapi-all]');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
