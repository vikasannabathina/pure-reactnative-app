
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Bell, Calendar, PackageX } from 'lucide-react';
import { Medicine, Appointment, MedicineType } from '@/utils/reminderTypes';

type MedicineContextType = {
  medicines: Medicine[];
  appointments: Appointment[];
  addMedicine: (medicine: Omit<Medicine, 'id' | 'taken'>) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  markAsTaken: (id: string) => void;
  updateInventory: (id: string, amount: number) => void;
  getTodayMedicines: () => Medicine[];
  getMedicineById: (id: string) => Medicine | undefined;
  getLowInventoryMedicines: () => Medicine[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'notified'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getUpcomingAppointments: (days?: number) => Appointment[];
  getAppointmentById: (id: string) => Appointment | undefined;
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  useEffect(() => {
    // Load medicines from localStorage on mount
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines) {
      setMedicines(JSON.parse(storedMedicines));
    } else {
      // Default sample medicines with inventory
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
          inventory: {
            current: 15,
            threshold: 5
          }
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
          inventory: {
            current: 7,
            threshold: 10
          }
        },
      ];
      
      setMedicines(defaultMedicines);
      localStorage.setItem('medicines', JSON.stringify(defaultMedicines));
    }

    // Load appointments from localStorage on mount
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    } else {
      // Default sample appointment
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const defaultAppointments = [
        {
          id: '1',
          doctorName: 'Dr. Sarah Johnson',
          specialization: 'Cardiologist',
          date: tomorrow.toISOString().split('T')[0],
          time: '14:30',
          notes: 'Annual heart checkup',
          notified: false,
        },
      ];
      
      setAppointments(defaultAppointments);
      localStorage.setItem('appointments', JSON.stringify(defaultAppointments));
    }
  }, []);

  // Save medicines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Check for medicine reminders and low inventory every 30 seconds
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      // Skip if we already checked this time
      if (currentTime === lastCheckTime) return;
      setLastCheckTime(currentTime);
      
      const today = now.toLocaleDateString('en-US', { weekday: 'long' });
      const todayDateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      
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
      
      // Check for upcoming appointments (today)
      const todayAppointments = appointments.filter(
        appointment => 
          appointment.date === todayDateStr && 
          !appointment.notified
      );
      
      // Calculate appointment time in minutes
      todayAppointments.forEach(appointment => {
        const [hours, minutes] = appointment.time.split(':').map(Number);
        const appointmentTime = new Date();
        appointmentTime.setHours(hours, minutes, 0);
        
        // Notify 1 hour before the appointment
        const timeUntilAppointment = appointmentTime.getTime() - now.getTime();
        const oneHourInMs = 60 * 60 * 1000;
        
        if (timeUntilAppointment > 0 && timeUntilAppointment <= oneHourInMs) {
          toast(
            <div className="flex items-start">
              <Calendar className="mr-2 h-5 w-5 text-app-blue" />
              <div>
                <div className="font-medium">Appointment Reminder</div>
                <div className="text-sm text-app-dark-gray">
                  You have an appointment with {appointment.doctorName} at {appointment.time} today
                </div>
              </div>
            </div>,
            {
              duration: 15000,
            }
          );
          
          // Mark appointment as notified
          updateAppointment(appointment.id, { notified: true });
        }
      });
      
      // Check for low inventory medicines
      const lowInventory = medicines.filter(medicine => 
        medicine.inventory.current <= medicine.inventory.threshold &&
        medicine.inventory.current > 0 // Only alert if we still have some left
      );
      
      // Show notification for low inventory (once per day per medicine)
      lowInventory.forEach(medicine => {
        const lowInventoryKey = `lowInventory-${medicine.id}-${todayDateStr}`;
        const alreadyNotified = localStorage.getItem(lowInventoryKey);
        
        if (!alreadyNotified) {
          toast(
            <div className="flex items-start">
              <PackageX className="mr-2 h-5 w-5 text-yellow-500" />
              <div>
                <div className="font-medium">Inventory Alert</div>
                <div className="text-sm text-app-dark-gray">
                  Running low on {medicine.name}. Only {medicine.inventory.current} {medicine.type}{medicine.inventory.current > 1 ? 's' : ''} remaining.
                </div>
              </div>
            </div>,
            {
              duration: 8000,
            }
          );
          
          // Mark as notified for today
          localStorage.setItem(lowInventoryKey, 'true');
          
          // Clear this key after 1 day
          setTimeout(() => {
            localStorage.removeItem(lowInventoryKey);
          }, 24 * 60 * 60 * 1000);
        }
      });
    };

    // Run the check immediately when component mounts
    checkReminders();
    
    // Set interval to run every 30 seconds
    const intervalId = setInterval(checkReminders, 30000);
    
    return () => clearInterval(intervalId);
  }, [medicines, appointments, lastCheckTime]);

  const addMedicine = (medicine: Omit<Medicine, 'id' | 'taken'>) => {
    const newMedicine = {
      ...medicine,
      id: Date.now().toString(),
      taken: false,
      inventory: medicine.inventory || {
        current: 30, // Default 30 days supply
        threshold: 5
      }
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
    const medicineToUpdate = medicines.find(m => m.id === id);
    if (!medicineToUpdate) return;
    
    // Update medicine status to taken
    setMedicines(prev => 
      prev.map(medicine => 
        medicine.id === id ? { ...medicine, taken: true } : medicine
      )
    );
    
    // Decrease inventory when taking medicine
    updateInventory(id, medicineToUpdate.inventory.current - medicineToUpdate.amount);
    
    // Show confirmation toast
    toast(
      <div className="flex items-start">
        <AlertCircle className="mr-2 h-5 w-5 text-green-500" />
        <div>
          <div className="font-medium">Medicine Taken</div>
          <div className="text-sm text-app-dark-gray">
            You've taken your {medicineToUpdate.name} for today
          </div>
        </div>
      </div>,
      { duration: 3000 }
    );
  };
  
  const updateInventory = (id: string, newAmount: number) => {
    setMedicines(prev => 
      prev.map(medicine => 
        medicine.id === id 
          ? { 
              ...medicine, 
              inventory: {
                ...medicine.inventory,
                current: Math.max(0, newAmount)
              } 
            } 
          : medicine
      )
    );
  };

  const getTodayMedicines = () => {
    const today = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    return medicines.filter(medicine => medicine.reminderDays.includes(today));
  };

  const getMedicineById = (id: string) => {
    return medicines.find(medicine => medicine.id === id);
  };
  
  const getLowInventoryMedicines = () => {
    return medicines.filter(
      medicine => medicine.inventory.current <= medicine.inventory.threshold
    );
  };
  
  // Appointment functions
  const addAppointment = (appointment: Omit<Appointment, 'id' | 'notified'>) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString(),
      notified: false,
    };
    
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };
  
  const getUpcomingAppointments = (days = 30) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    
    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    return appointments.filter(
      appointment => appointment.date >= todayStr && appointment.date <= futureDateStr
    ).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  };
  
  const getAppointmentById = (id: string) => {
    return appointments.find(appointment => appointment.id === id);
  };

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        appointments,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        markAsTaken,
        updateInventory,
        getTodayMedicines,
        getMedicineById,
        getLowInventoryMedicines,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getUpcomingAppointments,
        getAppointmentById,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};
