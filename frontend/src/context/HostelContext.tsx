'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  SpaceStatus,
} from '../types';
import { MUSHIA_IMAGES } from '../data/seedRooms';
import {
  getRooms,
  getMyBookings,
  holdSpace,
  releaseHold,
  initializePayment,
  verifyPayment,
  getUserProfile,
  logoutUser,
} from '../services/api';

type ActiveViewType =
  | 'home'
  | 'rooms'
  | 'floor-explorer'
  | 'facilities'
  | 'gallery'
  | 'location'
  | 'how-it-works'
  | 'roommates'
  | 'dashboard';

interface HostelContextType {
  rooms: Room[];
  bookings: Booking[];
  payments: PaymentTransaction[];
  currentStudent: StudentProfile;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  refreshRooms: () => Promise<void>;
  refreshUserAndBookings: () => Promise<void>;
  activeBookingHold: { roomId: string; spaceNumber: number; expiresAt: number } | null;
  roommateRequests: RoommateRequest[];
  notifications: AppNotification[];
  config: HostelConfig;
  activeView: ActiveViewType;
  selectedRoom: Room | null;
  selectedSpaceNumber: number | null;
  isBookingModalOpen: boolean;
  isReceiptModalOpen: boolean;
  activeReceiptBooking: Booking | null;

  // Actions
  setActiveView: (view: ActiveViewType) => void;
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
    skipBackendSync?: boolean;
  }) => Promise<Booking>;
  updateStudentPreferences: (prefs: RoommatePreferences) => void;
  sendRoommateRequest: (receiverId: string, receiverName: string, roomId: string, roomNumber: string) => void;
  respondToRoommateRequest: (requestId: string, status: 'accepted' | 'declined') => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  setCurrentStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
}

const DEFAULT_CONFIG: HostelConfig = {
  name: 'Mushia Hostel',
  address: 'FNF Junction, Ayeduase Newsite, Kumasi, Ghana',
  phone: '+233 24 589 1240 / +233 20 882 1993',
  email: 'reservations@mushiahostel.com',
  academicYear: '2026/2027 Academic Year',
  bankAccount: 'CalBank - KNUST Branch (Acct: 140003892019)',
  momoNumber: '0245891240 (Mushia Management Services)',
  cancellationPolicy:
    'Cancellations made within 14 days of booking receive an 85% refund. No refunds are issued after check-in week.',
};

const DEFAULT_STUDENT: StudentProfile = {
  id: '',
  name: '',
  firstName: '',
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
  if (cleaned.startsWith('1') || capacity === 1) return '1-in-1';
  if (cleaned.startsWith('2') || capacity === 2) return '2-in-1';
  if (cleaned.startsWith('3') || capacity === 3) return '3-in-1';
  return '4-in-1';
};

const getDefaultPrice = (type: RoomType, hasAc: boolean) => {
  if (type === '1-in-1') return hasAc ? 16500 : 14000;
  if (type === '2-in-1') return hasAc ? 7500 : 7000;
  if (type === '3-in-1') return hasAc ? 9500 : 8200;
  return hasAc ? 7800 : 6500;
};

