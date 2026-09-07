import Parser from 'rss-parser';
import { blogroll } from '../data/blogroll';

const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; yoonjang-me-blogroll/1.0; +https://yoonjang.me)',
  },
});

function formatRelative(date) {
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return '오늘';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
}

export async function getBlogrollWithUpdates() {
  return Promise.all(
    blogroll.map(async (site) => {
      if (!site.rss) return { ...site, lastUpdated: null };
      try {
        const feed = await parser.parseURL(site.rss);
        const latest = feed.items?.[0];
        const dateStr = latest?.isoDate || latest?.pubDate;
        if (!dateStr) return { ...site, lastUpdated: null };
        return { ...site, lastUpdated: formatRelative(new Date(dateStr)) };
      } catch (e) {
        console.error(`RSS 가져오기 실패 (${site.name}):`, e.message);
        return { ...site, lastUpdated: null };
      }
    })
  );
}