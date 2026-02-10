import fm from "front-matter";

// content/posts의 모든 마크다운 파일 import
const postFiles = import.meta.glob('../content/posts/*.md', { 
  query: '?raw', 
  eager: true 
});

const processPost = (path, rawContent) => {
  if (!rawContent) return null;

  try {
    const id = path.split('/').pop().replace('.md', '');
    const { attributes, body } = fm(rawContent);
    
    // 태그 문자열을 배열로 변환
    const tagList = attributes.tags 
      ? attributes.tags.split(',').map(t => t.trim()) 
      : [];

    return {
      id,
      title: attributes.title,
      date: attributes.date, 
      imgUrl: attributes.imgUrl,
      tags: tagList,
      // 배열의 첫 번째 항목을 카테고리로 지정 (없으면 'log'를 기본값으로)
      category: tagList.length > 0 ? tagList[0] : "log", 
      content: body,
    };
  } catch (e) {
    console.error(`Path: ${path} - 파싱 에러:`, e);
    return null;
  }
};

// 데이터를 날짜 최신순으로 정렬
export const postsData = Object.entries(postFiles)
  .map(([path, content]) => processPost(path, content.default || content))
  .filter(Boolean)
  .sort((a, b) => {
    const dateA = new Date(a.date.replace(/\. /g, '-'));
    const dateB = new Date(b.date.replace(/\. /g, '-'));
    return dateB - dateA; // 내림차순(최신순) 정렬
  });

console.log("데이터 처리 및 날짜순 정렬 완료:", postsData);