export const mapBackendBookingToFrontend = (b: any): Booking => {
  const roomNumber = String(b.room_number || 'R101');
  const floor = normalizeFloor(b.floor || 'Ground');
  const roomType = normalizeRoomType(b.room_type || '2IN1', b.capacity || 2);
  const airConditioned = Boolean(b.air_conditioned);
  const size: RoomSize = b.room_size === 'Small' ? 'Small' : 'Standard';
  const spaceNum = Number(b.space_number || 1);
  const amount = parseFloat(b.amount_paid) || getDefaultPrice(roomType, airConditioned);
  const ref = b.paystack_reference || `MSH-${b.id}`;
  const isConfirmed = b.status === 'CONFIRMED';

  return {
    id: String(b.id),
    bookingReference: ref,
    studentId: String(b.student_knust_id || b.student || ''),
    studentName: b.student_name || b.student_knust_id || 'KNUST Student',
    studentEmail: b.student_email || '',
    studentPhone: b.student_phone || '',
    studentKnustId: b.student_knust_id || '',
    gender: b.student_gender === 'Female' ? 'Female' : 'Male',
    program: 'KNUST Student',
    level: '2026/2027 Session',
    roomId: `mushia-room-${roomNumber.toLowerCase()}`,
    roomNumber,
    floor,
    roomType,
    airConditioned,
    size,
    spaceNumber: spaceNum,
    amount,
    paymentMethod: 'Paystack Checkout',
    paymentReference: ref,
    status: isConfirmed ? 'Confirmed' : b.status === 'PENDING' ? 'Pending Payment' : 'Cancelled',
    paymentStatus: isConfirmed ? 'Paid' : 'Pending',
    createdAt: b.created_at || new Date().toISOString(),
    bookingPeriod: DEFAULT_CONFIG.academicYear,
  };
};

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveViewType>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedSpaceNumber, setSelectedSpaceNumber] = useState<number | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceiptBooking, setActiveReceiptBooking] = useState<Booking | null>(null);
  const [activeBookingHold, setActiveBookingHold] = useState<{
    roomId: string;
    spaceNumber: number;
    expiresAt: number;
  } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(DEFAULT_STUDENT);
  const [roommateRequests, setRoommateRequests] = useState<RoommateRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-welcome',
      title: 'Welcome to Mushia Hostel',
      message:
        'Explore 103 rooms across 6 floors at Ayeduase Newsite. Reserve your bed space and complete payment via Paystack to unlock your student portal and roommate directory.',
      timestamp: 'Live Portal',
      read: false,
      type: 'system',
    },
  ]);
  const [config] = useState<HostelConfig>(DEFAULT_CONFIG);

  // Purge any legacy Vite prototype mock keys from browser storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const legacyKeys = [
        'mushia_rooms',
        'mushia_rooms_v1',
        'mushia_rooms_v2',
        'mushia_rooms_v3',
        'mushia_rooms_v4',
        'mushia_bookings_v1',
        'mushia_payments_v1',
        'mushia_student_v1',
        'mushia_requests_v1',
        'mushia_notifs_v1',
        'mushia_config_v1',
      ];
      legacyKeys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore storage errors
    }
  }, []);

  const isLoggedIn = Boolean(
    currentStudent &&
      currentStudent.id &&
      currentStudent.id.trim() !== '' &&
      currentStudent.name &&
      currentStudent.name.trim() !== ''
  );

  // Load 103 rooms strictly from the live Django + Neon PostgreSQL database
  const refreshRooms = useCallback(async () => {
    try {
      const data = await getRooms();
      if (Array.isArray(data)) {
        const floorIndexMap: Record<string, number> = {
          Ground: 0,
          '1st': 1,
          '2nd': 2,
          '3rd': 3,
          '4th': 4,
          '5th': 5,
        };

        const mapped: Room[] = data.map((r: any) => {
          const floor = normalizeFloor(r.floor);
          const roomType = normalizeRoomType(r.room_type, r.capacity);
          const rawUpper = String(r.room_type || '').toUpperCase();
          const airConditioned = Boolean(
            r.amenities?.includes('AC') || rawUpper.includes('A/C') || rawUpper.includes('AC')
          );
          const isSmall = Boolean(r.amenities?.includes('Small') || rawUpper.includes('SMALL'));
          const size: RoomSize = isSmall ? 'Small' : 'Standard';
          const price =
            parseFloat(r.price_per_space) > 0
              ? parseFloat(r.price_per_space)
              : getDefaultPrice(roomType, airConditioned);

          const spaces: RoomSpace[] = (r.spaces || []).map((s: any, idx: number) => {
            const spaceStatus: SpaceStatus =
              s.status === 'paid'
                ? 'paid'
                : s.status === 'reserved'
                ? 'reserved'
                : s.is_available === false
                ? 'paid'
                : 'available';
            return {
              id: `${r.room_number}-space-${s.space_number || idx + 1}`,
              spaceNumber: s.space_number || idx + 1,
              status: spaceStatus,
            };
          });

          const isReserved = Boolean(rawUpper.includes('RESERVED') || r.amenities?.includes('Reserved'));
          const occupiedCount = spaces.filter((s) => s.status !== 'available').length;
          let status: RoomStatus = 'available';
          if (occupiedCount >= r.capacity || isReserved) {
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
      console.error('Failed to load rooms from Django backend:', err);
    }
  }, []);

  // Load authenticated student profile and their confirmed/pending bookings from PostgreSQL
  const refreshUserAndBookings = useCallback(async () => {
    try {
      const data = await getUserProfile();
      if (data && (data.user || data.id || data.username)) {
        const u = data.user || data;
        const fullName = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username;

        // Fetch bookings from PostgreSQL
        let myBookingsList: Booking[] = [];
        let myPaymentsList: PaymentTransaction[] = [];
        try {
          const rawBookings = await getMyBookings();
          if (Array.isArray(rawBookings)) {
            myBookingsList = rawBookings.map(mapBackendBookingToFrontend);
            myPaymentsList = myBookingsList
              .filter((b) => b.status === 'Confirmed')
              .map((b) => ({
                id: `tx-${b.id}`,
                bookingId: b.id,
                bookingReference: b.bookingReference,
                studentName: b.studentName,
                amount: b.amount,
                reference: b.paymentReference,
                method: 'Visa / Mastercard',
                status: 'Successful',
                date: new Date(b.createdAt).toLocaleString('en-GB', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }),
              }));
          }
        } catch {
          // ignore if no bookings
        }

        const confirmedBooking = myBookingsList.find((b) => b.status === 'Confirmed');
        const pendingBooking = myBookingsList.find((b) => b.status === 'Pending Payment');

        setBookings(myBookingsList);
        setPayments(myPaymentsList);

        setCurrentStudent((prev) => ({
          ...prev,
          id: String(u.id || u.username),
          name: fullName,
          firstName: u.first_name || fullName.split(' ')[0] || u.username,
          knustId: u.knustId || u.username || String(u.id),
          email: u.email || '',
          phone: u.phone || u.phone_number || '',
          gender: u.gender === 'Female' || u.gender === 'FEMALE' ? 'Female' : 'Male',
          program: prev.program || 'KNUST Student',
          level: prev.level || 'Level 100',
          hasPaid: Boolean(u.hasPaid || confirmedBooking),
          bookingId: confirmedBooking?.id || (u.bookingId ? String(u.bookingId) : undefined),
          roomId:
            confirmedBooking?.roomId ||
            (u.roomNumber ? `mushia-room-${String(u.roomNumber).toLowerCase()}` : undefined),
          roomNumber: confirmedBooking?.roomNumber || u.roomNumber || undefined,
          spaceNumber: confirmedBooking?.spaceNumber || u.spaceNumber || undefined,
        }));

        if (pendingBooking && !confirmedBooking) {
          setActiveBookingHold({
            roomId: pendingBooking.roomId,
            spaceNumber: pendingBooking.spaceNumber,
            expiresAt: Date.now() + 15 * 60 * 1000,
          });
        }
      }
    } catch {
      // Guest user (not authenticated)
      setCurrentStudent(DEFAULT_STUDENT);
      setBookings([]);
      setPayments([]);
    }
  }, []);

  useEffect(() => {
    refreshRooms();
    refreshUserAndBookings();
  }, [refreshRooms, refreshUserAndBookings]);

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
            message:
              'Your temporary 15-minute hold on the room space expired. The space is now available to other KNUST students.',
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

    const expiresAt = Date.now() + 15 * 60 * 1000;

    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.id !== roomId) return r;
        const updatedSpaces = r.spaces.map((s) =>
          s.spaceNumber === spaceNumber ? { ...s, status: 'reserved' as const, reservedUntil: expiresAt } : s
        );
        return { ...r, spaces: updatedSpaces };
      })
    );

    setActiveBookingHold({ roomId, spaceNumber, expiresAt });
    return true;
  };

  const releaseActiveHold = () => {
    if (!activeBookingHold) return;
    const { roomId, spaceNumber } = activeBookingHold;

    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.id !== roomId) return r;
        const updatedSpaces = r.spaces.map((s) =>
          s.spaceNumber === spaceNumber && s.status === 'reserved'
            ? { ...s, status: 'available' as const, reservedUntil: undefined }
            : s
        );
        return { ...r, spaces: updatedSpaces };
      })
    );

    setActiveBookingHold(null);
    if (isLoggedIn) {
      releaseHold()
        .then(() => refreshRooms())
        .catch(() => {});
    }
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
    skipBackendSync?: boolean;
  }): Promise<Booking> => {
    const verifyRes = await verifyPayment(params.paymentRef);
    await refreshRooms();
    await refreshUserAndBookings();

    const mapped = verifyRes?.booking
      ? mapBackendBookingToFrontend(verifyRes.booking)
      : bookings[0];

    setActiveBookingHold(null);
    return mapped;
  };

  // Automatically verify Paystack redirect callback (?reference=MSH-... or ?trxref=MSH-...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('trxref');
    if (!ref || !ref.startsWith('MSH-')) return;

    // Clean query params from URL immediately so we don't double-verify
    window.history.replaceState({}, '', window.location.pathname);

    const verifyFromCallback = async () => {
      try {
        const res = await verifyPayment(ref);
        localStorage.removeItem('mushia_pending_paystack');

        await refreshRooms();
        await refreshUserAndBookings();

        if (res?.booking) {
          const confirmed = mapBackendBookingToFrontend(res.booking);
          setNotifications((prev) => [
            {
              id: `notif-${Date.now()}`,
              title: 'Booking & Payment Confirmed 🎉',
              message: `Your space in Room ${confirmed.roomNumber} (Space #${confirmed.spaceNumber}) is officially confirmed in the Mushia database!`,
              timestamp: 'Just now',
              read: false,
              type: 'booking',
            },
            ...prev,
          ]);
          openReceiptModal(confirmed);
          setActiveView('dashboard');
        }
      } catch (err: any) {
        console.error('Paystack callback verification error:', err);
        setNotifications((prev) => [
          {
            id: `notif-err-${Date.now()}`,
            title: 'Payment Verification Notice',
            message:
              err?.response?.data?.detail ||
              'We could not automatically verify your Paystack transaction. Please check your dashboard or contact management.',
            timestamp: 'Just now',
            read: false,
            type: 'payment',
          },
          ...prev,
        ]);
      }
    };

    verifyFromCallback();
  }, [refreshRooms, refreshUserAndBookings]);

  const updateStudentPreferences = (prefs: RoommatePreferences) => {
    setCurrentStudent((prev) => ({
      ...prev,
      preferences: prefs,
    }));
  };

  const sendRoommateRequest = (
    receiverId: string,
    receiverName: string,
    roomId: string,
    roomNumber: string
  ) => {
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
  };

  const respondToRoommateRequest = (requestId: string, status: 'accepted' | 'declined') => {
    setRoommateRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Logout notice:', e);
    }
    setCurrentStudent(DEFAULT_STUDENT);
    setBookings([]);
    setPayments([]);
    setActiveBookingHold(null);
    setActiveView('home');
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
        refreshRooms,
        refreshUserAndBookings,
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
