import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://yoonjang.me';

const postDirectory = path.resolve(__dirname, '../content/posts');
const postDirectoryEn = path.resolve(__dirname, '../content/posts/en'); // 추가
const publicDirectory = path.resolve(__dirname, '../public');

const staticPages = ['', 'posts', 'about'];

function normalizeSlug(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-');
}

let postEntries = [];

if (fs.existsSync(postDirectory)) {
  const postFiles = fs.readdirSync(postDirectory).filter(f => f.endsWith('.md'));

  // 영문 파일 목록 (Admin이 en/slug.md로 커밋하므로 파일명 = slug 원본)
  const enSlugs = fs.existsSync(postDirectoryEn)
    ? new Set(fs.readdirSync(postDirectoryEn).filter(f => f.endsWith('.md')).map(f => f.replace('.md', '')))
    : new Set();

  postEntries = postFiles.map(fileName => {
    const content = fs.readFileSync(path.join(postDirectory, fileName), 'utf8');
    const slugMatch = content.match(/slug:\s*["']?([^"'\n]+)["']?/);
    const rawSlug = slugMatch ? slugMatch[1] : fileName.replace('.md', '');
    const slug = normalizeSlug(rawSlug);
    const hasEn = enSlugs.has(rawSlug);

    return {
      loc: `${BASE_URL}/post/${slug}`,
      alternates: hasEn
        ? [
            { hreflang: 'ko', href: `${BASE_URL}/post/${slug}` },
            { hreflang: 'en', href: `${BASE_URL}/en/post/${rawSlug}` },
          ]
        : null,
    };
  });

  // 영문 페이지 자체 항목
  enSlugs.forEach(enSlug => {
    postEntries.push({
      loc: `${BASE_URL}/en/post/${enSlug}`,
      alternates: [
        { hreflang: 'en', href: `${BASE_URL}/en/post/${enSlug}` },
        { hreflang: 'ko', href: `${BASE_URL}/post/${normalizeSlug(enSlug)}` },
      ],
    });
  });
} else {
  console.error('❌ 포스트 폴더를 찾을 수 없습니다:', postDirectory);
  process.exit(1);
}

const staticEntries = staticPages.map(page => ({
  loc: page === '' ? BASE_URL : `${BASE_URL}/${page}`,
  alternates: null,
}));

const allEntries = [...staticEntries, ...postEntries];

const sitemapItems = allEntries
  .map(entry => {
    const alternatesXml = entry.alternates
      ? entry.alternates
          .map(a => `\n    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
          .join('')
      : '';
    return `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${entry.loc === BASE_URL ? '1.0' : '0.8'}</priority>${alternatesXml}
  </url>`;
  })
  .join('');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapItems}
</urlset>`;

if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory, { recursive: true });
}

fs.writeFileSync(path.join(publicDirectory, 'sitemap.xml'), sitemap);
console.log('✅ sitemap.xml 생성 완료!');
console.log(`총 ${allEntries.length}개의 URL이 포함되었습니다.`);