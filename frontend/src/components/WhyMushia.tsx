'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  MapPin,
  Bed,
  Wind,
  BookOpen,
  ShieldCheck,
  Users,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const WhyMushia: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const features = [
    {
      icon: MapPin,
      number: '01',
      eyebrow: 'WHERE YOU ARE MATTERS',
      title: 'Close to campus. Close to everything.',
      shortTitle: 'Prime Location',
      description:
        'Mushia sits at FNF Junction, Ayeduase Newsite — giving students easy access to KNUST, transport, food spots and everyday essentials.',
    },
    {
      icon: Bed,
      number: '02',
      eyebrow: 'YOUR SPACE',
      title: 'A room designed around student life.',
      shortTitle: 'Thoughtful Rooms',
      description:
        'Every room is designed with the essentials students actually need — comfortable sleeping spaces, study areas, wardrobes and en-suite washrooms.',
    },
    {
      icon: Users,
      number: '03',
      eyebrow: 'FIND YOUR FIT',
      title: 'Four ways to make Mushia yours.',
      shortTitle: 'Flexible Living',
      description:
        'Choose from 4-in-1, 3-in-1, 2-in-1 or private 1-in-1 accommodation across six residential floors.',
    },
    {
      icon: Wind,
      number: '04',
      eyebrow: 'COMFORT, YOUR WAY',
      title: 'Cool when you need it. Fresh when you want it.',
      shortTitle: 'Climate Comfort',
      description:
        'Select rooms with split-unit air conditioning or opt for naturally ventilated spaces with high-velocity ceiling fans.',
    },
    {
      icon: BookOpen,
      number: '05',
      eyebrow: 'BUILT FOR FOCUS',
      title: 'When it is time to study, distractions stay outside.',
      shortTitle: 'Study Hall',
      description:
        'A dedicated quiet study hall gives you a focused environment with air conditioning, high-speed Wi-Fi, individual study stations and power backup.',
    },
    {
      icon: ShieldCheck,
      number: '06',
      eyebrow: 'PEACE OF MIND',
      title: 'Go to sleep knowing you are covered.',
      shortTitle: 'Security',
      description:
        'CCTV coverage, controlled access, perimeter lighting, security personnel and standby power create an environment where students can settle in confidently.',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F4EFE7] py-16 sm:py-24 md:py-28 lg:py-40">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Responsive yellow glow */}
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.8 }
          }
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            absolute
            -right-40
            -top-32
            h-[300px]
            w-[300px]
            rounded-full
            bg-[#FEFB58]/20
            blur-3xl
            sm:-right-32
            sm:-top-32
            sm:h-[420px]
            sm:w-[420px]
            md:h-[500px]
            md:w-[500px]
            lg:h-[600px]
            lg:w-[600px]
          "
        />

        {/* Horizontal editorial line */}
        <div className="absolute left-0 top-[34%] h-px w-full bg-[#2A2827]/[0.06] sm:top-[38%]" />

        {/* Small decorative points */}
        <div className="absolute left-[8%] top-[22%] hidden h-2 w-2 rounded-full bg-[#FEFB58] lg:block" />

        <div className="absolute right-[12%] top-[64%] hidden h-1.5 w-1.5 rounded-full bg-[#7D6E66]/50 lg:block" />

        {/* Editorial grid — hidden on small screens */}
        <div className="absolute inset-0 hidden opacity-[0.025] sm:block">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'linear-gradient(#2A2827 1px, transparent 1px), linear-gradient(90deg, #2A2827 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>
      </div>

      {/* =========================================================
          MAIN CONTAINER
      ========================================================= */}
      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* =======================================================
            INTRO
        ======================================================= */}
        <div className="grid gap-7 sm:gap-10 lg:grid-cols-[0.8fr_1.8fr] lg:items-end">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2A2827]/15 bg-white/40">
              <Sparkles className="h-4 w-4 text-[#2A2827]" />
            </span>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#7D6E66] sm:text-[10px] sm:tracking-[0.28em]">
                Why Mushia
              </p>

              <p className="mt-0.5 text-[11px] font-medium text-[#A1927D] sm:text-xs">
                More than accommodation.
              </p>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.9,
              delay: 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <h2
              className="
                max-w-5xl
                text-[clamp(2.65rem,12vw,7rem)]
                font-black
                leading-[0.88]
                tracking-[-0.065em]
                text-[#2A2827]
                sm:text-[clamp(3.2rem,9vw,6rem)]
                lg:text-[clamp(4rem,7vw,7rem)]
              "
            >
              Designed for
              <span className="relative mx-1.5 inline-block sm:mx-3 lg:mx-4">
                student life.

                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="
                    absolute
                    -bottom-1
                    left-0
                    h-1.5
                    w-full
                    origin-left
                    rounded-full
                    bg-[#FEFB58]
                    sm:-bottom-2
                    sm:h-2
                    lg:-bottom-3
                    lg:h-3
                  "
                />
              </span>
            </h2>
          </motion.div>
        </div>

        {/* =======================================================
            INTRO COPY
        ======================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="
            mt-8
            flex
            flex-col
            gap-5
            border-t
            border-[#2A2827]/10
            pt-5
            sm:mt-10
            sm:gap-6
            sm:pt-6
            md:mt-12
            lg:mt-14
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <p className="max-w-2xl text-sm leading-6 text-[#5B514B] sm:text-base sm:leading-7 lg:text-lg">
            Everything at Mushia is intentionally considered — from where you
            sleep and study to how you move around the community. The result is
            a residence that feels comfortable, connected and genuinely built
            around student life.
          </p>

          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7D6E66] sm:text-xs sm:tracking-[0.18em]">
            <span className="h-px w-7 bg-[#7D6E66]/40 sm:w-10" />
            <span>Ayeduase · Kumasi</span>
          </div>
        </motion.div>

        {/* =======================================================
            FEATURES
        ======================================================= */}
        <div className="mt-14 sm:mt-20 md:mt-24 lg:mt-36">
          <div
            className="
              grid
              grid-cols-1
              gap-3.5
              sm:grid-cols-2
              sm:gap-4
              md:gap-5
              lg:grid-cols-12
            "
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;

              /*
               * Desktop:
               * 01 = large anchor
               * 02/03 = stacked
               * 04 = wide
               * 05/06 = split
               *
               * Mobile/tablet:
               * Everything becomes a clean responsive grid.
               */
              const layoutClasses = [
                'lg:col-span-7 lg:row-span-2',
                'lg:col-span-5',
                'lg:col-span-5',
                'lg:col-span-7',
                'lg:col-span-5',
                'lg:col-span-7',
              ];

              return (
                <motion.article
                  key={feature.number}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 35 }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0 }
                  }
                  viewport={{
                    once: true,
                    amount: 0.12,
                  }}
                  transition={{
                    duration: 0.75,
                    delay: shouldReduceMotion ? 0 : index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -5,
                        }
                  }
                  className={`
                    group
                    relative
                    min-h-[320px]
                    overflow-hidden
                    rounded-[1.5rem]
                    border
                    border-[#2A2827]/10
                    bg-[#2A2827]
                    p-5
                    shadow-[0_15px_45px_rgba(42,40,39,0.07)]
                    transition-shadow
                    duration-500
                    hover:shadow-[0_25px_70px_rgba(42,40,39,0.15)]

                    sm:min-h-[340px]
                    sm:rounded-[1.75rem]
                    sm:p-6

                    md:min-h-[350px]
                    md:p-7

                    lg:min-h-[380px]
                    lg:rounded-[2rem]
                    lg:p-9

                    ${layoutClasses[index]}
                  `}
                >
                  {/* Huge background number */}
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      -right-4
                      -top-8
                      select-none
                      text-[8rem]
                      font-black
                      leading-none
                      tracking-[-0.1em]
                      text-white/[0.035]
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:translate-x-2
                      group-hover:-translate-y-2

                      sm:-right-5
                      sm:-top-10
                      sm:text-[10rem]

                      md:text-[12rem]

                      lg:-right-6
                      lg:-top-14
                      lg:text-[15rem]
                    "
                  >
                    {feature.number}
                  </div>

                  {/* Glow */}
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      -right-24
                      -top-24
                      h-52
                      w-52
                      rounded-full
                      bg-[#FEFB58]/10
                      blur-3xl
                      transition-all
                      duration-500
                      group-hover:bg-[#FEFB58]/20

                      sm:h-56
                      sm:w-56

                      lg:h-64
                      lg:w-64
                    "
                  />

                  <div className="relative flex h-full min-h-[280px] flex-col sm:min-h-[290px] md:min-h-[300px] lg:min-h-[320px]">
                    {/* Top */}
                    <div className="flex items-start justify-between">
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-white/10
                          bg-white/[0.07]
                          transition-all
                          duration-500
                          group-hover:border-[#FEFB58]/40
                          group-hover:bg-[#FEFB58]

                          sm:h-12
                          sm:w-12
                          sm:rounded-2xl
                        "
                      >
                        <Icon className="h-[18px] w-[18px] text-[#FEFB58] transition-colors duration-500 group-hover:text-[#2A2827] sm:h-5 sm:w-5" />
                      </div>

                      <span className="font-mono text-[10px] font-medium text-white/30 sm:text-xs">
                        /{feature.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="mt-auto pt-12 sm:pt-14 lg:pt-16">
                      <p className="mb-2.5 text-[8px] font-black uppercase tracking-[0.24em] text-[#FEFB58]/80 sm:text-[9px] sm:tracking-[0.28em]">
                        {feature.eyebrow}
                      </p>

                      <h3
                        className="
                          max-w-xl
                          text-[1.45rem]
                          font-bold
                          leading-[1.05]
                          tracking-[-0.035em]
                          text-[#F4EFE7]

                          sm:text-2xl

                          md:text-[1.7rem]

                          lg:text-[2.2rem]
                        "
                      >
                        {feature.title}
                      </h3>

                      <p
                        className="
                          mt-3
                          max-w-xl
                          text-[13px]
                          leading-[1.55]
                          text-white/50
                          transition-colors
                          duration-500
                          group-hover:text-white/70

                          sm:mt-4
                          sm:text-sm
                          sm:leading-6
                        "
                      >
                        {feature.description}
                      </p>
                    </div>

                    {/* Bottom */}
                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        border-t
                        border-white/10
                        pt-3.5

                        sm:mt-6
                        sm:pt-4
                      "
                    >
                      <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30 sm:text-[10px] sm:tracking-[0.2em]">
                        {feature.shortTitle}
                      </span>

                      <motion.span
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
                        }}
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/10
                          text-white/60
                          transition-all
                          duration-300
                          group-hover:border-[#FEFB58]
                          group-hover:bg-[#FEFB58]
                          group-hover:text-[#2A2827]

                          sm:h-8
                          sm:w-8
                        "
                      >
                        <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </motion.span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* =======================================================
            CLOSING STATEMENT
        ======================================================= */}
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 25 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            relative
            mt-4
            overflow-hidden
            rounded-[1.5rem]
            bg-[#FEFB58]
            px-5
            py-8

            sm:mt-5
            sm:rounded-[1.75rem]
            sm:px-7
            sm:py-10

            md:px-9
            md:py-12

            lg:mt-6
            lg:rounded-[2rem]
            lg:px-14
            lg:py-14
          "
        >
          {/* Decorative circle */}
          <div
            aria-hidden="true"
            className="
              absolute
              -right-24
              -top-28
              h-60
              w-60
              rounded-full
              border-[28px]
              border-[#2A2827]/[0.045]

              sm:-right-20
              sm:-top-32
              sm:h-72
              sm:w-72
              sm:border-[40px]
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-7

              sm:gap-8

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* Text */}
            <div className="max-w-3xl">
              <p className="text-[9px] font-black uppercase tracking-[0.26em] text-[#5B514B] sm:text-[10px] sm:tracking-[0.3em]">
                The Mushia Standard
              </p>

              <h3
                className="
                  mt-2.5
                  text-[1.5rem]
                  font-black
                  leading-[1.08]
                  tracking-[-0.04em]
                  text-[#2A2827]

                  sm:mt-3
                  sm:text-2xl

                  md:text-3xl

                  lg:text-4xl
                "
              >
                A better place to live can make a better environment to learn.
              </h3>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="
                      h-8
                      w-8
                      rounded-full
                      border-2
                      border-[#FEFB58]
                      bg-[#2A2827]

                      sm:h-9
                      sm:w-9
                    "
                  />
                ))}
              </div>

              <span className="max-w-[145px] text-[10px] font-bold leading-4 text-[#5B514B] sm:max-w-[150px] sm:text-xs">
                Built around the way students actually live.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};