import React, { useEffect, useState } from 'react';
import api from '../config/api';
import toast from 'react-hot-toast';

/* ------------------------------------------------------------------
   Shared 6-digit OTP step used by BOTH LoginPage and RegistrationPage.

   Props
   - email         the address the code was sent to
   - role          'candidate' | 'recruiter'
   - onResend()    async function that asks the server for a new code
   - onVerified(data)  called with the server response after a correct code
   - onChangeEmail()   go back to the email step
   - submitLabel   text on the button ("Log in" / "Verify & create account")
------------------------------------------------------------------- */

const Arrow = () => (
  <i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></i>
);

const EMPTY_OTP = ['', '', '', '', '', ''];
const RESEND_SECONDS = 60; // must match OTP_RESEND_SECONDS on the server

// Where to send the user after login/register. Fill these in with your dashboard
// profile pages (e.g. '/candidate/profile'); leave null to just use the default page.
export const PROFILE_SETUP_PATH = { candidate: null, recruiter: null };

export const getErrorMessage = (err, fallback) => {
  if (err.response?.data) {
    const d = err.response.data;
    if (d.errors) {
      const first = Object.values(d.errors)[0];
      return Array.isArray(first) ? first[0] : first;
    }
    return d.detail || d.message || d.error || fallback;
  }
  if (err.request) return 'Cannot connect to server. Please check your connection.';
  return fallback;
};

export default function OtpForm({ email, role, onResend, onVerified, onChangeEmail, submitLabel = 'Verify' }) {
  const [otpValues, setOtpValues] = useState(EMPTY_OTP);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS); // a code was just sent
  const [error, setError] = useState('');

  // resend countdown
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const focusOtp = (i) => document.querySelector(`input[data-index="${i}"]`)?.focus();

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otpValues];
    next[index] = value.slice(-1);
    setOtpValues(next);
    setError('');
    if (value && index < 5) focusOtp(index + 1);
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      focusOtp(index - 1);
      const next = [...otpValues];
      next[index - 1] = '';
      setOtpValues(next);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...EMPTY_OTP];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || '';
    setOtpValues(next);
    setError('');
    focusOtp(Math.min(pasted.length, 5));
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      await onResend();
      setOtpValues(EMPTY_OTP);
      setCooldown(RESEND_SECONDS);
      setTimeout(() => focusOtp(0), 100);
      toast.success('New code sent! Check your email.');
    } catch (err) {
      const wait = err.response?.data?.retry_after;
      if (wait) setCooldown(wait);
      setError(getErrorMessage(err, 'Failed to resend the code.'));
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    const code = otpValues.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    try {
      const response = await api.post('/api/auth/verify-otp/', { email, code, role });
      if (response.data?.user) {
        await onVerified(response.data);
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid or expired code.'));
      setOtpValues(EMPTY_OTP);
      setTimeout(() => focusOtp(0), 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const complete = otpValues.join('').length === 6;

  return (
    <div>
      {error && <div className="va-error" role="alert">{error}</div>}

      <p className="va-otpinfo">
        We sent a 6-digit code to <strong>{email}</strong>{' '}
        <button type="button" className="va-link" onClick={onChangeEmail} disabled={isSubmitting}>
          Change
        </button>
      </p>

      <div className="va-otps">
        {otpValues.map((value, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            className="va-otp"
            maxLength="1"
            value={value}
            data-index={index}
            aria-label={`Digit ${index + 1}`}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={handleOtpPaste}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            autoFocus={index === 0}
            disabled={isSubmitting}
          />
        ))}
      </div>

      <div className="va-otpmeta">
        <span>Code is valid for 10 minutes</span>
        <button
          type="button"
          className="va-link"
          onClick={handleResend}
          disabled={cooldown > 0 || isResending || isSubmitting}
        >
          {isResending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
      </div>

      <button
        type="button"
        className={`va-btn${complete ? '' : ' idle'}`}
        onClick={handleVerify}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verifying...' : submitLabel}<Arrow />
      </button>
    </div>
  );
}
