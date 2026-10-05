import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import { 
  Building2, 
  CheckCircle2, 
  Download, 
  FileText, 
  CreditCard, 
  Bell, 
  User, 
  HeartHandshake, 
  Phone, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  Bed
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentStudent, 
    bookings, 
    payments, 
    notifications, 
    rooms, 
    openReceiptModal, 
    setActiveView,
    config 
  } = useHostel();

  const [activeTab, setActiveTab] = useState<'overview' | 'room' | 'booking' | 'payments' | 'notifications'>('overview');

  // If student hasn't paid, prompt them
  if (!currentStudent.hasPaid) {
    return (
      <section className="py-20 bg-[#F4EFE7]">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl border border-[#A1927D]/50 p-8 shadow-sm">
            <User className="w-12 h-12 text-[#5B514B] mx-auto mb-4" />
            <h2 className="text-2xl font-black text-[#2A2827] mb-2">No Active Booking Found</h2>
            <p className="text-xs text-[#5B514B] mb-6">
              You are currently logged in as a prospective student guest. Reserve an available space to access your personalized student dashboard, room visualizer, and receipts.
            </p>
            <button
              onClick={() => setActiveView('rooms')}
              className="px-6 py-3 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Browse 120 Rooms & Book
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Find user's confirmed booking
  const myBooking = bookings.find((b) => b.id === currentStudent.bookingId) || bookings[0];
  const myRoom = rooms.find((r) => r.id === currentStudent.roomId || r.roomNumber === currentStudent.roomNumber) || rooms.find((r) => r.roomNumber === '305') || rooms[0];

  return (
    <section className="py-12 bg-[#F4EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Greeting Banner */}
        <div className="bg-[#2A2827] rounded-2xl p-6 sm:p-8 text-white mb-8 border border-[#5B514B] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-bold text-[#FEFB58] uppercase tracking-wider block mb-1">
              KNUST Student Resident Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4EFE7]">
              Welcome, {currentStudent.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#A5ABAA] mt-1">
              Your Mushia Hostel accommodation is confirmed for the {config.academicYear}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {myBooking && (
              <button
                onClick={() => openReceiptModal(myBooking)}
                className="px-4 py-2.5 bg-[#5B514B] hover:bg-[#7D6E66] text-white text-xs font-bold rounded-lg border border-[#7D6E66]/60 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#FEFB58]" />
                <span>Official Receipt</span>
              </button>
            )}

            <button
              onClick={() => setActiveView('roommates')}
              className="px-5 py-2.5 bg-[#FEFB58] hover:bg-[#fff945] text-[#2A2827] text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <HeartHandshake className="w-4 h-4 text-[#2A2827]" />
              <span>Roommate Hub</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#A1927D]/40 pb-3 mb-8 overflow-x-auto no-scrollbar text-xs font-bold">
          {[
            { id: 'overview' as const, label: 'Overview' },
            { id: 'room' as const, label: 'My Room & Beds' },
            { id: 'booking' as const, label: 'Booking Details' },
            { id: 'payments' as const, label: 'Payment Ledger' },
            { id: 'notifications' as const, label: `Notifications (${notifications.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#2A2827] text-[#FEFB58]'
                  : 'bg-white/80 text-[#5B514B] hover:bg-white hover:text-[#2A2827]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#A1927D]/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] block">My Room</span>
                <span className="text-xl font-extrabold text-[#2A2827] block mt-1">
                  Room {currentStudent.roomNumber || myRoom.roomNumber}
                </span>
                <span className="text-xs text-[#5B514B] mt-0.5 block">
                  {myRoom.roomType} · {myRoom.floor} Floor ({myRoom.airConditioned ? 'AC' : 'Fan'})
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#A1927D]/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] block">Booking Status</span>
                <span className="text-xl font-extrabold text-emerald-700 block mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Confirmed
                </span>
                <span className="text-xs text-[#7D6E66] mt-0.5 block">
                  Space #{currentStudent.spaceNumber || 1} permanently assigned
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#A1927D]/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] block">Payment</span>
                <span className="text-xl font-extrabold text-[#2A2827] block mt-1 tabular-nums">
                  GHS {myRoom.price.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">
                  Paid via Paystack
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#A1927D]/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D6E66] block">Booking Ref</span>
                <span className="text-base font-black font-mono text-[#2A2827] block mt-1">
                  {myBooking?.bookingReference || 'MSH-2026-7841'}
                </span>
                <span className="text-xs text-[#7D6E66] mt-0.5 block">
                  Official KNUST registry ID
                </span>
              </div>
            </div>

            {/* Room Visual representation */}
            <div className="bg-white rounded-2xl border border-[#A1927D]/40 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#2A2827]">
                    Room {myRoom.roomNumber} Occupancy Visualizer
                  </h3>
                  <p className="text-xs text-[#5B514B]">
                    {myRoom.spaces.filter((s) => s.status === 'paid').length} of {myRoom.capacity} spaces confirmed occupied.
                  </p>
                </div>

                <button
                  onClick={() => setActiveView('roommates')}
                  className="text-xs font-bold text-[#5B514B] hover:text-[#2A2827] underline cursor-pointer"
                >
                  Roommate Matching →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {myRoom.spaces.map((s) => {
                  const isYou = s.spaceNumber === currentStudent.spaceNumber;
                  const isPaid = s.status === 'paid';

                  return (
                    <div
                      key={s.id}
                      className={`p-4 rounded-xl border text-center flex flex-col justify-between ${
                        isYou
                          ? 'bg-[#FEFB58]/20 border-[#2A2827] ring-2 ring-[#2A2827]/10'
                          : isPaid
                          ? 'bg-zinc-50 border-zinc-200'
                          : 'bg-[#F4EFE7]/50 border-dashed border-[#A1927D]'
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {isYou ? '🧑‍🎓' : isPaid ? '🧑' : '🟢'}
                      </div>

                      <div>
                        <span className="font-bold text-xs block text-[#2A2827]">
                          Space #{s.spaceNumber}
                        </span>
                        <span className="text-xs font-semibold text-[#5B514B] block mt-0.5">
                          {isYou ? 'You (Dave)' : isPaid ? (s.studentName || 'Roommate') : 'Available'}
                        </span>
                        {isPaid && (
                          <span className="text-[10px] text-[#7D6E66] block">
                            {s.studentProgram || 'KNUST Student'}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-[#7D6E66]">
                        {isYou ? 'Assigned' : isPaid ? 'Confirmed' : 'Vacant'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MY ROOM */}
        {activeTab === 'room' && (
          <div className="bg-white rounded-2xl border border-[#A1927D]/40 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-xl font-bold text-[#2A2827]">Room {myRoom.roomNumber} Details</h3>
                <p className="text-xs text-[#5B514B]">
                  {myRoom.floor} Floor · {myRoom.roomType} · {myRoom.size} Dimensions · {myRoom.airConditioned ? 'Refrigerated Split AC' : 'Ceiling Fan'}
                </p>
              </div>

              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                Checked-In Allocation Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#7D6E66] mb-3">Room Inclusions</h4>
                <ul className="text-xs space-y-2 text-[#2A2827]">
                  {myRoom.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#7D6E66] mb-3">Hostel Residence Guidelines</h4>
                <div className="text-xs text-[#5B514B] space-y-2 bg-[#F4EFE7]/60 p-4 rounded-xl border border-[#A1927D]/30">
                  <p>· <strong>Quiet Hours:</strong> 11:00 PM – 6:00 AM daily in hallways and residential wings.</p>
                  <p>· <strong>Study Room:</strong> 24-hour access available on the ground floor.</p>
                  <p>· <strong>Standby Generator:</strong> Automatically activates within 15 seconds of any ECG outage.</p>
                  <p>· <strong>Keys & Access:</strong> Never duplicate room keys. Contact hostel management for key replacements.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKING DETAILS */}
        {activeTab === 'booking' && myBooking && (
          <div className="bg-white rounded-2xl border border-[#A1927D]/40 p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-lg font-bold text-[#2A2827]">Booking Record</h3>
                <p className="text-xs text-[#5B514B]">Reference: {myBooking.bookingReference}</p>
              </div>

              <button
                onClick={() => openReceiptModal(myBooking)}
                className="px-4 py-2 bg-[#5B514B] text-white text-xs font-bold rounded-lg hover:bg-[#2A2827] flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FEFB58]" />
                <span>Download Receipt</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#F4EFE7]/50 rounded-xl border border-[#A1927D]/30">
                <span className="text-[#7D6E66] block">Student Name</span>
                <span className="font-bold text-[#2A2827] text-sm">{myBooking.studentName}</span>
              </div>
              <div className="p-3 bg-[#F4EFE7]/50 rounded-xl border border-[#A1927D]/30">
                <span className="text-[#7D6E66] block">KNUST Student ID</span>
                <span className="font-bold text-[#2A2827] text-sm font-mono">{myBooking.studentKnustId}</span>
              </div>
              <div className="p-3 bg-[#F4EFE7]/50 rounded-xl border border-[#A1927D]/30">
                <span className="text-[#7D6E66] block">Academic Program</span>
                <span className="font-bold text-[#2A2827] text-sm">{myBooking.program} ({myBooking.level})</span>
              </div>
              <div className="p-3 bg-[#F4EFE7]/50 rounded-xl border border-[#A1927D]/30">
                <span className="text-[#7D6E66] block">Hostel Address</span>
                <span className="font-bold text-[#2A2827] text-sm">{config.address}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENTS LEDGER */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-[#A1927D]/40 overflow-hidden">
            <div className="p-6 pb-4 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#2A2827]">Payment Transactions</h3>
                <p className="text-xs text-[#5B514B]">Itemized record of payments verified by Paystack.</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#2A2827] text-white text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Paystack Ref</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {payments.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-50">
                      <td className="py-3.5 px-4 font-medium text-zinc-700">{tx.date}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-zinc-900">{tx.reference}</td>
                      <td className="py-3.5 px-4 text-zinc-700">{tx.method}</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#2A2827] tabular-nums">
                        GHS {tx.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {myBooking && (
                          <button
                            onClick={() => openReceiptModal(myBooking)}
                            className="text-xs font-bold text-[#5B514B] hover:text-[#2A2827] underline cursor-pointer"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-[#A1927D]/40 p-6 space-y-4">
            <h3 className="text-base font-bold text-[#2A2827]">In-App Hostel Notifications</h3>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-[#F4EFE7]/50 border border-[#A1927D]/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#5B514B]/10 text-[#5B514B] flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4 text-[#2A2827]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2A2827]">{n.title}</h4>
                    <p className="text-xs text-[#5B514B] mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-[#A1927D] mt-1 block">{n.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
