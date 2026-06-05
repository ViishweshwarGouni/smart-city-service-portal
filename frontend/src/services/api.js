const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Request failed');
  }
  
  return res.json();
}

export async function loginUser(email, password) {
  // Send email to backend, which queries the database for this email
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  
  if (!data || data.length === 0) {
    throw new Error('User not found');
  }
  
  const user = data[0];
  // Verify the password hash matches (handles backend's simplified auth)
  if (user.password_hash !== password) {
    throw new Error('Invalid email or password');
  }
  
  return user;
}

export async function registerUser(userData) {
  // userData: { name, email, password_hash, phone, role }
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  if (!data || data.length === 0) {
    throw new Error('Registration failed');
  }
  
  return data[0];
}

export async function fetchComplaints() {
  return request('/complaints/all');
}

export async function addComplaint(complaintData) {
  // complaintData: { user_id, title, description, latitude, longitude }
  return request('/complaints/add', {
    method: 'POST',
    body: JSON.stringify(complaintData),
  });
}

export async function updateComplaint(complaintId, updateData) {
  // updateData: { status, priority, department_id, is_duplicate, master_complaint_id }
  return request(`/complaints/${complaintId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

export async function fetchDepartments() {
  return request('/departments');
}
