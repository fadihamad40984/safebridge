import api from './api';

/**
 * إضافة تسجيل مزاج جديد
 */
export const addMoodEntry = async (mood, note = '') => {
  const response = await api.post('/mood', { mood, note });
  return response.data;
};

/**
 * الحصول على تسجيلات آخر 7 أيام
 */
export const getLastWeek = async () => {
  const response = await api.get('/mood/last-week');
  return response.data;
};

/**
 * التحقق من إمكانية التسجيل اليوم
 */
export const canLogToday = async () => {
  const response = await api.get('/mood/can-log-today');
  return response.data;
};

/**
 * الحصول على المرجع النفسي للطفل
 */
export const getMoodReference = async () => {
  const response = await api.get('/mood/reference');
  return response.data;
};

/**
 * الحصول على تسجيلات الطفل (للأهل)
 */
export const getChildEntries = async (childId = null) => {
  const url = childId ? `/mood/child-entries?childId=${childId}` : '/mood/child-entries';
  const response = await api.get(url);
  return response.data;
};

/**
 * الحصول على الملخص الأسبوعي (للأهل)
 */
export const getWeeklySummary = async (childId = null) => {
  const url = childId ? `/mood/weekly-summary?childId=${childId}` : '/mood/weekly-summary';
  const response = await api.get(url);
  return response.data;
};

/**
 * الحصول على جميع التسجيلات (للأهل)
 */
export const getAllEntries = async (childId = null) => {
  const url = childId ? `/mood/all-entries?childId=${childId}` : '/mood/all-entries';
  const response = await api.get(url);
  return response.data;
};
