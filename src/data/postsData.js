import fm from "front-matter";

// content/posts의 모든 마크다운 파일 import
const postFiles = import.meta.glob('../content/posts/*.md', { 
  query: '?raw', 
  eager: true 
});

const processPost = (path, rawContent) => {
  if (!rawContent) return null;

  try {
    const { attributes, body } = fm(rawContent);
    
    // slug가 있으면 slug를 id로, 없으면 파일명이 id
    const fileNameId = path.split('/').pop().replace('.md', '');
    const id = attributes.slug || fileNameId;
    
    const tagList = attributes.tags 
      ? attributes.tags.split(',').map(t => t.trim()) 
      : [];

    return {
      id,
      title: attributes.title,
      date: attributes.date, 
      imgUrl: attributes.imgUrl,
      tags: tagList,
      category: tagList.length > 0 ? tagList[0] : "log", 
      content: body,
    };
  } catch (e) {
    console.error(`Path: ${path} - 파싱 에러:`, e);
    return null;
  }
};


export const postsData = Object.entries(postFiles)
  .map(([path, content]) => processPost(path, content.default || content))
  .filter(Boolean)
  .sort((a, b) => {
    // 날짜 포맷이 '2026. 02. 05' 형태일 경우를 대비한 안전한 정렬 로직
    const dateA = new Date(a.date.replace(/\. /g, '-').replace(/\.$/, ''));
    const dateB = new Date(b.date.replace(/\. /g, '-').replace(/\.$/, ''));
    return dateB - dateA;
  });