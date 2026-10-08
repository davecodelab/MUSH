'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { MUSHIA_IMAGES } from '../data/seedRooms';
import { 
  ShieldCheck, 
  BookOpen, 
  Tv, 
  SunMedium, 
  Utensils, 
  Zap, 
  Droplets, 
  Wifi,
  ArrowRight
} from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const { setActiveView } = useHostel();

  const facilities = [
    {
      title: 'Dedicated Study Hall',
      category: 'Academic Focus',
      description: 'Quiet, air-conditioned study hall with individual study desks, task lights, bookshelves, and high-speed Wi-Fi, open 24 hours daily.',
      image: MUSHIA_IMAGES.studyRoom,
      icon: BookOpen,
    },
    {
      title: 'TV & Student Common Lounge',
      category: 'Community & Entertainment',
      description: 'Comfortable sectional sofas, wide-screen satellite TV, and communal space to unwind and socialize with fellow KNUST residents.',
      image: MUSHIA_IMAGES.lounge,
      icon: Tv,
    },
    {
      title: '24/7 Security & CCTV Surveillance',
      category: 'Safety & Protection',
      description: 'Continuous high-definition CCTV coverage on all 6 floors, stairwells, perimeter gates, and 24-hour trained security personnel.',
      image: MUSHIA_IMAGES.exterior,
      icon: ShieldCheck,
    },
    {
      title: 'Standby Generator & Water Reservoirs',
      category: 'Essential Utilities',
      description: 'Automatic heavy-duty plant kicks in within 15 seconds of power outage. High-capacity overhead reservoirs ensure constant running water.',
      image: MUSHIA_IMAGES.exterior,
      icon: Zap,
    },
    {
      title: 'Spacious Balconies',
      category: 'Relaxation',
      description: 'Well-ventilated perimeter balconies offering natural cooling and scenic views across Ayeduase Newsite and Kumasi.',
      image: MUSHIA_IMAGES.interior,
      icon: SunMedium,
    },
    {
      title: 'En-Suite Washrooms & Kitchenettes',
      category: 'Daily Convenience',
      description: 'Ceramic tiled modern private washrooms in every room with water heaters, plus shared kitchen stations for student meals.',
      image: MUSHIA_IMAGES.interior,
      icon: Utensils,
    },
  ];

  return (
    <section id="facilities" className="py-20 bg-[#F4EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-[#7D6E66] uppercase mb-2 block">
              Hostel Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2A2827] tracking-tight">
              Designed for Comfort, Focus & Peace of Mind
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#5B514B]">
              Every facility at Mushia Hostel is curated to ensure KNUST students thrive academically while living comfortably.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('rooms')}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md self-start"
          >
            <span>Book Your Space</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl border border-[#A1927D]/40 overflow-hidden flex flex-col justify-between hover:border-[#5B514B] hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden bg-[#2A2827]">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A2827]/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 bg-[#2A2827]/90 text-[#FEFB58] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm">
                    {fac.category}
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                    <div className="w-7 h-7 rounded-lg bg-[#5B514B] flex items-center justify-center text-[#FEFB58]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#F4EFE7]">{fac.title}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-[#5B514B] leading-relaxed mb-4">
                    {fac.description}
                  </p>

                  <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between text-xs text-[#7D6E66]">
                    <span>Included in all bookings</span>
                    <span className="text-[#2A2827] font-semibold">24/7 Available</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
