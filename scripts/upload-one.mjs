import { put } from '@vercel/blob';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// .env.local 로드
const envFile = readFileSync('.env.local', 'utf-8');
for (const line of envFile.split('\n')) {
  const [key, ...val] = line.split('=');
  if (key && val.length) process.env[key.trim()] = val.join('=').trim().replace(/^"|"$/g, '');
}

const filePath = process.argv[2];

if (!filePath) {
  console.error('사용법: node scripts/upload-one.mjs <이미지 경로>');
  process.exit(1);
}

const filename = path.basename(filePath);
const buffer = readFileSync(filePath);

console.log(`업로드 중: ${filename}`);

const blob = await put(filename, buffer, {
  access: 'public',
  addRandomSuffix: false,
});

console.log(`✓ 완료: ${blob.url}`);

// 클립보드 복사 (macOS)
try {
  execSync(`echo "${blob.url}" | pbcopy`);
  console.log('클립보드에 복사됨');
} catch {
  console.log('(클립보드 복사 실패 — URL을 직접 복사하기)');
}