// Environment configuration
export const env = {
  // API Configuration
  // Default API base URL points to production kiosk API domain.
  // You can override this in `.env.local` with NEXT_PUBLIC_API_BASE_URL.
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://apikiosk.aramestan.sabzevar.ir',

  // App Configuration
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Aramestan Kiosk',

  // Development settings
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Type-safe environment keys
export type EnvKey = keyof typeof env;
