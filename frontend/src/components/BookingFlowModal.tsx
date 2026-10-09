'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { Booking } from '../types';
import { 
  X, 
  Check, 
  Clock, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Building,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';

export const BookingFlowModal: React.FC = () => {
  const { 
    selectedRoom, 
    selectedSpaceNumber, 
    isBookingModalOpen, 
    closeBookingModal, 
    completePaymentAndBooking, 
    currentStudent,
    activeBookingHold,
    releaseActiveHold,
    config,
    setActiveView,
    openReceiptModal,
    setIsAuthModalOpen
  } = useHostel();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Student Form fields - pre-filled from authenticated student profile
  const [formData, setFormData] = useState({
    name: currentStudent?.name || '',
    knustId: currentStudent?.knustId || '',
    email: currentStudent?.email || '',
    phone: currentStudent?.phone || '',
    gender: currentStudent?.gender || 'Male',
    program: currentStudent?.program || '',
    level: currentStudent?.level || 'Level 100',
  });

  // Keep form fields synced whenever student signs in or modal opens
  useEffect(() => {
    if (isBookingModalOpen && currentStudent) {
      setFormData((prev) => ({
        name: currentStudent.name || prev.name || '',
        knustId: currentStudent.knustId || prev.knustId || '',
        email: currentStudent.email || prev.email || '',
        phone: currentStudent.phone || prev.phone || '',
        gender: currentStudent.gender || prev.gender || 'Male',
        program: currentStudent.program && currentStudent.program !== 'Undergraduate Student'
          ? currentStudent.program
          : prev.program || '',
        level: currentStudent.level || prev.level || 'Level 100',
      }));
      if (currentStudent.phone) {
        setMomoNumber(currentStudent.phone);
      }
    }
  }, [isBookingModalOpen, currentStudent]);

  // Payment selection
  const [paymentMethod, setPaymentMethod] = useState<'MTN Mobile Money' | 'Telecel Cash' | 'AirtelTigo Money' | 'Visa / Mastercard'>('MTN Mobile Money');
  const [momoNumber, setMomoNumber] = useState(currentStudent?.phone || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Countdown timer in seconds
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

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

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.knustId || !formData.phone || !formData.email) {
      setPaymentError('Please complete all required student fields.');
      return;
    }
    setPaymentError(null);
    setCurrentStep(3);
  };

  const handlePaystackPayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Realistic simulated network request to Paystack
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const paymentRef = `PSTK-MSH-${Date.now().toString().slice(-6)}`;
      const booking = await completePaymentAndBooking({
        student: formData as any,
        paymentMethod,
        paymentRef,
      });

      setConfirmedBooking(booking);
      setCurrentStep(5);
    } catch (err: any) {
      setPaymentError(err?.message || 'Payment verification failed. Please try again.');
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
    { num: 2, label: 'Student Profile' },
    { num: 3, label: 'Summary' },
    { num: 4, label: 'Paystack Payment' },
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
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#5B514B] text-[#FEFB58] text-xs font-mono font-bold animate-pulse" title="Hold expiration timer">
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
                  <span className={`hidden sm:inline font-medium ${
                    currentStep === st.num ? 'text-[#2A2827] font-bold' : 'text-[#7D6E66]'
                  }`}>
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Step Content with animated transitions */}
          <div className="p-6 overflow-y-auto max-h-[75vh]">
            <AnimatePresence mode="wait">
              {/* STEP 1: SPACE SELECTION & HOLD CONFIRMATION */}
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
                        Temporary Space Lock Active (10 Minutes)
                      </strong>
                      Space #{selectedSpaceNumber} in Room {selectedRoom.roomNumber} is currently held exclusively for you. 
                      No other student can claim this bed while your session is active.
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
                        {selectedRoom.roomType} · {selectedRoom.size} ({selectedRoom.airConditioned ? 'AC' : 'Ceiling Fan'})
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
                      onClick={closeBookingModal}
                      className="px-4 py-2.5 text-xs font-semibold text-[#5B514B] hover:text-[#2A2827] cursor-pointer"
                    >
                      Cancel Hold
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Student Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: STUDENT DETAILS FORM */}
              {currentStep === 2 && (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleDetailsSubmit}
                  className="space-y-4"
                >
                  <div>
                    <h4 className="font-bold text-base text-[#2A2827]">Student Information</h4>
                    <p className="text-xs text-[#5B514B]">
                      Please enter your official KNUST student details for hostel registry and roommate matching.
                    </p>
                  </div>

                  {currentStudent?.name ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Information pre-filled from your account (<strong>{currentStudent.name}</strong>). You can make changes if needed.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-[#FEFB58]/20 border border-[#FEFB58]/50 rounded-xl text-xs text-[#5B514B]">
                      <span>Already have an account? Sign in to automatically pre-fill your details.</span>
                      <button
                        type="button"
                        onClick={() => {
                          closeBookingModal();
                          setIsAuthModalOpen(true);
                        }}
                        className="font-bold text-[#2A2827] underline cursor-pointer shrink-0 ml-2"
                      >
                        Sign in
                      </button>
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
                        placeholder="e.g. Kwame Mensah"
                        className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                        KNUST Student ID / Index No. *
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
                        Phone (WhatsApp Active) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          setMomoNumber(e.target.value);
                        }}
                        placeholder="e.g. 024 991 8234"
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
                        placeholder="e.g. student@st.knust.edu.gh"
                        className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                        KNUST Academic Program *
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
                        Academic Level *
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
                      >
                        <option value="Level 100">Level 100 (Freshman)</option>
                        <option value="Level 200">Level 200 (Sophomore)</option>
                        <option value="Level 300">Level 300 (Junior)</option>
                        <option value="Level 400">Level 400 (Final Year)</option>
                        <option value="Postgraduate">Postgraduate / Masters</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1.5">
                      Gender *
                    </label>
                    <div className="flex gap-4">
                      {['Male', 'Female'].map((gen) => (
                        <label key={gen} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2A2827]">
                          <input
                            type="radio"
                            name="gender"
                            value={gen}
                            checked={formData.gender === gen}
                            onChange={() => setFormData({ ...formData, gender: gen as any })}
                            className="text-[#2A2827] focus:ring-[#FEFB58]"
                          />
                          <span>{gen}</span>
                        </label>
                      ))}
                    </div>
                  </div>

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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-2.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Review Booking Summary</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: BOOKING SUMMARY */}
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
                    <h4 className="font-bold text-base text-[#2A2827]">Booking Invoice Breakdown</h4>
                    <p className="text-xs text-[#5B514B]">
                      Review your allocation and official hostel fee structure before proceeding to Paystack.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-[#A1927D]/40 p-4 space-y-3 text-xs">
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Student Name</span>
                      <span className="font-bold text-[#2A2827]">{formData.name}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">KNUST ID / Program</span>
                      <span className="font-bold text-[#2A2827]">{formData.knustId} ({formData.program})</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Hostel & Room</span>
                      <span className="font-bold text-[#2A2827]">
                        Mushia Hostel · Room {selectedRoom.roomNumber} (Space #{selectedSpaceNumber})
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Type & Features</span>
                      <span className="font-bold text-[#2A2827]">
                        {selectedRoom.roomType} · {selectedRoom.airConditioned ? 'Refrigerated AC' : 'Ceiling Fan'}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Base Accommodation Fee</span>
                      <span className="font-medium text-[#2A2827] tabular-nums">
                        GHS {(selectedRoom.price - 400).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Utilities & Standby Power Levy</span>
                      <span className="font-medium text-[#2A2827] tabular-nums">GHS 250</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Refundable Security Deposit</span>
                      <span className="font-medium text-[#2A2827] tabular-nums">GHS 150</span>
                    </div>
                    <div className="flex justify-between pt-2 text-sm border-t border-[#A1927D]/40 font-bold">
                      <span className="text-[#2A2827]">Total Payable Fee</span>
                      <span className="text-xl font-black text-[#2A2827] tabular-nums">
                        GHS {selectedRoom.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#5B514B]/10 rounded-xl p-3 text-[11px] text-[#5B514B] border border-[#A1927D]/30">
                    Payment is processed securely through Paystack. Upon verified confirmation, your bed space is locked permanently, your official receipt is generated, and roommate matching is immediately unlocked.
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2.5 text-xs font-semibold text-[#5B514B] hover:text-[#2A2827] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-2.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Paystack Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: PAYSTACK PAYMENT GATEWAY */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#A1927D]/30">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7D6E66] tracking-wider">Secured via</span>
                      <h4 className="font-extrabold text-base text-[#2A2827]">Paystack Payment Gateway</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#7D6E66]">Amount</span>
                      <span className="block text-lg font-black text-[#2A2827] tabular-nums">
                        GHS {selectedRoom.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#7D6E66] uppercase tracking-wider mb-2">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('MTN Mobile Money')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          paymentMethod === 'MTN Mobile Money'
                            ? 'border-[#2A2827] bg-[#FEFB58]/30 ring-2 ring-[#2A2827]/10 shadow-xs'
                            : 'border-[#A1927D]/40 bg-white hover:border-[#5B514B]'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-[#2A2827]" />
                        <div>
                          <span className="font-bold text-xs text-[#2A2827] block">MTN MoMo</span>
                          <span className="text-[10px] text-[#7D6E66]">Instant Prompt</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Telecel Cash')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          paymentMethod === 'Telecel Cash'
                            ? 'border-[#2A2827] bg-[#FEFB58]/30 ring-2 ring-[#2A2827]/10 shadow-xs'
                            : 'border-[#A1927D]/40 bg-white hover:border-[#5B514B]'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-[#2A2827]" />
                        <div>
                          <span className="font-bold text-xs text-[#2A2827] block">Telecel Cash</span>
                          <span className="text-[10px] text-[#7D6E66]">Voda Cash Prompt</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('AirtelTigo Money')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          paymentMethod === 'AirtelTigo Money'
                            ? 'border-[#2A2827] bg-[#FEFB58]/30 ring-2 ring-[#2A2827]/10 shadow-xs'
                            : 'border-[#A1927D]/40 bg-white hover:border-[#5B514B]'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-[#2A2827]" />
                        <div>
                          <span className="font-bold text-xs text-[#2A2827] block">AirtelTigo AT</span>
                          <span className="text-[10px] text-[#7D6E66]">Mobile Money</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Visa / Mastercard')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          paymentMethod === 'Visa / Mastercard'
                            ? 'border-[#2A2827] bg-[#FEFB58]/30 ring-2 ring-[#2A2827]/10 shadow-xs'
                            : 'border-[#A1927D]/40 bg-white hover:border-[#5B514B]'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-[#2A2827]" />
                        <div>
                          <span className="font-bold text-xs text-[#2A2827] block">Visa / Master</span>
                          <span className="text-[10px] text-[#7D6E66]">Ghana & Int'l Cards</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Payment Fields */}
                  <div className="bg-white p-4 rounded-xl border border-[#A1927D]/40">
                    {paymentMethod.includes('Money') || paymentMethod.includes('Cash') ? (
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-[#2A2827]">
                          {paymentMethod} Wallet Number
                        </label>
                        <input
                          type="tel"
                          value={momoNumber}
                          onChange={(e) => setMomoNumber(e.target.value)}
                          placeholder="e.g. 024 991 8234"
                          className="w-full px-3 py-2 bg-[#F4EFE7]/40 border border-[#A1927D]/60 rounded-lg text-sm text-[#2A2827] font-mono focus:outline-none focus:border-[#5B514B]"
                        />
                        <p className="text-[11px] text-[#7D6E66]">
                          A Paystack authorization prompt will be pushed to this mobile number for authorization.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-semibold text-[#2A2827] mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F4EFE7]/40 border border-[#A1927D]/60 rounded-lg font-mono text-sm text-[#2A2827]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-[#2A2827] mb-1">Expiry Date</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3 py-2 bg-[#F4EFE7]/40 border border-[#A1927D]/60 rounded-lg font-mono text-sm text-[#2A2827]"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-[#2A2827] mb-1">CVV</label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full px-3 py-2 bg-[#F4EFE7]/40 border border-[#A1927D]/60 rounded-lg font-mono text-sm text-[#2A2827]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {paymentError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  {/* Pay Button in Solar Yellow */}
                  <div className="pt-2">
                    <motion.button
                      whileHover={!isProcessingPayment ? { scale: 1.02 } : undefined}
                      whileTap={!isProcessingPayment ? { scale: 0.98 } : undefined}
                      disabled={isProcessingPayment}
                      onClick={handlePaystackPayment}
                      className="w-full py-3.5 px-4 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#2A2827] border-t-transparent rounded-full animate-spin"></div>
                          <span>Verifying with Paystack Webhook...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-[#2A2827]" />
                          <span>Confirm & Pay GHS {selectedRoom.price.toLocaleString()}</span>
                        </>
                      )}
                    </motion.button>
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
                      Payment Successfully Verified
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#2A2827]">
                      Booking Confirmed 🎉
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5B514B] mt-1 max-w-md mx-auto">
                      Your space at Mushia Hostel has been successfully secured for the {config.academicYear}.
                    </p>
                  </div>

                  {/* Official Confirmation Card */}
                  <div className="bg-white rounded-xl border border-[#A1927D]/50 p-5 text-left text-xs space-y-2.5 max-w-md mx-auto shadow-sm">
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Booking ID</span>
                      <span className="font-mono font-bold text-[#2A2827]">{confirmedBooking.bookingReference}</span>
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
                        {confirmedBooking.floor} Floor · {confirmedBooking.roomType} ({confirmedBooking.airConditioned ? 'AC' : 'Fan'})
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-zinc-100">
                      <span className="text-[#7D6E66]">Payment Status</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Verified · {confirmedBooking.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="font-bold text-[#2A2827]">Amount Paid</span>
                      <span className="font-black text-base text-[#2A2827] tabular-nums">
                        GHS {confirmedBooking.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* High Intent Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        closeBookingModal();
                        setActiveView('roommates');
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#2A2827]" />
                      <span>Find My Roommate</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        openReceiptModal(confirmedBooking);
                      }}
                      className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-[#F4EFE7] border border-[#A1927D] text-[#2A2827] font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-[#5B514B]" />
                      <span>Download Official Receipt</span>
                    </motion.button>

                    <button
                      onClick={() => {
                        closeBookingModal();
                        setActiveView('dashboard');
                      }}
                      className="w-full sm:w-auto px-5 py-3 bg-[#5B514B] hover:bg-[#2A2827] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>View Dashboard</span>
                    </button>
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
