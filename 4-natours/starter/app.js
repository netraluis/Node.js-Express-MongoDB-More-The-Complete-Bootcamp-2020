const express = require('express');

const morgan = require('morgan');

const rateLimit = require('express-rate-limit');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//-----------------------------------------1) GLOBAL Middleware------------------------------
// console.log(process.env.NODE_ENV);
//variables globales
//security http headers
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limiter requues flom same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in a hour!',
});

app.use('/api', limiter);
//esto es para que se pueda usar req.body es un middleware con limite de peso
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL query injection {"gt":""}
app.use(mongoSanitize());
//Data sanitization against
app.use(xss());
//prevent parameter polution sort duplicated
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//servir páginas estáticas desde el folder
app.use(express.static(`${__dirname}/public`));

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  console.log('hello from middleware');
  next();
});

//-----------------------------------------1)Routes------------------------------
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//creamos un middleware para cuando se coloca una url erronea
app.use('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
