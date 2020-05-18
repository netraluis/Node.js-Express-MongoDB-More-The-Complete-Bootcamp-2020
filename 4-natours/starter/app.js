const express = require('express');

const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//-----------------------------------------1)Middleware------------------------------
console.log(process.env.NODE_ENV);
//variables globales
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//esto es para que se pueda usar req.body es un middleware
app.use(express.json());
//servir páginas estáticas desde el folder
app.use(express.static(`${__dirname}/public`));

//creamos un middleware
app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});

//-----------------------------------------1)Routes------------------------------
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
