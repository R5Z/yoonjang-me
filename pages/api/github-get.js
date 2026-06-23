export default async function handler(req, res) {
  const { filename } = req.query;
  if (!filename) return res.status(400).json({ error: 'filename required' });

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const path = `content/posts/${filename}`;

  try {
    const r = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!r.ok) {
      const err = await r.json();
      return res.status(500).json({ error: err.message });
    }

    const data = await r.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    return res.status(200).json({ content, sha: data.sha });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}