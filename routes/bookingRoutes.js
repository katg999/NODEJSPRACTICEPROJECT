const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router(); //This is important because we want to be able to access the tourId from the tourRoutes, because we want to be able to create a review for a specific tour, and we need the tourId for that. So we need to merge the params from the tourRoutes with the params from the reviewRoutes, so that we can access the tourId in the reviewController when we create a review.

router.get(
  '/checkout-session/:tourID',
  authController.protect,
  bookingController.getCheckoutSession,
);

module.exports = router;
