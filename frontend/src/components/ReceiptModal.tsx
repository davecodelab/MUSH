'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHostel } from '../context/HostelContext';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, closeReceiptModal, activeReceiptBooking, config } = useHostel();

  if (!isReceiptModalOpen || !activeReceiptBooking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-zinc-200 my-6 relative flex flex-col"
        >
          
          {/* Top Control Bar */}
          <div className="bg-[#2A2827] text-white px-6 py-3 flex items-center justify-between no-print">
            <span className="text-xs font-bold text-[#FEFB58]">Official Accommodation Receipt</span>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrint}
                className="px-3 py-1.5 bg-[#5B514B] hover:bg-[#7D6E66] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </motion.button>
              <button
                onClick={closeReceiptModal}
                className="p-1 rounded-lg hover:bg-[#5B514B] text-zinc-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Letterhead & Body */}
          <div id="printable-receipt" className="p-8 text-[#2A2827] space-y-6 bg-white">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-6 border-b-2 border-[#2A2827]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-6 h-6 text-[#2A2827]" />
                  <h2 className="text-2xl font-black text-[#2A2827] tracking-tight">MUSHIA HOSTEL</h2>
                </div>
                <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">
                  FNF Junction, Ayeduase Newsite, Kumasi, Ghana<br />
                  Near KNUST Campus · Tel: {config.phone}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-widest">
                  OFFICIAL RECEIPT
                </span>
                <span className="text-base font-black font-mono text-[#2A2827] block">
                  {activeReceiptBooking.bookingReference}
                </span>
                <span className="text-xs text-zinc-500 block">
                  Date: {new Date(activeReceiptBooking.createdAt).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>

            {/* Student & Allocation Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Student Allocated</span>
                <strong className="text-sm font-bold text-[#2A2827] block mt-0.5">{activeReceiptBooking.studentName}</strong>
                <p className="text-zinc-600 mt-0.5">KNUST ID: {activeReceiptBooking.studentKnustId}</p>
                <p className="text-zinc-600">{activeReceiptBooking.program} ({activeReceiptBooking.level})</p>
                <p className="text-zinc-600">{activeReceiptBooking.studentPhone}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Room Allocation</span>
                <strong className="text-sm font-bold text-[#2A2827] block mt-0.5">
                  Room {activeReceiptBooking.roomNumber} · Space #{activeReceiptBooking.spaceNumber}
                </strong>
                <p className="text-zinc-600 mt-0.5">{activeReceiptBooking.floor} Floor · {activeReceiptBooking.roomType}</p>
                <p className="text-zinc-600">{activeReceiptBooking.airConditioned ? 'Air Conditioned Suite' : 'Ceiling Fan Suite'}</p>
                <p className="text-zinc-600">Session: {activeReceiptBooking.bookingPeriod}</p>
              </div>
            </div>

            {/* Fee Itemization Table */}
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#2A2827] text-white text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Description</th>
                    <th className="py-2.5 px-4 text-right font-bold">Amount (GHS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-zinc-800">Accommodation Rental (Two Semesters)</p>
                      <p className="text-[11px] text-zinc-500">Room {activeReceiptBooking.roomNumber}, Space {activeReceiptBooking.spaceNumber}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      {(activeReceiptBooking.amount - 400).toLocaleString()}.00
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-zinc-800">Utilities, Standby Plant & Security Maintenance</p>
                      <p className="text-[11px] text-zinc-500">24/7 Water, Generator, Wi-Fi, CCTV monitoring</p>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">250.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-zinc-800">Refundable Security & Key Deposit</p>
                      <p className="text-[11px] text-zinc-500">Reimbursed upon academic year departure</p>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">150.00</td>
                  </tr>
                </tbody>
                <tfoot className="bg-zinc-100 border-t-2 border-zinc-300">
                  <tr>
                    <td className="py-3 px-4 font-bold text-sm text-[#2A2827]">Total Paid in Full</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-base text-[#2A2827]">
                      GHS {activeReceiptBooking.amount.toLocaleString()}.00
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Paystack Verification Seal */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Verified via <strong>Paystack</strong> ({activeReceiptBooking.paymentMethod})
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Auth Reference</span>
                <span className="font-mono text-zinc-700 text-[11px]">{activeReceiptBooking.paymentReference}</span>
              </div>
            </div>

            {/* Signature and Stamp footer */}
            <div className="pt-6 flex justify-between items-end text-zinc-500 text-[11px]">
              <div>
                <p className="font-semibold text-zinc-800">Mushia Hostel Administration</p>
                <p>Ayeduase Newsite, Kumasi</p>
              </div>
              <div className="text-right border-t border-zinc-400 pt-1 w-44">
                <span className="text-[10px] uppercase tracking-wider block">Authorized Officer Signature</span>
              </div>
            </div>

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
