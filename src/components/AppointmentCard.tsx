
import React from 'react';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '@/utils/reminderTypes';

type AppointmentCardProps = {
  appointment: Appointment;
  onDelete?: (id: string) => void;
  onClick?: () => void;
};

const AppointmentCard = ({ appointment, onDelete, onClick }: AppointmentCardProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/appointment/${appointment.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(appointment.id);
    }
  };
  
  return (
    <div 
      className="card mb-3 hover:shadow-md transition-all duration-300 animate-slide-in"
      onClick={() => onClick && onClick()}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-app-light-blue flex items-center justify-center">
            <Calendar size={20} className="text-app-blue" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-app-dark-gray">{appointment.doctorName}</h3>
            <p className="text-xs text-app-gray mt-1">{appointment.specialization}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-right mr-4">
            <div className="text-app-blue font-medium">{formatDate(appointment.date)}</div>
            <div className="flex items-center justify-end mt-1">
              <Clock size={14} className="text-app-gray mr-1" />
              <span className="text-sm text-app-gray">{appointment.time}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="p-2 rounded-full bg-app-light-gray hover:bg-app-gray hover:text-white transition-colors duration-200"
              onClick={handleEdit}
              aria-label="Edit appointment"
            >
              <Edit2 size={16} />
            </button>
            
            <button 
              className="p-2 rounded-full bg-app-light-red hover:bg-app-danger hover:text-white transition-colors duration-200"
              onClick={handleDelete}
              aria-label="Delete appointment"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {appointment.notes && (
        <div className="mt-3 pt-3 border-t border-app-light-gray">
          <p className="text-sm text-app-gray">{appointment.notes}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
