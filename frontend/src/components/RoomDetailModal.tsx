'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { RoomSpace } from '../types';
import { 
  X, 
  Wind, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ArrowRight,
  Maximize2,
  Building,
  UserCheck
} from 'lucide-react';

export const RoomDetailModal: React.FC = () => {
  const { 
    selectedRoom, 
    selectedSpaceNumber, 
    closeRoomDetails, 
    startBookingFlow,
    activeBookingHold 
  } = useHostel();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [localSelectedSpace, setLocalSelectedSpace] = useState<number>(
    selectedSpaceNumber || 1
  );

  if (!selectedRoom) return null;

  const freeSpaces = selectedRoom.spaces.filter((s) => s.status === 'available');
  const hasFreeSpaces = freeSpaces.length > 0;
  const occupiedSpaces = selectedRoom.spaces.filter((s) => s.status === 'paid');

  const currentSpace = selectedRoom.spaces.find((s) => s.spaceNumber === localSelectedSpace);

  const handleBookSelectedSpace = () => {
    if (!currentSpace || currentSpace.status === 'paid') return;
    startBookingFlow(selectedRoom, localSelectedSpace);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-[#F4EFE7] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#A1927D] my-8 relative flex flex-col max-h-[90vh]"
        >
          
          {/* Header Bar */}
          <div className="px-6 py-4 bg-[#2A2827] text-white flex items-center justify-between border-b border-[#5B514B]">
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-black text-[#FEFB58]">
                Room {selectedRoom.roomNumber}
              </span>
              <span className="text-xs text-[#A5ABAA] hidden sm:inline">·</span>
              <span className="text-xs text-[#F4EFE7] hidden sm:inline">
                {selectedRoom.floor} Floor · {selectedRoom.roomType}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeRoomDetails}
              className="p-1.5 rounded-lg bg-[#5B514B]/60 hover:bg-[#5B514B] text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Main Gallery Area */}
            <div className="space-y-3">
              <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-[#2A2827]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    src={selectedRoom.images[activeImageIdx] || selectedRoom.images[0]}
                    alt={`Room ${selectedRoom.roomNumber} photograph`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                <div className="absolute top-3 left-3 bg-[#2A2827]/85 backdrop-blur-sm text-xs text-white px-3 py-1 rounded-md font-semibold border border-white/10">
                  Photo {activeImageIdx + 1} of {selectedRoom.images.length}
                </div>
              </div>

              {/* Thumbnail selector */}
              <div className="grid grid-cols-4 gap-2">
                {selectedRoom.images.map((img, idx) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx ? 'border-[#FEFB58] shadow-md scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-xl border border-[#A1927D]/40 text-xs shadow-xs">
              <div>
                <span className="text-[#7D6E66] block text-[11px] uppercase tracking-wider font-semibold">Room Type</span>
                <span className="font-bold text-[#2A2827] text-sm">{selectedRoom.roomType}</span>
              </div>
              <div>
                <span className="text-[#7D6E66] block text-[11px] uppercase tracking-wider font-semibold">Climate</span>
                <span className="font-bold text-[#2A2827] text-sm">
                  {selectedRoom.airConditioned ? 'Refrigerated Split AC' : 'Ceiling Fan'}
                </span>
              </div>
              <div>
                <span className="text-[#7D6E66] block text-[11px] uppercase tracking-wider font-semibold">Dimensions</span>
                <span className="font-bold text-[#2A2827] text-sm">{selectedRoom.size} Room</span>
              </div>
              <div>
                <span className="text-[#7D6E66] block text-[11px] uppercase tracking-wider font-semibold">Occupancy</span>
                <span className="font-bold text-[#2A2827] text-sm tabular-nums">
                  {occupiedSpaces.length} / {selectedRoom.capacity} Spaces Occupied
                </span>
              </div>
            </div>

            {/* Space-by-Space Selection Architecture */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-base text-[#2A2827]">
                    Individual Room Spaces ({selectedRoom.capacity} Beds)
                  </h4>
                  <p className="text-xs text-[#5B514B]">
                    Select the specific space you want to reserve. Occupied spaces display confirmed roommates.
                  </p>
                </div>

                {activeBookingHold && activeBookingHold.roomId === selectedRoom.id && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-semibold animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Temporary Lock Active</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedRoom.spaces.map((space) => {
                  const isSelected = localSelectedSpace === space.spaceNumber;
                  const isPaid = space.status === 'paid';
                  const isReserved = space.status === 'reserved';

                  return (
                    <motion.div
                      whileHover={!isPaid ? { scale: 1.01 } : undefined}
                      key={space.id}
                      onClick={() => !isPaid && setLocalSelectedSpace(space.spaceNumber)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isPaid
                          ? 'bg-zinc-100/90 border-zinc-200 cursor-not-allowed opacity-90'
                          : isSelected
                          ? 'bg-[#FEFB58]/20 border-[#2A2827] ring-2 ring-[#2A2827]/10 shadow-sm'
                          : 'bg-white border-[#A1927D]/40 hover:border-[#5B514B]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isPaid ? 'bg-zinc-300 text-zinc-700' : isSelected ? 'bg-[#2A2827] text-[#FEFB58]' : 'bg-[#EAE3D9] text-[#2A2827]'
                          }`}>
                            #{space.spaceNumber}
                          </div>
                          <span className="font-bold text-sm text-[#2A2827]">
                            Space {space.spaceNumber}
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isPaid
                            ? 'bg-zinc-200 text-zinc-700'
                            : isReserved
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isPaid ? 'Occupied' : isReserved ? 'On Hold' : 'Available'}
                        </span>
                      </div>

                      {isPaid ? (
                        <div className="text-xs text-[#5B514B] bg-white/70 p-2.5 rounded-lg border border-zinc-200 mt-2">
                          <div className="flex items-center gap-1.5 font-semibold text-[#2A2827]">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{space.studentName || 'KNUST Student'}</span>
                          </div>
                          <p className="text-[11px] text-[#7D6E66] mt-0.5">
                            {space.studentProgram || 'BSc Student'} · {space.studentLevel || 'Undergraduate'}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-[#5B514B]">
                            {isSelected ? 'Selected for reservation' : 'Click to select space'}
                          </span>
                          <span className="font-extrabold text-[#2A2827] tabular-nums">
                            GHS {selectedRoom.price.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Room Features */}
            <div className="bg-white p-4 rounded-xl border border-[#A1927D]/40">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#7D6E66] mb-3">
                Included In This Room
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2A2827]">
                {selectedRoom.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5B514B] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Modal Sticky Footer CTA */}
          <div className="p-4 sm:p-5 bg-white border-t border-[#A1927D]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#7D6E66] block">Total Academic Fee</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#2A2827] tabular-nums">
                  GHS {selectedRoom.price.toLocaleString()}
                </span>
                <span className="text-xs text-[#7D6E66]">/ student (2 Semesters)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={closeRoomDetails}
                className="py-2.5 px-4 bg-white border border-[#A1927D] text-[#2A2827] font-semibold text-xs rounded-lg hover:bg-[#F4EFE7] transition-colors cursor-pointer w-full sm:w-auto text-center"
              >
                Close
              </button>

              {hasFreeSpaces ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={currentSpace?.status === 'paid'}
                  onClick={handleBookSelectedSpace}
                  className="py-3 px-6 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                >
                  <span>Book Space #{localSelectedSpace}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <button
                  disabled
                  className="py-3 px-6 bg-zinc-200 text-zinc-400 font-bold text-xs rounded-lg cursor-not-allowed w-full sm:w-auto"
                >
                  Fully Booked
                </button>
              )}
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
