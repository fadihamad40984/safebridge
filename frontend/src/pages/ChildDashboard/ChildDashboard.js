import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import MoodSelector from '../../components/MoodSelector/MoodSelector';
import MoodChart from '../../components/MoodChart/MoodChart';
import Alert from '../../components/Alert/Alert';
import BreathingExercise from '../../components/BreathingExercise/BreathingExercise';
import Journal from '../../components/Journal/Journal';
import MoodAdvice from '../../components/MoodAdvice/MoodAdvice';
import BookReader from '../../components/BookReader/BookReader';
import { addMoodEntry, getLastWeek, canLogToday, getMoodReference } from '../../services/moodService';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import './ChildDashboard.css';

const ChildDashboard = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [canLog, setCanLog] = useState(false);
  const [weeklyData, setWeeklyData] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [moodReference, setMoodReference] = useState(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [activeView, setActiveView] = useState('home'); // home, journal, book
  
  const { loading, error, execute } = useAsync();
  const { addToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [canLogData, weekData, referenceData] = await Promise.all([
        canLogToday(),
        getLastWeek(),
        getMoodReference(),
      ]);

      setCanLog(canLogData.canLog);
      setWeeklyData(weekData.data || []);
      setMoodReference(referenceData?.success ? referenceData.data : null);
      
      // إذا كان الطفل قد سجل مزاجه اليوم، احفظ القيمة
      if (!canLogData.canLog && weekData.data && weekData.data.length > 0) {
        const today = weekData.data[weekData.data.length - 1];
        if (today && today.date === new Date().toISOString().split('T')[0]) {
          setTodayMood(today.mood);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMood) {
      addToast('الرجاء اختيار مستوى المزاج', 'warning');
      return;
    }

    try {
      const data = await execute(() => addMoodEntry(selectedMood, note));
      
      if (data.success) {
        addToast('✅ تم تسجيل مزاجك بنجاح!', 'success');
        setTodayMood(selectedMood);
        setSelectedMood(null);
        setNote('');
        setCanLog(false);
        
        // تحديث البيانات
        await loadData();
      }
    } catch (err) {
      console.error('Error adding mood:', err);
      addToast('حدث خطأ أثناء حفظ مزاجك', 'error');
    }
  };

  const handleActivitySelect = (activity) => {
    switch (activity) {
      case 'breathing':
        setShowBreathing(true);
        break;
      case 'journal':
        setActiveView('journal');
        break;
      case 'music':
        addToast('ميزة الموسيقى قريباً! 🎵', 'info');
        break;
      case 'video':
        addToast('ميزة الفيديوهات قريباً! 🎬', 'info');
        break;
      case 'story':
        setActiveView('book');
        break;
      case 'game':
        addToast('ميزة الألعاب قريباً! 🎮', 'info');
        break;
      case 'draw':
        addToast('ميزة الرسم قريباً! 🎨', 'info');
        break;
      case 'exercise':
        addToast('ميزة التمارين قريباً! 🏃', 'info');
        break;
      case 'talk':
        addToast('تحدث مع شخص تثق به من العائلة 💬', 'info');
        break;
      default:
        break;
    }
  };

  return (
    <div className="child-dashboard">
      <Navbar />
      
      {showBreathing && (
        <BreathingExercise onClose={() => setShowBreathing(false)} />
      )}

      <div className="dashboard-container">
        {activeView === 'home' && (
          <>
            <div className="dashboard-header">
              <h2 className="dashboard-title">مرحباً بك! 👋</h2>
              <p className="dashboard-subtitle">كيف تشعر اليوم؟</p>
            </div>

            <div className="quick-actions">
              <button 
                className="quick-action-btn breathing"
                onClick={() => setShowBreathing(true)}
              >
                <span className="action-icon">🧘</span>
                <span className="action-text">تمرين التنفس</span>
              </button>

              <button 
                className="quick-action-btn journal"
                onClick={() => setActiveView('journal')}
              >
                <span className="action-icon">📔</span>
                <span className="action-text">يومياتي</span>
              </button>

              <button
                className="quick-action-btn book"
                onClick={() => setActiveView('book')}
              >
                <span className="action-icon">📚</span>
                <span className="action-text">اقرأ كتاباً</span>
              </button>
            </div>

            {error && <Alert type="danger" message={error} />}

            {canLog ? (
              <div className="mood-log-section">
                <h3 className="section-title">سجّل مزاجك اليوم</h3>
                <form onSubmit={handleSubmit}>
                  <MoodSelector 
                    selectedMood={selectedMood}
                    onSelect={setSelectedMood}
                  />

                  <div className="note-section">
                    <label htmlFor="note">ملاحظة (اختياري)</label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="هل تريد إضافة ملاحظة عن يومك؟"
                      maxLength="500"
                      rows="4"
                      disabled={loading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-mood-btn"
                    disabled={loading || !selectedMood}
                  >
                    {loading ? 'جاري الحفظ...' : 'حفظ المزاج'}
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Alert 
                  type="info" 
                  message="لقد سجلت مزاجك اليوم بالفعل! عد غداً لتسجيل مزاج جديد. 🎉"
                />
                
                {todayMood && (
                  <div className="mood-advice-wrapper">
                    <MoodAdvice 
                      mood={todayMood} 
                      onActivitySelect={handleActivitySelect}
                    />
                  </div>
                )}
              </>
            )}

            {weeklyData.length > 0 && (
              <div className="weekly-section">
                <h3>سجل مزاجك خلال الأسبوع الماضي</h3>
                <MoodChart data={weeklyData} />
              </div>
            )}

            {moodReference?.hasData && (
              <div className="reference-card">
                <div className="reference-header">
                  <h3>المرجع النفسي</h3>
                  <p>مقارنة حالتك الحالية بمتوسطك الأساسي</p>
                </div>

                <div className="reference-grid">
                  <div className="reference-metric">
                    <span className="metric-label">المؤشر الحالي</span>
                    <strong className="metric-value">{moodReference.moodScore}/100</strong>
                  </div>
                  <div className="reference-metric">
                    <span className="metric-label">خط الأساس</span>
                    <strong className="metric-value">{moodReference.baselineMoodAverage}/5</strong>
                  </div>
                  <div className="reference-metric">
                    <span className="metric-label">المتوسط الحالي</span>
                    <strong className="metric-value">{moodReference.currentMoodAverage}/5</strong>
                  </div>
                  <div className="reference-metric">
                    <span className="metric-label">الاتجاه</span>
                    <strong className={`metric-value trend ${moodReference.trend}`}>
                      {moodReference.trend === 'improving' && 'يتحسن'}
                      {moodReference.trend === 'declining' && 'بحاجة انتباه'}
                      {moodReference.trend === 'neutral' && 'مستقر'}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeView === 'journal' && (
          <div className="journal-wrapper">
            <button 
              className="back-to-home-btn"
              onClick={() => setActiveView('home')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              العودة للرئيسية
            </button>
            <Journal />
          </div>
        )}

        {activeView === 'book' && (
          <div className="journal-wrapper">
            <button
              className="back-to-home-btn"
              onClick={() => setActiveView('home')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              العودة للرئيسية
            </button>
            <BookReader
              referenceMood={todayMood || Math.round(moodReference?.currentMoodAverage || 3)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildDashboard;
