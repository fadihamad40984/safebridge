import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  createJournalEntry,
  getJournalEntries,
  deleteJournalEntry as deleteJournalEntryAPI,
} from '../../services/journalService';
import './Journal.css';

const Journal = () => {
  const { addToast } = useToast();
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(false);

  const moods = [
    { value: 'happy', label: 'سعيد', emoji: '😊', color: '#34d399' },
    { value: 'sad', label: 'حزين', emoji: '😢', color: '#60a5fa' },
    { value: 'anxious', label: 'قلق', emoji: '😰', color: '#fbbf24' },
    { value: 'angry', label: 'غاضب', emoji: '😠', color: '#f87171' },
    { value: 'calm', label: 'هادئ', emoji: '😌', color: '#a78bfa' },
    { value: 'excited', label: 'متحمس', emoji: '🤩', color: '#fb923c' },
  ];

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await getJournalEntries();
      if (response.success) {
        setEntries(response.data);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
      addToast('حدث خطأ أثناء تحميل اليوميات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!currentEntry.trim()) {
      addToast('الرجاء كتابة شيء في اليومية', 'warning');
      return;
    }

    if (!selectedMood) {
      addToast('الرجاء اختيار مشاعرك الحالية', 'warning');
      return;
    }

    try {
      setLoading(true);
      const wordCount = currentEntry.trim().split(/\s+/).length;
      const response = await createJournalEntry(currentEntry, selectedMood, wordCount);

      if (response.success) {
        addToast('تم حفظ اليومية بنجاح! 📝', 'success');
        setCurrentEntry('');
        setSelectedMood('');
        setIsWriting(false);
        await loadEntries();
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      addToast('حدث خطأ أثناء حفظ اليومية', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه اليومية؟')) {
      try {
        setLoading(true);
        const response = await deleteJournalEntryAPI(id);
        
        if (response.success) {
          addToast('تم حذف اليومية', 'info');
          setSelectedEntry(null);
          await loadEntries();
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
        addToast('حدث خطأ أثناء حذف اليومية', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'اليوم';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const getMoodData = (moodValue) => {
    return moods.find(m => m.value === moodValue) || moods[0];
  };

  return (
    <div className="journal-container">
      <div className="journal-header">
        <div className="journal-title">
          <span className="journal-icon">📔</span>
          <h2>يومياتي الخاصة</h2>
        </div>
        <p className="journal-subtitle">مساحة آمنة لأفكارك ومشاعرك 💭</p>
      </div>

      {!isWriting && !selectedEntry && (
        <div className="journal-stats">
          <div className="journal-stat-card">
            <div className="journal-stat-value">{entries.length}</div>
            <div className="journal-stat-label">يومية</div>
          </div>
          <div className="journal-stat-card">
            <div className="journal-stat-value">
              {entries.reduce((sum, e) => sum + e.wordCount, 0)}
            </div>
            <div className="journal-stat-label">كلمة</div>
          </div>
          <div className="journal-stat-card">
            <div className="journal-stat-value">
              {entries.length > 0 ? Math.ceil(entries.reduce((sum, e) => sum + e.wordCount, 0) / entries.length) : 0}
            </div>
            <div className="journal-stat-label">متوسط الكلمات</div>
          </div>
        </div>
      )}

      {isWriting && (
        <div className="journal-write">
          <div className="write-header">
            <h3>اكتب يومية جديدة</h3>
            <button className="close-write-btn" onClick={() => setIsWriting(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mood-selector-journal">
            <label>كيف تشعر الآن؟</label>
            <div className="mood-options">
              {moods.map(mood => (
                <button
                  key={mood.value}
                  className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(mood.value)}
                  style={{
                    borderColor: selectedMood === mood.value ? mood.color : 'transparent',
                    backgroundColor: selectedMood === mood.value ? `${mood.color}20` : 'transparent',
                  }}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="write-area">
            <textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="اكتب ما تشعر به... لا أحد سيقرأ هذا غيرك 🔒"
              rows="12"
              autoFocus
            />
            <div className="write-meta">
              <span className="word-count">
                {currentEntry.trim() ? currentEntry.trim().split(/\s+/).length : 0} كلمة
              </span>
            </div>
          </div>

          <div className="write-actions">
            <button className="save-entry-btn" onClick={saveEntry} disabled={loading}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {loading ? 'جاري الحفظ...' : 'حفظ اليومية'}
            </button>
            <button className="cancel-btn" onClick={() => setIsWriting(false)} disabled={loading}>
              إلغاء
            </button>
          </div>
        </div>
      )}

      {selectedEntry && (
        <div className="journal-view">
          <div className="view-header">
            <button className="back-btn" onClick={() => setSelectedEntry(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              رجوع
            </button>
            <button className="delete-btn" onClick={() => deleteEntry(selectedEntry._id)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="view-date">{formatDate(selectedEntry.date)}</div>
          
          <div className="view-mood" style={{ color: getMoodData(selectedEntry.mood).color }}>
            <span className="view-mood-emoji">{getMoodData(selectedEntry.mood).emoji}</span>
            <span className="view-mood-label">{getMoodData(selectedEntry.mood).label}</span>
          </div>

          <div className="view-content">
            {selectedEntry.content}
          </div>

          <div className="view-meta">
            {selectedEntry.wordCount} كلمة • {new Date(selectedEntry.date).toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      )}

      {!isWriting && !selectedEntry && (
        <>
          <button className="new-entry-btn" onClick={() => setIsWriting(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            يومية جديدة
          </button>

          <div className="entries-list">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>جاري تحميل اليوميات...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✍️</div>
                <h3>لا توجد يوميات بعد</h3>
                <p>ابدأ بكتابة أول يومية لك!</p>
              </div>
            ) : (
              entries.map(entry => {
                const moodData = getMoodData(entry.mood);
                return (
                  <div
                    key={entry._id}
                    className="entry-card"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="entry-header-card">
                      <span className="entry-mood" style={{ color: moodData.color }}>
                        {moodData.emoji}
                      </span>
                      <span className="entry-date">{formatDate(entry.date)}</span>
                    </div>
                    <div className="entry-preview">
                      {entry.content.substring(0, 120)}
                      {entry.content.length > 120 && '...'}
                    </div>
                    <div className="entry-footer">
                      <span className="entry-words">{entry.wordCount} كلمة</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      <div className="journal-privacy">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>يومياتك خاصة وآمنة. لا يمكن لأي شخص الاطلاع عليها.</span>
      </div>
    </div>
  );
};

export default Journal;
