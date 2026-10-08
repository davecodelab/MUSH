'use client';

import React from 'react';
import { useHostel } from '../context/HostelContext';
import { Building2, MapPin, Phone, Mail, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, config } = useHostel();

  const handleNav = (view: any) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2A2827] text-[#F4EFE7] border-t border-[#5B514B]">
      
      {/* Final Pre-Footer Call to Action (Section #65) */}
      <div className="border-b border-[#5B514B]/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-[#A1927D] uppercase tracking-widest block">
            KNUST Academic Session Accommodation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Find Your Space?
          </h2>
          <p className="text-sm sm:text-base text-[#A5ABAA] max-w-xl mx-auto">
            Secure your accommodation at Mushia Hostel and make your university journey comfortable, focused, and safe.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleNav('rooms')}
              className="px-8 py-3.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-black text-sm rounded-xl transition-all shadow-xl active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Book Your Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#5B514B] flex items-center justify-center text-[#FEFB58]">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Mushia Hostel
              </span>
            </div>

            <p className="text-xs text-[#A5ABAA] leading-relaxed max-w-sm">
              Official student accommodation serving KNUST undergraduate and postgraduate students. 
              Featuring 120 rooms across 6 floors at Ayeduase Newsite, Kumasi, Ghana.
            </p>

            <div className="text-xs text-[#A5ABAA] space-y-1.5 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FEFB58] shrink-0 mt-0.5" />
                <span>{config.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FEFB58] shrink-0" />
                <span>{config.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FEFB58] shrink-0" />
                <span>{config.email}</span>
              </div>
            </div>
          </div>

          {/* Accommodation links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1927D] mb-4">
              Explore Hostel
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A5ABAA]">
              <li>
                <button onClick={() => handleNav('rooms')} className="hover:text-[#FEFB58] transition-colors cursor-pointer">
                  120 Room Inventory
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('floor-explorer')} className="hover:text-[#FEFB58] transition-colors cursor-pointer">
                  Interactive Floor Explorer
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('facilities')} className="hover:text-[#FEFB58] transition-colors cursor-pointer">
                  Hostel Facilities & Study Hall
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-[#FEFB58] transition-colors cursor-pointer">
                  Photo Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Student Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1927D] mb-4">
              Resident Life
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A5ABAA]">
              <li>
                <button onClick={() => handleNav('roommates')} className="hover:text-[#FEFB58] transition-colors cursor-pointer">
                  Roommate Matching Hub
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('dashboard')} className="hover:text-[#FEFB58] transition-colors cursor-pointer">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-[#FEFB58] transition-colors cursor-pointer">
                  How Booking Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('location')} className="hover:text-[#FEFB58] transition-colors cursor-pointer">
                  Campus Location & Shuttles
                </button>
              </li>
            </ul>
          </div>

          {/* Administration & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1927D] mb-4">
              Management
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A5ABAA]">
              <li>
                <button onClick={() => handleNav('admin')} className="hover:text-[#FEFB58] text-[#FEFB58] font-semibold transition-colors cursor-pointer flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              </li>
              <li>
                <span className="block text-zinc-400">Paystack Verified Gateway</span>
              </li>
              <li>
                <span className="block text-zinc-400">KNUST Accommodation Standards</span>
              </li>
              <li>
                <span className="block text-zinc-400">Ayeduase Newsite, Kumasi</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#5B514B]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A5ABAA] gap-4">
          <p>© {new Date().getFullYear()} Mushia Hostel. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Secure Student Accommodation</span>
            <span>·</span>
            <span>KNUST, Kumasi</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
