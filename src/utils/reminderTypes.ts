
export type MedicineType = 'Capsule' | 'Tablet' | 'Drop' | 'Liquid' | 'Injection';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Night';

export type Medicine = {
  id: string;
  name: string;
  type: MedicineType;
  dose: string;
  amount: number;
  reminderTime: string;
  reminderDays: string[];
  // New field for time of day
  timeOfDay?: TimeOfDay[];
  taken: boolean;
  // Add inventory tracking
  inventory: {
    current: number;
    threshold: number;
  };
  // New field for tracking pills by date
  pillCountsByDate?: Record<string, number>;
  // New field for initial pill count (total pills for the course)
  initialPillCount?: number;
};

export type Appointment = {
  id: string;
  doctorName: string;
  specialization: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  notes: string;
  notified: boolean;
};
