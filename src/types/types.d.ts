export type GroundCourt = {
  groundCourtId: string,
  courtName: string,
  pricePerHour: number,
  sportType: string,
  dimensions: string,
  surfaceType: string,
  playerCapacity: number,
  groundId: string,
  createdAt: string | Date
}

export type Ground = {
  groundId: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  groundRating: [],
  groundCourts: GroundCourt[]
  startTime: string | Date;
  endTime: string | Date;
  Amenities: string[];
  imageUrls: string[];
  createdAt: string | Date;
  distance: number;
}

export type FilterType = {
  searchQuery: string,
  location: {
    latitude: number,
    longitude: number
  };
  date: string;
  distance: number[];
  sports: string[];
}

// types/match.ts

export type SportType = 'football' | 'cricket' | 'badminton' | 'basketball' | 'tt' | 'volleyball'; // adjust based on your enum

export interface Ground {
  groundId: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
}


export interface User {
  userId: string;
  username: string;
  emailAddress: string;
  profileImageUrl: string;
  password: string;
  name: string;
  gender: string;
  dateOfBirth: Date;
  mobileNumber: string;
  address: string;
  city: string;
  createdAt: Date;
}

export interface Match {
  matchId?: string;
  name: string;
  description?: string;
  date: Date;
  sportType: SportType;
  noOfPlayers?: number;
  teamMembers?: User[];
  groundId: string;
  ground?: Ground;
  hostId: string;
  bookingId?: string;
  user?: User;
  createdAt?: Date;
  pendingRequests?: [...User, isHost: boolean];
  groundBookingDetails: {
    bookingId: string;
    duration: number;
    bookingCost: number;
    numberOfPlayers: number;
    dateForPlay: Date;
    startTime: Date;
    endTime: Date;
    courtId: string;
    groundId: string;
    matchId: string;
    bookBy: string;
    createdAt: Date;
  }
}

export type BookingType = {
  userId?: string,
  groundId: string,
  groundCourtId: string,
  date: string,
  startTime: string,
  endTime: string,
  duration: number,
  noOfPlayers: number,
  price: number
}


export interface NotificationInterface {
  id: string,
  match?: Match,
  user?: User,
  type: string,
  message: string,
  timestamp: Date,
  read: boolean
}

export interface UserSettings extends User {
  emailService: boolean;
  locationService: boolean;
  notificationService: boolean;
}