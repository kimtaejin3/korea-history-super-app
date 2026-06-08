/**
 * heritage 데이터 + 사진 bulk import.
 *
 * 사용:
 *   npm run heritage:import <manifest.json>
 *
 * manifest 형식 — 자세한 건 USAGE 문자열 참고. 사진은 manifest 기준 상대 경로.
 * 사전 조건: `mc alias set local ...` 완료 + MinIO 컨테이너 가동 중.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { dirname, extname, resolve } from 'path';
import { getDb, schema } from '../src/db/client.js';

type CoverPhoto = NonNullable<typeof schema.heritage.$inferInsert.coverPhoto>;

type ImportEntry = {
  id?: string;
  name: string;
  region: string;
  era: string;
  period: string;
  tag: string;
  accent: string;
  summary: string;
  story: string;
  lat?: number;
  lon?: number;
  coords?: { x: number; y: number };
  visits?: number;
  nearbyStamps?: number;
  source?: string;
  ccbaKdcd?: number;
  designation?: string;
  designationDate?: string;
  classification?: string;
  quiz?: {
    q: string;
    options: string[];
    answer: number;
    hint: string;
  };
  photo?: {
    file: string;
    width?: number;
    height?: number;
    credit?: string;
    desc?: string;
  };
};

const USAGE = `사용: npm run heritage:import <manifest.json>

manifest 형식 (JSON 배열):
[
  {
    "name": "현충사",               // 필수
    "region": "충청남도",           // 필수
    "era": "조선",                  // 필수
    "period": "1706",               // 필수
    "tag": "사당",                  // 필수
    "accent": "#E5563E",            // 필수
    "summary": "이순신 장군을…",     // 필수
    "story": "선조 39년…",          // 필수
    "lat": 36.7891,                 // 선택
    "lon": 127.0145,                // 선택
    "photo": {                      // 선택, 있으면 MinIO 업로드 + coverPhoto 연결
      "file": "./photos/img.jpg",   //   manifest 기준 상대 경로
      "width": 1920,
      "height": 1080,
      "credit": "직접 촬영",
      "desc": "..."
    },
    "id": "조선-현충사"              // 선택, 생략 시 "<era>-<name 슬러그>" 자동 생성
  }
]

선택 추가 필드: coords, visits, nearbyStamps, source, ccbaKdcd, designation,
designationDate, classification, quiz.
`;

function slugify(s: string): string {
  return s
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '');
}

function makeId(entry: ImportEntry): string {
  if (entry.id) return entry.id;
  return `${slugify(entry.era)}-${slugify(entry.name)}`;
}

function uploadPhoto(localAbs: string, bucketKey: string): void {
  execSync(`mc cp "${localAbs}" "local/heritage/${bucketKey}"`, { stdio: 'pipe' });
}

async function main() {
  const manifestArg = process.argv[2];
  if (!manifestArg) {
    console.error(USAGE);
    process.exit(1);
  }

  const manifestPath = resolve(manifestArg);
  if (!existsSync(manifestPath)) {
    console.error(`manifest 파일 없음: ${manifestPath}`);
    process.exit(1);
  }

  let entries: ImportEntry[];
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (!Array.isArray(parsed)) throw new Error('JSON 최상위가 배열이어야 합니다');
    entries = parsed as ImportEntry[];
  } catch (err) {
    console.error(`manifest 파싱 실패: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

  const manifestDir = dirname(manifestPath);
  const db = getDb();

  console.log(`${entries.length}개 항목 import 시작\n`);
  let ok = 0;
  let failed = 0;

  for (const entry of entries) {
    const id = makeId(entry);
    try {
      let coverPhoto: CoverPhoto | null = null;

      if (entry.photo?.file) {
        const localAbs = resolve(manifestDir, entry.photo.file);
        if (!existsSync(localAbs)) {
          throw new Error(`photo 파일 없음: ${localAbs}`);
        }
        const bucketKey = `${id}${extname(entry.photo.file)}`;
        uploadPhoto(localAbs, bucketKey);
        coverPhoto = {
          path: bucketKey,
          ...(entry.photo.width !== undefined && { width: entry.photo.width }),
          ...(entry.photo.height !== undefined && { height: entry.photo.height }),
          ...(entry.photo.credit !== undefined && { credit: entry.photo.credit }),
          ...(entry.photo.desc !== undefined && { desc: entry.photo.desc }),
        };
      }

      const values: typeof schema.heritage.$inferInsert = {
        id,
        name: entry.name,
        region: entry.region,
        era: entry.era,
        period: entry.period,
        tag: entry.tag,
        accent: entry.accent,
        summary: entry.summary,
        story: entry.story,
        lat: entry.lat,
        lon: entry.lon,
        coords: entry.coords,
        visits: entry.visits ?? 0,
        nearbyStamps: entry.nearbyStamps ?? 0,
        source: entry.source ?? 'curated',
        ccbaKdcd: entry.ccbaKdcd,
        designation: entry.designation,
        designationDate: entry.designationDate,
        classification: entry.classification,
        quiz: entry.quiz ?? null,
        coverPhoto,
        updatedAt: new Date(),
      };

      await db
        .insert(schema.heritage)
        .values(values)
        .onConflictDoUpdate({
          target: schema.heritage.id,
          set: { ...values, id: undefined },
        });

      ok++;
      console.log(`✓ ${entry.name} → id=${id}${coverPhoto ? ' (사진 업로드)' : ''}`);
    } catch (err) {
      failed++;
      console.error(`✗ ${id || entry.name || '(id 없음)'}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\n완료: ${ok} 성공 / ${failed} 실패`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
