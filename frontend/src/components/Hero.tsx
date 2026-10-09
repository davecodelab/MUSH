
'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useSafeReducedMotion } from '../hooks/useSafeReducedMotion';
import {
  MapPin,
  ArrowRight,
  Building2,
  MoveUpRight,
  CheckCircle2,
} from 'lucide-react';

import { useHostel } from '../context/HostelContext';
import { MUSHIA_IMAGES } from '../data/seedRooms';

export const Hero: React.FC = () => {
  const { setActiveView } = useHostel();
  const shouldReduceMotion = useSafeReducedMotion();

  const ease = [0.22, 1, 0.36, 1] as const;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.75,
        ease,
      },
    },
  };

  const goTo = (view: string) => {
    setActiveView(view as any);
  };

  return (
    <section
      id="home"
      className="
        group/hero
        relative
        isolate
        min-h-svh
        overflow-hidden
        bg-[#211F1D]
        text-[#F4EFE7]
      "
    >
      {/* ============================================================
          CINEMATIC BACKGROUND
      ============================================================ */}

      <div className="absolute inset-0 -z-20 overflow-hidden">
        <motion.img
          src={MUSHIA_IMAGES.exterior}
          alt="Exterior of Mushia Hostel in Ayeduase, Kumasi"
          initial={false}
          animate={{ scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 2.2,
            ease,
          }}
          className="
            h-full
            w-full
            object-cover
            object-[58%_center]
            sm:object-center
            lg:object-[center_45%]
          "
          referrerPolicy="no-referrer"
          fetchPriority="high"
        />

        {/* Dark cinematic scrim */}
        <div
          className="
            absolute
            inset-0
            bg-[#211F1D]/55
          "
        />

        {/* Directional contrast for headline */}
        <div
          className="
            absolute
            inset-0
            bg-linear-to-r
            from-[#211F1D]/95
            via-[#211F1D]/80
            to-[#211F1D]/20
            max-md:bg-linear-to-b
            max-md:from-[#211F1D]/80
            max-md:via-[#211F1D]/70
            max-md:to-[#211F1D]/65
          "
        />

        {/* Lower cinematic fade */}
        <div
          className="
            absolute
            inset-0
            bg-linear-to-t
            from-[#211F1D]
            via-transparent
            to-[#211F1D]/20
          "
        />

        {/* Warm brand-toned ambient light */}
        <div
          aria-hidden="true"
          className="
            absolute
            -left-40
            top-[18%]
            h-112
            w-md
            rounded-full
            bg-[#FEFB58]/5.5
            blur-[120px]
          "
        />

        {/* Fine film-grain texture */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            opacity-[0.07]
            mix-blend-soft-light
            pointer-events-none
          "
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.55%27/%3E%3C/svg%3E")',
          }}
        />
      </div>

     

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-svh
          w-full
          max-w-[1600px]
          flex-col
          justify-end
          px-5
          pb-8
          pt-32
          sm:px-8
          sm:pb-12
          sm:pt-36
          lg:px-14
          lg:pb-14
          xl:px-20
        "
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl"
        >
          {/* LOCATION + AVAILABILITY */}
          <motion.div
            variants={itemVariants}
            className="
              mb-7
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-3
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#FEFB58]
                sm:text-[11px]
                sm:tracking-[0.2em]
              "
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" />

              <span>
                Ayeduase Newsite, Kumasi
              </span>
            </div>

            <span
              aria-hidden="true"
              className="hidden h-4 w-px bg-[#F4EFE7]/30 sm:block"
            />

            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-[#FEFB58]/50
                  "
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FEFB58]" />
              </span>

              <span className="text-[10px] font-medium tracking-wide text-[#F4EFE7]/75 sm:text-xs">
                Your next chapter starts here
              </span>
            </div>
          </motion.div>

          {/* HEADLINE */}
          <motion.h1
            variants={itemVariants}
            className="
              max-w-5xl
              text-[clamp(2.35rem,9.5vw,4.5rem)]
              font-semibold
              leading-[0.93]
              tracking-[-0.055em]
              text-[#F4EFE7]
              sm:text-[clamp(3.75rem,8.5vw,6rem)]
              lg:text-[clamp(5rem,7.6vw,7.5rem)]
            "
          >
            More than a room.
            <br />

            <span
              className="
                relative
                mt-1
                inline-block
                text-[clamp(2.35rem,9.5vw,4.5rem)]
                font-normal
                tracking-[-0.045em]
                text-[#FEFB58]
                sm:text-[clamp(3.75rem,8.5vw,6rem)]
                lg:text-[clamp(5rem,7.6vw,7.5rem)]
              "
            >
              A place to belong.
            </span>
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            variants={itemVariants}
            className="
              mt-6
              max-w-xl
              text-[14px]
              leading-7
              text-[#F4EFE7]/80
              sm:mt-7
              sm:text-base
              sm:leading-8
              lg:mt-8
              lg:text-[17px]
            "
          >
            Find your space at Mushia Hostel. Discover comfortable
            student accommodation, explore your preferred room, and
            make your next chapter at KNUST feel like home.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            variants={itemVariants}
            className="
              mt-8
              flex
              w-full
              flex-col
              gap-3
              sm:mt-9
              sm:w-auto
              sm:flex-row
              sm:flex-wrap
              sm:items-center
              sm:gap-4
            "
          >
            {/* PRIMARY CTA */}
            <motion.button
              type="button"
              onClick={() => goTo('rooms')}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -3,
                      scale: 1.015,
                    }
              }
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.25,
                ease,
              }}
              className="
                group/primary
                relative
                inline-flex
                min-h-14
                w-full
                items-center
                justify-center
                gap-4
                overflow-hidden
                rounded-xl
                bg-[#FEFB58]
                px-6
                py-4
                text-sm
                font-bold
                text-[#211F1D]
                shadow-[0_8px_30px_rgba(254,251,88,0.12)]
                transition-[box-shadow,background-color]
                duration-300
                hover:bg-[#FFFDA0]
                hover:shadow-[0_12px_40px_rgba(254,251,88,0.23)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#FEFB58]
                focus-visible:ring-offset-4
                focus-visible:ring-offset-[#211F1D]
                sm:w-auto
                sm:min-w-[205px]
                sm:justify-between
                sm:gap-8
                sm:px-6
                cursor-pointer
              "
            >
              {/* Sliding highlight */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  -left-1/2
                  w-1/3
                  skew-x-[-20deg]
                  bg-white/35
                  transition-transform
                  duration-700
                  ease-out
                  group-hover/primary:translate-x-[480%]
                "
              />

              <span className="relative z-10">
                Find your room
              </span>

              <span
                className="
                  relative
                  z-10
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#211F1D]/8
                  transition-all
                  duration-300
                  group-hover/primary:translate-x-1
                  group-hover/primary:bg-[#211F1D]/13
                "
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </motion.button>

            {/* SECONDARY CTA */}
            <motion.button
              type="button"
              onClick={() => goTo('floor-explorer')}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -3,
                    }
              }
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.25,
                ease,
              }}
              className="
                group/secondary
                inline-flex
                min-h-[56px]
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-[#F4EFE7]/35
                bg-[#211F1D]/25
                px-6
                py-4
                text-sm
                font-semibold
                text-[#F4EFE7]
                transition-all
                duration-300
                hover:border-[#FEFB58]/70
                hover:bg-[#F4EFE7]/[0.08]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#FEFB58]
                focus-visible:ring-offset-4
                focus-visible:ring-offset-[#211F1D]
                sm:w-auto
                sm:min-w-[190px]
                sm:justify-between
                cursor-pointer
              "
            >
              <Building2
                className="
                  h-4
                  w-4
                  shrink-0
                  text-[#FEFB58]
                  transition-transform
                  duration-300
                  group-hover/secondary:-translate-y-0.5
                "
              />

              <span>Explore the floors</span>

              <MoveUpRight
                className="
                  h-4
                  w-4
                  shrink-0
                  text-[#F4EFE7]/65
                  transition-all
                  duration-300
                  group-hover/secondary:-translate-y-1
                  group-hover/secondary:translate-x-1
                  group-hover/secondary:text-[#FEFB58]
                "
              />
            </motion.button>
          </motion.div>

          {/* TRUST / QUICK FACTS */}
          <motion.div
            variants={itemVariants}
            className="
              mt-10
              border-t
              border-[#F4EFE7]/20
              pt-5
              sm:mt-12
              sm:pt-6
              lg:mt-14
            "
          >
            <div
              className="
                grid
                grid-cols-2
                gap-x-5
                gap-y-5
                sm:grid-cols-4
                sm:gap-5
              "
            >
              {/* ROOM INVENTORY */}
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#F4EFE7]/15 bg-[#F4EFE7]/[0.05]">
                  <Building2 className="h-4 w-4 text-[#FEFB58]" />
                </span>

                <div className="min-w-0">
                  <div className="text-xl font-semibold tracking-tight text-[#F4EFE7] sm:text-2xl">
                    103
                  </div>
                  <p className="mt-1 text-[10px] leading-4 text-[#F4EFE7]/60 sm:text-xs">
                    Rooms to explore
                  </p>
                </div>
              </div>

              {/* FLOORS */}
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#F4EFE7]/15 bg-[#F4EFE7]/[0.05]">
                  <MoveUpRight className="h-4 w-4 text-[#FEFB58]" />
                </span>

                <div className="min-w-0">
                  <div className="text-xl font-semibold tracking-tight text-[#F4EFE7] sm:text-2xl">
                    6
                  </div>
                  <p className="mt-1 text-[10px] leading-4 text-[#F4EFE7]/60 sm:text-xs">
                    Floors to discover
                  </p>
                </div>
              </div>

              {/* ROOM OPTIONS */}
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#F4EFE7]/15 bg-[#F4EFE7]/[0.05]">
                  <CheckCircle2 className="h-4 w-4 text-[#FEFB58]" />
                </span>

                <div className="min-w-0">
                  <div className="text-xl font-semibold tracking-tight text-[#F4EFE7] sm:text-2xl">
                    4 types
                  </div>
                  <p className="mt-1 text-[10px] leading-4 text-[#F4EFE7]/60 sm:text-xs">
                    Different room options
                  </p>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#FEFB58]/25 bg-[#FEFB58]/[0.08]">
                  <CheckCircle2 className="h-4 w-4 text-[#FEFB58]" />
                </span>

                <div className="min-w-0">
                  <div className="text-xl font-semibold tracking-tight text-[#F4EFE7] sm:text-2xl">
                    Secure
                  </div>
                  <p className="mt-1 text-[10px] leading-4 text-[#F4EFE7]/60 sm:text-xs">
                    Booking and payment
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

