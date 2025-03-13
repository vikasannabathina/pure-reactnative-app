
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMedicine } from '@/context/MedicineContext';
import { Menu, Plus, Calendar as CalendarIcon } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import Calendar from '@/components/Calendar';
import CircularProgress from '@/components/CircularProgress';
import MedicineCard from '@/components/MedicineCard';
import InventoryAlert from '@/components/InventoryAlert';
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getTodayMedicines, getUpcomingAppointments, selectedDate } = useMedicine();
  const [showMenu, setShowMenu] = useState(false);
  
  // Use useMemo to avoid recalculating on every render
  const todayMedicines = useMemo(() => getTodayMedicines(), [selectedDate, getTodayMedicines]);
  const upcomingAppointments = useMemo(() => getUpcomingAppointments(7), [getUpcomingAppointments]);
  
  const totalTaken = useMemo(() => 
    todayMedicines.filter(m => m.taken).length, 
    [todayMedicines]
  );
  
  const handleAddMedicine = () => {
    navigate('/add-medicine');
  };
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="page-container pb-20">
      <header className="flex justify-between items-center mb-6">
        <button 
          className="p-2 hover:bg-app-light-gray rounded-full transition-colors"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Menu size={24} className="text-app-dark-gray" />
        </button>
        
        <UserAvatar />
      </header>
      
      {showMenu && (
        <div className="absolute top-20 left-4 z-10 bg-white rounded-lg shadow-lg p-4 animate-scale w-48">
          <p className="text-app-dark-gray font-medium mb-2">{user?.name}</p>
          <p className="text-app-gray text-sm mb-4">{user?.email}</p>
          <div className="space-y-2">
            <button 
              className="text-app-blue text-sm block w-full text-left"
              onClick={() => {
                setShowMenu(false);
                navigate('/appointments');
              }}
            >
              Doctor Appointments
            </button>
            <button 
              className="text-app-danger text-sm block w-full text-left"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      )}
      
      <Calendar />
      
      {/* Inventory Alert Section */}
      <InventoryAlert />
      
      {/* Upcoming Appointment Section */}
      {upcomingAppointments.length > 0 && (
        <div className="card mb-5 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <CalendarIcon size={18} className="text-app-blue mr-2" />
              <h3 className="text-app-dark-gray font-medium">Upcoming Appointments</h3>
            </div>
            <button 
              className="text-xs text-app-blue"
              onClick={() => navigate('/appointments')}
            >
              View all
            </button>
          </div>
          
          {upcomingAppointments.slice(0, 2).map(appointment => (
            <div 
              key={appointment.id}
              className="flex justify-between items-center p-3 bg-app-light-gray bg-opacity-30 rounded-lg mb-2"
              onClick={() => navigate(`/appointment/${appointment.id}`)}
            >
              <div>
                <p className="font-medium text-app-dark-gray">{appointment.doctorName}</p>
                <p className="text-xs text-app-gray">{appointment.specialization}</p>
              </div>
              <div className="text-right">
                <p className="text-app-blue font-medium">{formatAppointmentDate(appointment.date)}</p>
                <p className="text-xs text-app-gray">{appointment.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="my-6 flex flex-col items-center">
        <CircularProgress 
          value={totalTaken} 
          max={todayMedicines.length || 1} 
          size={160}
        />
        
        <h2 className="text-xl font-semibold text-app-dark-gray mt-6 mb-3">
          Today's Medications
        </h2>
        
        {todayMedicines.length === 0 ? (
          <div className="text-center text-app-gray mt-8">
            <p>No medications scheduled for today</p>
            <p className="text-sm mt-2">Tap the + button to add a medication</p>
          </div>
        ) : (
          <div className="w-full mt-4">
            {todayMedicines.map(medicine => (
              <MedicineCard 
                key={medicine.id} 
                medicine={medicine} 
                onClick={() => navigate(`/medicine/${medicine.id}`)}
              />
            ))}
          </div>
        )}
      </div>
      
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-app-blue hover:bg-app-dark-blue text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
        onClick={handleAddMedicine}
        aria-label="Add new medicine"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Home;
