import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { checkAuth } from '../config/api';
import './LoginPage.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import toast from 'react-hot-toast';

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
  const [showPassword, setShowPassword] = useState(false);

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



  // ✅ FIXED: always navigate to home page after login
  const handleLoginSuccess = async (userData) => {
    toast.success(`Welcome back, ${userData.full_name?.split(' ')[0] || 'there'}! 👋`);

    await new Promise(resolve => setTimeout(resolve, 150));

    try {
      const authStatus = await checkAuth();
      if (!authStatus.authenticated) {
        setError('Login successful but session not established. Please try again.');
        return;
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
    }

    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }

    // ✅ Navigate to home for all roles
    setTimeout(() => {
      navigate('/');
    }, 1200);
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
          toast.success('OTP sent! Check your email 📧');
        }
      } else {
        const response = await api.post('/api/auth/login/', {
          email: formData.email,
          password: formData.password,
          role: userType
        });

        const userData = response.data.user;
        if (userData) {
          await handleLoginSuccess(userData);
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (error) {
      let errorMsg = 'Login failed. Please try again.';
      if (error.response?.data) {
        errorMsg = error.response.data.detail ||
                   error.response.data.message ||
                   error.response.data.error ||
                   errorMsg;
      } else if (error.request) {
        errorMsg = 'Cannot connect to server. Please check your connection.';
      }
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
      toast.success('New OTP sent! Check your email 📧');
    } catch (error) {
      const errorMsg = error.response?.data?.detail ||
                      error.response?.data?.message ||
                      'Failed to resend OTP.';
      setError(errorMsg);
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
      const userData = response.data.user;
      if (userData) {
        await handleLoginSuccess(userData);
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail ||
                      error.response?.data?.message ||
                      'Invalid or expired OTP.';
      setError(errorMsg);
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
              <span className="register-text">New to TConnects? </span>
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
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="input-field"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                    </button>
                  </div>
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
              <span className="register-text">New to TConnects? </span>
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