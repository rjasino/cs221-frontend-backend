import { validationErrorResponse } from "../utils/responseUtils.js";

/**
 * Generic validation middleware factory
 * @param {Function} validationFunction - Function that returns {isValid, errors}
 */
export const validate = (validationFunction) => {
  return (req, res, next) => {
    const { isValid, errors } = validationFunction(req.body);

    if (!isValid) {
      return validationErrorResponse(res, errors);
    }

    next();
  };
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (req, res, next) => {
  // Trim string values in body
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  next();
};

export default { validate, sanitizeInput };
