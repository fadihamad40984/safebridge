import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import MoodChart from '../../components/MoodChart/MoodChart';
import Alert from '../../components/Alert/Alert';
import { getWeeklySummary, getAllEntries } from '../../services/moodService';
import { getLinkedChildren } from '../../services/authService';
import './ParentDashboard.css';

const ParentDashboard = () => {
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('weekly'); // 'weekly' or 'all'
  const [linkedChildren, setLinkedChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      loadData();
    }
  }, [selectedChildId, view]);

  const loadChildren = async () => {
    try {
      const response = await getLinkedChildren();
      if (response.success && response.children.length > 0) {
        setLinkedChildren(response.children);
        setSelectedChildId(response.children[0]._id);
      } else {
        setError('لا يوجد أطفال مرتبطين بحسابك');
        setLoading(false);
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل بيانات الأطفال');
      setLoading(false);
    }
  };

  const loadData = async () => {
    if (!selectedChildId) return;
    
    try {
      setLoading(true);
      const [weeklyData, allEntriesData] = await Promise.all([
        getWeeklySummary(selectedChildId),
        getAllEntries(selectedChildId),
      ]);

      setWeeklySummary(weeklyData.data);
      setAllData(allEntriesData.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء تحميل البيانات');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="parent-dashboard">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="parent-dashboard">
        <Navbar />
        <div className="dashboard-container">
          <Alert type="danger" message={error} />
        </div>
      </div>
    );
  }

  const currentData = view === 'weekly' ? weeklySummary : allData;
  const hasEntries = currentData?.entries && currentData.entries.length > 0;

  return (
    <div className="parent-dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <h2 className="dashboard-title">لوحة تحكم ولي الأمر</h2>

        {linkedChildren.length > 1 && (
          <div className="child-selector">
            <label>اختر الطفل:</label>
            <select 
              value={selectedChildId} 
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="child-select"
            >
              {linkedChildren.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name} ({child.age} سنة)
                </option>
              ))}
            </select>
          </div>
        )}

        {linkedChildren.length === 1 && (
          <div className="current-child-info">
            <span className="child-icon">👦</span>
            <span className="child-name">{linkedChildren[0].name}</span>
            <span className="child-age">({linkedChildren[0].age} سنة)</span>
          </div>
        )}

        <div className="view-toggle">
          <button
            className={view === 'weekly' ? 'active' : ''}
            onClick={() => setView('weekly')}
          >
            آخر 7 أيام
          </button>
          <button
            className={view === 'all' ? 'active' : ''}
            onClick={() => setView('all')}
          >
            جميع التسجيلات
          </button>
        </div>

        {view === 'weekly' && weeklySummary?.alert && (
          <Alert 
            type="warning" 
            message="⚠️ تنبيه: تم تسجيل مزاج منخفض أكثر من 3 مرات خلال الأسبوع الماضي. يُنصح بالانتباه لحالة الطفل."
          />
        )}

        {hasEntries ? (
          <>
            <div className="statistics-section">
              <div className="stat-card">
                <h3>الحالة العامة</h3>
                <p className={`status status-${currentData.analysis.status}`}>
                  {currentData.analysis.statusAr}
                </p>
              </div>

              <div className="stat-card">
                <h3>متوسط المزاج</h3>
                <p className="average">
                  {currentData.analysis.averageMood}/5
                </p>
              </div>

              <div className="stat-card">
                <h3>عدد التسجيلات</h3>
                <p className="count">
                  {currentData.analysis.totalEntries}
                  {view === 'weekly' && ` من ${weeklySummary.totalDays}`}
                </p>
              </div>
            </div>

            <MoodChart data={currentData.entries} />

            <div className="entries-list">
              <h3>تفاصيل التسجيلات</h3>
              <div className="entries-grid">
                {currentData.entries.slice().reverse().map((entry, index) => (
                  <div key={index} className="entry-card">
                    <div className="entry-header">
                      <span className="entry-date">
                        {new Date(entry.date).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className={`entry-mood mood-${entry.mood}`}>
                        {entry.mood}/5
                      </span>
                    </div>
                    {entry.note && (
                      <p className="entry-note">{entry.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Alert 
            type="info" 
            message="لا توجد تسجيلات متاحة حالياً"
          />
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
