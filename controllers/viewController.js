const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utilis/catchAsync');
const AppError = require('../utilis/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
	const tours = await Tour.find();

	res.status(200).render('overview', {
		title: 'All tours'.toUpperCase(),
		tours,
	});
});

exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});

	if (!tour) {
		return next(new AppError('There is no tour with that name.', 404));
	}

	res.status(200).render('tour', {
		title: `${tour.name} Tour`.toUpperCase(),
		tour,
	});
});

exports.getLoginForm = (req, res) => {
	res.status(200).render('login', {
		title: 'Log into your account',
	});
};

exports.getSignUpForm = (req, res) => {
	res.status(200).render('sign-up', {
		title: 'Create Your Account',
	});
};

exports.getAccount = (req, res) => {
	res.status(200).render('account', {
		title: 'Your Account',
	});
};

exports.getMyTours = catchAsync(async (req, res, next) => {
	const booking = await Booking.find({ user: req.user.id });
	// console.log(booking);
	const tourIds = booking.map((el) => el.tour);
	// console.log(tourIds);
	const tours = await Tour.find({ _id: { $in: tourIds } });
	// console.log(tours);

	res.status(200).render('overview', {
		title: 'My tours',
		tours,
		booking,
	});
});

exports.gettAllMyReview = catchAsync(async (req, res, next) => {
	const reviews = await Review.find({ user: req.user.id }).populate('tour');

	// console.log(reviews);

	if (reviews.length === 0) {
		return next(
			new AppError(
				'You are not created reviews yet! Create one to see here...'
			),
			404
		);
	}

	res.status(200).render('myreviews', {
		title: 'My reviews',
		reviews,
	});
});

exports.updateUserData = catchAsync(async (req, res, next) => {
	const updateUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			name: req.body.name,
			email: req.body.email,
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).render('account', {
		title: 'Your Account',
		user: updateUser,
	});
});

exports.getBookingTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});

	const bookedTour = await Booking.find({
		user: req.user.id,
		tour: tour.id,
	});

	// console.log(bookedTour);

	const firstBookedTour = bookedTour[0];
	// console.log('Hey I am tour Id', firstBookedTour.tour.id);
	// console.log('Hey I am user Id', firstBookedTour.user.id);

	res.status(200).render('tour', {
		title: `${tour.name} Tour`.toUpperCase(),
		tour,
		bookedTour,
		firstBookedTour,
	});
});

exports.getMyBilledPaidTours = catchAsync(async (req, res, next) => {
	const booking = await Booking.find({ user: req.user.id });
	// console.log(booking);
	const tourIds = booking.map((el) => el.tour);
	// console.log(tourIds);
	const tours = await Tour.find({ _id: { $in: tourIds } });
	// console.log(tours);

	res.status(200).render('tourBilled', {
		title: 'My tours',
		tours,
		booking,
	});
});
