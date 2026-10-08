import React, { useState } from 'react';
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
  Layers, 
  Compass, 
  Users, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    notifications, 
    currentStudent, 
    switchUserRole,
    activeBookingHold,
    setIsAuthModalOpen 
  } = useHostel();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { id: 'rooms' as const, label: 'Rooms' },
    { id: 'floor-explorer' as const, label: 'Floor Explorer' },
    { id: 'facilities' as const, label: 'Facilities' },
    { id: 'roommates' as const, label: 'Roommates' },
    { id: 'gallery' as const, label: 'Gallery' },
    { id: 'location' as const, label: 'Location' },
    { id: 'how-it-works' as const, label: 'How It Works' },
  ];

  const handleNavClick = (viewId: typeof activeView) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
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
              <span className="text-[11px] text-[#A1927D] tracking-wider uppercase mt-1 block">
                KNUST · Ayeduase Newsite
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
            <div className="relative">
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

            {/* Quick Demo Persona / Mode Switcher */}
            <div className="relative hidden md:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (currentStudent.id === '20814522' && !currentStudent.hasPaid) {
                    setIsAuthModalOpen(true);
                  } else {
                    setShowRoleSelector(!showRoleSelector);
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#5B514B]/50 hover:bg-[#5B514B] text-xs font-medium text-[#F4EFE7] transition-colors border border-[#7D6E66]/40 cursor-pointer shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-[#FEFB58]" />
                <span>
                  {currentStudent.id === '20814522' && !currentStudent.hasPaid ? 'Sign In / Register' : currentStudent.name}
                </span>
              </motion.button>

              <AnimatePresence>
                {showRoleSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-[#2A2827] border border-[#5B514B] rounded-xl shadow-2xl p-2 z-50 text-xs"
                  >
                    <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-[#A1927D] font-semibold">
                      Student Account
                    </div>
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setShowRoleSelector(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#5B514B]/70 flex items-center justify-between text-[#FEFB58] font-bold cursor-pointer"
                    >
                      <span>Sign In / Create Account</span>
                    </button>
                    <div className="my-1 border-t border-[#5B514B]"></div>
                    <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[#7D6E66] font-semibold">
                      Demo Persona Mode
                    </div>
                    <button
                      onClick={() => {
                        switchUserRole('guest');
                        setShowRoleSelector(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#5B514B]/70 flex items-center justify-between text-[#F4EFE7] cursor-pointer"
                    >
                      <span>Prospective Student (Guest)</span>
                      {!currentStudent.hasPaid && <CheckCircle2 className="w-3.5 h-3.5 text-[#FEFB58]" />}
                    </button>
                    <button
                      onClick={() => {
                        switchUserRole('paid_student');
                        setShowRoleSelector(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#5B514B]/70 flex items-center justify-between text-[#F4EFE7] cursor-pointer"
                    >
                      <span>Confirmed Student (Paid)</span>
                      {currentStudent.hasPaid && <CheckCircle2 className="w-3.5 h-3.5 text-[#FEFB58]" />}
                    </button>
                    <div className="my-1 border-t border-[#5B514B]/50"></div>
                    <button
                      onClick={() => {
                        switchUserRole('admin');
                        setShowRoleSelector(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#5B514B]/70 flex items-center gap-2 text-[#FEFB58] font-medium cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Hostel Admin Portal</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm bg-[#FEFB58] text-[#2A2827] font-bold flex items-center justify-between cursor-pointer"
                >
                  <span>{currentStudent.id !== '20814522' ? currentStudent.name : 'Sign In / Register Portal'}</span>
                  <User className="w-4 h-4 text-[#2A2827]" />
                </button>

                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#F4EFE7] hover:bg-[#5B514B] flex items-center justify-between"
                >
                  <span>Student Dashboard</span>
                  {currentStudent.hasPaid && (
                    <span className="text-[10px] bg-[#FEFB58] text-[#2A2827] px-2 py-0.5 rounded font-bold">
                      Room {currentStudent.roomNumber}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#FEFB58] hover:bg-[#5B514B] flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Portal (120 Rooms)</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
