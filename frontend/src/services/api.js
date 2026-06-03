const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function fetchComplaints() {
  return fetch(`${API_BASE_URL}/complaints`).then(res => res.json());
}
