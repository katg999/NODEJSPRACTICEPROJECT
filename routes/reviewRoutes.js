const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true }); //This is important because we want to be able to access the tourId from the tourRoutes, because we want to be able to create a review for a specific tour, and we need the tourId for that. So we need to merge the params from the tourRoutes with the params from the reviewRoutes, so that we can access the tourId in the reviewController when we create a review.

router.use(authController.protect);

router.route('/').get(reviewController.getAllReviews).post(
  authController.restrictTo('user'),
  reviewController.setTourUserIds, //This is a middleware that will set the tour and user ids on the request body, so that we can use them in the createReview controller to create a review for a specific tour and a specific user.
  reviewController.createReview,
);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = router;
