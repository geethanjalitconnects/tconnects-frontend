import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { checkAuth } from '../config/api';
import toast from 'react-hot-toast';
import AuthLayout, { RoleSwitch } from './AuthLayout';
import OtpForm, { PROFILE_SETUP_PATH, getErrorMessage } from './OtpForm';

const Arrow = () => (
  <i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></i>
);

const personalEmailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
  'yandex.com', 'zoho.com', 'gmx.com', 'live.com',
  'msn.com', 'rediffmail.com', 'inbox.com',
];

/* Register = email + one-time code. No password.
   Name, phone number etc. are added later from the dashboard profile. */
const RegistrationPage = ({ onRegisterSuccess }) => {
  // ?role=candidate|recruiter pre-selects the account (the welcome card uses this)
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role');

  const [userType, setUserType] = useState(roleFromUrl === 'recruiter' ? 'recruiter' : 'candidate');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);

  const navigate = useNavigate();

  const cleanEmail = email.trim().toLowerCase();

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setErrors({});
    setEmail('');
    setShowOTPForm(false);
  };

  const validateForm = () => {
    const e = {};
    if (!cleanEmail) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(cleanEmail)) e.email = 'Please enter a valid email address';
    else if (userType === 'recruiter') {
      const domain = cleanEmail.split('@')[1];
      if (personalEmailDomains.includes(domain)) {
        e.email = 'Please use your company email address, not a personal email';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Creates the (unverified) account and emails the code. Safe to call again to resend.
  const requestCode = () => api.post('/api/auth/register/', { email: cleanEmail, role: userType });

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (isSubmitting || !validateForm()) return;
    setIsSubmitting(true);

    try {
      await requestCode();
      setShowOTPForm(true);
      toast.success('Code sent! Check your email.');
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors) {
        const apiErrors = {};
        Object.keys(data.errors).forEach((key) => {
          const msg = Array.isArray(data.errors[key]) ? data.errors[key][0] : data.errors[key];
          apiErrors[key === 'role' ? 'general' : key] = msg;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: getErrorMessage(error, 'Registration failed. Please try again.') });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Called by <OtpForm> after the server accepted the code (account is now verified + logged in)
  const handleVerified = async (data) => {
    toast.success('Welcome to VConnects!');
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const authStatus = await checkAuth();
      if (!authStatus.authenticated) {
        setErrors({ general: 'Account created but session not established. Please log in.' });
        setShowOTPForm(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    }

    const userData = {
      id: data.user?.id,
      name: data.user?.full_name,
      email: data.user?.email,
      role: data.user?.role,
    };

    toast('Next, add your name and phone number in your profile.', { icon: '📝', duration: 5000 });

    const target = PROFILE_SETUP_PATH[userData.role] || '/';
    setTimeout(() => {
      navigate(target);
      if (typeof onRegisterSuccess === 'function') onRegisterSuccess(userData);
    }, 1200);
  };

  const footer = (
    <>
      Already have an account?{' '}
      <button type="button" className="va-link" onClick={() => navigate('/login')} disabled={isSubmitting}>Log in</button>
    </>
  );

  return (
    <AuthLayout role={userType} mode="register" footer={footer}>
      <RoleSwitch value={userType} onChange={handleUserTypeChange} disabled={isSubmitting} />

      {errors.general && <div className="va-error" role="alert">{errors.general}</div>}

      {showOTPForm ? (
        <OtpForm
          email={cleanEmail}
          role={userType}
          onResend={requestCode}
          onVerified={handleVerified}
          onChangeEmail={() => { setShowOTPForm(false); setErrors({}); }}
          submitLabel="Verify & create account"
        />
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="va-field">
            <label className="va-label" htmlFor="va-email">{userType === 'recruiter' ? 'Company email' : 'Email address'}</label>
            <input
              id="va-email"
              type="email"
              name="email"
              className={`va-input${errors.email ? ' err' : ''}`}
              placeholder={userType === 'recruiter' ? 'you@yourcompany.com' : 'you@example.com'}
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({}); }}
              disabled={isSubmitting}
              autoComplete="email"
              autoFocus
            />
            {errors.email && <div className="va-etext">{errors.email}</div>}
            {!errors.email && !email && userType === 'recruiter' && (
              <div className="va-hint">Use your official company email (not Gmail, Yahoo, etc.)</div>
            )}
            {!errors.email && !email && userType === 'candidate' && (
              <div className="va-hint">We'll email you a 6-digit code. No password needed.</div>
            )}
          </div>

          <button
            type="submit"
            className={`va-btn${!email ? ' idle' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending code...' : 'Send me a code'}<Arrow />
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default RegistrationPage;
