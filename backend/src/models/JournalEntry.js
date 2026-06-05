const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'anxious', 'angry', 'calm', 'excited'],
  },
  wordCount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index لتسريع البحث
journalEntrySchema.index({ user: 1, date: -1 });

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

module.exports = JournalEntry;
