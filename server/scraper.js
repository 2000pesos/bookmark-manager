const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3400;

app.use(cors());

app.get('/api/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing ?url= parameter' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BookmarkScraper/1.0)',
      },
    });

    const $ = cheerio.load(response.data);

    const title = $('title').first().text().trim();

    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      null;

    res.json({ title, description });
  } catch (error) {
    console.error('[SCRAPER ERROR]', error.message);
    res.status(500).json({ error: 'Failed to fetch page', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Scraper running at http://localhost:${PORT}`);
});
