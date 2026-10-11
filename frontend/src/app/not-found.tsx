
'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  House,
  Search,
  BedDouble,
  UsersRound,
  MapPin,
} from 'lucide-react';

const quickLinks = [
  {
    title: 'Find your room',
    description: 'Explore accommodation options.',
    href: '/rooms',
    icon: BedDouble,
  },
  {
    title: 'Roommate hub',
    description: 'Find your ideal roommate.',
    href: '/roommates',
    icon: UsersRound,
  },
  {
    title: 'Explore the hostel',
    description: 'Discover Mushia Hostel.',
    href: '/',
    icon: House,
  },
];

export default function NotFoundPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-[#211F1D] text-[#F4EFE7] selection:bg-[#FEFB58] selection:text-[#211F1D]">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-32 -top-32 h-105 w-105 rounded-full border border-white/6 sm:h-150 sm:w-150" />
        <div className="absolute -right-16 -top-16 h-75 w-75 rounded-full border border-white/6 sm:h-115 sm:w-115" />
        <div className="absolute -bottom-40 -left-40 h-110 w-110 rounded-full border border-white/5" />
        <div className="absolute right-[8%] top-[18%] h-2 w-2 rounded-full bg-[#FEFB58]/70" />
        <div className="absolute left-[12%] top-[32%] h-1.5 w-1.5 rounded-full bg-white/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(254,251,88,0.055),transparent_58%)]" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
        <Link
          href="/"
          aria-label="Mushia Hostel home"
          className="group flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEFB58] text-[#211F1D] transition-transform duration-300 group-hover:rotate-[-6deg]">
            <House size={22} strokeWidth={2.2} />
          </span>

          <span className="flex flex-col">
            <span className="text-lg font-black tracking-[-0.06em]">
              MUSHIA
            </span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A1927D]">
              Student Living
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 text-xs font-medium text-[#A5ABAA] sm:flex">
          <MapPin size={14} className="text-[#FEFB58]" />
          Ayeduase Newsite, Kumasi
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-semibold transition-colors hover:border-[#FEFB58]/50 hover:text-[#FEFB58] sm:px-5 sm:text-sm"
        >
          <ArrowLeft size={15} />
          <span>Go home</span>
        </Link>
      </header>

      {/* Main content */}
      <section className="relative z-10 flex flex-1 items-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left: message */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#FEFB58]/20 bg-[#FEFB58]/6 px-3.5 py-2">
              <Compass size={14} className="text-[#FEFB58]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FEFB58]">
                Looks like you took a wrong turn
              </span>
            </div>

            <h1 className="text-[clamp(6rem,20vw,12rem)] font-black leading-[0.78] tracking-[-0.105em] text-[#F4EFE7]">
              4<span className="text-[#FEFB58]">0</span>4
            </h1>

            <div className="mt-9 max-w-xl">
              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                This space
                <br />
                <span className="text-[#A1927D]">isn’t on the map.</span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-[#A5ABAA] sm:text-base sm:leading-8">
                Looks like this page has checked out. Don’t worry —
                your place at Mushia is still waiting. Let’s get you
                back to where you need to be.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/"
                className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-[#FEFB58] px-7 py-4 text-sm font-bold text-[#211F1D] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFFCA0] hover:shadow-[0_12px_35px_rgba(254,251,88,0.12)]"
              >
                <House size={17} />
                Back to homepage
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/10 px-7 py-4 text-sm font-semibold text-[#F4EFE7] transition-colors hover:border-white/25 hover:bg-white/4"
              >
                <ArrowLeft size={16} />
                Previous page
              </button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-[#A5ABAA]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10">
                <Search size={13} />
              </span>
              <span>
                Need a place to stay? Start with our room options.
              </span>
            </div>
          </motion.div>

          {/* Right: custom 404 artwork */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.12, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="relative aspect-[4/4.1] overflow-hidden rounded-4xl border border-white/9 bg-[#2A2827] p-5 sm:p-8">
              {/* Decorative grid */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(244,239,231,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,231,.2) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                }}
              />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A1927D]">
                      Mushia Hostel
                    </p>
                    <p className="mt-2 text-sm text-[#F4EFE7]/70">
                      Your next chapter starts here.
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-widest text-[#A5ABAA]">
                    GH · KSI
                  </span>
                </div>

                {/* Illustrated room / doorway */}
                <div className="relative mx-auto flex w-full flex-1 items-center justify-center py-8">
                  <motion.div
                    animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative flex h-64 w-52 max-w-[72%] items-end justify-center rounded-t-[7rem] border border-[#FEFB58]/30 bg-[#211F1D] sm:h-72 sm:w-60"
                  >
                    <div className="absolute inset-x-5 top-5 bottom-0 rounded-t-[5.5rem] border border-white/8" />

                    <div className="relative mb-0 flex h-[78%] w-[70%] flex-col items-center justify-end rounded-t-[5rem] border border-[#FEFB58]/50 bg-[#FEFB58]/[0.07] pb-5">
                      <div className="absolute inset-x-3 top-3 bottom-0 rounded-t-[4rem] border border-white/8" />

                      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEFB58] text-[#211F1D] shadow-[0_0_50px_rgba(254,251,88,0.15)]">
                        <House size={24} strokeWidth={1.8} />
                      </div>

                      <span className="relative mt-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[#FEFB58]">
                        Your space
                      </span>

                      <span className="absolute right-3 top-1/2 h-2 w-2 rounded-full bg-[#FEFB58]/80" />
                    </div>

                    {/* Doorway floor */}
                    <div className="absolute -bottom-px left-[-20%] right-[-20%] h-1 rounded-full bg-[#FEFB58]/40 blur-[1px]" />
                  </motion.div>

                  <span className="absolute left-[5%] top-[22%] h-2 w-2 rounded-full bg-[#FEFB58]/80" />
                  <span className="absolute right-[8%] top-[32%] h-1.5 w-1.5 rounded-full bg-white/40" />
                  <span className="absolute bottom-[20%] left-[13%] h-1 w-1 rounded-full bg-white/30" />
                </div>

                <div className="flex items-end justify-between border-t border-white/10 pt-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#A1927D]">
                      Lost? Not for long.
                    </p>
                    <p className="mt-1.5 text-lg font-bold tracking-tight">
                      Find your way home.
                    </p>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEFB58] text-[#211F1D]">
                    <ArrowRight size={19} />
                  </span>
                </div>
              </div>
            </div>

            {/* Floating status label */}
            <div className="absolute -left-2 top-[28%] flex items-center gap-3 rounded-2xl border border-white/10 bg-[#34312F] p-3 shadow-2xl sm:-left-5 sm:p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEFB58]/10 text-[#FEFB58]">
                <Compass size={18} />
              </span>
              <div>
                <p className="text-xs font-bold text-[#F4EFE7]">
                  Wrong destination
                </p>
                <p className="mt-1 text-[10px] text-[#A5ABAA]">
                  Let’s reroute you.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick navigation */}
      <section className="relative z-10 border-t border-white/8 bg-[#1C1A18]/80">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#A1927D]">
                Where would you like to go?
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Let’s get you back on track.
              </h3>
            </div>
            <span className="hidden text-xs text-[#A5ABAA] sm:block">
              Everything you need, one click away.
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: 12 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: shouldReduceMotion ? 0 : index * 0.08,
                  }}
                >
                  <Link
                    href={item.href}
                    className="group flex h-full items-center gap-4 rounded-2xl border border-white/8 bg-white/2 p-4 transition-all duration-300 hover:border-[#FEFB58]/30 hover:bg-[#FEFB58]/[0.04] sm:p-5"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#A1927D] transition-colors group-hover:bg-[#FEFB58] group-hover:text-[#211F1D]">
                      <Icon size={21} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-[#F4EFE7]">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#A5ABAA]">
                        {item.description}
                      </span>
                    </span>

                    <ArrowRight
                      size={17}
                      className="shrink-0 text-[#A1927D] transition-all group-hover:translate-x-1 group-hover:text-[#FEFB58]"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
