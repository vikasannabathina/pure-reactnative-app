
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
