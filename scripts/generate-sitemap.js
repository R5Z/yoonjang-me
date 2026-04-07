import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://yoonjang.me'; 

const postDirectory = path.resolve(__dirname, '../src/content/posts');
const publicDirectory = path.resolve(__dirname, '../public');

const staticPages = ['', 'posts', 'about'];

let postPages = [];

if (fs.existsSync(postDirectory)) {
  const postFiles = fs.readdirSync(postDirectory);
  
  postPages = postFiles
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const content = fs.readFileSync(path.join(postDirectory, fileName), 'utf8');
      
      // 슬러그 추출 (YAML frontmatter에서 slug: 찾기)
      const slugMatch = content.match(/slug:\s*["']?([^"'\n]+)["']?/);
      let slug = slugMatch ? slugMatch[1] : fileName.replace('.md', '');

      // 슬러그 정규화
      slug = slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')         // 공백을 하이픈으로
        .replace(/[^\w-]/g, '')       // 영문, 숫자, 하이픈 제외 삭제
        .replace(/-+/g, '-');         // 중복 하이픈 제거

      return `post/${slug}`;
    });
} else {
  console.error('❌ 포스트 폴더를 찾을 수 없습니다:', postDirectory);
  process.exit(1);
}

// 모든 페이지 결합 및 중복 제거
const allPages = [...new Set([...staticPages, ...postPages])];

// XML 생성
const sitemapItems = allPages
  .map(page => {
    // URL 조립 (중복 슬래시 방지 및 끝 슬래시 제거)
    const urlPath = page === '' ? '' : `/${page}`;
    const fullUrl = `${BASE_URL}${urlPath}`;
    
    return `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  })
  .join('');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapItems}
</urlset>`;

// 파일 쓰기
if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory, { recursive: true });
}

fs.writeFileSync(path.join(publicDirectory, 'sitemap.xml'), sitemap);
console.log('✅ sitemap.xml 생성 완료!');
console.log(`총 ${allPages.length}개의 페이지가 포함되었습니다.`);