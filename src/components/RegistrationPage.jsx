import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../config/api';
import './RegistrationPage.css';

const RegistrationPage = ({ onRegisterSuccess, onNavigateLogin }) => {
  const [userType, setUserType] = useState('candidate');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const personalEmailDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
    'yandex.com', 'zoho.com', 'gmx.com', 'live.com',
    'msn.com', 'rediffmail.com', 'inbox.com'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setErrors({});
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const validateFullName = (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return 'Name is required';
    if (trimmedName.length < 2) return 'Name must be at least 2 characters';
    return null;
  };

  const validateCompanyEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address';
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (personalEmailDomains.includes(domain)) {
      return 'Please use your company email address, not a personal email';
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateFullName(formData.fullName);
    if (nameError) newErrors.fullName = nameError;
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (userType === 'recruiter') {
      const companyEmailError = validateCompanyEmail(formData.email);
      if (companyEmailError) newErrors.email = companyEmailError;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const response = await api.post('/api/auth/register/', {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: userType
      });

      if (response.data.tokens) {
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
      }

      const userData = {
        id: response.data.user?.id,
        name: response.data.user?.full_name,
        email: response.data.user?.email,
        userType: response.data.user?.role || userType
      };

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        if (typeof onRegisterSuccess === 'function') {
          const targetDashboard = userType === 'candidate' ? 'myaccount' : 'recruiter';
          onRegisterSuccess(userData, targetDashboard);
        }
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data) {
        const responseData = error.response.data;
        
        if (responseData.errors) {
          const apiErrors = {};
          const fieldMapping = {
            'full_name': 'fullName',
            'email': 'email',
            'password': 'password',
            'role': 'userType',
            'non_field_errors': 'general'
          };
          
          Object.keys(responseData.errors).forEach(key => {
            const frontendField = fieldMapping[key] || key;
            const errorMessage = Array.isArray(responseData.errors[key]) 
              ? responseData.errors[key][0] 
              : responseData.errors[key];
            apiErrors[frontendField] = errorMessage;
          });
          
          setErrors(apiErrors);
        } else {
          const errorMsg = responseData.detail || 
                         responseData.error || 
                         responseData.message || 
                         'Registration failed. Please check your information.';
          setErrors({ general: errorMsg });
        }
      } else if (error.request) {
        setErrors({ general: 'Cannot connect to server. Please try again.' });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google/login/?user_type=${userType}`;
  };

  return (
    <div className="register-page">
      <div className="register-container">
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

        <h1 className="title">Create Account</h1>

        {errors.general && (
          <div className="error-message" style={{ marginBottom: '16px' }}>
            {errors.general}
          </div>
        )}

        <button className="google-btn" onClick={handleGoogleSignUp} disabled={isSubmitting}>
          <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Full Name *</label>
            <input 
              type="text" 
              name="fullName"
              className={`input-field ${errors.fullName ? 'error' : ''}`} 
              placeholder="Enter your name" 
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.fullName && <div className="error-text">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label className="input-label">
              {userType === 'recruiter' ? 'Company Email *' : 'Email *'}
            </label>
            <input 
              type="email" 
              name="email"
              className={`input-field ${errors.email ? 'error' : ''}`} 
              placeholder={userType === 'recruiter' ? 'Enter your company email' : 'Enter your email address'} 
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
            {!errors.email && !formData.email && userType === 'recruiter' && (
              <div className="info-text">
                Please use your official company email (not Gmail, Yahoo, etc.)
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="input-label">Password *</label>
            <input 
              type="password" 
              name="password"
              className={`input-field ${errors.password ? 'error' : ''}`} 
              placeholder="Create a strong password" 
              value={formData.password}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
            {!errors.password && !formData.password && (
              <div className="info-text">
                Must be 8+ characters with uppercase, lowercase, and numbers
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="input-label">Confirm Password *</label>
            <input 
              type="password" 
              name="confirmPassword"
              className={`input-field ${errors.confirmPassword ? 'error' : ''}`} 
              placeholder="Confirm your password" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="login-link-container">
          <span className="login-text">Already have an account? </span>
          <button onClick={() => navigate('/login')} className="login-link" disabled={isSubmitting}>
            Login
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon-wrapper">✓</div>
            <h2 className="success-title">Registration Successful!</h2>
            <p className="success-text">Your account has been created successfully.</p>
            <p className="success-subtext">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;