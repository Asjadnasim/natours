const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/sign-up', authController.isLoggedIn, viewController.getSignUpForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.get(
  '/my-all-reviews',
  authController.protect,
  viewController.gettAllMyReview
);
router.get(
  '/bookedTour/:slug',
  authController.protect,
  viewController.getBookingTour
);
router.get(
  '/my-billed-for-booking-tour',
  authController.protect,
  viewController.getMyBilledPaidTours
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
