'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { 
  Building2, 
  MapPin, 
  Bell, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  CheckCircle2,
  LogOut,
  ChevronDown,
  Users
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    notifications, 
    currentStudent, 
    isLoggedIn,
    logout,
    activeBookingHold,
    setIsAuthModalOpen 
  } = useHostel();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { id: 'rooms' as const, label: 'Rooms' },
    { id: 'floor-explorer' as const, label: 'Floor Explorer' },
    { id: 'roommates' as const, label: 'Roommates' },
    { id: 'gallery' as const, label: 'Gallery' },
  ];

  const handleNavClick = (viewId: typeof activeView) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
    setShowUserDropdown(false);
    setShowNotifDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Optional top hold countdown banner if user has an active 10-minute hold */}
      <AnimatePresence>
        {activeBookingHold && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#2A2827] text-[#FEFB58] text-xs py-1.5 px-4 text-center border-b border-[#5B514B] flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-[#FEFB58] animate-ping"></span>
            <span>
              You have a temporary hold on <strong>Room Space</strong>. Hold expires in less than 10 minutes.
            </span>
            <button 
              onClick={() => setActiveView('rooms')}
              className="underline hover:text-white ml-2 text-xs font-semibold cursor-pointer"
            >
              Review Room
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#2A2827]/95 border-b border-[#5B514B]/60 text-[#F4EFE7] backdrop-blur-md transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Zone 1: Single text element Brand wordmark */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#5B514B] flex items-center justify-center text-[#FEFB58] group-hover:bg-[#7D6E66] transition-colors shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4EFE7] block leading-none">
                Mushia Hostel
              </span>
            </div>
          </motion.button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#A5ABAA]">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 cursor-pointer whitespace-nowrap transition-colors ${
                    isActive ? 'text-[#FEFB58] font-bold' : 'hover:text-[#F4EFE7]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FEFB58] rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            
            {/* Notifications Trigger */}
            <div className="relative" ref={notifMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="w-10 h-10 rounded-lg bg-[#5B514B]/40 hover:bg-[#5B514B] flex items-center justify-center text-[#F4EFE7] transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FEFB58] text-[#2A2827] text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#2A2827] border border-[#5B514B] rounded-xl shadow-2xl p-4 z-50 text-sm"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#5B514B]/60 mb-2">
                      <span className="font-semibold text-[#F4EFE7]">Hostel Updates</span>
                      <span className="text-xs text-[#A1927D]">{notifications.length} notices</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-[#A5ABAA] py-4 text-center">No notifications yet.</p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div key={n.id} className="p-2.5 rounded-lg bg-[#5B514B]/30 hover:bg-[#5B514B]/60 transition-colors">
                            <p className="font-medium text-xs text-[#FEFB58] mb-0.5">{n.title}</p>
                            <p className="text-xs text-[#F4EFE7]/80 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-[#A1927D] mt-1 block">{n.timestamp}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Student Account / Auth State */}
            {!isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#5B514B]/50 hover:bg-[#5B514B] text-xs font-semibold text-[#FEFB58] transition-colors border border-[#7D6E66]/40 cursor-pointer shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-[#FEFB58]" />
                <span>Sign In / Register</span>
              </motion.button>
            ) : (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#5B514B]/50 hover:bg-[#5B514B] text-xs font-semibold text-[#F4EFE7] transition-colors border border-[#7D6E66]/40 cursor-pointer shadow-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FEFB58] text-[#2A2827] font-bold text-[10px] flex items-center justify-center shrink-0">
                    {currentStudent.name ? currentStudent.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{currentStudent.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#A5ABAA] transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-[#2A2827] border border-[#5B514B] rounded-xl shadow-2xl p-2 z-50 text-xs"
                    >
                      {/* User Account Info */}
                      <div className="px-3 py-2 border-b border-[#5B514B]/50">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#F4EFE7] truncate">{currentStudent.name}</span>
                          {currentStudent.hasPaid ? (
                            <span className="text-[10px] bg-[#FEFB58] text-[#2A2827] font-bold px-1.5 py-0.5 rounded shrink-0">
                              Room {currentStudent.roomNumber}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-[#5B514B] text-[#FEFB58] font-medium px-1.5 py-0.5 rounded shrink-0">
                              Applicant
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#A5ABAA] truncate mt-0.5">
                          {currentStudent.email || `ID: ${currentStudent.knustId}`}
                        </p>
                      </div>

                      {/* Links */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleNavClick('dashboard');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#5B514B]/70 flex items-center gap-2 text-[#F4EFE7] hover:text-[#FEFB58] transition-colors cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-[#FEFB58]" />
                          <span>Student Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            handleNavClick('roommates');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#5B514B]/70 flex items-center gap-2 text-[#F4EFE7] hover:text-[#FEFB58] transition-colors cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-[#FEFB58]" />
                          <span>Roommate Matching</span>
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div className="pt-1 border-t border-[#5B514B]/50">
                        <button
                          onClick={async () => {
                            setShowUserDropdown(false);
                            await logout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/15 flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-400" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Dashboard / Admin Shortcut */}
            {currentStudent.hasPaid ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick('dashboard')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeView === 'dashboard'
                    ? 'bg-[#5B514B] text-[#FEFB58]'
                    : 'bg-[#5B514B]/50 text-[#F4EFE7] hover:bg-[#5B514B]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Dashboard</span>
              </motion.button>
            ) : null}

            {/* Primary Solar Yellow CTA: Book a Room */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavClick('rooms')}
              className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-[#2A2827] bg-[#FEFB58] hover:bg-[#fff945] rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Book a Room</span>
            </motion.button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#5B514B]/50 text-[#F4EFE7] hover:bg-[#5B514B] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-[#2A2827] border-t border-[#5B514B] px-4 pt-3 pb-6 space-y-2 overflow-hidden"
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    activeView === link.id
                      ? 'bg-[#5B514B] text-[#FEFB58] font-bold'
                      : 'text-[#F4EFE7] hover:bg-[#5B514B]/50'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-3 border-t border-[#5B514B]/50 space-y-2">
                {!isLoggedIn ? (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm bg-[#FEFB58] text-[#2A2827] font-bold flex items-center justify-between cursor-pointer shadow-sm"
                  >
                    <span>Sign In / Register Portal</span>
                    <User className="w-4 h-4 text-[#2A2827]" />
                  </button>
                ) : (
                  <>
                    <div className="p-3 rounded-lg bg-[#5B514B]/30 border border-[#5B514B]/60 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#FEFB58] text-[#2A2827] font-bold text-xs flex items-center justify-center shrink-0">
                          {currentStudent.name ? currentStudent.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#F4EFE7] leading-tight truncate">{currentStudent.name}</p>
                          <p className="text-[11px] text-[#A5ABAA] truncate">{currentStudent.email || `ID: ${currentStudent.knustId}`}</p>
                        </div>
                      </div>
                      {currentStudent.hasPaid && (
                        <span className="text-[10px] bg-[#FEFB58] text-[#2A2827] px-2 py-0.5 rounded font-bold shrink-0 ml-2">
                          Room {currentStudent.roomNumber}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#F4EFE7] hover:bg-[#5B514B] flex items-center justify-between cursor-pointer"
                    >
                      <span>Student Dashboard</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('roommates')}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#F4EFE7] hover:bg-[#5B514B] flex items-center justify-between cursor-pointer"
                    >
                      <span>Roommate Matching</span>
                    </button>

                    <button
                      onClick={async () => {
                        setMobileMenuOpen(false);
                        await logout();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Log Out</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
