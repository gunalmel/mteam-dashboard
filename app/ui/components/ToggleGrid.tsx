import React, {ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useMemo, useState} from 'react';
import ImageToggle from '@/app/ui/components/ImageToggle';
import {ToggleGridProps} from '@/types';

const toggleHandlerBuilder = (setSelectedItems:Dispatch<SetStateAction<string[]>>) => (selectedItems:string[]) => (selectedItem:string, selected:boolean) => {
  const newSelectedItems = selected ? [...selectedItems, selectedItem] : selectedItems.filter((item) => item !== selectedItem);
  setSelectedItems(newSelectedItems);
};

const toggleAllHandlerBuilder = (setSelectedItems:Dispatch<SetStateAction<string[]>>) => (initialState:string[]) => (e:ChangeEvent<HTMLInputElement>) => {
  if(e.target.checked) {
    setSelectedItems(initialState);
  }else{
    setSelectedItems([]);
  }
};

const ToggleGrid: FC<ToggleGridProps> = ({items, onChange}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const initialState = useMemo(
    () => items.map((item) => item.value),
    [items]
  );

  useEffect(() => {
    setSelectedItems(initialState);
  }, [items]);

  useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems]);

  return (
    <div className='pl-28'>
      <div className='mb-2 text-sm text-gray-700'>
        <hr className='border-t-2 border-green-600 w-6 inline-block my-1' />: Compression Interval
      </div>
      <div className='flex items-center pb-3'>
        <label className='relative cursor-pointer'>
          <input
            type='checkbox'
            className='sr-only peer'
            checked={initialState.every((item) => selectedItems.includes(item))}
            onChange={toggleAllHandlerBuilder(setSelectedItems)(initialState)}
          />
          <div
            className="w-11 h-4 flex items-center bg-gray-300 rounded-md peer-checked:text-blue-700
            text-gray-300 text-xs after:flex after:items-center after:justify-center peer after:content-['']
            peer-checked:after:content-['All'] peer-checked:after:translate-x-4 after:absolute after:left-0
            peer-checked:after:border-gray after:bg-white after:border after:border-gray-300 after:rounded-md after:h-6
            after:w-8 after:transition-all peer-checked:bg-blue-300"></div>
        </label>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {items.map((item) => (
          <ImageToggle
            key={item.value}
            source={item.source}
            value={item.value}
            checked={selectedItems.includes(item.value)}
            onToggle={toggleHandlerBuilder(setSelectedItems)(selectedItems)}
          />
        ))}
      </div>
    </div>
  );
};
export default ToggleGrid;
