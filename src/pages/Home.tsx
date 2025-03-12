
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMedicine } from '@/context/MedicineContext';
import { Menu, Plus } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import Calendar from '@/components/Calendar';
import CircularProgress from '@/components/CircularProgress';
import MedicineCard from '@/components/MedicineCard';
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getTodayMedicines, selectedDate } = useMedicine();
  const [todayMedicines, setTodayMedicines] = useState(getTodayMedicines());
  const [showMenu, setShowMenu] = useState(false);
  
  useEffect(() => {
    setTodayMedicines(getTodayMedicines());
  }, [selectedDate, getTodayMedicines]);
  
  const totalTaken = todayMedicines.filter(m => m.taken).length;
  
  const handleAddMedicine = () => {
    navigate('/add-medicine');
  };
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
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
          <button 
            className="text-app-danger text-sm"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      )}
      
      <Calendar />
      
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
