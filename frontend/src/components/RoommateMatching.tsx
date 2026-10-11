'use client';

import React, { useState, useEffect } from 'react';
import { useHostel } from '../context/HostelContext';
import { getRoommates } from '../services/api';
import {
  Lock,
  Users,
  CheckCircle2,
  Mail,
  Phone,
  ArrowRight,
  MessageCircle,
  Building2,
} from 'lucide-react';

interface LiveRoommate {
  space_identifier: string;
  name: string;
  phone_number: string;
  email: string;
  gender: string;
  is_you: boolean;
}

export const RoommateMatching: React.FC = () => {
  const { currentStudent, rooms, setActiveView } = useHostel();
  const [liveRoommates, setLiveRoommates] = useState<LiveRoommate[]>([]);
  const [loading, setLoading] = useState(false);

  const assignedRoom = rooms.find(
    (r) => r.id === currentStudent.roomId || r.roomNumber === currentStudent.roomNumber
  );

  useEffect(() => {
    if (!currentStudent.hasPaid || !currentStudent.roomNumber) return;
    setLoading(true);
    getRoommates(currentStudent.roomNumber)
      .then((data) => {
        if (data && Array.isArray(data.roommates)) {
          setLiveRoommates(data.roommates);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentStudent.hasPaid, currentStudent.roomNumber]);

  // GATEKEEPER CHECK: Locked if student has not paid
  if (!currentStudent.hasPaid) {
    return (
      <section className="py-20 bg-[#F4EFE7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-2xl border border-[#A1927D]/50 p-8 sm:p-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#5B514B]/10 text-[#5B514B] flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#2A2827]" />
            </div>

            <span className="text-xs font-bold tracking-widest text-[#7D6E66] uppercase mb-2 block">
              Verified Resident Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2827] tracking-tight mb-3">
              Roommate Directory is Reserved for Confirmed Residents
            </h2>
            <p className="text-sm text-[#5B514B] leading-relaxed max-w-lg mx-auto mb-8">
              To protect student privacy and security, roommate contact details unlock exclusively after your Mushia
              Hostel room payment has been verified via Paystack.
            </p>

            <div className="p-4 bg-[#F4EFE7]/80 rounded-xl border border-[#A1927D]/40 text-xs text-[#5B514B] max-w-md mx-auto mb-8 text-left space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#2A2827]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>View verified co-residents assigned to your exact room</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-[#2A2827]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Direct phone, WhatsApp & email contact for move-in coordination</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-[#2A2827]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Live bed space occupancy synced directly with hostel registry</span>
              </div>
            </div>

            <button
              onClick={() => setActiveView('rooms')}
              className="px-8 py-3.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Available Rooms & Book</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  const capacity = assignedRoom?.capacity || liveRoommates.length || 2;
  const spaceLetters = ['A', 'B', 'C', 'D'].slice(0, capacity);

  return (
    <section className="py-16 bg-[#F4EFE7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#A1927D]/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Room {currentStudent.roomNumber} Directory</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#2A2827] tracking-tight">
              Your Room {currentStudent.roomNumber} Co-Residents
            </h2>
            <p className="text-xs sm:text-sm text-[#5B514B] mt-1">
              You are permanently assigned to{' '}
              <strong>
                Room {currentStudent.roomNumber} (Space #{currentStudent.spaceNumber})
              </strong>
              . Coordinate move-in and room essentials directly with your confirmed roommates below.
            </p>
          </div>

          <button
            onClick={() => setActiveView('dashboard')}
            className="mt-4 md:mt-0 px-4 py-2 bg-[#2A2827] text-[#FEFB58] text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer self-start"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Back to Student Portal</span>
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-[#A1927D]/40 p-10 text-center text-xs text-[#5B514B]">
            Loading verified roommates from database...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaceLetters.map((letter, idx) => {
              const spaceNum = idx + 1;
              const occupant = liveRoommates.find((m) => m.space_identifier === letter);
              const isYou = occupant?.is_you || spaceNum === currentStudent.spaceNumber;

              if (occupant || isYou) {
                const displayName = occupant?.name || currentStudent.name;
                const displayPhone = occupant?.phone_number || currentStudent.phone;
                const displayEmail = occupant?.email || currentStudent.email;
                const cleanDigits = (displayPhone || '').replace(/[^0-9]/g, '');
                const waPhone = cleanDigits.startsWith('0')
                  ? `233${cleanDigits.slice(1)}`
                  : cleanDigits;

                return (
                  <div
                    key={letter}
                    className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-sm ${
                      isYou ? 'border-[#2A2827] ring-2 ring-[#2A2827]/10' : 'border-[#A1927D]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-[11px] font-black px-2.5 py-1 rounded ${
                            isYou ? 'bg-[#2A2827] text-[#FEFB58]' : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          Space #{spaceNum} (Bed {letter})
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isYou ? 'Your Space' : 'Confirmed Resident'}
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-[#2A2827]">{displayName}</h3>
                      <p className="text-xs text-[#5B514B] mt-0.5">
                        Room {currentStudent.roomNumber} · {assignedRoom?.floor || 'Ground'} Floor
                      </p>

                      <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2 text-xs">
                        {displayPhone && (
                          <div className="flex items-center justify-between text-[#5B514B]">
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#2A2827]" />
                              <span>Phone:</span>
                            </span>
                            <a
                              href={`tel:${displayPhone}`}
                              className="font-bold text-[#2A2827] hover:underline"
                            >
                              {displayPhone}
                            </a>
                          </div>
                        )}
                        {displayEmail && (
                          <div className="flex items-center justify-between text-[#5B514B]">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-[#2A2827]" />
                              <span>Email:</span>
                            </span>
                            <a
                              href={`mailto:${displayEmail}`}
                              className="font-semibold text-[#2A2827] hover:underline truncate max-w-[180px]"
                            >
                              {displayEmail}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isYou && displayPhone && (
                      <div className="mt-5 pt-4 border-t border-zinc-100 flex gap-2">
                        <a
                          href={`tel:${displayPhone}`}
                          className="flex-1 py-2.5 px-3 bg-[#2A2827] hover:bg-[#5B514B] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#FEFB58]" />
                          <span>Call</span>
                        </a>
                        {waPhone && (
                          <a
                            href={`https://wa.me/${waPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-3 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={letter}
                  className="bg-white/70 rounded-2xl border border-dashed border-[#A1927D] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-[#F4EFE7] text-[#7D6E66]">
                        Space #{spaceNum} (Bed {letter})
                      </span>
                      <span className="text-[11px] font-bold text-amber-700">Vacant</span>
                    </div>
                    <h3 className="text-base font-bold text-[#2A2827]">Unassigned Bed Space</h3>
                    <p className="text-xs text-[#5B514B] mt-1 leading-relaxed">
                      This space in Room {currentStudent.roomNumber} has not been booked yet. Have a friend at KNUST?
                      Share your room number (<strong>{currentStudent.roomNumber}</strong>) so they can reserve Space #
                      {spaceNum}.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-zinc-200/60 text-[11px] font-semibold text-[#7D6E66] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Available for same-gender booking</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
