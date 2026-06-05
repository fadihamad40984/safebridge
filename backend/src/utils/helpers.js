const config = require('../config/config');

/**
 * Get start of day (00:00:00)
 * @param {Date} date - Date (optional)
 * @returns {Date}
 */
exports.getStartOfDay = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

/**
 * Get end of day (23:59:59)
 * @param {Date} date - Date (optional)
 * @returns {Date}
 */
exports.getEndOfDay = (date = new Date()) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

/**
 * Get date N days ago
 * @param {Number} days - Number of days
 * @returns {Date}
 */
exports.getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Analyze mood data and calculate overall status
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Object} - Overall status and statistics
 */
exports.analyzeMood = (moodEntries) => {
  if (!moodEntries || moodEntries.length === 0) {
    return {
      status: 'no-data',
      averageMood: 0,
      totalEntries: 0,
    };
  }

  const totalMood = moodEntries.reduce((sum, entry) => sum + entry.mood, 0);
  const averageMood = totalMood / moodEntries.length;

  let status;

  if (averageMood >= 4) {
    status = 'stable';
  } else if (averageMood >= 3) {
    status = 'moderate';
  } else {
    status = 'needs-attention';
  }

  return {
    status,
    averageMood: parseFloat(averageMood.toFixed(2)),
    totalEntries: moodEntries.length,
  };
};

/**
 * Check if alert is needed
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Boolean}
 */
exports.needsAlert = (moodEntries) => {
  const { alertThreshold, alertCount, alertDays } = config.mood;
  
  // Get entries within the specified period
  const recentDate = this.getDaysAgo(alertDays);
  const recentEntries = moodEntries.filter(
    entry => new Date(entry.createdAt) >= recentDate
  );

  // Count low mood entries
  const lowMoodCount = recentEntries.filter(
    entry => entry.mood <= alertThreshold
  ).length;

  return lowMoodCount >= alertCount;
};

/**
 * Group data by date
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Array} - Grouped data
 */
exports.groupByDate = (moodEntries) => {
  const grouped = {};

  moodEntries.forEach(entry => {
    const dateKey = new Date(entry.createdAt).toISOString().split('T')[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(entry);
  });

  return Object.entries(grouped).map(([date, entries]) => ({
    date,
    mood: entries[0].mood,
    note: entries[0].note,
    count: entries.length,
  }));
};
