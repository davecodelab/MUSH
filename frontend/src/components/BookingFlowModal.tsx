'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { Booking, StudentProfile } from '../types';
import {
  registerUser,
  loginUser,
  holdSpace,
  initializePayment,
  verifyPayment,
} from '../services/api';
import {
  X,
  Check,
  Clock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Lock,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const BookingFlowModal: React.FC = () => {
  const {
    selectedRoom,
    selectedSpaceNumber,
    isBookingModalOpen,
    closeBookingModal,
    completePaymentAndBooking,
    currentStudent,
    setCurrentStudent,
    isLoggedIn,
    activeBookingHold,
    releaseActiveHold,
    config,
    setActiveView,
    openReceiptModal,
  } = useHostel();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Guest Auth Mode inside Step 2 ('signup' by default when guest proceeds to checkout)
  const [guestAuthMode, setGuestAuthMode] = useState<'signup' | 'login'>('signup');
  const [authPassword, setAuthPassword] = useState('');
  const [isSubmittingStep2, setIsSubmittingStep2] = useState(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  // Backend Booking Hold & Paystack initialization state
  const [backendBookingId, setBackendBookingId] = useState<number | string | null>(null);
  const [paystackSession, setPaystackSession] = useState<{
    reference: string;
    authorization_url?: string;
    access_code?: string;
    amount: number;
    mock?: boolean;
  } | null>(null);

  // Student Form fields
  const [formData, setFormData] = useState({
    firstName: currentStudent?.firstName || (currentStudent?.name ? currentStudent.name.split(' ')[0] : ''),
    lastName: currentStudent?.name ? currentStudent.name.split(' ').slice(1).join(' ') : '',
    name: currentStudent?.name || '',
    knustId: currentStudent?.knustId || '',
    email: currentStudent?.email || '',
    phone: currentStudent?.phone || '',
    gender: (currentStudent?.gender || 'Male') as 'Male' | 'Female',
    program:
      currentStudent?.program && currentStudent.program !== 'Undergraduate Student'
        ? currentStudent.program
        : '',
    level: currentStudent?.level || 'Level 100',
  });

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Reset modal step when opened
  useEffect(() => {
    if (isBookingModalOpen) {
      setCurrentStep(1);
      setConfirmedBooking(null);
      setStep2Error(null);
      setPaymentError(null);
      setBackendBookingId(null);
      setPaystackSession(null);
    }
  }, [isBookingModalOpen, selectedRoom?.id, selectedSpaceNumber]);

  // Keep form fields synced with authenticated student profile
  useEffect(() => {
    if (isBookingModalOpen && currentStudent && isLoggedIn) {
      const parts = (currentStudent.name || '').trim().split(' ');
      setFormData((prev) => ({
        firstName: currentStudent.firstName || parts[0] || prev.firstName || '',
        lastName: parts.slice(1).join(' ') || prev.lastName || '',
        name: currentStudent.name || prev.name || '',
        knustId: currentStudent.knustId || prev.knustId || '',
        email: currentStudent.email || prev.email || '',
        phone: currentStudent.phone || prev.phone || '',
        gender: currentStudent.gender || prev.gender || 'Male',
        program:
          currentStudent.program && currentStudent.program !== 'Undergraduate Student'
            ? currentStudent.program
            : prev.program || '',
        level: currentStudent.level || prev.level || 'Level 100',
      }));
    }
  }, [isBookingModalOpen, currentStudent, isLoggedIn]);

  // Countdown timer in seconds (15 minutes)
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (!activeBookingHold) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((activeBookingHold.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeBookingHold]);

  if (!isBookingModalOpen || !selectedRoom || selectedSpaceNumber === null) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const formatApiError = (err: any): string => {
    if (!err?.response) {
      return err?.message || 'Network error: Unable to reach server. Please try again.';
    }
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (data?.detail) return data.detail;
    if (typeof data === 'object') {
      const msgs = Object.entries(data)
        .map(([field, val]: [string, any]) => {
          const label = field.replace('_', ' ').toUpperCase();
          const text = Array.isArray(val) ? val.join(', ') : String(val);
          return `${label}: ${text}`;
        })
        .join('\n');
      if (msgs) return msgs;
    }
    return 'Could not complete request. Please check your details.';
  };

  // Step 2 handler:
  // - If Guest (!isLoggedIn): Signs up (or Signs in) against Django backend FIRST, then locks the space in Neon DB.
  // - If Logged In: Locks the space in Neon DB and proceeds to Summary.
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Error(null);
    setIsSubmittingStep2(true);

    try {
      let activeGender = formData.gender;
      let fullName = formData.name.trim();

      if (!isLoggedIn) {
        if (guestAuthMode === 'signup') {
          const fName = formData.firstName.trim();
          const lName = formData.lastName.trim();
          fullName = `${fName} ${lName}`.trim();

          if (!fName || !lName || !formData.knustId.trim() || !formData.email.trim() || !formData.phone.trim()) {
            setStep2Error('Please fill in all required registration fields.');
            setIsSubmittingStep2(false);
            return;
          }
          if (!authPassword || authPassword.length < 6) {
            setStep2Error('Please create a password of at least 6 characters.');
            setIsSubmittingStep2(false);
            return;
          }

          const regRes = await registerUser({
            username: formData.knustId.trim(),
            password: authPassword,
            email: formData.email.trim(),
            first_name: fName,
            last_name: lName,
            phone_number: formData.phone.trim(),
            gender: formData.gender.toUpperCase(),
          });

          const u = regRes.user;
          const profile: StudentProfile = {
            id: String(u.id || u.username),
            name: u.name || fullName || u.username,
            firstName: u.first_name || fName,
            knustId: u.knustId || u.username,
            email: u.email || formData.email.trim(),
            phone: u.phone || u.phone_number || formData.phone.trim(),
            gender: u.gender === 'Female' || u.gender === 'FEMALE' ? 'Female' : 'Male',
            program: formData.program.trim() || 'Undergraduate Student',
            level: formData.level || 'Level 100',
            hasPaid: Boolean(u.hasPaid),
          };
          setCurrentStudent(profile);
          setFormData((prev) => ({ ...prev, name: profile.name }));
        } else {
          // Guest chose "Sign In" with existing account
          if (!formData.knustId.trim() || !authPassword) {
            setStep2Error('Please enter your Student ID / Email and password.');
            setIsSubmittingStep2(false);
            return;
          }
          const loginRes = await loginUser({
            username: formData.knustId.trim(),
            password: authPassword,
          });
          const u = loginRes.user;
          const resolvedGender: 'Male' | 'Female' =
            u.gender === 'Female' || u.gender === 'FEMALE' ? 'Female' : 'Male';
          activeGender = resolvedGender;
          fullName = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username;

          const profile: StudentProfile = {
            id: String(u.id || u.username),
            name: fullName,
            firstName: u.first_name || fullName.split(' ')[0] || u.username,
            knustId: u.knustId || u.username,
            email: u.email || '',
            phone: u.phone || u.phone_number || '',
            gender: resolvedGender,
            program: formData.program.trim() || 'Undergraduate Student',
            level: formData.level || 'Level 100',
            hasPaid: Boolean(u.hasPaid),
            bookingId: u.bookingId || undefined,
            roomNumber: u.roomNumber || undefined,
            spaceNumber: u.spaceNumber || undefined,
          };
          setCurrentStudent(profile);
          setFormData((prev) => ({
            ...prev,
            name: profile.name,
            knustId: profile.knustId,
            email: profile.email,
            phone: profile.phone,
            gender: profile.gender,
          }));
        }
      } else {
        if (!formData.name.trim() || !formData.knustId.trim() || !formData.phone.trim() || !formData.email.trim()) {
          setStep2Error('Please complete all required student profile fields.');
          setIsSubmittingStep2(false);
          return;
        }
      }

      // Now that the student is authenticated, create/confirm the 15-minute hold in Neon PostgreSQL
      const holdRes = await holdSpace({
        room_number: selectedRoom.roomNumber,
        space_number: selectedSpaceNumber,
        gender: activeGender.toUpperCase(),
      });

      const bId = holdRes?.booking?.id;
      if (!bId) {
        throw new Error('Unable to reserve this space. Please try again.');
      }
      setBackendBookingId(bId);
      setCurrentStep(3);
    } catch (err: any) {
      setStep2Error(formatApiError(err));
    } finally {
      setIsSubmittingStep2(false);
    }
  };

  // Step 3 -> Step 4: Initialize official Paystack transaction on backend
  const handleProceedToPaystack = async () => {
    setPaymentError(null);
    setIsProcessingPayment(true);

    try {
      let bId = backendBookingId;
      if (!bId) {
        const holdRes = await holdSpace({
          room_number: selectedRoom.roomNumber,
          space_number: selectedSpaceNumber,
          gender: formData.gender.toUpperCase(),
        });
        bId = holdRes?.booking?.id;
        setBackendBookingId(bId);
      }

      if (!bId) {
        throw new Error('Could not initialize booking hold on the server.');
      }

      const callbackUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const initRes = await initializePayment(bId, callbackUrl);

      setPaystackSession({
        reference: initRes.reference,
        authorization_url: initRes.authorization_url,
        access_code: initRes.access_code,
        amount: initRes.amount || selectedRoom.price,
        mock: Boolean(initRes.mock),
      });

      // If real Paystack authorization_url is returned, save state & redirect directly to Paystack Checkout!
      if (initRes.authorization_url) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'mushia_pending_paystack',
            JSON.stringify({
              bookingId: bId,
              reference: initRes.reference,
              roomId: selectedRoom.id,
              roomNumber: selectedRoom.roomNumber,
              spaceNumber: selectedSpaceNumber,
              paymentMethod: 'Paystack Checkout',
              student: {
                name: formData.name || `${formData.firstName} ${formData.lastName}`.trim(),
                knustId: formData.knustId,
                email: formData.email,
                phone: formData.phone,
                gender: formData.gender,
                program: formData.program || 'Undergraduate Student',
                level: formData.level || 'Level 100',
              },
            })
          );
          window.location.href = initRes.authorization_url;
          return;
        }
      }

      // Otherwise open Step 4 (Paystack Checkout Authorization window)
      setCurrentStep(4);
    } catch (err: any) {
      setPaymentError(formatApiError(err));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Step 4: Verify payment with Django backend (/api/bookings/verify-payment/)
  const handleVerifyPaystackCheckout = async () => {
    if (!paystackSession?.reference) return;
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // If real authorization_url exists, redirect to Paystack
      if (paystackSession.authorization_url && typeof window !== 'undefined') {
        window.location.href = paystackSession.authorization_url;
        return;
      }

      // Verify transaction reference on Django backend (locks space & confirms booking in Neon DB)
      await verifyPayment(paystackSession.reference);

      const booking = await completePaymentAndBooking({
        student: {
          name: formData.name || `${formData.firstName} ${formData.lastName}`.trim(),
          knustId: formData.knustId,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          program: formData.program || 'Undergraduate Student',
          level: formData.level || 'Level 100',
        },
        paymentMethod: 'MTN Mobile Money',
        paymentRef: paystackSession.reference,
        skipBackendSync: true,
      });

      setConfirmedBooking(booking);
      setCurrentStep(5);
    } catch (err: any) {
      setPaymentError(formatApiError(err));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleModalClose = () => {
    if (currentStep < 5) {
      releaseActiveHold();
    }
    closeBookingModal();
  };

  const steps = [
    { num: 1, label: 'Space Selection' },
    { num: 2, label: isLoggedIn ? 'Student Profile' : 'Sign Up / Account' },
    { num: 3, label: 'Checkout Summary' },
    { num: 4, label: 'Paystack Checkout' },
    { num: 5, label: 'Confirmation' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-[#F4EFE7] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#A1927D] my-6 flex flex-col relative"
        >
          {/* Header with Title and Hold Countdown */}
          <div className="px-6 py-4 bg-[#2A2827] text-white flex items-center justify-between border-b border-[#5B514B]">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#A1927D] block font-semibold">
                Hostel Space Reservation
              </span>
              <h3 className="text-lg font-black text-[#FEFB58]">
                Room {selectedRoom.roomNumber} · Space #{selectedSpaceNumber}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {currentStep < 5 && (
                <div
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#5B514B] text-[#FEFB58] text-xs font-mono font-bold animate-pulse"
                  title="Hold expiration timer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formattedTime}</span>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleModalClose}
                className="p-1.5 rounded-lg bg-[#5B514B]/60 hover:bg-[#5B514B] text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-white border-b border-[#A1927D]/40 px-6 py-3">
            <div className="flex items-center justify-between text-xs">
              {steps.map((st) => (
                <div key={st.num} className="flex items-center gap-1.5">
                  <motion.div
                    animate={currentStep === st.num ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep === st.num
                        ? 'bg-[#2A2827] text-[#FEFB58]'
                        : currentStep > st.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-200 text-zinc-500'
                    }`}
                  >
                    {currentStep > st.num ? <Check className="w-3 h-3" /> : st.num}
                  </motion.div>
                  <span
                    className={`hidden sm:inline font-medium ${
                      currentStep === st.num ? 'text-[#2A2827] font-bold' : 'text-[#7D6E66]'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Step Content */}
          <div className="p-6 overflow-y-auto max-h-[75vh]">
            <AnimatePresence mode="wait">
              {/* STEP 1: SPACE SELECTION & PROCEED TO CHECKOUT */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-emerald-950 mb-0.5">
                        Space #{selectedSpaceNumber} Selected in Room {selectedRoom.roomNumber}
                      </strong>
                      {isLoggedIn
                        ? 'Your temporary 15-minute reservation hold is active. Proceed to review your details and complete payment via Paystack.'
                        : 'You are currently browsing as a guest. Proceeding to checkout will prompt you to create your student account so we can lock this bed space exclusively for you.'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#A1927D]/40 p-5 space-y-3 text-xs">
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Hostel</span>
                      <span className="font-bold text-[#2A2827]">Mushia Hostel · Ayeduase Newsite</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Room & Space</span>
                      <span className="font-bold text-[#2A2827]">
                        Room {selectedRoom.roomNumber} (Space #{selectedSpaceNumber})
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Floor Level</span>
                      <span className="font-bold text-[#2A2827]">{selectedRoom.floor} Floor</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Room Configuration</span>
                      <span className="font-bold text-[#2A2827]">
                        {selectedRoom.roomType} · {selectedRoom.size} (
                        {selectedRoom.airConditioned ? 'AC' : 'Ceiling Fan'})
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Academic Period</span>
                      <span className="font-bold text-[#2A2827]">{config.academicYear}</span>
                    </div>
                    <div className="flex justify-between pt-1 text-sm">
                      <span className="font-bold text-[#2A2827]">Total Fee</span>
                      <span className="font-black text-lg text-[#2A2827] tabular-nums">
                        GHS {selectedRoom.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={handleModalClose}
                      className="px-4 py-2.5 text-xs font-semibold text-[#5B514B] hover:text-[#2A2827] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setStep2Error(null);
                        setCurrentStep(2);
                      }}
                      className="px-6 py-2.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>{isLoggedIn ? 'Proceed to Checkout' : 'Sign Up to Proceed to Checkout'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: GUEST SIGN UP / SIGN IN GATE (OR PROFILE CONFIRMATION IF LOGGED IN) */}
              {currentStep === 2 && (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleStep2Submit}
                  className="space-y-4"
                >
                  {!isLoggedIn ? (
                    <>
                      <div className="p-3.5 bg-[#2A2827] text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#FEFB58] font-bold block">
                            Account Required for Checkout
                          </span>
                          <h4 className="font-bold text-sm text-white">
                            {guestAuthMode === 'signup'
                              ? 'Create Your Student Account to Lock This Space'
                              : 'Sign In to Your Student Account'}
                          </h4>
                        </div>
                        <div className="flex bg-[#5B514B]/50 p-1 rounded-lg shrink-0 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setGuestAuthMode('signup');
                              setStep2Error(null);
                            }}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              guestAuthMode === 'signup'
                                ? 'bg-[#FEFB58] text-[#2A2827]'
                                : 'text-[#F4EFE7] hover:text-white'
                            }`}
                          >
                            Sign Up
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setGuestAuthMode('login');
                              setStep2Error(null);
                            }}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              guestAuthMode === 'login'
                                ? 'bg-[#FEFB58] text-[#2A2827]'
                                : 'text-[#F4EFE7] hover:text-white'
                            }`}
                          >
                            Sign In
                          </button>
                        </div>
                      </div>

                      {step2Error && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 whitespace-pre-line">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                          <span>{step2Error}</span>
                        </div>
                      )}

                      {guestAuthMode === 'signup' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                              First Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              placeholder="e.g. Kwame"
                              className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              placeholder="e.g. Mensah"
                              className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                              KNUST Student ID / Username *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.knustId}
                              onChange={(e) => setFormData({ ...formData, knustId: e.target.value })}
                              placeholder="e.g. 20814522"
                              className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                              Create Password (Min 6 chars) *
                            </label>
                            <input
                              type="password"
                              required
                              minLength={6}
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="student@st.knust.edu.gh"
                              className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                              Phone Number (WhatsApp) *
                            </label>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="024 991 8234"
                              className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                              Academic Program *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.program}
                              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                              placeholder="e.g. BSc Computer Engineering"
                              className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                              Gender (For Room Allocation) *
                            </label>
                            <select
                              value={formData.gender}
                              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                              className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                            >
                              <option value="Male">Male Student</option>
                              <option value="Female">Female Student</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3.5 bg-white p-4 rounded-xl border border-[#A1927D]/40">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                              Student ID / Username or Email *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.knustId}
                              onChange={(e) => setFormData({ ...formData, knustId: e.target.value })}
                              placeholder="Enter your Student ID or Email"
                              className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                              Password *
                            </label>
                            <input
                              type="password"
                              required
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="font-bold text-base text-[#2A2827]">Confirm Student Profile</h4>
                        <p className="text-xs text-[#5B514B]">
                          Signed in as <strong>{currentStudent.name}</strong>. Confirm your academic details to lock Space #{selectedSpaceNumber}.
                        </p>
                      </div>

                      {step2Error && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                          <span>{step2Error}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                            KNUST Student ID *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.knustId}
                            onChange={(e) => setFormData({ ...formData, knustId: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                            Phone (WhatsApp) *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                            Academic Program *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.program}
                            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                            placeholder="e.g. BSc Computer Engineering"
                            className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                            Academic Level *
                          </label>
                          <select
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827]"
                          >
                            <option value="Level 100">Level 100</option>
                            <option value="Level 200">Level 200</option>
                            <option value="Level 300">Level 300</option>
                            <option value="Level 400">Level 400</option>
                            <option value="Postgraduate">Postgraduate</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#A1927D]/30">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2.5 text-xs font-semibold text-[#5B514B] hover:text-[#2A2827] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <motion.button
                      whileHover={!isSubmittingStep2 ? { scale: 1.02 } : undefined}
                      whileTap={!isSubmittingStep2 ? { scale: 0.98 } : undefined}
                      disabled={isSubmittingStep2}
                      type="submit"
                      className="px-6 py-2.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <span>
                        {isSubmittingStep2
                          ? 'Authenticating & Locking Space...'
                          : !isLoggedIn
                          ? guestAuthMode === 'signup'
                            ? 'Sign Up & Proceed to Checkout'
                            : 'Sign In & Proceed to Checkout'
                          : 'Review Checkout Summary'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: BOOKING INVOICE SUMMARY & LAUNCH PAYSTACK */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div>
                    <h4 className="font-bold text-base text-[#2A2827]">Checkout Invoice Summary</h4>
                    <p className="text-xs text-[#5B514B]">
                      Your space is locked in the database. Review your invoice below and proceed to Paystack Checkout.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-[#A1927D]/40 p-4 space-y-3 text-xs">
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Student Name</span>
                      <span className="font-bold text-[#2A2827]">
                        {formData.name || `${formData.firstName} ${formData.lastName}`.trim()}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">KNUST ID / Email</span>
                      <span className="font-bold text-[#2A2827]">
                        {formData.knustId} ({formData.email})
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Hostel & Room</span>
                      <span className="font-bold text-[#2A2827]">
                        Mushia Hostel · Room {selectedRoom.roomNumber} (Space #{selectedSpaceNumber})
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Type & Size</span>
                      <span className="font-bold text-[#2A2827]">
                        {selectedRoom.roomType} · {selectedRoom.size} (
                        {selectedRoom.airConditioned ? 'AC' : 'Ceiling Fan'})
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 text-sm border-t border-[#A1927D]/40 font-bold">
                      <span className="text-[#2A2827]">Total Payable via Paystack</span>
                      <span className="text-xl font-black text-[#2A2827] tabular-nums">
                        GHS {selectedRoom.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  <div className="bg-[#2A2827] text-white rounded-xl p-4 text-xs flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[#FEFB58] font-bold block mb-0.5">Official Paystack Checkout</span>
                      <span className="text-[#A5ABAA] text-[11px]">
                        Supports MTN MoMo, Telecel Cash, AirtelTigo Money & Visa/Mastercard directly on Paystack.
                      </span>
                    </div>
                    <ShieldCheck className="w-7 h-7 text-[#FEFB58] shrink-0" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2.5 text-xs font-semibold text-[#5B514B] hover:text-[#2A2827] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <motion.button
                      whileHover={!isProcessingPayment ? { scale: 1.02 } : undefined}
                      whileTap={!isProcessingPayment ? { scale: 0.98 } : undefined}
                      disabled={isProcessingPayment}
                      onClick={handleProceedToPaystack}
                      className="px-6 py-3 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <span>
                        {isProcessingPayment
                          ? 'Connecting to Paystack...'
                          : `Pay GHS ${selectedRoom.price.toLocaleString()} with Paystack`}
                      </span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: PAYSTACK CHECKOUT WINDOW (Redirect or Sandbox Verification) */}
              {currentStep === 4 && paystackSession && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="bg-white rounded-2xl border-2 border-[#09A5DB]/30 overflow-hidden shadow-lg">
                    {/* Official Paystack-style Top Bar */}
                    <div className="bg-[#011B33] text-white px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-[#09A5DB]"></div>
                        <div>
                          <span className="text-xs font-extrabold tracking-wide uppercase block text-[#09A5DB]">
                            Paystack Checkout
                          </span>
                          <span className="text-[11px] text-slate-300">{formData.email}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-300 block">Pay</span>
                        <span className="text-base font-black text-white tabular-nums">
                          GHS {paystackSession.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4 text-xs">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Paystack Reference</span>
                        <span className="font-mono font-bold text-slate-900">{paystackSession.reference}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Allocation</span>
                        <span className="font-bold text-slate-900">
                          Room {selectedRoom.roomNumber} · Space #{selectedSpaceNumber}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Channel</span>
                        <span className="font-bold text-emerald-700">
                          Paystack (Mobile Money / Card)
                        </span>
                      </div>

                      {paymentError && (
                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>{paymentError}</span>
                        </div>
                      )}

                      <motion.button
                        whileHover={!isProcessingPayment ? { scale: 1.01 } : undefined}
                        whileTap={!isProcessingPayment ? { scale: 0.99 } : undefined}
                        disabled={isProcessingPayment}
                        onClick={handleVerifyPaystackCheckout}
                        className="w-full py-3.5 px-4 bg-[#3BB75E] hover:bg-[#32a051] text-white font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Verifying Transaction with Paystack...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Authorize Paystack Payment (GHS {paystackSession.amount.toLocaleString()})</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: BOOKING CONFIRMATION & SUCCESS SCREEN */}
              {currentStep === 5 && confirmedBooking && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  className="text-center py-4 space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner"
                  >
                    <Check className="w-8 h-8" />
                  </motion.div>

                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#7D6E66] font-bold block mb-1">
                      Paystack Payment Verified
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#2A2827]">
                      Booking Confirmed 🎉
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5B514B] mt-1 max-w-md mx-auto">
                      Your space at Mushia Hostel has been secured in the database for the {config.academicYear}.
                    </p>
                  </div>

                  {/* Official Confirmation Card */}
                  <div className="bg-white rounded-xl border border-[#A1927D]/50 p-5 text-left text-xs space-y-2.5 max-w-md mx-auto shadow-sm">
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Paystack Reference</span>
                      <span className="font-mono font-bold text-[#2A2827]">
                        {confirmedBooking.bookingReference}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Student Name</span>
                      <span className="font-bold text-[#2A2827]">{confirmedBooking.studentName}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Allocated Room</span>
                      <span className="font-bold text-[#2A2827]">
                        Room {confirmedBooking.roomNumber} · Space #{confirmedBooking.spaceNumber}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Floor & Type</span>
                      <span className="font-bold text-[#2A2827]">
                        {confirmedBooking.floor} Floor · {confirmedBooking.roomType} (
                        {confirmedBooking.airConditioned ? 'AC' : 'Fan'})
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Payment Status</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Verified via Paystack
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 text-sm font-black text-[#2A2827]">
                      <span>Amount Paid</span>
                      <span>GHS {confirmedBooking.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        closeBookingModal();
                        setActiveView('roommates');
                      }}
                      className="flex-1 py-3 px-4 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>Find My Roommate</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        closeBookingModal();
                        openReceiptModal(confirmedBooking);
                      }}
                      className="flex-1 py-3 px-4 bg-white hover:bg-[#EAE3D9] text-[#2A2827] border border-[#A1927D] font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download Official Receipt</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        closeBookingModal();
                        setActiveView('dashboard');
                      }}
                      className="py-3 px-4 bg-[#5B514B] hover:bg-[#2A2827] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>View Dashboard</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
