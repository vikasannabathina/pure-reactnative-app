
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { useMedicine } from '@/context/MedicineContext';
import BackButton from '@/components/BackButton';
import { toast } from 'sonner';

const AddAppointment = () => {
  const navigate = useNavigate();
  const { addAppointment } = useMedicine();
  
  const [doctorName, setDoctorName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctorName) {
      toast.error('Please enter a doctor name');
      return;
    }
    
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    
    if (!time) {
      toast.error('Please select a time');
      return;
    }
    
    addAppointment({
      doctorName,
      specialization,
      date,
      time,
      notes,
    });
    
    toast.success('Appointment added successfully');
    navigate('/appointments');
  };
  
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <header className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-xl font-semibold text-app-dark-gray ml-2">Add Appointment</h1>
      </header>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-app-dark-gray mb-1">Doctor Name*</label>
              <input
                type="text"
                className="input-field"
                placeholder="Dr. John Smith"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-app-dark-gray mb-1">Specialization</label>
              <input
                type="text"
                className="input-field"
                placeholder="Cardiologist, Dermatologist, etc."
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-app-dark-gray mb-1">Appointment Date*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar size={18} className="text-app-gray" />
                </div>
                <input
                  type="date"
                  className="input-field pl-10"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-app-dark-gray mb-1">Appointment Time*</label>
              <div className="relative">
                <button
                  type="button"
                  className="input-field text-left flex items-center"
                  onClick={() => setShowTimePicker(!showTimePicker)}
                >
                  <Clock size={18} className="text-app-gray mr-2" />
                  <span>{time || 'Select time'}</span>
                </button>
                
                {showTimePicker && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white rounded-lg overflow-hidden w-72 animate-scale">
                      <div className="p-4 border-b border-app-light-gray">
                        <h3 className="text-lg font-medium text-app-dark-gray">Select Time</h3>
                      </div>
                      
                      <div className="p-4">
                        <input
                          type="time"
                          className="input-field"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex border-t border-app-light-gray">
                        <button
                          type="button"
                          className="flex-1 py-3 text-app-gray font-medium hover:bg-app-light-gray transition-colors"
                          onClick={() => setShowTimePicker(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="flex-1 py-3 text-app-blue font-medium hover:bg-app-light-gray transition-colors"
                          onClick={() => setShowTimePicker(false)}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-app-dark-gray mb-1">Notes</label>
              <textarea
                className="input-field min-h-[100px]"
                placeholder="Any additional information about the appointment"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <button type="submit" className="btn-primary w-full">
          Save Appointment
        </button>
      </form>
    </div>
  );
};

export default AddAppointment;
