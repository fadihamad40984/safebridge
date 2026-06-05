import api from './api';

/**
 * تسجيل طفل جديد
 */
export const registerChild = async (name, email, age, password) => {
  const response = await api.post('/auth/register/child', {
    name,
    email,
    age,
    password,
  });
  return response.data;
};

/**
 * تسجيل ولي أمر جديد
 */
export const registerParent = async (name, email, password, childCode) => {
  const response = await api.post('/auth/register/parent', {
    name,
    email,
    password,
    childCode,
  });
  return response.data;
};

/**
 * تسجيل الدخول
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

/**
 * ربط طفل إضافي بحساب ولي الأمر
 */
export const linkChild = async (childCode) => {
  const response = await api.post('/auth/link-child', {
    childCode,
  });
  return response.data;
};

/**
 * الحصول على قائمة الأطفال المرتبطين
 */
export const getLinkedChildren = async () => {
  const response = await api.get('/auth/linked-children');
  return response.data;
};

/**
 * الحصول على المستخدم الحالي
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * حفظ بيانات المستخدم و Token
 */
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * الحصول على بيانات المستخدم المحفوظة
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * تسجيل الخروج
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
