import api from './api';
import { getToken } from './authService';

async function authConfig() {
  const token = await getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getTodos() {
  return api.get('/todos', await authConfig());
}

export async function createTodo(data) {
  return api.post('/todos', data, await authConfig());
}

export async function updateTodo(id, data) {
  return api.put(`/todos/${id}`, data, await authConfig());
}

export async function toggleTodo(id) {
  return api.patch(`/todos/${id}/toggle`, {}, await authConfig());
}

export async function deleteTodo(id) {
  return api.delete(`/todos/${id}`, await authConfig());
}
