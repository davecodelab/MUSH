
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import {
  X,
  Printer,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Phone,
  CalendarDays,
  UserRound,
  BedDouble,
  ReceiptText,
  CreditCard,
  Download,
} from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const {
    isReceiptModalOpen,
    closeReceiptModal,
    activeReceiptBooking,
    config,
  } = useHostel();

  useEffect(() => {
    if (!isReceiptModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeReceiptModal();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReceiptModalOpen, closeReceiptModal]);

  if (!isReceiptModalOpen || !activeReceiptBooking) return null;

  const booking = activeReceiptBooking;

  const formatMoney = (amount: number) =>
    `GHS ${Number(amount).toLocaleString('en-GH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (value: string | Date) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return 'Date unavailable';

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Keep the existing fee allocation logic.
  const totalAmount = Number(booking.amount) || 0;
  const accommodationAmount = totalAmount - 400;
  const utilitiesAmount = 250;
  const depositAmount = 150;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="receipt-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="receipt-modal-overlay fixed inset-0 z-200 flex items-center justify-center overflow-y-auto overscroll-contain bg-[#171513]/80 p-0 backdrop-blur-md sm:p-4 md:p-6"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            closeReceiptModal();
          }
        }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="receipt-title"
          key="receipt-dialog"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="receipt-modal-panel relative my-auto flex max-h-dvh w-full max-w-3xl flex-col overflow-hidden bg-[#F8F6F1] shadow-2xl sm:max-h-[94dvh] sm:rounded-2xl lg:max-w-4xl"
        >
          {/* Modal toolbar */}
          <header className="no-print flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#211F1D] px-4 py-3.5 text-white sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FEFB58]/20 bg-[#FEFB58]/10">
                <ReceiptText className="h-5 w-5 text-[#FEFB58]" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-wide">
                  Accommodation receipt
                </p>
                <p className="mt-0.5 text-[11px] text-white/55">
                  Mushia Hostel · Payment record
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePrint}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#FEFB58] px-3.5 text-xs font-extrabold text-[#211F1D] transition-colors hover:bg-[#F5F24C] sm:px-4 sm:text-sm"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print / Save PDF</span>
                <span className="sm:hidden">Print</span>
              </motion.button>

              <button
                type="button"
                onClick={closeReceiptModal}
                aria-label="Close receipt"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Scrollable receipt */}
          <div className="receipt-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <article
              id="printable-receipt"
              className="receipt-paper mx-auto w-full bg-white text-[#292622]"
            >
              {/* Accent strip */}
              <div className="h-1.5 bg-[#FEFB58]" />

              <div className="space-y-7 p-5 sm:space-y-8 sm:p-8 md:p-10">
                {/* Letterhead */}
                <section className="flex flex-col gap-5 border-b border-[#E7E3DB] pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#211F1D] text-[#FEFB58] sm:h-14 sm:w-14">
                        <Image
                          src="/images/mushia_logo.png"
                          alt="Mushia Hostel logo"
                          width={40}
                          height={40}
                          className="h-6 w-6 sm:h-8 sm:w-8"
                        />
                      </div>

                      <div>
                        <h1 className="text-xl font-black tracking-[-0.06em] text-[#211F1D] sm:text-2xl">
                          MUSHIA HOSTEL
                        </h1>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9A8B78] sm:text-[10px]">
                          Your space. Your comfort.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 text-xs leading-relaxed text-[#777168]">
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9A8B78]" />
                        <span>
                          FNF Junction, Ayeduase Newsite,
                          <br className="hidden sm:block" /> Kumasi, Ghana · Near KNUST Campus
                        </span>
                      </p>

                      <p className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-[#9A8B78]" />
                        <span>{config.phone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 sm:block sm:min-w-47.5 sm:text-right">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#A1927D]">
                        Official receipt
                      </p>
                      <p className="mt-2 break-all font-mono text-sm font-black text-[#211F1D] sm:text-base">
                        {booking.bookingReference}
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#777168] sm:justify-end">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:mt-4 sm:inline-flex">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                        Paid
                      </span>
                    </div>
                  </div>
                </section>

                {/* Total summary */}
                <section className="relative overflow-hidden rounded-2xl bg-[#211F1D] p-5 text-white sm:p-7">
                  <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full border-24 border-white/4" />
                  <div className="pointer-events-none absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-[#FEFB58]/5 blur-2xl" />

                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                        Total payment recorded
                      </p>
                      <p className="mt-2 text-3xl font-black tracking-tight text-[#FEFB58] sm:text-4xl">
                        {formatMoney(totalAmount)}
                      </p>
                      <p className="mt-2 text-xs text-white/55">
                        Accommodation booking · {booking.bookingPeriod}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 sm:self-center">
                      <ShieldCheck className="h-5 w-5 shrink-0 text-[#FEFB58]" />
                      <div>
                        <p className="text-xs font-bold">Payment record</p>
                        <p className="mt-0.5 text-[10px] text-white/50">
                          Reference available below
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Student and room information */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                  <div className="rounded-2xl border border-[#EAE6DF] bg-[#FBFAF7] p-4 sm:p-5">
                    <div className="mb-4 flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDE8DE]">
                        <UserRound className="h-4 w-4 text-[#5B514B]" />
                      </div>
                      <div>
                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#292622]">
                          Student details
                        </h2>
                        <p className="mt-0.5 text-[10px] text-[#9A9185]">
                          Registered occupant
                        </p>
                      </div>
                    </div>

                    <p className="wrap-break-word text-base font-extrabold text-[#211F1D]">
                      {booking.studentName}
                    </p>

                    <div className="mt-3 space-y-2 text-xs leading-relaxed text-[#777168]">
                      <p>
                        <span className="font-semibold text-[#4B4640]">KNUST ID:</span>{' '}
                        {booking.studentKnustId}
                      </p>
                      <p>
                        <span className="font-semibold text-[#4B4640]">Programme:</span>{' '}
                        {booking.program}
                      </p>
                      <p>
                        <span className="font-semibold text-[#4B4640]">Level:</span>{' '}
                        {booking.level}
                      </p>
                      <p>
                        <span className="font-semibold text-[#4B4640]">Phone:</span>{' '}
                        {booking.studentPhone}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#EAE6DF] bg-[#FBFAF7] p-4 sm:p-5">
                    <div className="mb-4 flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDE8DE]">
                        <BedDouble className="h-4 w-4 text-[#5B514B]" />
                      </div>
                      <div>
                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#292622]">
                          Room allocation
                        </h2>
                        <p className="mt-0.5 text-[10px] text-[#9A9185]">
                          Accommodation details
                        </p>
                      </div>
                    </div>

                    <p className="text-base font-extrabold text-[#211F1D]">
                      Room {booking.roomNumber}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#8B756C]">
                      Space #{booking.spaceNumber} · {booking.floor} Floor
                    </p>

                    <div className="mt-3 space-y-2 text-xs leading-relaxed text-[#777168]">
                      <p>
                        <span className="font-semibold text-[#4B4640]">Room type:</span>{' '}
                        {booking.roomType}
                      </p>
                      <p>
                        <span className="font-semibold text-[#4B4640]">Cooling:</span>{' '}
                        {booking.airConditioned ? 'Air-conditioned' : 'Ceiling fan'}
                      </p>
                      <p>
                        <span className="font-semibold text-[#4B4640]">Session:</span>{' '}
                        {booking.bookingPeriod}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Itemised fees */}
                <section>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-black text-[#211F1D] sm:text-base">
                        Payment breakdown
                      </h2>
                      <p className="mt-1 text-xs text-[#8B847A]">
                        Itemised accommodation charges
                      </p>
                    </div>
                    <ReceiptText className="h-5 w-5 shrink-0 text-[#A1927D]" />
                  </div>

                  <div className="overflow-hidden rounded-xl border border-[#E7E3DB]">
                    <table className="w-full table-fixed text-left text-xs">
                      <thead className="bg-[#F3F0E9] text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#777168] sm:text-[10px]">
                        <tr>
                          <th className="w-[68%] px-3 py-3 sm:px-4">Description</th>
                          <th className="w-[32%] px-3 py-3 text-right sm:px-4">
                            Amount (GHS)
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#EEEAE3]">
                        <tr>
                          <td className="wrap-break-word px-3 py-4 sm:px-4">
                            <p className="font-bold leading-relaxed text-[#292622]">
                              Accommodation rental
                            </p>
                            <p className="mt-1 text-[10px] leading-relaxed text-[#8B847A]">
                              Two-semester accommodation · Room {booking.roomNumber}, Space {booking.spaceNumber}
                            </p>
                          </td>
                          <td className="wrap-break-word px-3 py-4 text-right font-mono text-[11px] font-bold text-[#292622] sm:px-4 sm:text-xs">
                            {formatMoney(accommodationAmount)}
                          </td>
                        </tr>

                        <tr>
                          <td className="wrap-break-word px-3 py-4 sm:px-4">
                            <p className="font-bold leading-relaxed text-[#292622]">
                              Utilities & security maintenance
                            </p>
                            <p className="mt-1 text-[10px] leading-relaxed text-[#8B847A]">
                              Water, standby generator, Wi-Fi and CCTV
                            </p>
                          </td>
                          <td className="wrap-break-word px-3 py-4 text-right font-mono text-[11px] font-bold text-[#292622] sm:px-4 sm:text-xs">
                            {formatMoney(utilitiesAmount)}
                          </td>
                        </tr>

                        <tr>
                          <td className="wrap-break-word px-3 py-4 sm:px-4">
                            <p className="font-bold leading-relaxed text-[#292622]">
                              Refundable security & key deposit
                            </p>
                            <p className="mt-1 text-[10px] leading-relaxed text-[#8B847A]">
                              Subject to the hostel&apos;s deposit and checkout terms
                            </p>
                          </td>
                          <td className="wrap-break-word px-3 py-4 text-right font-mono text-[11px] font-bold text-[#292622] sm:px-4 sm:text-xs">
                            {formatMoney(depositAmount)}
                          </td>
                        </tr>
                      </tbody>

                      <tfoot>
                        <tr className="border-t-2 border-[#D9D3C8] bg-[#F8F6F1]">
                          <td className="px-3 py-4 text-xs font-black text-[#211F1D] sm:px-4 sm:text-sm">
                            Total paid
                          </td>
                          <td className="px-3 py-4 text-right font-mono text-xs font-black text-[#211F1D] sm:px-4 sm:text-sm">
                            {formatMoney(totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <p className="mt-3 text-[10px] leading-relaxed text-[#8B847A]">
                    Please retain this receipt for your accommodation records.
                    Deposit refunds are subject to the applicable hostel terms.
                  </p>
                </section>

                {/* Payment verification */}
                <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                      <ShieldCheck className="h-5 w-5 text-emerald-700" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-extrabold text-emerald-950">
                          Payment verification
                        </h2>
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-800">
                          {booking.paymentMethod}
                        </span>
                      </div>

                      <p className="mt-1 text-xs leading-relaxed text-emerald-800/80">
                        Payment reference recorded for this booking.
                      </p>

                      <div className="mt-4 border-t border-emerald-200/80 pt-3">
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-emerald-800/60">
                          Payment reference
                        </p>
                        <p className="mt-1 break-all font-mono text-xs font-bold text-emerald-950">
                          {booking.paymentReference}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-[#E7E3DB] pt-6">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-[#211F1D]">
                        Thank you for choosing Mushia Hostel.
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#8B847A]">
                        We wish you a comfortable and successful academic year.
                      </p>
                    </div>

                    <div className="w-full sm:w-48">
                      <div className="h-8 border-b border-dashed border-[#BEB6A9]" />
                      <p className="mt-2 text-[9px] font-bold uppercase leading-relaxed tracking-[0.12em] text-[#777168]">
                        Hostel administration
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 border-t border-[#EEEAE3] pt-4 text-[9px] text-[#A39B90] sm:flex-row sm:items-center sm:justify-between">
                    <span>MUSHIA HOSTEL · AYEDUASE NEWSITE, KUMASI</span>
                    <span>Ref: {booking.bookingReference}</span>
                  </div>
                </footer>
              </div>
            </article>
          </div>

          {/* Bottom action bar */}
          <footer className="no-print flex shrink-0 items-center justify-between gap-3 border-t border-[#E7E3DB] bg-white px-4 py-3 sm:px-6">
            <div className="hidden items-center gap-2 text-[11px] text-[#8B847A] sm:flex">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>Keep this receipt for your records.</span>
            </div>

            <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
              <button
                type="button"
                onClick={closeReceiptModal}
                className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#E7E3DB] px-4 text-sm font-bold text-[#5B514B] transition-colors hover:bg-[#F8F6F1] sm:flex-none"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#211F1D] px-4 text-sm font-bold text-[#FEFB58] transition-colors hover:bg-[#3A3632] sm:flex-none"
              >
                <Download className="h-4 w-4" />
                Save PDF
              </button>
            </div>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


