import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
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

  const navigate = useNavigate();

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

  // Common login success handler
  const handleLoginSuccess = (userData) => {
    console.log('✅ Login successful, user data:', userData);
    showSuccessPopup('Login successful!');
    
    // Notify parent component immediately
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
    
    // Navigate after showing success
    setTimeout(() => {
      if (userData.role === 'candidate') {
        navigate('/candidate-dashboard');
      } else if (userData.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      }
    }, 1200);
  };

  // Submit handler (OTP or password)
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
        console.log('📧 Sending OTP to:', formData.email);
        
        const response = await api.post('/api/auth/send-otp/', {
          email: formData.email,
          role: userType
        });

        console.log('✅ OTP response:', response.data);
        
        if (response.data) {
          setShowOTPForm(true);
          showSuccessPopup('OTP sent successfully! Check your email.');
        }
      } else {
        // Password login
        console.log('🔐 Password login for:', formData.email);
        
        const response = await api.post('/api/auth/login/', {
          email: formData.email,
          password: formData.password,
          role: userType
        });

        console.log('✅ Login response:', response.data);
        
        const userData = response.data.user;
        if (userData) {
          handleLoginSuccess(userData);
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMsg = error.response?.data?.detail ||
                       error.response?.data?.message ||
                       'Login failed. Please try again.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP helpers
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
      console.log('🔐 Verifying OTP:', otpValue);
      
      const response = await api.post('/api/auth/verify-otp/', {
        email: formData.email,
        code: otpValue,
        role: userType
      });

      console.log('✅ OTP verification response:', response.data);
      
      const userData = response.data.user;
      if (userData) {
        handleLoginSuccess(userData);
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ OTP verification error:', error);
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