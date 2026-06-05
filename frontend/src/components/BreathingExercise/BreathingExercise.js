import React, { useState, useEffect, useRef } from 'react';
import './BreathingExercise.css';

const BreathingExercise = ({ onClose }) => {
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale, complete
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const totalCycles = 5;

  const phases = {
    inhale: { duration: 4, text: 'استنشق ببطء', icon: '🌬️', color: '#60a5fa' },
    hold: { duration: 4, text: 'احبس النفس', icon: '⏸️', color: '#a78bfa' },
    exhale: { duration: 4, text: 'أخرج الهواء', icon: '💨', color: '#34d399' },
  };

  useEffect(() => {
    if (isActive && phase !== 'ready' && phase !== 'complete') {
      if (count > 0) {
        timerRef.current = setTimeout(() => {
          setCount(count - 1);
        }, 1000);
      } else {
        nextPhase();
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [count, isActive, phase]);

  const nextPhase = () => {
    if (phase === 'inhale') {
      setPhase('hold');
      setCount(phases.hold.duration);
    } else if (phase === 'hold') {
      setPhase('exhale');
      setCount(phases.exhale.duration);
    } else if (phase === 'exhale') {
      const newCycles = cycles + 1;
      if (newCycles >= totalCycles) {
        setPhase('complete');
        setIsActive(false);
      } else {
        setCycles(newCycles);
        setPhase('inhale');
        setCount(phases.inhale.duration);
      }
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(phases.inhale.duration);
    setCycles(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('ready');
    setCount(4);
    setCycles(0);
  };

  const getCircleSize = () => {
    if (phase === 'inhale') {
      const progress = (phases.inhale.duration - count) / phases.inhale.duration;
      return 100 + progress * 100; // من 100 إلى 200
    } else if (phase === 'exhale') {
      const progress = count / phases.exhale.duration;
      return 100 + progress * 100; // من 200 إلى 100
    } else if (phase === 'hold') {
      return 200; // ثابت
    }
    return 100;
  };

  return (
    <div className="breathing-overlay">
      <div className="breathing-container">
        <button className="breathing-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {phase === 'ready' && (
          <div className="breathing-ready">
            <div className="breathing-icon">🧘</div>
            <h2>تمرين التنفس الهادئ</h2>
            <p>استرخِ وركز على تنفسك</p>
            <p className="breathing-info">سنقوم بـ {totalCycles} دورات تنفس معاً</p>
            <button className="breathing-start-btn" onClick={startExercise}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ابدأ التمرين
            </button>
          </div>
        )}

        {phase === 'complete' && (
          <div className="breathing-complete">
            <div className="breathing-success-icon">✨</div>
            <h2>أحسنت!</h2>
            <p>أتممت التمرين بنجاح</p>
            <p className="breathing-info">نأمل أن تشعر بالاسترخاء الآن</p>
            <div className="breathing-complete-actions">
              <button className="breathing-restart-btn" onClick={startExercise}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                إعادة التمرين
              </button>
              <button className="breathing-done-btn" onClick={onClose}>
                إنهاء
              </button>
            </div>
          </div>
        )}

        {isActive && phase !== 'complete' && (
          <div className="breathing-active">
            <div className="breathing-progress">
              <span className="cycle-count">{cycles + 1} / {totalCycles}</span>
            </div>

            <div className="breathing-circle-container">
              <div
                className="breathing-circle"
                style={{
                  width: `${getCircleSize()}px`,
                  height: `${getCircleSize()}px`,
                  backgroundColor: phases[phase]?.color || '#60a5fa',
                }}
              >
                <div className="breathing-count">{count}</div>
              </div>
            </div>

            <div className="breathing-instruction">
              <div className="breathing-phase-icon">{phases[phase]?.icon}</div>
              <h3>{phases[phase]?.text}</h3>
            </div>

            <button className="breathing-stop-btn" onClick={stopExercise}>
              إيقاف التمرين
            </button>
          </div>
        )}

        <div className="breathing-tips">
          <h4>💡 نصائح:</h4>
          <ul>
            <li>اجلس بوضعية مريحة</li>
            <li>ركز على حركة الدائرة</li>
            <li>تنفس من أنفك وأخرج من فمك</li>
            <li>استرخِ وأغمض عينيك إذا أردت</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
