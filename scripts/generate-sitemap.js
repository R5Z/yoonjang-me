import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://yoonjang.me'; 

const postDirectory = path.resolve(__dirname, '../src/content/posts');

const staticPages = ['', 'posts', 'about'];

let postPages = [];
if (fs.existsSync(postDirectory)) {
  const postFiles = fs.readdirSync(postDirectory);
  postPages = postFiles
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const content = fs.readFileSync(path.join(postDirectory, fileName), 'utf8');
      const slugMatch = content.match(/slug:\s*["']?([^"'\n]+)["']?/);
      return slugMatch ? `post/${slugMatch[1]}` : `post/${fileName.replace('.md', '')}`;
    });
} else {
  // 에러 발생 시 경로를 출력하여 디버깅을 돕습니다.
  console.error('❌ 폴더를 찾을 수 없습니다. 현재 계산된 경로:', postDirectory);
  process.exit(1); 
}

const allPages = [...staticPages, ...postPages];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(page => `
    <url>
      <loc>${BASE_URL}/${page}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    </url>`).join('')}
</urlset>`;

// public 폴더는 보통 프로젝트 루트에 있으므로 기존 유지
const publicDirectory = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDirectory)) {
    fs.mkdirSync(publicDirectory);
}

fs.writeFileSync(path.join(publicDirectory, 'sitemap.xml'), sitemap);
console.log('✅ sitemap.xml 생성 완료!');