const express = require('express');
const router = express.Router({ mergeParams: true }); // merge params to be able to use the camp id for a different route;
const catchAsync = require('../utils/catchAsync'); 
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

// Review routes
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;