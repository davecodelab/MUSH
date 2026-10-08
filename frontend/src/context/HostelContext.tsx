'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Room, 
  RoomSpace, 
  Booking, 
  PaymentTransaction, 
  StudentProfile, 
  RoommateRequest, 
  RoommatePreferences, 
  AppNotification,
  HostelConfig,
  Floor,
  RoomType,
  RoomSize,
  RoomStatus,
  SpaceStatus
} from '../types';
import { generateSeedRooms, generate120Rooms, MUSHIA_IMAGES } from '../data/seedRooms';
import { getRooms, holdSpace, releaseHold, initializePayment, verifyPayment, getUserProfile, logoutUser } from '../services/api';

interface HostelContextType {
  rooms: Room[];
  bookings: Booking[];
  payments: PaymentTransaction[];
  currentStudent: StudentProfile;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  activeBookingHold: { roomId: string; spaceNumber: number; expiresAt: number } | null;
  roommateRequests: RoommateRequest[];
  notifications: AppNotification[];
  config: HostelConfig;
  activeView: 'home' | 'rooms' | 'floor-explorer' | 'facilities' | 'gallery'  | 'location' | 'how-it-works' | 'roommates' | 'dashboard' | 'admin';
  selectedRoom: Room | null;
  selectedSpaceNumber: number | null;
  isBookingModalOpen: boolean;
  isReceiptModalOpen: boolean;
  activeReceiptBooking: Booking | null;

  // Actions
  setActiveView: (view: 'home' | 'rooms' | 'floor-explorer' | 'facilities' | 'gallery' | 'location' | 'how-it-works' | 'roommates' | 'dashboard' | 'admin') => void;
  openRoomDetails: (room: Room, spaceNum?: number) => void;
  closeRoomDetails: () => void;
  startBookingFlow: (room: Room, spaceNum: number) => void;
  closeBookingModal: () => void;
  openReceiptModal: (booking: Booking) => void;
  closeReceiptModal: () => void;
  lockSpaceTemporarily: (roomId: string, spaceNumber: number) => boolean;
  releaseActiveHold: () => void;
  completePaymentAndBooking: (params: {
    student: {
      name: string;
      knustId: string;
      email: string;
      phone: string;
      gender: 'Male' | 'Female';
      program: string;
      level: string;
    };
    paymentMethod: 'MTN Mobile Money' | 'Telecel Cash' | 'AirtelTigo Money' | 'Visa / Mastercard';
    paymentRef: string;
  }) => Promise<Booking>;
  updateStudentPreferences: (prefs: RoommatePreferences) => void;
  sendRoommateRequest: (receiverId: string, receiverName: string, roomId: string, roomNumber: string) => void;
  respondToRoommateRequest: (requestId: string, status: 'accepted' | 'declined') => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Admin Actions
  adminUpdateRoom: (roomId: string, updates: Partial<Room>) => void;
  adminToggleMaintenance: (roomId: string) => void;
  adminCancelBooking: (bookingId: string) => void;
  adminUpdateConfig: (newConfig: Partial<HostelConfig>) => void;
  resetAllData: () => void;
  switchUserRole: (role: 'guest' | 'paid_student' | 'admin') => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  setCurrentStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
}

const STORAGE_KEYS = {
  ROOMS: 'mushia_rooms_v2',
  BOOKINGS: 'mushia_bookings_v1',
  PAYMENTS: 'mushia_payments_v1',
  STUDENT: 'mushia_student_v1',
  REQUESTS: 'mushia_requests_v1',
  NOTIFS: 'mushia_notifs_v1',
  CONFIG: 'mushia_config_v1',
};

const safeGetStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const DEFAULT_CONFIG: HostelConfig = {
  name: 'Mushia Hostel',
  address: 'FNF Junction, Ayeduase Newsite, Kumasi, Ghana',
  phone: '+233 24 589 1240 / +233 20 882 1993',
  email: 'reservations@mushiahostel.com',
  academicYear: '2026/2027 Academic Year',
  bankAccount: 'CalBank - KNUST Branch (Acct: 140003892019)',
  momoNumber: '0245891240 (Mushia Management Services)',
  cancellationPolicy: 'Cancellations made within 14 days of booking receive an 85% refund. No refunds are issued after check-in week.',
};

