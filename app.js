const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//MIDDLEQARE

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
console.log(process.env.NODE_ENV);
app.use(express.json()); //how we use middleware

app.use(express.static(`${__dirname}/public`));

//Should defined as top level code
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

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
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
