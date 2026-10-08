'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { MUSHIA_IMAGES } from '../data/seedRooms';
import { MapPin, ArrowRight, ShieldCheck, Wifi, Sparkles, Building } from 'lucide-react';

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
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="relative bg-[#2A2827] text-[#F4EFE7] overflow-hidden">
      {/* Background Hero Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          src={MUSHIA_IMAGES.exterior}
          alt="Mushia Hostel exterior building at Ayeduase Kumasi"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A2827] via-[#2A2827]/85 to-[#2A2827]/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A2827] via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          
          {/* Location Badge (Text format, anti-slop, clean typography) */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#5B514B]/80 text-[#FEFB58] text-xs font-semibold tracking-wide backdrop-blur-md mb-6 border border-[#7D6E66]/40 shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#FEFB58]" />
            <span>FNF Junction, Ayeduase Newsite, Kumasi</span>
            <span className="text-[#A5ABAA] hidden sm:inline">· 3 mins to KNUST Gate</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4EFE7] leading-[1.1] mb-6 text-balance"
          >
            Your KNUST Home <br />
            <span className="text-[#FEFB58] drop-shadow-sm">Starts Here.</span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#F4EFE7]/90 leading-relaxed mb-8 max-w-2xl font-normal"
          >
            Comfortable, fully equipped student accommodation at Mushia Hostel, conveniently 
            located at FNF Junction, Ayeduase Newsite. Choose your exact room space, make a secure reservation, 
            and connect with verified KNUST roommates.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView('rooms')}
              className="px-6 py-3.5 bg-[#FEFB58] text-[#2A2827] hover:bg-[#fff945] font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <span>Book a Room</span>
              <ArrowRight className="w-4 h-4 text-[#2A2827]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView('floor-explorer')}
              className="px-6 py-3.5 bg-[#5B514B]/70 hover:bg-[#5B514B] text-[#F4EFE7] font-semibold text-sm sm:text-base rounded-xl border border-[#7D6E66]/60 transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Building className="w-4 h-4 text-[#A1927D]" />
              <span>Explore 6 Floors (120 Rooms)</span>
            </motion.button>
          </motion.div>

          {/* Key Trust Signals */}
          <motion.div
            variants={itemVariants}
            className="pt-6 border-t border-[#5B514B]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm"
          >
            <div className="p-2 rounded-lg bg-[#2A2827]/40 border border-[#5B514B]/30 backdrop-blur-sm">
              <span className="block font-black text-xl text-[#F4EFE7] tabular-nums">120</span>
              <span className="text-[#A5ABAA] text-xs">Configured Rooms</span>
            </div>
            <div className="p-2 rounded-lg bg-[#2A2827]/40 border border-[#5B514B]/30 backdrop-blur-sm">
              <span className="block font-black text-xl text-[#F4EFE7] tabular-nums">6 Floors</span>
              <span className="text-[#A5ABAA] text-xs">Ground to 5th Floor</span>
            </div>
            <div className="p-2 rounded-lg bg-[#2A2827]/40 border border-[#5B514B]/30 backdrop-blur-sm">
              <span className="block font-black text-xl text-[#F4EFE7]">4 Types</span>
              <span className="text-[#A5ABAA] text-xs">1-in-1 up to 4-in-1</span>
            </div>
            <div className="p-2 rounded-lg bg-[#2A2827]/40 border border-[#5B514B]/30 backdrop-blur-sm">
              <span className="block font-black text-xl text-[#FEFB58]">Paystack</span>
              <span className="text-[#A5ABAA] text-xs">MoMo & Card Verified</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};
