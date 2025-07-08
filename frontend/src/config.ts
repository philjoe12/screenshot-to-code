///root/screenshot-to-code/frontend/src/config.ts

// Determine if we're running in the cloud or locally
// Default to false (local development) if not explicitly set to "true"
export const IS_RUNNING_ON_CLOUD =
  import.meta.env.VITE_IS_RUNNING_ON_CLOUD === "true" || false;

// WebSocket backend URL
// In Docker, use the service name "backend" instead of localhost
export const WS_BACKEND_URL =
  import.meta.env.VITE_WS_BACKEND_URL ||
  (IS_RUNNING_ON_CLOUD ? "wss://pix2code.com/api/ws" : 
  // This lets the browser determine the correct WebSocket URL based on the current page location
  (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/api/ws');

// HTTP backend URL
// In Docker, use the service name "backend" instead of localhost
export const HTTP_BACKEND_URL =
  import.meta.env.VITE_HTTP_BACKEND_URL || 
  (IS_RUNNING_ON_CLOUD ? "https://pix2code.com/api" : "http://backend:7001");

export const PICO_BACKEND_FORM_SECRET =
  import.meta.env.VITE_PICO_BACKEND_FORM_SECRET || null;

// Output the configuration for debugging
console.log("Environment Configuration:");
console.log("IS_RUNNING_ON_CLOUD:", IS_RUNNING_ON_CLOUD);
console.log("WS_BACKEND_URL:", WS_BACKEND_URL);
console.log("HTTP_BACKEND_URL:", HTTP_BACKEND_URL);