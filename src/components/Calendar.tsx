
import React from 'react';
import { useMedicine } from '@/context/MedicineContext';

const Calendar = () => {
  const { selectedDate, setSelectedDate } = useMedicine();
  const [days, setDays] = React.useState<Date[]>([]);

  React.useEffect(() => {
    // Generate 7 days starting from today
    const today = new Date();
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date;
    });
    setDays(weekDays);
  }, []);

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // Get the month name for display
  const currentMonth = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div className="w-full card animate-fade-in">
      <div className="mb-4 text-center">
        <p className="text-app-gray text-sm">{currentMonth}</p>
      </div>
      <div className="flex justify-between items-center">
        {days.map((day, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center"
            onClick={() => handleSelectDate(day)}
          >
            <div className={`calendar-day ${isSelected(day) ? 'selected' : ''}`}>
              {day.getDate()}
            </div>
            <span className="text-xs text-app-gray mt-1">
              {day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
