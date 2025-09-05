// Utility to build request headers, e.g. add auth, content-type, etc.
export function buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    // Add auth or other headers here
    ...customHeaders,
  };
}
