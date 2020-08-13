const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(reviewController.createReview);

router
  .route('/:id')
  .get(authController.protect)
  .patch(reviewController.updateReview)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    reviewController.deleteReview
  );

module.exports = router;
