import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, Settings, LogOut, Menu, X, ChevronDown, Bell, Search, Boxes, UserRound, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/login'); };
  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Boxes size={22} /></div>
          <div><strong>Moses Stock</strong><span>Inventory management</span></div>
          <button className="icon-btn sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close sidebar"><X size={19}/></button>
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav">
          {navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={19}/><span>{label}</span></NavLink>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><ShieldCheck size={18}/></div><strong>Keep your stock in check</strong><p>Stay on top of your inventory with real-time updates.</p></div>
          <button className="nav-link logout-link" onClick={signOut}><LogOut size={19}/><span>Log out</span></button>
          <div className="sidebar-user"><div className="avatar">{(user?.name || 'A').slice(0,1).toUpperCase()}</div><div className="user-meta"><strong>{user?.name || 'Administrator'}</strong><span>{user?.role || 'Admin account'}</span></div><button className="icon-btn" title="Log out" onClick={signOut}><LogOut size={17}/></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={21}/></button>
          <div className="topbar-search"><Search size={18}/><input placeholder="Search anything..." onKeyDown={e => { if (e.key === 'Enter') navigate('/products'); }} /><kbd>⌘ K</kbd></div>
          <div className="topbar-actions">
            <button className="icon-btn notification-btn" title="Notifications" onClick={() => navigate('/dashboard')}><Bell size={19}/><i /></button>
            <div className="profile-wrap">
              <button className="profile-button" onClick={() => setProfileOpen(!profileOpen)}><div className="avatar">{(user?.name || 'A').slice(0,1).toUpperCase()}</div><span><strong>{user?.name || 'Admin'}</strong><small>Administrator</small></span><ChevronDown size={15}/></button>
              {profileOpen && <div className="profile-menu"><button onClick={() => { setProfileOpen(false); navigate('/settings'); }}><UserRound size={16}/> Account settings</button><button onClick={signOut}><LogOut size={16}/> Sign out</button></div>}
            </div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
