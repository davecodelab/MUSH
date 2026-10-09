'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, Phone, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useHostel } from '../context/HostelContext';
import { loginUser, registerUser } from '../services/api';
import { StudentProfile } from '../types';

export const LoginRegisterModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setCurrentStudent } = useHostel();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    gender: 'MALE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const formatDjangoError = (err: any): string => {
    if (!err.response) {
      return 'Network error: Cannot reach authentication service at http://localhost:8000. Please ensure the backend is running.';
    }
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    if (typeof data === 'object') {
      const messages = Object.entries(data)
        .map(([field, msgs]: [string, any]) => {
          const formattedField = field.replace('_', ' ').toUpperCase();
          const detail = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
          return `${formattedField}: ${detail}`;
        })
        .join('\n');
      if (messages) return messages;
    }
    return 'Authentication failed. Please verify your credentials.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        const response = await loginUser({
          username: formData.username.trim(),
          password: formData.password,
        });

        const user = response.user;
        const profileName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
        const profileFirstName = user.first_name || (profileName ? profileName.split(' ')[0] : '') || user.username;

        const profile: StudentProfile = {
          id: String(user.id || user.username),
          name: profileName,
          firstName: profileFirstName,
          knustId: user.knustId || user.username,
          email: user.email || '',
          phone: user.phone || user.phone_number || '',
          gender: user.gender === 'Female' || user.gender === 'FEMALE' ? 'Female' : 'Male',
          program: 'Undergraduate Student',
          level: 'Level 100',
          hasPaid: Boolean(user.hasPaid),
          bookingId: user.bookingId || undefined,
          roomNumber: user.roomNumber || undefined,
          spaceNumber: user.spaceNumber || undefined,
        };

        setCurrentStudent(profile);
        setSuccessMsg('Welcome back! Signed in successfully.');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMsg(null);
        }, 700);
      } else {
        const response = await registerUser({
          username: formData.username.trim(),
          password: formData.password,
          email: formData.email.trim(),
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          phone_number: formData.phone_number.trim(),
          gender: formData.gender,
        });

        const user = response.user;
        const regName = user.name || `${formData.first_name || ''} ${formData.last_name || ''}`.trim() || user.username;
        const regFirstName = user.first_name || formData.first_name.trim() || (regName ? regName.split(' ')[0] : '') || user.username;

        const profile: StudentProfile = {
          id: String(user.id || user.username),
          name: regName,
          firstName: regFirstName,
          knustId: user.knustId || user.username,
          email: user.email || '',
          phone: user.phone || user.phone_number || '',
          gender: user.gender === 'Female' || user.gender === 'FEMALE' ? 'Female' : 'Male',
          program: 'Undergraduate Student',
          level: 'Level 100',
          hasPaid: false,
          bookingId: user.bookingId || undefined,
          roomNumber: user.roomNumber || undefined,
          spaceNumber: user.spaceNumber || undefined,
        };

        setCurrentStudent(profile);
        setSuccessMsg('Account registered successfully!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMsg(null);
        }, 800);
      }
    } catch (err: any) {
      setError(formatDjangoError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-[#F4EFE7] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#A1927D] my-8 relative flex flex-col"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#2A2827] text-white flex items-center justify-between border-b border-[#5B514B]">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-black text-[#FEFB58]">
              Mushia Student Portal
            </span>
            <span className="text-xs text-[#A1927D]">·</span>
            <span className="text-xs text-[#F4EFE7]">
              {isLogin ? 'Sign In' : 'Create Account'}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg bg-[#5B514B]/60 hover:bg-[#5B514B] text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2 p-1 bg-[#2A2827]/10 rounded-xl border border-[#A1927D]/40">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isLogin
                  ? 'bg-[#2A2827] text-[#FEFB58] shadow-sm'
                  : 'text-[#7D6E66] hover:text-[#2A2827]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-[#2A2827] text-[#FEFB58] shadow-sm'
                  : 'text-[#7D6E66] hover:text-[#2A2827]'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-start gap-2.5 font-medium leading-relaxed whitespace-pre-line">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                    First Name *
                  </label>
                  <input
                    required
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="e.g. Kwame"
                    className="w-full bg-white border border-[#A1927D]/60 rounded-lg p-2.5 text-xs text-[#2A2827] placeholder-[#A1927D] focus:outline-none focus:ring-2 focus:ring-[#2A2827]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                    Last Name *
                  </label>
                  <input
                    required
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="e.g. Mensah"
                    className="w-full bg-white border border-[#A1927D]/60 rounded-lg p-2.5 text-xs text-[#2A2827] placeholder-[#A1927D] focus:outline-none focus:ring-2 focus:ring-[#2A2827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7D6E66]" />
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@st.knust.edu.gh"
                      className="w-full bg-white border border-[#A1927D]/60 rounded-lg p-2.5 pl-8 text-xs text-[#2A2827] placeholder-[#A1927D] focus:outline-none focus:ring-2 focus:ring-[#2A2827]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7D6E66]" />
                    <input
                      required
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="024 123 4567"
                      className="w-full bg-white border border-[#A1927D]/60 rounded-lg p-2.5 pl-8 text-xs text-[#2A2827] placeholder-[#A1927D] focus:outline-none focus:ring-2 focus:ring-[#2A2827]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#A1927D]/60 rounded-lg p-2.5 text-xs text-[#2A2827] focus:outline-none focus:ring-2 focus:ring-[#2A2827]"
                >
                  <option value="MALE">Male (For Male room allocation)</option>
                  <option value="FEMALE">Female (For Female room allocation)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
              Student ID / Username *
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7D6E66]" />
              <input
                required
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. 20814522 or student_username"
                className="w-full bg-white border border-[#A1927D]/60 rounded-lg p-2.5 pl-8 text-xs text-[#2A2827] placeholder-[#A1927D] focus:outline-none focus:ring-2 focus:ring-[#2A2827]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7D6E66]" />
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-white border border-[#A1927D]/60 rounded-lg p-2.5 pl-8 text-xs text-[#2A2827] placeholder-[#A1927D] focus:outline-none focus:ring-2 focus:ring-[#2A2827]"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : isLogin ? 'Sign In to Portal' : 'Register Student Account'}</span>
            {!loading && <ArrowRight className="w-4 h-4 text-[#2A2827]" />}
          </motion.button>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-[#2A2827] text-white/80 border-t border-[#5B514B] text-center text-[11px] flex items-center justify-between">
          <span className="text-[#A1927D]">Mushia Reservation System</span>
          <span className="text-[#FEFB58]">HttpOnly JWT Authenticated</span>
        </div>
      </motion.div>
    </div>
  );
};
