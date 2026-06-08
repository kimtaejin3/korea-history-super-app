#!/usr/bin/env tsx
/**
 * 위키피디아 REST API에서 시도지정·중요 사적의 메타데이터를 수집.
 *
 * 실행:
 *   node scripts/fetch-curated-heritage.mjs
 *
 * 동작:
 *   1. TARGETS 배열의 각 위키 페이지 제목으로 summary API 호출
 *   2. extract 첫 문장에서 한자/시대/지정 번호 정규식 파싱
 *   3. WGS84 좌표 그대로 사용
 *   4. data/heritage-curated.json 저장
 *
 * 타겟 추가 방법:
 *   - 위키피디아에서 해당 문화재 페이지 검색
 *   - URL 끝의 슬러그를 wiki 필드에 넣음 (공백은 _ 로)
 *   - kdcd는 추정 종목 코드 (21=시도유형, 23=시도기념물 등)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── 큐레이션 타겟 ────────────────────────────────────────
// 시도지정 위주, 우리 앱 컨셉(역사 장소·유물)에 맞는 것만.
// 종목 추정: 21=시도유형, 23=시도기념물, 24=시도민속, 79=등록
const TARGETS = [
  // 평택 (사용자 요청)
  { wiki: '팽성읍_객사', kdcd: 21, theme: '관아' },
  { wiki: '대동법_시행_기념비', kdcd: 21, theme: '세제개혁' },

  // 향교 (조선 지방 교육기관)
  { wiki: '강릉향교', kdcd: 21, theme: '향교' },
  { wiki: '안성향교', kdcd: 31, theme: '향교' },
  { wiki: '양주향교', kdcd: 21, theme: '향교' },
  { wiki: '청주향교', kdcd: 21, theme: '향교' },
  { wiki: '영동향교', kdcd: 21, theme: '향교' },
  { wiki: '경주향교', kdcd: 21, theme: '향교' },
  { wiki: '전주향교', kdcd: 13, theme: '향교' }, // 사적 379호
  { wiki: '남원향교', kdcd: 21, theme: '향교' },
  { wiki: '나주향교', kdcd: 13, theme: '향교' }, // 사적 승격

  // 객사 (관아 영빈관)
  { wiki: '강릉_임영관', kdcd: 11, theme: '객사' }, // 국보 51호
  { wiki: '안성_객사_정청', kdcd: 12, theme: '객사' }, // 보물

  // 동헌 (지방 관아)
  { wiki: '김제동헌', kdcd: 21, theme: '동헌' },
  { wiki: '청주_동헌', kdcd: 21, theme: '동헌' },
  { wiki: '충주_동헌', kdcd: 21, theme: '동헌' },

  // 비석 / 기념비
  { wiki: '북관대첩비', kdcd: 12, theme: '비석' },
  { wiki: '척화비', kdcd: 23, theme: '비석' },

  // 근대 사적 (시도지정 또는 등록)
  { wiki: '인천우체국', kdcd: 79, theme: '근대건축' },
  { wiki: '문화역서울_284', kdcd: 13, theme: '근대건축' }, // 구 서울역, 사적 284호

  // 항일 사적
  { wiki: '효창공원', kdcd: 13, theme: '항일' }, // 사적 330호
  { wiki: '노량진_사육신_묘역', kdcd: 23, theme: '추모' },

  // 능묘
  { wiki: '정릉_(서울_정릉동)', kdcd: 13, theme: '왕릉' }, // 사적 208호

  // 충주 (동헌 대체)
  { wiki: '충주_관아공원', kdcd: 23, theme: '동헌' },
];

// ─── 위키 API ─────────────────────────────────────────────
const UA = 'footsteps-app-curator/0.1 (educational use)';

type WikiSummary = {
  title: string;
  extract?: string;
  type?: string;
  coordinates?: { lat: number; lon: number };
  content_urls?: { desktop?: { page?: string } };
};

async function fetchWikipedia(slug: string): Promise<WikiSummary | null> {
  const url = `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  return (await res.json()) as WikiSummary;
}

/** opensearch API로 가장 일치하는 페이지 제목 찾기. 실패 시 null. */
async function searchWikipedia(query: string): Promise<string | null> {
  const url = `https://ko.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=5&format=json&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const data = (await res.json()) as [string, string[], string[], string[]];
  const titles = data[1] || [];
  return titles[0] || null;
}

/** 직접 lookup 실패 시 검색 fallback */
async function fetchWithFallback(slug: string): Promise<WikiSummary | null> {
  const direct = await fetchWikipedia(slug);
  if (direct && direct.extract && direct.type !== 'disambiguation') return direct;

  // 슬러그를 검색어로 (_ → 공백)
  const query = slug
    .replace(/_/g, ' ')
    .replace(/\(.+\)/g, '')
    .trim();
  const foundTitle = await searchWikipedia(query);
  if (!foundTitle) return null;

  return await fetchWikipedia(foundTitle.replace(/ /g, '_'));
}

// ─── extract 파싱 ─────────────────────────────────────────
const REGIONS = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

const ERAS = [
  '고조선',
  '삼국시대',
  '고구려',
  '백제',
  '신라',
  '통일신라',
  '발해',
  '고려시대',
  '조선시대',
  '조선 후기',
  '조선 초기',
  '대한제국시대',
  '대한제국',
  '일제강점기',
  '근대',
  '현대',
];

function parseExtract(title: string, extract: string) {
  // 시대
  let era = null;
  for (const e of ERAS) {
    if (extract.includes(e)) {
      era = e === '조선 후기' || e === '조선 초기' ? '조선시대' : e;
      if (era === '대한제국') era = '대한제국시대';
      break;
    }
  }

  // 지정 정보: "경기도 유형문화재 제137호"
  const designationMatch = extract.match(
    new RegExp(
      `(${REGIONS.join('|')})(?:의)?\\s*(유형문화재|문화재자료|기념물|민속문화재|민속문화유산|무형문화재|등록문화재|등록문화유산|사적|보물|국보)\\s*제?\\s*(\\d+)호`
    )
  );

  // 광역 시도
  let region = designationMatch?.[1] || null;
  if (!region) {
    for (const r of REGIONS) {
      if (extract.includes(r)) {
        region = r;
        break;
      }
    }
  }

  // 첫 문장만 요약으로
  const summary = extract.split('. ')[0] + '.';

  return {
    name: title,
    era,
    region,
    designationType: designationMatch?.[2] || null,
    designationNo: designationMatch?.[3] ? parseInt(designationMatch[3], 10) : null,
    summary,
    story: extract,
  };
}

// ─── 메인 ─────────────────────────────────────────────────
async function main() {
  console.log(`▶ Fetching ${TARGETS.length} curated targets from Wikipedia...\n`);

  const results: Record<string, unknown>[] = [];
  const failures: Record<string, unknown>[] = [];

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (const t of TARGETS) {
    process.stdout.write(`  ${t.wiki.padEnd(28)} ... `);
    try {
      await sleep(300); // 위키 API rate limit 회피
      const data = await fetchWithFallback(t.wiki);
      if (!data || !data.extract) {
        console.log('NO DATA');
        failures.push({ ...t, reason: 'no extract' });
        continue;
      }
      if (data.type === 'disambiguation') {
        console.log('DISAMBIGUATION');
        failures.push({ ...t, reason: 'disambiguation page' });
        continue;
      }

      const parsed = parseExtract(data.title, data.extract);
      const record = {
        source: 'curated',
        ccbaKdcd: t.kdcd,
        theme: t.theme,
        ...parsed,
        coords: data.coordinates ? { lat: data.coordinates.lat, lon: data.coordinates.lon } : null,
        wikipediaUrl: data.content_urls?.desktop?.page || null,
      };
      results.push(record);

      const meta = [
        record.era || '시대?',
        record.region || '지역?',
        record.coords ? '좌표✓' : '좌표X',
      ].join(' · ');
      console.log(`OK (${meta})`);
    } catch (e) {
      const msg = (e as Error).message;
      console.log(`FAIL: ${msg}`);
      failures.push({ ...t, reason: msg });
    }
  }

  console.log(`\n▶ Total: ${results.length}건 성공 / ${failures.length}건 실패`);

  const outPath = path.join(ROOT, 'data', 'heritage-curated.json');
  await fs.writeFile(outPath, JSON.stringify(results, null, 2));
  console.log(`▶ Wrote ${outPath}`);

  if (failures.length > 0) {
    console.log('\n실패 목록:');
    for (const f of failures) {
      console.log(`  - ${f.wiki}: ${f.reason}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
