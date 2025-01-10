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
    <div className="flex items-center gap-4 p-4">
      <label htmlFor="simulation-date" className="text-gray-700 font-medium">
        Select simulation data:
      </label>
      <select
        id="simulation-date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="px-4 py-2 border rounded-md bg-white min-w-[120px] appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path fill=%22none%22 stroke=%22%23343a40%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22m2 5 6 6 6-6%22/></svg>')] bg-[length:16px_12px] bg-[right_0.5rem_center] bg-no-repeat pr-8"
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