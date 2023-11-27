const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utilis/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');
const reviewRouter = require('./routes/review-routes');
const bookingRouter = require('./routes/booking-routes');
const viewRouter = require('./routes/view-routes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// app.use(helmet());

// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
	'https://unpkg.com/',
	'https://tile.openstreetmap.org',
	'https://*.cloudflare.com/',
	'https://cdnjs.cloudflare.com/ajax/libs/axios/',
	'https://*.stripe.com',
	'https://*.mapbox.com',
	'https://m.stripe.network',
	'https:',
	'http:',
	'data:',
];

const styleSrcUrls = [
	'https://unpkg.com/',
	'https://tile.openstreetmap.org',
	'https://fonts.googleapis.com/',
	'https:',
];
const connectSrcUrls = [
	'https://unpkg.com',
	'https://tile.openstreetmap.org',
	'https://*.cloudflare.com/',
	'http://127.0.0.1:3000',
	'https://*.mapbox.com',
	'https://bundle.js:*',
	'https://*.stripe.com',
	'ws://127.0.0.1:*/',
	'data:',
];
const fontSrcUrls = [
	'fonts.googleapis.com',
	'fonts.gstatic.com',
	'https:',
	'data:',
];
const frameSrcUrls = ['https://*.stripe.com'];

const workerSrcUrls = [
	'https://*.tiles.mapbox.com',
	'https://api.mapbox.com',
	'https://events.mapbox.com',
	'https://m.stripe.network',
];

app.use(
	helmet({
		crossOriginEmbedderPolicy: false,
	})
);

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
			baseUri: ["'self'"],
			connectSrc: ["'self'", "'unsafe-inline'", 'blob:', ...connectSrcUrls],
			scriptSrc: ["'self'", 'blob:', ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", 'data:', 'blob:', ...workerSrcUrls],
			objectSrc: ["'none'"],
			imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
			fontSrc: ["'self'", ...fontSrcUrls],
			childSrc: ["'self'", 'blob:'],
			frameSrc: ["'self'", ...frameSrcUrls],
			formAction: ["'self'"],
			upgradeInsecureRequests: [],
		},
	})
);

// 1:) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 100,
	message: 'Too many requests in this IP, Please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// DATA sanitazation against nosql query injection
app.use(mongoSanitize());

// DATA sanitazation against XSS
app.use(xss());

app.use(
	hpp({
		whitelist: [
			'duration',
			'ratingsAverage',
			'ratingsQuantity',
			'maxGroupSize',
			'difficulty',
			'price',
		],
	})
);

app.use(compression());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	// console.log(req.cookies);
	next();
});

// 3:) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler.globalError);
// 4:) LIVE SERVER

module.exports = app;
