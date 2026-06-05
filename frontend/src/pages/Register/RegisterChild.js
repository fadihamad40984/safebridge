import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerChild, saveAuthData } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import Alert from '../../components/Alert/Alert';
import './Register.css';

const RegisterChild = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [parentCode, setParentCode] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, error, execute } = useAsync();

  // Password strength calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'ضعيفة جداً', color: '#ff4444' },
      { strength: 2, label: 'ضعيفة', color: '#ff8800' },
      { strength: 3, label: 'متوسطة', color: '#ffbb00' },
      { strength: 4, label: 'قوية', color: '#00cc44' },
      { strength: 5, label: 'قوية جداً', color: '#00aa00' }
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }

    if (passwordStrength.strength < 2) {
      alert('كلمة المرور ضعيفة جداً. الرجاء استخدام كلمة مرور أقوى.');
      return;
    }

    try {
      const data = await execute(() => 
        registerChild(name, email, parseInt(age), password)
      );
      
      if (data.success) {
        setParentCode(data.user.parentCode);
        saveAuthData(data.token, data.user);
        login(data.user);
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  if (parentCode) {
    return (
      <div className="auth-page">
        <div className="auth-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="auth-container">
          <div className="auth-card success-card">
            <div className="success-animation">
              <div className="success-icon">✨</div>
            </div>
            
            <div className="success-content">
              <h2 className="success-title">تم التسجيل بنجاح!</h2>
              <p className="success-message">مرحباً بك في جِسر الأمان 🎉</p>
              
              <div className="parent-code-section">
                <p className="code-label">كود ولي الأمر الخاص بك:</p>
                <div className="parent-code-display">
                  <span className="code-value">{parentCode}</span>
                  <button 
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(parentCode);
                      alert('تم نسخ الكود!');
                    }}
                  >
                    📋
                  </button>
                </div>
                <div className="code-note">
                  <span className="note-icon">⚠️</span>
                  احتفظ بهذا الكود لمشاركته مع ولي أمرك
                </div>
              </div>

              <button 
                onClick={() => navigate('/child/dashboard')}
                className="submit-btn"
              >
                <span>الذهاب إلى لوحة التحكم</span>
                <span className="btn-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-container">
              <div className="logo-icon">🌉</div>
              <h1>جِسر الأمان</h1>
            </div>
            <p className="auth-subtitle">تسجيل حساب طفل جديد 👦</p>
          </div>

          {error && <Alert type="danger" message={error} />}

          <div className="info-banner">
            <span className="banner-icon">💡</span>
            <span>سيتم إنشاء كود خاص لولي الأمر بعد التسجيل</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">
                <span className="label-icon">👤</span>
                الاسم الكامل
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="أدخل اسمك الكامل"
                  minLength="2"
                  maxLength="100"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span>
                البريد الإلكتروني
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="example@email.com"
                  dir="ltr"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="age">
                <span className="label-icon">🎂</span>
                العمر
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="age"
                  min="3"
                  max="17"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="أدخل عمرك (3-17)"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                كلمة المرور
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }}
                    ></div>
                  </div>
                  <span className="strength-label" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <span className="label-icon">🔑</span>
                تأكيد كلمة المرور
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength="6"
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div className="error-hint">
                  ❌ كلمات المرور غير متطابقة
                </div>
              )}
              {confirmPassword && password === confirmPassword && (
                <div className="success-hint">
                  ✅ كلمات المرور متطابقة
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={loading || (password !== confirmPassword && confirmPassword)}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  جاري التسجيل...
                </>
              ) : (
                <>
                  <span>إنشاء حساب</span>
                  <span className="btn-icon">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>أو</span>
          </div>

          <div className="auth-footer">
            <p className="footer-text">لديك حساب بالفعل؟</p>
            <Link to="/login" className="link-btn">
              <span>تسجيل الدخول</span>
              <span className="link-icon">←</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterChild;
