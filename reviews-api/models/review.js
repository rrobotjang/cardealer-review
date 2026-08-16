const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dealership: { type: Number, required: true },
    review: { type: String, required: true },
    purchase: { type: Boolean, default: false },
    purchase_date: { type: String, default: null },
    car_make: { type: String, default: null },
    car_model: { type: String, default: null },
    car_year: { type: Number, default: null },
    sentiment: { type: String, default: null },
  },
  { collection: 'reviews', timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
