'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Image from 'next/image';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(
    'Connecting to Mushia Hostel Ayeduase...'
  );
  const [isComplete, setIsComplete] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isComplete) return;

    const steps = [
      { at: 20, text: 'Scanning 103 rooms across 6 floors...' },
      { at: 45, text: 'Verifying live space availability...' },
      { at: 70, text: 'Connecting Paystack & MoMo channels...' },
      { at: 90, text: 'Preparing roommate matching matrix...' },
      { at: 100, text: 'Your KNUST Home is ready.' },
    ];

    let completionTimeout: ReturnType<typeof setTimeout> | undefined;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }

        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + increment);

        const currentStep = [...steps]
          .reverse()
          .find((step) => next >= step.at);

        if (currentStep) {
          setStatusText(currentStep.text);
        }

        if (next >= 100) {
          clearInterval(timer);
          setIsComplete(true);

          completionTimeout = setTimeout(() => {
            onComplete();
          }, 650);
        }

        return next;
      });
    }, 100);

    return () => {
      clearInterval(timer);

      if (completionTimeout) {
        clearTimeout(completionTimeout);
      }
    };
  }, [onComplete, isComplete]);

  const handleSkip = () => {
    setProgress(100);
    setStatusText('Your KNUST Home is ready.');
    setIsComplete(true);
    onComplete();
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : -20,
          }}
          transition={{
            duration: prefersReducedMotion ? 0.2 : 0.6,
            ease: 'easeOut',
          }}
          className="
            fixed
            inset-0
            z-[9999]
            flex
            min-h-[100svh]
            w-full
            items-center
            justify-center
            overflow-hidden
            bg-[#2A2827]
            px-5
            py-8
            text-[#F4EFE7]
            select-none
            sm:px-6
          "
          role="status"
          aria-label="Loading Mushia Hostel"
          aria-live="polite"
        >
          {/* Ambient background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="
                absolute
                -left-32
                -top-32
                h-72
                w-72
                rounded-full
                bg-[#FEFB58]/4
                blur-3xl
                sm:h-96
                sm:w-96
              "
            />

            <div
              className="
                absolute
                -bottom-32
                -right-32
                h-72
                w-72
                rounded-full
                bg-[#5B514B]/30
                blur-3xl
                sm:h-96
                sm:w-96
              "
            />

            {/* Subtle architectural lines */}
            <div className="absolute inset-0 opacity-[0.035]">
              <div
                className="
                  absolute
                  left-1/2
                  top-0
                  h-full
                  w-px
                  -translate-x-1/2
                  bg-[#F4EFE7]
                "
              />
              <div
                className="
                  absolute
                  left-0
                  top-1/2
                  h-px
                  w-full
                  bg-[#F4EFE7]
                "
              />
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center sm:max-w-md">
            {/* Animated logo */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      scale: 0.4,
                      opacity: 0,
                      rotate: -12,
                      filter: 'blur(8px)',
                    }
              }
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
                filter: 'blur(0px)',
              }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative mb-7"
            >
              {/* Pulsing glow */}
              {!prefersReducedMotion && (
                <motion.div
                  animate={{
                    opacity: [0.15, 0.4, 0.15],
                    scale: [0.85, 1.2, 0.85],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="
                    absolute
                    -inset-4
                    rounded-full
                    bg-[#FEFB58]/15
                    blur-2xl
                    sm:-inset-5
                  "
                />
              )}

              {/* Logo float */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? { y: 0 }
                    : { y: [0, -5, 0] }
                }
                transition={{
                  duration: 2.5,
                  repeat: prefersReducedMotion ? 0 : Infinity,
                  ease: 'easeInOut',
                  delay: 0.8,
                }}
                className="relative"
              >
                <Image
                  src="/mushia_logo.png"
                  alt="Mushia Hostel Logo"
                  width={88}
                  height={88}
                  priority
                  className="
                    relative
                    z-10
                    h-20
                    w-20
                    object-contain
                    drop-shadow-[0_0_18px_rgba(254,251,88,0.12)]
                    sm:h-22
                    sm:w-22
                  "
                />
              </motion.div>
            </motion.div>

            {/* Brand title */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.15,
                duration: 0.5,
              }}
              className="mb-9 w-full"
            >
              <h1 className="text-2xl font-black tracking-[0.12em] text-[#F4EFE7] sm:text-3xl">
                MUSHIA HOSTEL
              </h1>

              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A1927D] sm:text-xs sm:tracking-[0.2em]">
                FNF Junction · Ayeduase Newsite · Kumasi
              </p>
            </motion.div>

            {/* Progress */}
            <div className="w-full space-y-3">
              <div
                className="
                  h-2
                  w-full
                  overflow-hidden
                  rounded-full
                  border
                  border-[#7D6E66]/40
                  bg-[#5B514B]/60
                  p-0.5
                "
              >
                <motion.div
                  className="
                    h-full
                    rounded-full
                    bg-linear-to-r
                    from-[#FEFB58]
                    via-[#FFFCA0]
                    to-[#FEFB58]
                  "
                  style={{ width: `${progress}%` }}
                  transition={{
                    ease: 'easeOut',
                    duration: 0.2,
                  }}
                />
              </div>

              {/* Status and percentage */}
              <div className="flex min-w-0 items-center justify-between gap-3 pt-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={statusText}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="
                      min-w-0
                      flex-1
                      text-left
                      text-[10px]
                      font-medium
                      leading-relaxed
                      text-[#A1927D]
                      sm:text-[11px]
                    "
                  >
                    {statusText}
                  </motion.span>
                </AnimatePresence>

                <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-[#FEFB58]">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Skip intro */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.7,
                duration: 0.5,
              }}
              onClick={handleSkip}
              className="
                mt-9
                inline-flex
                min-h-10
                items-center
                justify-center
                rounded-full
                px-5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#7D6E66]
                underline
                decoration-[#7D6E66]/50
                underline-offset-4
                transition-colors
                duration-200
                hover:text-[#FEFB58]
                hover:decoration-[#FEFB58]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#FEFB58]
              "
            >
              Skip Intro
            </motion.button>
          </div>

          {/* Bottom caption */}
          <div
            className="
              pointer-events-none
              absolute
              bottom-4
              left-0
              right-0
              z-10
              px-4
              text-center
            "
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#7D6E66]/80">
              Your space. Your pace. Your KNUST home.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};