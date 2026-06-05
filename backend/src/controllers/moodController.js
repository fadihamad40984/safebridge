const MoodEntry = require('../models/MoodEntry');
const {
  getStartOfDay,
  getEndOfDay,
  getDaysAgo,
  analyzeMood,
  needsAlert,
  groupByDate,
} = require('../utils/helpers');

/**
 * @desc    Add new mood entry
 * @route   POST /api/mood
 * @access  Private (Child Only)
 */
exports.addMoodEntry = async (req, res, next) => {
  try {
    const { mood, note } = req.body;
    const childId = req.user.id;

    // Check if entry exists for today
    const hasEntry = await MoodEntry.hasEntryToday(childId);

    if (hasEntry) {
      return res.status(400).json({
        success: false,
        message: 'You have already logged your mood today',
      });
    }

    // Create entry
    const moodEntry = await MoodEntry.create({
      childId,
      mood,
      note,
    });

    res.status(201).json({
      success: true,
      message: 'Mood logged successfully',
      data: moodEntry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get entries from last 7 days
 * @route   GET /api/mood/last-week
 * @access  Private (Child Only)
 */
exports.getLastWeek = async (req, res, next) => {
  try {
    const childId = req.user.id;
    const sevenDaysAgo = getDaysAgo(7);

    const moodEntries = await MoodEntry.find({
      childId,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: moodEntries.length,
      data: moodEntries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if can log today
 * @route   GET /api/mood/can-log-today
 * @access  Private (Child Only)
 */
exports.canLogToday = async (req, res, next) => {
  try {
    const childId = req.user.id;
    const hasEntry = await MoodEntry.hasEntryToday(childId);

    res.status(200).json({
      success: true,
      canLog: !hasEntry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all entries for linked child (for parents)
 * @route   GET /api/mood/child-entries?childId=xxx
 * @access  Private (Parent Only)
 */
exports.getChildEntries = async (req, res, next) => {
  try {
    const { linkedChildren } = req.user;
    
    if (!linkedChildren || linkedChildren.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No children linked to your account',
      });
    }

    // Use provided childId or default to first child
    const childId = req.query.childId || linkedChildren[0].toString();

    // Verify that the child belongs to this parent
    if (!linkedChildren.some(id => id.toString() === childId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this child\'s data',
      });
    }

    const moodEntries = await MoodEntry.find({ childId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: moodEntries.length,
      data: moodEntries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get weekly summary (for parents)
 * @route   GET /api/mood/weekly-summary?childId=xxx
 * @access  Private (Parent Only)
 */
exports.getWeeklySummary = async (req, res, next) => {
  try {
    const { linkedChildren } = req.user;
    
    if (!linkedChildren || linkedChildren.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No children linked to your account',
      });
    }

    // Use provided childId or default to first child
    const childId = req.query.childId || linkedChildren[0].toString();

    // Verify that the child belongs to this parent
    if (!linkedChildren.some(id => id.toString() === childId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this child\'s data',
      });
    }

    const sevenDaysAgo = getDaysAgo(7);

    const moodEntries = await MoodEntry.find({
      childId,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: 1 });

    // Analyze data
    const analysis = analyzeMood(moodEntries);
    const alert = needsAlert(moodEntries);
    const groupedData = groupByDate(moodEntries);

    res.status(200).json({
      success: true,
      data: {
        entries: groupedData,
        analysis,
        alert,
        totalDays: 7,
        recordedDays: groupedData.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all entries (for parents)
 * @route   GET /api/mood/all-entries?childId=xxx
 * @access  Private (Parent Only)
 */
exports.getAllEntries = async (req, res, next) => {
  try {
    const { linkedChildren } = req.user;
    
    if (!linkedChildren || linkedChildren.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No children linked to your account',
      });
    }

    // Use provided childId or default to first child
    const childId = req.query.childId || linkedChildren[0].toString();

    // Verify that the child belongs to this parent
    if (!linkedChildren.some(id => id.toString() === childId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this child\'s data',
      });
    }

    const moodEntries = await MoodEntry.find({ childId })
      .sort({ createdAt: 1 });

    const analysis = analyzeMood(moodEntries);
    const grouped = groupByDate(moodEntries);

    res.status(200).json({
      success: true,
      count: moodEntries.length,
      data: {
        entries: grouped,
        analysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get child mood reference baseline
 * @route   GET /api/mood/reference
 * @access  Private (Child Only)
 */
exports.getChildReference = async (req, res, next) => {
  try {
    const childId = req.user.id;
    const thirtyDaysAgo = getDaysAgo(30);

    const moodEntries = await MoodEntry.find({
      childId,
      createdAt: { $gte: thirtyDaysAgo },
    }).sort({ createdAt: 1 });

    if (moodEntries.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          hasData: false,
          message: 'لا توجد بيانات كافية لبناء مرجع نفسي حتى الآن',
          baselineMoodAverage: 0,
          currentMoodAverage: 0,
          moodScore: 0,
          trend: 'neutral',
          deltaFromBaseline: 0,
          entriesCount: 0,
        },
      });
    }

    const baselineWindowSize = Math.min(7, moodEntries.length);
    const currentWindowSize = Math.min(7, moodEntries.length);

    const baselineWindow = moodEntries.slice(0, baselineWindowSize);
    const currentWindow = moodEntries.slice(-currentWindowSize);

    const average = (entries) => {
      const total = entries.reduce((sum, entry) => sum + entry.mood, 0);
      return total / entries.length;
    };

    const baselineMoodAverageRaw = average(baselineWindow);
    const currentMoodAverageRaw = average(currentWindow);
    const deltaRaw = currentMoodAverageRaw - baselineMoodAverageRaw;

    const baselineMoodAverage = parseFloat(baselineMoodAverageRaw.toFixed(2));
    const currentMoodAverage = parseFloat(currentMoodAverageRaw.toFixed(2));
    const deltaFromBaseline = parseFloat(deltaRaw.toFixed(2));

    let trend = 'neutral';
    if (deltaRaw >= 0.35) trend = 'improving';
    if (deltaRaw <= -0.35) trend = 'declining';

    const scoreRaw = ((currentMoodAverageRaw - 1) / 4) * 100;
    const moodScore = Math.max(0, Math.min(100, Math.round(scoreRaw)));

    res.status(200).json({
      success: true,
      data: {
        hasData: true,
        baselineMoodAverage,
        currentMoodAverage,
        moodScore,
        trend,
        deltaFromBaseline,
        entriesCount: moodEntries.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
