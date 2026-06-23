export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, content } = req.body;

  if (!filename || !content) {
    return res.status(400).json({ error: 'filename and content required' });
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const path = `content/posts/${filename}`;

  // 기존 파일 SHA 확인 (수정 시 필요)
  let sha;
  try {
    const checkRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (checkRes.ok) {
      const data = await checkRes.json();
      sha = data.sha;
    }
  } catch {}

  const body = {
    message: `post: ${filename}`,
    content: Buffer.from(content).toString('base64'),
    ...(sha && { sha }),
  };

  const commitRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!commitRes.ok) {
    const err = await commitRes.json();
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json({ ok: true });
}