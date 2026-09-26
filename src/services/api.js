// API Service Layer — connects React frontend to FastAPI backend
// In dev, requests go through Vite's proxy (see vite.config.js).
// In production, set VITE_API_URL to the backend URL.
const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Generic fetch wrapper with error handling.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`API ${res.status}: ${errorBody}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[API] ${options.method || 'GET'} ${endpoint} failed:`, err);
    throw err;
  }
}

/**
 * Step 1: Fetch baseline state from the agent engine.
 * GET /api/state
 */
export async function fetchState() {
  return request('/api/state');
}

/**
 * Step 2: Inject income delay (reduces stipend arrival confidence to 0.2).
 * POST /api/inject-delay
 */
export async function injectDelay() {
  return request('/api/inject-delay', { method: 'POST' });
}

/**
 * Step 3: Add ₹3,500 emergency expense shock.
 * POST /api/add-expense
 */
export async function addExpenseShock() {
  return request('/api/add-expense', { method: 'POST' });
}

/**
 * Step Dynamic: Inject custom event (Income or Expense) into live agent engine.
 * POST /api/custom-event
 */
export async function injectCustomEvent(eventData) {
  return request('/api/custom-event', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

/**
 * Step 8: Send user feedback (APPROVE or REJECT).
 * POST /api/user-feedback
 */
export async function sendFeedback(action) {
  return request('/api/user-feedback', {
    method: 'POST',
    body: JSON.stringify({ action }),
  });
}

/**
 * Reset demo to clean baseline.
 * POST /api/reset-demo
 */
export async function resetDemo() {
  return request('/api/reset-demo', { method: 'POST' });
}

/**
 * Health check.
 * GET /health
 */
export async function healthCheck() {
  return request('/health');
}
