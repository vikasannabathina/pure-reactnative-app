
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

  // Function to generate week days for the provided start date
  const generateWeekDays = (startDate: Date) => {
    const result = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
    return result;
  };

  React.useEffect(() => {
    // Initially generate days based on current date
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    startOfWeek.setDate(diff);
    setDays(generateWeekDays(startOfWeek));
  }, []);

  // Update days when selectedDate changes (from the calendar popup)
  React.useEffect(() => {
    if (selectedDate) {
      // Get the Monday of the selected date's week
      const day = selectedDate.getDay();
      const diff = selectedDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(diff);
      setDays(generateWeekDays(startOfWeek));
      
      // Also update the current month view
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

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
      // Go to previous week
      const firstDay = days[0];
      const prevWeekStart = new Date(firstDay);
      prevWeekStart.setDate(firstDay.getDate() - 7);
      setDays(generateWeekDays(prevWeekStart));
      
      // Update current month if we cross month boundary
      if (prevWeekStart.getMonth() !== currentMonth.getMonth()) {
        newMonth.setMonth(newMonth.getMonth() - 1);
        setCurrentMonth(newMonth);
      }
    } else {
      // Go to next week
      const lastDay = days[6];
      const nextWeekStart = new Date(lastDay);
      nextWeekStart.setDate(lastDay.getDate() + 1);
      setDays(generateWeekDays(nextWeekStart));
      
      // Update current month if we cross month boundary
      if (nextWeekStart.getMonth() !== currentMonth.getMonth()) {
        newMonth.setMonth(newMonth.getMonth() + 1);
        setCurrentMonth(newMonth);
      }
    }
  };

  // Get the month name for display
  const monthDisplay = format(currentMonth, 'MMMM yyyy').toUpperCase();

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
              onSelect={(date) => {
                if (date) {
                  handleSelectDate(date);
                }
              }}
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
            className="flex flex-col items-center cursor-pointer"
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
