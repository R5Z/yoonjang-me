import fs from 'fs';
import path from 'path';
import fm from 'front-matter';

const postsDir = path.join(process.cwd(), 'content/posts');

const processPost = (fileName, rawContent) => {
  if (!rawContent) return null;
  try {
    const { attributes, body } = fm(rawContent);
    const fileNameId = fileName.replace('.md', '');
    const id = attributes.slug || fileNameId;
    const tagList = attributes.tags
      ? attributes.tags.split(',').map(t => t.trim())
      : [];
    return {
      id,
      title: attributes.title || '',
      date: attributes.date || '',
      imgUrl: attributes.imgUrl || null,
      tags: tagList,
      category: tagList.length > 0 ? tagList[0] : 'log',
      content: body,
    };
  } catch (e) {
    console.error(`${fileName} - 파싱 에러:`, e);
    return null;
  }
};

export function getAllPosts() {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  return files
    .map(fileName => {
      const raw = fs.readFileSync(path.join(postsDir, fileName), 'utf-8');
      return processPost(fileName, raw);
    })
    .filter(Boolean)
    .sort((a, b) => {
      const dateA = new Date(a.date.replace(/\. /g, '-').replace(/\.$/, ''));
      const dateB = new Date(b.date.replace(/\. /g, '-').replace(/\.$/, ''));
      return dateB - dateA;
    });
}

export function getAllTags() {
  return Array.from(
    new Set(getAllPosts().flatMap(p => p.tags).map(t => t.toUpperCase()))
  ).sort();
}

export function getPostById(id) {
  const posts = getAllPosts();
  const i = posts.findIndex(p => String(p.id) === String(id));
  if (i === -1) return null;
  return {
    post: posts[i],
    prevPost: i < posts.length - 1 ? posts[i + 1] : null,
    nextPost: i > 0 ? posts[i - 1] : null,
  };
}