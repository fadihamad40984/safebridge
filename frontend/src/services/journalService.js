import api from './api';

// إضافة يومية جديدة
export const createJournalEntry = async (content, mood, wordCount) => {
  const response = await api.post('/journal', {
    content,
    mood,
    wordCount,
  });
  return response.data;
};

// جلب جميع اليوميات
export const getJournalEntries = async () => {
  const response = await api.get('/journal');
  return response.data;
};

// جلب يومية واحدة
export const getJournalEntry = async (id) => {
  const response = await api.get(`/journal/${id}`);
  return response.data;
};

// تحديث يومية
export const updateJournalEntry = async (id, content, mood) => {
  const response = await api.put(`/journal/${id}`, {
    content,
    mood,
  });
  return response.data;
};

// حذف يومية
export const deleteJournalEntry = async (id) => {
  const response = await api.delete(`/journal/${id}`);
  return response.data;
};

// جلب إحصائيات اليوميات
export const getJournalStats = async () => {
  const response = await api.get('/journal/stats');
  return response.data;
};
