'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Bed, 
  Wind, 
  BookOpen, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

export const WhyMushia: React.FC = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Convenient Location',
      description: 'Located at FNF Junction, Ayeduase Newsite, right beside KNUST campus with reliable shuttle and taxi connections.',
    },
    {
      icon: Bed,
      title: 'Fully Equipped Rooms',
      description: 'Built-in wardrobes, personal study desks, ergonomic chairs, ceiling fans, and private en-suite washrooms.',
    },
    {
      icon: Users,
      title: 'Multiple Room Options',
      description: 'Configurable options for 4-in-1, 3-in-1, 2-in-1, and private 1-in-1 spaces across 6 residential floors.',
    },
    {
      icon: Wind,
      title: 'Climate Comfort',
      description: 'Choose between split-unit air-conditioned suites and well-ventilated rooms with high-velocity ceiling fans.',
    },
    {
      icon: BookOpen,
      title: 'Dedicated Study Hall',
      description: 'Quiet, air-conditioned study hall with high-speed Wi-Fi, power backup, and individual study stations.',
    },
    {
      icon: ShieldCheck,
      title: '24/7 Security & CCTV',
      description: 'Comprehensive CCTV coverage across all corridors, perimeter lighting, controlled access, and standby generator.',
    },
  ];

  return (
    <section className="py-20 bg-[#F4EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-bold tracking-widest text-[#7D6E66] uppercase mb-2 block">
            Why Choose Mushia
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2A2827] tracking-tight text-balance">
            Engineered for KNUST Academic Success & Comfortable Living.
          </h2>
          <p className="mt-3 text-[#5B514B] text-base leading-relaxed">
            Experience student accommodation that blends physical security, academic tranquility, 
            and modern amenities right at Ayeduase Newsite.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white/80 border border-[#A1927D]/40 rounded-xl p-6 hover:border-[#7D6E66] transition-all hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#5B514B]/10 text-[#5B514B] flex items-center justify-center mb-5 group-hover:bg-[#FEFB58]/30 transition-colors">
                  <Icon className="w-6 h-6 text-[#2A2827]" />
                </div>
                <h3 className="text-lg font-bold text-[#2A2827] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#7D6E66] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
