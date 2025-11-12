/**
 * Email validation
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Username validation (alphanumeric, underscore, 3-20 chars)
 */
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Password validation (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)
 */
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate registration data
 */
export const validateRegistration = (data) => {
  const errors = [];

  if (!data.username) {
    errors.push("Username is required");
  } else if (!isValidUsername(data.username)) {
    errors.push(
      "Username must be 3-20 characters and contain only letters, numbers, and underscores"
    );
  }

  if (!data.email) {
    errors.push("Email is required");
  } else if (!isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (!data.password) {
    errors.push("Password is required");
  } else if (!isValidPassword(data.password)) {
    errors.push(
      "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"
    );
  }

  if (!data.first_name || data.first_name.trim() === "") {
    errors.push("First name is required");
  }

  if (!data.last_name || data.last_name.trim() === "") {
    errors.push("Last name is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate login data
 */
export const validateLogin = (data) => {
  const errors = [];

  if (!data.username || data.username.trim() === "") {
    errors.push("Username is required");
  }

  if (!data.password || data.password.trim() === "") {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate customer update data
 */
export const validateCustomerUpdate = (data) => {
  const errors = [];

  if (data.username !== undefined && !isValidUsername(data.username)) {
    errors.push("Invalid username format");
  }

  if (data.email !== undefined && !isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (data.password !== undefined && !isValidPassword(data.password)) {
    errors.push("Invalid password format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  validateRegistration,
  validateLogin,
  validateCustomerUpdate,
};
