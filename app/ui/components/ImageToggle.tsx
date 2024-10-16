import React, {FC} from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import {ImageToggleProps} from '@/types';

const ImageToggle: FC<ImageToggleProps> = ({source, value, checked, onToggle}) => {
  const onChange = () => {
    onToggle(value, !checked);
  };

  return (
    <div className='flex items-center mb-4'>
      <label className='relative inline-flex items-center cursor-pointer select-none'>
        <input type='checkbox' className='peer sr-only' checked={checked} value={value} onChange={onChange} />
        <div
          className={clsx(`h-4 w-11 rounded-md relative peer-focus:ring-blue-300 flex items-center p-1`, {
            [`bg-blue-300`]: checked,
            'bg-gray-200': !checked
          })}>
          <div
            className={clsx(
              'absolute h-6 w-5 rounded-md bg-white shadow-md transition-transform duration-200 ease-in-out',
              {
                'translate-x-full': checked,
                'translate-x-0': !checked
              }
            )}>
            <Image
              height={14}
              width={14}
              src={source}
              alt='On/Off'
              className={clsx('w-full h-full object-contain transition-filter duration-200 ease-in-out', {
                grayscale: !checked
              })}
            />
          </div>
        </div>
        <span className='ml-5 text-sm text-gray-700'>{value}</span>
      </label>
    </div>
  );
};
export default ImageToggle;
