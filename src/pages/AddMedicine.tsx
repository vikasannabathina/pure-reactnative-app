
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedicine } from '@/context/MedicineContext';
import BackButton from '@/components/BackButton';
import { Check, Clock, X } from 'lucide-react';
import { toast } from 'sonner';

type MedicineType = 'Capsule' | 'Tablet' | 'Drop' | 'Liquid' | 'Injection';

const AddMedicine = () => {
  const navigate = useNavigate();
  const { addMedicine } = useMedicine();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<MedicineType>('Capsule');
  const [dose, setDose] = useState('');
  const [amount, setAmount] = useState(1);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const handleSelectDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  const handleSelectType = (selectedType: MedicineType) => {
    setType(selectedType);
    setShowTypeDropdown(false);
  };
  
  const handleSubmit = () => {
    if (!name) {
      toast.error('Please enter a medicine name');
      return;
    }
    
    if (!dose) {
      toast.error('Please enter a medicine dose');
      return;
    }
    
    if (selectedDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }
    
    addMedicine({
      name,
      type,
      dose,
      amount,
      reminderTime,
      reminderDays: selectedDays,
    });
    
    toast.success('Medicine added successfully');
    navigate('/home');
  };
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const types: MedicineType[] = ['Capsule', 'Tablet', 'Drop', 'Liquid', 'Injection'];
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <header className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-xl font-semibold text-app-dark-gray ml-2">Add Medicine</h1>
      </header>
      
      <div className="card mb-4">
        <p className="text-lg font-medium text-app-dark-gray mb-1">New Medicine</p>
        <p className="text-sm text-app-gray mb-4">Fill out the fields and hit the Save Button to add it</p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-app-dark-gray mb-1">Name* (e.g. Ibuprofen)</label>
            <input
              type="text"
              className="input-field"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-app-dark-gray mb-1">Type*</label>
            <div className="relative">
              <button
                type="button"
                className="input-field text-left flex justify-between items-center"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <span>{type || 'Select an item'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-app-gray" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-10 border border-app-light-gray animate-slide-up">
                  {types.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-app-light-gray text-app-dark-gray transition-colors"
                      onClick={() => handleSelectType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-app-dark-gray mb-1">Dose* (e.g. 100mg)</label>
            <input
              type="text"
              className="input-field"
              placeholder="Dose"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-app-dark-gray mb-1">Amount* (e.g. 3)</label>
            <input
              type="number"
              className="input-field"
              placeholder="Amount"
              min={1}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-app-dark-gray mb-1">Reminder Time*</label>
            <div className="relative">
              <button
                type="button"
                className="input-field text-left flex items-center"
                onClick={() => setShowTimePicker(!showTimePicker)}
              >
                <Clock size={18} className="text-app-gray mr-2" />
                <span>{reminderTime}</span>
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
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
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
            <label className="block text-sm font-medium text-app-dark-gray mb-1">Reminder Day*</label>
            <div className="space-y-2">
              {days.map((day) => (
                <div
                  key={day}
                  className={`flex items-center p-3 rounded-lg border ${
                    selectedDays.includes(day) ? 'border-app-blue bg-app-light-blue' : 'border-app-light-gray'
                  } transition-colors`}
                  onClick={() => handleSelectDay(day)}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    selectedDays.includes(day) ? 'bg-app-blue' : 'bg-app-light-gray'
                  } mr-3 transition-colors`}>
                    {selectedDays.includes(day) && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-app-dark-gray">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <button
        type="button"
        className="btn-primary mt-4"
        onClick={handleSubmit}
      >
        Save Medicine
      </button>
    </div>
  );
};

export default AddMedicine;
