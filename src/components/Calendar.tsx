
import React from 'react';
import { useMedicine } from '@/context/MedicineContext';
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const { selectedDate, setSelectedDate } = useMedicine();
  const [days, setDays] = React.useState<Date[]>([]);
  const [showFullCalendar, setShowFullCalendar] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

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
    setShowFullCalendar(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Get the month name for display
  const monthDisplay = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div className="w-full card animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth('prev')}
          className="h-8 w-8 p-0 text-app-gray"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover open={showFullCalendar} onOpenChange={setShowFullCalendar}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="text-app-gray text-sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {monthDisplay}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <CalendarUI
              mode="single"
              selected={selectedDate}
              onSelect={handleSelectDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth('next')}
          className="h-8 w-8 p-0 text-app-gray"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
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
