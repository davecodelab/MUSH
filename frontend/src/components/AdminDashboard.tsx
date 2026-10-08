'use client';

import React, { useState, useMemo } from 'react';
import { useHostel } from '../context/HostelContext';
import { Room, Floor, RoomType } from '../types';
import { 
  Building2, 
  Users, 
  CreditCard, 
  Sliders, 
  CheckCircle2, 
  Wrench, 
  AlertCircle, 
  Search, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    rooms, 
    bookings, 
    payments, 
    roommateRequests, 
    config, 
    adminUpdateRoom, 
    adminToggleMaintenance, 
    adminCancelBooking, 
    adminUpdateConfig, 
    resetAllData 
  } = useHostel();

  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'rooms' | 'bookings' | 'students' | 'payments' | 'settings'>('analytics');
  const [roomSearch, setRoomSearch] = useState('');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editAc, setEditAc] = useState<boolean>(false);
  const [editSize, setEditSize] = useState<'Small' | 'Big'>('Small');

  // Editable config state
  const [configForm, setConfigForm] = useState(config);

  // Compute analytics metrics
  const analytics = useMemo(() => {
    const totalRooms = rooms.length;
    const totalSpaces = rooms.reduce((acc, r) => acc + r.capacity, 0);
    const occupiedSpaces = rooms.reduce((acc, r) => acc + r.spaces.filter((s) => s.status === 'paid').length, 0);
    const reservedSpaces = rooms.reduce((acc, r) => acc + r.spaces.filter((s) => s.status === 'reserved').length, 0);
    const availableSpaces = totalSpaces - occupiedSpaces - reservedSpaces;
    const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;

    const totalRevenue = payments.reduce((acc, p) => p.status === 'Successful' ? acc + p.amount : acc, 0);

    // Floor breakdown
    const floorsMap: Record<Floor, { total: number; occupied: number; roomCount: number }> = {
      'Ground': { total: 0, occupied: 0, roomCount: 0 },
      '1st': { total: 0, occupied: 0, roomCount: 0 },
      '2nd': { total: 0, occupied: 0, roomCount: 0 },
      '3rd': { total: 0, occupied: 0, roomCount: 0 },
      '4th': { total: 0, occupied: 0, roomCount: 0 },
      '5th': { total: 0, occupied: 0, roomCount: 0 },
    };

    rooms.forEach((r) => {
      floorsMap[r.floor].roomCount += 1;
      floorsMap[r.floor].total += r.capacity;
      floorsMap[r.floor].occupied += r.spaces.filter((s) => s.status === 'paid').length;
    });

    // Room Type breakdown
    const typeMap: Record<RoomType, { total: number; occupied: number }> = {
      '4-in-1': { total: 0, occupied: 0 },
      '3-in-1': { total: 0, occupied: 0 },
      '2-in-1': { total: 0, occupied: 0 },
      '1-in-1': { total: 0, occupied: 0 },
    };

    rooms.forEach((r) => {
      typeMap[r.roomType].total += r.capacity;
      typeMap[r.roomType].occupied += r.spaces.filter((s) => s.status === 'paid').length;
    });

    return {
      totalRooms,
      totalSpaces,
      occupiedSpaces,
      availableSpaces,
      reservedSpaces,
      maintenanceRooms,
      totalRevenue,
      floorsMap,
      typeMap,
      occupancyRate: Math.round((occupiedSpaces / (totalSpaces || 1)) * 100),
    };
  }, [rooms, payments]);

  // Filtered rooms in admin
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (roomSearch.trim()) {
        const q = roomSearch.toLowerCase();
        if (!r.roomNumber.toLowerCase().includes(q) && !r.roomType.toLowerCase().includes(q)) return false;
      }
      if (floorFilter !== 'all' && r.floor !== floorFilter) return false;
      return true;
    });
  }, [rooms, roomSearch, floorFilter]);

  const handleStartEdit = (room: Room) => {
    setEditingRoomId(room.id);
    setEditPrice(room.price);
    setEditAc(room.airConditioned);
    setEditSize(room.size);
  };

  const handleSaveRoomEdit = (roomId: string) => {
    adminUpdateRoom(roomId, {
      price: editPrice,
      airConditioned: editAc,
      size: editSize,
    });
    setEditingRoomId(null);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateConfig(configForm);
    alert('Hostel settings updated successfully.');
  };

  return (
    <section className="py-12 bg-[#2A2827] text-[#F4EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#5B514B] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#5B514B] text-[#FEFB58] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#A1927D] font-bold block">
                Administrative Control Console
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Mushia Hostel Management Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Reset hostel rooms and bookings to default seed state?')) {
                  resetAllData();
                }
              }}
              className="px-3.5 py-2 bg-[#5B514B]/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>

        {/* Admin Nav Tabs */}
        <div className="flex items-center gap-2 pb-4 mb-8 border-b border-[#5B514B] overflow-x-auto no-scrollbar text-xs font-bold">
          {[
            { id: 'analytics' as const, label: 'Analytics & KPIs' },
            { id: 'rooms' as const, label: `Room Inventory (${rooms.length})` },
            { id: 'bookings' as const, label: `Bookings (${bookings.length})` },
            { id: 'students' as const, label: 'KNUST Student Roster' },
            { id: 'payments' as const, label: `Payments (${payments.length})` },
            { id: 'settings' as const, label: 'Hostel Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeAdminTab === tab.id
                  ? 'bg-[#FEFB58] text-[#2A2827]'
                  : 'bg-[#5B514B]/40 hover:bg-[#5B514B] text-[#A5ABAA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ANALYTICS & KPIS */}
        {activeAdminTab === 'analytics' && (
          <div className="space-y-8">
            
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#5B514B]/40 border border-[#7D6E66]/50 p-5 rounded-xl">
                <span className="text-[11px] font-bold text-[#A1927D] uppercase tracking-wider block">Total Rooms</span>
                <span className="text-3xl font-black text-white block mt-1 tabular-nums">{analytics.totalRooms}</span>
                <span className="text-xs text-[#A5ABAA] mt-1 block">6 Floors · Official Inventory</span>
              </div>

              <div className="bg-[#5B514B]/40 border border-[#7D6E66]/50 p-5 rounded-xl">
                <span className="text-[11px] font-bold text-[#A1927D] uppercase tracking-wider block">Occupancy Rate</span>
                <span className="text-3xl font-black text-[#FEFB58] block mt-1 tabular-nums">
                  {analytics.occupancyRate}%
                </span>
                <span className="text-xs text-[#A5ABAA] mt-1 block">
                  {analytics.occupiedSpaces} of {analytics.totalSpaces} spaces filled
                </span>
              </div>

              <div className="bg-[#5B514B]/40 border border-[#7D6E66]/50 p-5 rounded-xl">
                <span className="text-[11px] font-bold text-[#A1927D] uppercase tracking-wider block">Total Revenue</span>
                <span className="text-2xl sm:text-3xl font-black text-white block mt-1 tabular-nums">
                  GHS {analytics.totalRevenue.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-400 mt-1 block">Paystack Verified</span>
              </div>

              <div className="bg-[#5B514B]/40 border border-[#7D6E66]/50 p-5 rounded-xl">
                <span className="text-[11px] font-bold text-[#A1927D] uppercase tracking-wider block">Available Spaces</span>
                <span className="text-3xl font-black text-emerald-400 block mt-1 tabular-nums">
                  {analytics.availableSpaces}
                </span>
                <span className="text-xs text-[#A5ABAA] mt-1 block">
                  Ready for instant reservation
                </span>
              </div>
            </div>

            {/* Floor Breakdown & Room Demand Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Floor Occupancy Table */}
              <div className="bg-[#5B514B]/40 border border-[#7D6E66]/50 p-6 rounded-xl">
                <h3 className="font-bold text-base text-white mb-1">Occupancy by Floor Level</h3>
                <p className="text-xs text-[#A5ABAA] mb-4">Detailed distribution across all 6 physical floors.</p>

                <div className="space-y-3 text-xs">
                  {Object.entries(analytics.floorsMap).map(([flName, data]) => {
                    const pct = Math.round((data.occupied / (data.total || 1)) * 100);
                    return (
                      <div key={flName} className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{flName} Floor ({data.roomCount} Rooms)</span>
                          <span className="tabular-nums">{data.occupied} / {data.total} spaces ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full bg-[#2A2827] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FEFB58] rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Room Type Demand */}
              <div className="bg-[#5B514B]/40 border border-[#7D6E66]/50 p-6 rounded-xl">
                <h3 className="font-bold text-base text-white mb-1">Room Configuration Demand</h3>
                <p className="text-xs text-[#A5ABAA] mb-4">Occupancy proportion by room occupancy type.</p>

                <div className="space-y-4 text-xs">
                  {Object.entries(analytics.typeMap).map(([typeName, data]) => {
                    const pct = Math.round((data.occupied / (data.total || 1)) * 100);
                    return (
                      <div key={typeName} className="p-3 bg-[#2A2827]/60 rounded-lg border border-[#7D6E66]/40">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-[#FEFB58]">{typeName} Rooms</span>
                          <span className="text-xs font-mono font-bold text-white tabular-nums">
                            {data.occupied} / {data.total} occupied ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#5B514B] rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ROOM MANAGEMENT (ALL ROOMS) */}
        {activeAdminTab === 'rooms' && (
          <div className="bg-[#5B514B]/30 border border-[#7D6E66]/50 rounded-xl overflow-hidden">
            {/* Filters */}
            <div className="p-5 border-b border-[#7D6E66]/40 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-[#A1927D] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search room (e.g. 305, G01)..."
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#2A2827] border border-[#7D6E66] rounded-lg text-xs text-white placeholder-[#A1927D] focus:outline-none"
                  />
                </div>

                <select
                  value={floorFilter}
                  onChange={(e) => setFloorFilter(e.target.value)}
                  className="bg-[#2A2827] border border-[#7D6E66] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="all">All 6 Floors</option>
                  <option value="Ground">Ground Floor</option>
                  <option value="1st">1st Floor</option>
                  <option value="2nd">2nd Floor</option>
                  <option value="3rd">3rd Floor</option>
                  <option value="4th">4th Floor</option>
                  <option value="5th">5th Floor</option>
                </select>
              </div>

              <div className="text-xs text-[#A5ABAA]">
                Showing {filteredRooms.length} of {rooms.length} rooms
              </div>
            </div>

            {/* Rooms Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#2A2827] text-white text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Room</th>
                    <th className="py-3 px-4">Floor</th>
                    <th className="py-3 px-4">Type & Size</th>
                    <th className="py-3 px-4">Climate</th>
                    <th className="py-3 px-4">Price (GHS)</th>
                    <th className="py-3 px-4">Occupancy</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7D6E66]/40">
                  {filteredRooms.map((room) => {
                    const isEditing = editingRoomId === room.id;
                    const occupied = room.spaces.filter((s) => s.status === 'paid').length;

                    return (
                      <tr key={room.id} className="hover:bg-[#5B514B]/40">
                        <td className="py-3 px-4 font-bold text-white">
                          Room {room.roomNumber}
                        </td>
                        <td className="py-3 px-4 text-[#A5ABAA]">{room.floor}</td>
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <select
                              value={editSize}
                              onChange={(e) => setEditSize(e.target.value as any)}
                              className="bg-[#2A2827] border border-[#7D6E66] rounded px-2 py-1 text-xs"
                            >
                              <option value="Small">Small</option>
                              <option value="Big">Big</option>
                            </select>
                          ) : (
                            <span>{room.roomType} · {room.size}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <button
                              type="button"
                              onClick={() => setEditAc(!editAc)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                editAc ? 'bg-cyan-900 text-cyan-200' : 'bg-zinc-700 text-zinc-300'
                              }`}
                            >
                              {editAc ? 'AC: Yes' : 'AC: No'}
                            </button>
                          ) : (
                            <span className={room.airConditioned ? 'text-cyan-300 font-semibold' : 'text-[#A5ABAA]'}>
                              {room.airConditioned ? 'Split AC' : 'Ceiling Fan'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-24 bg-[#2A2827] border border-[#7D6E66] rounded px-2 py-1 text-xs text-white"
                            />
                          ) : (
                            <span>GHS {room.price.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold tabular-nums">
                            {occupied} / {room.capacity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            room.status === 'maintenance'
                              ? 'bg-zinc-700 text-zinc-300'
                              : occupied === room.capacity
                              ? 'bg-rose-900/60 text-rose-300'
                              : 'bg-emerald-900/60 text-emerald-300'
                          }`}>
                            {room.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveRoomEdit(room.id)}
                              className="px-2.5 py-1 bg-[#FEFB58] text-[#2A2827] font-bold rounded text-xs hover:bg-[#fff945]"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(room)}
                              className="px-2 py-1 bg-[#5B514B] text-white rounded text-xs hover:bg-[#7D6E66]"
                            >
                              Edit
                            </button>
                          )}

                          <button
                            onClick={() => adminToggleMaintenance(room.id)}
                            className="px-2 py-1 bg-zinc-800 text-zinc-300 hover:text-white rounded text-xs"
                            title="Toggle maintenance"
                          >
                            <Wrench className="w-3 h-3 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS MANAGEMENT */}
        {activeAdminTab === 'bookings' && (
          <div className="bg-[#5B514B]/30 border border-[#7D6E66]/50 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-[#7D6E66]/40 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Student Booking Registrations</h3>
              <span className="text-xs text-[#A5ABAA]">{bookings.length} confirmed bookings</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#2A2827] text-white text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">KNUST ID</th>
                    <th className="py-3 px-4">Program & Level</th>
                    <th className="py-3 px-4">Room & Space</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7D6E66]/40">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#5B514B]/40">
                      <td className="py-3 px-4 font-mono font-bold text-[#FEFB58]">{b.bookingReference}</td>
                      <td className="py-3 px-4 font-bold text-white">{b.studentName}</td>
                      <td className="py-3 px-4 font-mono text-[#A5ABAA]">{b.studentKnustId}</td>
                      <td className="py-3 px-4 text-[#A5ABAA]">{b.program} ({b.level})</td>
                      <td className="py-3 px-4 font-bold text-white">Room {b.roomNumber} (Space #{b.spaceNumber})</td>
                      <td className="py-3 px-4 font-bold tabular-nums">GHS {b.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'Confirmed' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {b.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              if (confirm(`Cancel booking ${b.bookingReference} and free Space #${b.spaceNumber} in Room ${b.roomNumber}?`)) {
                                adminCancelBooking(b.id);
                              }
                            }}
                            className="px-2 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded text-xs"
                          >
                            Cancel
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

        {/* TAB 4: KNUST STUDENT ROSTER */}
        {activeAdminTab === 'students' && (
          <div className="bg-[#5B514B]/30 border border-[#7D6E66]/50 rounded-xl overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Confirmed Student Residents</h3>
            <p className="text-xs text-[#A5ABAA]">All students with verified bed spaces for the current academic session.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((b) => (
                <div key={b.id} className="p-4 bg-[#2A2827] rounded-xl border border-[#7D6E66]/40 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-white">{b.studentName}</span>
                    <span className="text-[10px] font-bold bg-[#FEFB58] text-[#2A2827] px-2 py-0.5 rounded">
                      Room {b.roomNumber}
                    </span>
                  </div>
                  <p className="text-[#A5ABAA]">KNUST ID: {b.studentKnustId}</p>
                  <p className="text-[#A5ABAA]">{b.program} · {b.level}</p>
                  <p className="text-[#A5ABAA]">{b.studentPhone} · {b.studentEmail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PAYMENTS */}
        {activeAdminTab === 'payments' && (
          <div className="bg-[#5B514B]/30 border border-[#7D6E66]/50 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-[#7D6E66]/40 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Paystack Financial Ledger</h3>
              <span className="text-xs text-emerald-400 font-bold">
                Total: GHS {analytics.totalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#2A2827] text-white text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Paystack Ref</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7D6E66]/40">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#5B514B]/40">
                      <td className="py-3 px-4 text-[#A5ABAA]">{p.date}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">{p.reference}</td>
                      <td className="py-3 px-4 font-semibold text-white">{p.studentName}</td>
                      <td className="py-3 px-4 text-[#A5ABAA]">{p.method}</td>
                      <td className="py-3 px-4 font-bold text-[#FEFB58] tabular-nums">
                        GHS {p.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: HOSTEL SETTINGS */}
        {activeAdminTab === 'settings' && (
          <div className="bg-[#5B514B]/30 border border-[#7D6E66]/50 rounded-xl p-6 max-w-2xl">
            <h3 className="font-bold text-base text-white mb-1">Hostel Operational Configuration</h3>
            <p className="text-xs text-[#A5ABAA] mb-6">Manage hostel contact details, academic session, and policies.</p>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A1927D] font-bold uppercase mb-1">Hostel Name</label>
                <input
                  type="text"
                  value={configForm.name}
                  onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                  className="w-full p-2.5 bg-[#2A2827] border border-[#7D6E66] rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-[#A1927D] font-bold uppercase mb-1">Physical Address</label>
                <input
                  type="text"
                  value={configForm.address}
                  onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                  className="w-full p-2.5 bg-[#2A2827] border border-[#7D6E66] rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1927D] font-bold uppercase mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={configForm.phone}
                    onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#2A2827] border border-[#7D6E66] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#A1927D] font-bold uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={configForm.email}
                    onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                    className="w-full p-2.5 bg-[#2A2827] border border-[#7D6E66] rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1927D] font-bold uppercase mb-1">Academic Session Period</label>
                <input
                  type="text"
                  value={configForm.academicYear}
                  onChange={(e) => setConfigForm({ ...configForm, academicYear: e.target.value })}
                  className="w-full p-2.5 bg-[#2A2827] border border-[#7D6E66] rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-[#A1927D] font-bold uppercase mb-1">Cancellation Policy</label>
                <textarea
                  rows={3}
                  value={configForm.cancellationPolicy}
                  onChange={(e) => setConfigForm({ ...configForm, cancellationPolicy: e.target.value })}
                  className="w-full p-2.5 bg-[#2A2827] border border-[#7D6E66] rounded-lg text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FEFB58] text-[#2A2827] font-bold rounded-lg hover:bg-[#fff945] cursor-pointer shadow-md"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

      </div>
    </section>
  );
};
