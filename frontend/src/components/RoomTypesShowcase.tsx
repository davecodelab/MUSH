'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { RoomType } from '../types';
import { MUSHIA_IMAGES } from '../data/seedRooms';
import { Users, ArrowRight, Check } from 'lucide-react';

interface RoomTypeShowcaseProps {
  onSelectType?: (type: RoomType) => void;
}

export const RoomTypesShowcase: React.FC<RoomTypeShowcaseProps> = ({ onSelectType }) => {
  const { setActiveView } = useHostel();

  const roomTypesData = [
    {
      type: '4-in-1' as RoomType,
      tagline: 'Shared living. Better affordability.',
      capacity: 4,
      startingPrice: 'GHS 6,500',
      description: 'Ideal for students seeking an affordable, social university living experience with generous wardrobe and desk space.',
      highlights: ['Split AC / Fan options', 'Individual lockable desks', '4 built-in wardrobes', 'En-suite washroom'],
      image: MUSHIA_IMAGES.interior,
    },
    {
      type: '3-in-1' as RoomType,
      tagline: 'The balance between affordability and personal space.',
      capacity: 3,
      startingPrice: 'GHS 8,200',
      description: 'The preferred choice for a balanced student lifestyle, offering increased personal space while remaining economical.',
      highlights: ['Balcony options available', 'Spacious floor plan', 'Individual study stations', 'En-suite modern washroom'],
      image: MUSHIA_IMAGES.interior,
    },
    {
      type: '2-in-1' as RoomType,
      tagline: 'More privacy. More personal space.',
      capacity: 2,
      startingPrice: 'GHS 10,800',
      description: 'Perfect for serious study partners or friends who want higher privacy and calm academic focus.',
      highlights: ['Split AC units', 'Dual study tables', 'Spacious room layout', 'Priority floor locations'],
      image: MUSHIA_IMAGES.interior,
    },
    {
      type: '1-in-1' as RoomType,
      tagline: 'Your own private sanctuary.',
      capacity: 1,
      startingPrice: 'GHS 14,000',
      description: 'The ultimate executive student accommodation with complete personal privacy, undisturbed quiet, and maximum comfort.',
      highlights: ['Full AC included', 'Executive study suite', 'Private en-suite bath', 'Premium balcony view'],
      image: MUSHIA_IMAGES.interior,
    },
  ];

  const handleExplore = (type: RoomType) => {
    if (onSelectType) {
      onSelectType(type);
    }
    setActiveView('rooms');
  };

  return (
    <section className="py-20 bg-[#EAE3D9]/60 border-t border-b border-[#A1927D]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-[#7D6E66] uppercase mb-2 block">
              Accommodation Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2A2827] tracking-tight">
              Select Your Preferred Room Configuration
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#5B514B]">
              All spaces include full access to the study hall, TV lounge, standby power, and security.
            </p>
          </div>

          <motion.button
            whileHover={{ x: 3 }}
            onClick={() => setActiveView('rooms')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2A2827] hover:text-[#5B514B] cursor-pointer"
          >
            <span>Explore Room Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* 4 Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roomTypesData.map((item, idx) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl border border-[#A1927D]/50 overflow-hidden flex flex-col hover:border-[#5B514B] hover:shadow-xl transition-shadow group"
            >
              {/* Image Preview with Capacity Marker */}
              <div className="relative h-48 overflow-hidden bg-[#2A2827]">
                <img
                  src={item.image}
                  alt={`${item.type} room at Mushia Hostel`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2827]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-xl font-extrabold block text-[#FEFB58]">{item.type}</span>
                  <span className="text-xs text-[#A5ABAA] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{item.capacity} students / room</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8B756C] mb-2">
                    {item.tagline}
                  </p>
                  <p className="text-xs text-[#5B514B] leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <ul className="space-y-1.5 mb-6 text-xs text-[#2A2827]">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#5B514B] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#EAE3D9]">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider text-[#7D6E66]">From</span>
                    <span className="text-base font-extrabold text-[#2A2827] tabular-nums">
                      {item.startingPrice} <span className="text-[10px] font-normal text-[#7D6E66]">/ year</span>
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExplore(item.type)}
                    className="w-full py-2.5 px-3 bg-[#5B514B] hover:bg-[#2A2827] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Explore {item.type}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
