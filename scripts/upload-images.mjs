import { put } from '@vercel/blob';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';

const envFile = readFileSync('.env.local', 'utf-8');
for (const line of envFile.split('\n')) {
  const [key, ...val] = line.split('=');
  if (key && val.length) process.env[key.trim()] = val.join('=').trim();
}

const IMAGE_DIR = './public/images/posts';
const urlMap = {};

function collectFilesArr(dir, result = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      collectFilesArr(fullPath, result);
    } else {
      const ext = path.extname(entry).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        result.push({ fullPath, filename: entry });
      }
    }
  }
  return result;
}

const files = collectFilesArr(IMAGE_DIR);
console.log(`총 ${files.length}개 이미지 업로드 시작`);

for (const { fullPath, filename } of files) {
  const buffer = readFileSync(fullPath);
  const blob = await put(filename, buffer, {
    access: 'public',
    addRandomSuffix: false,
  });

  const relativePath = fullPath.replace('./public', '').replace(/\\/g, '/');
  urlMap[relativePath] = blob.url;
  console.log(`✓ ${relativePath} → ${blob.url}`);
}

writeFileSync('./scripts/url-map.json', JSON.stringify(urlMap, null, 2));
console.log('url-map.json 저장 완료');