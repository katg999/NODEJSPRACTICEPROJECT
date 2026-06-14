const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const cookieParser = require('cookie-parser');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//GLOBAL MIDDLEWARE
//Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP HEADERS
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://api.mapbox.com',
        'https://cdnjs.cloudflare.com',
      ],
      scriptSrcElem: [
        "'self'",
        'https://api.mapbox.com',
        'https://cdnjs.cloudflare.com',
      ],
      styleSrc: [
        "'self'",
        'https://api.mapbox.com',
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
      ],
      workerSrc: ["'self'", 'blob:'],
      connectSrc: [
        "'self'",
        'https://*.mapbox.com',
        'https://events.mapbox.com',
        'https://cdnjs.cloudflare.com',
        'ws:',
        'wss:',
        'http://127.0.0.1:3001',
      ],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com'],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
        'https://fonts.googleapis.com',
      ],
    },
  }),
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

console.log(process.env.NODE_ENV);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //how we use middleware
app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitisation against NoSQL query injecttion against XRS
app.use(mongoSanitize());

app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//Should defined as top level code
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//app.get('/api/v1/tours', getAllTours);
//app.post('/api/v1/tours', createTour);
//app.get('/api/v1/tours/:id', getTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

//mounting our routers

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
