import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../config/api';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess, navigateToRegister }) => {
  const [userType, setUserType] = useState('candidate');
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [loginMethod, setLoginMethod] = useState('otp');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormData({ email: '', password: '' });
    setShowOTPForm(false);
    setOtpValues(['', '', '', '', '', '']);
    setError('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showSuccessPopup = (message) => {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
      <div class="success-popup-content">
        <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span class="success-message">${message}</span>
      </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(popup), 400);
    }, 2000);
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google/login/?user_type=${userType}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      if (loginMethod === 'otp') {
        const response = await api.post('/api/auth/send-otp/', {
          email: formData.email,
          role: userType
        });

        if (response.data) {
          setShowOTPForm(true);
          showSuccessPopup('OTP sent successfully!');
        }
      } else {
        const response = await api.post('/api/auth/login/', {
          email: formData.email,
          password: formData.password,
          role: userType
        });

        if (response.data.tokens) {
          localStorage.setItem('accessToken', response.data.tokens.access);
          localStorage.setItem('refreshToken', response.data.tokens.refresh);

          const userData = {
            id: response.data.user?.id,
            name: response.data.user?.full_name,
            email: response.data.user?.email,
            userType: response.data.user?.role,
            loginMethod: 'password'
          };

          showSuccessPopup('Login successful!');
          setTimeout(() => onLoginSuccess && onLoginSuccess(userData), 2000);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.detail || 
                      error.response?.data?.message || 
                      'Login failed. Please try again.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1);
    setOtpValues(newOtpValues);
    
    if (value && index < 5) {
      document.querySelector(`input[data-index="${index + 1}"]`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) {
        prevInput.focus();
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = '';
        setOtpValues(newOtpValues);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtpValues = [...otpValues];
    
    for (let i = 0; i < 6; i++) {
      newOtpValues[i] = pastedData[i] || '';
    }
    
    setOtpValues(newOtpValues);
    document.querySelector(`input[data-index="${Math.min(pastedData.length, 5)}"]`)?.focus();
  };

  const handleResendOtp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    
    try {
      await api.post('/api/auth/send-otp/', {
        email: formData.email,
        role: userType
      });

      setOtpValues(['', '', '', '', '', '']);
      setTimeout(() => document.querySelector('input[data-index="0"]')?.focus(), 100);
      showSuccessPopup('New OTP sent successfully!');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to resend OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerification = async () => {
    const otpValue = otpValues.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post('/api/auth/verify-otp/', {
        email: formData.email,
        code: otpValue,
        role: userType
      });

      if (response.data.tokens) {
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);

        const userData = {
          id: response.data.user?.id,
          name: response.data.user?.full_name,
          email: response.data.user?.email,
          userType: response.data.user?.role,
          loginMethod: 'otp'
        };

        showSuccessPopup('Login successful!');
        setTimeout(() => onLoginSuccess && onLoginSuccess(userData), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Invalid or expired OTP.');
      setOtpValues(['', '', '', '', '', '']);
      setTimeout(() => document.querySelector('input[data-index="0"]')?.focus(), 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === 'otp' ? 'password' : 'otp');
    setShowOTPForm(false);
    setOtpValues(['', '', '', '', '', '']);
    setFormData({ email: '', password: '' });
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {showOTPForm ? (
          <div className="otp-verification-form">
            <div className="user-type-selector">
              <button 
                type="button"
                className={`user-type-btn ${userType === 'candidate' ? 'active' : ''}`}
                onClick={() => handleUserTypeChange('candidate')}
              >
                <span className="user-type-icon">👤</span>
                Candidate
              </button>
              <button 
                type="button"
                className={`user-type-btn ${userType === 'recruiter' ? 'active' : ''}`}
                onClick={() => handleUserTypeChange('recruiter')}
              >
                <span className="user-type-icon">💼</span>
                Recruiter
              </button>
            </div>

            <h1 className="title">Login</h1>
            
            <div className="otp-info">
              <p className="otp-sent-text">We have sent a 6-digit OTP to your email</p>
              <div className="email-display">
                <span className="email-text">{formData.email}</span>
                <button 
                  type="button" 
                  className="change-email-btn" 
                  onClick={() => {
                    setShowOTPForm(false);
                    setOtpValues(['', '', '', '', '', '']);
                  }}
                >
                  Change
                </button>
              </div>
              <p className="otp-expiry-text">OTP is valid for 10 minutes</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="otp-input-section">
              <label className="otp-label">Enter OTP</label>
              <div className="otp-inputs">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    className="otp-digit"
                    maxLength="1"
                    value={value}
                    data-index={index}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    autoComplete="off"
                  />
                ))}
              </div>
              <button 
                type="button" 
                className="resend-otp-btn" 
                onClick={handleResendOtp}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>

            <button 
              type="button" 
              className="submit-btn" 
              onClick={handleOtpVerification}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Login'}
            </button>

            <div className="login-method-toggle">
              <button 
                type="button" 
                className="toggle-method-btn" 
                onClick={toggleLoginMethod}
              >
                Login via Password
              </button>
            </div>

            <div className="register-link-container">
              <span className="register-text">New to TConnect? </span>
              <button onClick={() => navigate('/register')} className="register-link">
                Register
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="user-type-selector">
              <button 
                type="button"
                className={`user-type-btn ${userType === 'candidate' ? 'active' : ''}`}
                onClick={() => handleUserTypeChange('candidate')}
              >
                <span className="user-type-icon">👤</span>
                Candidate
              </button>
              <button 
                type="button"
                className={`user-type-btn ${userType === 'recruiter' ? 'active' : ''}`}
                onClick={() => handleUserTypeChange('recruiter')}
              >
                <span className="user-type-icon">💼</span>
                Recruiter
              </button>
            </div>

            <h1 className="title">Login</h1>

            <button className="google-btn" onClick={handleGoogleSignIn}>
              <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="input-label">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="input-field" 
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  autoComplete="email"
                />
              </div>

              {loginMethod === 'password' && (
                <div className="form-group">
                  <label className="input-label">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    className="input-field" 
                    placeholder="Enter your password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                    autoComplete="current-password"
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (loginMethod === 'otp' ? 'Sending OTP...' : 'Logging in...') 
                  : (loginMethod === 'otp' ? 'Send OTP' : 'Login')
                }
              </button>
            </form>

            {loginMethod === 'password' && (
              <div className="forgot-password-container">
                <a href="#" className="forgot-password-link">Forgot Password?</a>
              </div>
            )}

            <div className="login-method-toggle">
              <button 
                type="button" 
                className="toggle-method-btn" 
                onClick={toggleLoginMethod}
              >
                {loginMethod === 'otp' ? 'Login via Password' : 'Login via OTP'}
              </button>
            </div>

            <div className="register-link-container">
              <span className="register-text">New to TConnect? </span>
              <button onClick={() => navigate('/register')} className="register-link">
                Register
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;