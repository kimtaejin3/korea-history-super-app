/**
 * 큐레이션 사진(MinIO)을 heritage row에 연결.
 *
 * 사전 조건: 파일이 MinIO 버킷에 이미 업로드되어 있어야 함.
 *   mc cp ./photo.jpg local/heritage/<path>
 *
 * 사용:
 *   npm run heritage:set-photo <placeId> <path-in-bucket> [--width N] [--height N] [--credit "..."] [--desc "..."]
 *
 * 사진 연결 해제 (위키 사진으로 fallback):
 *   npm run heritage:set-photo <placeId> --clear
 */

import { eq } from 'drizzle-orm';
import { getDb, schema } from '../src/db/client.js';

type Args = {
  placeId: string;
  path?: string;
  clear: boolean;
  width?: number;
  height?: number;
  credit?: string;
  desc?: string;
};

function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === undefined) continue;
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (key === 'clear') {
        flags.clear = 'true';
      } else {
        const next = argv[i + 1];
        if (next !== undefined) {
          flags[key] = next;
          i++;
        }
      }
    } else {
      positional.push(arg);
    }
  }
  const placeId = positional[0];
  if (!placeId) throw new Error('placeId 인자가 필요합니다');
  return {
    placeId,
    path: positional[1],
    clear: flags.clear === 'true',
    width: flags.width ? Number(flags.width) : undefined,
    height: flags.height ? Number(flags.height) : undefined,
    credit: flags.credit,
    desc: flags.desc,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const db = getDb();

  if (args.clear) {
    const result = await db
      .update(schema.heritage)
      .set({ coverPhoto: null, updatedAt: new Date() })
      .where(eq(schema.heritage.id, args.placeId))
      .returning({ id: schema.heritage.id });
    if (result.length === 0) {
      console.error(`heritage ${args.placeId} 못 찾음`);
      process.exit(1);
    }
    console.log(`✓ ${args.placeId} coverPhoto 해제 → 위키 fallback`);
    return;
  }

  if (!args.path) {
    console.error('사용법: heritage:set-photo <placeId> <path-in-bucket> [옵션]');
    console.error('또는: heritage:set-photo <placeId> --clear');
    process.exit(1);
  }

  const result = await db
    .update(schema.heritage)
    .set({
      coverPhoto: {
        path: args.path,
        ...(args.width !== undefined && { width: args.width }),
        ...(args.height !== undefined && { height: args.height }),
        ...(args.credit !== undefined && { credit: args.credit }),
        ...(args.desc !== undefined && { desc: args.desc }),
      },
      updatedAt: new Date(),
    })
    .where(eq(schema.heritage.id, args.placeId))
    .returning({ id: schema.heritage.id });

  if (result.length === 0) {
    console.error(`heritage ${args.placeId} 못 찾음`);
    process.exit(1);
  }
  console.log(`✓ ${args.placeId} coverPhoto → heritage/${args.path}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
