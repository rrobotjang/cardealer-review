/**
 * reviews-api
 * Express + Mongoose microservice storing dealership reviews in MongoDB.
 * Review creation is protected by JWT (shared secret across services).
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Review = require('./models/review');
const { verifyToken } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/reviews';

app.use(cors());
app.use(express.json());

// Fail fast on DB operations when Mongo is unreachable (no 30s buffering hangs)
mongoose.set('bufferCommands', false);

mongoose
  .connect(MONGO_URL, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.get('/health', (req, res) => {
  const db = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', db });
});

app.get('/reviews/dealer/:id', async (req, res) => {
  try {
    const dealership = Number(req.params.id);
    const reviews = await Review.find({ dealership });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/review', verifyToken, async (req, res) => {
  const { name, dealership, review } = req.body;
  if (!name || !dealership || !review) {
    return res.status(400).json({ error: 'name, dealership and review are required' });
  }
  try {
    const doc = await Review.create({
      name,
      dealership: Number(dealership),
      review,
      purchase: Boolean(req.body.purchase),
      purchase_date: req.body.purchase_date || null,
      car_make: req.body.car_make || null,
      car_model: req.body.car_model || null,
      car_year: req.body.car_year ? Number(req.body.car_year) : null,
      sentiment: req.body.sentiment || null,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`reviews-api listening on port ${PORT}`);
});
