import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Sparkles, CheckCircle2 } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Connecting to Mushia Hostel Ayeduase...');

  useEffect(() => {
    const steps = [
      { at: 20, text: 'Scanning 120 rooms across 6 floors...' },
      { at: 45, text: 'Verifying live space availability...' },
      { at: 70, text: 'Connecting Paystack & MoMo channels...' },
      { at: 90, text: 'Preparing roommate matching matrix...' },
      { at: 100, text: 'Your KNUST Home is ready.' },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 450);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 4;
        const capped = Math.min(100, next);

        const currentStep = steps.slice().reverse().find((s) => capped >= s.at);
        if (currentStep) {
          setStatusText(currentStep.text);
        }

        return capped;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2A2827] text-[#F4EFE7] px-6 select-none"
    >
      {/* Subtle ambient architectural background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FEFB58]/5 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#5B514B]/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-sm w-full flex flex-col items-center text-center">
        
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-[#5B514B] border border-[#7D6E66] flex items-center justify-center text-[#FEFB58] shadow-2xl relative overflow-hidden">
            <Building2 className="w-10 h-10 relative z-10" />
            <motion.div
              animate={{
                y: ['100%', '-100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: 'linear',
              }}
              className="absolute inset-0 bg-linear-to-t from-transparent via-[#FEFB58]/20 to-transparent w-full"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-black tracking-tight text-[#F4EFE7]">
            MUSHIA HOSTEL
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#A1927D] mt-1 font-semibold">
            FNF Junction · Ayeduase Newsite · Kumasi
          </p>
        </motion.div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-3">
          <div className="h-1.5 w-full bg-[#5B514B]/60 rounded-full overflow-hidden border border-[#7D6E66]/40 p-0.5">
            <motion.div
              className="h-full bg-linear-to-r from-[#FEFB58] via-[#FFF852] to-[#FEFB58] rounded-full shadow-[0_0_12px_rgba(254,251,88,0.5)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>

          {/* Status Text & Percentage */}
          <div className="flex items-center justify-between text-xs text-[#A5ABAA] font-medium pt-1">
            <span className="truncate max-w-55 text-left text-[11px] text-[#A1927D]">
              {statusText}
            </span>
            <span className="font-mono font-bold text-[#FEFB58] tabular-nums">
              {progress}%
            </span>
          </div>
        </div>

        {/* Skip action for impatient users */}
        <button
          onClick={onComplete}
          className="mt-8 text-[11px] text-[#7D6E66] hover:text-[#FEFB58] transition-colors uppercase tracking-widest font-semibold cursor-pointer underline"
        >
          Skip Intro
        </button>

      </div>
    </motion.div>
  );
};
