import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { RoomType, RoomSize, Floor } from '../types';
import { Search, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

interface QuickSearchProps {
  onSearchApply?: (filters: {
    roomType: string;
    ac: string;
    size: string;
    floor: string;
  }) => void;
}

export const QuickSearchWidget: React.FC<QuickSearchProps> = ({ onSearchApply }) => {
  const { rooms, setActiveView, config } = useHostel();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedAc, setSelectedAc] = useState<string>('either');
  const [selectedSize, setSelectedSize] = useState<string>('either');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');

  // Compute live available matching spaces
  const matchingStats = useMemo(() => {
    let availableSpacesCount = 0;
    let matchingRoomsCount = 0;

    rooms.forEach((r) => {
      if (r.status === 'maintenance') return;
      if (selectedType !== 'all' && r.roomType !== selectedType) return;
      if (selectedAc === 'ac' && !r.airConditioned) return;
      if (selectedAc === 'non_ac' && r.airConditioned) return;
      if (selectedSize !== 'either' && r.size !== selectedSize) return;
      if (selectedFloor !== 'all' && r.floor !== selectedFloor) return;

      const freeSpaces = r.spaces.filter((s) => s.status === 'available').length;
      if (freeSpaces > 0) {
        matchingRoomsCount++;
        availableSpacesCount += freeSpaces;
      }
    });

    return { availableSpacesCount, matchingRoomsCount };
  }, [rooms, selectedType, selectedAc, selectedSize, selectedFloor]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchApply) {
      onSearchApply({
        roomType: selectedType,
        ac: selectedAc,
        size: selectedSize,
        floor: selectedFloor,
      });
    }
    setActiveView('rooms');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="relative -mt-10 sm:-mt-12 z-20 max-w-6xl mx-auto px-4 sm:px-6"
    >
      <div className="bg-[#5B514B] border border-[#7D6E66] rounded-2xl shadow-2xl p-5 sm:p-6 text-[#F4EFE7]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#7D6E66]/60">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#F4EFE7]">
              Check Room Availability & Spaces
            </h2>
            <p className="text-xs text-[#A5ABAA]">
              Academic Session: {config.academicYear} · 120 Total Room Inventory
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-medium text-[#FEFB58]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#FEFB58]" />
            <span>
              <strong className="font-bold tabular-nums text-white">{matchingStats.availableSpacesCount}</strong> spaces available in <strong className="font-bold tabular-nums text-white">{matchingStats.matchingRoomsCount}</strong> matching rooms
            </span>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          
          {/* Room Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1927D] mb-1.5">
              Room Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#2A2827] border border-[#7D6E66] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-[#F4EFE7] focus:outline-none focus:border-[#FEFB58] transition-colors"
            >
              <option value="all">All Room Types</option>
              <option value="4-in-1">4-in-1 (Four per room)</option>
              <option value="3-in-1">3-in-1 (Three per room)</option>
              <option value="2-in-1">2-in-1 (Two per room)</option>
              <option value="1-in-1">1-in-1 (Single occupancy)</option>
            </select>
          </div>

          {/* AC Option */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1927D] mb-1.5">
              Climate Control
            </label>
            <select
              value={selectedAc}
              onChange={(e) => setSelectedAc(e.target.value)}
              className="w-full bg-[#2A2827] border border-[#7D6E66] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-[#F4EFE7] focus:outline-none focus:border-[#FEFB58] transition-colors"
            >
              <option value="either">AC or Non-AC</option>
              <option value="ac">Air Conditioned Only</option>
              <option value="non_ac">Non-AC (Ceiling Fan)</option>
            </select>
          </div>

          {/* Room Size */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1927D] mb-1.5">
              Room Dimension
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-[#2A2827] border border-[#7D6E66] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-[#F4EFE7] focus:outline-none focus:border-[#FEFB58] transition-colors"
            >
              <option value="either">Any Size</option>
              <option value="Big">Big Room (Balcony / Extra Area)</option>
              <option value="Small">Small Room (Compact Standard)</option>
            </select>
          </div>

          {/* Floor Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1927D] mb-1.5">
              Floor Level
            </label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full bg-[#2A2827] border border-[#7D6E66] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-[#F4EFE7] focus:outline-none focus:border-[#FEFB58] transition-colors"
            >
              <option value="all">Any Floor (Ground - 5th)</option>
              <option value="Ground">Ground Floor (G01 - G20)</option>
              <option value="1st">1st Floor (101 - 120)</option>
              <option value="2nd">2nd Floor (201 - 220)</option>
              <option value="3rd">3rd Floor (301 - 320)</option>
              <option value="4th">4th Floor (401 - 420)</option>
              <option value="5th">5th Floor (501 - 520)</option>
            </select>
          </div>

          {/* Submit CTA in Solar Yellow */}
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs sm:text-sm py-2.5 px-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer h-[42px]"
            >
              <Search className="w-4 h-4 text-[#2A2827]" />
              <span>Check Availability</span>
            </motion.button>
          </div>

        </form>
      </div>
    </motion.div>
  );
};
