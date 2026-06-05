import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerParent, saveAuthData } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import Alert from '../../components/Alert/Alert';
import './Register.css';

const RegisterParent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [childCode, setChildCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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
        registerParent(name, email, password, childCode)
      );
      
      if (data.success) {
        saveAuthData(data.token, data.user);
        login(data.user);
        navigate('/parent/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

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
            <p className="auth-subtitle">تسجيل حساب ولي أمر 👨‍👩‍👧</p>
          </div>

          {error && <Alert type="danger" message={error} />}

          <div className="info-banner warning">
            <span className="banner-icon">🔑</span>
            <span>يجب أن يكون لديك <strong>كود ولي الأمر</strong> من حساب الطفل</span>
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
              <label htmlFor="childCode">
                <span className="label-icon">🎫</span>
                كود الطفل
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="childCode"
                  value={childCode}
                  onChange={(e) => setChildCode(e.target.value.toUpperCase())}
                  maxLength="8"
                  required
                  disabled={loading}
                  placeholder="XXXXXXXX"
                  dir="ltr"
                  style={{ letterSpacing: '0.2em', fontWeight: 'bold' }}
                />
              </div>
              <div className="input-hint">
                <span className="hint-icon">💡</span>
                الكود المكون من 8 أحرف الذي حصلت عليه من حساب الطفل
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

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading || (password !== confirmPassword && confirmPassword)}
            >
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

export default RegisterParent;
