'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  id?: string;
  label?: string;
  value: string; // expects YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  minYear?: number;
  maxYear?: number;
  size?: 'sm' | 'md';
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const WEEK_DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

const parseDate = (val: string): Date => {
  if (!val) return new Date();
  // If it's a full ISO string (contains T or Z)
  if (val.includes('T') || val.includes('Z')) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  // Try splitting by hyphen YYYY-MM-DD
  const parts = val.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d, 12, 0, 0);
    if (!isNaN(date.getTime())) return date;
  }
  // Fallback
  const d = new Date(val);
  if (!isNaN(d.getTime())) return d;
  return new Date();
};

export function DatePicker({
  id,
  label,
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  error,
  icon = <CalendarIcon className="h-4 w-4" />,
  disabled = false,
  className = '',
  minYear = 1920,
  maxYear = new Date().getFullYear() + 15,
  size = 'md',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize helper state to navigate through months/years
  const [currentDate, setCurrentDate] = useState<Date>(() => parseDate(value));

  // Keep internal currentDate sync'd when value changes from outside
  useEffect(() => {
    setCurrentDate(parseDate(value));
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday ...

  // Days from previous month to fill the first row
  const prevMonthDays: Date[] = [];
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push(new Date(prevYear, prevMonth, daysInPrevMonth - i));
  }

  // Days in current month
  const currentMonthDays: Date[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push(new Date(year, month, i));
  }

  // Days in next month to complete the grid (42 cells = 6 rows of 7 days)
  const nextMonthDays: Date[] = [];
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const totalCells = 42;
  const remainingCells = totalCells - (prevMonthDays.length + currentMonthDays.length);
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(new Date(nextYear, nextMonth, i));
  }

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  // Formatting helpers
  const formatDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getFormattedDisplay = (): string => {
    if (!value) return '';
    try {
      const parts = value.split('-');
      if (parts.length === 3) {
        const y = parts[0];
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        return `${d} de ${MONTH_NAMES[m]}, ${y}`;
      }
      return value;
    } catch {
      return value;
    }
  };

  const handleSelectDay = (date: Date) => {
    const formatted = formatDateString(date);
    onChange(formatted);
    setIsOpen(false);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(year, month + direction, 1);
    setCurrentDate(newDate);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(year, newMonth, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate(new Date(newYear, month, 1));
  };

  const handleToday = () => {
    const today = new Date();
    onChange(formatDateString(today));
    setCurrentDate(today);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  // Build options for years selector
  const yearsOptions: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    yearsOptions.push(y);
  }

  const isSelected = (date: Date): boolean => {
    if (!value) return false;
    return formatDateString(date) === value;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === month && date.getFullYear() === year;
  };
  const clonedIcon = icon && React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: `${(icon as React.ReactElement<{ className?: string }>).props.className || ''} ${
          size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
        }`.trim(),
      })
    : icon;

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5 relative w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold" style={{ color: '#374151' }}>
          {label}
        </label>
      )}
      <div className="relative w-full">
        {clonedIcon && (
          <div
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 z-10 ${
              size === 'sm' ? 'left-2' : 'left-3.5'
            }`}
            style={{ color: '#6b7f6b' }}
          >
            {clonedIcon}
          </div>
        )}
        <button
          id={id}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) setIsOpen(!isOpen);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          disabled={disabled}
          className={`
            w-full rounded-xl border bg-white text-left
            transition-all duration-200
            focus:outline-none flex items-center justify-between
            cursor-pointer select-none
            ${size === 'sm' ? 'pl-8 pr-8 py-1 h-8 text-xs' : 'pl-11 pr-10 py-2.5 h-11 text-sm'}
            ${error ? 'border-red-300' : 'border-[#e2ebe2]'}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-[#16a34a]'}
            ${isOpen ? 'ring-2 ring-[#16a34a]/20 border-[#16a34a]' : ''}
            ${className}
          `}
          style={{
            color: value ? '#1a2e1a' : '#9ca3af',
          }}
        >
          <span className="truncate">{getFormattedDisplay() || placeholder}</span>
        </button>

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a2e1a] transition-colors p-1 ${
              size === 'sm' ? 'right-2' : 'right-3.5'
            }`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Calendar Dropdown */}
        {isOpen && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute z-50 mt-1.5 w-72 bg-white border border-[#e2ebe2] rounded-2xl shadow-xl p-4 left-0 sm:left-auto top-full flex flex-col gap-3.5"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Header: Months/Years Navigation */}
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                className="p-1.5 hover:bg-[#f1f5f1] rounded-lg text-[#6b7f6b] hover:text-[#1a2e1a] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1">
                {/* Month Dropdown */}
                <select
                  value={month}
                  onChange={handleMonthChange}
                  className="bg-transparent border-0 font-bold text-sm text-[#1a2e1a] hover:bg-[#f1f5f1] px-1.5 py-1 rounded-lg focus:outline-none cursor-pointer"
                >
                  {MONTH_NAMES.map((name, i) => (
                    <option key={name} value={i}>
                      {name}
                    </option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  value={year}
                  onChange={handleYearChange}
                  className="bg-transparent border-0 font-bold text-sm text-[#1a2e1a] hover:bg-[#f1f5f1] px-1.5 py-1 rounded-lg focus:outline-none cursor-pointer"
                >
                  {yearsOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => navigateMonth(1)}
                className="p-1.5 hover:bg-[#f1f5f1] rounded-lg text-[#6b7f6b] hover:text-[#1a2e1a] transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Days Grid */}
            <div>
              {/* Weekday Labels */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wider mb-2 text-[#6b7f6b]">
                {WEEK_DAYS.map((day) => (
                  <div key={day} className="py-0.5">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day numbers */}
              <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
                {allDays.map((date, index) => {
                  const dayIsSelected = isSelected(date);
                  const dayIsToday = isToday(date);
                  const dayIsCurrentMonth = isCurrentMonth(date);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectDay(date)}
                      className={`
                        py-1.5 w-full rounded-lg font-semibold transition-all duration-150 cursor-pointer
                        ${dayIsSelected ? 'bg-[#16a34a] text-white shadow-sm' : ''}
                        ${!dayIsSelected && dayIsToday ? 'text-[#16a34a] border border-[#16a34a]/30' : ''}
                        ${!dayIsSelected && !dayIsToday && dayIsCurrentMonth ? 'text-[#1a2e1a] hover:bg-[#f1f5f1]' : ''}
                        ${!dayIsSelected && !dayIsCurrentMonth ? 'text-gray-300 hover:bg-[#f8faf8]' : ''}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-[#e2ebe2] pt-2.5 flex items-center justify-between">
              <button
                type="button"
                onClick={handleToday}
                className="text-xs font-bold text-[#16a34a] hover:text-[#15803d] transition-colors cursor-pointer"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-[#6b7f6b] hover:text-[#1a2e1a] transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs mt-0.5 animate-fadeIn" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}
    </div>
  );
}
