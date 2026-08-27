export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, target } = req.body;
  if (!text) return res.status(400).json({ error: 'text가 필요해요' });

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target,
          format: 'html',
        }),
      }
    );
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const translated = data.data.translations[0].translatedText;
    res.status(200).json({ translated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}