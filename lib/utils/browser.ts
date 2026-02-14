/**
 * Utility functions for browser compatibility, especially for Microsoft Edge
 */

/**
 * Safely set an item in localStorage
 * @param key The key to set
 * @param value The value to set
 * @returns True if successful, false otherwise
 */
export function safeLocalStorageSetItem(key: string, value: string): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
      return true;
    }
  } catch (error) {
    console.warn('localStorage not available or failed:', error);
  }
  return false;
}

/**
 * Safely get an item from localStorage
 * @param key The key to get
 * @returns The value if found, null otherwise
 */
export function safeLocalStorageGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.warn('localStorage not available or failed:', error);
  }
  return null;
}

/**
 * Safely remove an item from localStorage
 * @param key The key to remove
 * @returns True if successful, false otherwise
 */
export function safeLocalStorageRemoveItem(key: string): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
      return true;
    }
  } catch (error) {
    console.warn('localStorage not available or failed:', error);
  }
  return false;
}

/**
 * Check if the current browser is Microsoft Edge
 * @returns True if Edge, false otherwise
 */
export function isEdgeBrowser(): boolean {
  if (typeof window === 'undefined' || !window.navigator) {
    return false;
  }
  return window.navigator.userAgent.indexOf('Edg') > -1;
}

/**
 * Get browser-specific cache control headers
 * @returns Object with cache control headers
 */
export function getCacheControlHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (isEdgeBrowser()) {
    headers['Cache-Control'] = 'no-cache';
    headers['Pragma'] = 'no-cache';
  }
  
  return headers;
}