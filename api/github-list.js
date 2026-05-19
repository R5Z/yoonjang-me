export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.VITE_GITHUB_OWNER;
  const repo = process.env.VITE_GITHUB_REPO;

  try {
    const r = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/src/content/posts`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!r.ok) {
      const err = await r.json();
      return res.status(500).json({ error: err.message });
    }

    const files = await r.json();
    const mdFiles = files
      .filter((f) => f.name.endsWith('.md'))
      .map((f) => ({ name: f.name, path: f.path }));

    return res.status(200).json({ files: mdFiles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}