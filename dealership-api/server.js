/**
 * dealership-api
 * Express microservice serving the static dealership catalog.
 * Part of the "Best Cars" dealership review application (IBM capstone architecture).
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dealerships = require('./data/dealerships.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/dealerships', (req, res) => {
  res.json(dealerships);
});

app.get('/dealerships/:id', (req, res) => {
  const id = Number(req.params.id);
  const dealership = dealerships.find((d) => d.id === id);
  if (!dealership) {
    return res.status(404).json({ error: 'Dealership not found' });
  }
  res.json(dealership);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`dealership-api listening on port ${PORT}`);
});
