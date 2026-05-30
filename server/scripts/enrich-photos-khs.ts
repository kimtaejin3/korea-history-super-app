#!/usr/bin/env tsx
/**
 * 국가유산청 OpenAPI로 heritage.json 사진 보강 (키 불필요).
 *
 * 1. 종목별(ccbaKdcd) 전국 목록 API → name → {kdcd, asno, ctcd} 맵
 * 2. heritage.json 각 항목을 이름으로 매칭
 * 3. 이미지 API → 첫 imageUrl + 설명 + 공공누리 유형
 * 4. photo 필드 저장 (출처: 국가유산청)
 *
 * 실행: npm run enrich:photos:khs
 *
 * 출처: https://www.khs.go.kr/cha/SearchKindOpenapiList.do / SearchImageOpenapi.do
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const BASE = 'https://www.khs.go.kr/cha';
const KDCDS = [11, 12, 13, 15, 16, 17, 18, 79];
const UA = 'footsteps-app-curator/0.1 (educational use)';

// 공공누리 유형 매핑 (imageNuri A/B/C/D → 제1~4유형)
const NURI_LICENSE: Record<string, 'kogl-1' | 'kogl-2' | 'kogl-3' | 'kogl-4'> = {
  A: 'kogl-1',
  B: 'kogl-2',
  C: 'kogl-3',
  D: 'kogl-4',
};

type Match = { kdcd: string; asno: string; ctcd: string };
type Photo = {
  url: string;
  credit: string;
  sourceUrl?: string;
  license: string;
  desc?: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function pick(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return m ? m[1]!.trim() : null;
}

function parseItems(xml: string): string[] {
  return xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
}

// ─── 1. 종목별 전국 목록 → name 매칭 맵 ──────────────────────
async function buildNameMap(): Promise<Map<string, Match>> {
  const map = new Map<string, Match>();
  for (const kdcd of KDCDS) {
    let page = 1;
    let total = Infinity;
    let collected = 0;
    while (collected < total) {
      const url = `${BASE}/SearchKindOpenapiList.do?ccbaKdcd=${kdcd}&pageUnit=500&pageIndex=${page}`;
      let xml: string;
      try {
        xml = await fetchText(url);
      } catch (e) {
        console.log(`  목록 실패 kdcd=${kdcd} page=${page}: ${(e as Error).message}`);
        break;
      }
      if (total === Infinity) {
        total = parseInt(pick(xml, 'totalCnt') ?? '0', 10);
      }
      const items = parseItems(xml);
      if (items.length === 0) break;
      for (const it of items) {
        const name = pick(it, 'ccbaMnm1');
        const asno = pick(it, 'ccbaAsno');
        const ctcd = pick(it, 'ccbaCtcd');
        if (name && asno && ctcd) {
          map.set(name, { kdcd: String(kdcd), asno, ctcd });
        }
      }
      collected += items.length;
      page++;
      await sleep(150);
    }
    console.log(`  ccbaKdcd=${kdcd}: 누적 맵 ${map.size}건`);
  }
  return map;
}

// ─── 3. 이미지 API → 첫 사진 ────────────────────────────────
async function fetchFirstImage(m: Match): Promise<Photo | null> {
  const url = `${BASE}/SearchImageOpenapi.do?ccbaKdcd=${m.kdcd}&ccbaAsno=${m.asno}&ccbaCtcd=${m.ctcd}`;
  const xml = await fetchText(url);
  const items = parseItems(xml);
  if (items.length === 0) return null;
  const first = items[0]!;
  const imageUrl = pick(first, 'imageUrl');
  if (!imageUrl) return null;
  const desc = pick(first, 'ccimDesc');
  const nuri = pick(first, 'imageNuri') ?? '';
  return {
    url: imageUrl.replace(/^http:/, 'https:'),
    credit: '국가유산청',
    sourceUrl: `https://www.heritage.go.kr/`,
    license: NURI_LICENSE[nuri] ?? 'kogl-1',
    desc: desc ?? undefined,
  };
}

// ─── 메인 ─────────────────────────────────────────────────
type HeritageRecord = { name: string; location?: string | null; photo?: Photo | null };

async function main() {
  console.log('▶ 1) 국가유산청 종목별 전국 목록 수집...');
  const nameMap = await buildNameMap();
  console.log(`▶ 매칭 맵 총 ${nameMap.size}건\n`);

  const filePath = path.join(ROOT, 'data', 'heritage.json');
  const heritage: HeritageRecord[] = JSON.parse(await fs.readFile(filePath, 'utf-8'));

  const targets = heritage.filter((r) => nameMap.has(r.name));
  console.log(`▶ 2) 이름 매칭: ${targets.length}/${heritage.length}건`);
  console.log('▶ 3) 이미지 API 호출 (throttle 250ms)...\n');

  let added = 0;
  let noImage = 0;
  let processed = 0;

  for (const r of heritage) {
    const m = nameMap.get(r.name);
    if (!m) continue;
    processed++;
    try {
      await sleep(250);
      const photo = await fetchFirstImage(m);
      if (photo) {
        r.photo = photo;
        added++;
      } else {
        noImage++;
      }
    } catch {
      noImage++;
    }
    if (processed % 50 === 0) {
      await fs.writeFile(filePath, JSON.stringify(heritage, null, 2));
      console.log(`  ... ${processed}/${targets.length} 처리 (사진 ${added})`);
    }
  }

  await fs.writeFile(filePath, JSON.stringify(heritage, null, 2));
  console.log(
    `\n▶ 완료: 사진 ${added}건 추가 / 이미지 없음 ${noImage}건 / 매칭 ${targets.length}건`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
