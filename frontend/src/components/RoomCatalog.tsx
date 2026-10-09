'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { Room, RoomType, Floor } from '../types';
import { 
  Search, 
  Filter, 
  Wind, 
  Users, 
  SlidersHorizontal, 
  CheckCircle2, 
  ArrowUpDown,
  Building2,
  Sparkles
} from 'lucide-react';

interface RoomCatalogProps {
  initialTypeFilter?: string;
}

export const RoomCatalog: React.FC<RoomCatalogProps> = ({ initialTypeFilter }) => {
  const { rooms, openRoomDetails, startBookingFlow } = useHostel();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(initialTypeFilter || 'all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [acFilter, setAcFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'availability'>('recommended');

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Search by room number (e.g. "305", "G12")
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchNumber = room.roomNumber.toLowerCase().includes(query);
        const matchFloor = room.floor.toLowerCase().includes(query);
        const matchType = room.roomType.toLowerCase().includes(query);
        if (!matchNumber && !matchFloor && !matchType) return false;
      }

      if (typeFilter !== 'all' && room.roomType !== typeFilter) return false;
      if (floorFilter !== 'all' && room.floor !== floorFilter) return false;
      if (acFilter === 'ac' && !room.airConditioned) return false;
      if (acFilter === 'non_ac' && room.airConditioned) return false;
      if (sizeFilter !== 'all' && room.size !== sizeFilter) return false;

      const freeSpaces = room.spaces.filter((s) => s.status === 'available').length;
      if (availableOnly && freeSpaces === 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'availability') {
        const freeA = a.spaces.filter((s) => s.status === 'available').length;
        const freeB = b.spaces.filter((s) => s.status === 'available').length;
        return freeB - freeA;
      }
      return 0; // recommended order (by room number)
    });
  }, [rooms, searchQuery, typeFilter, floorFilter, acFilter, sizeFilter, availableOnly, sortBy]);

  const getAvailabilityStatus = (room: Room) => {
    if (room.status === 'maintenance') {
      return {
        label: 'Maintenance',
        color: 'text-zinc-600 bg-zinc-100 border-zinc-200',
        dot: 'bg-zinc-400',
      };
    }
    const availableSpaces = room.spaces.filter((s) => s.status === 'available').length;
    if (availableSpaces === 0) {
      return {
        label: 'Fully Booked',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        dot: 'bg-rose-500',
      };
    }
    if (availableSpaces <= 1) {
      return {
        label: 'Limited Availability (1 Left)',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        dot: 'bg-amber-500',
      };
    }
    return {
      label: `${availableSpaces} Spaces Available`,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dot: 'bg-emerald-500',
    };
  };

  return (
    <section id="rooms-catalog" className="py-16 bg-[#F4EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#A1927D]/40">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#7D6E66] uppercase mb-1 block">
              Direct Space Reservation
            </span>
            <h2 className="text-3xl font-extrabold text-[#2A2827] tracking-tight">
              Mushia Hostel Room Inventory
            </h2>
            <p className="text-xs sm:text-sm text-[#5B514B] mt-1">
              Select any specific room to view bed layouts, existing KNUST roommates, and lock your space.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs text-[#7D6E66] font-medium">
            Showing <strong className="text-[#2A2827] font-bold tabular-nums">{filteredRooms.length}</strong> of {rooms.length} rooms
          </div>
        </div>

        {/* Filter Toolbar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 border border-[#A1927D]/50 rounded-xl p-4 sm:p-5 mb-8 shadow-sm backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                Search Room
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#A1927D] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. 305, G12, 101, 4-in-1..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F4EFE7]/50 border border-[#A1927D]/60 rounded-lg text-xs sm:text-sm text-[#2A2827] placeholder-[#A1927D] focus:outline-none focus:border-[#5B514B] transition-colors"
                />
              </div>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                Room Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full py-2 px-2.5 bg-[#F4EFE7]/50 border border-[#A1927D]/60 rounded-lg text-xs text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
              >
                <option value="all">All Types</option>
                <option value="4-in-1">4-in-1</option>
                <option value="3-in-1">3-in-1</option>
                <option value="2-in-1">2-in-1</option>
                <option value="1-in-1">1-in-1</option>
              </select>
            </div>

            {/* Floor */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                Floor Level
              </label>
              <select
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="w-full py-2 px-2.5 bg-[#F4EFE7]/50 border border-[#A1927D]/60 rounded-lg text-xs text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
              >
                <option value="all">All Floors</option>
                <option value="Ground">Ground Floor</option>
                <option value="1st">1st Floor</option>
                <option value="2nd">2nd Floor</option>
                <option value="3rd">3rd Floor</option>
                <option value="4th">4th Floor</option>
                <option value="5th">5th Floor</option>
              </select>
            </div>

            {/* AC */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                Climate
              </label>
              <select
                value={acFilter}
                onChange={(e) => setAcFilter(e.target.value)}
                className="w-full py-2 px-2.5 bg-[#F4EFE7]/50 border border-[#A1927D]/60 rounded-lg text-xs text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
              >
                <option value="all">Any Climate</option>
                <option value="ac">Air Conditioned</option>
                <option value="non_ac">Ceiling Fan</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2 px-2.5 bg-[#F4EFE7]/50 border border-[#A1927D]/60 rounded-lg text-xs text-[#2A2827] focus:outline-none focus:border-[#5B514B]"
              >
                <option value="recommended">Room Number</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="availability">Most Available Spaces</option>
              </select>
            </div>

          </div>

          {/* Quick toggle check: available only */}
          <div className="mt-3 pt-3 border-t border-[#A1927D]/30 flex items-center justify-between">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#5B514B]">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded border-[#A1927D] text-[#5B514B] focus:ring-[#FEFB58]"
              />
              <span>Show Available Rooms Only</span>
            </label>

            {(searchQuery || typeFilter !== 'all' || floorFilter !== 'all' || acFilter !== 'all' || availableOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setFloorFilter('all');
                  setAcFilter('all');
                  setAvailableOnly(false);
                }}
                className="text-xs text-[#8B756C] hover:text-[#2A2827] underline cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredRooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-[#A1927D]/40 p-12 text-center max-w-md mx-auto"
          >
            <div className="w-12 h-12 rounded-full bg-[#EAE3D9] text-[#7D6E66] flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#2A2827] mb-2">No Matching Rooms Found</h3>
            <p className="text-xs text-[#5B514B] mb-6">
              We couldn't find a room matching your exact criteria. Try resetting your filters to explore available spaces on other floors.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setFloorFilter('all');
                setAcFilter('all');
                setAvailableOnly(false);
              }}
              className="px-4 py-2 bg-[#5B514B] text-white text-xs font-bold rounded-lg hover:bg-[#2A2827] transition-colors"
            >
              View All {rooms.length} Rooms
            </button>
          </motion.div>
        ) : (
          /* Room Cards Grid with layout animation */
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredRooms.map((room) => {
                const status = getAvailabilityStatus(room);
                const occupiedSpaces = room.spaces.filter((s) => s.status === 'paid').length;
                const freeSpaces = room.spaces.filter((s) => s.status === 'available').length;
                const hasFreeSpace = freeSpaces > 0;
                const firstAvailableSpace = room.spaces.find((s) => s.status === 'available');

                return (
                  <motion.div
                    layout
                    key={room.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl border border-[#A1927D]/40 overflow-hidden flex flex-col justify-between hover:border-[#5B514B] hover:shadow-xl transition-shadow group"
                  >
                    {/* Card Header & Photo */}
                    <div>
                      <div className="relative h-44 overflow-hidden bg-[#2A2827]">
                        <img
                          src={room.images[0]}
                          alt={`Mushia Room ${room.roomNumber}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#2A2827]/80 via-transparent to-transparent"></div>
                        
                        {/* Room Badge */}
                        <div className="absolute top-3 left-3 bg-[#2A2827]/90 backdrop-blur-sm px-2.5 py-1 rounded text-white text-xs font-bold flex items-center gap-1.5 border border-white/10">
                          <span>Room {room.roomNumber}</span>
                          <span className="text-[#A1927D]">·</span>
                          <span className="text-[#FEFB58]">{room.floor} Floor</span>
                        </div>

                        {/* AC & Size Icons */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {room.airConditioned && (
                            <span className="bg-[#2A2827]/90 text-[#FEFB58] p-1.5 rounded text-xs shadow-sm" title="Air Conditioned">
                              <Wind className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <span className="bg-[#2A2827]/90 text-white px-2 py-1 rounded text-[10px] font-semibold">
                            {room.size}
                          </span>
                        </div>

                        {/* Capacity Label */}
                        <div className="absolute bottom-3 left-3 text-white">
                          <span className="text-sm font-extrabold text-[#FEFB58] block">{room.roomType}</span>
                          <span className="text-[11px] text-[#A5ABAA]">{room.capacity} students capacity</span>
                        </div>
                      </div>

                      {/* Room Metadata & Space Bar */}
                      <div className="p-5 pb-3">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded border ${status.color}`}>
                            <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                            <span>{status.label}</span>
                          </span>
                          
                          <span className="text-xs font-bold text-[#5B514B]">
                            {occupiedSpaces} / {room.capacity} Occupied
                          </span>
                        </div>

                        {/* Space Visualizer */}
                        <div className="grid grid-cols-4 gap-1.5 mb-4">
                          {room.spaces.map((s) => (
                            <div
                              key={s.id}
                              className={`p-1.5 rounded text-center text-[10px] font-bold border transition-colors ${
                                s.status === 'paid'
                                  ? 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                  : s.status === 'reserved'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-[#FEFB58]/30 text-[#2A2827] border-[#FEFB58]'
                              }`}
                            >
                              Space {s.spaceNumber}
                              <span className="block text-[8px] font-normal uppercase">
                                {s.status === 'paid' ? 'Paid' : s.status === 'reserved' ? 'Hold' : 'Open'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer with Price and CTAs */}
                    <div className="p-5 pt-3 border-t border-[#EAE3D9] bg-[#F4EFE7]/40">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-[11px] uppercase tracking-wider text-[#7D6E66]">Fee per Student</span>
                        <div className="text-right">
                          <span className="text-lg font-black text-[#2A2827] tabular-nums">
                            GHS {room.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#7D6E66] block">/ Academic Year</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openRoomDetails(room)}
                          className="py-2.5 px-3 bg-white hover:bg-[#EAE3D9] text-[#2A2827] border border-[#A1927D]/60 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center shadow-xs"
                        >
                          View Room
                        </motion.button>

                        <motion.button
                          whileHover={hasFreeSpace && room.status !== 'maintenance' ? { scale: 1.02 } : undefined}
                          whileTap={hasFreeSpace && room.status !== 'maintenance' ? { scale: 0.98 } : undefined}
                          disabled={!hasFreeSpace || room.status === 'maintenance'}
                          onClick={() => {
                            if (firstAvailableSpace) {
                              startBookingFlow(room, firstAvailableSpace.spaceNumber);
                            } else {
                              openRoomDetails(room);
                            }
                          }}
                          className={`py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                            hasFreeSpace && room.status !== 'maintenance'
                              ? 'bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] shadow-sm'
                              : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          {hasFreeSpace ? 'Book Space' : 'Fully Booked'}
                        </motion.button>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
};
