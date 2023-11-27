const Review = require('./../models/reviewModel');
const catchAsync = require('./../utilis/catchAsync');
const factory = require('./handlerFactory');

const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

const getAllReview = factory.getAll(Review);
const getReview = factory.getOne(Review);
// const createReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);

const createReview = catchAsync(async (req, res, next) => {
  // Extract necessary data from the request body
  const { review, rating, tour, user } = req.body;

  // console.log('Request Body:', req.body);
  // console.log('Hey i am tour Id:', tour);
  // console.log('Hey i am user Id:', user);
  // Create the review associating it with the tour using tourId
  const doc = await Review.create({
    review,
    rating,
    tour, // Ensure that tourId is used to associate the review with a tour
    user
  });

  // console.log(tour, user);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

module.exports = {
  getAllReview: getAllReview,
  createReview: createReview,
  deleteReview: deleteReview,
  updateReview: updateReview,
  setTourUserIds: setTourUserIds,
  getReview: getReview
};
