import fm from "front-matter";
import testPostRaw from "../content/posts/test-post.md?raw";

const processPost = (id, rawContent) => {
  if (!rawContent) return null;

  try {
    const parsed = fm(rawContent);
    // parsed.attributes: frontmatter 객체
    // parsed.body: 본문
    return {
      id,
      ...parsed.attributes,
      content: parsed.body,
    };
  } catch (e) {
    console.error(`ID: ${id} - front-matter 파싱 에러:`, e);
    return null;
  }
};

const rawPosts = [processPost("test-post", testPostRaw)];
export const postsData = rawPosts.filter(Boolean);