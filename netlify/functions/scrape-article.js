// netlify/functions/scrape-article.js
const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event) => {
  const url = new URLSearchParams(event.queryStringParameters).get('url');

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing ?url= parameter' }),
    };
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BookmarkScraper/1.0)',
      },
    });

    const $ = cheerio.load(response.data);

    const title = $('title').first().text().trim();
    const articleText = $('article').text();
    const mainImage =
      $('article picture').first().find('img').attr('src') ||
      $('article img').first().attr('src');

    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      null;

    return {
      statusCode: 200,
      body: JSON.stringify({ title, description, articleText, mainImage }),
    };
  } catch (error) {
    console.error('[SCRAPER ERROR]', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch page', details: error.message }),
    };
  }
};
