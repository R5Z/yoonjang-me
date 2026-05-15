import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import path from 'path';

const urlMap = JSON.parse(readFileSync('./scripts/url-map.json', 'utf-8'));
const POSTS_DIR = './src/content/posts';

// 키를 마크다운 경로 형식으로 변환
// "public/images/posts/foo.jpg" → "/images/posts/foo.jpg"
const normalizedMap = {};
for (const [key, url] of Object.entries(urlMap)) {
  const normalized = '/' + key.replace(/^public\//, '');
  normalizedMap[normalized] = url;
}

function collectMdFiles(dir, result = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      collectMdFiles(fullPath, result);
    } else if (entry.endsWith('.md')) {
      result.push(fullPath);
    }
  }
  return result;
}

const mdFiles = collectMdFiles(POSTS_DIR);
console.log(`총 ${mdFiles.length}개 마크다운 파일 처리`);

for (const filePath of mdFiles) {
  let content = readFileSync(filePath, 'utf-8');
  let changed = false;

  for (const [originalPath, blobUrl] of Object.entries(normalizedMap)) {
    if (content.includes(originalPath)) {
      content = content.replaceAll(originalPath, blobUrl);
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ 치환됨: ${filePath}`);
  }
}

console.log('완료');