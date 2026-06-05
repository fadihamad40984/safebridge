/**
 * تنسيق التاريخ بالعربية
 * @param {Date|string} date - التاريخ
 * @returns {string}
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * الحصول على نص المزاج
 * @param {number} mood - مستوى المزاج (1-5)
 * @returns {string}
 */
export const getMoodText = (mood) => {
  const moodTexts = {
    5: 'سعيد جداً',
    4: 'سعيد',
    3: 'عادي',
    2: 'حزين',
    1: 'حزين جداً',
  };
  return moodTexts[mood] || 'غير معروف';
};

/**
 * الحصول على emoji المزاج
 * @param {number} mood - مستوى المزاج (1-5)
 * @returns {string}
 */
export const getMoodEmoji = (mood) => {
  const moodEmojis = {
    5: '😄',
    4: '😊',
    3: '😐',
    2: '😔',
    1: '😢',
  };
  return moodEmojis[mood] || '❓';
};

/**
 * الحصول على لون المزاج
 * @param {number} mood - مستوى المزاج (1-5)
 * @returns {string}
 */
export const getMoodColor = (mood) => {
  const moodColors = {
    5: '#4caf50',
    4: '#2196f3',
    3: '#ff9800',
    2: '#ff5722',
    1: '#f44336',
  };
  return moodColors[mood] || '#757575';
};

/**
 * حساب الفرق بالأيام
 * @param {Date|string} date1 
 * @param {Date|string} date2 
 * @returns {number}
 */
export const daysDifference = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

/**
 * التحقق من صحة البريد الإلكتروني
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * اختصار النص
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
