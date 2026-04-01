/**
 * ErrorHandler - Global Express error handling middleware.
 * Normalises Mongoose errors into readable API responses.
 */
class ErrorHandler {
  static handle(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message    = err.message    || 'Internal Server Error';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(err.errors).map((e) => e.message).join(', ');
    }

    // MongoDB duplicate key
    if (err.code === 11000) {
      statusCode = 400;
      const field = Object.keys(err.keyValue)[0];
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    }

    // Mongoose invalid ObjectId
    if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format.';
    }

    if (process.env.NODE_ENV === 'development') {
      console.error(`[${req.method}] ${req.path} →`, err);
    }

    res.status(statusCode).json({
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
}

module.exports = ErrorHandler.handle;
