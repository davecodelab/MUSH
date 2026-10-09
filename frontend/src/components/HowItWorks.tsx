'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import {
  Search,
  Bed,
  CreditCard,
  HeartHandshake,
  ArrowUpRight,
  Check,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setActiveView } = useHostel();
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    {
      num: '01',
      title: 'Explore',
      eyebrow: 'Find your space',
      description:
        'Explore available rooms and bed spaces across Mushia. Compare room types, floor levels, AC options and capacity before making your choice.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Choose',
      eyebrow: 'Make it yours',
      description:
        'Select the room or bed space that fits you best. See availability clearly and reserve your preferred space before someone else does.',
      icon: Bed,
    },
    {
      num: '03',
      title: 'Pay',
      eyebrow: 'Reserve securely',
      description:
        'Complete your reservation securely through Paystack using Mobile Money or your card. Your payment is verified automatically.',
      icon: CreditCard,
    },
    {
      num: '04',
      title: 'Connect',
      eyebrow: 'Get ready for Mushia',
      description:
        'Once confirmed, discover your roommate, connect with them and prepare for a smooth move-in experience at Mushia Hostel.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#F3EEE7] text-[#2B272A]"
    >
      {/* ========================================================= ATMOSPHERE========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `
              linear-gradient(#2B272A 1px, transparent 1px),
              linear-gradient(90deg, #2B272A 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* soft blue architectural glow */}
        <div className="absolute -right-40 top-20 h-125 w-125 rounded-full bg-[#92ce91]/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-100 w-100 rounded-full bg-[#92ce91]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-350 px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        {/* =========================================================HEADER========================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-20 max-w-4xl lg:mb-28"
        >
          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-[#5ac02a]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#6B625B] sm:text-[11px]">
              Booking & Move-in
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-[#2B272A]">
              Your room.
              <br />
              <span className="text-[#6B625B]">Your journey.</span>
            </h2>

            <div className="max-w-md lg:pb-2">
              <p className="text-sm leading-7 text-[#6B625B] sm:text-base">
                Finding your home at Mushia should feel simple. Discover your
                space, secure it, connect with your roommate and arrive ready
                for campus life.
              </p>

              <div className="mt-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#594C43]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#A79C92]/60">
                  4
                </span>
                <span>Simple steps to move in</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================= JOURNEY ========================================================= */}

        <div className="relative">
          {/* Desktop journey line */}
          <div className="pointer-events-none absolute left-0 right-0 top-13.25 hidden lg:block">
            <div className="relative h-px w-full bg-[#A79C92]/40">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 1.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: 'left' }}
                className="absolute inset-y-0 left-0 w-full bg-[#92ce91]"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.num}
                  initial={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : 45,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: '-80px',
                  }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -8,
                        }
                  }
                  className="group relative"
                >
                  {/* Mobile connector */}
                  {index !== steps.length - 1 && (
                    <div className="absolute left-6.75 top-18 h-[calc(100%+24px)] w-px bg-[#A79C92]/40 md:hidden" />
                  )}

                  {/* ================================================= NUMBER / NODE================================================= */}

                  <div className="relative mb-7 flex items-center gap-5 lg:mb-10 lg:block">
                    <motion.div
                      whileHover={
                        shouldReduceMotion
                          ? undefined
                          : {
                              scale: 1.08,
                            }
                      }
                      className="relative z-10 flex h-13.5 w-13.5 shrink-0 items-center justify-center rounded-full border border-[#A79C92]/70 bg-[#F3EEE7] shadow-[0_0_0_8px_#F3EEE7]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B272A] text-[#F3EEE7] transition-colors duration-500 group-hover:bg-[#92ce91]">
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                    </motion.div>

                    <div className="lg:absolute lg:-top-3 lg:left-18">
                      <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#5ac02a]">
                        STEP {step.num}
                      </span>
                    </div>
                  </div>

                  {/* ================================================= CONTENT ================================================= */}

                  <div className="rounded-4xl border border-[#A79C92]/45 bg-white/45 p-7 backdrop-blur-[2px] transition-all duration-500 group-hover:border-[#92ce91]/50 group-hover:bg-white/70 sm:p-8 lg:min-h-90 lg:rounded-[2.2rem]">
                    <div className="flex h-full flex-col">
                      <div>
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B625B]">
                          {step.eyebrow}
                        </p>

                        <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#2B272A]">
                          {step.title}
                        </h3>

                        <div className="mt-5 h-px w-10 bg-[#92ce91] transition-all duration-500 group-hover:w-20" />

                        <p className="mt-6 text-sm leading-7 text-[#6B625B]">
                          {step.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-10">
                        <div className="flex items-center justify-between border-t border-[#A79C92]/30 pt-5">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8179]">
                            Mushia Hostel
                          </span>

                          <motion.div
                            animate={
                              shouldReduceMotion
                                ? undefined
                                : {
                                    x: [0, 3, 0],
                                  }
                            }
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: index * 0.2,
                            }}
                            className="text-[#594C43]"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* ========================================================= MOVE-IN CTA ========================================================= */}
        <motion.div
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-16 overflow-hidden rounded-4xl bg-[#2B272A] sm:mt-20 lg:mt-28"
        >
          <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            {/* CTA decoration */}
            <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full border border-[#92ce91]/20" />
            <div className="pointer-events-none absolute -right-8 -top-20 h-48 w-48 rounded-full border border-[#92ce91]/15" />

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#5ac02a]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A79C92]">
                    Ready when you are
                  </span>
                </div>

                <h3 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#F3EEE7] sm:text-4xl lg:text-5xl">
                  Your next chapter
                  <br />
                  starts at <span className="text-[#92ce91]">Mushia.</span>
                </h3>

                <p className="mt-5 max-w-xl text-sm leading-7 text-[#A79C92]">
                  Choose your preferred room, secure your space and take the
                  first step toward a more comfortable campus experience.
                </p>
              </div>

              <motion.button
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 1.03,
                      }
                }
                whileTap={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 0.98,
                      }
                }
                onClick={() => setActiveView('rooms')}
                className="group inline-flex shrink-0 cursor-pointer items-center justify-center gap-4 rounded-full bg-[#F3EEE7] px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#2B272A] shadow-xl transition-colors duration-300 hover:bg-[#92ce91] hover:text-white sm:px-8"
              >
                <span>Start Your Reservation</span>

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2B272A] text-[#F3EEE7] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* =========================================================
            TRUST STRIP
        ========================================================= */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#A79C92]/40 bg-[#A79C92]/40 lg:grid-cols-4"
        >
          {[
            'Secure Payments',
            'Verified Availability',
            'Easy Move-in',
            'Roommate Connection',
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 bg-[#F3EEE7] px-4 py-4 sm:px-5"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#92ce91]/15 text-[#594C43]">
                <Check className="h-3 w-3" strokeWidth={2.5} />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6B625B] sm:text-[10px]">
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};