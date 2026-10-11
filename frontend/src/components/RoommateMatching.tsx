
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { getRoommates } from '../services/api';
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  DoorOpen,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
  LockKeyhole,
} from 'lucide-react';

interface LiveRoommate {
  space_identifier: string;
  name: string;
  phone_number: string;
  email: string;
  gender: string;
  is_you: boolean;
}

const palette = {
  ink: '#2A2827',
  dark: '#211F1D',
  cream: '#F4EFE7',
  yellow: '#FEFB58',
  taupe: '#A1927D',
  muted: '#7D6E66',
};

const getWhatsAppNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `233${digits.slice(1)}`;
  return digits;
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const spaceLetters = ['A', 'B', 'C', 'D'];

export const RoommateMatching: React.FC = () => {
  const { currentStudent, rooms, setActiveView } = useHostel();

  const [liveRoommates, setLiveRoommates] = useState<LiveRoommate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'occupied' | 'vacant'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const assignedRoom = rooms.find(
    (room) =>
      room.id === currentStudent.roomId ||
      room.roomNumber === currentStudent.roomNumber,
  );

  const hasRoom = Boolean(currentStudent.roomNumber);

  const capacity = Math.min(
    4,
    Math.max(
      1,
      Number(assignedRoom?.capacity) ||
        liveRoommates.length ||
        2,
    ),
  );

  const loadRoommates = useCallback(async () => {
    if (!currentStudent.hasPaid || !currentStudent.roomNumber) {
      setLiveRoommates([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getRoommates(currentStudent.roomNumber);

      if (data && Array.isArray(data.roommates)) {
        setLiveRoommates(data.roommates);
      } else {
        setLiveRoommates([]);
      }
    } catch {
      setError(
        'We could not load your room directory. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [currentStudent.hasPaid, currentStudent.roomNumber]);

  useEffect(() => {
    void loadRoommates();
  }, [loadRoommates, refreshKey]);

  const occupants = useMemo(
    () =>
      Array.from({ length: capacity }, (_, index) => {
        const letter = spaceLetters[index];
        const spaceNumber = index + 1;

        const roommate = liveRoommates.find(
          (person) =>
            person.space_identifier?.toUpperCase() === letter,
        );

        const isOwnSpace =
          Boolean(roommate?.is_you) ||
          Number(currentStudent.spaceNumber) === spaceNumber;

        if (roommate || isOwnSpace) {
          return {
            letter,
            spaceNumber,
            status: 'occupied' as const,
            isYou: isOwnSpace,
            name: roommate?.name || currentStudent.name || 'You',
            phone:
              roommate?.phone_number ||
              (isOwnSpace ? currentStudent.phone : ''),
            email:
              roommate?.email ||
              (isOwnSpace ? currentStudent.email : ''),
          };
        }

        return {
          letter,
          spaceNumber,
          status: 'vacant' as const,
          isYou: false,
          name: '',
          phone: '',
          email: '',
        };
      }),
    [
      capacity,
      liveRoommates,
      currentStudent.spaceNumber,
      currentStudent.name,
      currentStudent.phone,
      currentStudent.email,
    ],
  );

  const occupiedCount = occupants.filter(
    (space) => space.status === 'occupied',
  ).length;

  const vacantCount = capacity - occupiedCount;

  const filteredOccupants = occupants.filter((space) => {
    if (filter === 'occupied' && space.status !== 'occupied') return false;
    if (filter === 'vacant' && space.status !== 'vacant') return false;

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      const searchable = [
        space.name,
        space.letter,
        String(space.spaceNumber),
        space.phone,
        space.email,
      ]
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(query)) return false;
    }

    return true;
  });

  // Keep the directory private until payment has been confirmed.
  if (!currentStudent.hasPaid) {
    return (
      <section className="min-h-[75vh] bg-[#F4EFE7] px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl border border-[#A1927D]/30 bg-white shadow-[0_20px_60px_rgba(42,40,39,0.07)]"
          >
            <div className="h-1.5 bg-[#FEFB58]" />

            <div className="px-5 py-10 text-center sm:px-12 sm:py-14">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4EFE7] text-[#2A2827]">
                <LockKeyhole className="h-7 w-7" />
              </div>

              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F4EFE7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7D6E66]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Resident-only access
              </span>

              <h1 className="mx-auto max-w-xl text-3xl font-black tracking-tight text-[#2A2827] sm:text-4xl">
                Your roommate community starts here.
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#7D6E66]">
                The Roommate Hub helps confirmed residents connect with
                the students sharing their room. Complete your accommodation
                payment and wait for verification to unlock your directory.
              </p>

              <div className="mx-auto mt-8 max-w-md space-y-3 rounded-2xl border border-[#EAE3D9] bg-[#FCFAF6] p-4 text-left">
                {[
                  'See your assigned bed spaces',
                  'Coordinate move-in with your roommates',
                  'Access contact options for confirmed residents',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-[#5B514B]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveView('rooms')}
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FEFB58] px-6 py-3 text-sm font-extrabold text-[#2A2827] transition hover:bg-[#F4F04A] sm:w-auto"
              >
                Explore rooms
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-5 text-xs text-[#A1927D]">
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5" />
                Your room and resident information is kept private.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (!hasRoom) {
    return (
      <section className="min-h-[60vh] bg-[#F4EFE7] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#A1927D]/30 bg-white p-7 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4EFE7]">
            <Building2 className="h-6 w-6 text-[#5B514B]" />
          </div>
          <h1 className="mt-5 text-2xl font-black text-[#2A2827]">
            Your room assignment is pending
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#7D6E66]">
            Your payment is recorded, but we cannot find a room number
            for your account yet. Please check your student dashboard or
            contact hostel administration.
          </p>
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2A2827] px-5 py-3 text-sm font-bold text-[#FEFB58]"
          >
            <ArrowLeft className="h-4 w-4" />
            Student dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen overflow-hidden bg-[#F7F5F0] pb-16">
      {/* Intro hero */}
      <div className="relative overflow-hidden bg-[#211F1D] text-white">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-50 border-white/[0.035]" />
        <div className="pointer-events-none absolute -bottom-36 left-[35%] h-72 w-72 rounded-full bg-[#FEFB58]/6 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8 lg:pb-16">
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="mb-8 inline-flex min-h-10 items-center gap-2 rounded-lg text-xs font-semibold text-white/65 transition hover:text-[#FEFB58]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to student portal
          </button>

          <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FEFB58]/20 bg-[#FEFB58]/8 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#FEFB58]">
                <Sparkles className="h-3.5 w-3.5" />
                Your Mushia community
              </div>

              <h1 className="text-4xl font-black leading-[1.08] tracking-tighter sm:text-5xl lg:text-6xl">
                Good rooms.
                <br />
                <span className="text-[#FEFB58]">Better together.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
                Meet the residents sharing your space, coordinate your
                arrival, and make settling into Mushia Hostel a little easier.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-77.5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-white/50">
                  <Users className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Residents</span>
                </div>
                <p className="mt-3 text-3xl font-black text-white">{occupiedCount}</p>
                <p className="mt-1 text-[11px] text-white/45">Occupied spaces</p>
              </div>

              <div className="rounded-2xl border border-[#FEFB58]/20 bg-[#FEFB58]/[0.07] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-[#FEFB58]/75">
                  <BedDouble className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Available</span>
                </div>
                <p className="mt-3 text-3xl font-black text-[#FEFB58]">{vacantCount}</p>
                <p className="mt-1 text-[11px] text-white/45">Vacant spaces</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Room summary */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="relative -mt-5 rounded-2xl border border-[#EAE3D9] bg-white p-4 shadow-[0_12px_35px_rgba(42,40,39,0.06)] sm:-mt-7 sm:p-6"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F4EFE7] text-[#5B514B]">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black text-[#2A2827] sm:text-xl">
                    Room {currentStudent.roomNumber}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" />
                    Assigned to you
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#8B847A] sm:text-sm">
                  {assignedRoom?.floor
                    ? `${assignedRoom.floor} floor`
                    : 'Mushia Hostel'}{' '}
                  <span className="px-1.5">·</span>
                  Your space #{currentStudent.spaceNumber || '—'}
                  <span className="px-1.5">·</span>
                  Capacity {capacity}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#F8F6F1] p-3 sm:min-w-55">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#7D6E66]">
                <Wifi className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2A2827]">Stay connected</p>
                <p className="mt-1 text-[10px] text-[#8B847A]">
                  Coordinate your move-in together
                </p>
              </div>
            </div>
          </div>

          {/* Occupancy bar */}
          <div className="mt-5 border-t border-[#F0ECE5] pt-4">
            <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-[#8B847A]">
              <span>Room occupancy</span>
              <span>{occupiedCount} of {capacity} spaces</span>
            </div>
            <div className="flex gap-1.5" aria-label={`${occupiedCount} of ${capacity} spaces occupied`}>
              {occupants.map((space) => (
                <div
                  key={space.letter}
                  className={`h-1.5 flex-1 rounded-full ${
                    space.status === 'occupied' ? 'bg-[#A1927D]' : 'bg-[#EAE3D9]'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Directory title */}
        <div className="mb-5 mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#A1927D]">
              Your room directory
            </p>
            <h2 className="text-2xl font-black tracking-tight text-[#2A2827] sm:text-3xl">
              Meet your roommates
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-6 text-[#7D6E66] sm:text-sm">
              Find a resident below to coordinate essentials, arrival times,
              and life in your shared space.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-[#E4DED4] bg-white px-4 text-xs font-bold text-[#5B514B] transition hover:border-[#A1927D] hover:bg-[#FBFAF7] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh directory
          </button>
        </div>

        {/* Search and filters */}
        <div className="mb-6 rounded-2xl border border-[#EAE3D9] bg-white p-3 sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative block min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1927D]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search residents, bed spaces, phone or email..."
                aria-label="Search roommate directory"
                className="h-11 w-full rounded-xl border border-[#EAE3D9] bg-[#FCFBF8] pl-10 pr-4 text-xs text-[#2A2827] outline-none transition placeholder:text-[#A49B90] focus:border-[#A1927D] focus:ring-2 focus:ring-[#A1927D]/15 sm:text-sm"
              />
            </label>

            <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#F4EFE7] p-1">
              {([
                ['all', 'All spaces'],
                ['occupied', 'Residents'],
                ['vacant', 'Vacant'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                  className={`min-h-9 rounded-lg px-2.5 text-[10px] font-bold transition sm:px-4 sm:text-xs ${
                    filter === value
                      ? 'bg-[#2A2827] text-[#FEFB58] shadow-sm'
                      : 'text-[#7D6E66] hover:bg-white/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
              <div>
                <p className="text-sm font-bold text-rose-900">Directory unavailable</p>
                <p className="mt-1 text-xs leading-5 text-rose-800">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              className="min-h-10 shrink-0 rounded-lg bg-white px-4 text-xs font-bold text-rose-800 ring-1 ring-rose-200 hover:bg-rose-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: Math.min(capacity, 4) }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-[#EAE3D9] bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-[#EEE9E0]" />
                  <div className="flex-1">
                    <div className="h-3 w-28 rounded bg-[#EEE9E0]" />
                    <div className="mt-2 h-2.5 w-20 rounded bg-[#F3F0E9]" />
                  </div>
                </div>
                <div className="mt-6 h-3 w-full rounded bg-[#F3F0E9]" />
                <div className="mt-3 h-3 w-3/4 rounded bg-[#F3F0E9]" />
                <div className="mt-6 h-10 rounded-xl bg-[#F3F0E9]" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filteredOccupants.map((space, index) => {
              const isVacant = space.status === 'vacant';
              const waNumber = getWhatsAppNumber(space.phone);

              return (
                <motion.article
                  layout
                  key={space.letter}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.035, duration: 0.22 }}
                  className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(42,40,39,0.07)] ${
                    space.isYou
                      ? 'border-[#C9BEA9] shadow-[0_5px_18px_rgba(42,40,39,0.04)]'
                      : isVacant
                        ? 'border-dashed border-[#D7CFC2]'
                        : 'border-[#EAE3D9]'
                  }`}
                >
                  <div className={`h-1 ${space.isYou ? 'bg-[#FEFB58]' : isVacant ? 'bg-[#EAE3D9]' : 'bg-[#A1927D]'}`} />

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                          space.isYou
                            ? 'bg-[#2A2827] text-[#FEFB58]'
                            : isVacant
                              ? 'bg-[#F4EFE7] text-[#A1927D]'
                              : 'bg-[#EAE3D9] text-[#5B514B]'
                        }`}
                      >
                        {isVacant ? (
                          <BedDouble className="h-5 w-5" />
                        ) : (
                          getInitials(space.name || 'Resident')
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col items-end gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide ${
                            space.isYou
                              ? 'bg-[#2A2827] text-[#FEFB58]'
                              : isVacant
                                ? 'bg-[#F4EFE7] text-[#7D6E66]'
                                : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {space.isYou ? (
                            <Check className="h-3 w-3" />
                          ) : isVacant ? (
                            <DoorOpen className="h-3 w-3" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {space.isYou ? 'Your space' : isVacant ? 'Vacant' : 'Resident'}
                        </span>
                        <span className="text-[10px] font-semibold text-[#A1927D]">
                          Bed {space.letter}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 min-w-0">
                      <h3 className="break-words text-lg font-black tracking-tight text-[#2A2827]">
                        {isVacant ? 'Available bed space' : space.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#8B847A]">
                        Room {currentStudent.roomNumber} · Space #{space.spaceNumber}
                      </p>
                    </div>

                    {isVacant ? (
                      <div className="mt-5 flex-1 rounded-xl bg-[#FBFAF7] p-3.5">
                        <p className="text-xs leading-6 text-[#7D6E66]">
                          This bed space appears unoccupied in your room directory.
                          Availability can change, so confirm with hostel
                          administration before making plans.
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#A1927D]">
                          <Users className="h-3.5 w-3.5" />
                          Room capacity: {capacity}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 flex-1 space-y-3 border-t border-[#F0ECE5] pt-4">
                        {space.phone && (
                          <a
                            href={`tel:${space.phone}`}
                            className="flex min-w-0 items-center gap-3 text-xs text-[#5B514B] transition hover:text-[#211F1D]"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F4EE]">
                              <Phone className="h-3.5 w-3.5" />
                            </span>
                            <span className="min-w-0 break-all">{space.phone}</span>
                          </a>
                        )}

                        {space.email && (
                          <a
                            href={`mailto:${space.email}`}
                            className="flex min-w-0 items-center gap-3 text-xs text-[#5B514B] transition hover:text-[#211F1D]"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F4EE]">
                              <Mail className="h-3.5 w-3.5" />
                            </span>
                            <span className="min-w-0 break-all">{space.email}</span>
                          </a>
                        )}

                        {!space.phone && !space.email && (
                          <p className="text-xs leading-5 text-[#A1927D]">
                            Contact details have not been provided for this resident.
                          </p>
                        )}
                      </div>
                    )}

                    {space.isYou ? (
                      <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#F8F6F1] px-3.5 py-3 text-xs font-semibold text-[#5B514B]">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-[#8B756C]" />
                        This is your assigned bed space
                      </div>
                    ) : !isVacant ? (
                      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#F0ECE5] pt-4">
                        {space.phone ? (
                          <a
                            href={`tel:${space.phone}`}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2A2827] px-3 text-xs font-bold text-white transition hover:bg-[#48423E]"
                          >
                            <Phone className="h-3.5 w-3.5 text-[#FEFB58]" />
                            Call
                          </a>
                        ) : (
                          <span className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#F4EFE7] px-2 text-[10px] font-semibold text-[#A1927D]">
                            No phone listed
                          </span>
                        )}

                        {waNumber ? (
                          <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FEFB58] px-3 text-xs font-extrabold text-[#2A2827] transition hover:bg-[#F4F04A]"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            WhatsApp
                            <ExternalLink className="h-3 w-3 opacity-50" />
                          </a>
                        ) : (
                          <span className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#F4EFE7] px-2 text-[10px] font-semibold text-[#A1927D]">
                            WhatsApp unavailable
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-5 border-t border-[#F0ECE5] pt-4">
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8B847A]">
                          <Clock3 className="h-3.5 w-3.5" />
                          Check current availability before booking
                        </div>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {!loading && !error && filteredOccupants.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#D7CFC2] bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4EFE7] text-[#7D6E66]">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-black text-[#2A2827]">
              No matching spaces found
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#8B847A]">
              Try another search or change the selected filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#2A2827] px-4 text-xs font-bold text-[#FEFB58]"
            >
              Clear filters
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Helpful footer */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#EAE3D9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EFE7] text-[#7D6E66]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#2A2827]">
                A better stay starts with respect
              </p>
              <p className="mt-1 max-w-xl text-[11px] leading-5 text-[#8B847A]">
                Use resident contact details only for relevant accommodation
                coordination. Please respect each roommate&apos;s privacy.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#EAE3D9] px-4 text-xs font-bold text-[#5B514B] transition hover:bg-[#F8F6F1]"
          >
            Student portal
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoommateMatching;
