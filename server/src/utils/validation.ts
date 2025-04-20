/**
 * Utility functions for input validation and sanitization
 */

/**
 * Sanitizes a string input to prevent injection attacks
 * Removes potentially dangerous characters and patterns
 *
 * @param input The string input to sanitize
 * @returns A sanitized version of the input string
 */
export const sanitizeInput = (input: any): string => {
  if (input === null || input === undefined) {
    return "";
  }

  // Convert to string if not already
  const str = String(input).trim();

  // Basic sanitization - removes HTML tags, script tags, and SQL injection patterns
  return (
    str
      // Replace HTML tags
      .replace(/<[^>]*>/g, "")
      // Replace potentially dangerous script patterns
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      // Replace SQL injection patterns
      .replace(/['";]/g, "")
      .replace(/--/g, "")
      .replace(/\/\*/g, "")
      .replace(/\*\//g, "")
      .replace(/union\s+select/gi, "")
      .replace(/exec\s*\(/gi, "")
  );
};

/**
 * Validates an email address
 * Uses a comprehensive regex pattern for RFC 5322 compliance
 *
 * @param email The email address to validate
 * @returns Boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return false;

  // More comprehensive email validation than simple regex
  // Covers most valid email formats according to RFC 5322
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Validates a website URL
 * Ensures it has proper protocol and follows URL format
 *
 * @param website The website URL to validate
 * @returns Boolean indicating if the website URL is valid
 */
export const validateWebsite = (website: string): boolean => {
  if (!website) return false;

  try {
    // Use URL constructor for validation
    const url = new URL(website);

    // Check for http or https protocol
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    // Check that hostname has at least one dot (example.com)
    if (!url.hostname.includes(".")) {
      return false;
    }

    // Check for valid TLD (at least 2 characters after last dot)
    const tld = url.hostname.split(".").pop() || "";
    if (tld.length < 2) {
      return false;
    }

    return true;
  } catch (error) {
    // URL constructor throws if URL is invalid
    return false;
  }
};

/**
 * Validates an object ID format
 * Useful for MongoDB ObjectId validation
 *
 * @param id The ID string to validate
 * @returns Boolean indicating if the ID is valid
 */
export const validateObjectId = (id: string): boolean => {
  if (!id) return false;

  // MongoDB ObjectId is a 24-character hex string
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Sanitizes and validates file mime types
 *
 * @param mimeType The mime type to validate
 * @param allowedTypes Array of allowed mime types
 * @returns Boolean indicating if the mime type is allowed
 */
export const validateFileType = (
  mimeType: string,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/jpg"]
): boolean => {
  if (!mimeType) return false;

  return allowedTypes.includes(mimeType.toLowerCase());
};

/**
 * Validates file size against maximum allowed size
 *
 * @param fileSize The file size in bytes
 * @param maxSize Maximum allowed size in bytes (default: 5MB)
 * @returns Boolean indicating if the file size is valid
 */
export const validateFileSize = (
  fileSize: number,
  maxSize: number = 5 * 1024 * 1024
): boolean => {
  if (!fileSize || typeof fileSize !== "number") return false;

  return fileSize > 0 && fileSize <= maxSize;
};
