/**
 * sentiment-analyzer
 * Serverless microservice (IBM Code Engine) performing sentiment analysis
 * on review text using the AFINN-165 word list (npm "sentiment" package).
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Sentiment = require('sentiment');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const analyzer = new Sentiment();

app.get('/', (req, res) => {
  res.json({
    service: 'sentiment-analyzer',
    endpoints: ['POST /analyze'],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/analyze', (req, res) => {
  if (!req.body || typeof req.body.text === 'undefined') {
    return res.status(400).json({ error: 'text is required' });
  }
  const text = req.body.text;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }
  if (text.trim() === '') {
    return res.json({ sentiment: 'neutral' });
  }
  const result = analyzer.analyze(text);
  let sentiment = 'neutral';
  if (result.score > 0) sentiment = 'positive';
  else if (result.score < 0) sentiment = 'negative';
  res.json({ sentiment });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`sentiment-analyzer listening on port ${PORT}`);
});
