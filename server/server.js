// server.js
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5001;

// Built-in JSON parser middleware
app.use(express.json());

// Custom CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-api-key'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Base URL for the ReadMe API
const APIBaseURL = 'https://dash.readme.com/api/v1';

// GET /api/categories - Retrieve a list of "guide" type categories
app.get('/api/categories', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  console.log('Received API key:', apiKey);

  if (!apiKey) {
    return res.status(400).json({ error: 'Missing API key' });
  }

  try {
    const response = await fetch(`${APIBaseURL}/categories`, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Error fetching categories' });
    }

    const data = await response.json();

    // Filter categories to only include those with type "guide"
    const guideCategories = data.filter(category => category.type === 'guide');

    res.json(guideCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/categories/:slug/docs - Retrieve documents for a specific category
app.get('/api/categories/:slug/docs', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const { slug } = req.params;
  console.log(`Fetching docs for category: ${slug} with API key: ${apiKey}`);

  if (!apiKey) {
    return res.status(400).json({ error: 'Missing API key' });
  }

  try {
    const response = await fetch(`${APIBaseURL}/categories/${slug}/docs`, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Error fetching documents' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/docs/:slug - Update a document's slug
app.put('/api/docs/:slug', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const originalSlug = req.params.slug;
  const { slug: newSlug } = req.body;
  console.log(
    `Updating document: ${originalSlug} to new slug: ${newSlug} with API key: ${apiKey}`
  );

  if (!apiKey) {
    return res.status(400).json({ error: 'Missing API key' });
  }

  if (!newSlug) {
    return res.status(400).json({ error: 'Missing new slug in request body' });
  }

  try {
    const response = await fetch(`${APIBaseURL}/docs/${originalSlug}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug: newSlug }),
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Error updating document' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
