import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../config/api';
import './RegistrationPage.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

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

      const userData = {
        id: response.data.user?.id,
        name: response.data.user?.full_name,
        email: response.data.user?.email,
        role: response.data.user?.role
      };

      // Show success popup
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);

        // Redirect based on role
        if (userType === 'candidate') {
          navigate('/candidate-dashboard');
        } else {
          navigate('/recruiter-dashboard');
        }

        // Notify parent component
        if (typeof onRegisterSuccess === 'function') {
          onRegisterSuccess(userData);
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
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                className={`input-field ${errors.password ? 'error' : ''}`} 
                placeholder="Create a strong password" 
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
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
            {errors.password && <div className="error-text">{errors.password}</div>}
            {formData.password && (formData.password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) && (
              <div className="info-text" style={{ fontSize: '0.85rem' }}>
                Must be 8+ characters with uppercase, lowercase, and numbers
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="input-label">Confirm Password *</label>
            <div className="password-input-wrapper">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword"
                className={`input-field ${errors.confirmPassword ? 'error' : ''}`} 
                placeholder="Confirm your password" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </button>
            </div>
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
        <div className="popup-overlay">
          <div className="popup-card">
            <div className="popup-icon">✓</div>
            <h2 className="popup-title">Registration Successful!</h2>
            <p className="popup-message">Your account has been created successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
