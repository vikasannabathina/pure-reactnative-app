
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { useMedicine } from '@/context/MedicineContext';
import BackButton from '@/components/BackButton';
import { toast } from 'sonner';

const AppointmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAppointmentById, updateAppointment, deleteAppointment } = useMedicine();
  
  const [appointment, setAppointment] = useState(getAppointmentById(id || ''));
  const [doctorName, setDoctorName] = useState(appointment?.doctorName || '');
  const [specialization, setSpecialization] = useState(appointment?.specialization || '');
  const [date, setDate] = useState(appointment?.date || '');
  const [time, setTime] = useState(appointment?.time || '');
  const [notes, setNotes] = useState(appointment?.notes || '');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    if (!appointment) {
      navigate('/appointments');
    }
  }, [appointment, navigate]);
  
  useEffect(() => {
    setAppointment(getAppointmentById(id || ''));
  }, [id, getAppointmentById]);
  
  useEffect(() => {
    if (appointment) {
      setDoctorName(appointment.doctorName);
      setSpecialization(appointment.specialization);
      setDate(appointment.date);
      setTime(appointment.time);
      setNotes(appointment.notes);
    }
  }, [appointment]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
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
    
    updateAppointment(id, {
      doctorName,
      specialization,
      date,
      time,
      notes,
      notified: false, // Reset notification status when updating
    });
    
    toast.success('Appointment updated successfully');
    navigate('/appointments');
  };
  
  const handleDelete = () => {
    if (!id) return;
    
    deleteAppointment(id);
    toast.success('Appointment deleted successfully');
    navigate('/appointments');
  };
  
  const today = new Date().toISOString().split('T')[0];
  
  if (!appointment) return null;
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <header className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-xl font-semibold text-app-dark-gray ml-2">Appointment Details</h1>
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
          Update Appointment
        </button>
        
        {!showDeleteConfirm ? (
          <button
            type="button"
            className="btn-outline mt-3 text-app-danger w-full"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 size={18} className="mr-2" />
            Delete Appointment
          </button>
        ) : (
          <div className="mt-4 border border-app-danger border-dashed p-4 rounded-lg animate-scale">
            <p className="text-center text-app-danger font-medium mb-3">Delete this appointment?</p>
            <p className="text-center text-app-dark-gray text-sm mb-4">This action cannot be undone.</p>
            <button
              type="button"
              className="btn-danger w-full"
              onClick={handleDelete}
            >
              Confirm Delete
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AppointmentDetails;
