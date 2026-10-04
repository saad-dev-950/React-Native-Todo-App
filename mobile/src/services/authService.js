import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const TOKEN_KEY = 'todo_auth_token';
const USER_KEY = 'todo_auth_user';

export async function registerUser(data) {
  const response = await api.post('/auth/register', data);
  await saveSession(response.data.token, response.data.user);
  return response.data;
}

export async function loginUser(data) {
  const response = await api.post('/auth/login', data);
  await saveSession(response.data.token, response.data.user);
  return response.data;
}

export async function saveSession(token, user) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function getSession() {
  const values = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  const token = values[0][1];
  const userJson = values[1][1];

  if (!token || !userJson) {
    return null;
  }

  return {
    token,
    user: JSON.parse(userJson),
  };
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export { TOKEN_KEY, USER_KEY };
