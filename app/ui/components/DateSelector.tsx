import React from 'react';
import PlotsFileSource from '@/app/utils/plotSourceProvider';

// Get available dates from the simulation dataset
const availableDates = Object.keys(PlotsFileSource);

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4 text-sm">
      <label htmlFor="simulation-date" className="text-gray-700 font-medium">
        Select simulation data:
      </label>
      <select
        id="simulation-date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="border rounded-md cursor-pointer text-xs"
      >
        {availableDates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;
