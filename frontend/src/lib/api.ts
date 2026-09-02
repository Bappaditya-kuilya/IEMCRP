const API_BASE = '/api';

export async function login(username: string, password: string, turnstileToken?: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, turnstileToken }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}

export function setAuthToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function clearAuthToken() {
  localStorage.removeItem('accessToken');
}

export function getUserRole(): string | null {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export function isStaffOrAdmin(): boolean {
  const role = getUserRole();
  return role === 'STAFF' || role === 'ADMIN';
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function getStaffExams() {
  return apiFetch('/staff/exams');
}

export async function createExam(data: { name: string; examType: string; semester: number; academicYear: string }) {
  return apiFetch('/staff/exams', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function uploadResults(data: { examId: string; results: any[] }) {
  return apiFetch('/staff/results', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function isAdmin(): boolean {
  return getUserRole() === 'ADMIN';
}

export async function getAdminDashboard() {
  return apiFetch('/admin/dashboard');
}

export async function getAdminUsers(page = 0, size = 20) {
  return apiFetch(`/admin/users?page=${page}&size=${size}`);
}

export async function createAdminUser(data: any) {
  return apiFetch('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAuditLog(page = 0, size = 20) {
  return apiFetch(`/admin/audit?page=${page}&size=${size}`);
}
