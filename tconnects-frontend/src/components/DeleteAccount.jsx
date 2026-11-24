import React from 'react';
import './DeleteAccount.css';

const DeleteAccount = () => {
  return (
    <div className="delete-account-page">
      <div className="delete-account-container">
        <h1>Delete Your VConnects Account</h1>
        <p className="intro">
          If you would like to permanently delete your VConnects account and associated data,
          please follow the steps below.
        </p>

        <div className="da-section">
          <h2>How to Request Deletion</h2>
          <ol>
            <li>
              Send an email to{' '}
              <a href="mailto:vconnects@vprotectsecurity.com">vconnects@vprotectsecurity.com</a>{' '}
              from the email address registered on your account.
            </li>
            <li>Use the subject line: <strong>"Account Deletion Request"</strong>.</li>
            <li>Include your registered name and phone number (if applicable) so we can locate your account.</li>
          </ol>
          <p>
            We will process your request and confirm once your account and data have been deleted,
            typically within <strong>30 days</strong> of receiving your request.
          </p>
        </div>

        <div className="da-section">
          <h2>What Gets Deleted</h2>
          <ul>
            <li>Your name, email address, and phone number</li>
            <li>Your profile information and account credentials</li>
            <li>Any preferences or settings associated with your account</li>
          </ul>
        </div>

        <div className="da-section">
          <h2>What May Be Retained</h2>
          <p>
            We may retain certain data such as transaction or activity records for a limited period
            where required for legal, accounting, or security purposes. Any such data is deleted
            once it is no longer required to be retained.
          </p>
        </div>

        <div className="da-section">
          <h2>Questions?</h2>
          <p>
            If you have any questions about this process, contact us at{' '}
            <a href="mailto:vconnects@vprotectsecurity.com">vconnects@vprotectsecurity.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;