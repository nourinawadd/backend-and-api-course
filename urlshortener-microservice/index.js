require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { URL } = require('url');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// In-memory URL store
const urls = [];

// POST endpoint to shorten URL
app.post('/api/shorturl', (req, res) => {
  const inputUrl = req.body.url;

  let urlObj;
  try {
    urlObj = new URL(inputUrl);
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  // Validate with DNS lookup
  dns.lookup(urlObj.hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = urls.length + 1;
    urls.push(inputUrl);

    res.json({
      original_url: inputUrl,
      short_url: shortUrl
    });
  });
});

// GET endpoint to redirect
app.get('/api/shorturl/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const originalUrl = urls[id - 1];
  if (!originalUrl) {
    return res.status(404).json({ error: 'No short URL found for given input' });
  }

  res.redirect(originalUrl);
});

// Start server
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
