import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://yoonjang.me';
const SITE_TITLE = 'yoonjang.me';
const SITE_DESCRIPTION = '';

const postDirectory = path.resolve(__dirname, '../content/posts');
const publicDirectory = path.resolve(__dirname, '../public');

function escapeXml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeSlug(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-');
}

if (!fs.existsSync(postDirectory)) {
  console.error('❌ 포스트 폴더를 찾을 수 없습니다:', postDirectory);
  process.exit(1);
}

const postFiles = fs.readdirSync(postDirectory).filter(f => f.endsWith('.md'));

const posts = postFiles
  .map(fileName => {
    const content = fs.readFileSync(path.join(postDirectory, fileName), 'utf8');

    const titleMatch = content.match(/title:\s*["']?(.*?)["']?\s*(\n|$)/);
    const dateMatch = content.match(/date:\s*["']?(.*?)["']?\s*(\n|$)/);
    const slugMatch = content.match(/slug:\s*["']?([^"'\n]+)["']?/);

    if (!titleMatch || !dateMatch) return null;

    const title = titleMatch[1];
    const rawDate = dateMatch[1].replace(/\.$/, '');
    const parsedDate = new Date(rawDate.replace(/\.\s*/g, '-'));
    if (isNaN(parsedDate.getTime())) return null;

    const rawSlug = slugMatch ? slugMatch[1] : fileName.replace('.md', '');
    const slug = normalizeSlug(rawSlug);

    return { title, date: parsedDate, slug };
  })
  .filter(Boolean)
  .sort((a, b) => b.date - a.date)
  .slice(0, 20); // 최신 20개만

const itemsXml = posts
  .map(post => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${BASE_URL}/post/${post.slug}</link>
    <guid>${BASE_URL}/post/${post.slug}</guid>
    <pubDate>${post.date.toUTCString()}</pubDate>
  </item>`)
  .join('');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE_TITLE)}</title>
  <link>${BASE_URL}</link>
  <description>${escapeXml(SITE_DESCRIPTION)}</description>
  <language>ko-KR</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${itemsXml}
</channel>
</rss>`;

if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory, { recursive: true });
}

fs.writeFileSync(path.join(publicDirectory, 'rss.xml'), rss);
console.log('✅ rss.xml 생성 완료!');
console.log(`총 ${posts.length}개의 포스트가 포함되었습니다.`);