'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What room types does Mushia Hostel offer?',
      a: 'Mushia Hostel offers 4-in-1, 3-in-1, 2-in-1, and executive 1-in-1 rooms across 6 residential floors with 103 rooms in total.',
    },
    {
      q: 'Do you have AC rooms?',
      a: 'Yes. Both refrigerated split-unit air-conditioned rooms and high-velocity ceiling fan rooms are available across all floors.',
    },
    {
      q: 'Can I choose my room and specific bed space?',
      a: 'Students can inspect all 103 rooms via our interactive Floor Explorer and select the exact bed space (Space 1, 2, 3, or 4) they prefer.',
    },
    {
      q: 'Can I choose my roommate?',
      a: 'After completing payment, students unlock the Roommate Matching system. You can browse confirmed students assigned to your room, check lifestyle compatibility, and connect mutually.',
    },
    {
      q: 'When is my booking confirmed?',
      a: 'Your booking is confirmed immediately upon successful Paystack payment verification, and your official accommodation receipt is instantly generated.',
    },
    {
      q: 'Can I book without paying?',
      a: 'When you select an available space, the system temporarily locks it for 10 minutes to allow you to complete payment. However, the space is not permanently secured until payment is completed.',
    },
    {
      q: 'Where is Mushia Hostel located?',
      a: 'Mushia Hostel is located at FNF Junction, Ayeduase Newsite, Kumasi, Ghana — just a 3-minute walk to the KNUST campus perimeter.',
    },
    {
      q: 'Does the hostel have a study room?',
      a: 'Yes. Mushia Hostel features a dedicated, quiet, air-conditioned 24-hour study hall equipped with high-speed internet and power backup.',
    },
    {
      q: 'Does the hostel have CCTV and physical security?',
      a: 'Yes. The hostel is equipped with 24/7 high-definition CCTV surveillance across all corridors and entrances, reinforced perimeter walls, and security guards.',
    },
    {
      q: 'Does the hostel have a TV room?',
      a: 'Yes, a shared student entertainment lounge with sectional seating and a satellite flat-screen TV is available on the ground floor.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#F4EFE7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-[#7D6E66] uppercase mb-2 block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2A2827] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-[#5B514B]">
            Everything you need to know about rooms, payment, facilities, and roommate matching.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#A1927D]/40 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F4EFE7]/40 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-[#2A2827]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#7D6E66] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#2A2827]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5B514B] leading-relaxed border-t border-zinc-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
