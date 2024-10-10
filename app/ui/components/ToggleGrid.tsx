import React from 'react';
import ImageToggle from '@/app/ui/components/ImageToggle';
import {ToggleGridProps} from '@/types';

const ToggleGrid: React.FC<ToggleGridProps> = ({allItems, selectedItems, onSelectAll, onToggleMarker}) => {
  const allSelected = allItems.every(item => selectedItems.includes(item.group));
  return (
    <div className="pl-28">
      <div className="mb-2 text-sm text-gray-700">
        <hr className="border-t-2 border-green-600 w-6 inline-block my-1" />
        : Compression Interval
      </div>
      <div className="flex items-center pb-3">
        <label className="relative cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={allSelected} onChange={(e) => onSelectAll(e.target.checked)}/>
          <div
            className="w-11 h-4 flex items-center bg-gray-300 rounded-md peer-checked:text-blue-700
            text-gray-300 text-xs after:flex after:items-center after:justify-center peer after:content-['']
            peer-checked:after:content-['All'] peer-checked:after:translate-x-4 after:absolute after:left-0
            peer-checked:after:border-gray after:bg-white after:border after:border-gray-300 after:rounded-md after:h-6
            after:w-8 after:transition-all peer-checked:bg-blue-300">
          </div>
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allItems.map((item) => (
          <ImageToggle
            key={item.group}
            iconUrl={item.url}
            text={item.group}
            isChecked={selectedItems.includes(item.group)}
            onToggle={() => onToggleMarker(item.group)}
          />
        ))}
      </div>
    </div>
  );
};
export default ToggleGrid;
