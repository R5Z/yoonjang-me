export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: 'filename required' });

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.VITE_GITHUB_OWNER;
  const repo = process.env.VITE_GITHUB_REPO;
  const path = `src/content/posts/${filename}`;

  try {
    // SHA 조회
    const getRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!getRes.ok) {
      const err = await getRes.json();
      return res.status(500).json({ error: err.message });
    }
    const { sha } = await getRes.json();

    // 삭제
    const delRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `delete: ${filename}`,
          sha,
        }),
      }
    );

    if (!delRes.ok) {
      const err = await delRes.json();
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}