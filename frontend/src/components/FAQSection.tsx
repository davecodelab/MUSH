'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { div } from 'motion/react-client';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const faqs = [
    {
      q: 'What room types does Mushia Hostel offer?',
      a: 'Mushia Hostel offers 4-in-1, 3-in-1, 2-in-1, and 1-in-1 accommodation options, giving students different levels of privacy, comfort and affordability.',
    },
    {
      q: 'Do you have AC rooms?',
      a: 'Yes. Air-conditioned rooms are available, while some rooms use ceiling fans. Room features can vary depending on the specific space, so check the room details before booking.',
    },
    {
      q: 'Can I choose my room and specific bed space?',
      a: 'Yes. Available rooms and bed spaces can be viewed through the room selection experience. You can choose from the spaces currently available when making your reservation.',
    },
    {
      q: 'Can I choose my roommate?',
      a: 'After your booking is confirmed, you can access the available roommate information for your room and connect where the roommate-matching option applies.',
    },
    {
      q: 'When is my booking confirmed?',
      a: 'Your reservation is confirmed after your payment has been successfully completed and verified. You will then receive your accommodation confirmation and payment details.',
    },
    {
      q: 'Can I book without paying?',
      a: 'Selecting a room may temporarily hold the space while you complete the booking process. However, the room is not permanently secured until the required payment has been successfully completed.',
    },
    {
      q: 'Where is Mushia Hostel located?',
      a: 'Mushia Hostel is located around FNF Junction, Ayeduase Newsite, Kumasi, Ghana, making it a convenient option for students around the KNUST area.',
    },
    {
      q: 'Does the hostel have a study room?',
      a: 'Yes. Mushia provides dedicated spaces designed to give students a comfortable environment for studying and academic work.',
    },
    {
      q: 'Does the hostel have security?',
      a: 'Yes. Mushia has security measures in place to help provide a safe and comfortable residential environment for students.',
    },
    {
      q: 'Does the hostel have a TV or entertainment area?',
      a: 'Yes. Students have access to shared spaces where they can relax, socialise and unwind outside their rooms.',
    },
  ];

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#2B272A] text-[#F3EEE7]"
    >
      {/* =========================================================SUBTLE BACKGROUND========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* soft lime green glow inspired by the building windows/sky */}
        <div className="absolute -right-40 -top-40 h-130 w-130 rounded-full bg-[#92ce91]/10 blur-3xl" />

        {/* warm architectural glow */}
        <div className="absolute -bottom-48 -left-40 h-125 w-125 rounded-full bg-[#5fe24b]/20 blur-3xl" />

        {/* extremely subtle architectural lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(#F3EEE7 1px, transparent 1px),
              linear-gradient(90deg, #F3EEE7 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-300 px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
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
          className="mb-14 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:mb-20"
        >
          <div>
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#92ce91]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A79C92]">
                Need to know
              </span>
            </div>

            <h2 className="max-w-3xl text-[clamp(3rem,6vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
              Questions,
              <br />
              <span className="text-[#A79C92]">answered.</span>
            </h2>
          </div>

          <div className="max-w-sm lg:pb-1">
            <p className="text-sm leading-7 text-[#A79C92] sm:text-base">
              Everything you need to know before choosing your space at
              Mushia. If you still have questions, we are only a call away.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/4">
                <HelpCircle className="h-4 w-4 text-[#92ce91]" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D4CEC8]">
                Mushia Hostel · Kumasi
              </span>
            </div>
          </div>
        </motion.div>

        {/* =========================================================
            FAQ LIST
        ========================================================= */}

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <motion.div
                key={faq.q}
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: '-40px',
                }}
                transition={{
                  duration: 0.55,
                  delay: Math.min(idx * 0.035, 0.3),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
                  isOpen
                    ? 'border-[#92ce91]/40 bg-[#F3EEE7]'
                    : 'border-white/8 bg-white/[0.035] hover:border-white/16 hover:bg-white/5.5'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center gap-5 px-5 py-5 text-left sm:px-7 sm:py-6"
                >
                  {/* NUMBER */}

                  <span
                    className={`hidden shrink-0 font-mono text-[10px] font-bold tracking-[0.15em] sm:block ${
                      isOpen ? 'text-[#92ce91]' : 'text-[#6B625B]'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* QUESTION */}

                  <span
                    className={`flex-1 text-sm font-semibold transition-colors duration-300 sm:text-base ${
                      isOpen ? 'text-[#2B272A]' : 'text-[#e9f3e7]'
                    }`}
                  >
                    {faq.q}
                  </span>

                  {/* ICON */}

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                      isOpen
                        ? 'rotate-180 border-[#92ce91]/30 bg-[#92ce91]/10 text-[#594C43]'
                        : 'border-white/10 bg-white/3 text-[#A79C92]'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>

                {/* ANSWER */}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="px-5 pb-6 sm:px-7 sm:pb-7">
                        <div className="ml-0 border-t border-[#A79C92]/25 pt-5 sm:ml-10.5">
                          <p className="max-w-3xl text-sm leading-7 text-[#6B625B]">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* =========================================================  BOTTOM CONTACT CARD ========================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.7,
            delay: 0.1,
          }}
          className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/[0.035]"
        >
          <div className="flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#92ce91]">
                Still curious?
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#F3EEE7] sm:text-2xl">
                Talk to the Mushia team.
              </h3>

              <p className="mt-2 text-xs leading-6 text-[#A79C92]">
                Get help choosing a room or ask about current availability.
              </p>
            </div>

            <a
              href="tel:+233249203029"
              className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#F3EEE7] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2B272A] transition-all duration-300 hover:bg-[#92ce91] hover:text-white hover:shadow-lg"
            >
              <span>Call +233 24 920 3029</span>

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2B272A] text-white transition-transform duration-300 group-hover:rotate-45">
                <ChevronDown className="h-3 w-3 -rotate-90" />
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};