const DEFAULT_STUDENT: StudentProfile = {
  id: '',
  name: '',
  knustId: '',
  email: '',
  phone: '',
  gender: 'Male',
  program: 'Undergraduate Student',
  level: 'Level 100',
  hasPaid: false,
  preferences: {
    sleepPreference: 'Flexible',
    studyPreference: 'Quiet',
    cleanliness: 'Very tidy',
    socialPreference: 'Balanced',
    smokingPreference: 'Non-smoker',
    interests: ['Tech', 'Coding', 'Football', 'Gaming', 'Music'],
  },
};

const normalizeFloor = (f: string): Floor => {
  const upper = (f || '').toUpperCase();
  if (upper.includes('GROUND')) return 'Ground';
  if (upper.includes('FIRST') || upper.includes('1')) return '1st';
  if (upper.includes('SECOND') || upper.includes('2')) return '2nd';
  if (upper.includes('THIRD') || upper.includes('3')) return '3rd';
  if (upper.includes('FOURTH') || upper.includes('4')) return '4th';
  if (upper.includes('FIFTH') || upper.includes('5')) return '5th';
  return 'Ground';
};

const normalizeRoomType = (t: string, capacity: number): RoomType => {
  const cleaned = (t || '').replace(/[^0-9]/g, '');
  if (cleaned === '1' || capacity === 1) return '1-in-1';
  if (cleaned === '2' || capacity === 2) return '2-in-1';
  if (cleaned === '3' || capacity === 3) return '3-in-1';
  return '4-in-1';
};

