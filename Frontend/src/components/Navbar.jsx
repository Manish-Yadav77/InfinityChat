import React, { useState, useEffect } from 'react';
import { LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; // ← We'll create this CSS below

export default function Navbar({ onNewChat, openSettings, currentChatTitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Track window resize to toggle mobile vs desktop layout
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-b from-slate-900 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between h-16">

        {/* Left - Logo / Chat Title */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <button
            onClick={onNewChat}
            className="btn-new-chat"
          >
            <span className="text-lg">➕</span>
            <span className="btn-text">New Chat</span>
          </button>

          <div className="title flex items-center md:ml-20 gap-2 group transition-all">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-linear-to-r from-purple-600 via-blue-500 to-cyan-400 rounded-md flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <span className="text-xs sm:text-sm font-extrabold text-white">∞</span>
            </div>
            <span className="text-base sm:text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-cyan-300 tracking-wide group-hover:brightness-125 transition-all duration-300">
              InfinityChat
            </span>
          </div>


        </div>

        {/* Center - Logo (Mobile) */}
        {!isDesktop && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
              <span className="text-sm font-bold">✨</span>
            </div>
          </div>
        )}

        {/* Right - User / Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isDesktop && (
            <div className="flex items-center gap-2">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full ring-2 ring-slate-700"
              />
              <span className="user-name">{user?.name}</span>
            </div>
          )}

          {isDesktop && (
            <button
              onClick={openSettings}
              className="icon-btn"
              title="Settings"
            >
              <Settings size={20} />
            </button>
          )}

          {isDesktop && (
            <button
              onClick={handleLogout}
              className="icon-btn logout-btn"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}

          {!isDesktop && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="icon-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {!isDesktop && mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="p-4 space-y-3">
            <button
              onClick={() => {
                onNewChat();
                setMobileMenuOpen(false);
              }}
              className="mobile-item"
            >
              <span>➕</span> New Chat
            </button>

            <div className="px-4 py-2 border-t border-slate-700 pt-3">
              <p className="text-sm font-medium text-gray-400">Account</p>
              <p className="text-sm text-white mt-1">{user?.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.email}</p>
            </div>

            <button
              onClick={() => {
                openSettings();
                setMobileMenuOpen(false);
              }}
              className="mobile-item"
            >
              <Settings size={18} /> Settings
            </button>

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="mobile-item logout"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
