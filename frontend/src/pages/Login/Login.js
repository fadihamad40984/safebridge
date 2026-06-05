import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginService, saveAuthData } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import Alert from '../../components/Alert/Alert';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, error, execute } = useAsync();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await execute(() => loginService(email, password));
      
      if (data.success) {
        saveAuthData(data.token, data.user);
        login(data.user);
        
        // التوجيه حسب نوع المستخدم
        if (data.user.role === 'child') {
          navigate('/child/dashboard');
        } else {
          navigate('/parent/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
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
            <p className="auth-subtitle">مرحباً بعودتك</p>
          </div>

          {error && <Alert type="danger" message={error} />}

          <form onSubmit={handleSubmit} className="auth-form">
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
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <span className="btn-icon">→</span>
                </>
              )}
            </button>

            <Link to="/forgot-password" className="forgot-password-link">
              نسيت كلمة المرور؟
            </Link>
          </form>

          <div className="auth-divider">
            <span>أو</span>
          </div>

          <div className="auth-footer">
            <p className="footer-text">ليس لديك حساب؟</p>
            <div className="register-options">
              <Link to="/register/child" className="register-option">
                <span className="option-icon">👦</span>
                <span className="option-text">تسجيل طفل</span>
              </Link>
              <Link to="/register/parent" className="register-option">
                <span className="option-icon">👨‍👩‍👧</span>
                <span className="option-text">تسجيل ولي أمر</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="auth-info">
          <div className="info-card">
            <h3>🛡️ آمن ومحمي</h3>
            <p>بياناتك محمية بأعلى معايير الأمان</p>
          </div>
          <div className="info-card">
            <h3>📊 تتبع سهل</h3>
            <p>متابعة الحالة النفسية بشكل بسيط وفعال</p>
          </div>
          <div className="info-card">
            <h3>🤝 دعم مستمر</h3>
            <p>نحن معكم في كل خطوة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
