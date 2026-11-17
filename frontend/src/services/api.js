const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

/**
 * Send code or error to backend for AI analysis
 */
export async function analyzeCode(payload) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to analyze code. Please check your input.');
  }

  return data;
}

/**
 * Fetch analysis history
 */
export async function fetchHistory(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}/history${query ? `?${query}` : ''}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch history');
  }

  return data.history || [];
}

/**
 * Fetch specific analysis by ID
 */
export async function fetchAnalysisById(id) {
  const response = await fetch(`${API_BASE}/history/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch analysis details');
  }

  return data.analysis;
}

/**
 * Delete an analysis record
 */
export async function deleteAnalysis(id) {
  const response = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete record');
  }

  return data;
}

/**
 * Check backend service health
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
