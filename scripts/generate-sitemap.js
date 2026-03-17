import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://yoonjang.me';

const staticPages = ['', 'posts', 'about'];

const postDirectory = path.join(__dirname, '../content/posts');
const postFiles = fs.readdirSync(postDirectory);

const postPages = postFiles.map(fileName => {
  const content = fs.readFileSync(path.join(postDirectory, fileName), 'utf8');
  const slugMatch = content.match(/slug:\s*["']?([^"'\n]+)["']?/);
  return slugMatch ? `post/${slugMatch[1]}` : `post/${fileName.replace('.md', '')}`;
});

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

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
console.log('✅ sitemap.xml 생성 완료!');