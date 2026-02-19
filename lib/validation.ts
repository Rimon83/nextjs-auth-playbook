export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, error: "Name can only contain letters" };
  }
  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }
   if (password.length > 32) {
     return { isValid: false, error: "Password must be at most 32 characters" };
   }
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain a lowercase letter",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain an uppercase letter",
    };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, error: "Password must contain a number" };
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain a special character",
    };
  }
  return { isValid: true };
}

export function matchedPassword(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (password.localeCompare(confirmPassword) !== 0) {
    return {
      isValid: false,
      error: "Passwords do not match",
    };
  }
  return { isValid: true };
}

// Validate the signin passaword function
export function validateSignInPassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  if (password.length < 8 || password.length > 32) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }
  return {isValid: true}

}