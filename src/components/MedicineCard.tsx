
import React from 'react';
import { Clock, Check, Pill, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMedicine } from '@/context/MedicineContext';
import { Medicine } from '@/utils/reminderTypes';

type MedicineCardProps = {
  medicine: Medicine;
  onClick?: () => void;
};

const MedicineCard = ({ medicine, onClick }: MedicineCardProps) => {
  const navigate = useNavigate();
  const { markAsTaken } = useMedicine();
  
  const handleMarkAsTaken = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsTaken(medicine.id);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/medicine/${medicine.id}`);
  };
  
  return (
    <div 
      className="card mb-3 hover:shadow-md transition-all duration-300 animate-slide-in"
      onClick={() => onClick && onClick()}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {medicine.taken ? (
            <div className="h-8 w-8 rounded-full bg-app-success flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-app-light-gray flex items-center justify-center">
              <Clock size={16} className="text-app-gray" />
            </div>
          )}
          <div className="ml-3">
            <h3 className="font-medium text-app-dark-gray">{medicine.name}</h3>
            <div className="flex items-center text-xs text-app-gray mt-1">
              <p>{medicine.amount} {medicine.type}{medicine.amount > 1 ? 's' : ''}, {medicine.dose}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-app-blue text-sm font-medium mr-3">{medicine.reminderTime}</span>
          
          <div className="flex space-x-2">
            {!medicine.taken && (
              <button 
                className="p-2 rounded-full bg-app-light-blue hover:bg-app-blue hover:text-white transition-colors duration-200"
                onClick={handleMarkAsTaken}
                aria-label="Mark as taken"
              >
                <Check size={16} />
              </button>
            )}
            
            <button 
              className="p-2 rounded-full bg-app-light-gray hover:bg-app-gray hover:text-white transition-colors duration-200"
              onClick={handleEdit}
              aria-label="Edit medicine"
            >
              <Edit2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
