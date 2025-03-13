
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMedicine } from '@/context/MedicineContext';
import BackButton from '@/components/BackButton';
import { Check, Clock, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { MedicineType, TimeOfDay } from '@/utils/reminderTypes';

const MedicineDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMedicineById, updateMedicine, deleteMedicine } = useMedicine();
  
  const [medicine, setMedicine] = useState(getMedicineById(id || ''));
  const [name, setName] = useState(medicine?.name || '');
  const [type, setType] = useState<MedicineType>(medicine?.type as MedicineType || 'Capsule');
  const [dose, setDose] = useState(medicine?.dose || '');
  const [amount, setAmount] = useState(medicine?.amount || 1);
  const [reminderTime, setReminderTime] = useState(medicine?.reminderTime || '08:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(medicine?.reminderDays || []);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<TimeOfDay[]>(medicine?.timeOfDay || []);
  const [currentInventory, setCurrentInventory] = useState(medicine?.inventory.current || 30);
  const [inventoryThreshold, setInventoryThreshold] = useState(medicine?.inventory.threshold || 5);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    if (!medicine) {
      navigate('/home');
    }
  }, [medicine, navigate]);
  
  useEffect(() => {
    setMedicine(getMedicineById(id || ''));
  }, [id, getMedicineById]);
  
  useEffect(() => {
    if (medicine) {
      setName(medicine.name);
      setType(medicine.type as MedicineType);
      setDose(medicine.dose);
      setAmount(medicine.amount);
      setReminderTime(medicine.reminderTime);
      setSelectedDays(medicine.reminderDays);
      setSelectedTimeOfDay(medicine.timeOfDay || []);
      setCurrentInventory(medicine.inventory.current);
      setInventoryThreshold(medicine.inventory.threshold);
    }
  }, [medicine]);
  
  const handleSelectDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  const handleSelectTimeOfDay = (time: TimeOfDay) => {
    if (selectedTimeOfDay.includes(time)) {
      setSelectedTimeOfDay(selectedTimeOfDay.filter(t => t !== time));
    } else {
      setSelectedTimeOfDay([...selectedTimeOfDay, time]);
    }
  };
  
  const handleSelectType = (selectedType: MedicineType) => {
    setType(selectedType);
    setShowTypeDropdown(false);
  };
  
  const handleSubmit = () => {
    if (!id) return;
    
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
    
    if (selectedTimeOfDay.length === 0) {
      toast.error('Please select at least one time of day (Morning, Afternoon, or Night)');
      return;
    }
    
    updateMedicine(id, {
      name,
      type,
      dose,
      amount,
      reminderTime,
      reminderDays: selectedDays,
      timeOfDay: selectedTimeOfDay,
      inventory: {
        current: currentInventory,
        threshold: inventoryThreshold
      }
    });
    
    toast.success('Medicine updated successfully');
    navigate('/home');
  };
  
  const handleDelete = () => {
    if (!id) return;
    
    deleteMedicine(id);
    toast.success('Medicine deleted successfully');
    navigate('/home');
  };
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timesOfDay: TimeOfDay[] = ['Morning', 'Afternoon', 'Night'];
  const types: MedicineType[] = ['Capsule', 'Tablet', 'Drop', 'Liquid', 'Injection'];
  
  if (!medicine) return null;
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <header className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-xl font-semibold text-app-dark-gray ml-2">Medicine Details</h1>
      </header>
      
      <div className="card mb-4">
        <p className="text-lg font-medium text-app-dark-gray mb-1">{medicine.name}</p>
        <p className="text-sm text-app-gray mb-4">If you'd like to edit, change the fields and hit the save button!</p>
        
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
          
          {/* Time of Day Selection */}
          <div>
            <label className="block text-sm font-medium text-app-dark-gray mb-1">Time of Day*</label>
            <div className="space-y-2">
              {timesOfDay.map((time) => (
                <div
                  key={time}
                  className={`flex items-center p-3 rounded-lg border ${
                    selectedTimeOfDay.includes(time) ? 'border-app-blue bg-app-light-blue' : 'border-app-light-gray'
                  } transition-colors`}
                  onClick={() => handleSelectTimeOfDay(time)}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    selectedTimeOfDay.includes(time) ? 'bg-app-blue' : 'bg-app-light-gray'
                  } mr-3 transition-colors`}>
                    {selectedTimeOfDay.includes(time) && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-app-dark-gray">{time}</span>
                </div>
              ))}
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
          
          {/* Inventory Management Section */}
          <div className="pt-4 border-t border-app-light-gray">
            <div className="flex items-center mb-3">
              <Package size={18} className="text-app-blue mr-2" />
              <h3 className="text-app-dark-gray font-medium">Inventory Management</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-app-dark-gray mb-1">
                  Current Inventory
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Current amount"
                  min={0}
                  value={currentInventory}
                  onChange={(e) => setCurrentInventory(parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-app-dark-gray mb-1">
                  Low Inventory Alert Threshold
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Alert threshold"
                  min={1}
                  value={inventoryThreshold}
                  onChange={(e) => setInventoryThreshold(parseInt(e.target.value))}
                />
                <p className="text-xs text-app-gray mt-1">
                  You'll receive an alert when inventory falls below this number
                </p>
              </div>
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
      
      {!showDeleteConfirm ? (
        <button
          type="button"
          className="btn-outline mt-3 text-app-danger"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 size={18} className="mr-2" />
          Delete Medicine
        </button>
      ) : (
        <div className="mt-4 border border-app-danger border-dashed p-4 rounded-lg animate-scale">
          <p className="text-center text-app-danger font-medium mb-3">Attention!</p>
          <p className="text-center text-app-dark-gray text-sm mb-4">Once deleted, your medicine can't be restored again!</p>
          <button
            type="button"
            className="btn-danger"
            onClick={handleDelete}
          >
            Delete Medicine
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicineDetails;
