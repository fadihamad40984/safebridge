const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Child ID is required'],
    },
    
    mood: {
      type: Number,
      required: [true, 'Mood level is required'],
      min: [1, 'Minimum mood level is 1'],
      max: [5, 'Maximum mood level is 5'],
    },
    
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note must not exceed 500 characters'],
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index to ensure only one mood entry per day
moodEntrySchema.index({ childId: 1, createdAt: 1 });

// Function to check if entry exists for today
moodEntrySchema.statics.hasEntryToday = async function(childId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  const entry = await this.findOne({
    childId,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
  
  return !!entry;
};

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);

module.exports = MoodEntry;
