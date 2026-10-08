'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { Floor, Room } from '../types';
import { 
  Building, 
  Users, 
  Wind, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Wrench, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

export const FloorExplorer: React.FC = () => {
  const { rooms, openRoomDetails, startBookingFlow } = useHostel();

  const floors: { name: Floor; label: string; prefix: string; count: number }[] = [
    { name: 'Ground', label: 'Ground Floor', prefix: 'G', count: 20 },
    { name: '1st', label: '1st Floor', prefix: '1', count: 20 },
    { name: '2nd', label: '2nd Floor', prefix: '2', count: 20 },
    { name: '3rd', label: '3rd Floor', prefix: '3', count: 20 },
    { name: '4th', label: '4th Floor', prefix: '4', count: 20 },
    { name: '5th', label: '5th Floor', prefix: '5', count: 20 },
  ];

  const [activeFloor, setActiveFloor] = useState<Floor>('3rd');
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);

  // Filter rooms for active floor
  const floorRooms = rooms.filter((r) => r.floor === activeFloor);

  // Floor stats
  const totalFloorSpaces = floorRooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedFloorSpaces = floorRooms.reduce(
    (acc, r) => acc + r.spaces.filter((s) => s.status === 'paid').length, 
    0
  );
  const availableFloorSpaces = totalFloorSpaces - occupiedFloorSpaces;

  const getStatusBadge = (room: Room) => {
    if (room.status === 'maintenance') {
      return {
        label: 'Maintenance',
        color: 'bg-zinc-200 text-zinc-700 border-zinc-300',
        dot: 'bg-zinc-500',
      };
    }
    const availableSpaces = room.spaces.filter((s) => s.status === 'available').length;
    if (availableSpaces === 0) {
      return {
        label: 'Fully Booked',
        color: 'bg-rose-50 text-rose-800 border-rose-200',
        dot: 'bg-rose-500',
      };
    }
    if (availableSpaces < room.capacity) {
      return {
        label: `${availableSpaces} Space Left`,
        color: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    }
    return {
      label: 'Available',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
    };
  };

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.025,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
  };

  return (
    <section id="floor-explorer" className="py-20 bg-[#2A2827] text-[#F4EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#A1927D] uppercase mb-2 block">
              Architectural Room Navigator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4EFE7] tracking-tight">
              Interactive Floor Explorer
            </h2>
            <p className="mt-2 text-sm text-[#A5ABAA] max-w-xl">
              Inspect all 20 rooms per floor across Mushia Hostel. Click any room to review individual space occupancies, student profiles, and secure your bed.
            </p>
          </div>

          {/* Floor Summary Stats */}
          <div className="mt-4 md:mt-0 flex items-center gap-6 bg-[#5B514B]/40 border border-[#7D6E66]/50 rounded-xl px-5 py-3 text-xs shadow-md">
            <div>
              <span className="text-[#A5ABAA] block">Rooms on {activeFloor}</span>
              <span className="text-base font-bold text-[#F4EFE7] tabular-nums">20 Rooms</span>
            </div>
            <div className="w-px h-8 bg-[#7D6E66]/60"></div>
            <div>
              <span className="text-[#A5ABAA] block">Spaces Available</span>
              <span className="text-base font-bold text-[#FEFB58] tabular-nums">{availableFloorSpaces} of {totalFloorSpaces}</span>
            </div>
          </div>
        </div>

        {/* Floor Level Selector Tabs with active layout pill */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {floors.map((fl) => {
            const isSelected = activeFloor === fl.name;
            return (
              <motion.button
                key={fl.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveFloor(fl.name);
                  setHoveredRoom(null);
                }}
                className={`relative px-5 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#FEFB58] text-[#2A2827] border-[#FEFB58] shadow-lg'
                    : 'bg-[#5B514B]/50 hover:bg-[#5B514B] text-[#F4EFE7] border-[#7D6E66]/40'
                }`}
              >
                <Building className="w-4 h-4 shrink-0" />
                <span>{fl.label}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-[#2A2827]/20 text-[#2A2827]' : 'bg-[#2A2827]/60 text-[#A5ABAA]'}`}>
                  20 rms
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Floor Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#A5ABAA] mb-6 p-3 bg-[#5B514B]/30 rounded-lg border border-[#7D6E66]/30">
          <span className="font-semibold text-[#F4EFE7]">Status Key:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Limited Spaces
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Fully Booked
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-500"></span> Maintenance
          </span>
        </div>

        {/* 20 Rooms Blueprint Grid with animated stagger */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFloor}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5 sm:gap-4 mb-8"
          >
            {floorRooms.map((room) => {
              const status = getStatusBadge(room);
              const isClickable = room.status !== 'maintenance';

              return (
                <motion.div
                  key={room.id}
                  variants={cardVariants}
                  whileHover={isClickable ? { scale: 1.03, y: -3 } : undefined}
                  whileTap={isClickable ? { scale: 0.98 } : undefined}
                  onClick={() => isClickable && openRoomDetails(room)}
                  onMouseEnter={() => setHoveredRoom(room)}
                  className={`relative rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                    room.status === 'maintenance'
                      ? 'bg-[#5B514B]/20 border-zinc-700/50 opacity-60 cursor-not-allowed'
                      : 'bg-[#5B514B]/60 hover:bg-[#5B514B] border-[#7D6E66]/60 hover:border-[#FEFB58] hover:shadow-2xl'
                  }`}
                >
                  {/* Room Number & AC Tag */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-lg font-black tracking-tight text-white block">
                        Room {room.roomNumber}
                      </span>
                      <span className="text-[11px] text-[#A1927D] font-medium">
                        {room.roomType} · {room.size}
                      </span>
                    </div>

                    {room.airConditioned && (
                      <span className="p-1 rounded bg-[#2A2827] text-[#FEFB58] text-[10px]" title="Air Conditioned">
                        <Wind className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Spaces Dot Indicator */}
                  <div className="my-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {room.spaces.map((s) => (
                        <span
                          key={s.id}
                          title={`Space ${s.spaceNumber}: ${s.status === 'paid' ? 'Occupied (' + (s.studentName || 'Student') + ')' : s.status}`}
                          className={`h-2 flex-1 rounded-sm transition-colors duration-300 ${
                            s.status === 'paid'
                              ? 'bg-[#A5ABAA]/40'
                              : s.status === 'reserved'
                              ? 'bg-amber-400'
                              : 'bg-[#FEFB58]'
                          }`}
                        ></span>
                      ))}
                    </div>
                    <span className="text-[10px] text-[#A5ABAA] block">
                      {room.spaces.filter((s) => s.status === 'paid').length} of {room.capacity} occupied
                    </span>
                  </div>

                  {/* Footer price & status */}
                  <div className="pt-2 border-t border-[#7D6E66]/40 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#FEFB58] tabular-nums">
                      GHS {(room.price).toLocaleString()}
                    </span>
                    
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Selected Room Quick Preview Banner with entrance animation */}
        <AnimatePresence>
          {hoveredRoom && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="bg-[#5B514B] border border-[#7D6E66] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#2A2827] flex items-center justify-center text-[#FEFB58] font-bold text-xl border border-[#7D6E66]">
                  {hoveredRoom.roomNumber}
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">
                    Room {hoveredRoom.roomNumber} — {hoveredRoom.roomType} ({hoveredRoom.size} Room)
                  </h4>
                  <p className="text-xs text-[#A5ABAA] mt-0.5">
                    {hoveredRoom.airConditioned ? 'Refrigerated Split Air Conditioning' : 'Ceiling Fan'} · {hoveredRoom.floor} Floor · 
                    En-suite Washroom · {hoveredRoom.spaces.filter((s) => s.status === 'available').length} Available Space(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right pr-4 border-r border-[#7D6E66]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A1927D] block">Per Student</span>
                  <span className="text-lg font-black text-[#FEFB58] tabular-nums">
                    GHS {hoveredRoom.price.toLocaleString()}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openRoomDetails(hoveredRoom)}
                  className="px-4 py-2.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>View Room & Occupants</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
