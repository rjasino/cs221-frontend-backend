/**
 * Standard API response wrapper
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {Object} data - Response data
 */
export const sendResponse = (
  res,
  statusCode,
  success,
  message,
  data = null
) => {
  const response = {
    success,
    message,
    ...(data && { data }),
  };

  return res.status(statusCode).json(response);
};

/**
 * Success response
 */
export const successResponse = (
  res,
  message,
  data = null,
  statusCode = 200
) => {
  return sendResponse(res, statusCode, true, message, data);
};

/**
 * Error response
 */
export const errorResponse = (res, message, statusCode = 500, data = null) => {
  return sendResponse(res, statusCode, false, message, data);
};

/**
 * Validation error response
 */
export const validationErrorResponse = (res, errors) => {
  return sendResponse(res, 400, false, "Validation failed", { errors });
};

/**
 * Not found response
 */
export const notFoundResponse = (res, message = "Resource not found") => {
  return sendResponse(res, 404, false, message);
};

/**
 * Unauthorized response
 */
export const unauthorizedResponse = (res, message = "Unauthorized access") => {
  return sendResponse(res, 401, false, message);
};

/**
 * Forbidden response
 */
export const forbiddenResponse = (res, message = "Forbidden") => {
  return sendResponse(res, 403, false, message);
};

export default {
  sendResponse,
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
};
