'use client';

import React from 'react';
import { useHostel } from '../context/HostelContext';
import {
  MapPin,
  Navigation,
  Building2,
  Clock3,
  Bus,
  ExternalLink,
  ArrowUpRight,
  CheckCircle2,
  Car,
  PhoneCall,
} from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { setActiveView } = useHostel();

  const googleMapsUrl =
    'https://maps.app.goo.gl/iK3ewxr5KKWiWeu37';

  const proximities = [
    {
      name: 'KNUST Ayeduase Gate',
      time: '3 min walk',
      icon: MapPin,
    },
    {
      name: 'Commercial Area & Banks',
      time: '5 min drive',
      icon: Building2,
    },
    {
      name: 'College of Engineering & Sciences',
      time: '6 min shuttle',
      icon: Bus,
    },
    {
      name: 'KNUST Hospital & Pharmacy Faculty',
      time: '8 min drive',
      icon: Clock3,
    },
  ];

  return (
    <section
      id="location"
      className="relative overflow-hidden bg-[#F7F4EF] py-20 sm:py-24 lg:py-28"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#A1927D]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#5B514B]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* SECTION HEADER */}
        <div className="mb-12 max-w-2xl lg:mb-16">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#8B756C]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7D6E66]">
              Find Your Way
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#252322] sm:text-4xl lg:text-5xl">
            Right where campus
            <span className="block text-[#7D6E66]">
              meets convenience.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#665D57] sm:text-base">
            Mushia Hostel puts you close to KNUST, everyday essentials and
            convenient transport routes — giving you a quieter place to stay
            without being far from campus life.
          </p>
        </div>

        {/* MAIN LOCATION GRID */}
        <div className="grid overflow-hidden rounded-[28px] border border-[#A1927D]/20 bg-white shadow-[0_20px_70px_rgba(42,40,39,0.08)] lg:grid-cols-[0.95fr_1.05fr]">

          {/* LEFT — LOCATION INFORMATION */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">

            {/* Address */}
            <div>
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2A2827] text-white shadow-sm">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B756C]">
                    Our Location
                  </p>

                  <h3 className="text-xl font-extrabold tracking-tight text-[#2A2827]">
                    Mushia Hostel
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#665D57]">
                    FNF Junction, Ayeduase Newsite
                    <br />
                    Kumasi, Ashanti Region, Ghana
                  </p>
                </div>
              </div>

              {/* Location highlight */}
              <div className="mb-8 rounded-2xl border border-[#A1927D]/20 bg-[#F7F4EF] p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7D6E66]" />

                  <p className="text-xs leading-6 text-[#5B514B]">
                    A convenient Ayeduase location with easy access to KNUST,
                    student amenities, shuttle routes and everyday essentials.
                  </p>
                </div>
              </div>

              {/* Proximity heading */}
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#2A2827]">
                  Nearby & Convenient
                </h4>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1927D]">
                  Approx. travel times
                </span>
              </div>

              {/* Proximity Cards */}
              <div className="grid gap-2.5">
                {proximities.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="group flex items-center justify-between rounded-2xl border border-[#A1927D]/15 bg-white p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7D6E66]/30 hover:shadow-md"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0ECE6] text-[#5B514B] transition-colors group-hover:bg-[#2A2827] group-hover:text-white">
                          <Icon className="h-4 w-4" />
                        </div>

                        <span className="truncate text-xs font-bold text-[#2A2827] sm:text-sm">
                          {item.name}
                        </span>
                      </div>

                      <span className="ml-3 shrink-0 rounded-full bg-[#F7F4EF] px-2.5 py-1 text-[10px] font-bold text-[#7D6E66]">
                        {item.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2A2827] px-5 py-3.5 text-xs font-bold text-white transition-all duration-300 hover:bg-[#5B514B] hover:shadow-lg sm:text-sm"
              >
                <Navigation className="h-4 w-4 text-[#FEFB58]" />
                Get Directions
                <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

             <a href="tel:+233249203029" className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ab9e42] px-5 py-3.5 text-xs font-bold text-[#F3EEE7] shadow-sm transition-all duration-300 hover:bg-[#594C43] hover:shadow-lg sm:text-sm">
  <PhoneCall className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
  Call Us Now
   </a>
            </div>
          </div>

          {/* RIGHT — REAL GOOGLE MAP */}
          <div className="relative min-h-105 overflow-hidden bg-[#E9E5DF] lg:min-h-155">

            {/* Google Maps iframe */}
            <iframe
              title="Mushia Hostel Location"
              src="https://www.google.com/maps?q=6.6740187,-1.5505557&z=17&output=embed"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Top floating location badge */}
            <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between sm:left-6 sm:right-6 sm:top-6">

              <div className="rounded-2xl border border-white/50 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2827] text-white">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8B756C]">
                      Located in
                    </p>

                    <p className="text-xs font-extrabold text-[#2A2827]">
                      Ayeduase Newsite
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden rounded-full border border-white/50 bg-white/95 px-3 py-2 text-[10px] font-bold text-[#5B514B] shadow-lg backdrop-blur-md sm:block">
                KNUST • Kumasi
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM LOCATION STRIP */}
        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#A1927D]/20 bg-[#A1927D]/20 sm:grid-cols-3">

          <div className="bg-white px-5 py-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A1927D]">
              Area
            </p>
            <p className="mt-1 text-xs font-extrabold text-[#2A2827]">
              Ayeduase Newsite
            </p>
          </div>

          <div className="bg-white px-5 py-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A1927D]">
              Landmark
            </p>
            <p className="mt-1 text-xs font-extrabold text-[#2A2827]">
              FNF Junction
            </p>
          </div>

          <div className="bg-white px-5 py-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A1927D]">
              City
            </p>
            <p className="mt-1 text-xs font-extrabold text-[#2A2827]">
              Kumasi, Ghana
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};