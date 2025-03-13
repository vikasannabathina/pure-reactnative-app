
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { useMedicine } from '@/context/MedicineContext';
import BackButton from '@/components/BackButton';
import AppointmentCard from '@/components/AppointmentCard';
import { toast } from 'sonner';

const Appointments = () => {
  const navigate = useNavigate();
  const { getUpcomingAppointments, deleteAppointment } = useMedicine();
  const [appointments, setAppointments] = useState(getUpcomingAppointments());
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(id);
      setAppointments(getUpcomingAppointments());
      toast.success('Appointment deleted successfully');
    }
  };
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <header className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-xl font-semibold text-app-dark-gray ml-2">Appointments</h1>
      </header>
      
      {appointments.length === 0 ? (
        <div className="text-center mt-10">
          <div className="mx-auto bg-app-light-gray rounded-full h-20 w-20 flex items-center justify-center mb-4">
            <Calendar size={32} className="text-app-gray" />
          </div>
          <h2 className="text-app-dark-gray font-medium mb-2">No Appointments</h2>
          <p className="text-app-gray text-sm mb-6">
            You don't have any upcoming appointments scheduled
          </p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/add-appointment')}
          >
            Schedule an Appointment
          </button>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <p className="text-app-gray mb-4">Your upcoming doctor appointments</p>
            {appointments.map(appointment => (
              <AppointmentCard 
                key={appointment.id}
                appointment={appointment}
                onDelete={handleDelete}
                onClick={() => navigate(`/appointment/${appointment.id}`)}
              />
            ))}
          </div>
          
          <button 
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-app-blue hover:bg-app-dark-blue text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => navigate('/add-appointment')}
            aria-label="Add new appointment"
          >
            <Plus size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default Appointments;
