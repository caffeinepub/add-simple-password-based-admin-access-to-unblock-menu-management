/**
 * Sanitizes error messages for user display by extracting the core message
 * and removing noisy prefixes or technical details
 */
export function sanitizeError(error: unknown): string {
  if (!error) {
    return 'An unknown error occurred';
  }

  // Handle string errors
  if (typeof error === 'string') {
    return cleanErrorMessage(error);
  }

  // Handle Error objects
  if (error instanceof Error) {
    return cleanErrorMessage(error.message);
  }

  // Handle objects with message property
  if (typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') {
      return cleanErrorMessage(message);
    }
  }

  // Fallback: stringify the error
  try {
    return cleanErrorMessage(JSON.stringify(error));
  } catch {
    return 'An error occurred';
  }
}

/**
 * Cleans up error message by removing common prefixes and technical noise
 */
function cleanErrorMessage(message: string): string {
  // Remove common IC error prefixes
  let cleaned = message
    .replace(/^Error:\s*/i, '')
    .replace(/^Reject text:\s*/i, '')
    .replace(/^Call failed:\s*/i, '')
    .replace(/^Canister error:\s*/i, '')
    .trim();

  // If the message is too long, truncate it
  if (cleaned.length > 200) {
    cleaned = cleaned.substring(0, 197) + '...';
  }

  return cleaned || 'An error occurred';
}
