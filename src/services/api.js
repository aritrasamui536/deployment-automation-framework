const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};
export const registerUser = async (name, email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};
export const getMe = async (token) => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
export const getDeployments = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/deployments${query ? "?" + query : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
export const getStats = async (token) => {
  const res = await fetch(`${API_URL}/deployments/stats/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
export const createDeployment = async (token, data) => {
  const res = await fetch(`${API_URL}/deployments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const updateDeployment = async (token, id, data) => {
  const res = await fetch(`${API_URL}/deployments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const deleteDeployment = async (token, id) => {
  const res = await fetch(`${API_URL}/deployments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return { ok: res.ok, status: res.status };
};
export const getLogs = async (token, deploymentId = null) => {
  const url = deploymentId
    ? `${API_URL}/logs/${deploymentId}`
    : `${API_URL}/logs`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
