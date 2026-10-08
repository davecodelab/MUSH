export type RoomType = '4-in-1' | '3-in-1' | '2-in-1' | '1-in-1';
export type RoomSize = 'Small' | 'Big';
export type Floor = 'Ground' | '1st' | '2nd' | '3rd' | '4th' | '5th';

export type SpaceStatus = 'available' | 'reserved' | 'paid';
export type RoomStatus = 'available' | 'partially_occupied' | 'fully_occupied' | 'maintenance' | 'reserved';

export interface RoomSpace {
  id: string;
  spaceNumber: number;
  status: SpaceStatus;
  studentId?: string;
  studentName?: string;
  studentKnustId?: string;
  studentProgram?: string;
  studentLevel?: string;
  gender?: 'Male' | 'Female';
  reservedUntil?: number; // timestamp for countdown
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: Floor;
  floorIndex: number;
  roomType: RoomType;
  capacity: number;
  size: RoomSize;
  airConditioned: boolean;
  price: number;
  status: RoomStatus;
  spaces: RoomSpace[];
  images: string[];
  features: string[];
  description?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  knustId: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  program: string;
  level: string;
  avatar?: string;
  hasPaid: boolean;
  bookingId?: string;
  roomId?: string;
  roomNumber?: string;
  spaceNumber?: number;
  preferences?: RoommatePreferences;
}

export interface RoommatePreferences {
  sleepPreference: 'Early sleeper' | 'Late sleeper' | 'Flexible';
  studyPreference: 'Quiet' | 'Occasional discussion' | 'Social';
  cleanliness: 'Very tidy' | 'Moderately tidy' | 'Flexible';
  socialPreference: 'Private' | 'Balanced' | 'Social';
  smokingPreference: 'Non-smoker' | 'Smoker';
  interests: string[];
}

export interface RoommateRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderProgram: string;
  senderLevel: string;
  senderGender: 'Male' | 'Female';
  receiverId: string;
  receiverName: string;
  roomId: string;
  roomNumber: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentKnustId: string;
  gender: 'Male' | 'Female';
  program: string;
  level: string;
  roomId: string;
  roomNumber: string;
  floor: Floor;
  roomType: RoomType;
  airConditioned: boolean;
  size: RoomSize;
  spaceNumber: number;
  amount: number;
  paymentMethod: string;
  paymentReference: string;
  status: 'Reserved' | 'Pending Payment' | 'Paid' | 'Confirmed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  createdAt: string;
  bookingPeriod: string;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  bookingReference: string;
  studentName: string;
  amount: number;
  reference: string;
  method: 'MTN Mobile Money' | 'Telecel Cash' | 'AirtelTigo Money' | 'Visa / Mastercard';
  status: 'Successful' | 'Pending' | 'Failed';
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'payment' | 'roommate' | 'booking' | 'system';
}

export interface HostelConfig {
  name: string;
  address: string;
  phone: string;
  email: string;
  academicYear: string;
  bankAccount: string;
  momoNumber: string;
  cancellationPolicy: string;
}
