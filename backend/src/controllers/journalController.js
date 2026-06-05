const JournalEntry = require('../models/JournalEntry');

// إضافة يومية جديدة
exports.createEntry = async (req, res) => {
  try {
    const { content, mood, wordCount } = req.body;

    if (!content || !mood) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال المحتوى والمزاج',
      });
    }

    const entry = new JournalEntry({
      user: req.user.id,
      content,
      mood,
      wordCount: wordCount || content.trim().split(/\s+/).length,
    });

    await entry.save();

    res.status(201).json({
      success: true,
      message: 'تم حفظ اليومية بنجاح',
      data: entry,
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حفظ اليومية',
    });
  }
};

// جلب جميع اليوميات للمستخدم
exports.getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id })
      .sort({ date: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: entries,
      count: entries.length,
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب اليوميات',
    });
  }
};

// جلب يومية واحدة
exports.getEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'اليومية غير موجودة',
      });
    }

    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب اليومية',
    });
  }
};

// حذف يومية
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'اليومية غير موجودة',
      });
    }

    res.json({
      success: true,
      message: 'تم حذف اليومية بنجاح',
    });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف اليومية',
    });
  }
};

// تحديث يومية
exports.updateEntry = async (req, res) => {
  try {
    const { content, mood } = req.body;

    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'اليومية غير موجودة',
      });
    }

    if (content) {
      entry.content = content;
      entry.wordCount = content.trim().split(/\s+/).length;
    }
    if (mood) entry.mood = mood;

    await entry.save();

    res.json({
      success: true,
      message: 'تم تحديث اليومية بنجاح',
      data: entry,
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث اليومية',
    });
  }
};

// احصائيات اليوميات
exports.getStats = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id });

    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const avgWords = totalEntries > 0 ? Math.ceil(totalWords / totalEntries) : 0;

    // احصائيات المزاج
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalEntries,
        totalWords,
        avgWords,
        moodCounts,
      },
    });
  } catch (error) {
    console.error('Error fetching journal stats:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإحصائيات',
    });
  }
};
