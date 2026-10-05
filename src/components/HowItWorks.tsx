import React from 'react';
import { motion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { Search, Bed, CreditCard, HeartHandshake, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setActiveView } = useHostel();

  const steps = [
    {
      num: '01',
      title: 'Explore',
      subtitle: 'Browse 120 rooms & facilities',
      description: 'Filter by floor level, AC status, room size, or student capacity across our interactive 6-floor layout.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Choose',
      subtitle: 'Select your preferred space',
      description: 'Review individual bed spaces and confirmed student occupants. Your selected space is locked for 10 minutes.',
      icon: Bed,
    },
    {
      num: '03',
      title: 'Pay',
      subtitle: 'Secure via Paystack',
      description: 'Pay instantly with MTN Mobile Money, Telecel Cash, or Cards. Instant automated webhook verification.',
      icon: CreditCard,
    },
    {
      num: '04',
      title: 'Connect',
      subtitle: 'Find your confirmed roommate',
      description: 'Access the verified roommate discovery engine, match lifestyle preferences, and exchange WhatsApp contacts.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F4EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#7D6E66] uppercase mb-2 block">
            Booking & Move-in Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2A2827] tracking-tight">
            How Mushia Hostel Booking Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#5B514B]">
            From room discovery to verified roommate connection in four seamless steps.
          </p>
        </div>

        {/* 4 Editorial Steps with stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative mb-12">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={st.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl border border-[#A1927D]/40 p-6 flex flex-col justify-between hover:border-[#5B514B] transition-shadow hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-[#5B514B]/20 font-mono group-hover:text-[#FEFB58] transition-colors">
                      {st.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-[#5B514B]/10 text-[#2A2827] flex items-center justify-center group-hover:bg-[#FEFB58]/30 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#2A2827] mb-1">
                    {st.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#8B756C] block mb-3">
                    {st.subtitle}
                  </span>
                  <p className="text-xs text-[#5B514B] leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#EAE3D9] text-[11px] font-bold text-[#7D6E66] flex items-center justify-between">
                  <span>Step {idx + 1} of 4</span>
                  <span className="text-[#2A2827]">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Move-in Final Callout */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#2A2827] rounded-2xl p-6 sm:p-8 text-center text-white max-w-3xl mx-auto border border-[#5B514B] shadow-2xl"
        >
          <h3 className="text-xl sm:text-2xl font-black text-[#FEFB58] mb-2">
            Then Get Ready to Move In!
          </h3>
          <p className="text-xs sm:text-sm text-[#A5ABAA] max-w-xl mx-auto mb-6">
            Pack your bags, present your official digital receipt at the Mushia reception desk at FNF Junction, and receive your room keys smoothly.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('rooms')}
            className="px-6 py-3 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Your Reservation</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};