const getDefaultPrice = (type: RoomType, hasAc: boolean) => {
  if (type === '1-in-1') return hasAc ? 16500 : 14000;
  if (type === '2-in-1') return hasAc ? 12500 : 10800;
  if (type === '3-in-1') return hasAc ? 9500 : 8200;
  return hasAc ? 7800 : 6500;
};

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Modal states
  const [activeView, setActiveView] = useState<'home' | 'rooms' | 'floor-explorer' | 'facilities' | 'gallery' | 'location' | 'how-it-works' | 'roommates' | 'dashboard' | 'admin'>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedSpaceNumber, setSelectedSpaceNumber] = useState<number | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceiptBooking, setActiveReceiptBooking] = useState<Booking | null>(null);
  const [activeBookingHold, setActiveBookingHold] = useState<{ roomId: string; spaceNumber: number; expiresAt: number } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize Persistent State with exact 103 Excel rooms
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = safeGetStorage(STORAGE_KEYS.ROOMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 103) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return generateSeedRooms();
  });

  // Fetch live rooms from Django backend (MUSHIA database)
  useEffect(() => {
    const fetchLiveRooms = async () => {
      try {
        const data = await getRooms();
        if (Array.isArray(data) && data.length > 0) {
          const floorIndexMap: Record<string, number> = {
            'Ground': 0, '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5
          };

          const mapped: Room[] = data.map((r: any) => {
            const floor = normalizeFloor(r.floor);
            const roomType = normalizeRoomType(r.room_type, r.capacity);
            const airConditioned = Boolean(
              r.amenities?.includes('AC') || (r.room_type && r.room_type.includes('AC'))
            );
            const isLarge = Boolean(
              r.amenities?.includes('Big') || (r.room_type && r.room_type.includes('LARGE')) || r.capacity >= 3
            );
            const size: RoomSize = isLarge ? 'Big' : 'Small';
            const price = parseFloat(r.price_per_space) > 0 ? parseFloat(r.price_per_space) : getDefaultPrice(roomType, airConditioned);
            
            const spaces: RoomSpace[] = (r.spaces || []).map((s: any, idx: number) => ({
              id: `${r.room_number}-space-${idx + 1}`,
              spaceNumber: idx + 1,
              status: s.is_available ? 'available' : 'paid',
            }));

            const isReserved = Boolean(r.room_type?.includes('RESERVED') || r.amenities?.includes('Reserved'));
            const occupiedCount = spaces.filter(s => s.status === 'paid').length;
            let status: RoomStatus = 'available';
            if (occupiedCount === r.capacity || isReserved) {
              status = 'fully_occupied';
            } else if (occupiedCount > 0) {
              status = 'partially_occupied';
            }

            return {
              id: `mushia-room-${String(r.room_number).toLowerCase()}`,
              roomNumber: String(r.room_number),
              floor,
              floorIndex: floorIndexMap[floor] ?? 0,
              roomType,
              capacity: r.capacity,
              size,
              airConditioned,
              price,
              status,
              spaces,
              images: [
                MUSHIA_IMAGES.interior,
                MUSHIA_IMAGES.exterior,
                MUSHIA_IMAGES.studyRoom,
                MUSHIA_IMAGES.lounge,
              ],
              features: [
                airConditioned ? 'Split-Unit Air Conditioning' : 'High-Velocity Ceiling Fan',
                'Built-in Wooden Wardrobe',
                'Study Desk & Ergonomic Chair',
                'En-suite Modern Washroom',
                '24/7 Water & Standby Generator Power',
                'High-Speed Wi-Fi Connectivity',
              ],
              description: `Comfortable ${roomType} accommodation located on the ${floor} Floor of Mushia Hostel. Features en-suite modern washroom, study desks, and 24/7 power backup.`,
            };
          });

          setRooms(mapped);
        }
      } catch (err) {
        console.warn('Could not load rooms from Django backend, using default inventory:', err);
      }
    };

    fetchLiveRooms();
  }, []);

  // Check authenticated session on load from Django backend
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getUserProfile();
        if (data && (data.user || data.id || data.email)) {
          const u = data.user || data;
          setCurrentStudent({
            id: String(u.id || u.username),
            name: u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username,
            knustId: u.knustId || u.username || String(u.id),
            email: u.email || '',
            phone: u.phone || u.phone_number || '',
            gender: u.gender === 'Female' || u.gender === 'FEMALE' ? 'Female' : 'Male',
            program: u.program_of_study || 'Undergraduate Student',
            level: u.year_of_study ? `Level ${u.year_of_study}00` : 'Level 100',
            hasPaid: Boolean(u.hasPaid),
            bookingId: u.bookingId,
            roomId: u.roomId,
            roomNumber: u.roomNumber,
            spaceNumber: u.spaceNumber,
          });
        }
      } catch (e) {
        // Guest session
      }
    };
    checkAuth();
  }, []);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = safeGetStorage(STORAGE_KEYS.BOOKINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = safeGetStorage(STORAGE_KEYS.PAYMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    try {
      const saved = safeGetStorage(STORAGE_KEYS.STUDENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id === '20814522' && parsed.name === 'Dave Frimpong' && !parsed.hasPaid) {
          return DEFAULT_STUDENT;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STUDENT;
  });

  const isLoggedIn = Boolean(
    currentStudent &&
    currentStudent.id &&
    currentStudent.id.trim() !== '' &&
    currentStudent.id !== '20814522' &&
    currentStudent.name &&
    currentStudent.name.trim() !== '' &&
    currentStudent.name !== 'Guest Student' &&
    currentStudent.name !== 'Guest'
  );

  const [roommateRequests, setRoommateRequests] = useState<RoommateRequest[]>(() => {
    try {
      const saved = safeGetStorage(STORAGE_KEYS.REQUESTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = safeGetStorage(STORAGE_KEYS.NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'notif-1',
        title: 'Welcome to Mushia Hostel',
        message: 'Explore 103 rooms across 6 floors at Ayeduase Newsite. Lock your space and complete payment via Paystack to unlock roommate matching.',
        timestamp: 'Just now',
        read: false,
        type: 'system',
      }
    ];
  });

  const [config, setConfig] = useState<HostelConfig>(() => {
    try {
      const saved = safeGetStorage(STORAGE_KEYS.CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CONFIG;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    } catch (e) {
      console.error(e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (e) {
      console.error(e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(currentStudent));
    } catch (e) {
      console.error(e);
    }
  }, [currentStudent]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(roommateRequests));
    } catch (e) {
      console.error(e);
    }
  }, [roommateRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  // Hold Timer Expired Checker
  useEffect(() => {
    if (!activeBookingHold) return;
    const interval = setInterval(() => {
      if (Date.now() > activeBookingHold.expiresAt) {
        releaseActiveHold();
        setNotifications((prev) => [
          {
            id: 'notif-' + Date.now(),
            title: 'Reservation Hold Expired',
            message: `Your temporary 10-minute hold on Room space expired. Space is now available to other KNUST students.`,
            timestamp: 'Just now',
            read: false,
            type: 'system',
          },
          ...prev,
        ]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeBookingHold]);

  const openRoomDetails = (room: Room, spaceNum?: number) => {
    setSelectedRoom(room);
    if (spaceNum) {
      setSelectedSpaceNumber(spaceNum);
    } else {
      const firstAvailable = room.spaces.find((s) => s.status === 'available');
      setSelectedSpaceNumber(firstAvailable ? firstAvailable.spaceNumber : 1);
    }
  };

  const closeRoomDetails = () => {
    setSelectedRoom(null);
    setSelectedSpaceNumber(null);
  };

  const lockSpaceTemporarily = (roomId: string, spaceNumber: number): boolean => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return false;
    const space = room.spaces.find((s) => s.spaceNumber === spaceNumber);
    if (!space || space.status === 'paid') return false;

    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes lock

    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.id !== roomId) return r;
        const updatedSpaces = r.spaces.map((s) => {
          if (s.spaceNumber === spaceNumber) {
            return { ...s, status: 'reserved' as const, reservedUntil: expiresAt };
          }
          return s;
        });
        return { ...r, spaces: updatedSpaces };
      })
    );

    setActiveBookingHold({ roomId, spaceNumber, expiresAt });
    // Also notify Django backend of the hold
    holdSpace({ room_number: room.roomNumber, space_number: spaceNumber }).catch((e) => {
      console.warn("Backend hold notification:", e?.response?.data?.detail || e.message);
    });
    return true;
  };

  const releaseActiveHold = () => {
    if (!activeBookingHold) return;
    const { roomId, spaceNumber } = activeBookingHold;

    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.id !== roomId) return r;
        const updatedSpaces = r.spaces.map((s) => {
          if (s.spaceNumber === spaceNumber && s.status === 'reserved') {
            return { ...s, status: 'available' as const, reservedUntil: undefined };
          }
          return s;
        });
        return { ...r, spaces: updatedSpaces };
      })
    );

    setActiveBookingHold(null);
    // Release hold in Django backend
    releaseHold().catch((e) => {
      console.warn("Backend release hold notification:", e?.response?.data?.detail || e.message);
    });
  };

  const startBookingFlow = (room: Room, spaceNum: number) => {
    setSelectedRoom(room);
    setSelectedSpaceNumber(spaceNum);
    lockSpaceTemporarily(room.id, spaceNum);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const openReceiptModal = (booking: Booking) => {
    setActiveReceiptBooking(booking);
    setIsReceiptModalOpen(true);
  };

  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setActiveReceiptBooking(null);
  };

  const completePaymentAndBooking = async (params: {
    student: {
      name: string;
      knustId: string;
      email: string;
      phone: string;
      gender: 'Male' | 'Female';
      program: string;
      level: string;
    };
    paymentMethod: 'MTN Mobile Money' | 'Telecel Cash' | 'AirtelTigo Money' | 'Visa / Mastercard';
    paymentRef: string;
  }): Promise<Booking> => {
    if (!selectedRoom || selectedSpaceNumber === null) {
      throw new Error('No room or space selected for booking.');
    }

    const roomId = selectedRoom.id;
    const roomNumber = selectedRoom.roomNumber;
    const spaceNum = selectedSpaceNumber;
    const amount = selectedRoom.price;

    const bookingRef = `MSH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const bookingId = `booking-${Date.now()}`;

    const newBooking: Booking = {
      id: bookingId,
      bookingReference: bookingRef,
      studentId: params.student.knustId,
      studentName: params.student.name,
      studentEmail: params.student.email,
      studentPhone: params.student.phone,
      studentKnustId: params.student.knustId,
      gender: params.student.gender,
      program: params.student.program,
      level: params.student.level,
      roomId,
      roomNumber,
      floor: selectedRoom.floor,
      roomType: selectedRoom.roomType,
      airConditioned: selectedRoom.airConditioned,
      size: selectedRoom.size,
      spaceNumber: spaceNum,
      amount,
      paymentMethod: params.paymentMethod,
      paymentReference: params.paymentRef,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString(),
      bookingPeriod: config.academicYear,
    };

    const newPayment: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      bookingId,
      bookingReference: bookingRef,
      studentName: params.student.name,
      amount,
      reference: params.paymentRef,
      method: params.paymentMethod,
      status: 'Successful',
      date: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    // Update room spaces atomically
    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.id !== roomId) return r;
        const updatedSpaces = r.spaces.map((s) => {
          if (s.spaceNumber === spaceNum) {
            return {
              ...s,
              status: 'paid' as const,
              studentId: params.student.knustId,
              studentName: params.student.name,
              studentKnustId: params.student.knustId,
              studentProgram: params.student.program,
              studentLevel: params.student.level,
              gender: params.student.gender,
              reservedUntil: undefined,
            };
          }
          return s;
        });

        const occupiedCount = updatedSpaces.filter((s) => s.status === 'paid').length;
        let newStatus: Room['status'] = 'available';
        if (occupiedCount === r.capacity) {
          newStatus = 'fully_occupied';
        } else if (occupiedCount > 0) {
          newStatus = 'partially_occupied';
        }

        return { ...r, spaces: updatedSpaces, status: newStatus };
      })
    );

    // Update Student State to confirmed and paid
    const updatedStudent: StudentProfile = {
      ...currentStudent,
      name: params.student.name,
      knustId: params.student.knustId,
      email: params.student.email,
      phone: params.student.phone,
      gender: params.student.gender,
      program: params.student.program,
      level: params.student.level,
      hasPaid: true,
      bookingId,
      roomId,
      roomNumber,
      spaceNumber: spaceNum,
    };

    setCurrentStudent(updatedStudent);
    setBookings((prev) => [newBooking, ...prev]);
    setPayments((prev) => [newPayment, ...prev]);
    setActiveBookingHold(null);

    // Synchronize booking with Django database
    try {
      const holdRes = await holdSpace({ room_number: roomNumber, space_number: spaceNum });
      const bId = holdRes?.booking?.id;
      if (bId) {
        const initRes = await initializePayment(bId);
        const refToVerify = initRes?.reference || params.paymentRef;
        await verifyPayment(refToVerify);
      }
    } catch (err: any) {
      console.warn("Django backend payment synchronization notice:", err?.response?.data?.detail || err.message);
    }

    // Add confirmation notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Booking & Payment Confirmed 🎉',
        message: `Your space in Room ${roomNumber} (Space #${spaceNum}) is officially confirmed! Roommate matching is now unlocked for you.`,
        timestamp: 'Just now',
        read: false,
        type: 'booking',
      },
      ...prev,
    ]);

    return newBooking;
  };

  const updateStudentPreferences = (prefs: RoommatePreferences) => {
    setCurrentStudent((prev) => ({
      ...prev,
      preferences: prefs,
    }));
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Roommate Preferences Updated',
        message: 'Your lifestyle criteria and interests have been updated. Compatible roommate recommendations have refreshed.',
        timestamp: 'Just now',
        read: false,
        type: 'roommate',
      },
      ...prev,
    ]);
  };

  const sendRoommateRequest = (receiverId: string, receiverName: string, roomId: string, roomNumber: string) => {
    const newRequest: RoommateRequest = {
      id: `req-${Date.now()}`,
      senderId: currentStudent.knustId,
      senderName: currentStudent.name,
      senderProgram: currentStudent.program,
      senderLevel: currentStudent.level,
      senderGender: currentStudent.gender,
      receiverId,
      receiverName,
      roomId,
      roomNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      contactPhone: currentStudent.phone,
      contactEmail: currentStudent.email,
    };

    setRoommateRequests((prev) => [newRequest, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Roommate Request Sent',
        message: `You sent a roommate connection invitation to ${receiverName} for Room ${roomNumber}.`,
        timestamp: 'Just now',
        read: false,
        type: 'roommate',
      },
      ...prev,
    ]);
  };

  const respondToRoommateRequest = (requestId: string, status: 'accepted' | 'declined') => {
    setRoommateRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status,
            contactPhone: currentStudent.phone,
            contactEmail: currentStudent.email,
          };
        }
        return r;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: status === 'accepted' ? 'Roommate Connected 🎉' : 'Request Declined',
        message: status === 'accepted' 
          ? `You accepted the roommate invitation! Direct phone and email contact details are now exchanged.`
          : 'You declined the connection request.',
        timestamp: 'Just now',
        read: false,
        type: 'roommate',
      },
      ...prev,
    ]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Admin Actions
  const adminUpdateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        return { ...r, ...updates };
      })
    );
  };

  const adminToggleMaintenance = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const newStatus = r.status === 'maintenance' ? 'available' : 'maintenance';
        return { ...r, status: newStatus };
      })
    );
  };

  const adminCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // Free the room space
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== booking.roomId) return r;
        const updatedSpaces = r.spaces.map((s) => {
          if (s.spaceNumber === booking.spaceNumber) {
            return {
              ...s,
              status: 'available' as const,
              studentId: undefined,
              studentName: undefined,
              studentKnustId: undefined,
              studentProgram: undefined,
              studentLevel: undefined,
            };
          }
          return s;
        });
        const occupiedCount = updatedSpaces.filter((s) => s.status === 'paid').length;
        const newStatus = occupiedCount === 0 ? 'available' : 'partially_occupied';
        return { ...r, spaces: updatedSpaces, status: newStatus };
      })
    );

    // Update booking status
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b))
    );

    // If cancelled booking belongs to current active student, reset paid status
    if (currentStudent.bookingId === bookingId) {
      setCurrentStudent((prev) => ({
        ...prev,
        hasPaid: false,
        bookingId: undefined,
        roomId: undefined,
        roomNumber: undefined,
        spaceNumber: undefined,
      }));
    }
  };

  const adminUpdateConfig = (newConfig: Partial<HostelConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetAllData = () => {
    const initialRooms = generateSeedRooms();
    setRooms(initialRooms);
    setBookings([]);
    setPayments([]);
    setCurrentStudent(DEFAULT_STUDENT);
    setRoommateRequests([]);
    setNotifications([
      {
        id: 'notif-reset',
        title: 'System Restored',
        message: 'Hostel inventory synchronized with official 103 rooms from MUSHIA database.',
        timestamp: 'Just now',
        read: false,
        type: 'system',
      }
    ]);
    setActiveBookingHold(null);
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.STUDENT);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
  };

  const switchUserRole = (role: 'guest' | 'paid_student' | 'admin') => {
    if (role === 'guest') {
      setCurrentStudent({
        ...DEFAULT_STUDENT,
        hasPaid: false,
        bookingId: undefined,
        roomId: undefined,
        roomNumber: undefined,
        spaceNumber: undefined,
      });
      setActiveView('home');
    } else if (role === 'paid_student') {
      setCurrentStudent({
        ...DEFAULT_STUDENT,
        name: 'Dave Frimpong',
        knustId: '20814522',
        hasPaid: true,
        bookingId: 'booking-seed-1',
        roomId: 'mushia-room-305',
        roomNumber: '305',
        spaceNumber: 3,
      });
      setActiveView('dashboard');
    } else if (role === 'admin') {
      setActiveView('admin');
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Logout notice:', e);
    }
    setCurrentStudent(DEFAULT_STUDENT);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEYS.STUDENT);
      } catch {}
    }
    setActiveView('home');
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: 'Logged Out',
        message: 'You have been safely signed out.',
        timestamp: 'Just now',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  return (
    <HostelContext.Provider
      value={{
        rooms,
        bookings,
        payments,
        currentStudent,
        isLoggedIn,
        logout,
        activeBookingHold,
        roommateRequests,
        notifications,
        config,
        activeView,
        selectedRoom,
        selectedSpaceNumber,
        isBookingModalOpen,
        isReceiptModalOpen,
        activeReceiptBooking,
        setActiveView,
        openRoomDetails,
        closeRoomDetails,
        startBookingFlow,
        closeBookingModal,
        openReceiptModal,
        closeReceiptModal,
        lockSpaceTemporarily,
        releaseActiveHold,
        completePaymentAndBooking,
        updateStudentPreferences,
        sendRoommateRequest,
        respondToRoommateRequest,
        markNotificationAsRead,
        clearAllNotifications,
        adminUpdateRoom,
        adminToggleMaintenance,
        adminCancelBooking,
        adminUpdateConfig,
        resetAllData,
        switchUserRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        setCurrentStudent,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};
