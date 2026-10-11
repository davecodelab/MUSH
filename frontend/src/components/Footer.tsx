'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import {
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  MessageCircle,
} from 'lucide-react';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const { setActiveView, config } = useHostel();

  const handleNav = (view: Parameters<typeof setActiveView>[0]) => {
    setActiveView(view);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const currentYear = new Date().getFullYear();

  const hostelLinks = [
    { label: 'Rooms & Availability', view: 'rooms' },
    { label: 'Floor Explorer', view: 'floor-explorer' },
    { label: 'Facilities', view: 'facilities' },
    { label: 'Gallery', view: 'gallery' },
  ] as const;

  const studentLinks = [
    { label: 'How Booking Works', view: 'how-it-works' },
    { label: 'Roommate Matching', view: 'roommates' },
    { label: 'Student Dashboard', view: 'dashboard' },
    { label: 'Location & Directions', view: 'location' },
  ] as const;

  return (
    <footer className="relative overflow-hidden bg-[#211F1D] text-[#F7F1E8]">
      {/* =========================================================BACKGROUND DETAILS========================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Large warm glow */}
        <div className="absolute -right-40 -top-40 h-105 w-105 rounded-full bg-[#FEFB58]/[0.035] blur-3xl" />

        <div className="absolute -left-40 bottom-20 h-90 w-90 rounded-full bg-[#8B756C]/6 blur-3xl" />

        {/* Editorial grid lines */}
        <div className="absolute inset-y-0 left-[8%] hidden w-px bg-white/[0.035] lg:block" />
        <div className="absolute inset-y-0 right-[8%] hidden w-px bg-white/[0.035] lg:block" />
      </div>

      

      {/* =========================================================
          MAIN FOOTER
      ========================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-12">
          {/* =====================================================
              BRAND COLUMN
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            {/* Logo / Brand */}
            <button
              onClick={() => handleNav('home')}
              className="group mb-6 flex items-center gap-3"
            >
          {/* Logo container */}
  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden">
    <Image
      src="/mushia_logo.png"
      alt="Mushia Hostel Logo"
      width={60}
      height={50}
      priority
      className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105" />
  </span>
  
              

              <span className="text-xl font-black tracking-[-0.03em] text-[#FAF6EF]">
                Mushia
                <span className="ml-1 font-medium text-[#A1927D]">
                  Hostel
                </span>
              </span>
            </button>

            <p className="max-w-sm text-sm leading-7 text-[#AFA39A]">
              Student accommodation designed around comfort, convenience,
              community, and the everyday rhythm of university life in Kumasi.
            </p>

            {/* Contact */}
            <div className="mt-8 space-y-4">
              <a
                href={`tel:${config?.phone || '+233249203029'}`}
                className="group flex items-start gap-3 text-sm text-[#C7BBB0] transition-colors duration-300 hover:text-[#FEFB58]"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#FEFB58]" />

                <span className="relative">
                  {config?.phone || '+233 24 920 3029'}

                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#FEFB58] transition-all duration-300 group-hover:w-full" />
                </span>
              </a>

              <a
                href={`mailto:${config?.email || 'info@mushiahostel.com'}`}
                className="group flex items-start gap-3 text-sm text-[#C7BBB0] transition-colors duration-300 hover:text-[#FEFB58]"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#FEFB58]" />

                <span className="relative break-all">
                  {config?.email || 'info@mushiahostel.com'}

                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#FEFB58] transition-all duration-300 group-hover:w-full" />
                </span>
              </a>

              <button
                onClick={() => handleNav('location')}
                className="group flex items-start gap-3 text-left text-sm text-[#C7BBB0] transition-colors duration-300 hover:text-[#FEFB58]"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FEFB58]" />

                <span className="relative">
                  {config?.address || 'FNF Junction, Ayeduase Newsite, Kumasi'}

                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#FEFB58] transition-all duration-300 group-hover:w-full" />
                </span>
              </button>
            </div>

            {/* Social */}
            <div className="mt-8 flex items-center gap-2">
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A1927D]/25 text-[#B9ADA2] transition-all duration-300 hover:border-[#FEFB58]/60 hover:bg-[#FEFB58] hover:text-[#211F1D]"
              >
                <Instagram className="h-4 w-4" />
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A1927D]/25 text-[#B9ADA2] transition-all duration-300 hover:border-[#FEFB58]/60 hover:bg-[#FEFB58] hover:text-[#211F1D]"
              >
                <Facebook className="h-4 w-4" />
              </motion.a>

              <motion.a
                href="https://wa.me/233249203029"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A1927D]/25 text-[#B9ADA2] transition-all duration-300 hover:border-[#FEFB58]/60 hover:bg-[#FEFB58] hover:text-[#211F1D]"
              >
                <MessageCircle className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* =====================================================
              LINK COLUMN
          ====================================================== */}

          <FooterLinkColumn
            title="Explore"
            links={hostelLinks}
            onNavigate={handleNav}
          />

          <FooterLinkColumn
            title="Student Life"
            links={studentLinks}
            onNavigate={handleNav}
          />
        </div>

        {/* =========================================================
            BOTTOM BAR
        ========================================================== */}

        <div className="mt-16 border-t border-[#A1927D]/15 pt-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-[#776D66]">
              © {currentYear} Mushia Hostel. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.14em] text-[#776D66]">
              <button
                onClick={() => handleNav('location')}
                className="transition-colors duration-300 hover:text-[#FEFB58]"
              >
                KNUST · Kumasi
              </button>

              <span className="hidden h-1 w-1 rounded-full bg-[#655C56] sm:block" />

              <span>Student Living</span>

              <span className="hidden h-1 w-1 rounded-full bg-[#655C56] sm:block" />

              <span>Ghana</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ===============================================================
   LINK COLUMN
================================================================ */

interface FooterLinkColumnProps {
  title: string;
  links: {
    label: string;
    view: string;
  }[] | readonly {
    label: string;
    view: string;
  }[];
  onNavigate: (view: string) => void;
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({
  title,
  links,
  onNavigate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8F8177]">
        {title}
      </h3>

      <div className="space-y-1">
        {links.map((link) => (
          <FooterNavButton
            key={link.label}
            label={link.label}
            onClick={() => onNavigate(link.view)}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* ===============================================================
   ANIMATED NAV BUTTON
================================================================ */

interface FooterNavButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

const FooterNavButton: React.FC<FooterNavButtonProps> = ({
  label,
  onClick,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className="group flex w-fit items-center gap-2 py-1.5 text-left text-sm text-[#AFA39A] transition-colors duration-300 hover:text-[#FEFB58]"
    >
      {icon && (
        <span className="text-[#FEFB58] transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}

      <span className="relative">
        {label}

        <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#FEFB58] transition-all duration-300 group-hover:w-full" />
      </span>

      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
    </button>
  );
};