
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Bell } from 'lucide-react';

type MedicineType = 'Capsule' | 'Tablet' | 'Drop' | 'Liquid' | 'Injection';

export type Medicine = {
  id: string;
  name: string;
  type: MedicineType;
  dose: string;
  amount: number;
  reminderTime: string;
  reminderDays: string[];
  taken: boolean;
};

type MedicineContextType = {
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id' | 'taken'>) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  markAsTaken: (id: string) => void;
  getTodayMedicines: () => Medicine[];
  getMedicineById: (id: string) => Medicine | undefined;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

export const useMedicine = () => {
  const context = useContext(MedicineContext);
  if (!context) {
    throw new Error('useMedicine must be used within a MedicineProvider');
  }
  return context;
};

export const MedicineProvider = ({ children }: { children: ReactNode }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  useEffect(() => {
    // Load medicines from localStorage on mount
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines) {
      setMedicines(JSON.parse(storedMedicines));
    } else {
      // Default sample medicines
      const defaultMedicines = [
        {
          id: '1',
          name: 'Vitamin D',
          type: 'Capsule' as MedicineType,
          dose: '1000mg',
          amount: 1,
          reminderTime: '07:00',
          reminderDays: ['Monday', 'Wednesday', 'Friday'],
          taken: false,
        },
        {
          id: '2',
          name: 'B12 Drops',
          type: 'Drop' as MedicineType,
          dose: '500mg',
          amount: 5,
          reminderTime: '06:13',
          reminderDays: ['Tuesday', 'Thursday'],
          taken: false,
        },
      ];
      
      setMedicines(defaultMedicines);
      localStorage.setItem('medicines', JSON.stringify(defaultMedicines));
    }
  }, []);

  // Save medicines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);

  // Check for medicine reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      // Skip if we already checked this minute
      if (currentTime === lastCheckTime) return;
      setLastCheckTime(currentTime);
      
      const today = now.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Find medicines that need to be taken right now
      const dueReminders = medicines.filter(medicine => 
        !medicine.taken && 
        medicine.reminderDays.includes(today) && 
        medicine.reminderTime === currentTime
      );
      
      // Show notification for each due medicine
      dueReminders.forEach(medicine => {
        toast(
          <div className="flex items-start">
            <Bell className="mr-2 h-5 w-5 text-app-blue" />
            <div>
              <div className="font-medium">Medicine Reminder</div>
              <div className="text-sm text-app-dark-gray">
                Time to take {medicine.amount} {medicine.type}{medicine.amount > 1 ? 's' : ''} of {medicine.name}
              </div>
            </div>
          </div>,
          {
            duration: 10000,
            action: {
              label: "Take now",
              onClick: () => markAsTaken(medicine.id),
            },
          }
        );
      });
    };

    // Run the check immediately when component mounts
    checkReminders();
    
    // Set interval to run every 30 seconds
    const intervalId = setInterval(checkReminders, 30000);
    
    return () => clearInterval(intervalId);
  }, [medicines, lastCheckTime]);

  const addMedicine = (medicine: Omit<Medicine, 'id' | 'taken'>) => {
    const newMedicine = {
      ...medicine,
      id: Date.now().toString(),
      taken: false,
    };
    
    setMedicines(prev => [...prev, newMedicine]);
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setMedicines(prev => 
      prev.map(medicine => 
        medicine.id === id ? { ...medicine, ...updates } : medicine
      )
    );
  };

  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(medicine => medicine.id !== id));
  };

  const markAsTaken = (id: string) => {
    setMedicines(prev => 
      prev.map(medicine => 
        medicine.id === id ? { ...medicine, taken: true } : medicine
      )
    );
    
    // Show confirmation toast
    const medicine = medicines.find(m => m.id === id);
    if (medicine) {
      toast(
        <div className="flex items-start">
          <AlertCircle className="mr-2 h-5 w-5 text-green-500" />
          <div>
            <div className="font-medium">Medicine Taken</div>
            <div className="text-sm text-app-dark-gray">
              You've taken your {medicine.name} for today
            </div>
          </div>
        </div>,
        { duration: 3000 }
      );
    }
  };

  const getTodayMedicines = () => {
    const today = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    return medicines.filter(medicine => medicine.reminderDays.includes(today));
  };

  const getMedicineById = (id: string) => {
    return medicines.find(medicine => medicine.id === id);
  };

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        markAsTaken,
        getTodayMedicines,
        getMedicineById,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};
