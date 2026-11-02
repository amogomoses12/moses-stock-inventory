import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  Boxes,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail
} from 'lucide-react';

import { useStore } from '../context/StoreContext';

// Login Component
export default function Login({ admin = false }) {

  // State Management
  const [email, setEmail] = useState('admin@mosesstock.com');
  const [password, setPassword] = useState('password123');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  // Store and Navigation
  const { login } = useStore();
  const navigate = useNavigate();

  // Handle Form Submission
  const submit = e => {
    e.preventDefault();

    if (!email.includes('@') || password.length < 4) {
      setError(
        'Enter a valid email and a password of at least 4 characters.'
      );
      return;
    }

    login(email, admin ? 'admin' : 'staff');

    navigate('/dashboard');
  };

  return (
    <div className="auth-page">

      {/* Authentication Illustration Section */}
      <div className="auth-art">

        {/* Brand */}
        <div className="auth-brand">
          <div className="brand-mark">
            <Boxes size={23} />
          </div>

          <strong>Moses Stock</strong>
        </div>

        {/* Illustration Content */}
        <div className="auth-art-copy">
          <span className="eyebrow">
            INVENTORY, MADE SIMPLE
          </span>

          <h1>
            Know your stock.
            <br />
            <em>Grow your business.</em>
          </h1>

          <p>
            A smarter way to manage products, monitor stock levels
            and keep your business moving.
          </p>

          {/* Mini Statistics */}
          <div className="auth-mini-stats">
            <div>
              <strong>Real-time</strong>
              <span>Stock visibility</span>
            </div>

            <div>
              <strong>All in one</strong>
              <span>Inventory workspace</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-art-footer">
          © 2026 Moses Stock Inventory
        </div>
      </div>

      {/* Authentication Form Section */}
      <div className="auth-form-side">
        <form
          className="auth-form"
          onSubmit={submit}
        >

          {/* Mobile Brand */}
          <div className="auth-mobile-brand">
            <div className="brand-mark">
              <Boxes size={22} />
            </div>

            <strong>Moses Stock</strong>
          </div>

          {/* Form Heading */}
          <span className="eyebrow">
            {admin ? 'ADMINISTRATOR ACCESS' : 'WELCOME BACK'}
          </span>

          <h2>
            {admin ? 'Admin login' : 'Sign in to your account'}
          </h2>

          <p className="muted">
            Enter your details to access your inventory workspace.
          </p>

          {/* Error Message */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* Email Address */}
          <label>Email address</label>

          <div className="input-icon">
            <Mail size={17} />

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <label>Password</label>

          <div className="input-icon">
            <LockKeyhole size={17} />

            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />

            {/* Show / Hide Password */}
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShow(!show)}
            >
              {show ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="form-row">
            <label className="remember">
              <input
                type="checkbox"
                defaultChecked
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-button"
              onClick={() =>
                alert(
                  'Please contact your system administrator to reset your password.'
                )
              }
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            className="btn btn-primary auth-submit"
            type="submit"
          >
            Sign in
            <span>→</span>
          </button>

          {/* Login Navigation */}
          <div className="auth-switch">
            {admin ? (
              <>
                Not an admin? <Link to="/login">User login</Link>
              </>
            ) : (
              <>
                Need administrator access?{' '}
                <Link to="/admin-login">Admin login</Link>
              </>
            )}
          </div>

          {/* Demo Login Details */}
          <div className="demo-note">
            <strong>Demo access</strong>

            <span>Email: admin@mosesstock.com</span>
            <span>Password: password123</span>
          </div>

        </form>
      </div>
    </div>
  );
}