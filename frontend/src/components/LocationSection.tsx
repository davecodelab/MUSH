'use client';

import React from 'react';
import { useHostel } from '../context/HostelContext';
import { MapPin, Navigation, Building, Clock, Bus, ExternalLink } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { setActiveView, config } = useHostel();

  const proximities = [
    { name: 'KNUST Ayeduase Gate', time: '3 mins walking', icon: MapPin },
    { name: 'KNUST Commercial Area & Banks', time: '5 mins drive / shuttle', icon: Building },
    { name: 'College of Engineering & Sciences', time: '6 mins by shuttle', icon: Bus },
    { name: 'KNUST Hospital & Pharmacy Faculty', time: '8 mins by vehicle', icon: Clock },
  ];

  return (
    <section id="location" className="py-20 bg-[#EAE3D9]/60 border-t border-b border-[#A1927D]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Text and Proximity Info */}
          <div>
            <span className="text-xs font-bold tracking-widest text-[#7D6E66] uppercase mb-2 block">
              Strategic Neighborhood
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2A2827] tracking-tight mb-4">
              Find Mushia Hostel at Ayeduase Newsite
            </h2>
            <p className="text-sm text-[#5B514B] leading-relaxed mb-6">
              Mushia Hostel is situated at <strong>FNF Junction, Ayeduase Newsite, Kumasi, Ghana</strong>. 
              Enjoy prime proximity to lecture theatres, student eateries, campus shuttles, and commercial facilities while avoiding the heavy noise of main roads.
            </p>

            {/* Proximity List */}
            <div className="space-y-3 mb-8">
              {proximities.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-[#A1927D]/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#5B514B]/10 text-[#5B514B] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#2A2827]" />
                      </div>
                      <span className="font-bold text-[#2A2827]">{item.name}</span>
                    </div>
                    <span className="text-[#8B756C] font-semibold">{item.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://maps.google.com/?q=Ayeduase+Newsite+Kumasi"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-[#2A2827] hover:bg-[#5B514B] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-[#FEFB58]" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>

              <button
                onClick={() => setActiveView('rooms')}
                className="px-6 py-3 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-md cursor-pointer"
              >
                Book a Room Here
              </button>
            </div>
          </div>

          {/* Map Visual Graphic */}
          <div className="bg-[#2A2827] rounded-2xl overflow-hidden border border-[#7D6E66] shadow-xl relative aspect-4/3 flex flex-col justify-between p-6 text-white">
            
            {/* Compass / Orientation Header */}
            <div className="flex justify-between items-start z-10">
              <div className="bg-[#2A2827]/90 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-[#7D6E66]/50">
                <span className="text-[10px] text-[#A1927D] uppercase font-bold block">Location GPS</span>
                <span className="text-xs font-mono font-bold text-white">6.6745° N, 1.5642° W</span>
              </div>

              <div className="bg-[#FEFB58] text-[#2A2827] px-3 py-1 rounded-lg text-xs font-black shadow-md">
                Ayeduase Newsite
              </div>
            </div>

            {/* Stylized Architectural Map Canvas Simulation */}
            <div className="my-auto text-center space-y-3 z-10">
              <div className="w-16 h-16 rounded-full bg-[#FEFB58] text-[#2A2827] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">MUSHIA HOSTEL</h3>
              <p className="text-xs text-[#A5ABAA] max-w-xs mx-auto">
                FNF Junction, Ayeduase Newsite<br />Kumasi, Ashanti Region, Ghana
              </p>
            </div>

            {/* Footer with Shuttle Route Note */}
            <div className="z-10 bg-[#5B514B]/80 backdrop-blur-sm p-3 rounded-xl border border-[#7D6E66]/50 text-xs text-[#F4EFE7] flex items-center justify-between">
              <span>Shuttle Pick-up: Regular Ayeduase - Campus minivans operate at FNF Junction.</span>
            </div>

            {/* Subtle grid lines background overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FEFB58_1px,transparent_1px)] bg-size-[16px_16px]"></div>
          </div>

        </div>

      </div>
    </section>
  );
};
