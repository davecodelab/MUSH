'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { RoomType } from '../types';
import { MUSHIA_IMAGES } from '../data/seedRooms';
import {
  Users,
  ArrowUpRight,
  Check,
  Sparkles,
  Snowflake,
  DoorOpen,
} from 'lucide-react';

interface RoomTypeShowcaseProps {
  onSelectType?: (type: RoomType) => void;
}

export const RoomTypesShowcase: React.FC<RoomTypeShowcaseProps> = ({
  onSelectType,
}) => {
  const { setActiveView } = useHostel();
  const shouldReduceMotion = useReducedMotion();

  const roomTypesData = [
    {
      type: '4-in-1' as RoomType,
      number: '01',
      label: 'The Social Choice',
      tagline: 'More people. More energy. More value.',
      capacity: 4,
      startingPrice: 'GHS 6,500',
      description:
        'A practical choice for students who enjoy having people around. You get your own personal study and storage space while sharing the room with three other students.',
      highlights: [
        'Individual study space',
        'Personal wardrobe',
        'En-suite washroom',
        'AC or fan depending on room',
      ],
      note: 'Great for students who want affordability without feeling disconnected from campus life.',
      image: MUSHIA_IMAGES.interior,
      accent: '#6D8EBC',
      size: 'large',
    },

    {
      type: '3-in-1' as RoomType,
      number: '02',
      label: 'The Balanced Choice',
      tagline: 'The sweet spot between privacy and price.',
      capacity: 3,
      startingPrice: 'GHS 8,200',
      description:
        'A comfortable middle ground for students who want a little more breathing room without stepping into the higher price range. Room layouts vary, so some spaces feel especially cosy and others more open.',
      highlights: [
        'Personal study station',
        'Individual wardrobe',
        'En-suite washroom',
        'Selected rooms with balcony',
      ],
      note: 'A popular option for friends who want to stay together while keeping things comfortable.',
      image: MUSHIA_IMAGES.interior,
      accent: '#594C43',
      size: 'medium',
    },

    {
      type: '2-in-1' as RoomType,
      number: '03',
      label: 'The Comfort Choice',
      tagline: 'Room to focus. Room to breathe.',
      capacity: 2,
      startingPrice: 'GHS 10,800',
      description:
        'Ideal for two students who value a calmer environment. With fewer people sharing the room, everyday routines feel easier and your personal space goes a little further.',
      highlights: [
        'More personal space',
        'Individual study areas',
        'Personal wardrobe',
        'Selected rooms with AC',
      ],
      note: 'A strong fit for friends or study partners who want comfort and a quieter room.',
      image: MUSHIA_IMAGES.interior,
      accent: '#6B625B',
      size: 'medium',
    },

    {
      type: '1-in-1' as RoomType,
      number: '04',
      label: 'The Private Choice',
      tagline: 'Your space. Your rhythm.',
      capacity: 1,
      startingPrice: 'GHS 14,000',
      description:
        'For students who prefer having their own space at the end of a busy day. The 1-in-1 gives you the privacy to study, rest and settle into your own routine.',
      highlights: [
        'Private room',
        'Dedicated study area',
        'En-suite washroom',
        'Selected rooms with AC or balcony',
      ],
      note: 'Best suited to students who value privacy, quiet and a little more independence.',
      image: MUSHIA_IMAGES.interior,
      accent: '#2B272A',
      size: 'medium',
    },
  ];

  const handleExplore = (type: RoomType) => {
    onSelectType?.(type);
    setActiveView('rooms');
  };

  return (
    <section className="relative overflow-hidden bg-[#F3EEE7] text-[#2B272A]">
      {/* =========================================================
          BACKGROUND ATMOSPHERE
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* subtle architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.065]"
          style={{
            backgroundImage: `
              linear-gradient(#2B272A 1px, transparent 1px),
              linear-gradient(90deg, #2B272A 1px, transparent 1px)
            `,
            backgroundSize: '90px 90px',
          }}
        />

        {/* soft window-yellow glow */}
        <div className="absolute -right-40 top-20 h-125 w-125 rounded-full bg-[#FEFB58]/10 blur-3xl" />

        {/* warm architectural glow */}
        <div className="absolute -left-40 bottom-40 h-125 w-125 rounded-full bg-[#FEFB58]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-350 px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        {/* =========================================================
            HEADER========================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 35,
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
          className="mb-20 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:mb-28"
        >
          <div>
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#5ac02a]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#6B625B]">
                Find your fit
              </span>
            </div>

            <h2 className="max-w-5xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.87] tracking-[-0.07em]">
              A room for
              <br />
              <span className="text-[#6B625B]">your kind of life.</span>
            </h2>
          </div>

          <div className="max-w-md lg:pb-2">
            <p className="text-sm leading-7 text-[#6B625B] sm:text-base">
              Whether you like having people around or prefer your own quiet
              corner, Mushia gives you different ways to make campus living
              feel like home.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                'Ayeduase',
                'Student Living',
                'Near KNUST',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#A79C92]/50 bg-white/40 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#594C43]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* =========================================================
            FEATURED 4-IN-1
        ========================================================= */}

        {(() => {
          const featured = roomTypesData[0];

          return (
            <motion.article
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 45,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative mb-6 overflow-hidden rounded-4xl bg-[#2B272A] lg:rounded-[2.5rem]"
            >
              <div className="grid lg:min-h-152.5 lg:grid-cols-[1.05fr_0.95fr]">
                {/* IMAGE */}

                <div className="relative min-h-105 overflow-hidden lg:min-h-full">
                  <motion.img
                    src={featured.image}
                    alt="4-in-1 room at Mushia Hostel"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-[#2B272A]/80 via-[#2B272A]/10 to-transparent" />

                  {/* image label */}

                  <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-[#2B272A]/50 px-4 py-2 backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-[#f9eb29]" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white">
                      Most affordable
                    </span>
                  </div>

                  {/* room number */}

                  <div className="absolute bottom-7 left-7">
                    <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/60">
                      {featured.number}
                    </span>

                    <div className="mt-2 text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
                      {featured.type}
                    </div>
                  </div>
                </div>

                {/* CONTENT */}

                <div className="relative flex flex-col justify-between p-7 text-[#F3EEE7] sm:p-10 lg:p-12">
                  <div>
                    <div className="mb-8 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f9eb29]">
                          {featured.label}
                        </p>

                        <p className="mt-2 text-sm text-[#A79C92]">
                          {featured.tagline}
                        </p>
                      </div>

                      <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 sm:flex">
                        <Users className="h-4 w-4 text-[#f9eb29]" />
                      </div>
                    </div>

                    <h3 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                      Good company,
                      <br />
                      without the big price tag.
                    </h3>

                    <p className="mt-6 max-w-lg text-sm leading-7 text-[#A79C92]">
                      {featured.description}
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                      {featured.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/3 p-3"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f9eb29]" />

                          <span className="text-[10px] leading-5 text-[#D4CEC8]">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 border-t border-white/10 pt-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[#A79C92]">
                          Starting from
                        </span>

                        <span className="mt-1 block text-2xl font-semibold tracking-tight text-white">
                          {featured.startingPrice}
                          <span className="ml-1 text-[10px] font-normal text-[#A79C92]">
                            / year
                          </span>
                        </span>
                      </div>

                      <motion.button
                        whileHover={
                          shouldReduceMotion ? undefined : { scale: 1.03 }
                        }
                        whileTap={
                          shouldReduceMotion ? undefined : { scale: 0.98 }
                        }
                        onClick={() => handleExplore(featured.type)}
                        className="group/button inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-[#F3EEE7] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#2B272A] transition-colors hover:bg-[#d8d340] hover:text-white"
                      >
                        Explore {featured.type}

                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2B272A] text-white transition-transform group-hover/button:rotate-45">
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })()}

        {/* =========================================================
            SECONDARY ROOM CONFIGURATIONS
        ========================================================= */}

        <div className="grid gap-6 lg:grid-cols-3">
          {roomTypesData.slice(1).map((item, index) => (
            <motion.article
              key={item.type}
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -7,
                    }
              }
              className="group overflow-hidden rounded-4xl border border-[#A79C92]/40 bg-white/45 backdrop-blur-sm transition-colors duration-500 hover:border-[#6D8EBC]/50 hover:bg-white/70"
            >
              {/* IMAGE */}

              <div className="relative h-67.5 overflow-hidden bg-[#594C43]">
                <motion.img
                  src={item.image}
                  alt={`${item.type} room at Mushia Hostel`}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#2B272A]/75 via-transparent to-transparent" />

                <div className="absolute left-5 top-5 rounded-full bg-[#F3EEE7]/90 px-3 py-1.5 backdrop-blur-sm">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#594C43]">
                    {item.label}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/60">
                      {item.number}
                    </span>

                    <h3 className="mt-1 text-4xl font-semibold tracking-[-0.06em] text-white">
                      {item.type}
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* CONTENT */}

              <div className="flex min-h-[370px] flex-col p-7">
                <div>
                  <p className="text-sm font-semibold text-[#594C43]">
                    {item.tagline}
                  </p>

                  <p className="mt-4 text-sm leading-7 text-[#6B625B]">
                    {item.description}
                  </p>

                  {/* Feature list */}

                  <div className="mt-7 space-y-3">
                    {item.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center gap-3"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6D8EBC]/10">
                          <Check className="h-3 w-3 text-[#594C43]" />
                        </span>

                        <span className="text-[11px] font-medium text-[#594C43]">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER */}

                <div className="mt-auto border-t border-[#A79C92]/30 pt-6">
                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-[#8A8179]">
                        From
                      </span>

                      <span className="mt-1 block text-xl font-semibold tracking-tight text-[#2B272A]">
                        {item.startingPrice}
                        <span className="ml-1 text-[9px] font-normal text-[#8A8179]">
                          / year
                        </span>
                      </span>
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8A8179]">
                      {item.capacity} {item.capacity === 1 ? 'student' : 'students'}
                    </span>
                  </div>

                  <motion.button
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 1.015,
                          }
                    }
                    whileTap={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 0.985,
                          }
                    }
                    onClick={() => handleExplore(item.type)}
                    className="group/button flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#2B272A] px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.13em] text-[#F3EEE7] transition-colors duration-300 hover:bg-[#594C43]"
                  >
                    <span>Explore {item.type}</span>

                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/button:rotate-45" />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* =========================================================BOTTOM INFORMATION STRIP========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-8 overflow-hidden rounded-3xl border border-[#A79C92]/40 bg-[#2B272A]"
        >
          <div className="grid sm:grid-cols-3">
            <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5 sm:border-b-0 sm:border-r">
              <DoorOpen className="h-5 w-5 text-[#FEFB58]" />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A79C92]">
                  Choose your setup
                </p>

                <p className="mt-1 text-xs font-medium text-[#F3EEE7]">
                  1, 2, 3 or 4 students
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5 sm:border-b-0 sm:border-r">
              <Snowflake className="h-5 w-5 text-[#FEFB58]" />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A79C92]">
                  Room features
                </p>

                <p className="mt-1 text-xs font-medium text-[#F3EEE7]">
                  Vary by room
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-5">
              <Sparkles className="h-5 w-5 text-[#FEFB58]" />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A79C92]">
                  Need something specific?
                </p>

                <button
                  onClick={() => setActiveView('rooms')}
                  className="mt-1 cursor-pointer text-xs font-medium text-[#F3EEE7] underline decoration-[#FEFB58] underline-offset-4 transition-colors hover:text-[#FEFB58]"
                >
                  Check live availability
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};