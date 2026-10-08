'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { MUSHIA_IMAGES } from '../data/seedRooms';
import {
  MapPin,
  ArrowRight,
  Building,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveView } = useHostel();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#2A2827] text-[#F4EFE7]">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.8,
            ease: 'easeOut',
          }}
          src={MUSHIA_IMAGES.exterior}
          alt="Mushia Hostel exterior building at Ayeduase Kumasi"
          className="
            h-full
            w-full
            object-cover
            object-center

            sm:object-center
            lg:object-center
          "
          referrerPolicy="no-referrer"
        />

        {/* Main contrast scrim */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#2A2827]/95
            via-[#2A2827]/80
            to-[#2A2827]/45

            max-sm:bg-gradient-to-b
            max-sm:from-[#2A2827]/95
            max-sm:via-[#2A2827]/80
            max-sm:to-[#2A2827]/55
          "
        />

        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A2827] via-transparent to-transparent" />

        {/* Mobile extra readability */}
        <div className="absolute inset-0 bg-[#2A2827]/10 sm:bg-transparent" />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[100svh]
          w-full
          max-w-7xl
          items-end

          px-4
          pb-8
          pt-28

          sm:px-6
          sm:pb-12
          sm:pt-32

          lg:px-8
          lg:pb-16
          lg:pt-36
        "
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="
            w-full
            max-w-3xl
          "
        >
          {/* =====================================================
              LOCATION
          ===================================================== */}
          <motion.div
            variants={itemVariants}
            className="
              mb-5
              inline-flex
              max-w-full
              items-center
              gap-2
              rounded-lg
              border
              border-[#7D6E66]/40
              bg-[#5B514B]/80
              px-3
              py-2
              text-[10px]
              font-semibold
              leading-4
              tracking-wide
              text-[#FEFB58]
              shadow-sm
              backdrop-blur-md

              sm:mb-6
              sm:px-3.5
              sm:py-1.5
              sm:text-xs
            "
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#FEFB58]" />

            <span className="min-w-0 break-words">
              FNF Junction, Ayeduase Newsite, Kumasi
            </span>

            <span className="hidden shrink-0 text-[#A5ABAA] sm:inline">
              · 3 mins to KNUST Gate
            </span>
          </motion.div>

          {/* =====================================================
              HEADLINE
          ===================================================== */}
          <motion.h1
            variants={itemVariants}
            className="
              max-w-[900px]
              text-[clamp(2.75rem,12vw,4rem)]
              font-extrabold
              leading-[0.98]
              tracking-[-0.055em]
              text-[#F4EFE7]

              sm:text-[clamp(3.25rem,9vw,5rem)]
              sm:leading-[1]

              lg:text-6xl
              lg:leading-[1.05]
          "
          >
            Your KNUST Home
            <br />

            <span className="relative inline-block text-[#FEFB58] drop-shadow-sm">
              Starts Here.
            </span>
          </motion.h1>

          {/* =====================================================
              DESCRIPTION
          ===================================================== */}
          <motion.p
            variants={itemVariants}
            className="
              mt-5
              max-w-2xl
              text-[14px]
              leading-6
              text-[#F4EFE7]/85

              sm:mt-6
              sm:text-base
              sm:leading-7

              lg:text-lg
            "
          >
            Comfortable, fully equipped student accommodation at Mushia Hostel,
            conveniently located at FNF Junction, Ayeduase Newsite. Choose your
            exact room space, make a secure reservation, and connect with
            verified KNUST roommates.
          </motion.p>

          {/* =====================================================
              CTA BUTTONS
          ===================================================== */}
          <motion.div
            variants={itemVariants}
            className="
              mt-7
              flex
              w-full
              flex-col
              gap-3

              sm:mt-8
              sm:flex-row
              sm:flex-wrap
              sm:items-center
              sm:gap-3
            "
          >
            {/* Primary */}
            <motion.button
              whileHover={{
                scale: 1.02,
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => setActiveView('rooms')}
              className="
                flex
                min-h-[52px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#FEFB58]
                px-5
                py-3.5
                text-sm
                font-bold
                text-[#2A2827]
                shadow-lg
                transition-all
                duration-300
                hover:bg-[#fff945]
                hover:shadow-xl
                active:scale-[0.98]

                sm:w-auto
                sm:min-w-[150px]
                sm:px-6
                sm:text-base
              "
            >
              <span>Book a Room</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </motion.button>

            {/* Secondary */}
            <motion.button
              whileHover={{
                scale: 1.01,
                y: -1,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => setActiveView('floor-explorer')}
              className="
                flex
                min-h-[52px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#7D6E66]/60
                bg-[#5B514B]/70
                px-5
                py-3.5
                text-sm
                font-semibold
                text-[#F4EFE7]
                shadow-md
                backdrop-blur-sm
                transition-all
                duration-300
                hover:bg-[#5B514B]
                active:scale-[0.98]

                sm:w-auto
                sm:px-5
                sm:text-base
              "
            >
              <Building className="h-4 w-4 shrink-0 text-[#FEFB58]" />

              <span className="whitespace-normal text-center">
                Explore 6 Floors
                <span className="hidden sm:inline"> (103 Rooms)</span>
                <span className="sm:hidden"> · 103 Rooms</span>
              </span>
            </motion.button>
          </motion.div>

          {/* =====================================================
              TRUST SIGNALS
          ===================================================== */}
          <motion.div
            variants={itemVariants}
            className="
              mt-8
              border-t
              border-[#5B514B]/80
              pt-4

              sm:mt-10
              sm:pt-5

              lg:mt-12
              lg:pt-6
            "
          >
            <div
              className="
                grid
                grid-cols-2
                gap-2.5

                sm:grid-cols-4
                sm:gap-3
              "
            >
              {/* 103 Rooms */}
              <div
                className="
                  min-w-0
                  rounded-xl
                  border
                  border-[#5B514B]/30
                  bg-[#2A2827]/45
                  p-3
                  backdrop-blur-sm

                  sm:p-3.5
                "
              >
                <span
                  className="
                    block
                    truncate
                    text-lg
                    font-black
                    tabular-nums
                    text-[#F4EFE7]

                    sm:text-xl
                  "
                >
                  103
                </span>

                <span className="mt-0.5 block truncate text-[10px] text-[#A5ABAA] sm:text-xs">
                  Official Rooms
                </span>
              </div>

              {/* Floors */}
              <div
                className="
                  min-w-0
                  rounded-xl
                  border
                  border-[#5B514B]/30
                  bg-[#2A2827]/45
                  p-3
                  backdrop-blur-sm

                  sm:p-3.5
                "
              >
                <span
                  className="
                    block
                    truncate
                    text-lg
                    font-black
                    text-[#F4EFE7]

                    sm:text-xl
                  "
                >
                  6 Floors
                </span>

                <span className="mt-0.5 block truncate text-[10px] text-[#A5ABAA] sm:text-xs">
                  Ground to 5th
                </span>
              </div>

              {/* Room types */}
              <div
                className="
                  min-w-0
                  rounded-xl
                  border
                  border-[#5B514B]/30
                  bg-[#2A2827]/45
                  p-3
                  backdrop-blur-sm

                  sm:p-3.5
                "
              >
                <span
                  className="
                    block
                    truncate
                    text-lg
                    font-black
                    text-[#F4EFE7]

                    sm:text-xl
                  "
                >
                  4 Types
                </span>

                <span className="mt-0.5 block truncate text-[10px] text-[#A5ABAA] sm:text-xs">
                  1-in-1 to 4-in-1
                </span>
              </div>

              {/* Payment */}
              <div
                className="
                  min-w-0
                  rounded-xl
                  border
                  border-[#5B514B]/30
                  bg-[#2A2827]/45
                  p-3
                  backdrop-blur-sm

                  sm:p-3.5
                "
              >
                <span
                  className="
                    block
                    truncate
                    text-lg
                    font-black
                    text-[#FEFB58]

                    sm:text-xl
                  "
                >
                  Paystack
                </span>

                <span className="mt-0.5 block truncate text-[10px] text-[#A5ABAA] sm:text-xs">
                  MoMo &amp; Card
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* =========================================================
          MOBILE BOTTOM FADE
      ========================================================= */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-10
          h-16
          bg-gradient-to-t
          from-[#2A2827]
          to-transparent
          sm:h-20
        "
      />
    </section>
  );
};