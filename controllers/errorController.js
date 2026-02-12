const AppError = require('./../utils/appError');

/**
 * -----------------------------
 * MongoDB / Mongoose Errors
 * -----------------------------
 */

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // MongoDB 4+ provides keyValue
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue ? err.keyValue[field] : null;

  const message = field
    ? `Duplicate field value: "${value}". Please use another value!`
    : 'Duplicate field value. Please use another value!';

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * -----------------------------
 * JWT Errors (Very Common)
 * -----------------------------
 */

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

/**
 * -----------------------------
 * Development Error Response
 * -----------------------------
 */

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

/**
 * -----------------------------
 * Production Error Response
 * -----------------------------
 */

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Log full error internally
  console.error('ERROR 💥', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong.',
  });
};

/**
 * -----------------------------
 * Global Error Middleware
 * -----------------------------
 */

module.exports = (err, req, res, next) => {
  // Default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    // Create shallow copy (avoid mutating original error)
    let error = { ...err };
    error.message = err.message;

    // MongoDB / Mongoose
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    // JWT
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    return sendErrorProd(error, res);
  }
};
