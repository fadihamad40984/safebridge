import React from 'react';
import './MoodSelector.css';

const moods = [
  { value: 5, emoji: '😄', label: 'سعيد جداً' },
  { value: 4, emoji: '😊', label: 'سعيد' },
  { value: 3, emoji: '😐', label: 'عادي' },
  { value: 2, emoji: '😔', label: 'حزين' },
  { value: 1, emoji: '😢', label: 'حزين جداً' },
];

const MoodSelector = ({ selectedMood, onSelect }) => {
  return (
    <div className="mood-selector">
      <h3 className="mood-selector-title">كيف تشعر اليوم؟</h3>
      
      <div className="mood-options">
        {moods.map((mood) => (
          <button
            key={mood.value}
            className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
            onClick={() => onSelect(mood.value)}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
