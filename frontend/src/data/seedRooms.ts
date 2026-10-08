import { Room, Floor, RoomType, RoomSize, RoomSpace, RoomStatus, SpaceStatus } from '../types';

// Real generated asset paths
export const MUSHIA_IMAGES = {
  exterior: '/images/mushia_hostel_exterior_1791228260570.jpg',
  interior: '/images/mushia_room_interior_1791228272788.jpg',
  studyRoom: '/images/mushia_study_room_1791228283513.jpg',
  lounge: '/images/mushia_tv_common_lounge_1791228293201.jpg',
};

const SAMPLE_STUDENTS = [
  { name: 'Kwame Mensah', id: '20814522', program: 'BSc Computer Engineering', level: 'Level 200', gender: 'Male' as const },
  { name: 'Ama Osei-Bonsu', id: '20819431', program: 'BSc Business Administration', level: 'Level 300', gender: 'Female' as const },
  { name: 'Kofi Boateng', id: '20793214', program: 'BSc Civil Engineering', level: 'Level 200', gender: 'Male' as const },
  { name: 'Akosua Frimpong', id: '20841203', program: 'Doctor of Pharmacy', level: 'Level 400', gender: 'Female' as const },
  { name: 'Emmanuel Darko', id: '20827756', program: 'BSc Mechanical Engineering', level: 'Level 100', gender: 'Male' as const },
  { name: 'Esi Annan', id: '20803341', program: 'BSc Nursing', level: 'Level 200', gender: 'Female' as const },
  { name: 'Yaw Antwi', id: '20786542', program: 'BSc Electrical Engineering', level: 'Level 300', gender: 'Male' as const },
  { name: 'Priscilla Addo', id: '20854321', program: 'BSc Architecture', level: 'Level 200', gender: 'Female' as const },
  { name: 'Nana Kwabena', id: '20839812', program: 'BSc Telecommunication Eng', level: 'Level 200', gender: 'Male' as const },
  { name: 'Abena Serwaa', id: '20811904', program: 'BSc Medical Laboratory Tech', level: 'Level 300', gender: 'Female' as const },
  { name: 'Michael Owusu', id: '20775432', program: 'BSc Chemical Engineering', level: 'Level 400', gender: 'Male' as const },
  { name: 'Gladys Baah', id: '20834190', program: 'BSc Accounting', level: 'Level 200', gender: 'Female' as const },
];

export function generate120Rooms(): Room[] {
  const floors: { floor: Floor; index: number; prefix: string }[] = [
    { floor: 'Ground', index: 0, prefix: 'G' },
    { floor: '1st', index: 1, prefix: '1' },
    { floor: '2nd', index: 2, prefix: '2' },
    { floor: '3rd', index: 3, prefix: '3' },
    { floor: '4th', index: 4, prefix: '4' },
    { floor: '5th', index: 5, prefix: '5' },
  ];

  const rooms: Room[] = [];
  let studentIdx = 0;

  floors.forEach((f) => {
    for (let r = 1; r <= 20; r++) {
      const roomNumStr = f.prefix === 'G' 
        ? `G${r < 10 ? '0' + r : r}` 
        : `${f.prefix}${r < 10 ? '0' + r : r}`;

      // Distribute room types across the 20 rooms per floor:
      // Rooms 1-7: 4-in-1 (35%)
      // Rooms 8-12: 3-in-1 (25%)
      // Rooms 13-17: 2-in-1 (25%)
      // Rooms 18-20: 1-in-1 (15%)
      let roomType: RoomType = '4-in-1';
      let capacity = 4;
      if (r >= 8 && r <= 12) {
        roomType = '3-in-1';
        capacity = 3;
      } else if (r >= 13 && r <= 17) {
        roomType = '2-in-1';
        capacity = 2;
      } else if (r >= 18) {
        roomType = '1-in-1';
        capacity = 1;
      }

      // AC alternates: even rooms on upper floors, select on lower
      const airConditioned = (r % 2 === 0) || (f.index >= 3 && r % 3 === 0);
      const size: RoomSize = (r % 3 === 0 || r === 5 || r === 12) ? 'Big' : 'Small';

      // Base pricing calculation
      let basePrice = 6500;
      if (roomType === '4-in-1') basePrice = airConditioned ? 7800 : 6500;
      else if (roomType === '3-in-1') basePrice = airConditioned ? 9500 : 8200;
      else if (roomType === '2-in-1') basePrice = airConditioned ? 12500 : 10800;
      else if (roomType === '1-in-1') basePrice = airConditioned ? 16500 : 14000;

      if (size === 'Big') basePrice += 400;

      // Maintenance simulation for 2 specific rooms
      const isMaintenance = (f.index === 1 && r === 20) || (f.index === 4 && r === 19);

      // Pre-seed occupancy logic
      // Give varied occupancy: some available, some partially occupied, a few fully occupied
      const spaces: RoomSpace[] = [];
      let occupiedCount = 0;

      for (let s = 1; s <= capacity; s++) {
        let spaceStatus: SpaceStatus = 'available';
        let student: (typeof SAMPLE_STUDENTS)[0] | undefined = undefined;

        if (!isMaintenance) {
          // Pre-populate about 40% of spaces to give active hostel life
          const shouldOccupy = ((f.index * 20 + r * 3 + s) % 5 === 0) || (r === 5 && s <= 2) || (r === 9 && s === 1);
          if (shouldOccupy && occupiedCount < capacity - (r === 1 ? 0 : 1)) {
            spaceStatus = 'paid';
            student = SAMPLE_STUDENTS[studentIdx % SAMPLE_STUDENTS.length];
            studentIdx++;
            occupiedCount++;
          }
        }

        spaces.push({
          id: `${roomNumStr}-space-${s}`,
          spaceNumber: s,
          status: spaceStatus,
          studentId: student ? student.id : undefined,
          studentName: student ? student.name : undefined,
          studentKnustId: student ? student.id : undefined,
          studentProgram: student ? student.program : undefined,
          studentLevel: student ? student.level : undefined,
          gender: student ? student.gender : undefined,
        });
      }

      let status: RoomStatus = 'available';
      if (isMaintenance) {
        status = 'maintenance';
      } else if (occupiedCount === capacity) {
        status = 'fully_occupied';
      } else if (occupiedCount > 0) {
        status = 'partially_occupied';
      }

      const features = [
        airConditioned ? 'Split-Unit Air Conditioning' : 'High-Velocity Ceiling Fan',
        'Built-in Wooden Wardrobe',
        'Study Desk & Ergonomic Chair',
        'En-suite Modern Washroom',
        '24/7 Water & Standby Generator Power',
        'High-Speed Wi-Fi Connectivity',
      ];
      if (size === 'Big') {
        features.push('Spacious Floor Plan & Private Balcony Access');
      }

      rooms.push({
        id: `mushia-room-${roomNumStr.toLowerCase()}`,
        roomNumber: roomNumStr,
        floor: f.floor,
        floorIndex: f.index,
        roomType,
        capacity,
        size,
        airConditioned,
        price: basePrice,
        status,
        spaces,
        images: [
          MUSHIA_IMAGES.interior,
          MUSHIA_IMAGES.exterior,
          MUSHIA_IMAGES.studyRoom,
          MUSHIA_IMAGES.lounge,
        ],
        features,
        description: `Premium ${roomType} accommodation located on the ${f.floor} Floor of Mushia Hostel. Features ${size.toLowerCase()} room dimensions, ${airConditioned ? 'refrigerated air conditioning' : 'enhanced natural ventilation'}, study station, and high security.`,
      });
    }
  });

  return rooms;
}
