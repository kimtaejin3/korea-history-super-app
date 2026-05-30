#!/usr/bin/env tsx
/**
 * 국가유산 GIS OpenAPI에서 모든 종목 데이터를 가져와 data/heritage.json으로 저장.
 *
 * 실행:
 *   npm run fetch:heritage
 *   (또는 npx tsx scripts/fetch-heritage.ts)
 *
 * 출처: https://gis-heritage.go.kr/openapi/xmlService/spca.do?ccbaKdcd=<code>
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import proj4 from 'proj4';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// gis-heritage는 EPSG:5179 (Korea 2000 / Unified CS, UTM-K)를 사용
proj4.defs(
  'EPSG:5179',
  '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m'
);

function toWgs84(cnXStr: string | null, cnYStr: string | null) {
  if (!cnXStr || !cnYStr) return null;
  // 콤마로 여러 좌표 있는 경우 첫 번째만
  const x = parseFloat(cnXStr.split(',')[0]!);
  const y = parseFloat(cnYStr.split(',')[0]!);
  if (Number.isNaN(x) || Number.isNaN(y)) return null;
  try {
    const [lon, lat] = proj4('EPSG:5179', 'EPSG:4326', [x, y]);
    if (!isFinite(lat) || !isFinite(lon)) return null;
    return { lat: Number(lat.toFixed(6)), lon: Number(lon.toFixed(6)) };
  } catch {
    return null;
  }
}

// 수집 대상: 유물(artifacts) + 역사적 장소(historical places)만.
// 제외: 16=천연기념물(노목·동물·암석), 17=국가무형유산(공연·기능)
// 15=명승은 일단 포함 (역사문화경관·문화경관 등이 섞여 있음)
const CODES = [11, 12, 13, 15, 18, 79];

// 명승(15) 내부 추가 필터 — "자연경관"만인 항목은 제외, "문화경관"·"역사" 포함만 keep
type HeritageRecord = ReturnType<typeof parseRecord>;

function isCollectible(record: HeritageRecord) {
  if (record.ccbaKdcd !== 15) return true;
  const c = record.classification || '';
  // 명승 중에서는 문화/역사 관련만 수집 대상
  return c.includes('문화경관') || c.includes('역사');
}
const BASE = 'https://gis-heritage.go.kr/openapi/xmlService/spca.do';

function pick(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m && m[1] ? m[1].trim() : null;
}

function parseRecord(block: string, ccbaKdcd: number) {
  const cnX = pick(block, 'cnX');
  const cnY = pick(block, 'cnY');
  const wgs = toWgs84(cnX, cnY);
  return {
    ccbaKdcd,
    name: pick(block, 'ccbaMnm'),
    admin: pick(block, 'ccbaAdmin'),
    designatedDate: pick(block, 'ccbaAsdt'),
    era: pick(block, 'ccceName'),
    category: pick(block, 'ccmaName'),
    cnX,
    cnY,
    lat: wgs?.lat ?? null,
    lon: wgs?.lon ?? null,
    designation: pick(block, 'crltsnoNm'),
    classification: pick(block, 'ctgrname'),
    sn: pick(block, 'sn'),
    location: pick(block, 'vlocName'),
  };
}

async function fetchCode(code: number) {
  const url = `${BASE}?ccbaKdcd=${code}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ccbaKdcd=${code}`);
  }
  const xml = await res.text();
  const blocks = xml.match(/<spca>[\s\S]*?<\/spca>/g) || [];
  return blocks.map((b) => parseRecord(b, code));
}

async function main() {
  console.log(`▶ Fetching ${CODES.length} codes...`);
  const all: HeritageRecord[] = [];
  for (const code of CODES) {
    process.stdout.write(`  ccbaKdcd=${String(code).padStart(2)} ... `);
    try {
      const records = await fetchCode(code);
      const filtered = records.filter(isCollectible);
      all.push(...filtered);
      const dropped = records.length - filtered.length;
      console.log(`${filtered.length}건${dropped > 0 ? ` (필터로 ${dropped}건 제외)` : ''}`);
    } catch (e) {
      console.log(`FAIL (${(e as Error).message})`);
    }
  }

  console.log(`\n▶ Total: ${all.length}건`);

  const outPath = path.join(ROOT, 'data', 'heritage.json');
  await fs.writeFile(outPath, JSON.stringify(all, null, 2));
  const stat = await fs.stat(outPath);
  console.log(`▶ Wrote ${outPath}`);
  console.log(`  ${(stat.size / 1024).toFixed(1)}KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
