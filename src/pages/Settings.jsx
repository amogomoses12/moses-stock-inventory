import React, { useState } from 'react';

import {
  LogOut,
  Save,
  Settings as SettingsIcon,
  UserRound,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

// Settings Component
export default function Settings() {

  // Store Data
  const {
    settings,
    setSettings,
    user,
    logout
  } = useStore();

  // State Management
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  // Navigation
  const navigate = useNavigate();

  // Save Settings
  const save = e => {
    e.preventDefault();

    setSettings({
      ...form,
      lowStock: Math.max(0, Number(form.lowStock))
    });

    setSaved(true);

    setTimeout(() => setSaved(false), 2500);
  };

  // Handle Logout
  const signOut = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div>

      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">PREFERENCES</span>

          <h1>Settings</h1>

          <p>
            Manage your account and customise your inventory workspace.
          </p>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="settings-layout">

        {/* Settings Navigation */}
        <aside className="settings-nav panel">

          <div className="settings-nav-item active">
            <SlidersHorizontal size={17} />
            General settings
          </div>

          <div className="settings-nav-item">
            <UserRound size={17} />
            Account
          </div>

          <div className="settings-nav-item">
            <ShieldCheck size={17} />
            Security
          </div>

        </aside>

        {/* Settings Main Content */}
        <div className="settings-main">

          {/* General Preferences Form */}
          <form
            className="panel settings-card"
            onSubmit={save}
          >

            {/* Section Heading */}
            <div className="settings-section-head">
              <div className="settings-section-icon">
                <SettingsIcon size={20} />
              </div>

              <div>
                <h3>General preferences</h3>

                <p>
                  Set up the way your inventory workspace operates.
                </p>
              </div>
            </div>

            {/* Business Name */}
            <div className="field">
              <label>Business / store name</label>

              <input
                value={form.businessName}
                onChange={e =>
                  setForm({
                    ...form,
                    businessName: e.target.value
                  })
                }
              />

              <small>
                This name appears across your workspace.
              </small>
            </div>

            {/* Currency and Stock Threshold */}
            <div className="settings-form-row">

              {/* Currency */}
              <div className="field">
                <label>Currency</label>

                <select
                  value={form.currency}
                  onChange={e =>
                    setForm({
                      ...form,
                      currency: e.target.value
                    })
                  }
                >
                  <option value="NGN">
                    NGN — Nigerian Naira (₦)
                  </option>

                  <option value="USD">
                    USD — US Dollar ($)
                  </option>

                  <option value="GBP">
                    GBP — British Pound (£)
                  </option>

                  <option value="EUR">
                    EUR — Euro (€)
                  </option>
                </select>
              </div>

              {/* Low Stock Alert Threshold */}
              <div className="field">
                <label>Low-stock alert threshold</label>

                <input
                  type="number"
                  min="0"
                  value={form.lowStock}
                  onChange={e =>
                    setForm({
                      ...form,
                      lowStock: e.target.value
                    })
                  }
                />

                <small>
                  Products at or below this quantity are flagged.
                </small>
              </div>

            </div>

            {/* Save Settings */}
            <div className="settings-save-row">

              <span className={saved ? 'save-success' : 'muted'}>
                {
                  saved
                    ? '✓ Settings saved successfully'
                    : 'Changes are saved on this device.'
                }
              </span>

              <button className="btn btn-primary">
                <Save size={16} />
                Save changes
              </button>

            </div>
          </form>

          {/* Admin Account Section */}
          <section className="panel settings-card account-card">

            {/* Account Section Heading */}
            <div className="settings-section-head">
              <div className="settings-section-icon">
                <UserRound size={20} />
              </div>

              <div>
                <h3>Admin account</h3>

                <p>
                  Your current signed-in account details.
                </p>
              </div>
            </div>

            {/* Account Details */}
            <div className="account-detail">

              <div className="avatar avatar-large">
                {(user?.name || 'A').slice(0, 1).toUpperCase()}
              </div>

              <div>
                <strong>
                  {user?.name || 'Administrator'}
                </strong>

                <span>
                  {user?.email || 'admin@mosesstock.com'}
                </span>

                <small>
                  Administrator access
                </small>
              </div>

            </div>

            {/* Logout Section */}
            <div className="logout-area">

              <div>
                <strong>Sign out of Moses Stock</strong>

                <p>
                  You will need to sign in again to access your inventory.
                </p>
              </div>

              <button
                className="btn btn-danger-outline"
                onClick={signOut}
              >
                <LogOut size={16} />
                Log out
              </button>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}