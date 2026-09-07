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

async function fetchDirect(rssUrl) {
  const feed = await parser.parseURL(rssUrl);
  const latest = feed.items?.[0];
  const dateStr = latest?.isoDate || latest?.pubDate;
  return dateStr ? new Date(dateStr) : null;
}

// 직접 요청 막힐 때 프록시로 재시도
async function fetchViaProxy(rssUrl) {
  const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
  const data = await res.json();
  if (data.status !== 'ok' || !data.items?.length) return null;
  const dateStr = data.items[0].pubDate;
  return dateStr ? new Date(dateStr) : null;
}

export async function getBlogrollWithUpdates() {
  return Promise.all(
    blogroll.map(async (site) => {
      if (!site.rss) return { ...site, lastUpdated: null };

      let date = null;
      try {
        date = await fetchDirect(site.rss);
      } catch (e) {
        console.warn(`직접 요청 실패, 프록시로 재시도 (${site.name}):`, e.message);
        try {
          date = await fetchViaProxy(site.rss);
        } catch (proxyErr) {
          console.error(`프록시 요청도 실패 (${site.name}):`, proxyErr.message);
        }
      }

      return { ...site, lastUpdated: date ? formatRelative(date) : null };
    })
  );
}