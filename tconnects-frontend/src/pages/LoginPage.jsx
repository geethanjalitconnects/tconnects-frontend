import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api, { checkAuth } from '../config/api';
import toast from 'react-hot-toast';
import AuthLayout, { RoleSwitch } from './AuthLayout';
import OtpForm, { PROFILE_SETUP_PATH, getErrorMessage } from './OtpForm';

const Arrow = () => (
  <i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></i>
);

// Login = email + one-time code. No password.
const LoginPage = ({ onLoginSuccess }) => {
  const [userType, setUserType] = useState('candidate');
  const [email, setEmail] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // After login go back to the guarded page the user came from, otherwise home
  // Where to go after login: router state first, then a safe relative ?next= link (e.g. from a mentor profile).
  const nextParam = new URLSearchParams(location.search).get('next') || '';
  const safeNext = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '';
  const redirectTo = location.state?.from || safeNext || '/';

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setEmail('');
    setShowOTPForm(false);
    setError('');
  };

  const sendCode = () =>
    api.post('/api/auth/send-otp/', { email: email.trim().toLowerCase(), role: userType });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setIsSubmitting(true);

    try {
      await sendCode();
      setShowOTPForm(true);
      toast.success('Code sent! Check your email.');
    } catch (err) {
      const actualRole = err.response?.data?.actual_role;
      if (err.response?.status === 404) {
        setError('No account found with this email. Please sign up first.');
      } else if (err.response?.status === 403 && ['candidate', 'recruiter'].includes(actualRole)) {
        // wrong tab: switch to the account's real role and keep the typed email
        setUserType(actualRole);
        setError(`This email is registered as a ${actualRole}. We switched the tab for you, press "Send me a code" again.`);
      } else {
        setError(getErrorMessage(err, 'Could not send the code. Please try again.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Called by <OtpForm> after the server accepted the code
  const handleVerified = async (data) => {
    const userData = data.user;
    toast.success(`Welcome back${userData.full_name ? `, ${userData.full_name.split(' ')[0]}` : ''}!`);
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const authStatus = await checkAuth();
      if (!authStatus.authenticated) {
        setError('Login successful but session not established. Please try again.');
        return;
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    }

    if (data.needs_profile_setup) {
      toast('Please add your name and phone number in your profile.', { icon: '📝', duration: 5000 });
    }

    if (onLoginSuccess) onLoginSuccess(userData);

    const target =
      data.needs_profile_setup && PROFILE_SETUP_PATH[userData.role]
        ? PROFILE_SETUP_PATH[userData.role]
        : redirectTo;
    setTimeout(() => navigate(target, { replace: true }), 1200);
  };

  const footer = (
    <>
      Don't have an account?{' '}
      <button type="button" className="va-link" onClick={() => navigate('/register')}>Sign up</button>
    </>
  );

  return (
    <AuthLayout role={userType} mode="login" footer={footer}>
      <RoleSwitch value={userType} onChange={handleUserTypeChange} disabled={isSubmitting} />

      {error && <div className="va-error" role="alert">{error}</div>}

      {showOTPForm ? (
        <OtpForm
          email={email.trim().toLowerCase()}
          role={userType}
          onResend={sendCode}
          onVerified={handleVerified}
          onChangeEmail={() => { setShowOTPForm(false); setError(''); }}
          submitLabel="Log in"
        />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="va-field">
            <label className="va-label" htmlFor="va-email">Email address</label>
            <input
              id="va-email"
              type="email"
              name="email"
              className="va-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className={`va-btn${!email ? ' idle' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending code...' : 'Send me a code'}
            <Arrow />
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
