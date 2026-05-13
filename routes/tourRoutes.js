const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();
//router.param('id', tourController.checkID);
//const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

//POST /tour/234fad4/reviews. - Nested Route
router.use('/:tourId/reviews', reviewRouter); //This is a middleware that will be used for all routes that start with /:tourId/reviews, so it will be used for both GET and POST requests to /:tourId/reviews, and it will be used for all routes that start with /:tourId/reviews, so it will be used for both GET and POST requests to /:tourId/reviews, and it will be used for all routes that start with /:tourId/reviews, so it will be used for both GET and POST requests to /:tourId/reviews, and it will be used for all routes that start with /:tourId/reviews, so it will be used for both GET and POST requests to /:tourId/reviews, and it will be used for all routes that start with /:tourId/reviews, so it will be used for both GET and POST requests to /:

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'tour-guide'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
