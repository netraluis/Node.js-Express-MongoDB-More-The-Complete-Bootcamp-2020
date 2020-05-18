const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tour schema necesita nombre'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'tour schema necesita duracion'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'tour schema necesita max group'],
  },
  difficulty: {
    type: String,
    required: [true, 'tour schema necesita max dificulty'],
  },
  ratingAverage: {
    type: Number,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'tour schema necesita precio'],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'tour schema necesita description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'tour schema necesita imagenCover'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDate: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
