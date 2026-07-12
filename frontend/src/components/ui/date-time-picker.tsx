'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from './button';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value: string; // Format: 'YYYY-MM-DDTHH:mm'
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date and time',
  className,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Position detection to prevent overflowing screen bottom
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Popover is around 360px. Open upward if space below is insufficient.
      if (spaceBelow < 360) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  // Parse current value
  const parsedDate = value ? new Date(value.replace('T', ' ')) : null;

  // View state for the calendar calendar sheet (default to selected date or current date)
  const [viewDate, setViewDate] = useState(() => parsedDate || new Date());
  
  // Selected time parts
  const [hours, setHours] = useState(() => {
    if (!parsedDate) return '12';
    let h = parsedDate.getHours();
    h = h % 12;
    return String(h === 0 ? 12 : h).padStart(2, '0');
  });
  const [minutes, setMinutes] = useState(() => {
    if (!parsedDate) return '00';
    return String(parsedDate.getMinutes()).padStart(2, '0');
  });
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(() => {
    if (!parsedDate) return 'PM';
    return parsedDate.getHours() >= 12 ? 'PM' : 'AM';
  });

  // Sync state if value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value.replace('T', ' '));
      if (!isNaN(d.getTime())) {
        setViewDate(d);
        let h = d.getHours();
        const ampmVal = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        setHours(String(h === 0 ? 12 : h).padStart(2, '0'));
        setMinutes(String(d.getMinutes()).padStart(2, '0'));
        setAmpm(ampmVal);
      }
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11

  // Days calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sunday) to 6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDaySelect = (day: number) => {
    let finalHour = parseInt(hours, 10);
    if (ampm === 'PM' && finalHour < 12) finalHour += 12;
    if (ampm === 'AM' && finalHour === 12) finalHour = 0;
    const finalMinute = parseInt(minutes, 10);

    const newDate = new Date(year, month, day, finalHour, finalMinute, 0);
    
    // Format to YYYY-MM-DDTHH:mm
    const yStr = newDate.getFullYear();
    const moStr = String(newDate.getMonth() + 1).padStart(2, '0');
    const dStr = String(newDate.getDate()).padStart(2, '0');
    const hStr = String(newDate.getHours()).padStart(2, '0');
    const miStr = String(newDate.getMinutes()).padStart(2, '0');

    onChange(`${yStr}-${moStr}-${dStr}T${hStr}:${miStr}`);
  };

  const handleTimeChange = (newHours: string, newMins: string, newAmpm: 'AM' | 'PM') => {
    setHours(newHours);
    setMinutes(newMins);
    setAmpm(newAmpm);

    if (parsedDate) {
      let finalHour = parseInt(newHours, 10);
      if (newAmpm === 'PM' && finalHour < 12) finalHour += 12;
      if (newAmpm === 'AM' && finalHour === 12) finalHour = 0;
      const finalMinute = parseInt(newMins, 10);

      const updatedDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), finalHour, finalMinute, 0);
      const yStr = updatedDate.getFullYear();
      const moStr = String(updatedDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(updatedDate.getDate()).padStart(2, '0');
      const hStr = String(updatedDate.getHours()).padStart(2, '0');
      const miStr = String(updatedDate.getMinutes()).padStart(2, '0');

      onChange(`${yStr}-${moStr}-${dStr}T${hStr}:${miStr}`);
    }
  };

  const formatDisplayValue = () => {
    if (!parsedDate) return '';
    const dayStr = String(parsedDate.getDate()).padStart(2, '0');
    const monthStr = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const yearStr = parsedDate.getFullYear();
    
    let hr = parsedDate.getHours();
    const ampmSuffix = hr >= 12 ? 'PM' : 'AM';
    hr = hr % 12;
    hr = hr ? hr : 12;
    const hrStr = String(hr).padStart(2, '0');
    const minStr = String(parsedDate.getMinutes()).padStart(2, '0');

    return `${monthStr}/${dayStr}/${yearStr}, ${hrStr}:${minStr} ${ampmSuffix}`;
  };

  // Generate day cells
  const dayCells = [];
  // Empty slots for first week offset
  for (let i = 0; i < firstDayOfMonth; i++) {
    dayCells.push(<div key={`empty-${i}`} className="h-9 w-9" />);
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = parsedDate &&
      parsedDate.getDate() === d &&
      parsedDate.getMonth() === month &&
      parsedDate.getFullYear() === year;

    const isToday = new Date().getDate() === d &&
      new Date().getMonth() === month &&
      new Date().getFullYear() === year;

    dayCells.push(
      <button
        key={`day-${d}`}
        type="button"
        onClick={() => handleDaySelect(d)}
        className={cn(
          "h-9 w-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-all hover:bg-slate-100",
          isSelected && "bg-primary text-white hover:bg-primary-600 shadow-sm shadow-primary/20",
          isToday && !isSelected && "border-2 border-accent-500 text-accent-700"
        )}
      >
        {d}
      </button>
    );
  }

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">{label}</Label>}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-11 px-3 bg-white border border-input rounded-xl shadow-sm cursor-pointer hover:border-slate-400 transition-colors focus-within:ring-2 focus-within:ring-primary/20"
      >
        <span className={cn("text-sm", !value && "text-muted-foreground")}>
          {formatDisplayValue() || placeholder}
        </span>
        <div className="flex items-center gap-1.5 text-slate-400">
          <CalendarIcon className="w-4 h-4" />
          <Clock className="w-4 h-4" />
        </div>
      </div>

      {isOpen && (
        <div className={cn(
          "absolute z-[100] p-4 bg-white border rounded-2xl shadow-xl animate-in fade-in duration-200 w-[310px] md:w-[320px] left-0 md:left-auto md:right-0",
          openUpward 
            ? "bottom-full mb-2 slide-in-from-bottom-2" 
            : "top-full mt-2 slide-in-from-top-2"
        )}>
          <div className="flex items-center justify-between border-b pb-3 mb-3">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-800 text-sm">{monthsList[month]} {year}</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                onClick={handlePrevMonth} 
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={handleNextMonth} 
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider h-6 flex items-center justify-center">
                {d}
              </span>
            ))}
            {dayCells}
          </div>

          {/* Time Picker Row */}
          <div className="flex items-center justify-between border-t pt-3 mt-3 gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Time
            </span>
            
            <div className="flex items-center gap-1 bg-slate-50 border rounded-xl overflow-hidden p-0.5 shadow-inner">
              {/* Hours */}
              <select
                className="text-xs font-bold bg-transparent border-none outline-none py-1 px-1.5 text-slate-800 cursor-pointer"
                value={hours}
                onChange={(e) => handleTimeChange(e.target.value, minutes, ampm)}
              >
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              
              <span className="text-slate-400 font-bold">:</span>
              
              {/* Minutes */}
              <select
                className="text-xs font-bold bg-transparent border-none outline-none py-1 px-1.5 text-slate-800 cursor-pointer"
                value={minutes}
                onChange={(e) => handleTimeChange(hours, e.target.value, ampm)}
              >
                {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* AM/PM */}
              <select
                className="text-xs font-bold bg-white shadow-sm border border-slate-200 rounded-lg py-1 px-1.5 text-slate-800 cursor-pointer"
                value={ampm}
                onChange={(e) => handleTimeChange(hours, minutes, e.target.value as 'AM' | 'PM')}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
            <Button 
              size="xs" 
              variant="outline" 
              className="rounded-lg h-7 text-xs font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
